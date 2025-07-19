// Demo Component for DreamAI Application
// This component demonstrates the utility functions and hooks in action

import React, { useState } from 'react';
import { useDreamStorage, useDreamFilter, useDreamAnalysis, useDreamStats, useDreamReminders } from './dream-hooks';
import { DateUtils, TextUtils, DreamAnalysisUtils, VisualizationUtils, ValidationUtils } from './dream-utils';

export const DreamAIDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string>('hooks');
  const [sampleText, setSampleText] = useState('I had an amazing dream where I was flying over beautiful mountains. I felt so peaceful and happy, soaring through the clouds like a bird. The colors were incredible - bright blues and golden sunlight everywhere.');

  // Demo hooks
  const { dreams, saveDream, loading } = useDreamStorage();
  const { filteredDreams, searchTerm, setSearchTerm } = useDreamFilter(dreams);
  const { analyzeDream, analyzing, interpretation } = useDreamAnalysis();
  const stats = useDreamStats(dreams);
  const { reminderTime, enabled, updateSettings } = useDreamReminders();

  const handleAddSampleDream = () => {
    saveDream({
      title: 'Sample Dream ' + (dreams.length + 1),
      description: sampleText,
      dreamDate: new Date(),
      emotions: [
        { type: 'joy', intensity: 8 },
        { type: 'peace', intensity: 7 },
        { type: 'wonder', intensity: 9 }
      ],
      tags: ['flying', 'nature', 'peaceful'],
      lucidityLevel: 'medium'
    });
  };

  const demoSections = {
    hooks: 'React Hooks Demo',
    utils: 'Utility Functions Demo',
    analysis: 'Dream Analysis Demo',
    visualization: 'Visualization Demo'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-400">
            DreamAI Utilities Demo
          </h1>
          <p className="text-xl text-gray-300">
            Explore the power of custom hooks and utility functions
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {Object.entries(demoSections).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveDemo(key)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeDemo === key
                  ? 'bg-yellow-500 text-black shadow-lg scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Demo Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          {activeDemo === 'hooks' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-yellow-400 mb-6">React Hooks in Action</h2>
              
              {/* Dream Storage Hook */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">useDreamStorage Hook</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-300 mb-4">
                      Dreams stored: <span className="text-yellow-400 font-bold">{dreams.length}</span>
                    </p>
                    <button
                      onClick={handleAddSampleDream}
                      disabled={loading}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                    >
                      {loading ? 'Loading...' : 'Add Sample Dream'}
                    </button>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Recent Dreams:</h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {dreams.slice(0, 3).map((dream, index) => (
                        <div key={dream.id} className="text-sm text-gray-300 bg-white/5 p-2 rounded">
                          {dream.title} - {DateUtils.formatDreamDate(dream.dreamDate)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dream Filter Hook */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">useDreamFilter Hook</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search your dreams..."
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  />
                  <p className="text-gray-300">
                    Showing {filteredDreams.length} of {dreams.length} dreams
                  </p>
                </div>
              </div>

              {/* Dream Stats Hook */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">useDreamStats Hook</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{stats.totalDreams}</div>
                    <div className="text-sm text-gray-300">Total Dreams</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{stats.averagePerWeek}</div>
                    <div className="text-sm text-gray-300">Per Week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{stats.lucidityRate}%</div>
                    <div className="text-sm text-gray-300">Lucid Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{stats.recentStreak}</div>
                    <div className="text-sm text-gray-300">Day Streak</div>
                  </div>
                </div>
              </div>

              {/* Reminders Hook */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">useDreamReminders Hook</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => updateSettings(e.target.value, enabled)}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => updateSettings(reminderTime, e.target.checked)}
                      className="rounded"
                    />
                    <span>Enable Reminders</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeDemo === 'utils' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-yellow-400 mb-6">Utility Functions Showcase</h2>
              
              {/* Text Input */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Sample Dream Text</h3>
                <textarea
                  value={sampleText}
                  onChange={(e) => setSampleText(e.target.value)}
                  className="w-full h-24 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none"
                  placeholder="Enter a dream description..."
                />
              </div>

              {/* Text Utils */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">TextUtils Functions</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-yellow-400">Keywords:</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {TextUtils.extractKeywords(sampleText).map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-400">Sentiment:</h4>
                      <div className="mt-2">
                        {(() => {
                          const sentiment = TextUtils.calculateSentiment(sampleText);
                          return (
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              sentiment.score > 0 ? 'bg-green-500/20 text-green-300' :
                              sentiment.score < 0 ? 'bg-red-500/20 text-red-300' :
                              'bg-gray-500/20 text-gray-300'
                            }`}>
                              {sentiment.label} ({sentiment.score.toFixed(2)})
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-400">Truncated (50 chars):</h4>
                      <p className="text-gray-300 mt-2 italic">
                        "{TextUtils.truncateText(sampleText, 50)}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">DreamAnalysisUtils Functions</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-yellow-400">Identified Themes:</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {DreamAnalysisUtils.identifyThemes(sampleText).map((theme, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-400">Suggested Tags:</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {DreamAnalysisUtils.suggestTags({ description: sampleText }).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-400">Complexity Score:</h4>
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-white/10 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full"
                              style={{
                                width: `${DreamAnalysisUtils.calculateComplexity({
                                  description: sampleText,
                                  emotions: [{ type: 'joy', intensity: 8 }]
                                })}%`
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-300">
                            {DreamAnalysisUtils.calculateComplexity({
                              description: sampleText,
                              emotions: [{ type: 'joy', intensity: 8 }]
                            })}/100
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDemo === 'analysis' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-yellow-400 mb-6">Dream Analysis Demo</h2>
              
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">AI Dream Analysis</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => analyzeDream(sampleText)}
                    disabled={analyzing}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {analyzing ? 'Analyzing...' : 'Analyze Sample Dream'}
                  </button>

                  {analyzing && (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      <span className="text-gray-300">AI is analyzing your dream...</span>
                    </div>
                  )}

                  {interpretation && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-400 mb-2">Analysis Result</h4>
                      <p className="text-gray-300 mb-3">{interpretation.summary}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Confidence:</span>
                        <div className="flex-1 bg-white/10 rounded-full h-2">
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
                  )}
                </div>
              </div>

              {/* Validation Demo */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Validation Demo</h3>
                <div className="space-y-4">
                  {(() => {
                    const validation = ValidationUtils.validateDream({
                      title: 'Sample Dream',
                      description: sampleText,
                      dreamDate: new Date()
                    });
                    return (
                      <div>
                        <p className={`font-medium ${validation.isValid ? 'text-green-400' : 'text-red-400'}`}>
                          {validation.isValid ? '✓ Dream data is valid' : '✗ Dream data has errors'}
                        </p>
                        {validation.errors.length > 0 && (
                          <ul className="mt-2 text-red-300 text-sm">
                            {validation.errors.map((error, index) => (
                              <li key={index}>• {error}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {activeDemo === 'visualization' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-yellow-400 mb-6">Visualization Demo</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Emotion Colors</h3>
                  <div className="space-y-3">
                    {['joy', 'fear', 'love', 'peace', 'anger', 'sadness'].map((emotion) => (
                      <div key={emotion} className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full border border-white/20"
                          style={{ backgroundColor: VisualizationUtils.getEmotionColor(emotion) }}
                        />
                        <span className="capitalize text-gray-300">{emotion}</span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {VisualizationUtils.getEmotionColor(emotion)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Dream Gradient</h3>
                  <div className="space-y-4">
                    <div
                      className="h-24 rounded-lg border border-white/20"
                      style={{
                        background: VisualizationUtils.createEmotionGradient([
                          { type: 'joy', intensity: 8 },
                          { type: 'peace', intensity: 7 },
                          { type: 'wonder', intensity: 9 }
                        ])
                      }}
                    />
                    <p className="text-sm text-gray-300">
                      Gradient generated from emotions: Joy (8), Peace (7), Wonder (9)
                    </p>
                  </div>
                </div>
              </div>

              {/* Date Utils Demo */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Date Utilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-yellow-400 mb-2">Date Formatting</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p>Today: {DateUtils.formatDreamDate(new Date())}</p>
                      <p>Yesterday: {DateUtils.formatDreamDate(new Date(Date.now() - 86400000))}</p>
                      <p>Last week: {DateUtils.formatDreamDate(new Date(Date.now() - 7 * 86400000))}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-400 mb-2">Time Periods</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p>6 AM: {DateUtils.getDreamTimePeriod(new Date('2024-01-01T06:00:00'))}</p>
                      <p>2 PM: {DateUtils.getDreamTimePeriod(new Date('2024-01-01T14:00:00'))}</p>
                      <p>10 PM: {DateUtils.getDreamTimePeriod(new Date('2024-01-01T22:00:00'))}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-400 mb-2">Recent Check</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p>Today: {DateUtils.isRecentDream(new Date()) ? '✓ Recent' : '✗ Not recent'}</p>
                      <p>Last month: {DateUtils.isRecentDream(new Date(Date.now() - 30 * 86400000)) ? '✓ Recent' : '✗ Not recent'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400">
          <p>Explore the various utility functions and React hooks that power DreamAI</p>
        </div>
      </div>
    </div>
  );
}; 