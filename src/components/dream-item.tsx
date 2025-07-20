import React from 'react';
import { Dream } from '../lib/dream-utils';
import { useDreamStore } from '../store/dream-store';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';

interface DreamItemProps {
  dream: Dream;
}

export function DreamItem({ dream }: DreamItemProps) {
  const { actions } = useDreamStore();

  const handleClarityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.updateClarity(dream.id, parseInt(e.target.value, 10));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dream.title}</CardTitle>
        <p className="text-sm text-gray-500">
          {dream.date.toLocaleDateString()} - {dream.isLucid ? 'Lucid' : 'Normal'}
        </p>
      </CardHeader>
      <CardContent>
        <p>{dream.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
            <label htmlFor={`clarity-${dream.id}`}>Clarity: {dream.clarity}</label>
            <input
                id={`clarity-${dream.id}`}
                type="range"
                min="1"
                max="10"
                value={dream.clarity}
                onChange={handleClarityChange}
            />
        </div>
        <Button variant="destructive" size="sm" onClick={() => actions.deleteDream(dream.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
} 