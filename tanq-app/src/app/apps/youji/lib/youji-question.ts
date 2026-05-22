/**
 * Question Generation Utilities for Youji Apps
 * 
 * 時計アプリの問題生成ロジック
 */

import type { ClockQuestion, ClockLevel, QuestionStyle } from '../types/clock';

const rand = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const randStep = (step: number) => {
  const slots = 60 / step;
  return Math.floor(Math.random() * slots) * step;
};

export const generateClockQuestions = (
  level: ClockLevel,
  style: QuestionStyle,
  count: number,
): ClockQuestion[] => {
  const questions: ClockQuestion[] = [];
  for (let i = 0; i < count; i++) {
    questions.push(makeClockQuestion(level, style));
  }
  return questions;
};

const makeClockQuestion = (level: ClockLevel, style: QuestionStyle): ClockQuestion => {
  let qStyle = style;
  if (style === 'mixed') {
    qStyle = Math.random() < 0.5 ? 'choice' : 'input';
  }

  const step = level.minStep;

  if (level.type === 'duration') {
    const fromH = rand(7, 17);
    const fromM = randStep(step);
    const durationMin = randStep(step === 1 ? 1 : 5) + step;
    const toM = (fromM + durationMin) % 60;
    const toH = fromH + Math.floor((fromM + durationMin) / 60);
    return { type: 'duration', qStyle, fromH, fromM, toH: toH % 24, toM, durationMin };
  }

  if (level.type === 'after') {
    const h = rand(7, 17);
    const m = randStep(step);
    const addMin = [5, 10, 15, 20, 30][Math.floor(Math.random() * 5)];
    const nm = (m + addMin) % 60;
    const nh = (h + Math.floor((m + addMin) / 60)) % 24;
    return { type: 'after', qStyle, h, m, addMin, ansH: nh, ansM: nm };
  }

  if (level.type === 'before') {
    const h = rand(8, 18);
    const m = randStep(step);
    const subMin = [5, 10, 15, 20, 30][Math.floor(Math.random() * 5)];
    let nm = (m - subMin + 60) % 60;
    let nh = h - (m < subMin ? 1 : 0);
    if (nh < 0) nh = 0;
    return { type: 'before', qStyle, h, m, subMin, ansH: nh, ansM: nm };
  }

  if (level.type === 'ampm') {
    const h = rand(0, 23);
    const m = randStep(step);
    return { type: 'ampm', qStyle, h, m };
  }

  // デフォルト: read
  const h = rand(1, 12);
  const m = randStep(step);
  return { type: 'read', qStyle, h, m };
};

export const getClockQuestionText = (q: ClockQuestion): string => {
  if (q.type === 'duration') return 'どれだけ じかんが かかりましたか？';
  if (q.type === 'after') return `${q.addMin}ぷん ごは なんじ なんぷん？`;
  if (q.type === 'before') return `${q.subMin}ぷん まえは なんじ なんぷん？`;
  if (q.type === 'ampm') {
    const ap = q.h! < 12 ? 'ごぜん' : 'ごご';
    const dh = q.h! % 12 || 12;
    return `この とけいは <b>${ap} ${dh}じ ${q.m}ぷん</b> ですか？`;
  }
  return 'なんじ なんぷんですか？';
};
