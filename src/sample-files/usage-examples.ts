// Usage Examples for DreamAI Application
// This file demonstrates how to integrate all the sample files together

import React, { useState, useEffect } from 'react';
import { 
  Dream, 
  DreamInterpretation, 
  EmotionType, 
  InterpretationStyle 
} from './dream-types';
import { 
  sampleDreams, 
  sampleInterpretations, 
  getDreamsByEmotion, 
  getMostCommonSymbols 
} from './sample-dreams';
import { 
  DreamAnalyzer, 
  createDreamAnalyzer, 
  generateVisualizationPrompt 
} from './dream-analyzer';
import { 
  DreamCard, 
  DreamAnalysisDisplay, 
  DreamInputForm, 
  DreamStatistics,
  DreamJournalExample 
} from './component-examples';
import { 
  DreamAPI, 
  DreamAnalysisAPI, 
  NotificationAPI, 
  ImageGenerationAPI,
  handleApiError,
  useApiCall 
} from './api-examples';

// Example 1: Basic Dream Analysis Workflow
export const DreamAnalysisWorkflow: React.FC = () => {
  const [dreamText, setDreamText] = useState('');
  const [interpretation, setInterpretation] = useState<DreamInterpretation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the dream analyzer
  const analyzer = React.useMemo(() => createDreamAnalyzer(), []);

  const analyzeDream = async () => {
    if (!dreamText.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Use local analyzer for demo purposes
      const result = await analyzer.analyzeDream({
        dreamText: dreamText,
        analysisType: 'psychological' as InterpretationStyle,
        includeVisualization: true
      });

      if (result.success && result.data) {
        setInterpretation(result.data);
      } else {
        setError(result.error || 'Analysis failed');
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white">Dream Analysis Workflow</h2>
      
      {/* Input Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Describe Your Dream
        </label>
        <textarea
          value={dreamText}
          onChange={(e) => setDreamText(e.target.value)}
          placeholder="I dreamed I was flying over a beautiful ocean..."
          className="w-full h-32 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
        />
        <button
          onClick={analyzeDream}
          disabled={isAnalyzing || !dreamText.trim()}
          className="mt-4 px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Dream'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {interpretation && (
        <DreamAnalysisDisplay interpretation={interpretation} />
      )}
    </div>
  );
};

// Example 2: Dream Journal Integration
export const DreamJournalIntegration: React.FC = () => {
  const [dreams, setDreams] = useState<Dream[]>(sampleDreams);
  const [filter, setFilter] = useState<EmotionType | 'all'>('all');

  // Filter dreams by emotion
  const filteredDreams = filter === 'all' 
    ? dreams 
    : getDreamsByEmotion(filter);

  const handleAddDream = async (dreamData: Partial<Dream>) => {
    try {
      // In a real app, this would call the API
      // const result = await DreamAPI.createDream(dreamData);
      
      // For demo, we'll add it locally
      const newDream: Dream = {
        id: `dream-${Date.now()}`,
        userId: 'current-user',
        emotions: [],
        symbols: [],
        ...dreamData
      } as Dream;

      setDreams(prev => [newDream, ...prev]);
    } catch (error) {
      console.error('Failed to add dream:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Dream Journal</h2>
        
        {/* Emotion Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as EmotionType | 'all')}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
        >
          <option value="all">All Dreams</option>
          {Object.values(EmotionType).map(emotion => (
            <option key={emotion} value={emotion} className="bg-gray-800">
              {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dreams List */}
        <div className="lg:col-span-2 space-y-6">
          <DreamInputForm onSubmit={handleAddDream} />
          
          <div className="space-y-4">
            {filteredDreams.map(dream => (
              <DreamCard key={dream.id} dream={dream} />
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div>
          <DreamStatistics dreams={dreams} />
        </div>
      </div>
    </div>
  );
};

// Example 3: API Integration Demo
export const APIIntegrationDemo: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  
  // Using the custom hook for API calls
  const { 
    data: trendingSymbols, 
    loading: loadingSymbols, 
    error: symbolsError, 
    execute: fetchTrendingSymbols 
  } = useApiCall(() => DreamAnalysisAPI.getTrendingSymbols());

  const handleEarlyAccessSignup = async () => {
    try {
      const result = await NotificationAPI.subscribeToEarlyAccess(email);
      if (result.success) {
        setSubscriptionStatus('Successfully subscribed to early access!');
        setEmail('');
      } else {
        setSubscriptionStatus(`Error: ${result.error}`);
      }
    } catch (error) {
      setSubscriptionStatus(`Error: ${handleApiError(error)}`);
    }
  };

  React.useEffect(() => {
    fetchTrendingSymbols();
  }, [fetchTrendingSymbols]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-white">API Integration Examples</h2>

      {/* Early Access Signup */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Early Access Signup</h3>
        <div className="flex gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={handleEarlyAccessSignup}
            disabled={!email.trim()}
            className="px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 disabled:opacity-50"
          >
            Subscribe
          </button>
        </div>
        {subscriptionStatus && (
          <p className="mt-2 text-sm text-gray-300">{subscriptionStatus}</p>
        )}
      </div>

      {/* Trending Symbols */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Trending Dream Symbols</h3>
        
        {loadingSymbols && (
          <p className="text-gray-300">Loading trending symbols...</p>
        )}
        
        {symbolsError && (
          <p className="text-red-300">Error: {symbolsError}</p>
        )}
        
        {trendingSymbols && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {trendingSymbols.map((item, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-yellow-400 font-semibold">{item.symbol}</div>
                <div className="text-gray-300 text-sm">{item.frequency} dreams</div>
              </div>
            ))}
          </div>
        )}
        
        <button
          onClick={fetchTrendingSymbols}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Refresh Symbols
        </button>
      </div>
    </div>
  );
};

// Example 4: Complete Dream Processing Pipeline
export const DreamProcessingPipeline: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [dreamData, setDreamData] = useState<Partial<Dream>>({});
  const [interpretation, setInterpretation] = useState<DreamInterpretation | null>(null);
  const [visualization, setVisualization] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    'Record Dream',
    'AI Analysis',
    'Generate Visualization',
    'Save & Share'
  ];

  const handleDreamSubmit = async (data: Partial<Dream>) => {
    setDreamData(data);
    setCurrentStep(2);
    setIsProcessing(true);

    try {
      // Step 2: Analyze the dream
      const analyzer = createDreamAnalyzer();
      const analysisResult = await analyzer.analyzeDream({
        dreamText: data.description || '',
        analysisType: 'psychological' as InterpretationStyle,
        includeVisualization: true
      });

      if (analysisResult.success && analysisResult.data) {
        setInterpretation(analysisResult.data);
        setCurrentStep(3);

        // Step 3: Generate visualization
        if (data.description) {
          try {
            const imageResult = await ImageGenerationAPI.generateDreamImage(
              data.description,
              'surreal'
            );
            if (imageResult.success && imageResult.data) {
              setVisualization(imageResult.data.imageUrl);
            }
          } catch (error) {
            console.warn('Visualization generation failed:', error);
          }
        }

        setCurrentStep(4);
      }
    } catch (error) {
      console.error('Dream processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveAndShare = async () => {
    try {
      // In a real app, save to database
      // await DreamAPI.createDream({
      //   ...dreamData,
      //   interpretation: interpretation?.id
      // });
      
      console.log('Dream saved successfully!');
      // Reset for next dream
      setCurrentStep(1);
      setDreamData({});
      setInterpretation(null);
      setVisualization(null);
    } catch (error) {
      console.error('Failed to save dream:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Dream Processing Pipeline</h2>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
              ${currentStep > index + 1 
                ? 'bg-green-500 text-white' 
                : currentStep === index + 1 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-gray-600 text-gray-300'
              }
            `}>
              {currentStep > index + 1 ? '✓' : index + 1}
            </div>
            <span className={`ml-2 text-sm ${
              currentStep >= index + 1 ? 'text-white' : 'text-gray-400'
            }`}>
              {step}
            </span>
            {index < steps.length - 1 && (
              <div className={`ml-4 w-8 h-0.5 ${
                currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-600'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        {currentStep === 1 && (
          <DreamInputForm onSubmit={handleDreamSubmit} />
        )}

        {currentStep === 2 && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white">Analyzing your dream with AI...</p>
          </div>
        )}

        {currentStep === 3 && interpretation && (
          <div className="space-y-6">
            <DreamAnalysisDisplay interpretation={interpretation} />
            {isProcessing && (
              <div className="text-center py-4">
                <div className="animate-pulse text-gray-300">Generating visualization...</div>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Review & Save</h3>
            
            {/* Dream Summary */}
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-medium text-yellow-400 mb-2">{dreamData.title}</h4>
              <p className="text-gray-300 text-sm">{dreamData.description}</p>
            </div>

            {/* Visualization */}
            {visualization && (
              <div>
                <h4 className="font-medium text-white mb-2">Dream Visualization</h4>
                <img 
                  src={visualization} 
                  alt="Dream visualization"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Start Over
              </button>
              <button
                onClick={handleSaveAndShare}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Save Dream
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Example 5: Dream Statistics Dashboard
export const DreamStatsDashboard: React.FC = () => {
  const [dreams] = useState<Dream[]>(sampleDreams);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Calculate statistics
  const stats = React.useMemo(() => {
    const symbolStats = getMostCommonSymbols();
    const emotionCounts = dreams.reduce((acc, dream) => {
      dream.emotions.forEach(emotion => {
        acc[emotion.type] = (acc[emotion.type] || 0) + 1;
      });
      return acc;
    }, {} as Record<EmotionType, number>);

    const lucidityStats = dreams.reduce((acc, dream) => {
      acc[dream.lucidityLevel] = (acc[dream.lucidityLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalDreams: dreams.length,
      symbolStats,
      emotionCounts,
      lucidityStats,
      averageSymbolsPerDream: dreams.reduce((sum, dream) => sum + dream.symbols.length, 0) / dreams.length,
      averageEmotionsPerDream: dreams.reduce((sum, dream) => sum + dream.emotions.length, 0) / dreams.length
    };
  }, [dreams]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Dream Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
        >
          <option value="week" className="bg-gray-800">Last Week</option>
          <option value="month" className="bg-gray-800">Last Month</option>
          <option value="year" className="bg-gray-800">Last Year</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="text-3xl font-bold text-blue-400 mb-2">{stats.totalDreams}</div>
          <div className="text-gray-300">Total Dreams</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {stats.averageSymbolsPerDream.toFixed(1)}
          </div>
          <div className="text-gray-300">Avg Symbols</div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            {stats.averageEmotionsPerDream.toFixed(1)}
          </div>
          <div className="text-gray-300">Avg Emotions</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {Object.values(stats.lucidityStats).reduce((a, b) => Math.max(a, b), 0)}
          </div>
          <div className="text-gray-300">Peak Lucidity</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Symbol Frequency */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Most Common Symbols</h3>
          <div className="space-y-3">
            {stats.symbolStats.slice(0, 5).map((symbol, index) => (
              <div key={symbol.name} className="flex items-center justify-between">
                <span className="text-gray-300 capitalize">{symbol.name}</span>
                <div className="flex items-center gap-2">
                  <div 
                    className="h-2 bg-yellow-400 rounded"
                    style={{ 
                      width: `${(symbol.frequency / Math.max(...stats.symbolStats.map(s => s.frequency))) * 100}px`
                    }}
                  />
                  <span className="text-yellow-400 text-sm font-medium">{symbol.frequency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emotion Distribution */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Emotion Distribution</h3>
          <div className="space-y-3">
            {Object.entries(stats.emotionCounts)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([emotion, count]) => (
                <div key={emotion} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize">{emotion}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2 bg-green-400 rounded"
                      style={{ 
                        width: `${(count / Math.max(...Object.values(stats.emotionCounts))) * 100}px`
                      }}
                    />
                    <span className="text-green-400 text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Master Example Component that shows everything
export const DreamAIShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('journal');

  const tabs = [
    { id: 'journal', label: 'Dream Journal', component: DreamJournalExample },
    { id: 'analysis', label: 'AI Analysis', component: DreamAnalysisWorkflow },
    { id: 'pipeline', label: 'Processing Pipeline', component: DreamProcessingPipeline },
    { id: 'api', label: 'API Integration', component: APIIntegrationDemo },
    { id: 'stats', label: 'Analytics', component: DreamStatsDashboard }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || DreamJournalExample;

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white">
      {/* Navigation */}
      <nav className="bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-400">
              DreamAI Showcase
            </h1>
            <div className="flex gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-yellow-400 text-black'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="py-8">
        <ActiveComponent />
      </div>
    </div>
  );
}; 