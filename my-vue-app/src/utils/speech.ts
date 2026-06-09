let voicesLoaded = false

/** Gọi sớm để iOS/Android load danh sách voice (nếu dùng speechSynthesis). */
export function preloadSpeech(): void {
  if (!('speechSynthesis' in window)) return

  const loadVoices = () => {
    window.speechSynthesis.getVoices()
    voicesLoaded = true
  }

  loadVoices()
  window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
}

function speakWithSynthesis(word: string): void {
  if (!('speechSynthesis' in window)) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(word)
  utterance.lang = 'en-US'
  utterance.rate = 0.85

  if (voicesLoaded) {
    const voices = window.speechSynthesis.getVoices()
    const voice =
      voices.find((v) => v.lang === 'en-US') ??
      voices.find((v) => v.lang.startsWith('en'))
    if (voice) utterance.voice = voice
  }

  window.speechSynthesis.speak(utterance)

  // iOS Safari hay "treo" speech — giữ queue chạy
  const keepAlive = window.setInterval(() => {
    if (!window.speechSynthesis.speaking) {
      window.clearInterval(keepAlive)
      return
    }
    window.speechSynthesis.resume()
  }, 250)

  utterance.onend = () => window.clearInterval(keepAlive)
  utterance.onerror = () => window.clearInterval(keepAlive)
}

function speakWithAudio(word: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(
      `https://dict.googleapis.com/dictvoice?audio=${encodeURIComponent(word)}&lang=en`,
    )
    audio.preload = 'auto'
    audio.onended = () => resolve()
    audio.onerror = () => reject(new Error('Không phát được âm thanh'))
    void audio.play().then(() => resolve()).catch(reject)
  })
}

/** Phát âm tiếng Anh — ưu tiên audio (ổn trên iPhone), fallback speechSynthesis. */
export async function speakEnglish(word: string): Promise<void> {
  const trimmed = word.trim()
  if (!trimmed) return

  try {
    await speakWithAudio(trimmed)
  } catch {
    speakWithSynthesis(trimmed)
  }
}
