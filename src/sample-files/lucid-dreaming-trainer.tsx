// Lucid Dreaming Training System
// Interactive tools and exercises for developing lucid dreaming abilities

import React, { useState, useEffect, useCallback } from 'react';

// Training interfaces
export interface RealityCheck {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  frequency: 'hourly' | 'daily' | 'situational';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  effectiveness: number; // 1-10
}

export interface DreamSign {
  id: string;
  category: 'people' | 'places' | 'objects' | 'actions' | 'emotions';
  description: string;
  frequency: number;
  lastOccurrence: Date;
  isRecognized: boolean;
}

export interface LucidTechnique {
  id: string;
  name: string;
  acronym: string;
  description: string;
  steps: string[];
  timeToPerform: string;
  successRate: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'induction' | 'stabilization' | 'control';
}

export interface TrainingSession {
  id: string;
  date: Date;
  technique: string;
  duration: number; // minutes
  success: boolean;
  lucidityLevel: number; // 1-10
  notes: string;
  dreamSigns: string[];
}

// Reality Check Components
export const RealityCheckTrainer: React.FC = () => {
  const [currentCheck, setCurrentCheck] = useState<RealityCheck | null>(null);
  const [checkHistory, setCheckHistory] = useState<Array<{ check: string; time: Date; result: boolean }>>([]);
  const [reminderInterval, setReminderInterval] = useState<number | null>(null);

  const realityChecks: RealityCheck[] = [
    {
      id: 'hands',
      name: 'Hand Check',
      description: 'Look at your hands and count your fingers',
      instructions: [
        'Hold your hands up in front of your face',
        'Count your fingers carefully',
        'Look away and look back',
        'Count again - do you have the same number?',
        'In dreams, hands often appear distorted or have wrong number of fingers'
      ],
      frequency: 'hourly',
      difficulty: 'beginner',
      effectiveness: 8
    },
    {
      id: 'text',
      name: 'Text Check',
      description: 'Read text twice to see if it changes',
      instructions: [
        'Find some text (clock, sign, book)',
        'Read it carefully and remember what it says',
        'Look away for a few seconds',
        'Look back and read it again',
        'In dreams, text often changes or becomes unreadable'
      ],
      frequency: 'situational',
      difficulty: 'beginner',
      effectiveness: 9
    },
    {
      id: 'mirror',
      name: 'Mirror Check',
      description: 'Look at your reflection in a mirror',
      instructions: [
        'Find a mirror and look at your reflection',
        'Examine your face carefully',
        'Notice any unusual features or distortions',
        'Touch your face and see if the reflection matches',
        'In dreams, reflections are often distorted or delayed'
      ],
      frequency: 'daily',
      difficulty: 'intermediate',
      effectiveness: 7
    },
    {
      id: 'clock',
      name: 'Digital Clock Check',
      description: 'Check a digital clock or watch twice',
      instructions: [
        'Look at a digital clock or watch',
        'Note the exact time',
        'Look away and count to 5',
        'Look back at the time',
        'In dreams, time often jumps or displays impossible numbers'
      ],
      frequency: 'hourly',
      difficulty: 'beginner',
      effectiveness: 8
    },
    {
      id: 'breathing',
      name: 'Nose Pinch Check',
      description: 'Pinch your nose and try to breathe',
      instructions: [
        'Pinch your nose closed with your fingers',
        'Close your mouth',
        'Try to breathe through your nose',
        'If you can still breathe, you are dreaming',
        'This is one of the most reliable reality checks'
      ],
      frequency: 'hourly',
      difficulty: 'beginner',
      effectiveness: 10
    }
  ];

  const performRandomCheck = useCallback(() => {
    const randomCheck = realityChecks[Math.floor(Math.random() * realityChecks.length)];
    setCurrentCheck(randomCheck);
  }, []);

  const recordCheckResult = (success: boolean) => {
    if (currentCheck) {
      setCheckHistory(prev => [...prev, {
        check: currentCheck.name,
        time: new Date(),
        result: success
      }]);
      setCurrentCheck(null);
    }
  };

  const startReminders = (intervalMinutes: number) => {
    if (reminderInterval) {
      clearInterval(reminderInterval);
    }
    
    const interval = setInterval(() => {
      performRandomCheck();
    }, intervalMinutes * 60 * 1000);
    
    setReminderInterval(interval);
  };

  useEffect(() => {
    return () => {
      if (reminderInterval) {
        clearInterval(reminderInterval);
      }
    };
  }, [reminderInterval]);

  return (
    <div className="bg-white/10 rounded-lg p-6">
      <h3 className="text-xl font-bold text-yellow-400 mb-4">🔍 Reality Check Trainer</h3>
      
      {!currentCheck ? (
        <div className="space-y-4">
          <div className="text-center">
            <button
              onClick={performRandomCheck}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              🎯 Perform Reality Check
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <button
              onClick={() => startReminders(30)}
              className="px-4 py-2 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition-colors"
            >
              ⏰ Every 30min
            </button>
            <button
              onClick={() => startReminders(60)}
              className="px-4 py-2 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition-colors"
            >
              ⏰ Every Hour
            </button>
            <button
              onClick={() => startReminders(120)}
              className="px-4 py-2 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition-colors"
            >
              ⏰ Every 2 Hours
            </button>
          </div>

          {/* Recent Checks */}
          {checkHistory.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-white mb-2">Recent Checks</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {checkHistory.slice(-5).reverse().map((check, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 rounded p-2">
                    <span className="text-sm text-gray-300">{check.check}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {check.time.toLocaleTimeString()}
                      </span>
                      <span className={`text-sm ${check.result ? 'text-green-400' : 'text-red-400'}`}>
                        {check.result ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
            <h4 className="font-bold text-blue-300 mb-2">{currentCheck.name}</h4>
            <p className="text-gray-300 mb-4">{currentCheck.description}</p>
            
            <div className="space-y-2">
              <h5 className="font-medium text-white">Instructions:</h5>
              <ol className="list-decimal list-inside space-y-1">
                {currentCheck.instructions.map((instruction, index) => (
                  <li key={index} className="text-sm text-gray-300">{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => recordCheckResult(true)}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              ✓ Passed (Awake)
            </button>
            <button
              onClick={() => recordCheckResult(false)}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              ✗ Failed (Would be dreaming)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Dream Sign Recognition Trainer
export const DreamSignTrainer: React.FC = () => {
  const [dreamSigns, setDreamSigns] = useState<DreamSign[]>([]);
  const [newSign, setNewSign] = useState({ category: 'people', description: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const categories = ['people', 'places', 'objects', 'actions', 'emotions'];

  const addDreamSign = () => {
    if (newSign.description.trim()) {
      const sign: DreamSign = {
        id: Date.now().toString(),
        category: newSign.category as any,
        description: newSign.description.trim(),
        frequency: 1,
        lastOccurrence: new Date(),
        isRecognized: false
      };
      
      setDreamSigns(prev => [...prev, sign]);
      setNewSign({ category: 'people', description: '' });
      setShowAddForm(false);
    }
  };

  const markAsRecognized = (id: string) => {
    setDreamSigns(prev => prev.map(sign => 
      sign.id === id ? { ...sign, isRecognized: true, lastOccurrence: new Date() } : sign
    ));
  };

  const incrementFrequency = (id: string) => {
    setDreamSigns(prev => prev.map(sign => 
      sign.id === id ? { ...sign, frequency: sign.frequency + 1, lastOccurrence: new Date() } : sign
    ));
  };

  const getCategoryIcon = (category: string): string => {
    const icons = {
      people: '👥',
      places: '🏠',
      objects: '📦',
      actions: '🏃',
      emotions: '😊'
    };
    return icons[category as keyof typeof icons] || '📝';
  };

  return (
    <div className="bg-white/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-yellow-400">🎯 Dream Sign Recognition</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          + Add Dream Sign
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white/5 rounded-lg p-4 mb-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select
                value={newSign.category}
                onChange={(e) => setNewSign(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-gray-800">
                    {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <input
                type="text"
                value={newSign.description}
                onChange={(e) => setNewSign(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the dream sign..."
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addDreamSign}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Add Sign
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {dreamSigns.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🎯</div>
            <p>No dream signs yet. Add some to start training!</p>
            <p className="text-sm mt-1">Dream signs are recurring elements in your dreams that can trigger lucidity.</p>
          </div>
        ) : (
          dreamSigns.map(sign => (
            <div
              key={sign.id}
              className={`bg-white/5 rounded-lg p-3 border ${
                sign.isRecognized ? 'border-green-500/50' : 'border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getCategoryIcon(sign.category)}</span>
                  <div>
                    <div className="font-medium text-white">{sign.description}</div>
                    <div className="text-xs text-gray-400">
                      {sign.category} • Appeared {sign.frequency} times
                      {sign.isRecognized && ' • ✓ Recognized'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => incrementFrequency(sign.id)}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded text-sm hover:bg-blue-500/30 transition-colors"
                  >
                    Appeared Again
                  </button>
                  {!sign.isRecognized && (
                    <button
                      onClick={() => markAsRecognized(sign.id)}
                      className="px-3 py-1 bg-green-500/20 text-green-300 rounded text-sm hover:bg-green-500/30 transition-colors"
                    >
                      Recognized!
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Lucid Dreaming Techniques Library
export const TechniqueLibrary: React.FC = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<LucidTechnique | null>(null);
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const techniques: LucidTechnique[] = [
    {
      id: 'mild',
      name: 'Mnemonic Induction of Lucid Dreams',
      acronym: 'MILD',
      description: 'Use memory and intention to trigger lucidity',
      steps: [
        'As you fall asleep, repeat "Next time I\'m dreaming, I will remember I\'m dreaming"',
        'Visualize yourself becoming lucid in a recent dream',
        'Imagine what you would do differently if you were lucid',
        'Fall asleep while maintaining this intention'
      ],
      timeToPerform: 'As falling asleep',
      successRate: 75,
      difficulty: 'beginner',
      category: 'induction'
    },
    {
      id: 'wild',
      name: 'Wake-Initiated Lucid Dream',
      acronym: 'WILD',
      description: 'Maintain consciousness while entering REM sleep',
      steps: [
        'Wake up after 4-6 hours of sleep',
        'Stay awake for 15-30 minutes thinking about lucid dreaming',
        'Lie down and relax completely',
        'Focus on your breathing or count numbers',
        'Notice hypnagogic hallucinations but stay calm',
        'When the dream forms around you, you\'ll be lucid'
      ],
      timeToPerform: 'Early morning after WBTB',
      successRate: 85,
      difficulty: 'advanced',
      category: 'induction'
    },
    {
      id: 'reality_checks',
      name: 'Reality Check Method',
      acronym: 'RC',
      description: 'Build habit of questioning reality throughout the day',
      steps: [
        'Perform reality checks 10-20 times per day',
        'Ask yourself "Am I dreaming?" each time',
        'Look for dream signs and inconsistencies',
        'Really question your state of consciousness',
        'The habit will carry into your dreams'
      ],
      timeToPerform: 'Throughout the day',
      successRate: 60,
      difficulty: 'beginner',
      category: 'induction'
    },
    {
      id: 'spinning',
      name: 'Dream Spinning',
      acronym: 'SPIN',
      description: 'Stabilize lucid dreams by spinning your dream body',
      steps: [
        'When you become lucid, immediately start spinning',
        'Spin like a child with arms outstretched',
        'Feel the centrifugal force in the dream',
        'While spinning, shout "Increase clarity now!"',
        'Stop spinning and observe the stabilized dream'
      ],
      timeToPerform: 'Immediately upon becoming lucid',
      successRate: 80,
      difficulty: 'intermediate',
      category: 'stabilization'
    },
    {
      id: 'hand_rubbing',
      name: 'Hand Rubbing Technique',
      acronym: 'HANDS',
      description: 'Stabilize dreams by rubbing your hands together',
      steps: [
        'As soon as you realize you\'re dreaming, look at your hands',
        'Rub your palms together vigorously',
        'Feel the friction and warmth',
        'Focus on the tactile sensation',
        'This grounds you in the dream body'
      ],
      timeToPerform: 'When dream starts to fade',
      successRate: 70,
      difficulty: 'beginner',
      category: 'stabilization'
    },
    {
      id: 'expectation',
      name: 'Expectation Technique',
      acronym: 'EXPECT',
      description: 'Use expectation to control dream elements',
      steps: [
        'Decide what you want to happen in the dream',
        'Firmly expect it to work',
        'Don\'t doubt or question - just expect',
        'Turn around or look away briefly',
        'When you look back, your expectation should manifest'
      ],
      timeToPerform: 'During stable lucid dream',
      successRate: 65,
      difficulty: 'intermediate',
      category: 'control'
    }
  ];

  const filteredTechniques = techniques.filter(technique => 
    filter === 'all' || technique.difficulty === filter
  );

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'induction': return '🚀';
      case 'stabilization': return '⚖️';
      case 'control': return '🎮';
      default: return '📚';
    }
  };

  return (
    <div className="bg-white/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-yellow-400">📚 Technique Library</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
        >
          <option value="all" className="bg-gray-800">All Levels</option>
          <option value="beginner" className="bg-gray-800">Beginner</option>
          <option value="intermediate" className="bg-gray-800">Intermediate</option>
          <option value="advanced" className="bg-gray-800">Advanced</option>
        </select>
      </div>

      {!selectedTechnique ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTechniques.map(technique => (
            <div
              key={technique.id}
              onClick={() => setSelectedTechnique(technique)}
              className="bg-white/5 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-colors border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCategoryIcon(technique.category)}</span>
                  <h4 className="font-bold text-white">{technique.acronym}</h4>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(technique.difficulty)} bg-white/10`}>
                  {technique.difficulty}
                </span>
              </div>
              <h5 className="font-medium text-gray-300 mb-2">{technique.name}</h5>
              <p className="text-sm text-gray-400 mb-3">{technique.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Success Rate: {technique.successRate}%</span>
                <span>{technique.timeToPerform}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedTechnique(null)}
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
          >
            ← Back to library
          </button>
          
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{getCategoryIcon(selectedTechnique.category)}</span>
              <div>
                <h4 className="text-2xl font-bold text-white">{selectedTechnique.acronym}</h4>
                <h5 className="text-lg text-gray-300">{selectedTechnique.name}</h5>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">{selectedTechnique.successRate}%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${getDifficultyColor(selectedTechnique.difficulty)}`}>
                  {selectedTechnique.difficulty}
                </div>
                <div className="text-sm text-gray-400">Difficulty</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">{selectedTechnique.category}</div>
                <div className="text-sm text-gray-400">Category</div>
              </div>
            </div>
            
            <div className="mb-6">
              <h6 className="font-bold text-white mb-2">Description</h6>
              <p className="text-gray-300">{selectedTechnique.description}</p>
            </div>
            
            <div className="mb-6">
              <h6 className="font-bold text-white mb-3">Step-by-Step Instructions</h6>
              <ol className="list-decimal list-inside space-y-2">
                {selectedTechnique.steps.map((step, index) => (
                  <li key={index} className="text-gray-300">{step}</li>
                ))}
              </ol>
            </div>
            
            <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
              <h6 className="font-bold text-blue-300 mb-2">⏰ When to Use</h6>
              <p className="text-blue-200">{selectedTechnique.timeToPerform}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Lucid Dreaming Trainer Component
export const LucidDreamingTrainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checks' | 'signs' | 'techniques' | 'progress'>('checks');
  const [progress, setProgress] = useState({
    totalChecks: 47,
    successfulChecks: 38,
    dreamSigns: 12,
    recognizedSigns: 5,
    lucidDreams: 8,
    totalDreams: 23
  });

  const tabs = [
    { id: 'checks', label: '🔍 Reality Checks', icon: '🔍' },
    { id: 'signs', label: '🎯 Dream Signs', icon: '🎯' },
    { id: 'techniques', label: '📚 Techniques', icon: '📚' },
    { id: 'progress', label: '📊 Progress', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🌙 Lucid Dreaming Trainer 🌙
          </h1>
          <p className="text-xl text-gray-300">
            Master the art of conscious dreaming with interactive training tools
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/10 rounded-lg p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'checks' && <RealityCheckTrainer />}
          {activeTab === 'signs' && <DreamSignTrainer />}
          {activeTab === 'techniques' && <TechniqueLibrary />}
          
          {activeTab === 'progress' && (
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-6">📊 Your Progress</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {((progress.successfulChecks / progress.totalChecks) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-300">Reality Check Success</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {progress.successfulChecks}/{progress.totalChecks} checks
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {((progress.recognizedSigns / progress.dreamSigns) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-300">Dream Sign Recognition</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {progress.recognizedSigns}/{progress.dreamSigns} signs
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {((progress.lucidDreams / progress.totalDreams) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-300">Lucidity Rate</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {progress.lucidDreams}/{progress.totalDreams} dreams
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-white/5 rounded-lg p-4">
                <h4 className="font-bold text-white mb-3">💡 Training Tips</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Perform reality checks at least 10 times per day</li>
                  <li>• Keep a dream journal to identify recurring dream signs</li>
                  <li>• Practice the MILD technique every night for best results</li>
                  <li>• Be patient - lucid dreaming is a skill that takes time to develop</li>
                  <li>• Maintain consistent sleep schedule for better dream recall</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 