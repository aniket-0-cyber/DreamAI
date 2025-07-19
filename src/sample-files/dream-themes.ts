// Dream Themes and Symbols Database for DreamAI Application
// This file contains comprehensive dream interpretation data

export interface DreamTheme {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  emotions: string[];
  interpretation: string;
  symbolism: string;
  commonVariations: string[];
  psychologicalMeaning: string;
  spiritualMeaning?: string;
  frequency: 'common' | 'uncommon' | 'rare';
}

export interface DreamSymbol {
  id: string;
  name: string;
  category: string;
  universalMeaning: string;
  personalMeanings: string[];
  emotionalAssociations: Array<{ emotion: string; intensity: number }>;
  culturalVariations: Array<{ culture: string; meaning: string }>;
  relatedSymbols: string[];
  dreamContexts: string[];
}

// Comprehensive Dream Themes Database
export const dreamThemes: DreamTheme[] = [
  {
    id: 'flying',
    name: 'Flying Dreams',
    description: 'Dreams where the dreamer is flying, soaring, or floating through the air',
    keywords: ['flying', 'soaring', 'floating', 'levitating', 'wings', 'airborne'],
    emotions: ['freedom', 'joy', 'exhilaration', 'peace', 'power'],
    interpretation: 'Flying dreams often represent a desire for freedom, escape from limitations, or a sense of rising above current challenges.',
    symbolism: 'Freedom, transcendence, spiritual elevation, overcoming obstacles',
    commonVariations: ['Flying with wings', 'Flying without wings', 'Difficulty staying airborne', 'Flying too high'],
    psychologicalMeaning: 'May indicate feelings of empowerment, desire for autonomy, or need to gain perspective on life situations',
    spiritualMeaning: 'Represents spiritual ascension, connection to higher consciousness, or soul liberation',
    frequency: 'common'
  },
  {
    id: 'falling',
    name: 'Falling Dreams',
    description: 'Dreams involving falling from heights, losing control, or sudden drops',
    keywords: ['falling', 'dropping', 'plummeting', 'losing balance', 'cliff', 'height'],
    emotions: ['fear', 'anxiety', 'panic', 'helplessness', 'loss of control'],
    interpretation: 'Falling dreams typically symbolize feelings of losing control, fear of failure, or anxiety about life circumstances.',
    symbolism: 'Loss of control, fear of failure, insecurity, overwhelming situations',
    commonVariations: ['Falling from a building', 'Falling into water', 'Endless falling', 'Being pushed'],
    psychologicalMeaning: 'Often reflects real-life anxieties, fear of losing status, or feeling overwhelmed by responsibilities',
    spiritualMeaning: 'May represent spiritual descent, loss of faith, or need for grounding',
    frequency: 'common'
  },
  {
    id: 'chase',
    name: 'Being Chased',
    description: 'Dreams where the dreamer is being pursued by people, animals, or unknown forces',
    keywords: ['chasing', 'pursuing', 'running away', 'escaping', 'hiding', 'hunting'],
    emotions: ['fear', 'anxiety', 'panic', 'stress', 'urgency'],
    interpretation: 'Chase dreams often represent avoidance of confronting issues, fears, or responsibilities in waking life.',
    symbolism: 'Avoidance, unresolved conflicts, suppressed emotions, fear of confrontation',
    commonVariations: ['Being chased by animals', 'Chased by unknown figures', 'Unable to run fast', 'Hiding from pursuer'],
    psychologicalMeaning: 'Indicates running from problems, avoiding difficult emotions, or fear of facing consequences',
    frequency: 'common'
  },
  {
    id: 'water',
    name: 'Water Dreams',
    description: 'Dreams featuring oceans, rivers, floods, swimming, or other water elements',
    keywords: ['water', 'ocean', 'river', 'lake', 'swimming', 'drowning', 'waves', 'flood'],
    emotions: ['calm', 'fear', 'cleansing', 'renewal', 'overwhelm'],
    interpretation: 'Water dreams relate to emotions, the subconscious mind, purification, and life transitions.',
    symbolism: 'Emotions, subconscious, purification, life flow, spiritual cleansing',
    commonVariations: ['Clear calm water', 'Turbulent storms', 'Swimming underwater', 'Drowning or struggling'],
    psychologicalMeaning: 'Reflects emotional state, need for emotional release, or processing of deep feelings',
    spiritualMeaning: 'Represents spiritual cleansing, rebirth, or connection to divine feminine energy',
    frequency: 'common'
  },
  {
    id: 'death',
    name: 'Death Dreams',
    description: 'Dreams involving death of self, loved ones, or symbolic death and rebirth',
    keywords: ['death', 'dying', 'funeral', 'grave', 'corpse', 'resurrection', 'afterlife'],
    emotions: ['fear', 'sadness', 'peace', 'transformation', 'release'],
    interpretation: 'Death dreams rarely predict actual death but symbolize endings, transformations, and new beginnings.',
    symbolism: 'Transformation, endings, rebirth, letting go, major life changes',
    commonVariations: ['Own death', 'Death of loved ones', 'Witnessing death', 'Coming back to life'],
    psychologicalMeaning: 'Represents major life transitions, need to let go of old patterns, or fear of change',
    spiritualMeaning: 'Symbolizes spiritual transformation, ego death, or transition to higher consciousness',
    frequency: 'uncommon'
  },
  {
    id: 'school_work',
    name: 'School/Work Dreams',
    description: 'Dreams about school tests, work presentations, being unprepared, or performance anxiety',
    keywords: ['school', 'test', 'exam', 'work', 'presentation', 'unprepared', 'late', 'performance'],
    emotions: ['anxiety', 'stress', 'pressure', 'inadequacy', 'fear of failure'],
    interpretation: 'These dreams reflect performance anxiety, fear of judgment, or feelings of being unprepared in life.',
    symbolism: 'Performance anxiety, self-evaluation, fear of judgment, preparation concerns',
    commonVariations: ['Forgetting about an exam', 'Being late to work', 'Unprepared presentation', 'Cant find classroom'],
    psychologicalMeaning: 'Indicates stress about performance, self-doubt, or fear of not meeting expectations',
    frequency: 'common'
  },
  {
    id: 'lost',
    name: 'Being Lost',
    description: 'Dreams about being lost, unable to find way home, or searching for something',
    keywords: ['lost', 'searching', 'maze', 'wandering', 'direction', 'path', 'confusion'],
    emotions: ['confusion', 'anxiety', 'frustration', 'helplessness', 'uncertainty'],
    interpretation: 'Being lost in dreams represents confusion about life direction, feeling uncertain about decisions.',
    symbolism: 'Life direction, confusion, search for meaning, lack of clarity',
    commonVariations: ['Lost in familiar places', 'Searching for home', 'Maze or labyrinth', 'Missing transportation'],
    psychologicalMeaning: 'Reflects uncertainty about life path, need for guidance, or feeling directionless',
    spiritualMeaning: 'Represents spiritual seeking, need for divine guidance, or soul searching',
    frequency: 'common'
  },
  {
    id: 'naked',
    name: 'Naked in Public',
    description: 'Dreams about being naked or inappropriately dressed in public situations',
    keywords: ['naked', 'nude', 'undressed', 'exposed', 'embarrassed', 'vulnerability'],
    emotions: ['embarrassment', 'shame', 'vulnerability', 'exposure', 'anxiety'],
    interpretation: 'Nakedness dreams represent feelings of vulnerability, fear of exposure, or authenticity concerns.',
    symbolism: 'Vulnerability, authenticity, exposure, shame, fear of judgment',
    commonVariations: ['Completely naked', 'Partially clothed', 'No one notices', 'Trying to cover up'],
    psychologicalMeaning: 'Indicates fear of being seen as inadequate, impostor syndrome, or desire for authenticity',
    frequency: 'common'
  },
  {
    id: 'deceased_loved_ones',
    name: 'Visits from Deceased',
    description: 'Dreams where deceased family members or friends appear alive and communicate',
    keywords: ['deceased', 'dead', 'grandmother', 'grandfather', 'ghost', 'spirit', 'afterlife'],
    emotions: ['love', 'comfort', 'sadness', 'peace', 'longing', 'healing'],
    interpretation: 'These dreams often provide comfort, closure, or guidance during difficult times.',
    symbolism: 'Guidance, unfinished business, comfort, spiritual connection, healing',
    commonVariations: ['Peaceful conversations', 'Receiving advice', 'Just their presence', 'Saying goodbye'],
    psychologicalMeaning: 'Represents grief processing, need for comfort, or working through unresolved feelings',
    spiritualMeaning: 'May represent actual spiritual visitation, soul communication, or divine comfort',
    frequency: 'uncommon'
  },
  {
    id: 'prophetic',
    name: 'Prophetic Dreams',
    description: 'Dreams that seem to predict future events or provide supernatural insights',
    keywords: ['future', 'prediction', 'vision', 'prophecy', 'premonition', 'divine'],
    emotions: ['awe', 'fear', 'clarity', 'purpose', 'responsibility'],
    interpretation: 'These rare dreams may provide genuine insight, intuitive knowledge, or symbolic guidance.',
    symbolism: 'Divine communication, intuitive wisdom, future preparation, spiritual gifts',
    commonVariations: ['Seeing future events', 'Receiving divine messages', 'Symbolic visions', 'Warning dreams'],
    psychologicalMeaning: 'May represent heightened intuition, subconscious pattern recognition, or deep wisdom',
    spiritualMeaning: 'Possible divine communication, prophetic gifts, or spiritual awakening',
    frequency: 'rare'
  }
];

