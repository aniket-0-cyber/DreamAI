// Advanced Dream Visualization Components
// Interactive charts and visual analytics for dream data

import React, { useState, useEffect, useMemo } from 'react';

// Dream data interfaces
export interface DreamVisualizationData {
  id: string;
  date: Date;
  title: string;
  emotions: Array<{ type: string; intensity: number }>;
  themes: string[];
  lucidityLevel: number; // 0-10
  sleepQuality: number; // 1-10
  duration: number; // minutes
  symbols: string[];
  mood: 'positive' | 'negative' | 'neutral';
}

export interface VisualizationProps {
  dreams: DreamVisualizationData[];
  timeRange: 'week' | 'month' | 'year' | 'all';
  onDreamSelect?: (dreamId: string) => void;
}

// Emotion Radar Chart Component
export const EmotionRadarChart: React.FC<{ emotions: Array<{ type: string; intensity: number }> }> = ({ emotions }) => {
  const emotionColors = {
    fear: '#ef4444',
    joy: '#22c55e',
    anxiety: '#f59e0b',
    sadness: '#3b82f6',
    anger: '#dc2626',
    peace: '#10b981',
    love: '#ec4899',
    surprise: '#8b5cf6'
  };

  const maxIntensity = 10;
  const centerX = 150;
  const centerY = 150;
  const radius = 100;

  // Calculate points for the radar chart
  const points = emotions.map((emotion, index) => {
    const angle = (index * 2 * Math.PI) / emotions.length;
    const intensity = emotion.intensity / maxIntensity;
    const x = centerX + Math.cos(angle - Math.PI / 2) * radius * intensity;
    const y = centerY + Math.sin(angle - Math.PI / 2) * radius * intensity;
    return { x, y, emotion };
  });

  // Create radar grid lines
  const gridLines = [];
  for (let i = 1; i <= 5; i++) {
    const gridRadius = (radius * i) / 5;
    gridLines.push(
      <circle
        key={i}
        cx={centerX}
        cy={centerY}
        r={gridRadius}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
    );
  }

  // Create axis lines
  const axisLines = emotions.map((emotion, index) => {
    const angle = (index * 2 * Math.PI) / emotions.length;
    const endX = centerX + Math.cos(angle - Math.PI / 2) * radius;
    const endY = centerY + Math.sin(angle - Math.PI / 2) * radius;
    const labelX = centerX + Math.cos(angle - Math.PI / 2) * (radius + 20);
    const labelY = centerY + Math.sin(angle - Math.PI / 2) * (radius + 20);

    return (
      <g key={emotion.type}>
        <line
          x1={centerX}
          y1={centerY}
          x2={endX}
          y2={endY}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
        <text
          x={labelX}
          y={labelY}
          fill="white"
          fontSize="12"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {emotion.type}
        </text>
      </g>
    );
  });

  // Create the emotion polygon
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ') + ' Z';

  return (
    <div className="bg-white/10 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-yellow-400 mb-4">Emotion Intensity</h3>
      <svg width="300" height="300" className="mx-auto">
        {gridLines}
        {axisLines}
        <path
          d={pathData}
          fill="rgba(59, 130, 246, 0.3)"
          stroke="#3b82f6"
          strokeWidth="2"
        />
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={emotionColors[point.emotion.type as keyof typeof emotionColors] || '#6b7280'}
          />
        ))}
      </svg>
    </div>
  );
};

