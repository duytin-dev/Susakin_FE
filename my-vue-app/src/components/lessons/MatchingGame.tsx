import { useCallback, useMemo, useRef, useState } from 'react'
import type { Vocabulary } from '../../types'
import { shuffle } from '../../utils/vocabulary'
import { playMatchSuccess, playMatchWrong } from '../../utils/gameSounds'

interface MatchingGameProps {
  vocabularies: Vocabulary[]
  onComplete: (score: number) => void
}

interface MatchItem {
  id: string
  text: string
  pairId: number
  type: 'en' | 'vi'
}

export function MatchingGame({ vocabularies, onComplete }: MatchingGameProps) {
  const items = useMemo<MatchItem[]>(() => {
    const pairs: MatchItem[] = []
    vocabularies.forEach((v) => {
      pairs.push({ id: `en-${v.id}`, text: v.word, pairId: v.id, type: 'en' })
      pairs.push({ id: `vi-${v.id}`, text: v.meaningVi, pairId: v.id, type: 'vi' })
    })
    return shuffle(pairs)
  }, [vocabularies])

  const totalPairs = items.length / 2
  const [selected, setSelected] = useState<MatchItem | null>(null)
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set())
  const [locked, setLocked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const completedRef = useRef(false)

  const visibleItems = items.filter((item) => !matched.has(item.pairId))

  const finish = useCallback(
    (finalAttempts: number) => {
      if (completedRef.current) return
      completedRef.current = true
      const score = Math.min(
        100,
        Math.round((totalPairs / Math.max(finalAttempts, totalPairs)) * 100),
      )
      setTimeout(() => onComplete(score), 600)
    },
    [totalPairs, onComplete],
  )

  const handleSelect = useCallback(
    (item: MatchItem) => {
      if (matched.has(item.pairId) || locked) return

      if (!selected) {
        setSelected(item)
        return
      }

      if (selected.id === item.id) {
        setSelected(null)
        return
      }

      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      setLocked(true)

      if (selected.pairId === item.pairId && selected.type !== item.type) {
        playMatchSuccess()
        setWrongIds(new Set())

        const newMatched = new Set(matched)
        newMatched.add(item.pairId)
        setMatched(newMatched)
        setSelected(null)
        setLocked(false)

        if (newMatched.size >= totalPairs) {
          finish(newAttempts)
        }
      } else {
        playMatchWrong()
        setWrongIds(new Set([selected.id, item.id]))
        setTimeout(() => {
          setWrongIds(new Set())
          setSelected(null)
          setLocked(false)
        }, 700)
      }
    },
    [selected, matched, locked, attempts, totalPairs, finish],
  )

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center">
        <p className="text-sm font-bold text-brand-600">
          Ghép từ tiếng Anh với nghĩa tiếng Việt
        </p>
        <p className="text-lg font-black text-brand-800 mt-1">
          {matched.size} / {totalPairs} cặp đúng
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {visibleItems.map((item) => {
          const isSelected = selected?.id === item.id
          const isWrong = wrongIds.has(item.id)

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              disabled={locked && !isSelected && !isWrong}
              className={`p-3 sm:p-4 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 border-2 min-h-[3.5rem] sm:min-h-[4rem] break-words touch-manipulation ${
                isWrong
                  ? 'bg-coral-500/25 border-coral-500 text-coral-800 animate-pulse'
                  : isSelected
                    ? 'bg-brand-500 border-brand-600 text-white scale-105 shadow-lg'
                    : 'bg-white border-brand-200 text-brand-800 hover:border-brand-400 hover:shadow-md'
              }`}
            >
              {item.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}