// Comprehensive Dream Symbols Database
export const dreamSymbols: DreamSymbol[] = [
  {
    id: 'water',
    name: 'Water',
    category: 'Nature',
    universalMeaning: 'Emotions, subconscious mind, purification, life force',
    personalMeanings: ['Emotional cleansing', 'Need for renewal', 'Overwhelming feelings', 'Spiritual baptism'],
    emotionalAssociations: [
      { emotion: 'peace', intensity: 8 },
      { emotion: 'fear', intensity: 6 },
      { emotion: 'renewal', intensity: 9 }
    ],
    culturalVariations: [
      { culture: 'Western', meaning: 'Emotions and subconscious' },
      { culture: 'Eastern', meaning: 'Flow of chi, life energy' },
      { culture: 'Native American', meaning: 'Sacred life force, healing' }
    ],
    relatedSymbols: ['ocean', 'river', 'rain', 'swimming', 'drowning'],
    dreamContexts: ['Swimming peacefully', 'Drowning or struggling', 'Clear calm waters', 'Turbulent storms']
  },
  {
    id: 'snake',
    name: 'Snake',
    category: 'Animals',
    universalMeaning: 'Transformation, wisdom, hidden fears, sexuality, healing',
    personalMeanings: ['Personal transformation', 'Hidden threats', 'Sexual energy', 'Medical healing'],
    emotionalAssociations: [
      { emotion: 'fear', intensity: 7 },
      { emotion: 'fascination', intensity: 6 },
      { emotion: 'wisdom', intensity: 8 }
    ],
    culturalVariations: [
      { culture: 'Western', meaning: 'Temptation, danger, or medicine' },
      { culture: 'Eastern', meaning: 'Kundalini energy, spiritual power' },
      { culture: 'Ancient Egyptian', meaning: 'Divine protection, royal power' }
    ],
    relatedSymbols: ['serpent', 'dragon', 'staff', 'garden', 'medicine'],
    dreamContexts: ['Snake biting', 'Snake speaking', 'Multiple snakes', 'Snake shedding skin']
  },
  {
    id: 'house',
    name: 'House',
    category: 'Buildings',
    universalMeaning: 'Self, personality, different aspects of psyche, security, family',
    personalMeanings: ['Self-exploration', 'Family dynamics', 'Personal security', 'Hidden aspects of self'],
    emotionalAssociations: [
      { emotion: 'security', intensity: 8 },
      { emotion: 'nostalgia', intensity: 7 },
      { emotion: 'curiosity', intensity: 6 }
    ],
    culturalVariations: [
      { culture: 'Universal', meaning: 'Representation of the self and psyche' },
      { culture: 'Western', meaning: 'Personal identity and family foundation' },
      { culture: 'Eastern', meaning: 'Ancestral connections and spiritual dwelling' }
    ],
    relatedSymbols: ['rooms', 'doors', 'windows', 'basement', 'attic'],
    dreamContexts: ['Exploring unknown rooms', 'Childhood home', 'Haunted house', 'Building or renovating']
  },
  {
    id: 'car',
    name: 'Car/Vehicle',
    category: 'Transportation',
    universalMeaning: 'Personal control, life direction, progress, independence',
    personalMeanings: ['Life direction', 'Personal autonomy', 'Progress toward goals', 'Loss of control'],
    emotionalAssociations: [
      { emotion: 'control', intensity: 8 },
      { emotion: 'freedom', intensity: 7 },
      { emotion: 'anxiety', intensity: 5 }
    ],
    culturalVariations: [
      { culture: 'Modern Western', meaning: 'Personal freedom and control over destiny' },
      { culture: 'Status-conscious societies', meaning: 'Social standing and success' }
    ],
    relatedSymbols: ['driving', 'road', 'journey', 'accident', 'steering wheel'],
    dreamContexts: ['Driving out of control', 'Car breaking down', 'Being passenger', 'Luxury vehicle']
  },
  {
    id: 'baby',
    name: 'Baby',
    category: 'People',
    universalMeaning: 'New beginnings, innocence, potential, responsibility, creativity',
    personalMeanings: ['New project or idea', 'Desire for children', 'Inner child healing', 'Fresh start'],
    emotionalAssociations: [
      { emotion: 'tenderness', intensity: 9 },
      { emotion: 'responsibility', intensity: 7 },
      { emotion: 'hope', intensity: 8 }
    ],
    culturalVariations: [
      { culture: 'Universal', meaning: 'New life, innocence, and potential' },
      { culture: 'Eastern', meaning: 'Karmic rebirth, spiritual renewal' },
      { culture: 'Western', meaning: 'New opportunities, creative projects' }
    ],
    relatedSymbols: ['birth', 'mother', 'cradle', 'milk', 'protection'],
    dreamContexts: ['Caring for baby', 'Lost baby', 'Baby speaking', 'Multiple babies']
  }
];

