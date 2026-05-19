'use strict';

/* ============================================================
   ひらがな どっちかな？  app.js
   にたもじ・まちがえやすいひらがなを練習するアプリ
   ============================================================ */

const quizData = [
    /* ── おう vs おお（長音） ── */
    { correct: "おうえん",    wrong: "おおえん",    speech: "おうえん、どっちかな？" },
    { correct: "おとうさん",  wrong: "おとおさん",  speech: "おとうさん、どっちかな？" },
    { correct: "おとうと",    wrong: "おとおと",    speech: "おとうと（弟）、どっちかな？" },
    { correct: "こうえん",    wrong: "こおえん",    speech: "こうえん（公園）、どっちかな？" },
    { correct: "とうふ",      wrong: "とおふ",      speech: "とうふ、どっちかな？" },
    { correct: "どうぶつ",    wrong: "どおぶつ",    speech: "どうぶつ（動物）、どっちかな？" },
    { correct: "こうもり",    wrong: "こおもり",    speech: "こうもり、どっちかな？" },
    { correct: "もうふ",      wrong: "もおふ",      speech: "もうふ（毛布）、どっちかな？" },
    { correct: "ろうそく",    wrong: "ろおそく",    speech: "ろうそく、どっちかな？" },
    { correct: "ほうき",      wrong: "ほおき",      speech: "ほうき、どっちかな？" },
    { correct: "ほうれんそう",wrong: "ほおれんそう",speech: "ほうれんそう、どっちかな？" },
    { correct: "りょうり",    wrong: "りょおり",    speech: "りょうり（料理）、どっちかな？" },
    { correct: "おうさま",    wrong: "おおさま",    speech: "おうさま（王様）、どっちかな？" },
    { correct: "こうちょう",  wrong: "こおちょう",  speech: "こうちょう（校長）、どっちかな？" },
    { correct: "どうぞ",      wrong: "どおぞ",      speech: "どうぞ、どっちかな？" },
    { correct: "どうも",      wrong: "どおも",      speech: "どうも、どっちかな？" },
    { correct: "とうもろこし",wrong: "とおもろこし",speech: "とうもろこし、どっちかな？" },
    { correct: "もうすぐ",    wrong: "もおすぐ",    speech: "もうすぐ、どっちかな？" },
    { correct: "こうこう",    wrong: "こおこお",    speech: "こうこう（高校）、どっちかな？" },
    { correct: "どうろ",      wrong: "どおろ",      speech: "どうろ（道路）、どっちかな？" },

    /* ── おお vs おう（おおが正解の語） ── */
    { correct: "おおきい",    wrong: "おうきい",    speech: "おおきい（大きい）、どっちかな？" },
    { correct: "おおかみ",    wrong: "おうかみ",    speech: "おおかみ（狼）、どっちかな？" },
    { correct: "おおい",      wrong: "おうい",      speech: "おおい（多い）、どっちかな？" },
    { correct: "とおい",      wrong: "とうい",      speech: "とおい（遠い）、どっちかな？" },
    { correct: "とおる",      wrong: "とうる",      speech: "とおる（通る）、どっちかな？" },
    { correct: "おおぞら",    wrong: "おうぞら",    speech: "おおぞら（大空）、どっちかな？" },
    { correct: "こおり",      wrong: "こうり",      speech: "こおり（氷）、どっちかな？" },
    { correct: "とおく",      wrong: "とうく",      speech: "とおく（遠く）、どっちかな？" },
    { correct: "おおや",      wrong: "おうや",      speech: "おおや（大家）、どっちかな？" },
    { correct: "とおか",      wrong: "とうか",      speech: "とおか（十日）、どっちかな？" },

    /* ── えい vs ええ（長音） ── */
    { correct: "えいが",      wrong: "ええが",      speech: "えいが（映画）、どっちかな？" },
    { correct: "えいご",      wrong: "ええご",      speech: "えいご（英語）、どっちかな？" },
    { correct: "えいきょう",  wrong: "ええきょう",  speech: "えいきょう（影響）、どっちかな？" },
    { correct: "せんせい",    wrong: "せんせえ",    speech: "せんせい（先生）、どっちかな？" },
    { correct: "おねえさん",  wrong: "おねいさん",  speech: "おねえさん、どっちかな？" },
    { correct: "けいさん",    wrong: "けえさん",    speech: "けいさん（計算）、どっちかな？" },
    { correct: "めいわく",    wrong: "めえわく",    speech: "めいわく（迷惑）、どっちかな？" },
    { correct: "とけい",      wrong: "とけえ",      speech: "とけい（時計）、どっちかな？" },
    { correct: "えいゆう",    wrong: "ええゆう",    speech: "えいゆう（英雄）、どっちかな？" },
    { correct: "おおぜい",    wrong: "おおぜえ",    speech: "おおぜい（大勢）、どっちかな？" },

    /* ── ず vs づ ── */
    { correct: "つづく",      wrong: "つずく",      speech: "つづく（続く）、どっちかな？" },
    { correct: "こづかい",    wrong: "こずかい",    speech: "こづかい（小遣い）、どっちかな？" },
    { correct: "かたづける",  wrong: "かたずける",  speech: "かたづける（片付ける）、どっちかな？" },
    { correct: "つづき",      wrong: "つずき",      speech: "つづき（続き）、どっちかな？" },
    { correct: "ちかづく",    wrong: "ちかずく",    speech: "ちかづく（近づく）、どっちかな？" },
    { correct: "こづつみ",    wrong: "こずつみ",    speech: "こづつみ（小包）、どっちかな？" },
    { correct: "てつづき",    wrong: "てつずき",    speech: "てつづき（手続き）、どっちかな？" },
    { correct: "みずうみ",    wrong: "みづうみ",    speech: "みずうみ（湖）、どっちかな？" },
    { correct: "かたづけ",    wrong: "かたずけ",    speech: "かたづけ（片付け）、どっちかな？" },
    { correct: "みちづれ",    wrong: "みちずれ",    speech: "みちづれ（道連れ）、どっちかな？" },

    /* ── じ vs ぢ ── */
    { correct: "はなぢ",      wrong: "はなじ",      speech: "はなぢ（鼻血）、どっちかな？" },
    { correct: "ちぢむ",      wrong: "ちじむ",      speech: "ちぢむ（縮む）、どっちかな？" },
    { correct: "こぢんまり",  wrong: "こじんまり",  speech: "こぢんまり、どっちかな？" },
    { correct: "ちぢれる",    wrong: "ちじれる",    speech: "ちぢれる（縮れる）、どっちかな？" },
    { correct: "ちかぢか",    wrong: "ちかじか",    speech: "ちかぢか（近々）、どっちかな？" },

    /* ── 促音（っ）あり vs なし ── */
    { correct: "きって",      wrong: "きて",        speech: "きって（切手）、どっちかな？" },
    { correct: "きっぷ",      wrong: "きぷ",        speech: "きっぷ（切符）、どっちかな？" },
    { correct: "いっぱい",    wrong: "いぱい",      speech: "いっぱい、どっちかな？" },
    { correct: "ざっし",      wrong: "ざし",        speech: "ざっし（雑誌）、どっちかな？" },
    { correct: "ちょっと",    wrong: "ちょと",      speech: "ちょっと、どっちかな？" },
    { correct: "もっと",      wrong: "もと",        speech: "もっと、どっちかな？" },
    { correct: "ずっと",      wrong: "ずと",        speech: "ずっと、どっちかな？" },
    { correct: "きっと",      wrong: "きと",        speech: "きっと、どっちかな？" },
    { correct: "はっきり",    wrong: "はきり",      speech: "はっきり、どっちかな？" },
    { correct: "やっぱり",    wrong: "やぱり",      speech: "やっぱり、どっちかな？" },
    { correct: "いっしょ",    wrong: "いしょ",      speech: "いっしょ（一緒）、どっちかな？" },
    { correct: "まっすぐ",    wrong: "ますぐ",      speech: "まっすぐ、どっちかな？" },
    { correct: "べっそう",    wrong: "べそう",      speech: "べっそう（別荘）、どっちかな？" },
    { correct: "けっして",    wrong: "けして",      speech: "けっして（決して）、どっちかな？" },
    { correct: "はっぱ",      wrong: "はぱ",        speech: "はっぱ（葉っぱ）、どっちかな？" },
    { correct: "ろっぽんぎ",  wrong: "ろぽんぎ",    speech: "ろっぽんぎ（六本木）、どっちかな？" },
    { correct: "さっか",      wrong: "さか",        speech: "さっか（作家）、どっちかな？" },
    { correct: "ほっかいどう",wrong: "ほかいどう",  speech: "ほっかいどう（北海道）、どっちかな？" },
    { correct: "まって",      wrong: "まて",        speech: "まって（待って）、どっちかな？" },
    { correct: "いって",      wrong: "いて",        speech: "いって（行って）、どっちかな？" },

    /* ── 拗音（小さいゃゅょ）vs 大文字（やゆよ） ── */
    { correct: "しゃかい",    wrong: "しやかい",    speech: "しゃかい（社会）、どっちかな？" },
    { correct: "じゅぎょう",  wrong: "じゆぎょう",  speech: "じゅぎょう（授業）、どっちかな？" },
    { correct: "きょうしつ",  wrong: "きよしつ",    speech: "きょうしつ（教室）、どっちかな？" },
    { correct: "ちょうちょ",  wrong: "ちよちよ",    speech: "ちょうちょ（蝶々）、どっちかな？" },
    { correct: "りょこう",    wrong: "りよこう",    speech: "りょこう（旅行）、どっちかな？" },
    { correct: "びょういん",  wrong: "びよういん",  speech: "びょういん（病院）、どっちかな？" },
    { correct: "にゅうがく",  wrong: "にゆうがく",  speech: "にゅうがく（入学）、どっちかな？" },
    { correct: "しゅくだい",  wrong: "しゆくだい",  speech: "しゅくだい（宿題）、どっちかな？" },
    { correct: "きゃく",      wrong: "きやく",      speech: "きゃく（客）、どっちかな？" },
    { correct: "ぎゅうにゅう",wrong: "ぎゆうにゆう",speech: "ぎゅうにゅう（牛乳）、どっちかな？" },
    { correct: "しょうがく",  wrong: "しよがく",    speech: "しょうがく（小学）、どっちかな？" },
    { correct: "ちゅうがく",  wrong: "ちゆうがく",  speech: "ちゅうがく（中学）、どっちかな？" },
    { correct: "きゅうしょく",wrong: "きゆうしよく",speech: "きゅうしょく（給食）、どっちかな？" },
    { correct: "じゃんけん",  wrong: "じやんけん",  speech: "じゃんけん、どっちかな？" },
    { correct: "おちゃ",      wrong: "おちや",      speech: "おちゃ（お茶）、どっちかな？" },

    /* ── は（助詞）vs わ ── */
    { correct: "わたしは",    wrong: "わたしわ",    speech: "わたしは（わたしは〜）、どっちかな？" },
    { correct: "きょうは",    wrong: "きょうわ",    speech: "きょうは（今日は）、どっちかな？" },
    { correct: "ともだちは",  wrong: "ともだちわ",  speech: "ともだちは（友達は）、どっちかな？" },

    /* ── へ（助詞）vs え ── */
    { correct: "がっこうへ",  wrong: "がっこうえ",  speech: "がっこうへ（学校へ）、どっちかな？" },
    { correct: "うちへ",      wrong: "うちえ",      speech: "うちへ（家へ）、どっちかな？" },

    /* ── を（助詞）vs お ── */
    { correct: "ほんを",      wrong: "ほんお",      speech: "ほんを（本を）、どっちかな？" },
    { correct: "みずを",      wrong: "みずお",      speech: "みずを（水を）、どっちかな？" },

    /* ── おかあさん / おにいさん型（長音 あ行） ── */
    { correct: "おかあさん",  wrong: "おかーさん",  speech: "おかあさん、どっちかな？" },
    { correct: "おにいさん",  wrong: "おにーさん",  speech: "おにいさん、どっちかな？" },
    { correct: "おじいさん",  wrong: "おじーさん",  speech: "おじいさん、どっちかな？" },
    { correct: "おばあさん",  wrong: "おばーさん",  speech: "おばあさん、どっちかな？" },
];

