import React, { useState } from 'react';
import { useDreamStore } from '../store/dream-store';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function AddDreamForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLucid, setIsLucid] = useState(false);
  const [clarity, setClarity] = useState(5);
  const { actions } = useDreamStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Title and content are required.');
      return;
    }
    actions.addDream({ title, content, isLucid, clarity });
    setTitle('');
    setContent('');
    setIsLucid(false);
    setClarity(5);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record a New Dream</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Dream Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Describe your dream..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isLucid}
                onChange={(e) => setIsLucid(e.target.checked)}
              />
              <span>Lucid Dream?</span>
            </label>
            <label className="flex items-center space-x-2">
                <span>Clarity: {clarity}</span>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={clarity}
                    onChange={(e) => setClarity(Number(e.target.value))}
                />
            </label>
          </div>
          <Button type="submit">Save Dream</Button>
        </form>
      </CardContent>
    </Card>
  );
} 