import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Trophy } from 'lucide-react'
import { lessonsApi } from '../api/lessons'
import { topicsApi } from '../api/topics'
import { FlashcardPlayer } from '../components/lessons/FlashcardPlayer'
import { MatchingGame } from '../components/lessons/MatchingGame'
import { QuizGame } from '../components/lessons/QuizGame'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { getLessonTypeLabel, getLessonTypeEmoji } from '../utils/topicIcons'
import { LESSON_WORD_COUNT, pickRandomItems } from '../utils/vocabulary'

export function LessonPage() {
  const { id } = useParams<{ id: string }>()
  const lessonId = Number(id)
  const queryClient = useQueryClient()
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)
  const [sessionKey, setSessionKey] = useState(0)

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => lessonsApi.getById(lessonId),
    enabled: !!lessonId,
  })

  const { data: vocabularies = [] } = useQuery({
    queryKey: ['topic-vocabularies', lesson?.topicId],
    queryFn: () => topicsApi.getVocabularies(lesson!.topicId),
    enabled: !!lesson?.topicId,
  })

  const lessonVocabularies = useMemo(() => {
    if (!lesson || vocabularies.length === 0) return []

    if (lesson.type === 'MATCHING' || lesson.type === 'QUIZ') {
      return pickRandomItems(vocabularies, LESSON_WORD_COUNT)
    }

    return vocabularies
  }, [lesson, vocabularies, sessionKey])

  const progressMutation = useMutation({
    mutationFn: (s: number) =>
      lessonsApi.saveProgress(lessonId, 'COMPLETED', s),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-progress'] })
    },
  })

  const handleComplete = (finalScore: number) => {
    setScore(finalScore)
    setFinished(true)
    progressMutation.mutate(finalScore)
  }

  if (isLoading || !lesson) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (vocabularies.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-brand-600 font-semibold">Chưa có từ vựng cho bài học này.</p>
        <Link to={`/topics/${lesson.topicId}`}>
          <Button className="mt-4">Quay lại chủ đề</Button>
        </Link>
      </Card>
    )
  }

  if (finished) {
    const emoji = score >= 80 ? '🏆' : score >= 50 ? '👍' : '💪'
    return (
      <div className="max-w-lg mx-auto text-center space-y-5 sm:space-y-6 animate-bounce-in px-1">
        <Card padding="lg" className="bg-gradient-to-br from-brand-50 to-purple-50">
          <div className="text-5xl sm:text-7xl mb-4">{emoji}</div>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-800 mb-2">Hoàn thành!</h2>
          <p className="text-gray-500 mb-4">{lesson.title}</p>
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-md">
            <Trophy className="w-6 h-6 text-sunny-500" />
            <span className="text-3xl font-black text-brand-800">{score}</span>
            <span className="text-gray-500 font-semibold">điểm</span>
          </div>
        </Card>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={`/topics/${lesson.topicId}`} className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">Về chủ đề</Button>
          </Link>
          <Button className="w-full sm:w-auto" onClick={() => {
            setFinished(false)
            setScore(0)
            setSessionKey((k) => k + 1)
          }}>
            Học lại
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6 animate-slide-up">
      <Link
        to={`/topics/${lesson.topicId}`}
        className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </Link>

      <Card className="text-center">
        <span className="text-3xl">{getLessonTypeEmoji(lesson.type)}</span>
        <h2 className="text-xl sm:text-2xl font-black text-brand-800 mt-2 break-words">{lesson.title}</h2>
        <p className="text-gray-500 font-medium">
          {getLessonTypeLabel(lesson.type)} · {lesson.topicName}
          {(lesson.type === 'MATCHING' || lesson.type === 'QUIZ') && (
            <span className="block text-brand-500 text-sm mt-1">
              {lessonVocabularies.length} từ ngẫu nhiên / {vocabularies.length} từ
            </span>
          )}
        </p>
      </Card>

      {lesson.type === 'FLASHCARD' && (
        <FlashcardPlayer vocabularies={vocabularies} onComplete={handleComplete} />
      )}
      {lesson.type === 'MATCHING' && (
        <MatchingGame
          key={sessionKey}
          vocabularies={lessonVocabularies}
          onComplete={handleComplete}
        />
      )}
      {lesson.type === 'QUIZ' && (
        <QuizGame
          key={sessionKey}
          vocabularies={lessonVocabularies}
          allVocabularies={vocabularies}
          onComplete={handleComplete}
        />
      )}
    </div>
  )
}
