// Custom React Hooks for DreamAI Application
// This file demonstrates reusable hooks for dream functionality

import { useState, useEffect, useCallback, useMemo } from 'react';

// Basic dream data types (simplified)
interface Dream {
  id: string;
  title: string;
  description: string;
  dreamDate: Date;
  emotions: Array<{ type: string; intensity: number }>;
  tags: string[];
  lucidityLevel: string;
}

interface DreamInterpretation {
  id: string;
  dreamId: string;
  summary: string;
  confidence: number;
  generatedAt: Date;
}

// Hook for managing dreams in local storage
export function useDreamStorage() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDreams = () => {
      try {
        const stored = localStorage.getItem('dreamai_dreams');
        if (stored) {
          const parsed = JSON.parse(stored);
          setDreams(parsed.map((dream: any) => ({
            ...dream,
            dreamDate: new Date(dream.dreamDate)
          })));
        }
      } catch (error) {
        console.error('Failed to load dreams:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDreams();
  }, []);

  const saveDream = useCallback((dream: Omit<Dream, 'id'>) => {
    const newDream: Dream = {
      ...dream,
      id: `dream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    setDreams(prev => {
      const updated = [newDream, ...prev];
      localStorage.setItem('dreamai_dreams', JSON.stringify(updated));
      return updated;
    });

    return newDream;
  }, []);

  const updateDream = useCallback((id: string, updates: Partial<Dream>) => {
    setDreams(prev => {
      const updated = prev.map(dream => 
        dream.id === id ? { ...dream, ...updates } : dream
      );
      localStorage.setItem('dreamai_dreams', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteDream = useCallback((id: string) => {
    setDreams(prev => {
      const updated = prev.filter(dream => dream.id !== id);
      localStorage.setItem('dreamai_dreams', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    dreams,
    loading,
    saveDream,
    updateDream,
    deleteDream
  };
}

// Hook for dream search and filtering
export function useDreamFilter(dreams: Dream[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [emotionFilter, setEmotionFilter] = useState<string>('all');
  const [lucidityFilter, setLucidityFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});

  const filteredDreams = useMemo(() => {
    return dreams.filter(dream => {
      // Text search
      if (searchTerm && !dream.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !dream.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Emotion filter
      if (emotionFilter !== 'all' && 
          !dream.emotions.some(emotion => emotion.type === emotionFilter)) {
        return false;
      }

      // Lucidity filter
      if (lucidityFilter !== 'all' && dream.lucidityLevel !== lucidityFilter) {
        return false;
      }

      // Date range filter
      if (dateRange.start && dream.dreamDate < dateRange.start) {
        return false;
      }
      if (dateRange.end && dream.dreamDate > dateRange.end) {
        return false;
      }

      return true;
    });
  }, [dreams, searchTerm, emotionFilter, lucidityFilter, dateRange]);

  return {
    filteredDreams,
    searchTerm,
    setSearchTerm,
    emotionFilter,
    setEmotionFilter,
    lucidityFilter,
    setLucidityFilter,
    dateRange,
    setDateRange
  };
}

// Hook for dream analysis with debouncing
export function useDreamAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);
  const [interpretation, setInterpretation] = useState<DreamInterpretation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeDream = useCallback(async (dreamText: string) => {
    if (!dreamText.trim()) return;

    setAnalyzing(true);
    setError(null);

    try {
      // Simulate AI analysis with delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock interpretation
      const mockInterpretation: DreamInterpretation = {
        id: `interp-${Date.now()}`,
        dreamId: 'current',
        summary: `This dream appears to reflect ${getRandomTheme()} in your life. The symbols suggest ${getRandomInsight()}.`,
        confidence: 0.7 + Math.random() * 0.25,
        generatedAt: new Date()
      };

      setInterpretation(mockInterpretation);
    } catch (err) {
      setError('Failed to analyze dream');
    } finally {
      setAnalyzing(false);
    }
  }, []);

  return {
    analyzeDream,
    analyzing,
    interpretation,
    error,
    clearAnalysis: () => {
      setInterpretation(null);
      setError(null);
    }
  };
}

// Hook for dream statistics
export function useDreamStats(dreams: Dream[]) {
  return useMemo(() => {
    if (dreams.length === 0) {
      return {
        totalDreams: 0,
        averagePerWeek: 0,
        mostCommonEmotion: null,
        lucidityRate: 0,
        recentStreak: 0
      };
    }

    // Calculate stats
    const totalDreams = dreams.length;
    const sortedDreams = [...dreams].sort((a, b) => b.dreamDate.getTime() - a.dreamDate.getTime());
    
    // Average per week (based on date range)
    const oldestDate = dreams.reduce((oldest, dream) => 
      dream.dreamDate < oldest ? dream.dreamDate : oldest, dreams[0].dreamDate);
    const newestDate = dreams.reduce((newest, dream) => 
      dream.dreamDate > newest ? dream.dreamDate : newest, dreams[0].dreamDate);
    const weeksDiff = Math.max(1, (newestDate.getTime() - oldestDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const averagePerWeek = totalDreams / weeksDiff;

    // Most common emotion
    const emotionCounts: Record<string, number> = {};
    dreams.forEach(dream => {
      dream.emotions.forEach(emotion => {
        emotionCounts[emotion.type] = (emotionCounts[emotion.type] || 0) + 1;
      });
    });
    const mostCommonEmotion = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || null;

    // Lucidity rate
    const lucidDreams = dreams.filter(d => d.lucidityLevel !== 'none').length;
    const lucidityRate = (lucidDreams / totalDreams) * 100;

    // Recent streak (consecutive days with dreams)
    let recentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const hasDream = dreams.some(dream => 
        dream.dreamDate.toDateString() === checkDate.toDateString()
      );
      if (hasDream) {
        recentStreak++;
      } else if (recentStreak > 0) {
        break;
      }
    }

    return {
      totalDreams,
      averagePerWeek: Math.round(averagePerWeek * 10) / 10,
      mostCommonEmotion,
      lucidityRate: Math.round(lucidityRate),
      recentStreak
    };
  }, [dreams]);
}

// Hook for dream reminders and notifications
export function useDreamReminders() {
  const [reminderTime, setReminderTime] = useState<string>('22:00');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const stored = localStorage.getItem('dreamai_reminders');
    if (stored) {
      const settings = JSON.parse(stored);
      setReminderTime(settings.time || '22:00');
      setEnabled(settings.enabled || false);
    }
  }, []);

  const updateSettings = useCallback((time: string, isEnabled: boolean) => {
    setReminderTime(time);
    setEnabled(isEnabled);
    
    const settings = { time, enabled: isEnabled };
    localStorage.setItem('dreamai_reminders', JSON.stringify(settings));

    // In a real app, this would set up actual notifications
    if (isEnabled) {
      console.log(`Dream reminder set for ${time}`);
    }
  }, []);

  const scheduleReminder = useCallback(() => {
    if (!enabled) return;

    // Mock notification scheduling
    const now = new Date();
    const [hours, minutes] = reminderTime.split(':').map(Number);
    const reminderDate = new Date(now);
    reminderDate.setHours(hours, minutes, 0, 0);

    if (reminderDate <= now) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }

    const timeUntilReminder = reminderDate.getTime() - now.getTime();
    
    setTimeout(() => {
      // In a real app, this would show a notification
      console.log('Time to record your dreams!');
    }, timeUntilReminder);
  }, [enabled, reminderTime]);

  useEffect(() => {
    scheduleReminder();
  }, [scheduleReminder]);

  return {
    reminderTime,
    enabled,
    updateSettings
  };
}

// Helper functions
function getRandomTheme(): string {
  const themes = [
    'personal growth and transformation',
    'unresolved emotions from your past',
    'your current relationships and connections',
    'career aspirations and professional concerns',
    'creativity and self-expression',
    'spiritual awakening and deeper understanding'
  ];
  return themes[Math.floor(Math.random() * themes.length)];
}

function getRandomInsight(): string {
  const insights = [
    'a need for greater balance in your waking life',
    'hidden strengths you haven\'t fully recognized',
    'important changes on the horizon',
    'the importance of trusting your intuition',
    'unfinished business that needs attention',
    'new opportunities for personal development'
  ];
  return insights[Math.floor(Math.random() * insights.length)];
} 