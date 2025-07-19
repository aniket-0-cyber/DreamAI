// Dream Analysis Utilities for DreamAI Application
// This file demonstrates the core logic for analyzing and interpreting dreams

import { 
  Dream, 
  DreamInterpretation, 
  DreamSymbol, 
  EmotionType, 
  SymbolCategory,
  InterpretationStyle,
  ApiResponse,
  DreamAnalysisRequest,
  DreamVisualizationData
} from './dream-types';

export class DreamAnalyzer {
  private symbolDatabase: Map<string, DreamSymbol>;
  private emotionWeights: Map<EmotionType, number>;

  constructor() {
    this.symbolDatabase = new Map();
    this.emotionWeights = new Map();
    this.initializeSymbolDatabase();
    this.initializeEmotionWeights();
  }

  /**
   * Analyzes a dream description and returns an interpretation
   */
  async analyzeDream(request: DreamAnalysisRequest): Promise<ApiResponse<DreamInterpretation>> {
    try {
      const dreamText = request.dreamText.toLowerCase();
      const symbols = this.extractSymbols(dreamText);
      const emotions = this.detectEmotions(dreamText);
      const themes = this.identifyThemes(symbols, emotions);
      
      const interpretation: DreamInterpretation = {
        id: `interp-${Date.now()}`,
        dreamId: request.userId || 'anonymous',
        summary: this.generateSummary(themes, request.analysisType),
        detailedAnalysis: this.generateDetailedAnalysis(symbols, emotions, themes, request.analysisType),
        psychologicalInsights: this.generatePsychologicalInsights(symbols, emotions, themes),
        symbolInterpretations: this.generateSymbolInterpretations(symbols),
        emotionalPatterns: this.analyzeEmotionalPatterns(emotions),
        recommendations: this.generateRecommendations(symbols, emotions, themes),
        confidence: this.calculateConfidence(symbols, emotions),
        generatedAt: new Date(),
        aiModel: 'DreamAI-v2.1'
      };

      return {
        success: true,
        data: interpretation,
        message: 'Dream analysis completed successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
    }
  }

  /**
   * Extracts symbolic elements from dream text
   */
  private extractSymbols(dreamText: string): DreamSymbol[] {
    const foundSymbols: DreamSymbol[] = [];
    const keywords = dreamText.split(/\s+/);

    // Simple keyword matching - in real implementation, this would use NLP
    for (const [symbolName, symbol] of this.symbolDatabase) {
      const variations = this.getSymbolVariations(symbolName);
      const found = variations.some(variation => 
        keywords.some(keyword => keyword.includes(variation) || variation.includes(keyword))
      );
      
      if (found) {
        foundSymbols.push(symbol);
      }
    }

    return foundSymbols;
  }

  /**
   * Detects emotional content in dream text
   */
  private detectEmotions(dreamText: string): Array<{type: EmotionType, intensity: number, context?: string}> {
    const emotions: Array<{type: EmotionType, intensity: number, context?: string}> = [];
    
    // Emotion detection keywords (simplified)
    const emotionKeywords: Record<string, {emotion: EmotionType, intensity: number}> = {
      'happy': { emotion: EmotionType.JOY, intensity: 7 },
      'joyful': { emotion: EmotionType.JOY, intensity: 8 },
      'ecstatic': { emotion: EmotionType.JOY, intensity: 10 },
      'scared': { emotion: EmotionType.FEAR, intensity: 7 },
      'terrified': { emotion: EmotionType.FEAR, intensity: 9 },
      'anxious': { emotion: EmotionType.ANXIETY, intensity: 6 },
      'worried': { emotion: EmotionType.ANXIETY, intensity: 5 },
      'peaceful': { emotion: EmotionType.PEACE, intensity: 8 },
      'calm': { emotion: EmotionType.PEACE, intensity: 6 },
      'angry': { emotion: EmotionType.ANGER, intensity: 7 },
      'furious': { emotion: EmotionType.ANGER, intensity: 9 },
      'sad': { emotion: EmotionType.SADNESS, intensity: 6 },
      'devastated': { emotion: EmotionType.SADNESS, intensity: 9 },
      'excited': { emotion: EmotionType.EXCITEMENT, intensity: 8 },
      'thrilled': { emotion: EmotionType.EXCITEMENT, intensity: 9 },
      'confused': { emotion: EmotionType.CONFUSION, intensity: 6 },
      'overwhelmed': { emotion: EmotionType.CONFUSION, intensity: 8 }
    };

    for (const [keyword, data] of Object.entries(emotionKeywords)) {
      if (dreamText.includes(keyword)) {
        emotions.push({
          type: data.emotion,
          intensity: data.intensity,
          context: `Detected from keyword: ${keyword}`
        });
      }
    }

    return emotions;
  }

  /**
   * Identifies major themes in the dream
   */
  private identifyThemes(symbols: DreamSymbol[], emotions: Array<{type: EmotionType, intensity: number}>): string[] {
    const themes: string[] = [];
    
    // Theme identification based on symbols and emotions
    const symbolCategories = symbols.map(s => s.category);
    const dominantEmotions = emotions.filter(e => e.intensity >= 7).map(e => e.type);

    // Nature theme
    if (symbolCategories.includes(SymbolCategory.NATURE) || 
        symbolCategories.includes(SymbolCategory.ANIMALS)) {
      themes.push('connection_to_nature');
    }

    // Spiritual/transcendent theme
    if (symbols.some(s => s.name.toLowerCase().includes('light') || 
                          s.name.toLowerCase().includes('flying') ||
                          s.name.toLowerCase().includes('ancient'))) {
      themes.push('spiritual_journey');
    }

    // Relationship theme
    if (symbolCategories.includes(SymbolCategory.PEOPLE)) {
      themes.push('relationships');
    }

    // Emotional healing theme
    if (dominantEmotions.includes(EmotionType.PEACE) || 
        dominantEmotions.includes(EmotionType.RELIEF)) {
      themes.push('emotional_healing');
    }

    // Personal growth theme
    if (symbols.some(s => s.universalMeaning.includes('growth') || 
                          s.universalMeaning.includes('wisdom'))) {
      themes.push('personal_growth');
    }

    return themes;
  }

  /**
   * Generates a summary based on interpretation style
   */
  private generateSummary(themes: string[], style: InterpretationStyle): string {
    const themeDescriptions: Record<string, Record<InterpretationStyle, string>> = {
      'spiritual_journey': {
        'psychological': 'This dream reflects your subconscious desire for personal transcendence and growth.',
        'spiritual': 'Your soul is embarking on a sacred journey of enlightenment and higher consciousness.',
        'symbolic': 'The symbolic elements point to transformation and elevation of consciousness.',
        'scientific': 'Neural patterns suggest processing of aspirational and self-actualization concepts.'
      },
      'connection_to_nature': {
        'psychological': 'Your psyche is seeking balance and connection with natural rhythms.',
        'spiritual': 'You are being called to reconnect with the earth\'s energy and wisdom.',
        'symbolic': 'Nature symbols represent your authentic self and primal wisdom.',
        'scientific': 'Brain activity indicates a need for environmental connection and stress reduction.'
      },
      'emotional_healing': {
        'psychological': 'Your mind is processing and integrating emotional experiences for healing.',
        'spiritual': 'Divine energy is flowing through you, bringing peace and restoration.',
        'symbolic': 'Healing symbols suggest resolution and emotional integration.',
        'scientific': 'REM sleep is facilitating emotional memory consolidation and stress processing.'
      }
    };

    if (themes.length === 0) {
      return 'This dream reflects your current life experiences and subconscious processing.';
    }

    const primaryTheme = themes[0];
    return themeDescriptions[primaryTheme]?.[style] || 
           'This dream contains meaningful symbols that reflect your inner journey.';
  }

  /**
   * Generates detailed analysis
   */
  private generateDetailedAnalysis(
    symbols: DreamSymbol[], 
    emotions: Array<{type: EmotionType, intensity: number}>,
    themes: string[],
    style: InterpretationStyle
  ): string {
    let analysis = 'This dream presents a rich tapestry of symbolic meaning. ';
    
    if (symbols.length > 0) {
      analysis += `The key symbols - ${symbols.map(s => s.name).join(', ')} - `;
      analysis += 'work together to convey important messages about your inner state. ';
    }

    if (emotions.length > 0) {
      const highIntensityEmotions = emotions.filter(e => e.intensity >= 7);
      if (highIntensityEmotions.length > 0) {
        analysis += `The strong emotional content (${highIntensityEmotions.map(e => e.type).join(', ')}) `;
        analysis += 'indicates areas of significant psychological importance. ';
      }
    }

    if (themes.length > 0) {
      analysis += `The overall themes of ${themes.join(' and ')} suggest `;
      analysis += 'this dream is guiding you toward greater self-understanding and growth.';
    }

    return analysis;
  }

  /**
   * Generates psychological insights
   */
  private generatePsychologicalInsights(
    symbols: DreamSymbol[], 
    emotions: Array<{type: EmotionType, intensity: number}>,
    themes: string[]
  ): string[] {
    const insights: string[] = [];

    if (emotions.some(e => e.type === EmotionType.FEAR || e.type === EmotionType.ANXIETY)) {
      insights.push('You may be processing underlying anxieties or fears in your waking life');
    }

    if (emotions.some(e => e.type === EmotionType.JOY || e.type === EmotionType.PEACE)) {
      insights.push('Your emotional state shows positive integration and well-being');
    }

    if (symbols.some(s => s.category === SymbolCategory.PEOPLE)) {
      insights.push('Relationships and social connections are currently significant in your life');
    }

    if (themes.includes('personal_growth')) {
      insights.push('You are in a period of personal development and self-discovery');
    }

    if (insights.length === 0) {
      insights.push('This dream reflects your mind\'s natural process of organizing daily experiences');
    }

    return insights;
  }

  /**
   * Generates symbol interpretations
   */
  private generateSymbolInterpretations(symbols: DreamSymbol[]): Array<{
    symbolId: string;
    interpretation: string;
    relevance: number;
    connections: string[];
  }> {
    return symbols.map(symbol => ({
      symbolId: symbol.id,
      interpretation: `${symbol.name} in your dream represents ${symbol.universalMeaning.toLowerCase()}. This symbol suggests ${this.getPersonalizedInterpretation(symbol)}.`,
      relevance: Math.max(0.6, symbol.emotionalWeight * 0.8 + 0.2),
      connections: this.getSymbolConnections(symbol)
    }));
  }

  /**
   * Analyzes emotional patterns
   */
  private analyzeEmotionalPatterns(emotions: Array<{type: EmotionType, intensity: number}>): Array<{
    primaryEmotion: EmotionType;
    secondaryEmotions: EmotionType[];
    pattern: string;
    significance: string;
  }> {
    if (emotions.length === 0) return [];

    const sortedEmotions = emotions.sort((a, b) => b.intensity - a.intensity);
    const primary = sortedEmotions[0];
    const secondary = sortedEmotions.slice(1, 3).map(e => e.type);

    return [{
      primaryEmotion: primary.type,
      secondaryEmotions: secondary,
      pattern: this.describeEmotionalPattern(primary.type, secondary),
      significance: this.explainEmotionalSignificance(primary.type, secondary)
    }];
  }

  /**
   * Generates recommendations
   */
  private generateRecommendations(
    symbols: DreamSymbol[], 
    emotions: Array<{type: EmotionType, intensity: number}>,
    themes: string[]
  ): string[] {
    const recommendations: string[] = [];

    if (themes.includes('spiritual_journey')) {
      recommendations.push('Consider meditation or spiritual practices to support your inner journey');
    }

    if (themes.includes('connection_to_nature')) {
      recommendations.push('Spend more time in nature to nurture this important connection');
    }

    if (emotions.some(e => e.type === EmotionType.ANXIETY || e.type === EmotionType.FEAR)) {
      recommendations.push('Practice relaxation techniques or speak with a counselor about any ongoing anxieties');
    }

    if (symbols.some(s => s.category === SymbolCategory.PEOPLE)) {
      recommendations.push('Pay attention to your relationships and communication patterns');
    }

    if (recommendations.length === 0) {
      recommendations.push('Keep a dream journal to track patterns and insights over time');
    }

    return recommendations;
  }

  /**
   * Calculates confidence score for the interpretation
   */
  private calculateConfidence(
    symbols: DreamSymbol[], 
    emotions: Array<{type: EmotionType, intensity: number}>
  ): number {
    let confidence = 0.5; // Base confidence

    // More symbols = higher confidence
    confidence += Math.min(symbols.length * 0.1, 0.3);

    // Clear emotions = higher confidence
    confidence += Math.min(emotions.length * 0.05, 0.2);

    // High emotional intensity = higher confidence
    const avgIntensity = emotions.length > 0 ? 
      emotions.reduce((sum, e) => sum + e.intensity, 0) / emotions.length : 0;
    confidence += (avgIntensity / 10) * 0.2;

    return Math.min(confidence, 0.95); // Cap at 95%
  }

  // Helper methods
  private initializeSymbolDatabase(): void {
    const commonSymbols = [
      { name: 'flying', category: SymbolCategory.ACTIVITIES, meaning: 'freedom, transcendence, escape from limitations' },
      { name: 'water', category: SymbolCategory.NATURE, meaning: 'emotions, subconscious, life flow' },
      { name: 'ocean', category: SymbolCategory.NATURE, meaning: 'emotions, subconscious, life flow' },
      { name: 'forest', category: SymbolCategory.NATURE, meaning: 'unknown aspects of self, confusion, spiritual journey' },
      { name: 'light', category: SymbolCategory.OBJECTS, meaning: 'guidance, hope, enlightenment, divine presence' },
      { name: 'tree', category: SymbolCategory.NATURE, meaning: 'wisdom, growth, connection to nature, stability' },
      { name: 'house', category: SymbolCategory.PLACES, meaning: 'self, security, foundation, past memories' },
      { name: 'car', category: SymbolCategory.TRANSPORTATION, meaning: 'personal control, life direction, progress' },
      { name: 'fire', category: SymbolCategory.NATURE, meaning: 'passion, transformation, destruction, purification' },
      { name: 'snake', category: SymbolCategory.ANIMALS, meaning: 'transformation, wisdom, hidden fears, sexuality' }
    ];

    commonSymbols.forEach((symbolData, index) => {
      const symbol: DreamSymbol = {
        id: `symbol-${index + 100}`,
        name: symbolData.name,
        description: `Common dream symbol: ${symbolData.name}`,
        category: symbolData.category,
        universalMeaning: symbolData.meaning,
        frequency: Math.floor(Math.random() * 5) + 1,
        emotionalWeight: (Math.random() - 0.5) * 1.6 // -0.8 to 0.8
      };
      this.symbolDatabase.set(symbolData.name, symbol);
    });
  }

  private initializeEmotionWeights(): void {
    this.emotionWeights.set(EmotionType.JOY, 0.8);
    this.emotionWeights.set(EmotionType.PEACE, 0.7);
    this.emotionWeights.set(EmotionType.LOVE, 0.9);
    this.emotionWeights.set(EmotionType.FEAR, -0.6);
    this.emotionWeights.set(EmotionType.ANXIETY, -0.5);
    this.emotionWeights.set(EmotionType.ANGER, -0.7);
    this.emotionWeights.set(EmotionType.SADNESS, -0.4);
  }

  private getSymbolVariations(symbolName: string): string[] {
    const variations: Record<string, string[]> = {
      'flying': ['fly', 'flying', 'soar', 'soaring', 'airborne'],
      'water': ['water', 'ocean', 'sea', 'lake', 'river', 'swimming'],
      'forest': ['forest', 'woods', 'trees', 'woodland'],
      'light': ['light', 'bright', 'glow', 'shine', 'illuminated']
    };
    return variations[symbolName] || [symbolName];
  }

  private getPersonalizedInterpretation(symbol: DreamSymbol): string {
    const interpretations = [
      'important changes or transitions in your life',
      'aspects of your personality seeking expression',
      'guidance from your subconscious mind',
      'unresolved emotions or experiences',
      'your inner wisdom trying to communicate'
    ];
    
    return interpretations[Math.floor(Math.random() * interpretations.length)];
  }

  private getSymbolConnections(symbol: DreamSymbol): string[] {
    const connections: Record<SymbolCategory, string[]> = {
      [SymbolCategory.NATURE]: ['growth', 'natural cycles', 'earth connection'],
      [SymbolCategory.ACTIVITIES]: ['personal agency', 'life choices', 'action'],
      [SymbolCategory.PEOPLE]: ['relationships', 'social aspects', 'personal qualities'],
      [SymbolCategory.PLACES]: ['life circumstances', 'emotional states', 'memories'],
      [SymbolCategory.OBJECTS]: ['tools', 'resources', 'manifestation'],
      [SymbolCategory.ANIMALS]: ['instincts', 'natural wisdom', 'primal energy'],
      [SymbolCategory.EMOTIONS]: ['feeling states', 'emotional processing', 'inner experience'],
      [SymbolCategory.COLORS]: ['energy', 'mood', 'spiritual qualities'],
      [SymbolCategory.NUMBERS]: ['completion', 'cycles', 'spiritual significance'],
      [SymbolCategory.TRANSPORTATION]: ['life journey', 'progress', 'movement'],
      [SymbolCategory.FOOD]: ['nourishment', 'sustenance', 'emotional needs'],
      [SymbolCategory.WEATHER]: ['emotional climate', 'life conditions', 'change'],
      [SymbolCategory.BODY_PARTS]: ['physical health', 'capabilities', 'self-image'],
      [SymbolCategory.MYTHICAL]: ['archetypal energies', 'collective unconscious', 'spiritual powers']
    };
    
    return connections[symbol.category] || ['universal themes', 'personal significance'];
  }

  private describeEmotionalPattern(primary: EmotionType, secondary: EmotionType[]): string {
    if (secondary.length === 0) {
      return `Dominant ${primary} emotion`;
    }
    return `${primary} with underlying ${secondary.join(' and ')} emotions`;
  }

  private explainEmotionalSignificance(primary: EmotionType, secondary: EmotionType[]): string {
    const positive = [EmotionType.JOY, EmotionType.PEACE, EmotionType.LOVE, EmotionType.EXCITEMENT, EmotionType.HOPE];
    const negative = [EmotionType.FEAR, EmotionType.ANXIETY, EmotionType.ANGER, EmotionType.SADNESS];
    
    if (positive.includes(primary)) {
      return 'Indicates emotional well-being and positive life integration';
    } else if (negative.includes(primary)) {
      return 'Suggests areas that may need attention or processing in your waking life';
    }
    
    return 'Reflects the complexity of your current emotional landscape';
  }
}

// Example usage function
export function createDreamAnalyzer(): DreamAnalyzer {
  return new DreamAnalyzer();
}

// Helper function to create visualization data
export function generateVisualizationPrompt(dream: Dream): DreamVisualizationData {
  const symbols = dream.symbols.map(s => s.name).join(', ');
  const emotions = dream.emotions.map(e => e.type).join(', ');
  
  return {
    dreamId: dream.id,
    imagePrompt: `Dreamlike visualization of ${symbols} with ${emotions} emotional tone, surreal art style, ${dream.description.substring(0, 100)}`,
    visualElements: dream.symbols.map(symbol => ({
      type: symbol.name,
      description: symbol.description,
      prominence: Math.abs(symbol.emotionalWeight),
      position: 'center' // Simplified positioning
    })),
    colorPalette: generateColorPalette(dream.emotions),
    mood: determineDominantMood(dream.emotions),
    style: 'surreal_dreamscape'
  };
}

function generateColorPalette(emotions: Array<{type: EmotionType, intensity: number}>): string[] {
  const emotionColors: Record<EmotionType, string[]> = {
    [EmotionType.JOY]: ['#FFD700', '#FFA500', '#FFFF00'],
    [EmotionType.PEACE]: ['#87CEEB', '#E0F6FF', '#B0E0E6'],
    [EmotionType.FEAR]: ['#2F2F2F', '#8B0000', '#4B0082'],
    [EmotionType.LOVE]: ['#FF69B4', '#FFC0CB', '#DC143C'],
    [EmotionType.ANXIETY]: ['#696969', '#A9A9A9', '#778899'],
    [EmotionType.ANGER]: ['#FF0000', '#DC143C', '#8B0000'],
    [EmotionType.SADNESS]: ['#4169E1', '#000080', '#191970'],
    [EmotionType.EXCITEMENT]: ['#FF4500', '#FF6347', '#FFD700'],
    [EmotionType.CONFUSION]: ['#DDA0DD', '#9370DB', '#8A2BE2'],
    [EmotionType.WONDER]: ['#9932CC', '#BA55D3', '#DA70D6'],
    [EmotionType.GUILT]: ['#8B4513', '#A0522D', '#CD853F'],
    [EmotionType.RELIEF]: ['#90EE90', '#98FB98', '#F0FFF0'],
    [EmotionType.NOSTALGIA]: ['#F5DEB3', '#DEB887', '#D2691E'],
    [EmotionType.HOPE]: ['#00CED1', '#20B2AA', '#48D1CC'],
    [EmotionType.FRUSTRATION]: ['#B22222', '#CD5C5C', '#F08080']
  };

  const palette = new Set<string>();
  emotions.forEach(emotion => {
    const colors = emotionColors[emotion.type] || ['#808080'];
    colors.forEach(color => palette.add(color));
  });

  return Array.from(palette).slice(0, 5); // Limit to 5 colors
}

function determineDominantMood(emotions: Array<{type: EmotionType, intensity: number}>): string {
  if (emotions.length === 0) return 'neutral';
  
  const dominant = emotions.reduce((prev, current) => 
    current.intensity > prev.intensity ? current : prev
  );
  
  return dominant.type;
} 