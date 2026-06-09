import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Bookmark, BookmarkCheck, Play, Search, Volume2 } from 'lucide-react'
import { topicsApi } from '../api/topics'
import { usersApi } from '../api/users'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import {
  getTopicEmoji,
  getTopicGradient,
  getLessonTypeEmoji,
  getLessonTypeLabel,
} from '../utils/topicIcons'

export function TopicDetailPage() {
  const { id } = useParams<{ id: string }>()
  const topicId = Number(id)
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 20
  const queryClient = useQueryClient()

  useEffect(() => {
    setPage(1)
  }, [keyword])

  const { data: topic } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: () => topicsApi.getById(topicId),
    enabled: !!topicId,
  })

  const { data: vocabularies = [] } = useQuery({
    queryKey: ['topic-vocabularies', topicId, keyword],
    queryFn: () => topicsApi.getVocabularies(topicId, keyword || undefined),
    enabled: !!topicId,
  })

  const { data: lessons = [] } = useQuery({
    queryKey: ['topic-lessons', topicId],
    queryFn: () => topicsApi.getLessons(topicId),
    enabled: !!topicId,
  })

  const { data: savedVocabs = [] } = useQuery({
    queryKey: ['my-vocabularies', topicId],
    queryFn: () => usersApi.getMyVocabularies(undefined, topicId),
  })

  const saveMutation = useMutation({
    mutationFn: usersApi.saveVocabulary,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-vocabularies'] }),
  })

  const savedIds = new Set(savedVocabs.map((v) => v.vocabularyId))
  const totalPages = Math.max(1, Math.ceil(vocabularies.length / pageSize))
  const pagedVocabularies = vocabularies.slice((page - 1) * pageSize, page * pageSize)

  const speak = (word: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(word)
      u.lang = 'en-US'
      u.rate = 0.8
      speechSynthesis.speak(u)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-slide-up">
      <Link
        to="/topics"
        className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </Link>

      {topic && (
        <div className={`rounded-2xl sm:rounded-3xl bg-gradient-to-r ${getTopicGradient(topic.name)} p-5 sm:p-8 text-white shadow-xl`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <span className="text-4xl sm:text-5xl">{getTopicEmoji(topic.name)}</span>
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-black break-words">{topic.name}</h2>
              <p className="text-white/80 font-medium text-sm sm:text-base">
                {vocabularies.length} từ vựng · {lessons.length} bài học
              </p>
            </div>
          </div>
        </div>
      )}

      <section>
        <h3 className="text-lg sm:text-xl font-black text-brand-800 mb-4 flex items-center gap-2">
          <Play className="w-5 h-5" />
          Bài học
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {lessons.map((lesson) => (
            <Link key={lesson.id} to={`/lessons/${lesson.id}`}>
              <Card hover className="flex items-center gap-3 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-100 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                  {getLessonTypeEmoji(lesson.type)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-brand-800 truncate">{lesson.title}</p>
                  <Badge variant="purple">{getLessonTypeLabel(lesson.type)}</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h3 className="text-lg sm:text-xl font-black text-brand-800">Từ vựng</h3>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm từ..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-gray-200 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
            />
          </div>
        </div>

        <p className="text-sm text-brand-500 font-semibold mb-3">
          {vocabularies.length} từ vựng
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pagedVocabularies.map((vocab) => {
            const isSaved = savedIds.has(vocab.id)
            return (
              <Card key={vocab.id} padding="sm" className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => speak(vocab.word)}
                    className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0 hover:bg-brand-200 transition-colors"
                  >
                    <Volume2 className="w-4 h-4 text-brand-600" />
                  </button>
                  <div className="min-w-0">
                    <p className="font-black text-brand-800 text-base sm:text-lg break-words">{vocab.word}</p>
                    <p className="text-gray-500 text-sm truncate">{vocab.meaningVi}</p>
                  </div>
                </div>
                <button
                  onClick={() => !isSaved && saveMutation.mutate(vocab.id)}
                  disabled={isSaved || saveMutation.isPending}
                  className={`p-2 rounded-xl transition-colors shrink-0 ${
                    isSaved
                      ? 'text-mint-500 bg-mint-400/10'
                      : 'text-brand-400 hover:text-brand-600 hover:bg-brand-50'
                  }`}
                  title={isSaved ? 'Đã lưu' : 'Lưu từ'}
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-5 h-5" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </button>
              </Card>
            )
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl font-bold text-sm bg-white border-2 border-brand-200 text-brand-600 disabled:opacity-40"
            >
              Trước
            </button>
            <span className="px-4 py-2 text-sm font-bold text-brand-700">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl font-bold text-sm bg-white border-2 border-brand-200 text-brand-600 disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
