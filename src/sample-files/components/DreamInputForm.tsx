import React, { useState } from 'react';
import { Moon } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Dream, LucidityLevel, SleepQuality } from '../dream-types';

export const DreamInputForm: React.FC<{ onSubmit: (dreamData: Partial<Dream>) => void }> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lucidity, setLucidity] = useState<LucidityLevel>('none');
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>('good');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    
    const dreamData: Partial<Dream> = {
      title: title.trim(),
      description: description.trim(),
      lucidityLevel: lucidity,
      sleepQuality: sleepQuality,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      dreamDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
      emotions: [], // Would be filled by analysis
      symbols: []  // Would be filled by analysis
    };

    try {
      await onSubmit(dreamData);
      // Reset form
      setTitle('');
      setDescription('');
      setTags('');
      setLucidity('none');
      setSleepQuality('good');
    } catch (error) {
      console.error('Error submitting dream:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <Moon className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Record Your Dream</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Dream Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your dream a memorable title..."
            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Dream Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your dream in detail..."
            className="w-full h-32 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lucidity Level
            </label>
            <select
              value={lucidity}
              onChange={(e) => setLucidity(e.target.value as LucidityLevel)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="none" className="bg-gray-800">Not lucid</option>
              <option value="low" className="bg-gray-800">Slightly aware</option>
              <option value="medium" className="bg-gray-800">Somewhat lucid</option>
              <option value="high" className="bg-gray-800">Very lucid</option>
              <option value="full" className="bg-gray-800">Fully lucid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sleep Quality
            </label>
            <select
              value={sleepQuality}
              onChange={(e) => setSleepQuality(e.target.value as SleepQuality)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="poor" className="bg-gray-800">Poor</option>
              <option value="fair" className="bg-gray-800">Fair</option>
              <option value="good" className="bg-gray-800">Good</option>
              <option value="excellent" className="bg-gray-800">Excellent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tags (comma-separated)
          </label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="flying, water, family, spiritual..."
            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !title.trim() || !description.trim()}
          className="w-full bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Recording Dream...' : 'Record Dream'}
        </Button>
      </form>
    </div>
  );
}; 