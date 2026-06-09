import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { topicsApi } from '../api/topics'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { getTopicEmoji, getTopicGradient } from '../utils/topicIcons'

export function TopicsPage() {
  const { data: topics = [], isLoading } = useQuery({
    queryKey: ['topics'],
    queryFn: topicsApi.getAll,
  })

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 rounded-3xl skeleton" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-black text-brand-800">Chủ đề học tập</h2>
        <p className="text-gray-500 font-medium">
          Chọn chủ đề để bắt đầu học từ vựng và làm bài tập
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {topics.map((topic) => (
          <Link key={topic.id} to={`/topics/${topic.id}`}>
            <Card hover className="h-full group">
              <div className="flex items-start gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getTopicGradient(topic.name)} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}
                >
                  {getTopicEmoji(topic.name)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-brand-800 mb-1">
                    {topic.name}
                  </h3>
                  <Badge variant="info">Chủ đề {topic.orderIndex}</Badge>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
