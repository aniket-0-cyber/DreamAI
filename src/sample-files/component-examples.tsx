// Component Examples for DreamAI Application
// This file demonstrates how to use the existing UI components with dream data

import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Moon, Brain, Heart, Sparkles, Eye, MessageCircle } from 'lucide-react';
import { 
  Dream, 
  DreamInterpretation, 
  EmotionType, 
  LucidityLevel,
  SleepQuality 
} from './dream-types';
import { sampleDreams, sampleInterpretations } from './sample-dreams';

// Dream Card Component - displays a single dream entry
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

// Dream Analysis Component - displays interpretation results
export const DreamAnalysisDisplay: React.FC<{ interpretation: DreamInterpretation }> = ({ interpretation }) => {
  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-md rounded-xl p-8 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Dream Analysis</h2>
        <div className="ml-auto">
          <span className="px-3 py-1 bg-green-400/20 text-green-300 rounded-full text-sm">
            {Math.round(interpretation.confidence * 100)}% confidence
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Summary */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Summary</h3>
          <p className="text-gray-200">{interpretation.summary}</p>
        </div>

        {/* Detailed Analysis */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Detailed Analysis</h3>
          <p className="text-gray-200">{interpretation.detailedAnalysis}</p>
        </div>

        {/* Psychological Insights */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Psychological Insights</h3>
          <ul className="space-y-2">
            {interpretation.psychologicalInsights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-200">
                <Sparkles className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                {insight}
              </li>
            ))}
          </ul>
        </div>

        {/* Symbol Interpretations */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Symbol Meanings</h3>
          <div className="grid gap-4">
            {interpretation.symbolInterpretations.map((symbol, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-200">{symbol.interpretation}</p>
                <div className="flex gap-2 mt-2">
                  {symbol.connections.map((connection) => (
                    <span 
                      key={connection}
                      className="px-2 py-1 bg-purple-400/20 text-purple-300 text-xs rounded"
                    >
                      {connection}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Recommendations</h3>
          <ul className="space-y-2">
            {interpretation.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-200">
                <Heart className="w-4 h-4 text-pink-400 mt-1 flex-shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Dream Input Form Component - for adding new dreams
export const DreamInputForm: React.FC<{ onSubmit: (dreamData: Partial<Dream>) => void }> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lucidity, setLucidity] = useState<LucidityLevel>('none');
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>('good');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    
    const dreamData: Partial<Dream> = {
      title: title.trim(),
      description: description.trim(),
      lucidityLevel: lucidity,
      sleepQuality: sleepQuality,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      dreamDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
      emotions: [], // Would be filled by analysis
      symbols: []  // Would be filled by analysis
    };

    try {
      await onSubmit(dreamData);
      // Reset form
      setTitle('');
      setDescription('');
      setTags('');
      setLucidity('none');
      setSleepQuality('good');
    } catch (error) {
      console.error('Error submitting dream:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <Moon className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Record Your Dream</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Dream Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your dream a memorable title..."
            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Dream Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your dream in detail..."
            className="w-full h-32 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lucidity Level
            </label>
            <select
              value={lucidity}
              onChange={(e) => setLucidity(e.target.value as LucidityLevel)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="none" className="bg-gray-800">Not lucid</option>
              <option value="low" className="bg-gray-800">Slightly aware</option>
              <option value="medium" className="bg-gray-800">Somewhat lucid</option>
              <option value="high" className="bg-gray-800">Very lucid</option>
              <option value="full" className="bg-gray-800">Fully lucid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sleep Quality
            </label>
            <select
              value={sleepQuality}
              onChange={(e) => setSleepQuality(e.target.value as SleepQuality)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="poor" className="bg-gray-800">Poor</option>
              <option value="fair" className="bg-gray-800">Fair</option>
              <option value="good" className="bg-gray-800">Good</option>
              <option value="excellent" className="bg-gray-800">Excellent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tags (comma-separated)
          </label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="flying, water, family, spiritual..."
            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !title.trim() || !description.trim()}
          className="w-full bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Recording Dream...' : 'Record Dream'}
        </Button>
      </form>
    </div>
  );
};

// Dream Statistics Component - shows user dream patterns
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

// Example usage component that combines everything
export const DreamJournalExample: React.FC = () => {
  const [dreams, setDreams] = useState<Dream[]>(sampleDreams);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddDream = async (dreamData: Partial<Dream>) => {
    const newDream: Dream = {
      id: `dream-${Date.now()}`,
      userId: 'current-user',
      emotions: [], // Would be filled by AI analysis
      symbols: [],  // Would be filled by AI analysis
      ...dreamData
    } as Dream;

    setDreams(prev => [newDream, ...prev]);
    setShowForm(false);
  };

  const selectedInterpretation = selectedDream 
    ? sampleInterpretations.find(i => i.dreamId === selectedDream.id)
    : null;

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-400">
            Dream Journal
          </h1>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-yellow-400 text-black hover:bg-yellow-300"
          >
            {showForm ? 'Cancel' : 'Add Dream'}
          </Button>
        </div>

        {showForm && (
          <div className="mb-8">
            <DreamInputForm onSubmit={handleAddDream} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {selectedDream ? (
              <div className="space-y-6">
                <Button
                  onClick={() => setSelectedDream(null)}
                  variant="outline"
                  className="mb-4"
                >
                  ← Back to Dreams
                </Button>
                <DreamCard dream={selectedDream} />
                {selectedInterpretation && (
                  <DreamAnalysisDisplay interpretation={selectedInterpretation} />
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white">Your Dreams</h2>
                <div className="grid gap-6">
                  {dreams.map((dream) => (
                    <DreamCard
                      key={dream.id}
                      dream={dream}
                      onClick={() => setSelectedDream(dream)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <DreamStatistics dreams={dreams} />
          </div>
        </div>
      </div>
    </div>
  );
}; 