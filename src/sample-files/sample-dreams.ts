// Sample Dream Data for DreamAI Application
// This file contains example dreams that showcase the data models

import { 
  Dream, 
  DreamInterpretation, 
  DreamJournalEntry, 
  EmotionType, 
  SymbolCategory, 
  LucidityLevel, 
  SleepQuality,
  MoodRating,
  InterpretationStyle
} from './dream-types';

export const sampleDreams: Dream[] = [
  {
    id: 'dream-001',
    userId: 'user-123',
    title: 'Flying Over the Ocean',
    description: 'I was soaring above crystal blue waters, feeling completely free. The sun was setting, painting the sky in brilliant oranges and purples. Below me, dolphins were jumping in perfect synchronization. I felt an overwhelming sense of peace and joy.',
    dreamDate: new Date('2024-01-15'),
    emotions: [
      { type: EmotionType.JOY, intensity: 9, context: 'Flying sensation' },
      { type: EmotionType.PEACE, intensity: 8, context: 'Ocean vista' },
      { type: EmotionType.WONDER, intensity: 7, context: 'Dolphins dancing' }
    ],
    symbols: [
      {
        id: 'symbol-001',
        name: 'Flying',
        description: 'Soaring through the air without wings',
        category: SymbolCategory.ACTIVITIES,
        universalMeaning: 'Freedom, transcendence, escape from limitations',
        frequency: 3,
        emotionalWeight: 0.8
      },
      {
        id: 'symbol-002',
        name: 'Ocean',
        description: 'Vast body of crystal blue water',
        category: SymbolCategory.NATURE,
        universalMeaning: 'Emotions, subconscious, life flow',
        frequency: 5,
        emotionalWeight: 0.6
      },
      {
        id: 'symbol-003',
        name: 'Dolphins',
        description: 'Jumping in synchronized patterns',
        category: SymbolCategory.ANIMALS,
        universalMeaning: 'Intelligence, playfulness, spiritual guidance',
        frequency: 1,
        emotionalWeight: 0.9
      }
    ],
    lucidityLevel: 'medium',
    sleepQuality: 'excellent',
    tags: ['flying', 'ocean', 'animals', 'peaceful', 'spiritual'],
    isPublic: true,
    createdAt: new Date('2024-01-16T08:30:00Z'),
    updatedAt: new Date('2024-01-16T08:30:00Z')
  },
  {
    id: 'dream-002',
    userId: 'user-123',
    title: 'Lost in a Dark Forest',
    description: 'I found myself wandering through a dense, dark forest. The trees seemed to whisper my name, but I couldn\'t see the path. A small light appeared in the distance, and I followed it despite my fear. Eventually, I emerged into a beautiful clearing with a ancient tree in the center.',
    dreamDate: new Date('2024-01-12'),
    emotions: [
      { type: EmotionType.FEAR, intensity: 7, context: 'Lost and confused' },
      { type: EmotionType.ANXIETY, intensity: 6, context: 'Dark surroundings' },
      { type: EmotionType.HOPE, intensity: 5, context: 'Following the light' },
      { type: EmotionType.RELIEF, intensity: 8, context: 'Finding the clearing' }
    ],
    symbols: [
      {
        id: 'symbol-004',
        name: 'Dark Forest',
        description: 'Dense woodland with limited visibility',
        category: SymbolCategory.NATURE,
        universalMeaning: 'Unknown aspects of self, confusion, spiritual journey',
        frequency: 2,
        emotionalWeight: -0.3
      },
      {
        id: 'symbol-005',
        name: 'Light',
        description: 'Small guiding light in darkness',
        category: SymbolCategory.OBJECTS,
        universalMeaning: 'Guidance, hope, enlightenment, divine presence',
        frequency: 4,
        emotionalWeight: 0.7
      },
      {
        id: 'symbol-006',
        name: 'Ancient Tree',
        description: 'Large, old tree in a clearing',
        category: SymbolCategory.NATURE,
        universalMeaning: 'Wisdom, growth, connection to nature, stability',
        frequency: 2,
        emotionalWeight: 0.8
      }
    ],
    lucidityLevel: 'low',
    sleepQuality: 'fair',
    tags: ['forest', 'lost', 'guidance', 'transformation', 'nature'],
    isPublic: false,
    createdAt: new Date('2024-01-13T07:15:00Z'),
    updatedAt: new Date('2024-01-13T07:15:00Z')
  },
  {
    id: 'dream-003',
    userId: 'user-456',
    title: 'Reunion with Grandmother',
    description: 'My grandmother, who passed away five years ago, appeared in my childhood home. She was baking cookies in the kitchen, and the whole house smelled like cinnamon and love. We sat together and talked about my life. She told me she was proud of me and that everything would be okay.',
    dreamDate: new Date('2024-01-10'),
    emotions: [
      { type: EmotionType.LOVE, intensity: 10, context: 'Being with grandmother' },
      { type: EmotionType.NOSTALGIA, intensity: 8, context: 'Childhood home' },
      { type: EmotionType.PEACE, intensity: 9, context: 'Her reassurance' },
      { type: EmotionType.SADNESS, intensity: 4, context: 'Missing her' }
    ],
    symbols: [
      {
        id: 'symbol-007',
        name: 'Deceased Grandmother',
        description: 'Grandmother who passed away appearing alive',
        category: SymbolCategory.PEOPLE,
        universalMeaning: 'Wisdom, guidance, unresolved grief, spiritual connection',
        frequency: 1,
        emotionalWeight: 0.9
      },
      {
        id: 'symbol-008',
        name: 'Childhood Home',
        description: 'The house where dreamer grew up',
        category: SymbolCategory.PLACES,
        universalMeaning: 'Security, foundation, past memories, comfort',
        frequency: 3,
        emotionalWeight: 0.7
      },
      {
        id: 'symbol-009',
        name: 'Baking Cookies',
        description: 'Making cookies in the kitchen',
        category: SymbolCategory.ACTIVITIES,
        universalMeaning: 'Nurturing, love, comfort, creating sweetness in life',
        frequency: 1,
        emotionalWeight: 0.8
      }
    ],
    lucidityLevel: 'none',
    sleepQuality: 'good',
    tags: ['family', 'deceased', 'comfort', 'guidance', 'spiritual'],
    isPublic: true,
    createdAt: new Date('2024-01-11T06:45:00Z'),
    updatedAt: new Date('2024-01-11T06:45:00Z')
  }
];

