/**
 * Test data and mock functions for dream testing
 */

import { Dream } from './dream-utils';

/**
 * Sample dream data for testing
 */
export const mockDreams: Dream[] = [
  {
    id: 'dream_001',
    title: 'Flying Over Mountains',
    content: 'I was flying over beautiful snow-capped mountains. The view was incredible and I felt completely peaceful. I realized I was dreaming and could control my flight path.',
    date: new Date('2024-01-15'),
    lucid: true,
    emotions: ['peaceful', 'joy', 'control', 'wonder'],
    clarity: 9
  },
  {
    id: 'dream_002',
    title: 'Lost in a Forest',
    content: 'I found myself in a dark forest at night. There were scary sounds coming from the trees and I felt very anxious. I kept walking but couldn\'t find my way out.',
    date: new Date('2024-01-12'),
    lucid: false,
    emotions: ['fear', 'anxiety', 'confusion'],
    clarity: 6
  },
  {
    id: 'dream_003',
    title: 'Swimming with Dolphins',
    content: 'The water was crystal clear and warm. Dolphins were swimming around me playfully. I could breathe underwater somehow and felt one with nature.',
    date: new Date('2024-01-10'),
    lucid: false,
    emotions: ['joy', 'wonder', 'connection'],
    clarity: 8
  },
  {
    id: 'dream_004',
    title: 'Meeting an Old Friend',
    content: 'I was in my childhood home and my best friend from elementary school was there. We talked about happy memories and played games like we used to.',
    date: new Date('2024-01-08'),
    lucid: false,
    emotions: ['nostalgia', 'happiness', 'love'],
    clarity: 7
  },
  {
    id: 'dream_005',
    title: 'Building Sandcastles',
    content: 'I was on a beautiful beach building elaborate sandcastles. The sand was perfect and I was aware this was a dream. I created amazing architectural structures.',
    date: new Date('2024-01-05'),
    lucid: true,
    emotions: ['creativity', 'focus', 'satisfaction'],
    clarity: 8
  }
];

/**
 * Dream emotion categories for testing
 */
export const emotionCategories = {
  positive: ['joy', 'happiness', 'love', 'peace', 'wonder', 'satisfaction', 'creativity'],
  negative: ['fear', 'anxiety', 'sadness', 'anger', 'confusion', 'frustration'],
  neutral: ['curiosity', 'focus', 'awareness', 'observation']
};

/**
 * Common dream themes for testing
 */
export const dreamThemes = [
  'flying',
  'water',
  'animals',
  'people',
  'buildings',
  'nature',
  'vehicles',
  'school',
  'work',
  'family',
  'travel',
  'adventure'
];

/**
 * Mock API responses for testing
 */
export const mockApiResponses = {
  success: {
    status: 'success',
    message: 'Operation completed successfully',
    data: null
  },
  error: {
    status: 'error',
    message: 'Something went wrong',
    code: 'UNKNOWN_ERROR'
  },
  validationError: {
    status: 'error',
    message: 'Validation failed',
    code: 'VALIDATION_ERROR',
    fields: ['title', 'content']
  }
};

/**
 * Generates random dream data for testing
 */
export function generateRandomDream(overrides: Partial<Dream> = {}): Dream {
  const titles = [
    'Strange Adventure',
    'Mysterious Journey',
    'Vivid Experience',
    'Surreal Encounter',
    'Magical Moment'
  ];

  const contents = [
    'A mysterious adventure unfolded with unexpected twists and turns.',
    'I found myself in a place that felt both familiar and strange.',
    'The experience was vivid and filled with interesting characters.',
    'Everything seemed to shift and change in fascinating ways.',
    'The dream felt incredibly real and meaningful.'
  ];

  const allEmotions = Object.values(emotionCategories).flat();
  const randomEmotions = allEmotions
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 1);

  return {
    id: `dream_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    title: titles[Math.floor(Math.random() * titles.length)],
    content: contents[Math.floor(Math.random() * contents.length)],
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
    lucid: Math.random() > 0.7, // 30% chance of being lucid
    emotions: randomEmotions,
    clarity: Math.floor(Math.random() * 10) + 1,
    ...overrides
  };
}

/**
 * Creates a set of test dreams with specific characteristics
 */
export function createTestDreamSet(count: number = 5): Dream[] {
  return Array.from({ length: count }, (_, index) => 
    generateRandomDream({ 
      id: `test_dream_${index + 1}`,
      date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)) // One dream per day going back
    })
  );
}

/**
 * Mock async function that simulates API delay
 */
export async function mockAsyncDelay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock function that randomly succeeds or fails
 */
export function mockRandomResult<T>(successValue: T, failValue: any = null, successRate: number = 0.8): T | null {
  return Math.random() < successRate ? successValue : failValue;
}

/**
 * Test utility to check if dream data is valid
 */
export function isValidDream(dream: any): dream is Dream {
  return (
    typeof dream === 'object' &&
    dream !== null &&
    typeof dream.id === 'string' &&
    typeof dream.title === 'string' &&
    typeof dream.content === 'string' &&
    dream.date instanceof Date &&
    typeof dream.lucid === 'boolean' &&
    Array.isArray(dream.emotions) &&
    typeof dream.clarity === 'number' &&
    dream.clarity >= 1 &&
    dream.clarity <= 10
  );
} 