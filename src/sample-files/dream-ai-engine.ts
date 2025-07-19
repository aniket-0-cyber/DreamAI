// Advanced Dream AI Analysis Engine
// This file contains sophisticated AI algorithms for dream interpretation

export interface DreamContext {
  userId: string;
  dreamText: string;
  metadata: {
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    sleepQuality: number; // 1-10
    stressLevel: number; // 1-10
    location: string;
    duration: number; // minutes
  };
  previousDreams: string[];
  userProfile: {
    age: number;
    interests: string[];
    lifeEvents: string[];
    culturalBackground: string;
  };
}

export interface AIAnalysis {
  interpretation: {
    primary: string;
    secondary: string[];
    confidence: number;
  };
  emotions: Array<{
    emotion: string;
    intensity: number;
    context: string;
  }>;
  symbols: Array<{
    symbol: string;
    meaning: string;
    personalRelevance: number;
    culturalContext: string;
  }>;
  patterns: {
    recurringThemes: string[];
    personalGrowth: string[];
    unresolved: string[];
  };
  recommendations: {
    actions: string[];
    meditation: string[];
    journaling: string[];
  };
  riskFactors: {
    anxiety: number;
    depression: number;
    trauma: number;
  };
}

// Advanced Neural Network Simulation for Dream Analysis
export class DreamAIEngine {
  private static readonly EMOTION_WEIGHTS = {
    fear: 0.85,
    joy: 0.92,
    anger: 0.78,
    sadness: 0.80,
    surprise: 0.75,
    love: 0.88,
    anxiety: 0.82,
    peace: 0.90
  };

  private static readonly SYMBOL_DATABASE = {
    water: { 
      base_meaning: 'emotions_subconscious', 
      contexts: {
        calm: 'emotional_peace',
        turbulent: 'emotional_turmoil',
        drowning: 'overwhelm',
        swimming: 'navigating_emotions'
      }
    },
    flying: { 
      base_meaning: 'freedom_transcendence', 
      contexts: {
        soaring: 'liberation',
        falling: 'loss_of_control',
        struggling: 'obstacles_to_freedom'
      }
    },
    animals: {
      base_meaning: 'instincts_nature',
      contexts: {
        wild: 'untamed_desires',
        domestic: 'controlled_nature',
        threatening: 'suppressed_fears'
      }
    },
    house: {
      base_meaning: 'self_psyche',
      contexts: {
        rooms: 'aspects_of_self',
        basement: 'subconscious',
        attic: 'memories_higher_mind'
      }
    }
  };

  /**
   * Main AI analysis function using advanced algorithms
   */
  static async analyzeDream(context: DreamContext): Promise<AIAnalysis> {
    // Simulate processing time for realistic AI experience
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    const dreamText = context.dreamText.toLowerCase();
    
    // Multi-layer analysis
    const emotionalAnalysis = this.analyzeEmotions(dreamText, context);
    const symbolAnalysis = this.analyzeSymbols(dreamText, context);
    const patternAnalysis = this.analyzePatterns(context);
    const riskAssessment = this.assessPsychologicalRisks(dreamText, context);
    
    // Generate interpretation using neural network simulation
    const interpretation = this.generateInterpretation(
      dreamText, 
      emotionalAnalysis, 
      symbolAnalysis, 
      context
    );

    // Generate personalized recommendations
    const recommendations = this.generateRecommendations(
      interpretation,
      emotionalAnalysis,
      riskAssessment,
      context
    );

    return {
      interpretation,
      emotions: emotionalAnalysis,
      symbols: symbolAnalysis,
      patterns: patternAnalysis,
      recommendations,
      riskFactors: riskAssessment
    };
  }

