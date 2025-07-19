import React from 'react';
import { Eye } from 'lucide-react';
import { Dream, EmotionType } from '../dream-types';

export const DreamCard: React.FC<{ dream: Dream; onClick?: () => void }> = ({ dream, onClick }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getEmotionColor = (emotions: Array<{type: EmotionType, intensity: number}>) => {
    if (emotions.length === 0) return 'bg-gray-400';
    
    const dominant = emotions.reduce((prev, current) => 
      current.intensity > prev.intensity ? current : prev
    );

    const colorMap: Record<EmotionType, string> = {
      [EmotionType.JOY]: 'bg-yellow-400',
      [EmotionType.PEACE]: 'bg-blue-400',
      [EmotionType.FEAR]: 'bg-red-600',
      [EmotionType.LOVE]: 'bg-pink-400',
      [EmotionType.ANXIETY]: 'bg-gray-500',
      [EmotionType.ANGER]: 'bg-red-500',
      [EmotionType.SADNESS]: 'bg-blue-600',
      [EmotionType.EXCITEMENT]: 'bg-orange-400',
      [EmotionType.CONFUSION]: 'bg-purple-400',
      [EmotionType.WONDER]: 'bg-indigo-400',
      [EmotionType.GUILT]: 'bg-yellow-600',
      [EmotionType.RELIEF]: 'bg-green-400',
      [EmotionType.NOSTALGIA]: 'bg-amber-400',
      [EmotionType.HOPE]: 'bg-teal-400',
      [EmotionType.FRUSTRATION]: 'bg-red-400'
    };

    return colorMap[dominant.type] || 'bg-gray-400';
  };

  return (
    <div 
      className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">{dream.title}</h3>
          <p className="text-gray-300 text-sm">{formatDate(dream.dreamDate)}</p>
        </div>
        <div className={`w-4 h-4 rounded-full ${getEmotionColor(dream.emotions)}`} />
      </div>
      
      <p className="text-gray-200 mb-4 line-clamp-3">
        {dream.description.substring(0, 150)}...
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {dream.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="px-2 py-1 bg-yellow-400/20 text-yellow-300 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Eye className="w-4 h-4" />
          <span className="capitalize">{dream.lucidityLevel}</span>
        </div>
      </div>
    </div>
  );
}; 