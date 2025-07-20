import React, { useState, useEffect } from 'react';
import { useDreamStore, subscribe } from '../store/dream-store';
import { Dream } from '../lib/dream-utils';
import { DreamItem } from './dream-item';

export function DreamList() {
  const initialState = useDreamStore();
  const [dreams, setDreams] = useState<Dream[]>(initialState.dreams);

  useEffect(() => {
    const unsubscribe = subscribe(newState => {
      setDreams(newState.dreams);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Dream Journal</h2>
      {dreams.length === 0 ? (
        <p>You haven't recorded any dreams yet.</p>
      ) : (
        dreams.map(dream => <DreamItem key={dream.id} dream={dream} />)
      )}
    </div>
  );
} 