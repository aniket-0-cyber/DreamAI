/**
 * Simple state management store for dreams using a Zustand-like pattern.
 * This provides a centralized place to manage dream state and actions.
 */

export interface Dream {
  id: string;
  title: string;
  content: string;
  date: Date;
  lucid: boolean;
  emotions: string[];
  clarity: number;
}

export interface DreamState {
  dreams: Dream[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  selectedDreamId: string | null;
}

export type DreamAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Dream[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_DREAM'; payload: Dream }
  | { type: 'UPDATE_DREAM'; payload: Partial<Dream> & { id: string } }
  | { type: 'DELETE_DREAM'; payload: string }
  | { type: 'SELECT_DREAM'; payload: string | null };

export const initialState: DreamState = {
  dreams: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  selectedDreamId: null,
};

/**
 * The reducer function that handles state transitions based on actions.
 */
export function dreamReducer(state: DreamState, action: DreamAction): DreamState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        dreams: action.payload,
        lastUpdated: Date.now(),
      };
      
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };

    case 'ADD_DREAM':
      return {
        ...state,
        dreams: [action.payload, ...state.dreams],
        lastUpdated: Date.now(),
      };

    case 'UPDATE_DREAM':
      return {
        ...state,
        dreams: state.dreams.map(dream =>
          dream.id === action.payload.id ? { ...dream, ...action.payload } : dream
        ),
        lastUpdated: Date.now(),
      };

    case 'DELETE_DREAM':
      return {
        ...state,
        dreams: state.dreams.filter(dream => dream.id !== action.payload),
        selectedDreamId: state.selectedDreamId === action.payload ? null : state.selectedDreamId,
        lastUpdated: Date.now(),
      };
      
    case 'SELECT_DREAM':
      return { ...state, selectedDreamId: action.payload };

    default:
      return state;
  }
}

/**
 * Creates a "store" that holds state and allows dispatching actions.
 * Listeners can subscribe to state changes.
 */
export function createStore(
  reducer: typeof dreamReducer,
  initialState: DreamState
) {
  let state = initialState;
  const listeners = new Set<() => void>();

  function getState(): DreamState {
    return state;
  }

  function dispatch(action: DreamAction): void {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  }

  function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  return {
    getState,
    dispatch,
    subscribe,
  };
}

// Example store instance
export const dreamStore = createStore(dreamReducer, initialState);

// --- Selectors ---
// Functions to derive data from the state, often used in components.

export function selectDreams(state: DreamState): Dream[] {
  return state.dreams;
}

export function selectIsLoading(state: DreamState): boolean {
  return state.isLoading;
}

export function selectError(state: DreamState): string | null {
  return state.error;
}

export function selectDreamById(state: DreamState, id: string | null): Dream | undefined {
  if (!id) return undefined;
  return state.dreams.find(dream => dream.id === id);
}

export function selectSelectedDream(state: DreamState): Dream | undefined {
  return selectDreamById(state, state.selectedDreamId);
}

export function selectLucidDreams(state: DreamState): Dream[] {
  return state.dreams.filter(dream => dream.lucid);
}

export function selectDreamsByClarity(state: DreamState, minClarity: number): Dream[] {
  return state.dreams.filter(dream => dream.clarity >= minClarity);
}

// --- Action Creators ---
// Helper functions to create action objects for dispatching.

export const actions = {
  fetchStart: (): DreamAction => ({ type: 'FETCH_START' }),
  fetchSuccess: (dreams: Dream[]): DreamAction => ({ type: 'FETCH_SUCCESS', payload: dreams }),
  fetchError: (error: string): DreamAction => ({ type: 'FETCH_ERROR', payload: error }),
  addDream: (dream: Dream): DreamAction => ({ type: 'ADD_DREAM', payload: dream }),
  updateDream: (dreamUpdate: Partial<Dream> & { id: string }): DreamAction => ({
    type: 'UPDATE_DREAM',
    payload: dreamUpdate,
  }),
  deleteDream: (id: string): DreamAction => ({ type: 'DELETE_DREAM', payload: id }),
  selectDream: (id: string | null): DreamAction => ({ type: 'SELECT_DREAM', payload: id }),
};

// --- Async Thunk Example ---
// Simulates fetching data from an API and dispatching actions.

export async function fetchDreamsFromApi(dispatch: (action: DreamAction) => void) {
  dispatch(actions.fetchStart());
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check for random error
    if (Math.random() < 0.2) {
      throw new Error('Failed to fetch dreams from the server.');
    }

    // Mock data
    const mockDreams: Dream[] = [
      { id: '1', title: 'API Dream 1', content: 'Fetched from API', date: new Date(), lucid: true, emotions: ['excitement'], clarity: 8 },
      { id: '2', title: 'API Dream 2', content: 'Another API dream', date: new Date(), lucid: false, emotions: ['calm'], clarity: 6 },
    ];

    dispatch(actions.fetchSuccess(mockDreams));
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
    dispatch(actions.fetchError(errorMessage));
  }
} 