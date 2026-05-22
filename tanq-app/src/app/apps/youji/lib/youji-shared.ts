/**
 * Youji Apps Shared Utilities
 * 
 * 幼稚園向けアプリ共通のユーティリティ関数
 * - 紙吹雪アニメーション
 * - 音声フィードバック
 * - ローカルストレージ操作
 */

/**
 * 紙吹雪アニメーション
 */
export const playConfetti = (canvas: HTMLCanvasElement) => {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const pieces = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    w: 8 + Math.random() * 8,
    h: 4 + Math.random() * 4,
    color: ['#FF6B6B', '#FFD700', '#5BA4EF', '#4ECDC4', '#FF8C42'][Math.floor(Math.random() * 5)],
    speed: 2 + Math.random() * 3,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.2,
  }));

  let frame = 0;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      p.y += p.speed;
      p.angle += p.spin;
      if (p.y > canvas.height + 20) p.y = -20;
    });
    frame++;
    if (frame < 180) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  draw();
};

/**
 * 音声フィードバック（Web Audio API）
 */
export const playBeep = (frequency: number = 880, duration: number = 0.15) => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequency;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio API 非対応環境では無視
  }
};

/**
 * 成功音
 */
export const playCorrectSound = () => playBeep(880, 0.15);

/**
 * 失敗音
 */
export const playWrongSound = () => playBeep(220, 0.2);

/**
 * ローカルストレージ操作
 */
export const storage = {
  getRecords: (key: string) => {
    try {
      return JSON.parse(localStorage.getItem(key) || '{}');
    } catch (e) {
      return {};
    }
  },
  setRecords: (key: string, data: Record<string, any>) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save records:', e);
    }
  },
};