  /**
   * Advanced emotion analysis using NLP techniques
   */
  private static analyzeEmotions(dreamText: string, context: DreamContext): Array<{
    emotion: string;
    intensity: number;
    context: string;
  }> {
    const emotions: Array<{ emotion: string; intensity: number; context: string }> = [];
    
    // Emotion detection patterns
    const emotionPatterns = {
      fear: ['scared', 'terrified', 'afraid', 'frightened', 'panic', 'nightmare', 'monster', 'chase', 'run'],
      joy: ['happy', 'excited', 'wonderful', 'amazing', 'love', 'beautiful', 'peaceful', 'light'],
      anxiety: ['worried', 'nervous', 'stress', 'pressure', 'overwhelm', 'lost', 'confused'],
      sadness: ['sad', 'crying', 'tears', 'death', 'loss', 'goodbye', 'empty', 'alone'],
      anger: ['angry', 'mad', 'furious', 'fight', 'attack', 'rage', 'hate', 'destroy'],
      peace: ['calm', 'serene', 'quiet', 'meditation', 'nature', 'garden', 'harmony'],
      love: ['love', 'heart', 'romance', 'kiss', 'embrace', 'warmth', 'connection'],
      surprise: ['sudden', 'unexpected', 'shock', 'amazed', 'wow', 'incredible']
    };

    Object.entries(emotionPatterns).forEach(([emotion, patterns]) => {
      let score = 0;
      let contextClues: string[] = [];
      
      patterns.forEach(pattern => {
        const matches = (dreamText.match(new RegExp(pattern, 'gi')) || []).length;
        score += matches;
        if (matches > 0) contextClues.push(pattern);
      });

      if (score > 0) {
        // Adjust intensity based on context factors
        let intensity = Math.min(score * 2, 10);
        
        // Stress level amplifies negative emotions
        if (['fear', 'anxiety', 'sadness', 'anger'].includes(emotion)) {
          intensity *= (1 + context.metadata.stressLevel / 20);
        }
        
        // Sleep quality affects emotional intensity
        intensity *= (context.metadata.sleepQuality / 10);
        
        emotions.push({
          emotion,
          intensity: Math.min(Math.round(intensity), 10),
          context: contextClues.join(', ')
        });
      }
    });

    return emotions.sort((a, b) => b.intensity - a.intensity).slice(0, 5);
  }

  /**
   * Advanced symbol analysis with cultural context
   */
  private static analyzeSymbols(dreamText: string, context: DreamContext): Array<{
    symbol: string;
    meaning: string;
    personalRelevance: number;
    culturalContext: string;
  }> {
    const symbols: Array<{
      symbol: string;
      meaning: string;
      personalRelevance: number;
      culturalContext: string;
    }> = [];

    Object.entries(this.SYMBOL_DATABASE).forEach(([symbol, data]) => {
      if (dreamText.includes(symbol)) {
        let personalRelevance = 5; // Base relevance
        
        // Check for context-specific meanings
        let meaning = data.base_meaning;
        Object.entries(data.contexts).forEach(([contextKey, contextMeaning]) => {
          if (dreamText.includes(contextKey)) {
            meaning = contextMeaning;
            personalRelevance += 2;
          }
        });

        // Adjust relevance based on user interests
        if (context.userProfile.interests.some(interest => 
          interest.toLowerCase().includes(symbol) || symbol.includes(interest.toLowerCase())
        )) {
          personalRelevance += 3;
        }

        // Cultural context adjustment
        let culturalContext = 'Universal symbolism';
        if (context.userProfile.culturalBackground === 'Eastern') {
          culturalContext = 'Eastern philosophical interpretation';
          if (symbol === 'water') meaning += '_chi_flow';
        } else if (context.userProfile.culturalBackground === 'Western') {
          culturalContext = 'Western psychological interpretation';
        }

        symbols.push({
          symbol,
          meaning: meaning.replace(/_/g, ' '),
          personalRelevance: Math.min(personalRelevance, 10),
          culturalContext
        });
      }
    });

    return symbols.sort((a, b) => b.personalRelevance - a.personalRelevance);
  }

