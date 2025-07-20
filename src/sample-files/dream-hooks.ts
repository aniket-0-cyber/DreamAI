/**
 * Custom React hooks for dream management
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

export interface Dream {
  id: string;
  title: string;
  content: string;
  date: Date;
  lucid: boolean;
  emotions: string[];
  clarity: number;
}

export interface DreamFilters {
  lucidOnly?: boolean;
  minClarity?: number;
  dateRange?: { start: Date; end: Date };
  emotions?: string[];
  searchTerm?: string;
}

/**
 * Hook for managing dream state and operations
 */
export function useDreams() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addDream = useCallback(async (dreamData: Omit<Dream, 'id'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const newDream: Dream = {
        ...dreamData,
        id: `dream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      setDreams(prev => [newDream, ...prev]);
      return newDream;
    } catch (err) {
      setError('Failed to add dream');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDream = useCallback(async (id: string, updates: Partial<Dream>) => {
    setLoading(true);
    setError(null);
    
    try {
      setDreams(prev => prev.map(dream => 
        dream.id === id ? { ...dream, ...updates } : dream
      ));
    } catch (err) {
      setError('Failed to update dream');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDream = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      setDreams(prev => prev.filter(dream => dream.id !== id));
    } catch (err) {
      setError('Failed to delete dream');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    dreams,
    loading,
    error,
    addDream,
    updateDream,
    deleteDream,
    setDreams
  };
}

/**
 * Hook for filtering and searching dreams
 */
export function useDreamFilters(dreams: Dream[], initialFilters: DreamFilters = {}) {
  const [filters, setFilters] = useState<DreamFilters>(initialFilters);

  const filteredDreams = useMemo(() => {
    return dreams.filter(dream => {
      if (filters.lucidOnly && !dream.lucid) return false;
      
      if (filters.minClarity && dream.clarity < filters.minClarity) return false;
      
      if (filters.dateRange) {
        const dreamDate = new Date(dream.date);
        if (dreamDate < filters.dateRange.start || dreamDate > filters.dateRange.end) {
          return false;
        }
      }
      
      if (filters.emotions && filters.emotions.length > 0) {
        const hasEmotion = filters.emotions.some(emotion => 
          dream.emotions.includes(emotion)
        );
        if (!hasEmotion) return false;
      }
      
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          dream.title.toLowerCase().includes(searchLower) ||
          dream.content.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      return true;
    });
  }, [dreams, filters]);

  const updateFilters = useCallback((newFilters: Partial<DreamFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    filters,
    filteredDreams,
    updateFilters,
    clearFilters,
    setFilters
  };
}

/**
 * Hook for dream statistics and analytics
 */
export function useDreamStats(dreams: Dream[]) {
  const stats = useMemo(() => {
    const total = dreams.length;
    const lucidCount = dreams.filter(d => d.lucid).length;
    const averageClarity = total > 0 
      ? dreams.reduce((sum, d) => sum + d.clarity, 0) / total 
      : 0;

    // Emotion frequency
    const emotionCounts: Record<string, number> = {};
    dreams.forEach(dream => {
      dream.emotions.forEach(emotion => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });

    const topEmotions = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    // Dreams per month
    const dreamsByMonth: Record<string, number> = {};
    dreams.forEach(dream => {
      const month = dream.date.toISOString().slice(0, 7);
      dreamsByMonth[month] = (dreamsByMonth[month] || 0) + 1;
    });

    // Recent activity (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentDreams = dreams.filter(d => new Date(d.date) >= weekAgo).length;

    return {
      total,
      lucidCount,
      lucidPercentage: total > 0 ? (lucidCount / total) * 100 : 0,
      averageClarity: Math.round(averageClarity * 100) / 100,
      topEmotions,
      dreamsByMonth,
      recentDreams
    };
  }, [dreams]);

  return stats;
}

/**
 * Hook for local storage persistence
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

/**
 * Hook for debounced search
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
} 