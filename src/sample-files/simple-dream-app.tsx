// Simple Dream Journal App - Complete standalone component
// This demonstrates all DreamAI functionality in one easy-to-use component

import React, { useState } from 'react';
import { useDreamStorage, useDreamAnalysis } from './dream-hooks';
import { DateUtils, TextUtils, ValidationUtils } from './dream-utils';
import { ThemeAnalyzer } from './dream-themes';

interface SimpleDream {
  id: string;
  title: string;
  description: string;
  dreamDate: Date;
  emotions: Array<{ type: string; intensity: number }>;
  tags: string[];
  lucidityLevel: string;
}

export const SimpleDreamApp: React.FC = () => {
  const { dreams, saveDream, loading } = useDreamStorage();
  const { analyzeDream, analyzing, interpretation } = useDreamAnalysis();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lucidity, setLucidity] = useState('none');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedDream, setSelectedDream] = useState<SimpleDream | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter dreams based on search
  const filteredDreams = dreams.filter(dream =>
    dream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dream.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    const validation = ValidationUtils.validateDream({ title, description });
    if (!validation.isValid) {
      alert('Please check your input: ' + validation.errors.join(', '));
      return;
    }

    // Auto-generate tags and emotions from description
    const keywords = TextUtils.extractKeywords(description, 3);
    const sentiment = TextUtils.calculateSentiment(description);
    
    // Create dream object
    const newDream = {
      title: title.trim(),
      description: description.trim(),
      dreamDate: new Date(),
      emotions: [{ type: sentiment.label.toLowerCase(), intensity: Math.abs(sentiment.score) * 10 }],
      tags: keywords.slice(0, 5),
      lucidityLevel: lucidity
    };

    saveDream(newDream);
    
    // Reset form
    setTitle('');
    setDescription('');
    setLucidity('none');
    
    alert('Dream saved successfully!');
  };

  const handleAnalyze = async (dream: SimpleDream) => {
    setSelectedDream(dream);
    setShowAnalysis(true);
    await analyzeDream(dream.description);
  };

  const getEmotionColor = (emotionType: string): string => {
    const colors: Record<string, string> = {
      'very positive': '#22c55e',
      'positive': '#84cc16',
      'neutral': '#6b7280',
      'negative': '#ef4444',
      'very negative': '#dc2626'
    };
    return colors[emotionType] || '#6b7280';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ✨ Simple Dream Journal ✨
          </h1>
          <p className="text-xl text-gray-300">
            Record, analyze, and explore your dreams with AI-powered insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Dream Input */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">
                🌙 Record Your Dream
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Dream Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your dream a name..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                    className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    required
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    {description.length} characters • {TextUtils.extractKeywords(description).length} keywords detected
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Lucidity Level
                  </label>
                  <select
                    value={lucidity}
                    onChange={(e) => setLucidity(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="none" className="bg-gray-800">Not lucid</option>
                    <option value="low" className="bg-gray-800">Slightly aware</option>
                    <option value="medium" className="bg-gray-800">Somewhat lucid</option>
                    <option value="high" className="bg-gray-800">Very lucid</option>
                    <option value="full" className="bg-gray-800">Fully lucid</option>
                  </select>
                </div>

                {/* Live Preview */}
                {description && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="font-medium text-yellow-400 mb-2">Live Analysis Preview:</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Sentiment: </span>
                        <span 
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{ 
                            backgroundColor: getEmotionColor(TextUtils.calculateSentiment(description).label.toLowerCase()) + '20',
                            color: getEmotionColor(TextUtils.calculateSentiment(description).label.toLowerCase())
                          }}
                        >
                          {TextUtils.calculateSentiment(description).label}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Themes: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {ThemeAnalyzer.identifyThemes(description).slice(0, 3).map((theme, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                              {theme.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !title.trim() || !description.trim()}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading ? '💫 Saving...' : '💾 Save Dream'}
                </button>
              </form>
            </div>

            {/* Dream Stats */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4 text-yellow-400">📊 Your Dream Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{dreams.length}</div>
                  <div className="text-sm text-gray-300">Total Dreams</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {dreams.filter(d => d.lucidityLevel !== 'none').length}
                  </div>
                  <div className="text-sm text-gray-300">Lucid Dreams</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Dreams List */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-yellow-400">📚 Your Dreams</h2>
                <span className="text-sm text-gray-400">{filteredDreams.length} dreams</span>
              </div>

              {/* Search */}
              <div className="mb-6">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search your dreams..."
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Dreams List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredDreams.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-4xl mb-2">🌙</div>
                    <p>No dreams yet. Record your first dream above!</p>
                  </div>
                ) : (
                  filteredDreams.map((dream) => (
                    <div
                      key={dream.id}
                      className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                      onClick={() => handleAnalyze(dream)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-white">{dream.title}</h3>
                        <span className="text-xs text-gray-400">
                          {DateUtils.formatDreamDate(dream.dreamDate)}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {TextUtils.truncateText(dream.description, 100)}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {dream.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 capitalize">{dream.lucidityLevel}</span>
                          <button className="text-purple-400 hover:text-purple-300 text-sm">
                            🔍 Analyze
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Modal */}
        {showAnalysis && selectedDream && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-yellow-400">🧠 Dream Analysis</h2>
                <button
                  onClick={() => setShowAnalysis(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Dream Details */}
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="font-bold text-white mb-2">{selectedDream.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{selectedDream.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{DateUtils.formatDreamDate(selectedDream.dreamDate)}</span>
                    <span>Lucidity: {selectedDream.lucidityLevel}</span>
                  </div>
                </div>

                {/* AI Analysis */}
                {analyzing ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-300">AI is analyzing your dream...</p>
                  </div>
                ) : interpretation ? (
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-400 mb-2">AI Interpretation</h4>
                      <p className="text-gray-300">{interpretation.summary}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-sm text-gray-400">Confidence:</span>
                        <div className="flex-1 bg-white/20 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${interpretation.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-green-400">
                          {Math.round(interpretation.confidence * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Theme Analysis */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-400 mb-2">Identified Themes</h4>
                      <div className="space-y-2">
                        {ThemeAnalyzer.identifyThemes(selectedDream.description).map((theme, index) => (
                          <div key={index} className="bg-white/5 rounded p-3">
                            <div className="font-medium text-white">{theme.name}</div>
                            <div className="text-sm text-gray-300 mt-1">{theme.interpretation}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Symbol Analysis */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-400 mb-2">Dream Symbols</h4>
                      <div className="space-y-2">
                        {ThemeAnalyzer.identifySymbols(selectedDream.description).map((symbol, index) => (
                          <div key={index} className="bg-white/5 rounded p-3">
                            <div className="font-medium text-white">{symbol.name}</div>
                            <div className="text-sm text-gray-300 mt-1">{symbol.universalMeaning}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => analyzeDream(selectedDream.description)}
                    className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    🧠 Analyze This Dream
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 