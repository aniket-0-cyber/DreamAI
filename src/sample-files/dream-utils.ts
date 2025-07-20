/**
 * Dream utility functions for testing purposes
 */

export interface Dream {
  id: string;
  title: string;
  content: string;
  date: Date;
  lucid: boolean;
  emotions: string[];
  clarity: number; // 1-10 scale
}

export interface DreamAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  themes: string[];
  symbolCount: number;
  lucidityScore: number;
}

/**
 * Generates a random dream ID
 */
export function generateDreamId(): string {
  return `dream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculates the lucidity score based on dream characteristics
 */
export function calculateLucidityScore(dream: Dream): number {
  let score = 0;
  
  if (dream.lucid) score += 5;
  if (dream.clarity >= 8) score += 3;
  if (dream.emotions.includes('control')) score += 2;
  if (dream.content.toLowerCase().includes('aware')) score += 1;
  
  return Math.min(score, 10);
}

/**
 * Analyzes dream content and returns analysis
 */
export function analyzeDream(dream: Dream): DreamAnalysis {
  const content = dream.content.toLowerCase();
  
  // Simple sentiment analysis
  const positiveWords = ['happy', 'joy', 'love', 'peace', 'beautiful'];
  const negativeWords = ['fear', 'scary', 'sad', 'angry', 'nightmare'];
  
  const positiveCount = positiveWords.filter(word => content.includes(word)).length;
  const negativeCount = negativeWords.filter(word => content.includes(word)).length;
  
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (positiveCount > negativeCount) sentiment = 'positive';
  if (negativeCount > positiveCount) sentiment = 'negative';
  
  // Extract themes
  const themeKeywords = ['flying', 'water', 'animals', 'people', 'buildings', 'nature'];
  const themes = themeKeywords.filter(theme => content.includes(theme));
  
  return {
    sentiment,
    themes,
    symbolCount: content.split(' ').length,
    lucidityScore: calculateLucidityScore(dream)
  };
}

/**
 * Filters dreams by date range
 */
export function filterDreamsByDateRange(
  dreams: Dream[], 
  startDate: Date, 
  endDate: Date
): Dream[] {
  return dreams.filter(dream => 
    dream.date >= startDate && dream.date <= endDate
  );
}

/**
 * Groups dreams by month
 */
export function groupDreamsByMonth(dreams: Dream[]): Record<string, Dream[]> {
  return dreams.reduce((groups, dream) => {
    const monthKey = dream.date.toISOString().slice(0, 7); // YYYY-MM
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(dream);
    return groups;
  }, {} as Record<string, Dream[]>);
} 