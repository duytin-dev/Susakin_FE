import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Star, Trophy, Zap } from 'lucide-react'
import { topicsApi } from '../api/topics'
import { usersApi } from '../api/users'
import { useAuth } from '../context/AuthContext'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { getTopicEmoji, getTopicGradient } from '../utils/topicIcons'

export function HomePage() {
  const { user } = useAuth()

  const { data: topics = [] } = useQuery({
    queryKey: ['topics'],
    queryFn: topicsApi.getAll,
  })

  const { data: progress = [] } = useQuery({
    queryKey: ['my-progress'],
    queryFn: usersApi.getMyProgress,
  })

  const { data: vocabularies = [] } = useQuery({
    queryKey: ['my-vocabularies'],
    queryFn: () => usersApi.getMyVocabularies(),
  })

  const completedLessons = progress.filter((p) => p.status === 'COMPLETED').length
  const masteredWords = vocabularies.filter((v) => v.status === 'MASTERED').length

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl gradient-bg p-8 text-white shadow-2xl">
        <div className="absolute -right-8 -top-8 text-[120px] opacity-10 select-none">
          🌟
        </div>
        <div className="relative z-10">
          <p className="text-white/80 font-semibold mb-1">Xin chào,</p>
          <h2 className="text-3xl md:text-4xl font-black mb-2">
            {user?.name}! 👋
          </h2>
          <p className="text-white/80 mb-6 max-w-md">
            Hôm nay cùng học từ vựng tiếng Anh nhé! Bạn đang ở lớp {user?.grade}.
          </p>
          <Link
            to="/topics"
            className="inline-flex items-center gap-2 bg-white text-brand-700 px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Bắt đầu học
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: 'Chủ đề', value: topics.length, color: 'text-brand-600 bg-brand-100' },
          { icon: Trophy, label: 'Bài hoàn thành', value: completedLessons, color: 'text-sunny-500 bg-amber-100' },
          { icon: Star, label: 'Từ đã lưu', value: vocabularies.length, color: 'text-purple-600 bg-purple-100' },
          { icon: Zap, label: 'Đã thuộc', value: masteredWords, color: 'text-mint-500 bg-emerald-100' },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} padding="sm" className="text-center">
            <div className={`w-10 h-10 rounded-2xl ${color} flex items-center justify-center mx-auto mb-2`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-brand-800">{value}</p>
            <p className="text-xs font-semibold text-gray-500">{label}</p>
          </Card>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black text-brand-800">Chủ đề nổi bật</h3>
          <Link to="/topics" className="text-sm font-bold text-brand-600 hover:underline">
            Xem tất cả
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topics.slice(0, 4).map((topic) => (
            <Link key={topic.id} to={`/topics/${topic.id}`}>
              <Card hover className="h-full">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getTopicGradient(topic.name)} flex items-center justify-center text-2xl mb-3 shadow-lg`}
                >
                  {getTopicEmoji(topic.name)}
                </div>
                <h4 className="font-black text-brand-800 text-lg">{topic.name}</h4>
                <Badge variant="info">Chủ đề {topic.orderIndex}</Badge>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {progress.length > 0 && (
        <section>
          <h3 className="text-xl font-black text-brand-800 mb-4">Tiến độ gần đây</h3>
          <div className="space-y-3">
            {progress.slice(0, 3).map((p) => (
              <Card key={p.id} padding="sm" className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-brand-800">{p.lessonTitle}</p>
                  <p className="text-sm text-gray-500">{p.topicName}</p>
                </div>
                <Badge variant={p.status === 'COMPLETED' ? 'success' : 'warning'}>
                  {p.status === 'COMPLETED' ? `${p.score ?? 0} điểm` : 'Đang học'}
                </Badge>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
