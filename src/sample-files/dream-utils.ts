// Dream Utility Functions for DreamAI Application
// This file contains helper functions for dream processing and analysis

// Date and time utilities
export class DateUtils {
  /**
   * Formats a date for dream display
   */
  static formatDreamDate(date: Date): string {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Gets the time period for dream timing analysis
   */
  static getDreamTimePeriod(date: Date): string {
    const hour = date.getHours();
    
    if (hour >= 22 || hour < 6) return 'Night';
    if (hour >= 6 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 18) return 'Afternoon';
    return 'Evening';
  }

  /**
   * Checks if a dream is from within the last week
   */
  static isRecentDream(date: Date): boolean {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  }

  /**
   * Groups dreams by month
   */
  static groupDreamsByMonth(dreams: Array<{ dreamDate: Date }>): Record<string, number> {
    const groups: Record<string, number> = {};
    
    dreams.forEach(dream => {
      const monthKey = dream.dreamDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
      groups[monthKey] = (groups[monthKey] || 0) + 1;
    });
    
    return groups;
  }
}

// Text processing utilities
export class TextUtils {
  /**
   * Extracts keywords from dream text
   */
  static extractKeywords(text: string, minLength: number = 4): string[] {
    const stopWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
      'by', 'was', 'were', 'been', 'have', 'has', 'had', 'will', 'would',
      'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these',
      'those', 'then', 'than', 'when', 'where', 'what', 'who', 'why', 'how'
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => 
        word.length >= minLength && 
        !stopWords.has(word) &&
        isNaN(Number(word))
      )
      .reduce((unique, word) => {
        if (!unique.includes(word)) {
          unique.push(word);
        }
        return unique;
      }, [] as string[]);
  }

  /**
   * Calculates text sentiment score (simplified)
   */
  static calculateSentiment(text: string): { score: number; label: string } {
    const positiveWords = [
      'happy', 'joy', 'love', 'peace', 'beautiful', 'wonderful', 'amazing',
      'good', 'great', 'excellent', 'perfect', 'success', 'victory', 'win',
      'smile', 'laugh', 'bright', 'light', 'warm', 'comfort', 'safe'
    ];

    const negativeWords = [
      'sad', 'fear', 'angry', 'hate', 'terrible', 'awful', 'horrible',
      'bad', 'worst', 'fail', 'failure', 'lose', 'lost', 'cry', 'scream',
      'dark', 'cold', 'scary', 'danger', 'threat', 'hurt', 'pain'
    ];

    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
      if (positiveWords.some(pos => word.includes(pos))) {
        positiveCount++;
      }
      if (negativeWords.some(neg => word.includes(neg))) {
        negativeCount++;
      }
    });

    const totalSentimentWords = positiveCount + negativeCount;
    if (totalSentimentWords === 0) {
      return { score: 0, label: 'Neutral' };
    }

    const score = (positiveCount - negativeCount) / totalSentimentWords;
    
    let label: string;
    if (score > 0.3) label = 'Very Positive';
    else if (score > 0.1) label = 'Positive';
    else if (score > -0.1) label = 'Neutral';
    else if (score > -0.3) label = 'Negative';
    else label = 'Very Negative';

    return { score, label };
  }

  /**
   * Truncates text with smart word boundaries
   */
  static truncateText(text: string, maxLength: number, suffix: string = '...'): string {
    if (text.length <= maxLength) return text;
    
    const truncated = text.slice(0, maxLength - suffix.length);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.8) {
      return truncated.slice(0, lastSpace) + suffix;
    }
    
    return truncated + suffix;
  }

  /**
   * Highlights search terms in text
   */
  static highlightSearchTerms(text: string, searchTerm: string): string {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}

