// Dream Types and Interfaces for DreamAI Application
// This file demonstrates the data models used throughout the application

export interface Dream {
  id: string;
  userId?: string;
  title: string;
  description: string;
  dreamDate: Date;
  emotions: Emotion[];
  symbols: DreamSymbol[];
  lucidityLevel: LucidityLevel;
  sleepQuality: SleepQuality;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DreamSymbol {
  id: string;
  name: string;
  description: string;
  category: SymbolCategory;
  personalMeaning?: string;
  universalMeaning: string;
  frequency: number; // How often this symbol appears in user's dreams
  emotionalWeight: number; // -1 to 1, negative for disturbing, positive for pleasant
}

export interface Emotion {
  type: EmotionType;
  intensity: number; // 1-10 scale
  context?: string;
}

export interface DreamInterpretation {
  id: string;
  dreamId: string;
  summary: string;
  detailedAnalysis: string;
  psychologicalInsights: string[];
  symbolInterpretations: SymbolInterpretation[];
  emotionalPatterns: EmotionalPattern[];
  recommendations: string[];
  confidence: number; // 0-1 confidence score
  generatedAt: Date;
  aiModel: string;
}

export interface SymbolInterpretation {
  symbolId: string;
  interpretation: string;
  relevance: number; // 0-1 relevance to the specific dream
  connections: string[]; // Connected symbols or themes
}

export interface EmotionalPattern {
  primaryEmotion: EmotionType;
  secondaryEmotions: EmotionType[];
  pattern: string;
  significance: string;
}

export interface DreamJournalEntry {
  dream: Dream;
  interpretation?: DreamInterpretation;
  userNotes: string;
  mood: MoodRating;
  sleepContext: SleepContext;
}

export interface SleepContext {
  bedtime: string;
  wakeTime: string;
  sleepDuration: number; // hours
  sleepDisruptions: string[];
  substances: string[]; // caffeine, alcohol, medications, etc.
  stressLevel: number; // 1-10
}

export interface UserProfile {
  id: string;
  email: string;
  preferences: UserPreferences;
  dreamingPatterns: DreamingPatterns;
  joinDate: Date;
  totalDreams: number;
  streak: number; // consecutive days with dream entries
}

export interface UserPreferences {
  notifications: boolean;
  publicProfile: boolean;
  shareAnalytics: boolean;
  interpretationStyle: InterpretationStyle;
  focusAreas: FocusArea[];
}

export interface DreamingPatterns {
  averageDreamsPerWeek: number;
  mostActiveDreamingTime: string;
  commonSymbols: string[];
  emotionalTrends: EmotionType[];
  lucidityFrequency: number;
}

// Enums and Types
export type LucidityLevel = 'none' | 'low' | 'medium' | 'high' | 'full';
export type SleepQuality = 'poor' | 'fair' | 'good' | 'excellent';
export type MoodRating = 'very-negative' | 'negative' | 'neutral' | 'positive' | 'very-positive';
export type InterpretationStyle = 'psychological' | 'spiritual' | 'symbolic' | 'scientific';

export enum EmotionType {
  JOY = 'joy',
  FEAR = 'fear',
  ANGER = 'anger',
  SADNESS = 'sadness',
  ANXIETY = 'anxiety',
  EXCITEMENT = 'excitement',
  LOVE = 'love',
  CONFUSION = 'confusion',
  PEACE = 'peace',
  FRUSTRATION = 'frustration',
  WONDER = 'wonder',
  GUILT = 'guilt',
  RELIEF = 'relief',
  NOSTALGIA = 'nostalgia',
  HOPE = 'hope'
}

export enum SymbolCategory {
  PEOPLE = 'people',
  ANIMALS = 'animals',
  NATURE = 'nature',
  OBJECTS = 'objects',
  PLACES = 'places',
  ACTIVITIES = 'activities',
  EMOTIONS = 'emotions',
  COLORS = 'colors',
  NUMBERS = 'numbers',
  TRANSPORTATION = 'transportation',
  FOOD = 'food',
  WEATHER = 'weather',
  BODY_PARTS = 'body_parts',
  MYTHICAL = 'mythical'
}

export enum FocusArea {
  PERSONAL_GROWTH = 'personal_growth',
  RELATIONSHIPS = 'relationships',
  CAREER = 'career',
  HEALTH = 'health',
  CREATIVITY = 'creativity',
  SPIRITUALITY = 'spirituality',
  PROBLEM_SOLVING = 'problem_solving',
  TRAUMA_HEALING = 'trauma_healing'
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface DreamAnalysisRequest {
  dreamText: string;
  userId?: string;
  analysisType: InterpretationStyle;
  includeVisualization: boolean;
}

export interface DreamVisualizationData {
  dreamId: string;
  imagePrompt: string;
  imageUrl?: string;
  visualElements: VisualElement[];
  colorPalette: string[];
  mood: string;
  style: string;
}

export interface VisualElement {
  type: string;
  description: string;
  prominence: number; // 0-1, how prominent in the visualization
  position: string;
} 