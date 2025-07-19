import React from 'react';
import { Brain, Heart, Sparkles } from 'lucide-react';
import { DreamInterpretation } from '../dream-types';

export const DreamAnalysisDisplay: React.FC<{ interpretation: DreamInterpretation }> = ({ interpretation }) => {
  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-md rounded-xl p-8 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Dream Analysis</h2>
        <div className="ml-auto">
          <span className="px-3 py-1 bg-green-400/20 text-green-300 rounded-full text-sm">
            {Math.round(interpretation.confidence * 100)}% confidence
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Summary */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Summary</h3>
          <p className="text-gray-200">{interpretation.summary}</p>
        </div>

        {/* Detailed Analysis */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Detailed Analysis</h3>
          <p className="text-gray-200">{interpretation.detailedAnalysis}</p>
        </div>

        {/* Psychological Insights */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Psychological Insights</h3>
          <ul className="space-y-2">
            {interpretation.psychologicalInsights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-200">
                <Sparkles className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                {insight}
              </li>
            ))}
          </ul>
        </div>

        {/* Symbol Interpretations */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Symbol Meanings</h3>
          <div className="grid gap-4">
            {interpretation.symbolInterpretations.map((symbol, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-200">{symbol.interpretation}</p>
                <div className="flex gap-2 mt-2">
                  {symbol.connections.map((connection) => (
                    <span 
                      key={connection}
                      className="px-2 py-1 bg-purple-400/20 text-purple-300 text-xs rounded"
                    >
                      {connection}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Recommendations</h3>
          <ul className="space-y-2">
            {interpretation.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-200">
                <Heart className="w-4 h-4 text-pink-400 mt-1 flex-shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}; 