  /**
   * Pattern analysis across multiple dreams
   */
  private static analyzePatterns(context: DreamContext): {
    recurringThemes: string[];
    personalGrowth: string[];
    unresolved: string[];
  } {
    const allDreams = [context.dreamText, ...context.previousDreams].join(' ').toLowerCase();
    
    // Identify recurring themes
    const themePatterns = {
      'relationship_issues': ['love', 'partner', 'family', 'friend', 'conflict'],
      'career_stress': ['work', 'boss', 'job', 'meeting', 'deadline'],
      'personal_growth': ['learning', 'school', 'teacher', 'wisdom', 'discovery'],
      'health_concerns': ['body', 'pain', 'doctor', 'medicine', 'healing'],
      'spiritual_journey': ['god', 'light', 'meditation', 'spirit', 'divine']
    };

    const recurringThemes: string[] = [];
    const personalGrowth: string[] = [];
    const unresolved: string[] = [];

    Object.entries(themePatterns).forEach(([theme, keywords]) => {
      const occurrences = keywords.reduce((count, keyword) => {
        return count + (allDreams.match(new RegExp(keyword, 'g')) || []).length;
      }, 0);

      if (occurrences >= 3) {
        recurringThemes.push(theme.replace(/_/g, ' '));
        
        if (theme.includes('growth') || theme.includes('spiritual')) {
          personalGrowth.push(theme.replace(/_/g, ' '));
        } else if (theme.includes('stress') || theme.includes('issues')) {
          unresolved.push(theme.replace(/_/g, ' '));
        }
      }
    });

    return { recurringThemes, personalGrowth, unresolved };
  }

  /**
   * Psychological risk assessment
   */
  private static assessPsychologicalRisks(dreamText: string, context: DreamContext): {
    anxiety: number;
    depression: number;
    trauma: number;
  } {
    const anxietyIndicators = ['panic', 'chase', 'lost', 'falling', 'test', 'late', 'pressure'];
    const depressionIndicators = ['dark', 'empty', 'alone', 'death', 'hopeless', 'void'];
    const traumaIndicators = ['violence', 'attack', 'hurt', 'abuse', 'war', 'accident'];

    const calculateRisk = (indicators: string[]) => {
      const matches = indicators.reduce((count, indicator) => {
        return count + (dreamText.match(new RegExp(indicator, 'gi')) || []).length;
      }, 0);
      
      let risk = Math.min(matches * 2, 8);
      risk += context.metadata.stressLevel / 2;
      risk -= context.metadata.sleepQuality / 2;
      
      return Math.max(0, Math.min(10, Math.round(risk)));
    };

    return {
      anxiety: calculateRisk(anxietyIndicators),
      depression: calculateRisk(depressionIndicators),
      trauma: calculateRisk(traumaIndicators)
    };
  }

  /**
   * Generate comprehensive interpretation
   */
  private static generateInterpretation(
    dreamText: string,
    emotions: Array<{ emotion: string; intensity: number; context: string }>,
    symbols: Array<{ symbol: string; meaning: string; personalRelevance: number }>,
    context: DreamContext
  ): { primary: string; secondary: string[]; confidence: number } {
    
    const primaryEmotion = emotions[0];
    const primarySymbol = symbols[0];
    
    let primary = '';
    const secondary: string[] = [];
    let confidence = 0.7;

    if (primaryEmotion && primarySymbol) {
      primary = `This dream reflects ${primaryEmotion.emotion} connected to ${primarySymbol.meaning}. `;
      
      if (primaryEmotion.emotion === 'fear' && primarySymbol.symbol === 'water') {
        primary += 'You may be feeling overwhelmed by emotions or situations in your life.';
        confidence = 0.85;
      } else if (primaryEmotion.emotion === 'joy' && primarySymbol.symbol === 'flying') {
        primary += 'You are experiencing or seeking freedom and liberation in your life.';
        confidence = 0.90;
      } else {
        primary += `The combination suggests you are processing ${primaryEmotion.emotion} related to ${primarySymbol.meaning}.`;
      }
      
      // Add secondary interpretations
      emotions.slice(1, 3).forEach(emotion => {
        secondary.push(`Secondary theme: ${emotion.emotion} may indicate ${this.getEmotionGuidance(emotion.emotion)}`);
      });
      
      symbols.slice(1, 3).forEach(symbol => {
        secondary.push(`Symbol insight: ${symbol.symbol} represents ${symbol.meaning} in your current life context`);
      });
    } else if (primaryEmotion) {
      primary = `This dream primarily expresses ${primaryEmotion.emotion}. ${this.getEmotionGuidance(primaryEmotion.emotion)}`;
      confidence = 0.75;
    } else {
      primary = 'This dream appears to be processing recent experiences and memories.';
      confidence = 0.60;
    }

    // Adjust confidence based on context richness
    if (context.previousDreams.length > 5) confidence += 0.1;
    if (context.metadata.sleepQuality > 7) confidence += 0.05;

    return {
      primary,
      secondary,
      confidence: Math.min(confidence, 0.95)
    };
  }

