'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useClockGame } from './hooks/useClockGame';
import { useClockAnimation } from './hooks/useClockAnimation';
import { playConfetti, playCorrectSound, playWrongSound, storage } from './lib/youji-shared';
import { generateClockQuestions, getClockQuestionText } from './lib/youji-question';
import type { ClockLevel, ClockQuestion, ClockAnswer, GameRecord } from './types/clock';
import { CLOCK_LEVELS } from './types/clock';
import styles from './YoujiClock.module.css';

type ViewPhase = 'menu' | 'level' | 'settings' | 'records' | 'game' | 'result';

interface ClockRef {
  ticks: SVGGElement | null;
  nums: SVGGElement | null;
  ticks2: SVGGElement | null;
  nums2: SVGGElement | null;
  ticks3: SVGGElement | null;
  nums3: SVGGElement | null;
  hourHand: SVGLineElement | null;
  minuteHand: SVGLineElement | null;
  hourHand2: SVGLineElement | null;
  minuteHand2: SVGLineElement | null;
  hourHand3: SVGLineElement | null;
  minuteHand3: SVGLineElement | null;
}

export const YoujiClockApp: React.FC = () => {
  const {
    state,
    setLevel,
    setStyle,
    setCount,
    toggleSound,
    startGame,
    recordAnswer,
    nextQuestion,
    inputDigit,
    deleteDigit,
    setInputField,
    resetInput,
    resetToMenu,
  } = useClockGame();

  const { renderClockFace, getClockHands } = useClockAnimation();

  const [phase, setPhase] = useState<ViewPhase>('menu');
  const [records, setRecords] = useState<Record<number, GameRecord>>({});
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [hintVisible, setHintVisible] = useState(false);
  const [resultStars, setResultStars] = useState(0);

  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const resultConfettiRef = useRef<HTMLCanvasElement>(null);
  const clockRefs = useRef<ClockRef>({
    ticks: null,
    nums: null,
    ticks2: null,
    nums2: null,
    ticks3: null,
    nums3: null,
    hourHand: null,
    minuteHand: null,
    hourHand2: null,
    minuteHand2: null,
    hourHand3: null,
    minuteHand3: null,
  });

  // 初期化: 記録を読み込む
  useEffect(() => {
    const saved = storage.getRecords('youji_clock_records');
    setRecords(saved);
  }, []);

  // ゲーム開始
  const handleStartGame = () => {
    const questions = generateClockQuestions(state.level, state.style, state.count);
    startGame(questions);
    setPhase('game');
    resetInput();
    renderClockFace(); // 時計描画を初期化
  };

  // メニューへ
  const handleBackToMenu = () => {
    setPhase('menu');
    resetToMenu();
  };

  // 時計描画
  useEffect(() => {
    if (phase !== 'game') return;

    const face = renderClockFace();
    if (clockRefs.current.ticks) clockRefs.current.ticks.innerHTML = face.ticks;
    if (clockRefs.current.nums) clockRefs.current.nums.innerHTML = face.nums;
    if (clockRefs.current.ticks2) clockRefs.current.ticks2.innerHTML = face.ticks;
    if (clockRefs.current.nums2) clockRefs.current.nums2.innerHTML = face.nums;
    if (clockRefs.current.ticks3) clockRefs.current.ticks3.innerHTML = face.ticks;
    if (clockRefs.current.nums3) clockRefs.current.nums3.innerHTML = face.nums;
  }, [phase, renderClockFace]);

  // 問題に応じた時計表示
  useEffect(() => {
    if (phase !== 'game' || state.questionIndex >= state.questions.length) return;

    const q = state.questions[state.questionIndex];
    let h12 = 0;
    let m = 0;

    if (q.type === 'duration') {
      // 2つの時計を表示
      h12 = q.fromH! % 12;
      m = q.fromM!;
      const { hp: hp2, mp: mp2 } = getClockHands(h12, m);
      if (clockRefs.current.hourHand2) {
        clockRefs.current.hourHand2.setAttribute('x2', String(hp2.x));
        clockRefs.current.hourHand2.setAttribute('y2', String(hp2.y));
      }
      if (clockRefs.current.minuteHand2) {
        clockRefs.current.minuteHand2.setAttribute('x2', String(mp2.x));
        clockRefs.current.minuteHand2.setAttribute('y2', String(mp2.y));
      }

      h12 = q.toH! % 12;
      m = q.toM!;
      const { hp: hp3, mp: mp3 } = getClockHands(h12, m);
      if (clockRefs.current.hourHand3) {
        clockRefs.current.hourHand3.setAttribute('x2', String(hp3.x));
        clockRefs.current.hourHand3.setAttribute('y2', String(hp3.y));
      }
      if (clockRefs.current.minuteHand3) {
        clockRefs.current.minuteHand3.setAttribute('x2', String(mp3.x));
        clockRefs.current.minuteHand3.setAttribute('y2', String(mp3.y));
      }
    } else {
      // 1つの時計を表示
      h12 = (q.h ?? q.fromH ?? 0) % 12;
      m = q.m ?? 0;
      const { hp, mp } = getClockHands(h12, m);
      if (clockRefs.current.hourHand) {
        clockRefs.current.hourHand.setAttribute('x2', String(hp.x));
        clockRefs.current.hourHand.setAttribute('y2', String(hp.y));
      }
      if (clockRefs.current.minuteHand) {
        clockRefs.current.minuteHand.setAttribute('x2', String(mp.x));
        clockRefs.current.minuteHand.setAttribute('y2', String(mp.y));
      }
    }
  }, [phase, state.questionIndex, state.questions, getClockHands]);

  // 回答処理
  const handleAnswer = (value: ClockAnswer) => {
    if (state.answered) return;

    const q = state.questions[state.questionIndex];
    const correct = getCorrectAnswer(q);
    const isCorrect = isAnswerCorrect(value, correct);

    recordAnswer(isCorrect);
    setFeedbackMsg(isCorrect ? '✨ やったね！' : '😢 ざんねん...');
    if (state.sound) {
      if (isCorrect) playCorrectSound();
      else playWrongSound();
    }
  };

  // 次へボタン
  const handleNext = () => {
    if (state.questionIndex >= state.count - 1) {
      showResult();
    } else {
      nextQuestion();
      resetInput();
      setFeedbackMsg('');
      setHintVisible(false);
    }
  };

  // リザルト表示
  const showResult = () => {
    const total = state.count;
    const rate = state.correct / total;
    const stars = rate === 1 ? 3 : rate >= 0.7 ? 2 : 1;
    setResultStars(stars);

    // 記録保存
    const newRecords = { ...records };
    const prev = newRecords[state.level.id] || { bestStars: 0, bestScore: 0 };
    newRecords[state.level.id] = {
      bestStars: Math.max(prev.bestStars, stars),
      bestScore: Math.max(prev.bestScore, state.score),
      date: new Date().toLocaleDateString('ja-JP'),
    };
    setRecords(newRecords);
    storage.setRecords('youji_clock_records', newRecords);

    if (stars === 3 && resultConfettiRef.current) {
      playConfetti(resultConfettiRef.current);
    }

    setPhase('result');
  };

  // 正解の取得
  const getCorrectAnswer = (q: ClockQuestion): ClockAnswer => {
    if (q.type === 'duration') return { h: Math.floor(q.durationMin! / 60), m: q.durationMin! % 60 };
    if (q.type === 'after') return { h: q.ansH, m: q.ansM };
    if (q.type === 'before') return { h: q.ansH, m: q.ansM };
    if (q.type === 'ampm') return { ampm: q.h! < 12 ? 'ごぜん' : 'ごご' };
    return { h: q.h, m: q.m };
  };

  // 回答確認
  const isAnswerCorrect = (value: ClockAnswer, correct: ClockAnswer): boolean => {
    if (correct.ampm) return value.ampm === correct.ampm;
    return value.h === correct.h && value.m === correct.m;
  };

  // 選択肢生成
  const generateChoices = (q: ClockQuestion, correct: ClockAnswer): ClockAnswer[] => {
    if (q.type === 'ampm') {
      return [{ ampm: 'ごぜん' }, { ampm: 'ごご' }];
    }

    const pool = new Set<string>();
    const toKey = (v: ClockAnswer) => `${v.h}-${v.m}`;
    pool.add(toKey(correct));
    const choices: ClockAnswer[] = [correct];

    while (choices.length < 4) {
      const dh = ((correct.h ?? 0) + [-1, 0, 0, 1][Math.floor(Math.random() * 4)] - 1 + 12) % 12 + 1;
      const dm = ((correct.m ?? 0) + [-10, -5, 5, 10][Math.floor(Math.random() * 4)] + 60) % 60;
      const v = { h: dh, m: dm };
      const k = toKey(v);
      if (!pool.has(k)) {
        pool.add(k);
        choices.push(v);
      }
    }

    return choices.sort(() => Math.random() - 0.5);
  };

  const formatAnswer = (v: ClockAnswer, q: ClockQuestion): string => {
    if (v.ampm) return v.ampm;
    if (q.type === 'duration') {
      if (v.h === 0) return `${v.m}ふん`;
      if (v.m === 0) return `${v.h}じかん`;
      return `${v.h}じかん ${v.m}ふん`;
    }
    return `${v.h}じ ${v.m === 0 ? 'ちょうど' : v.m + 'ふん'}`;
  };

  const getHint = (q: ClockQuestion): string => {
    const hints: Record<string, string> = {
      read: '長い針が「ふん」、短い針が「じ」を指しています。',
      ampm: 'ひるの12じより前はごぜん、後はごごです。',
      after: '分針を足して60を超えたら、時針も1つ進みます。',
      before: '分針を引いて0より小さくなったら、時針も1つ戻ります。',
      duration: '2つの時計の間の時間を計算しましょう。',
    };
    return hints[q.type] || '時計の針をよく見てね！';
  };

  // ===== VIEWS =====

  if (phase === 'menu') {
    return (
      <div className={styles.container}>
        <div className={styles.menuView}>
          <div className={styles.mascot}>🦉</div>
          <h1 className={styles.title}>🕐 とけいを<br />よもう！</h1>
          <div className={styles.speechBubble}>じかんを おぼえよう！🦉</div>
          <button className={styles.btnPrimary} onClick={() => setPhase('settings')}>
            ▶ はじめる！
          </button>
          <button className={styles.btnSecondary} onClick={() => setPhase('records')}>
            🏆 きろく
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'records') {
    return (
      <div className={styles.container}>
        <div className={styles.recordsView}>
          <h2 className={styles.heading}>🏆 きろく</h2>
          <div className={styles.recordsList}>
            {Object.keys(records).length === 0 ? (
              <p className={styles.noRecords}>まだ きろくがありません</p>
            ) : (
              CLOCK_LEVELS.map((lv) => {
                const rec = records[lv.id];
                if (!rec) return null;
                return (
                  <div key={lv.id} className={styles.recordRow}>
                    <div>
                      <div className={styles.recordLvName}>Lv{lv.id} {lv.name}</div>
                      <div className={styles.recordDetail}>{rec.date}｜{rec.bestScore}てん</div>
                    </div>
                    <div className={styles.recordStars}>{'⭐'.repeat(rec.bestStars)}</div>
                  </div>
                );
              })
            )}
          </div>
          <button className={styles.btnSecondary} onClick={() => setPhase('menu')}>
            もどる
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'settings') {
    return (
      <div className={styles.container}>
        <div className={styles.settingsView}>
          <h2 className={styles.heading}>🎯 レベル・せってい</h2>

          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>レベルをえらんでね</label>
            <div className={styles.levelList}>
              {CLOCK_LEVELS.map((lv) => {
                const rec = records[lv.id] || {};
                const stars = rec.bestStars ? '⭐'.repeat(rec.bestStars) : '－';
                return (
                  <button
                    key={lv.id}
                    className={`${styles.levelBtn} ${state.level.id === lv.id ? styles.selected : ''}`}
                    onClick={() => setLevel(lv)}
                  >
                    <span className={styles.lvNum}>Lv{lv.id}</span>
                    <span>
                      <div className={styles.lvName}>{lv.name}</div>
                      <div className={styles.lvDesc}>{lv.desc}</div>
                    </span>
                    <span className={styles.levelStars}>{stars}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>もんだいのスタイル</label>
            <div className={styles.radioGroup}>
              {(['choice', 'input', 'mixed'] as const).map((style) => (
                <label key={style} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="style"
                    value={style}
                    checked={state.style === style}
                    onChange={(e) => setStyle(e.target.value as any)}
                  />
                  {style === 'choice' && '4たく'}
                  {style === 'input' && 'じぶんでいれる'}
                  {style === 'mixed' && 'まぜまぜ'}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>もんだいすう</label>
            <div className={styles.countGroup}>
              {[5, 7, 10].map((n) => (
                <button
                  key={n}
                  className={`${styles.btnCount} ${state.count === n ? styles.active : ''}`}
                  onClick={() => setCount(n)}
                >
                  {n}もん
                </button>
              ))}
            </div>
          </div>

          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>おと</label>
            <button className={styles.btnToggle} onClick={toggleSound}>
              {state.sound ? 'ON' : 'OFF'}
            </button>
          </div>

          <button className={styles.btnPrimary} onClick={handleStartGame}>
            ▶ スタート！
          </button>
          <button className={styles.btnSecondary} onClick={() => setPhase('menu')}>
            もどる
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'game' && state.questionIndex < state.questions.length) {
    const q = state.questions[state.questionIndex];
    const correct = getCorrectAnswer(q);
    const choices = generateChoices(q, correct);
    const isDualClock = q.type === 'duration';

    return (
      <div className={styles.container}>
        <div className={styles.gameView}>
          <div className={styles.gameHeader}>
            <span className={styles.counter}>
              {state.questionIndex + 1} / {state.count}
            </span>
            {state.combo >= 2 && <span className={styles.comboBadge}>🔥 {state.combo}コンボ</span>}
            <span className={styles.scoreBadge}>⭐ {state.score}</span>
          </div>

          <div className={styles.levelIndicator}>Lv{state.level.id}「{state.level.name}」</div>

          <div className={styles.questionText}>{getClockQuestionText(q)}</div>

          {isDualClock ? (
            <div className={styles.clockContainer2}>
              <div className={styles.clockLabel}>しゅっぱつ</div>
              <svg viewBox="0 0 200 200" width="140" height="140" className={styles.clockSvg}>
                <circle cx="100" cy="100" r="96" fill="white" stroke="#2c3e50" strokeWidth="4" />
                <circle cx="100" cy="100" r="90" fill="#fefefe" stroke="#bdc3c7" strokeWidth="1" />
                <g ref={(el) => (clockRefs.current.ticks2 = el)} />
                <g ref={(el) => (clockRefs.current.nums2 = el)} />
                <line
                  ref={(el) => (clockRefs.current.hourHand2 = el)}
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="55"
                  stroke="#2c3e50"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <line
                  ref={(el) => (clockRefs.current.minuteHand2 = el)}
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="30"
                  stroke="#e74c3c"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="100" r="6" fill="#2c3e50" />
                <circle cx="100" cy="100" r="3" fill="white" />
              </svg>
              <div className={styles.clockArrow}>→</div>
              <div className={styles.clockLabel}>とうちゃく</div>
              <svg viewBox="0 0 200 200" width="140" height="140" className={styles.clockSvg}>
                <circle cx="100" cy="100" r="96" fill="white" stroke="#2c3e50" strokeWidth="4" />
                <circle cx="100" cy="100" r="90" fill="#fefefe" stroke="#bdc3c7" strokeWidth="1" />
                <g ref={(el) => (clockRefs.current.ticks3 = el)} />
                <g ref={(el) => (clockRefs.current.nums3 = el)} />
                <line
                  ref={(el) => (clockRefs.current.hourHand3 = el)}
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="55"
                  stroke="#2c3e50"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <line
                  ref={(el) => (clockRefs.current.minuteHand3 = el)}
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="30"
                  stroke="#e74c3c"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="100" r="6" fill="#2c3e50" />
                <circle cx="100" cy="100" r="3" fill="white" />
              </svg>
            </div>
          ) : (
            <div className={styles.clockContainerSingle}>
              <svg viewBox="0 0 200 200" width="180" height="180" className={styles.clockSvg}>
                <circle cx="100" cy="100" r="96" fill="white" stroke="#2c3e50" strokeWidth="4" />
                <circle cx="100" cy="100" r="90" fill="#fefefe" stroke="#bdc3c7" strokeWidth="1" />
                <g ref={(el) => (clockRefs.current.ticks = el)} />
                <g ref={(el) => (clockRefs.current.nums = el)} />
                <line
                  ref={(el) => (clockRefs.current.hourHand = el)}
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="55"
                  stroke="#2c3e50"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <line
                  ref={(el) => (clockRefs.current.minuteHand = el)}
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="30"
                  stroke="#e74c3c"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="100" r="6" fill="#2c3e50" />
                <circle cx="100" cy="100" r="3" fill="white" />
              </svg>
            </div>
          )}

          {state.level.id > 2 && (
            <div className={styles.hintArea}>
              <button className={styles.btnHint} onClick={() => setHintVisible(!hintVisible)}>
                💡 ヒント
              </button>
              {hintVisible && <div className={styles.hintText}>{getHint(q)}</div>}
            </div>
          )}

          {q.qStyle === 'choice' ? (
            <div className={styles.choicesArea}>
              {choices.map((choice, idx) => (
                <button
                  key={idx}
                  className={styles.btnChoice}
                  onClick={() => handleAnswer(choice)}
                  disabled={state.answered}
                >
                  {formatAnswer(choice, q)}
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.inputArea}>
              <div className={styles.timeInputRow}>
                <div className={styles.timeInputBox}>
                  <div className={styles.timeInputLabel}>じ</div>
                  <div
                    className={`${styles.timeInputVal} ${state.inputField === 'hour' ? styles.activeField : ''}`}
                    onClick={() => setInputField('hour')}
                  >
                    {state.inputHour || '__'}
                  </div>
                </div>
                <div className={styles.timeInputSep}>：</div>
                <div className={styles.timeInputBox}>
                  <div className={styles.timeInputLabel}>ふん</div>
                  <div
                    className={`${styles.timeInputVal} ${state.inputField === 'min' ? styles.activeField : ''}`}
                    onClick={() => setInputField('min')}
                  >
                    {state.inputMin || '__'}
                  </div>
                </div>
              </div>

              {q.type === 'duration' && (
                <div className={styles.timeInputRow}>
                  <div className={styles.timeInputBox}>
                    <div className={styles.timeInputLabel}>じかん</div>
                    <div
                      className={`${styles.timeInputVal} ${state.inputField === 'dhour' ? styles.activeField : ''}`}
                      onClick={() => setInputField('dhour')}
                    >
                      {state.inputDHour || '__'}
                    </div>
                  </div>
                  <div className={styles.timeInputSep}>じかん</div>
                  <div className={styles.timeInputBox}>
                    <div className={styles.timeInputLabel}>ふん</div>
                    <div
                      className={`${styles.timeInputVal} ${state.inputField === 'dmin' ? styles.activeField : ''}`}
                      onClick={() => setInputField('dmin')}
                    >
                      {state.inputDMin || '__'}
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.numpad}>
                {['7', '8', '9', '4', '5', '6', '1', '2', '3'].map((digit) => (
                  <button
                    key={digit}
                    className={styles.numpadBtn}
                    onClick={() => inputDigit(state.inputField, digit)}
                  >
                    {digit}
                  </button>
                ))}
                <button className={styles.numpadBtn} onClick={() => deleteDigit(state.inputField)}>
                  ⌫
                </button>
              </div>

              <button
                className={styles.btnNumpadOk}
                onClick={() => {
                  const value =
                    state.inputField === 'dhour' || state.inputField === 'dmin'
                      ? { h: parseInt(state.inputDHour), m: parseInt(state.inputDMin || '0') }
                      : { h: parseInt(state.inputHour), m: parseInt(state.inputMin || '0') };
                  handleAnswer(value);
                }}
              >
                OK
              </button>
            </div>
          )}

          {feedbackMsg && <div className={styles.feedback}>{feedbackMsg}</div>}

          {state.answered && (
            <button className={styles.btnPrimary} onClick={handleNext}>
              {state.questionIndex >= state.count - 1 ? 'けっかをみる！🎉' : 'つぎへ →'}
            </button>
          )}

          <canvas ref={confettiCanvasRef} className={styles.confetti} />
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const total = state.count;
    const rate = state.correct / total;

    return (
      <div className={styles.container}>
        <div className={styles.resultView}>
          <canvas ref={resultConfettiRef} className={styles.resultConfetti} />
          <div className={styles.mascot}>🦉</div>
          <div className={styles.resultTitle}>
            {resultStars === 3 ? 'すごい！✨' : resultStars === 2 ? 'よくできました！' : 'もう少し！'}  
          </div>
          <div className={styles.resultScoreCard}>
            <div className={styles.resultScoreLabel}>せいかいすう</div>
            <div className={styles.resultScoreDisplay}>
              <span className={styles.resultBigNum}>{state.correct}</span>
              <span className={styles.resultDivider}> / </span>
              <span className={styles.resultTotalNum}>{total}</span>
            </div>
            <div className={styles.resultStarsRow}>
              {'⭐'.repeat(resultStars)}{'☆'.repeat(3 - resultStars)}
            </div>
            <div className={styles.resultScoreLabel}>とくてん</div>
            <div className={styles.resultPointNum}>{state.score} てん</div>
          </div>
          <button className={styles.btnPrimary} onClick={handleStartGame}>
            🔄 もういちど！
          </button>
          <button className={styles.btnSecondary} onClick={handleBackToMenu}>
            🏠 メニューへ
          </button>
        </div>
      </div>
    );
  }

  return null;
};
