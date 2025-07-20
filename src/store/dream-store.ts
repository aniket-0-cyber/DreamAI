import { Dream } from '../lib/dream-utils';

interface DreamState {
  dreams: Dream[];
  actions: {
    addDream: (dream: Omit<Dream, 'id' | 'date'>) => void;
    deleteDream: (id: string) => void;
    updateClarity: (id: string, clarity: number) => void;
  };
}

type Listener = (state: DreamState) => void;

let state: DreamState;
const listeners: Set<Listener> = new Set();

const initialState: Dream[] = [
    {
        id: 'dream-1',
        title: 'Flying Over Mountains',
        content: 'I was flying over beautiful snow-capped mountains. The view was incredible and I felt completely peaceful.',
        date: new Date('2023-10-25T10:00:00Z'),
        isLucid: true,
        clarity: 9,
    },
    {
        id: 'dream-2',
        title: 'Meeting an Old Friend',
        content: 'I met a friend I hadn\'t seen in years. We had a long conversation in a cozy cafe.',
        date: new Date('2023-10-24T22:30:00Z'),
        isLucid: false,
        clarity: 7,
    },
];

const actions = {
  addDream: (dreamData: Omit<Dream, 'id' | 'date'>) => {
    const newDream: Dream = {
      ...dreamData,
      id: `dream_${Date.now()}`,
      date: new Date(),
    };
    state = { ...state, dreams: [newDream, ...state.dreams] };
    notify();
  },
  deleteDream: (id: string) => {
    state = {
      ...state,
      dreams: state.dreams.filter(dream => dream.id !== id),
    };
    notify();
  },
  updateClarity: (id: string, clarity: number) => {
    state = {
        ...state,
        dreams: state.dreams.map(dream =>
            dream.id === id ? { ...dream, clarity } : dream
        ),
    };
    notify();
  }
};

state = {
  dreams: initialState,
  actions,
};

function notify() {
  listeners.forEach(listener => listener(state));
}

export function useDreamStore() {
  // This is a simplified hook that doesn't use React context for simplicity.
  // In a real app, you'd use React.useState and useEffect to subscribe.
  return state;
}

export function subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
} 