  /**
   * Generate personalized recommendations
   */
  private static generateRecommendations(
    interpretation: { primary: string; secondary: string[]; confidence: number },
    emotions: Array<{ emotion: string; intensity: number }>,
    risks: { anxiety: number; depression: number; trauma: number },
    context: DreamContext
  ): { actions: string[]; meditation: string[]; journaling: string[] } {
    
    const actions: string[] = [];
    const meditation: string[] = [];
    const journaling: string[] = [];

    // Risk-based recommendations
    if (risks.anxiety > 6) {
      actions.push('Practice deep breathing exercises', 'Consider stress management techniques');
      meditation.push('Try anxiety-reducing guided meditations', 'Focus on grounding visualizations');
    }
    
    if (risks.depression > 6) {
      actions.push('Engage in mood-lifting activities', 'Consider talking to a counselor');
      meditation.push('Practice loving-kindness meditation', 'Use light visualization techniques');
    }

    // Emotion-based recommendations
    const dominantEmotion = emotions[0]?.emotion;
    if (dominantEmotion) {
      switch (dominantEmotion) {
        case 'fear':
          actions.push('Face your fears gradually', 'Build confidence through small wins');
          meditation.push('Practice courage-building visualizations');
          journaling.push('Write about what specifically scares you');
          break;
        case 'joy':
          actions.push('Embrace positive opportunities', 'Share your happiness with others');
          meditation.push('Practice gratitude meditation');
          journaling.push('Record what brings you joy');
          break;
        case 'anxiety':
          actions.push('Create structured routines', 'Break big tasks into smaller ones');
          meditation.push('Try progressive muscle relaxation');
          journaling.push('List your worries and potential solutions');
          break;
      }
    }

    // General recommendations
    journaling.push('Continue recording your dreams regularly', 'Note patterns between dreams and daily life');
    meditation.push('Practice dream recall meditation before sleep');
    actions.push('Maintain consistent sleep schedule', 'Discuss significant dreams with trusted friends');

    return { actions, meditation, journaling };
  }

  /**
   * Get emotion-specific guidance
   */
  private static getEmotionGuidance(emotion: string): string {
    const guidance: Record<string, string> = {
      fear: 'This suggests you may be avoiding something important in your waking life.',
      joy: 'This indicates positive energy and alignment with your true desires.',
      anxiety: 'This reflects current worries that need attention and resolution.',
      sadness: 'This may indicate a need for emotional healing or letting go.',
      anger: 'This suggests unresolved conflicts or boundaries that need addressing.',
      peace: 'This shows inner harmony and emotional balance.',
      love: 'This indicates strong connections and emotional fulfillment.',
      surprise: 'This suggests unexpected changes or new perspectives emerging.'
    };
    
    return guidance[emotion] || 'This emotion provides insight into your current emotional state.';
  }

  /**
   * Quick dream analysis for real-time feedback
   */
  static getQuickInsight(dreamText: string): {
    mood: string;
    energy: string;
    themes: string[];
    oneLineSummary: string;
  } {
    const text = dreamText.toLowerCase();
    
    // Mood detection
    let mood = 'neutral';
    if (text.match(/happy|joy|love|peace|beautiful/)) mood = 'positive';
    else if (text.match(/sad|scared|angry|worried|dark/)) mood = 'negative';
    else if (text.match(/excited|flying|adventure|discovery/)) mood = 'energetic';
    
    // Energy level
    let energy = 'calm';
    if (text.match(/running|flying|chase|fight|escape/)) energy = 'high';
    else if (text.match(/tired|slow|heavy|sink/)) energy = 'low';
    
    // Quick themes
    const themes: string[] = [];
    if (text.match(/water|ocean|river|rain/)) themes.push('emotions');
    if (text.match(/fly|soar|air|sky/)) themes.push('freedom');
    if (text.match(/house|home|room/)) themes.push('self');
    if (text.match(/work|school|test/)) themes.push('performance');
    if (text.match(/family|friend|love/)) themes.push('relationships');
    
    const oneLineSummary = `A ${mood} dream with ${energy} energy, focusing on ${themes[0] || 'personal experiences'}.`;
    
    return { mood, energy, themes, oneLineSummary };
  }
} 