/* ============================================================
   APP STATE
   ============================================================ */
const no5App = {
    settings: { sound: false, count: 5 },
    state: { current: 0, roundCorrect: 0, roundResults: [], questionList: [] },

    init() {
        this.loadSettings();
        this.updateSettingsUI();
    },

    loadSettings() {
        try {
            const s = JSON.parse(localStorage.getItem('no5Settings') || '{}');
            if (s.sound !== undefined) this.settings.sound = s.sound;
            if (s.count) this.settings.count = s.count;
        } catch(e) {}
        const hs = localStorage.getItem('no5HighScore') || 0;
        const el = document.getElementById('high-score');
        if (el) el.textContent = `${hs} もん`;
    },

    saveSettings() {
        try { localStorage.setItem('no5Settings', JSON.stringify(this.settings)); } catch(e) {}
    },

    updateSettingsUI() {
        const toggle = document.getElementById('sound-toggle');
        if (toggle) toggle.checked = this.settings.sound;
    },

    setCount(n) {
        this.settings.count = n;
        [5, 7, 10].forEach(c => {
            const btn = document.getElementById(`cnt-${c}`);
            if (btn) btn.classList.toggle('active', n === c);
        });
        this.saveSettings();
    },

    toggleSound() {
        this.settings.sound = document.getElementById('sound-toggle').checked;
        this.saveSettings();
    },

    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });
        const el = document.getElementById(id);
        if (el) { el.classList.remove('hidden'); el.classList.add('active'); }
        if (id === 'records-screen') this.renderRecords();
    },

    speak(text) {
        if (!this.settings.sound || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'ja-JP'; u.rate = 0.8; u.pitch = 1.2;
        const v = typeof SpeechUtil !== 'undefined' ? SpeechUtil.getVoice() : null;
        if (v) u.voice = v;
        window.speechSynthesis.speak(u);
    },

    /* ── ゲーム開始 ── */
    startGame() {
        const shuffled = [...quizData].sort(() => Math.random() - 0.5);
        this.state.questionList = shuffled.slice(0, this.settings.count);
        this.state.current = 0;
        this.state.roundCorrect = 0;
        this.state.roundResults = [];
        this.saveSettings();
        this.showScreen('quiz-screen');
        const nb = document.getElementById('nextBtn');
        if (nb) nb.style.display = 'none';
        this.loadQuestion();
    },

    quitGame() {
        this.showScreen('menu-screen');
    },

    loadQuestion() {
        const q = this.state.questionList[this.state.current];
        const total = this.settings.count;
        const idx = this.state.current + 1;

        document.getElementById('question-counter').textContent = `${idx} / ${total}`;
        document.getElementById('score-display').textContent = `⭐ ${this.state.roundCorrect}`;
        document.getElementById('question-text').textContent = 'どっちかな？';
        document.getElementById('feedback-msg').textContent = '';
        document.getElementById('char-emoji').textContent = '🐶';
        document.getElementById('char-msg').textContent = 'がんばれ！';

        const fill = document.getElementById('progress-fill');
        if (fill) fill.style.width = ((this.state.current / total) * 100) + '%';

        const choices = [q.correct, q.wrong].sort(() => Math.random() - 0.5);
        const b1 = document.getElementById('choice1');
        const b2 = document.getElementById('choice2');
        b1.textContent = choices[0]; b2.textContent = choices[1];
        b1.className = b2.className = 'btn choice-btn';
        b1.disabled = b2.disabled = false;

        setTimeout(() => this.speak(q.speech), 200);
    },

    speakCurrent() {
        const q = this.state.questionList[this.state.current];
        if (q) this.speak(q.speech);
    },

    checkAnswer(n) {
        const q = this.state.questionList[this.state.current];
        const btn = document.getElementById('choice' + n);
        const isCorrect = btn.textContent === q.correct;
        document.getElementById('choice1').disabled = document.getElementById('choice2').disabled = true;

        if (isCorrect) {
            btn.classList.add('correct-anim');
            this.state.roundCorrect++;
            this.state.roundResults.push(true);
            document.getElementById('feedback-msg').textContent = '⭕ せいかい！';
            document.getElementById('char-emoji').textContent = '😄';
            document.getElementById('char-msg').textContent = 'すごい！';
            this.speak('せいかい！');
            this.fireConfetti(false);
        } else {
            btn.classList.add('wrong-anim');
            // 正解ボタンを緑にする
            ['choice1','choice2'].forEach(id => {
                const b = document.getElementById(id);
                if (b.textContent === q.correct) b.classList.add('correct-anim');
            });
            this.state.roundResults.push(false);
            document.getElementById('feedback-msg').textContent = `✖ こたえは「${q.correct}」だよ！`;
            document.getElementById('char-emoji').textContent = '🐱';
            document.getElementById('char-msg').textContent = 'おしい！';
            this.speak(`こたえは「${q.correct}」だよ！`);
        }

        const fill = document.getElementById('progress-fill');
        if (fill) fill.style.width = (((this.state.current + 1) / this.settings.count) * 100) + '%';

        setTimeout(() => { document.getElementById('nextBtn').style.display = 'block'; }, 600);
    },

    goNext() {
        document.getElementById('nextBtn').style.display = 'none';
        this.state.current++;
        if (this.state.current >= this.settings.count) {
            this.showResult();
        } else {
            this.loadQuestion();
        }
    },

    goSetup() {
        [5, 7, 10].forEach(n => {
            const b = document.getElementById(`setup-cnt-${n}`);
            if (b) b.classList.toggle('active', this.settings.count === n);
        });
        this.showScreen('count-setup-screen');
    },

    setupSelectCount(n) {
        this.settings.count = n;
        [5, 7, 10].forEach(c => {
            const b = document.getElementById(`setup-cnt-${c}`);
            if (b) b.classList.toggle('active', c === n);
        });
    },

    showResult() {
        const correct = this.state.roundCorrect;
        const total = this.settings.count;
        const pct = correct / total;
        let title = pct === 1 ? '💯 かんぺき！！！' : pct >= 0.8 ? '✨ すごい！！' : pct >= 0.5 ? '👍 よくできました！' : '😊 れんしゅうしよう！';
        let neko = pct >= 0.5 ? '🐶' : '🐱';

        // ハイスコア更新
        const hs = parseInt(localStorage.getItem('no5HighScore') || 0);
        if (correct > hs) localStorage.setItem('no5HighScore', correct);

        // シール追加
        if (pct >= 0.8) {
            const st = parseInt(localStorage.getItem('no5Stickers') || 0) + 1;
            localStorage.setItem('no5Stickers', st);
        }

        document.getElementById('result-neko').textContent = neko;
        document.getElementById('result-title').textContent = title;
        document.getElementById('res-correct').textContent = correct;
        document.getElementById('res-total').textContent = total;

        const stars = Math.round(pct * 3);
        document.getElementById('res-stars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

        const badges = document.getElementById('res-badges');
        badges.innerHTML = this.state.roundResults
            .map(r => `<span class="res-badge ${r ? 'res-ok' : 'res-ng'}">${r ? '✓' : '✗'}</span>`).join('');

        this.speak(title + (pct >= 0.8 ? 'おめでとう！' : 'またれんしゅうしてね！'));
        if (pct >= 0.8) this.fireConfetti(true);
        this.showScreen('result-screen');
    },

    renderRecords() {
        const hs = localStorage.getItem('no5HighScore') || 0;
        document.getElementById('high-score').textContent = `${hs} もん`;
        document.getElementById('trophy-icon').textContent = hs >= 10 ? '🏆' : hs >= 7 ? '🥈' : '🥉';
        const container = document.getElementById('sticker-collection');
        container.innerHTML = '';
        for (let i = 0; i < (parseInt(localStorage.getItem('no5Stickers')) || 0); i++) {
            const d = document.createElement('div');
            d.className = 'sticker'; d.textContent = '🌟';
            container.appendChild(d);
        }
    },

    fireConfetti(big) {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        const n = big ? 100 : 40;
        let particles = [];
        for (let i = 0; i < n; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 8;
            particles.push({
                x: canvas.width / 2, y: canvas.height / 3,
                vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 4,
                r: Math.random() * 6 + 3, vy0: 0, dy: 0.25,
                color: ['#FF6B9D','#FFD700','#4ECDC4','#A855F7','#FF8C42','#5B8DEF'][Math.floor(Math.random() * 6)],
                alpha: 1, shape: Math.random() < 0.5 ? 'rect' : 'circle'
            });
        }
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy; p.vy += p.dy; p.vx *= 0.99; p.alpha -= 0.014;
                if (p.alpha > 0) {
                    active = true;
                    ctx.save(); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color;
                    ctx.translate(p.x, p.y);
                    if (p.shape === 'rect') ctx.fillRect(-p.r, -p.r/2, p.r*2, p.r);
                    else { ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI*2); ctx.fill(); }
                    ctx.restore();
                }
            });
            if (active) requestAnimationFrame(animate);
            else ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
        animate();
    },
};

window.onload = () => no5App.init();
