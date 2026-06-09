let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return null
  if (!audioCtx) audioCtx = new Ctx()
  void audioCtx.resume()
  return audioCtx
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  volume = 0.22,
  type: OscillatorType = 'sine',
): void {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = frequency
  gain.gain.setValueAtTime(volume, start)
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(start)
  osc.stop(start + duration)
}

/** Âm ghép đúng — 3 nốt tăng dần. */
export function playMatchSuccess(): void {
  const ctx = getAudioContext()
  if (!ctx) return
  const t = ctx.currentTime
  playTone(ctx, 523.25, t, 0.12)
  playTone(ctx, 659.25, t + 0.1, 0.14)
  playTone(ctx, 783.99, t + 0.2, 0.18)
}

/** Âm ghép sai — nốt thấp ngắn. */
export function playMatchWrong(): void {
  const ctx = getAudioContext()
  if (!ctx) return
  const t = ctx.currentTime
  playTone(ctx, 200, t, 0.2, 0.18, 'square')
  playTone(ctx, 140, t + 0.12, 0.22, 0.14, 'square')
}
