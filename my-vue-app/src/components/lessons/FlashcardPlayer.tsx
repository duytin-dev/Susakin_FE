import { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, Volume2 } from 'lucide-react'
import type { Vocabulary } from '../../types'
import { speakEnglish } from '../../utils/speech'
import { Button } from '../ui/Button'

interface FlashcardPlayerProps {
  vocabularies: Vocabulary[]
  onComplete: (score: number) => void
}

const faceClass =
  'absolute inset-0 flex flex-col items-center justify-center rounded-3xl shadow-xl backface-hidden px-4'

export function FlashcardPlayer({ vocabularies, onComplete }: FlashcardPlayerProps) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)

  const current = vocabularies[index]
  const progress = ((index + 1) / vocabularies.length) * 100

  const handleNext = (isKnown: boolean) => {
    const newKnown = isKnown ? known + 1 : known
    setFlipped(false)

    if (index + 1 >= vocabularies.length) {
      const score = Math.round((newKnown / vocabularies.length) * 100)
      onComplete(score)
      return
    }

    setKnown(newKnown)
    setIndex(index + 1)
  }

  if (!current) return null

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-brand-600">
          Thẻ {index + 1} / {vocabularies.length}
        </span>
        <span className="text-sm font-bold text-mint-500">
          Đã biết: {known}
        </span>
      </div>

      <div className="h-3 bg-brand-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className="perspective-1000 cursor-pointer select-none"
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className="relative w-full h-52 sm:h-64 md:h-72 preserve-3d transition-transform duration-500"
          style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          <div
            className={`${faceClass} bg-gradient-to-br from-brand-500 to-purple-600 text-white`}
            style={{ transform: 'rotateY(0deg)' }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                void speakEnglish(current.word)
              }}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors touch-manipulation"
              aria-label="Phát âm"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <p className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 text-center break-words">
              {current.word}
            </p>
            <p className="text-white/80 text-xs sm:text-sm font-medium">Nhấn để xem nghĩa</p>
          </div>

          <div
            className={`${faceClass} bg-gradient-to-br from-mint-400 to-emerald-500 text-white`}
            style={{ transform: 'rotateY(180deg)' }}
          >
            <p className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 text-center break-words">
              {current.meaningVi}
            </p>
            <p className="text-white/80 text-base sm:text-lg">{current.word}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-brand-400">
        <RotateCcw className="w-4 h-4" />
        <span className="text-sm font-medium">Nhấn thẻ để lật</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="secondary" className="w-full sm:w-auto" onClick={() => handleNext(false)}>
          <ChevronLeft className="w-4 h-4" />
          Chưa biết
        </Button>
        <Button variant="success" className="w-full sm:w-auto" onClick={() => handleNext(true)}>
          Đã biết
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
