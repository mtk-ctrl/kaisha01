let _ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!_ctx) _ctx = new (window.AudioContext ?? (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  return _ctx
}

function tone(freq: number, startOffset: number, dur: number, vol = 0.28) {
  const c = getCtx()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.connect(gain)
  gain.connect(c.destination)
  osc.frequency.value = freq
  osc.type = 'sine'
  const t0 = c.currentTime + startOffset
  gain.gain.setValueAtTime(vol, t0)
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

export function playCorrect() {
  if (typeof window === 'undefined') return
  try { tone(523.25, 0, 0.12); tone(659.25, 0.13, 0.18); tone(783.99, 0.27, 0.28) } catch {}
}

export function playWrong() {
  if (typeof window === 'undefined') return
  try { tone(311.13, 0, 0.14); tone(261.63, 0.16, 0.28) } catch {}
}

// HTMLタグを除去して読み上げ用テキストに変換（ruby → ふりがな優先）
function htmlToText(html: string): string {
  return html
    .replace(/<ruby>([^<]*)<rt>([^<]*)<\/rt><\/ruby>/g, '$2')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

export function speak(html: string, rate = 0.88) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(htmlToText(html))
  u.lang = 'ja-JP'
  u.rate = rate
  window.speechSynthesis.speak(u)
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
}
