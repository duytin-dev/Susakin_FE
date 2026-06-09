const topicEmojiMap: Record<string, string> = {
  'Động vật': '🐾',
  'Màu sắc': '🎨',
  'Gia đình': '👨‍👩‍👧',
  'Thức ăn': '🍎',
}

const topicGradientMap: Record<string, string> = {
  'Động vật': 'from-emerald-400 to-teal-500',
  'Màu sắc': 'from-pink-400 to-rose-500',
  'Gia đình': 'from-blue-400 to-indigo-500',
  'Thức ăn': 'from-orange-400 to-amber-500',
}

export function getTopicEmoji(name: string): string {
  return topicEmojiMap[name] || '📚'
}

export function getTopicGradient(name: string): string {
  return topicGradientMap[name] || 'from-brand-400 to-brand-600'
}

export function getLessonTypeLabel(type: string): string {
  switch (type) {
    case 'FLASHCARD':
      return 'Thẻ từ'
    case 'MATCHING':
      return 'Ghép cặp'
    case 'QUIZ':
      return 'Trắc nghiệm'
    default:
      return type
  }
}

export function getLessonTypeEmoji(type: string): string {
  switch (type) {
    case 'FLASHCARD':
      return '🃏'
    case 'MATCHING':
      return '🧩'
    case 'QUIZ':
      return '❓'
    default:
      return '📖'
  }
}

export function getVocabStatusLabel(status: string): string {
  switch (status) {
    case 'NEW':
      return 'Mới'
    case 'LEARNING':
      return 'Đang học'
    case 'MASTERED':
      return 'Đã thuộc'
    default:
      return status
  }
}