// Theme Analysis Functions
export class ThemeAnalyzer {
  /**
   * Identifies themes in dream text
   */
  static identifyThemes(dreamText: string): DreamTheme[] {
    const text = dreamText.toLowerCase();
    const matchedThemes: Array<{ theme: DreamTheme; score: number }> = [];

    dreamThemes.forEach(theme => {
      let score = 0;
      
      // Check keywords
      theme.keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          score += 3;
        }
      });
      
      // Check emotions
      theme.emotions.forEach(emotion => {
        if (text.includes(emotion)) {
          score += 2;
        }
      });
      
      // Check variations
      theme.commonVariations.forEach(variation => {
        const variationWords = variation.toLowerCase().split(' ');
        const matchingWords = variationWords.filter(word => text.includes(word));
        score += matchingWords.length;
      });

      if (score > 0) {
        matchedThemes.push({ theme, score });
      }
    });

    return matchedThemes
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.theme);
  }

  /**
   * Identifies symbols in dream text
   */
  static identifySymbols(dreamText: string): DreamSymbol[] {
    const text = dreamText.toLowerCase();
    const matchedSymbols: DreamSymbol[] = [];

    dreamSymbols.forEach(symbol => {
      if (text.includes(symbol.name.toLowerCase())) {
        matchedSymbols.push(symbol);
      }
      
      // Check related symbols
      symbol.relatedSymbols.forEach(related => {
        if (text.includes(related.toLowerCase()) && !matchedSymbols.includes(symbol)) {
          matchedSymbols.push(symbol);
        }
      });
    });

    return matchedSymbols;
  }

  /**
   * Generates interpretation based on themes and symbols
   */
  static generateInterpretation(themes: DreamTheme[], symbols: DreamSymbol[]): {
    summary: string;
    detailed: string;
    guidance: string[];
  } {
    if (themes.length === 0 && symbols.length === 0) {
      return {
        summary: 'This dream reflects your subconscious processing of daily experiences.',
        detailed: 'While specific themes weren\'t clearly identified, your dream represents your mind\'s natural way of organizing thoughts and emotions.',
        guidance: ['Keep a consistent dream journal', 'Pay attention to recurring elements', 'Consider your current life circumstances']
      };
    }

    const primaryTheme = themes[0];
    const primarySymbol = symbols[0];

    let summary = '';
    let detailed = '';
    const guidance: string[] = [];

    if (primaryTheme) {
      summary = `This dream primarily relates to ${primaryTheme.name.toLowerCase()}, suggesting ${primaryTheme.interpretation.split('.')[0].toLowerCase()}.`;
      detailed = `${primaryTheme.interpretation} ${primaryTheme.psychologicalMeaning}`;
      
      if (primaryTheme.spiritualMeaning) {
        detailed += ` From a spiritual perspective, ${primaryTheme.spiritualMeaning.toLowerCase()}.`;
      }
    }

    if (primarySymbol) {
      if (summary) {
        summary += ` The presence of ${primarySymbol.name.toLowerCase()} adds themes of ${primarySymbol.universalMeaning.toLowerCase()}.`;
      } else {
        summary = `The symbol of ${primarySymbol.name} in your dream represents ${primarySymbol.universalMeaning.toLowerCase()}.`;
      }
      
      detailed += ` The ${primarySymbol.name.toLowerCase()} symbol carries deep meaning related to ${primarySymbol.universalMeaning.toLowerCase()}.`;
    }

    // Generate guidance based on themes
    if (primaryTheme) {
      switch (primaryTheme.id) {
        case 'flying':
          guidance.push('Embrace opportunities for personal freedom', 'Consider what limitations you can overcome');
          break;
        case 'falling':
          guidance.push('Identify areas where you feel out of control', 'Practice grounding techniques');
          break;
        case 'chase':
          guidance.push('Face the issues you\'ve been avoiding', 'Consider what you\'re running from');
          break;
        case 'water':
          guidance.push('Pay attention to your emotional needs', 'Consider practices that bring emotional balance');
          break;
        default:
          guidance.push('Reflect on the emotions this dream brought up', 'Consider how this relates to your current life');
      }
    }

    return { summary, detailed, guidance };
  }
}

// Export helper functions
export const getThemeByName = (name: string): DreamTheme | undefined => {
  return dreamThemes.find(theme => theme.name.toLowerCase().includes(name.toLowerCase()));
};

export const getSymbolByName = (name: string): DreamSymbol | undefined => {
  return dreamSymbols.find(symbol => symbol.name.toLowerCase() === name.toLowerCase());
};

export const getThemesByFrequency = (frequency: 'common' | 'uncommon' | 'rare'): DreamTheme[] => {
  return dreamThemes.filter(theme => theme.frequency === frequency);
};

export const getSymbolsByCategory = (category: string): DreamSymbol[] => {
  return dreamSymbols.filter(symbol => symbol.category.toLowerCase() === category.toLowerCase());
}; 