// Dream analysis utilities
export class DreamAnalysisUtils {
  /**
   * Calculates dream complexity score
   */
  static calculateComplexity(dream: {
    description: string;
    emotions: Array<{ type: string; intensity: number }>;
    symbols?: Array<{ name: string }>;
  }): number {
    let complexity = 0;
    
    // Text length contributes to complexity
    complexity += Math.min(dream.description.length / 1000, 1) * 30;
    
    // Number of emotions
    complexity += Math.min(dream.emotions.length * 5, 25);
    
    // Emotional intensity variance
    if (dream.emotions.length > 1) {
      const intensities = dream.emotions.map(e => e.intensity);
      const avg = intensities.reduce((a, b) => a + b, 0) / intensities.length;
      const variance = intensities.reduce((sum, intensity) => 
        sum + Math.pow(intensity - avg, 2), 0) / intensities.length;
      complexity += Math.min(variance * 5, 20);
    }
    
    // Number of symbols/themes
    if (dream.symbols) {
      complexity += Math.min(dream.symbols.length * 3, 25);
    } else {
      // Estimate from keywords if no symbols provided
      const keywords = TextUtils.extractKeywords(dream.description);
      complexity += Math.min(keywords.length * 2, 25);
    }
    
    return Math.round(Math.min(complexity, 100));
  }

  /**
   * Identifies potential dream themes
   */
  static identifyThemes(description: string): string[] {
    const themeKeywords = {
      'transformation': ['change', 'transform', 'metamorphosis', 'evolve', 'grow', 'develop'],
      'relationships': ['family', 'friend', 'love', 'partner', 'people', 'together', 'alone'],
      'career': ['work', 'job', 'office', 'boss', 'meeting', 'project', 'deadline'],
      'travel': ['journey', 'travel', 'trip', 'road', 'plane', 'car', 'destination'],
      'nature': ['tree', 'forest', 'ocean', 'mountain', 'river', 'sky', 'animal'],
      'conflict': ['fight', 'battle', 'argue', 'conflict', 'enemy', 'struggle', 'war'],
      'fear': ['scary', 'afraid', 'terror', 'nightmare', 'monster', 'danger', 'threat'],
      'achievement': ['success', 'win', 'accomplish', 'goal', 'victory', 'complete'],
      'spiritual': ['god', 'spirit', 'angel', 'heaven', 'pray', 'sacred', 'divine'],
      'childhood': ['child', 'young', 'school', 'playground', 'parent', 'home', 'memory']
    };

    const lowerDesc = description.toLowerCase();
    const identifiedThemes: string[] = [];

    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
      const matches = keywords.filter(keyword => lowerDesc.includes(keyword));
      if (matches.length >= 1) {
        identifiedThemes.push(theme);
      }
    });

    return identifiedThemes;
  }

  /**
   * Suggests tags based on dream content
   */
  static suggestTags(dream: {
    description: string;
    emotions?: Array<{ type: string }>;
    lucidityLevel?: string;
  }): string[] {
    const suggestions = new Set<string>();
    
    // Add emotion-based tags
    if (dream.emotions) {
      dream.emotions.forEach(emotion => {
        suggestions.add(emotion.type.toLowerCase());
      });
    }
    
    // Add lucidity tag
    if (dream.lucidityLevel && dream.lucidityLevel !== 'none') {
      suggestions.add('lucid');
    }
    
    // Add theme-based tags
    const themes = this.identifyThemes(dream.description);
    themes.forEach(theme => suggestions.add(theme));
    
    // Add keyword-based tags
    const keywords = TextUtils.extractKeywords(dream.description, 3);
    keywords.slice(0, 5).forEach(keyword => suggestions.add(keyword));
    
    return Array.from(suggestions).slice(0, 8);
  }

  /**
   * Calculates similarity between two dreams
   */
  static calculateSimilarity(dream1: { description: string; tags: string[] }, 
                           dream2: { description: string; tags: string[] }): number {
    // Tag similarity
    const tags1 = new Set(dream1.tags.map(t => t.toLowerCase()));
    const tags2 = new Set(dream2.tags.map(t => t.toLowerCase()));
    const commonTags = new Set([...tags1].filter(x => tags2.has(x)));
    const tagSimilarity = commonTags.size / Math.max(tags1.size, tags2.size, 1);
    
    // Text similarity (simplified)
    const keywords1 = new Set(TextUtils.extractKeywords(dream1.description));
    const keywords2 = new Set(TextUtils.extractKeywords(dream2.description));
    const commonKeywords = new Set([...keywords1].filter(x => keywords2.has(x)));
    const textSimilarity = commonKeywords.size / Math.max(keywords1.size, keywords2.size, 1);
    
    // Weighted average
    return (tagSimilarity * 0.6 + textSimilarity * 0.4);
  }
}

