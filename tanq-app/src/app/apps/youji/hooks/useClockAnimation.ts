/**
 * useClockAnimation Hook
 * 
 * 時計針のアニメーション・SVG描画のユーティリティ
 */

import { useMemo } from 'react';

export const useClockAnimation = () => {
  // 度数法 → xy座標への変換
  const degToXY = useMemo(() => {
    return (deg: number, r: number) => ({
      x: 100 + r * Math.sin((deg * Math.PI) / 180),
      y: 100 - r * Math.cos((deg * Math.PI) / 180),
    });
  }, []);

  // 時刻 → 時針・分針の角度
  const getClockAngles = useMemo(() => {
    return (h12: number, m: number) => {
      const hDeg = h12 * 30 + m * 0.5; // 時針：30°/時 + 0.5°/分
      const mDeg = m * 6; // 分針：6°/分
      return { hDeg, mDeg };
    };
  }, []);

  // 時計針エンドポイント
  const getClockHands = useMemo(() => {
    return (h12: number, m: number) => {
      const { hDeg, mDeg } = getClockAngles(h12, m);
      const hp = degToXY(hDeg, 42);
      const mp = degToXY(mDeg, 62);
      return { hp, mp };
    };
  }, [degToXY, getClockAngles]);

  // 時計文字盤の目盛り・数字 SVG生成
  const renderClockFace = useMemo(() => {
    return () => {
      const ticksHTML: string[] = [];
      for (let i = 0; i < 60; i++) {
        const deg = i * 6;
        const rad = ((deg - 90) * Math.PI) / 180;
        const isMajor = i % 5 === 0;
        const r1 = isMajor ? 78 : 84;
        const r2 = 90;
        const x1 = 100 + r1 * Math.cos(rad);
        const y1 = 100 + r1 * Math.sin(rad);
        const x2 = 100 + r2 * Math.cos(rad);
        const y2 = 100 + r2 * Math.sin(rad);
        ticksHTML.push(
          `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" ` +
          `stroke="${isMajor ? '#2c3e50' : '#bbb'}" stroke-width="${isMajor ? 2.5 : 1}"/>`,
        );
      }

      const numsHTML: string[] = [];
      for (let n = 1; n <= 12; n++) {
        const deg = ((n * 30 - 90) * Math.PI) / 180;
        const r = 68;
        const x = 100 + r * Math.cos(deg);
        const y = 100 + r * Math.sin(deg);
        numsHTML.push(
          `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" ` +
          `text-anchor="middle" dominant-baseline="central" ` +
          `font-size="13" font-weight="bold" fill="#2c3e50" ` +
          `font-family="sans-serif">${n}</text>`,
        );
      }

      return { ticks: ticksHTML.join(''), nums: numsHTML.join('') };
    };
  }, []);

  return {
    degToXY,
    getClockAngles,
    getClockHands,
    renderClockFace,
  };
};
