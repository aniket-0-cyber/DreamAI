import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Dream } from '../dream-types';
import { sampleDreams, sampleInterpretations } from '../sample-dreams';
import { DreamCard } from './DreamCard';
import { DreamAnalysisDisplay } from './DreamAnalysisDisplay';
import { DreamInputForm } from './DreamInputForm';
import { DreamStatistics } from './DreamStatistics';

export const DreamJournalExample: React.FC = () => {
  const [dreams, setDreams] = useState<Dream[]>(sampleDreams);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddDream = async (dreamData: Partial<Dream>) => {
    const newDream: Dream = {
      id: `dream-${Date.now()}`,
      userId: 'current-user',
      emotions: [], // Would be filled by AI analysis
      symbols: [],  // Would be filled by AI analysis
      ...dreamData
    } as Dream;

    setDreams(prev => [newDream, ...prev]);
    setShowForm(false);
  };

  const selectedInterpretation = selectedDream 
    ? sampleInterpretations.find(i => i.dreamId === selectedDream.id)
    : null;

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-400">
            Dream Journal
          </h1>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-yellow-400 text-black hover:bg-yellow-300"
          >
            {showForm ? 'Cancel' : 'Add Dream'}
          </Button>
        </div>

        {showForm && (
          <div className="mb-8">
            <DreamInputForm onSubmit={handleAddDream} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {selectedDream ? (
              <div className="space-y-6">
                <Button
                  onClick={() => setSelectedDream(null)}
                  variant="outline"
                  className="mb-4"
                >
                  ← Back to Dreams
                </Button>
                <DreamCard dream={selectedDream} />
                {selectedInterpretation && (
                  <DreamAnalysisDisplay interpretation={selectedInterpretation} />
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white">Your Dreams</h2>
                <div className="grid gap-6">
                  {dreams.map((dream) => (
                    <DreamCard
                      key={dream.id}
                      dream={dream}
                      onClick={() => setSelectedDream(dream)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <DreamStatistics dreams={dreams} />
          </div>
        </div>
      </div>
    </div>
  );
}; 