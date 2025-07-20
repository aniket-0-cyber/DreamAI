/**
 * Dream service for managing dream data and operations
 */

import { Dream, DreamAnalysis, analyzeDream, generateDreamId } from './dream-utils';

export class DreamService {
  private dreams: Dream[] = [];
  private readonly storageKey = 'dreams_storage';

  constructor() {
    this.loadDreams();
  }

  /**
   * Adds a new dream to the collection
   */
  async addDream(dreamData: Omit<Dream, 'id'>): Promise<Dream> {
    const dream: Dream = {
      ...dreamData,
      id: generateDreamId()
    };

    this.dreams.push(dream);
    await this.saveDreams();
    return dream;
  }

  /**
   * Gets all dreams
   */
  getAllDreams(): Dream[] {
    return [...this.dreams];
  }

  /**
   * Gets a dream by ID
   */
  getDreamById(id: string): Dream | undefined {
    return this.dreams.find(dream => dream.id === id);
  }

  /**
   * Updates an existing dream
   */
  async updateDream(id: string, updates: Partial<Dream>): Promise<Dream | null> {
    const index = this.dreams.findIndex(dream => dream.id === id);
    if (index === -1) return null;

    this.dreams[index] = { ...this.dreams[index], ...updates };
    await this.saveDreams();
    return this.dreams[index];
  }

  /**
   * Deletes a dream by ID
   */
  async deleteDream(id: string): Promise<boolean> {
    const index = this.dreams.findIndex(dream => dream.id === id);
    if (index === -1) return false;

    this.dreams.splice(index, 1);
    await this.saveDreams();
    return true;
  }

  /**
   * Searches dreams by content
   */
  searchDreams(query: string): Dream[] {
    const lowercaseQuery = query.toLowerCase();
    return this.dreams.filter(dream =>
      dream.title.toLowerCase().includes(lowercaseQuery) ||
      dream.content.toLowerCase().includes(lowercaseQuery) ||
      dream.emotions.some(emotion => 
        emotion.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  /**
   * Gets dreams by lucidity status
   */
  getLucidDreams(lucid: boolean = true): Dream[] {
    return this.dreams.filter(dream => dream.lucid === lucid);
  }

  /**
   * Gets dream statistics
   */
  getDreamStats(): {
    total: number;
    lucid: number;
    averageClarity: number;
    mostCommonEmotion: string;
    recentDreams: number;
  } {
    const total = this.dreams.length;
    const lucid = this.dreams.filter(d => d.lucid).length;
    
    const averageClarity = total > 0 
      ? this.dreams.reduce((sum, d) => sum + d.clarity, 0) / total 
      : 0;

    // Find most common emotion
    const emotionCounts: Record<string, number> = {};
    this.dreams.forEach(dream => {
      dream.emotions.forEach(emotion => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });

    const mostCommonEmotion = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';

    // Dreams from last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentDreams = this.dreams.filter(d => d.date >= weekAgo).length;

    return {
      total,
      lucid,
      averageClarity: Math.round(averageClarity * 100) / 100,
      mostCommonEmotion,
      recentDreams
    };
  }

  /**
   * Analyzes all dreams and returns analysis array
   */
  analyzeAllDreams(): (Dream & { analysis: DreamAnalysis })[] {
    return this.dreams.map(dream => ({
      ...dream,
      analysis: analyzeDream(dream)
    }));
  }

  /**
   * Loads dreams from storage (simulated)
   */
  private loadDreams(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsedDreams = JSON.parse(stored);
        this.dreams = parsedDreams.map((d: any) => ({
          ...d,
          date: new Date(d.date)
        }));
      }
    } catch (error) {
      console.warn('Failed to load dreams from storage:', error);
      this.dreams = [];
    }
  }

  /**
   * Saves dreams to storage (simulated)
   */
  private async saveDreams(): Promise<void> {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.dreams));
    } catch (error) {
      console.error('Failed to save dreams to storage:', error);
    }
  }
} 