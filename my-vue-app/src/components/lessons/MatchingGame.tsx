import { useCallback, useMemo, useRef, useState } from 'react'
import type { Vocabulary } from '../../types'

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

import { shuffle } from '../../utils/vocabulary'

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
  const [wrong, setWrong] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const completedRef = useRef(false)

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
      if (matched.has(item.pairId) || wrong) return

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

      if (selected.pairId === item.pairId && selected.type !== item.type) {
        const newMatched = new Set(matched)
        newMatched.add(item.pairId)
        setMatched(newMatched)
        setSelected(null)

        if (newMatched.size >= totalPairs) {
          finish(newAttempts)
        }
      } else {
        setWrong(item.id)
        setTimeout(() => {
          setWrong(null)
          setSelected(null)
        }, 800)
      }
    },
    [selected, matched, wrong, attempts, totalPairs, finish],
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

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
        {items.map((item) => {
          const isMatched = matched.has(item.pairId)
          const isSelected = selected?.id === item.id
          const isWrong = wrong === item.id || (wrong && selected?.id === item.id)

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              disabled={isMatched}
              className={`p-4 rounded-2xl font-bold text-sm transition-all duration-200 border-2 ${
                isMatched
                  ? 'bg-mint-400/20 border-mint-400 text-emerald-700 opacity-60'
                  : isWrong
                    ? 'bg-coral-500/20 border-coral-400 text-coral-700 animate-pulse'
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