// Dream Timeline Component
export const DreamTimeline: React.FC<VisualizationProps> = ({ dreams, timeRange, onDreamSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Filter dreams by time range
  const filteredDreams = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        cutoffDate.setFullYear(1900);
    }
    
    return dreams.filter(dream => dream.date >= cutoffDate);
  }, [dreams, timeRange]);

  // Group dreams by date
  const dreamsByDate = useMemo(() => {
    return filteredDreams.reduce((acc, dream) => {
      const dateKey = dream.date.toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(dream);
      return acc;
    }, {} as Record<string, DreamVisualizationData[]>);
  }, [filteredDreams]);

  const getMoodColor = (mood: string): string => {
    switch (mood) {
      case 'positive': return '#22c55e';
      case 'negative': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="bg-white/10 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-yellow-400 mb-4">Dream Timeline</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {Object.entries(dreamsByDate).map(([dateString, dayDreams]) => (
          <div key={dateString} className="border-l-2 border-blue-500 pl-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white">{new Date(dateString).toLocaleDateString()}</h4>
              <span className="text-sm text-gray-400">{dayDreams.length} dream(s)</span>
            </div>
            <div className="space-y-2">
              {dayDreams.map(dream => (
                <div
                  key={dream.id}
                  className="bg-white/5 rounded p-3 cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => onDreamSelect?.(dream.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-white text-sm">{dream.title}</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getMoodColor(dream.mood) }}
                      />
                      <span className="text-xs text-gray-400">
                        {dream.lucidityLevel > 5 ? '✨ Lucid' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {dream.themes.slice(0, 3).map(theme => (
                      <span
                        key={theme}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Dream Patterns Heatmap
export const DreamPatternsHeatmap: React.FC<{ dreams: DreamVisualizationData[] }> = ({ dreams }) => {
  // Create a heatmap showing dream frequency and intensity by day of week and time
  const heatmapData = useMemo(() => {
    const data: Array<Array<{ count: number; avgIntensity: number }>> = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);

    // Initialize data structure
    for (let day = 0; day < 7; day++) {
      data[day] = [];
      for (let hour = 0; hour < 24; hour++) {
        data[day][hour] = { count: 0, avgIntensity: 0 };
      }
    }

    // Populate with dream data
    dreams.forEach(dream => {
      const dayOfWeek = dream.date.getDay();
      const hour = dream.date.getHours();
      const avgEmotion = dream.emotions.reduce((sum, e) => sum + e.intensity, 0) / dream.emotions.length || 0;
      
      data[dayOfWeek][hour].count++;
      data[dayOfWeek][hour].avgIntensity = 
        (data[dayOfWeek][hour].avgIntensity + avgEmotion) / 2;
    });

    return data;
  }, [dreams]);

  const maxCount = Math.max(...heatmapData.flat().map(cell => cell.count));

  const getHeatmapColor = (count: number, intensity: number): string => {
    if (count === 0) return 'rgba(255,255,255,0.1)';
    
    const opacity = Math.min(count / maxCount, 1);
    const hue = intensity > 5 ? 0 : 120; // Red for high intensity, green for low
    return `hsla(${hue}, 70%, 50%, ${opacity})`;
  };

  return (
    <div className="bg-white/10 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-yellow-400 mb-4">Dream Patterns</h3>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-25 gap-1 min-w-max">
          {/* Header row with hours */}
          <div></div>
          {Array.from({ length: 24 }, (_, hour) => (
            <div key={hour} className="text-xs text-gray-400 text-center">
              {hour}
            </div>
          ))}
          
          {/* Data rows */}
          {heatmapData.map((dayData, dayIndex) => (
            <React.Fragment key={dayIndex}>
              <div className="text-xs text-gray-400 flex items-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex]}
              </div>
              {dayData.map((cellData, hourIndex) => (
                <div
                  key={`${dayIndex}-${hourIndex}`}
                  className="w-4 h-4 rounded-sm relative group cursor-pointer"
                  style={{ 
                    backgroundColor: getHeatmapColor(cellData.count, cellData.avgIntensity)
                  }}
                  title={`${cellData.count} dreams, avg intensity: ${cellData.avgIntensity.toFixed(1)}`}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {cellData.count} dreams<br/>
                    Intensity: {cellData.avgIntensity.toFixed(1)}
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          {[0.2, 0.4, 0.6, 0.8, 1.0].map(opacity => (
            <div
              key={opacity}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: `rgba(59, 130, 246, ${opacity})` }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

// Symbol Cloud Component
export const DreamSymbolCloud: React.FC<{ dreams: DreamVisualizationData[] }> = ({ dreams }) => {
  const symbolFrequency = useMemo(() => {
    const frequency: Record<string, number> = {};
    
    dreams.forEach(dream => {
      dream.symbols.forEach(symbol => {
        frequency[symbol] = (frequency[symbol] || 0) + 1;
      });
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20); // Top 20 symbols
  }, [dreams]);

  const maxFrequency = symbolFrequency[0]?.[1] || 1;

  const getSymbolSize = (frequency: number): number => {
    return 12 + (frequency / maxFrequency) * 24; // 12px to 36px
  };

  const getSymbolColor = (frequency: number): string => {
    const intensity = frequency / maxFrequency;
    const hue = 200 + intensity * 60; // Blue to purple
    return `hsl(${hue}, 70%, ${60 + intensity * 20}%)`;
  };

  return (
    <div className="bg-white/10 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-yellow-400 mb-4">Dream Symbols</h3>
      <div className="flex flex-wrap gap-3 justify-center items-center min-h-32">
        {symbolFrequency.map(([symbol, frequency]) => (
          <span
            key={symbol}
            className="font-medium cursor-pointer hover:opacity-80 transition-opacity"
            style={{
              fontSize: `${getSymbolSize(frequency)}px`,
              color: getSymbolColor(frequency)
            }}
            title={`Appears ${frequency} times`}
          >
            {symbol}
          </span>
        ))}
      </div>
    </div>
  );
};

// Sleep Quality vs Dream Intensity Scatter Plot
export const SleepQualityChart: React.FC<{ dreams: DreamVisualizationData[] }> = ({ dreams }) => {
  const chartData = dreams.map(dream => {
    const avgEmotionIntensity = dream.emotions.reduce((sum, e) => sum + e.intensity, 0) / dream.emotions.length || 0;
    return {
      sleepQuality: dream.sleepQuality,
      emotionIntensity: avgEmotionIntensity,
      lucidity: dream.lucidityLevel,
      mood: dream.mood,
      title: dream.title
    };
  });

  const width = 400;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const getMoodColor = (mood: string): string => {
    switch (mood) {
      case 'positive': return '#22c55e';
      case 'negative': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="bg-white/10 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-yellow-400 mb-4">Sleep Quality vs Dream Intensity</h3>
      <svg width={width} height={height} className="mx-auto">
        {/* Grid lines */}
        {[2, 4, 6, 8, 10].map(value => (
          <g key={value}>
            <line
              x1={margin.left}
              y1={margin.top + (chartHeight * (10 - value)) / 10}
              x2={margin.left + chartWidth}
              y2={margin.top + (chartHeight * (10 - value)) / 10}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
            <line
              x1={margin.left + (chartWidth * value) / 10}
              y1={margin.top}
              x2={margin.left + (chartWidth * value) / 10}
              y2={margin.top + chartHeight}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          </g>
        ))}
        
        {/* Axes */}
        <line
          x1={margin.left}
          y1={margin.top + chartHeight}
          x2={margin.left + chartWidth}
          y2={margin.top + chartHeight}
          stroke="white"
          strokeWidth="2"
        />
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={margin.top + chartHeight}
          stroke="white"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {chartData.map((point, index) => (
          <circle
            key={index}
            cx={margin.left + (chartWidth * point.sleepQuality) / 10}
            cy={margin.top + (chartHeight * (10 - point.emotionIntensity)) / 10}
            r={3 + point.lucidity / 2}
            fill={getMoodColor(point.mood)}
            fillOpacity={0.7}
            stroke="white"
            strokeWidth="1"
            className="cursor-pointer hover:fill-opacity-100"
          >
            <title>{point.title} - Sleep: {point.sleepQuality}, Intensity: {point.emotionIntensity.toFixed(1)}</title>
          </circle>
        ))}
        
        {/* Labels */}
        <text
          x={margin.left + chartWidth / 2}
          y={height - 10}
          textAnchor="middle"
          fill="white"
          fontSize="12"
        >
          Sleep Quality
        </text>
        <text
          x={15}
          y={margin.top + chartHeight / 2}
          textAnchor="middle"
          fill="white"
          fontSize="12"
          transform={`rotate(-90, 15, ${margin.top + chartHeight / 2})`}
        >
          Emotion Intensity
        </text>
      </svg>
    </div>
  );
};

// Main Dashboard Component
export const DreamVisualizationDashboard: React.FC<VisualizationProps> = ({ dreams, timeRange, onDreamSelect }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'emotions' | 'symbols'>('overview');

  // Calculate summary statistics
  const stats = useMemo(() => {
    const totalDreams = dreams.length;
    const lucidDreams = dreams.filter(d => d.lucidityLevel > 5).length;
    const avgSleepQuality = dreams.reduce((sum, d) => sum + d.sleepQuality, 0) / dreams.length || 0;
    const mostCommonMood = dreams.reduce((acc, d) => {
      acc[d.mood] = (acc[d.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const dominantMood = Object.entries(mostCommonMood).sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

    return {
      totalDreams,
      lucidDreams,
      lucidPercentage: (lucidDreams / totalDreams) * 100 || 0,
      avgSleepQuality,
      dominantMood
    };
  }, [dreams]);

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'patterns', label: '🔄 Patterns', icon: '🔄' },
    { id: 'emotions', label: '❤️ Emotions', icon: '❤️' },
    { id: 'symbols', label: '🔮 Symbols', icon: '🔮' }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Dream Analytics Dashboard
          </h1>
          <p className="text-gray-300">Visualize and analyze your dream patterns</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.totalDreams}</div>
            <div className="text-sm text-gray-300">Total Dreams</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.lucidPercentage.toFixed(1)}%</div>
            <div className="text-sm text-gray-300">Lucid Dreams</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.avgSleepQuality.toFixed(1)}</div>
            <div className="text-sm text-gray-300">Avg Sleep Quality</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 capitalize">{stats.dominantMood}</div>
            <div className="text-sm text-gray-300">Dominant Mood</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/10 rounded-lg p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DreamTimeline dreams={dreams} timeRange={timeRange} onDreamSelect={onDreamSelect} />
              <SleepQualityChart dreams={dreams} />
            </div>
          )}
          
          {activeTab === 'patterns' && (
            <div className="grid grid-cols-1 gap-6">
              <DreamPatternsHeatmap dreams={dreams} />
            </div>
          )}
          
          {activeTab === 'emotions' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dreams.length > 0 && (
                <EmotionRadarChart emotions={dreams[dreams.length - 1].emotions} />
              )}
            </div>
          )}
          
          {activeTab === 'symbols' && (
            <div className="grid grid-cols-1 gap-6">
              <DreamSymbolCloud dreams={dreams} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 