// Color and visualization utilities
export class VisualizationUtils {
  /**
   * Gets color for emotion type
   */
  static getEmotionColor(emotion: string): string {
    const colorMap: Record<string, string> = {
      'joy': '#FFD700',
      'happiness': '#FFD700',
      'love': '#FF69B4',
      'peace': '#87CEEB',
      'calm': '#87CEEB',
      'fear': '#8B0000',
      'scary': '#8B0000',
      'anger': '#FF0000',
      'sad': '#4169E1',
      'sadness': '#4169E1',
      'anxiety': '#696969',
      'worry': '#696969',
      'excitement': '#FF4500',
      'wonder': '#9932CC',
      'confusion': '#DDA0DD',
      'relief': '#90EE90',
      'nostalgia': '#F5DEB3',
      'hope': '#00CED1',
      'frustration': '#B22222'
    };

    return colorMap[emotion.toLowerCase()] || '#808080';
  }

  /**
   * Generates a color palette for a dream based on emotions
   */
  static generateDreamPalette(emotions: Array<{ type: string; intensity: number }>): string[] {
    if (emotions.length === 0) return ['#808080'];
    
    // Sort emotions by intensity
    const sortedEmotions = emotions
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, 4); // Max 4 colors
    
    return sortedEmotions.map(emotion => this.getEmotionColor(emotion.type));
  }

  /**
   * Calculates opacity based on intensity
   */
  static getIntensityOpacity(intensity: number, maxIntensity: number = 10): number {
    return Math.max(0.3, Math.min(1, intensity / maxIntensity));
  }

  /**
   * Generates CSS gradient from emotion colors
   */
  static createEmotionGradient(emotions: Array<{ type: string; intensity: number }>): string {
    const colors = this.generateDreamPalette(emotions);
    if (colors.length === 1) {
      return `linear-gradient(135deg, ${colors[0]}, ${colors[0]}cc)`;
    }
    
    const colorStops = colors.map((color, index) => 
      `${color} ${(index / (colors.length - 1)) * 100}%`
    ).join(', ');
    
    return `linear-gradient(135deg, ${colorStops})`;
  }
}

// Export utilities
export class ExportUtils {
  /**
   * Exports dreams to JSON format
   */
  static exportToJSON(dreams: any[]): string {
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      totalDreams: dreams.length,
      dreams: dreams
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Exports dreams to CSV format
   */
  static exportToCSV(dreams: Array<{
    dreamDate: Date;
    title: string;
    description: string;
    emotions: Array<{ type: string; intensity: number }>;
    tags: string[];
    lucidityLevel: string;
  }>): string {
    const headers = ['Date', 'Title', 'Description', 'Emotions', 'Tags', 'Lucidity'];
    
    const rows = dreams.map(dream => [
      dream.dreamDate.toLocaleDateString(),
      `"${dream.title.replace(/"/g, '""')}"`,
      `"${dream.description.replace(/"/g, '""')}"`,
      `"${dream.emotions.map(e => `${e.type}:${e.intensity}`).join(';')}"`,
      `"${dream.tags.join(';')}"`,
      dream.lucidityLevel
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  /**
   * Creates a downloadable file
   */
  static downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}

// Validation utilities
export class ValidationUtils {
  /**
   * Validates dream form data
   */
  static validateDream(data: {
    title?: string;
    description?: string;
    dreamDate?: Date;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.title?.trim()) {
      errors.push('Dream title is required');
    } else if (data.title.length < 3) {
      errors.push('Dream title must be at least 3 characters long');
    } else if (data.title.length > 100) {
      errors.push('Dream title must be less than 100 characters');
    }
    
    if (!data.description?.trim()) {
      errors.push('Dream description is required');
    } else if (data.description.length < 10) {
      errors.push('Dream description must be at least 10 characters long');
    } else if (data.description.length > 5000) {
      errors.push('Dream description must be less than 5000 characters');
    }
    
    if (data.dreamDate && data.dreamDate > new Date()) {
      errors.push('Dream date cannot be in the future');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates emotion intensity
   */
  static validateEmotionIntensity(intensity: number): boolean {
    return intensity >= 1 && intensity <= 10 && Number.isInteger(intensity);
  }

  /**
   * Sanitizes user input
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  }
} 