export const sampleInterpretations: DreamInterpretation[] = [
  {
    id: 'interp-001',
    dreamId: 'dream-001',
    summary: 'This dream represents a period of personal freedom and spiritual elevation in your life.',
    detailedAnalysis: 'Flying dreams often symbolize liberation from constraints and a desire for freedom. The ocean represents your emotional depth and subconscious mind. The dolphins suggest you\'re in harmony with your intuitive, playful nature. The sunset indicates a transition or ending that brings beauty and wisdom.',
    psychologicalInsights: [
      'You may be experiencing or seeking greater autonomy in your waking life',
      'Your emotional state is currently balanced and flowing naturally',
      'You have a strong connection to your intuitive and creative side'
    ],
    symbolInterpretations: [
      {
        symbolId: 'symbol-001',
        interpretation: 'Flying represents your desire to rise above current limitations and gain a higher perspective on life challenges.',
        relevance: 0.9,
        connections: ['freedom', 'transcendence', 'spiritual growth']
      },
      {
        symbolId: 'symbol-002',
        interpretation: 'The ocean reflects your deep emotional wisdom and the vastness of your subconscious mind.',
        relevance: 0.8,
        connections: ['emotions', 'depth', 'life flow']
      },
      {
        symbolId: 'symbol-003',
        interpretation: 'Dolphins symbolize your playful intelligence and suggest spiritual guides are present in your life.',
        relevance: 0.7,
        connections: ['guidance', 'intelligence', 'joy']
      }
    ],
    emotionalPatterns: [
      {
        primaryEmotion: EmotionType.JOY,
        secondaryEmotions: [EmotionType.PEACE, EmotionType.WONDER],
        pattern: 'Elevated positive emotions with spiritual undertones',
        significance: 'Indicates a period of emotional and spiritual well-being'
      }
    ],
    recommendations: [
      'Continue pursuing activities that give you a sense of freedom and joy',
      'Pay attention to your intuitive insights during this period',
      'Consider spending more time near water for emotional balance'
    ],
    confidence: 0.85,
    generatedAt: new Date('2024-01-16T09:00:00Z'),
    aiModel: 'DreamAI-v2.1'
  },
  {
    id: 'interp-002',
    dreamId: 'dream-002',
    summary: 'This dream reflects a journey through confusion toward clarity and wisdom.',
    detailedAnalysis: 'Being lost in a dark forest represents navigating through uncertainty or confusion in your waking life. The guiding light symbolizes hope, intuition, or spiritual guidance that helps you find your way. The ancient tree in the clearing represents wisdom, stability, and connection to your deeper self.',
    psychologicalInsights: [
      'You may be currently facing uncertainty or major decisions',
      'Your inner wisdom is guiding you toward resolution',
      'Trust in your ability to find clarity will lead to positive outcomes'
    ],
    symbolInterpretations: [
      {
        symbolId: 'symbol-004',
        interpretation: 'The dark forest represents aspects of yourself or your situation that are unclear or unknown.',
        relevance: 0.9,
        connections: ['confusion', 'unknown', 'spiritual journey']
      },
      {
        symbolId: 'symbol-005',
        interpretation: 'The guiding light symbolizes your inner wisdom and intuition leading you through difficult times.',
        relevance: 0.8,
        connections: ['guidance', 'hope', 'intuition']
      },
      {
        symbolId: 'symbol-006',
        interpretation: 'The ancient tree represents the wisdom and stability you will find after navigating through confusion.',
        relevance: 0.7,
        connections: ['wisdom', 'stability', 'growth']
      }
    ],
    emotionalPatterns: [
      {
        primaryEmotion: EmotionType.FEAR,
        secondaryEmotions: [EmotionType.ANXIETY, EmotionType.HOPE, EmotionType.RELIEF],
        pattern: 'Journey from fear through hope to relief',
        significance: 'Shows a natural progression toward resolution and peace'
      }
    ],
    recommendations: [
      'Trust your instincts when facing uncertain situations',
      'Look for signs of guidance in your daily life',
      'Remember that confusion often precedes clarity and growth'
    ],
    confidence: 0.78,
    generatedAt: new Date('2024-01-13T08:30:00Z'),
    aiModel: 'DreamAI-v2.1'
  }
];

