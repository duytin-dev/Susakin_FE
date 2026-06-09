import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Volume2, Trash2 } from 'lucide-react'
import { usersApi } from '../api/users'
import type { VocabStatus } from '../types'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { getVocabStatusLabel } from '../utils/topicIcons'

const statusFilters: { value: VocabStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'NEW', label: 'Mới' },
  { value: 'LEARNING', label: 'Đang học' },
  { value: 'MASTERED', label: 'Đã thuộc' },
]

const statusBadge: Record<VocabStatus, 'info' | 'warning' | 'success'> = {
  NEW: 'info',
  LEARNING: 'warning',
  MASTERED: 'success',
}

const nextStatus: Record<VocabStatus, VocabStatus> = {
  NEW: 'LEARNING',
  LEARNING: 'MASTERED',
  MASTERED: 'MASTERED',
}

export function WordBankPage() {
  const [filter, setFilter] = useState<VocabStatus | 'ALL'>('ALL')
  const queryClient = useQueryClient()

  const { data: vocabularies = [], isLoading } = useQuery({
    queryKey: ['my-vocabularies', filter],
    queryFn: () =>
      usersApi.getMyVocabularies(filter === 'ALL' ? undefined : filter),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: VocabStatus }) =>
      usersApi.updateVocabulary(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-vocabularies'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: usersApi.deleteVocabulary,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-vocabularies'] }),
  })

  const speak = (word: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(word)
      u.lang = 'en-US'
      speechSynthesis.speak(u)
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6 animate-slide-up">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-brand-800">Sổ từ vựng của tôi</h2>
        <p className="text-gray-500 font-medium text-sm sm:text-base">
          Ôn lại các từ bạn đã lưu
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusFilters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 sm:px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all touch-manipulation ${
              filter === value
                ? 'bg-brand-600 text-white shadow-lg'
                : 'bg-white text-brand-600 border-2 border-brand-100 hover:border-brand-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-3xl skeleton" />
          ))}
        </div>
      ) : vocabularies.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-5xl mb-4">📖</p>
          <p className="text-brand-600 font-semibold">Chưa có từ nào được lưu</p>
          <p className="text-gray-400 text-sm mt-1">
            Hãy vào chủ đề và nhấn biểu tượng bookmark để lưu từ
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {vocabularies.map((vocab) => (
            <Card key={vocab.id} padding="sm" className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex items-start gap-3 min-w-0 flex-1">
              <button
                onClick={() => speak(vocab.word)}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-100 flex items-center justify-center shrink-0 hover:bg-brand-200 transition-colors touch-manipulation"
              >
                <Volume2 className="w-5 h-5 text-brand-600" />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-black text-brand-800 text-base sm:text-lg break-words">{vocab.word}</p>
                  <Badge variant={statusBadge[vocab.status]}>
                    {getVocabStatusLabel(vocab.status)}
                  </Badge>
                </div>
                <p className="text-gray-500">{vocab.meaningVi}</p>
                <p className="text-xs text-brand-400 font-medium truncate">{vocab.topicName}</p>
              </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {vocab.status !== 'MASTERED' && (
                  <button
                    onClick={() =>
                      updateMutation.mutate({
                        id: vocab.id,
                        status: nextStatus[vocab.status],
                      })
                    }
                    className="px-3 py-2 rounded-xl bg-mint-400/20 text-emerald-700 text-xs font-bold hover:bg-mint-400/30 transition-colors touch-manipulation"
                  >
                    {vocab.status === 'NEW' ? 'Bắt đầu học' : 'Đã thuộc'}
                  </button>
                )}
                <button
                  onClick={() => deleteMutation.mutate(vocab.id)}
                  className="p-2 rounded-xl text-gray-400 hover:text-coral-500 hover:bg-coral-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
