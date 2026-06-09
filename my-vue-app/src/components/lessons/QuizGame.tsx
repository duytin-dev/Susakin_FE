import { useMemo, useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import type { Vocabulary } from '../../types'
import { shuffle } from '../../utils/vocabulary'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface QuizGameProps {
  vocabularies: Vocabulary[]
  allVocabularies?: Vocabulary[]
  onComplete: (score: number) => void
}

interface QuizQuestion {
  vocabulary: Vocabulary
  options: string[]
  correctIndex: number
}

function buildQuestions(
  vocabularies: Vocabulary[],
  distractorPool: Vocabulary[],
): QuizQuestion[] {
  return vocabularies.map((v) => {
    const others = distractorPool
      .filter((o) => o.id !== v.id)
      .map((o) => o.meaningVi)
    const wrongOptions = shuffle(others).slice(0, 3)
    const options = shuffle([v.meaningVi, ...wrongOptions])
    return {
      vocabulary: v,
      options,
      correctIndex: options.indexOf(v.meaningVi),
    }
  })
}

export function QuizGame({
  vocabularies,
  allVocabularies,
  onComplete,
}: QuizGameProps) {
  const questions = useMemo(
    () => buildQuestions(vocabularies, allVocabularies ?? vocabularies),
    [vocabularies, allVocabularies],
  )
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const current = questions[index]
  const progress = ((index + 1) / questions.length) * 100

  const handleAnswer = (optionIndex: number) => {
    if (selected !== null) return
    setSelected(optionIndex)
    if (optionIndex === current.correctIndex) {
      setCorrectCount((c) => c + 1)
    }
    setShowResult(true)
  }

  const handleNext = () => {
    if (index + 1 >= questions.length) {
      onComplete(Math.round((correctCount / questions.length) * 100))
      return
    }
    setIndex(index + 1)
    setSelected(null)
    setShowResult(false)
  }

  const isCorrect = selected === current.correctIndex

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-brand-600">
          Câu {index + 1} / {questions.length}
        </span>
        <span className="text-sm font-bold text-mint-500">
          Đúng: {correctCount}
        </span>
      </div>

      <div className="h-3 bg-brand-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sunny-400 to-orange-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Card className="text-center bg-gradient-to-br from-brand-50 to-purple-50">
        <p className="text-sm font-semibold text-brand-500 mb-2">
          Nghĩa của từ này là gì?
        </p>
        <p className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-800 break-words">
          {current.vocabulary.word}
        </p>
      </Card>

      <div className="grid gap-3">
        {current.options.map((option, i) => {
          let style = 'bg-white border-brand-200 text-brand-800 hover:border-brand-400'
          if (showResult) {
            if (i === current.correctIndex) {
              style = 'bg-mint-400/20 border-mint-500 text-emerald-800'
            } else if (i === selected) {
              style = 'bg-coral-500/20 border-coral-400 text-coral-800'
            } else {
              style = 'bg-gray-50 border-gray-200 text-gray-400'
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={showResult}
              className={`p-3 sm:p-4 rounded-2xl border-2 font-semibold text-left text-sm sm:text-base transition-all duration-200 flex items-center gap-2 sm:gap-3 touch-manipulation ${style}`}
            >
              <span className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center text-sm font-black text-brand-600 shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 break-words">{option}</span>
              {showResult && i === current.correctIndex && (
                <CheckCircle className="w-5 h-5 text-mint-500 ml-auto" />
              )}
              {showResult && i === selected && i !== current.correctIndex && (
                <XCircle className="w-5 h-5 text-coral-500 ml-auto" />
              )}
            </button>
          )
        })}
      </div>

      {showResult && (
        <div className="text-center space-y-4 animate-bounce-in">
          <p className={`text-xl font-black ${isCorrect ? 'text-mint-500' : 'text-coral-500'}`}>
            {isCorrect ? '🎉 Chính xác!' : '😅 Chưa đúng rồi!'}
          </p>
          {!isCorrect && (
            <p className="text-brand-600">
              Đáp án đúng: <strong>{current.vocabulary.meaningVi}</strong>
            </p>
          )}
          <Button onClick={handleNext} size="lg" className="w-full sm:w-auto">
            {index + 1 >= questions.length ? 'Xem kết quả' : 'Câu tiếp theo'}
          </Button>
        </div>
      )}
    </div>
  )
}