export const sampleJournalEntries: DreamJournalEntry[] = [
  {
    dream: sampleDreams[0],
    interpretation: sampleInterpretations[0],
    userNotes: 'This dream felt so real and uplifting. I woke up feeling energized and optimistic about my day. The feeling of flying was incredible - like nothing could hold me back.',
    mood: 'very-positive',
    sleepContext: {
      bedtime: '10:30 PM',
      wakeTime: '7:15 AM',
      sleepDuration: 8.75,
      sleepDisruptions: [],
      substances: [],
      stressLevel: 2
    }
  },
  {
    dream: sampleDreams[1],
    interpretation: sampleInterpretations[1],
    userNotes: 'This dream was unsettling at first, but I felt relieved when I found the clearing. I think it might relate to the job decision I\'ve been struggling with.',
    mood: 'neutral',
    sleepContext: {
      bedtime: '11:45 PM',
      wakeTime: '6:30 AM',
      sleepDuration: 6.75,
      sleepDisruptions: ['woke up around 3 AM'],
      substances: ['caffeine (evening coffee)'],
      stressLevel: 6
    }
  },
  {
    dream: sampleDreams[2],
    userNotes: 'Such a beautiful and comforting dream. I miss my grandmother so much, but this dream felt like a real visit from her. I woke up feeling her love and presence.',
    mood: 'positive',
    sleepContext: {
      bedtime: '10:00 PM',
      wakeTime: '6:45 AM',
      sleepDuration: 8.75,
      sleepDisruptions: [],
      substances: [],
      stressLevel: 3
    }
  }
];

// Helper function to get dreams by emotion
export function getDreamsByEmotion(emotion: EmotionType): Dream[] {
  return sampleDreams.filter(dream => 
    dream.emotions.some(e => e.type === emotion)
  );
}

// Helper function to get most common symbols
export function getMostCommonSymbols(): { name: string; frequency: number }[] {
  const symbolMap = new Map<string, number>();
  
  sampleDreams.forEach(dream => {
    dream.symbols.forEach(symbol => {
      const current = symbolMap.get(symbol.name) || 0;
      symbolMap.set(symbol.name, current + symbol.frequency);
    });
  });
  
  return Array.from(symbolMap.entries())
    .map(([name, frequency]) => ({ name, frequency }))
    .sort((a, b) => b.frequency - a.frequency);
} 