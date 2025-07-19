import React from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import { Dream, EmotionType } from '../dream-types';

export const DreamStatistics: React.FC<{ dreams: Dream[] }> = ({ dreams }) => {
  const stats = React.useMemo(() => {
    if (dreams.length === 0) return null;

    const totalDreams = dreams.length;
    const lucidDreams = dreams.filter(d => d.lucidityLevel !== 'none').length;
    const averageLucidity = (lucidDreams / totalDreams) * 100;

    const emotionCounts = dreams.reduce((acc, dream) => {
      dream.emotions.forEach(emotion => {
        acc[emotion.type] = (acc[emotion.type] || 0) + 1;
      });
      return acc;
    }, {} as Record<EmotionType, number>);

    const topEmotion = Object.entries(emotionCounts).reduce((a, b) => 
      emotionCounts[a[0] as EmotionType] > emotionCounts[b[0] as EmotionType] ? a : b
    )[0] as EmotionType;

    const symbolCounts = dreams.reduce((acc, dream) => {
      dream.symbols.forEach(symbol => {
        acc[symbol.name] = (acc[symbol.name] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const topSymbol = Object.entries(symbolCounts).reduce((a, b) => 
      symbolCounts[a[0]] > symbolCounts[b[0]] ? a : b
    )[0];

    return {
      totalDreams,
      lucidDreams,
      averageLucidity,
      topEmotion,
      topSymbol
    };
  }, [dreams]);

  if (!stats) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-300">No dreams recorded yet. Start by adding your first dream!</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur-md rounded-xl p-8 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-8 h-8 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Dream Insights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            {stats.totalDreams}
          </div>
          <div className="text-gray-300">Total Dreams</div>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {stats.lucidDreams}
          </div>
          <div className="text-gray-300">Lucid Dreams</div>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {Math.round(stats.averageLucidity)}%
          </div>
          <div className="text-gray-300">Lucidity Rate</div>
        </div>

        <div className="text-center">
          <div className="text-xl font-bold text-green-400 mb-2 capitalize">
            {stats.topEmotion}
          </div>
          <div className="text-gray-300">Top Emotion</div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/20">
        <h3 className="text-lg font-semibold text-white mb-3">Most Common Symbol</h3>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          <span className="text-gray-200 capitalize">{stats.topSymbol}</span>
        </div>
      </div>
    </div>
  );
}; 