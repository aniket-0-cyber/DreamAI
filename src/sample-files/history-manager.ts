/**
 * A utility for managing application state with undo/redo capabilities.
 * This implements the Memento and Command patterns to track state changes
 * and allow for time travel debugging or user-facing undo/redo functionality.
 */

// A generic "memento" that captures the state at a single point in time.
interface Memento<T> {
  getState(): T;
}

class ConcreteMemento<T> implements Memento<T> {
  constructor(private state: T) {}

  getState(): T {
    return this.state;
  }
}

// A "command" that can be executed to change the state.
export interface Command<T> {
  execute(state: T): T;
}

/**
 * The main class that manages state history (the "Caretaker" in the Memento pattern).
 */
export class HistoryManager<T> {
  private history: Memento<T>[] = [];
  private cursor = -1; // Points to the current state in the history array

  constructor(private currentState: T, private historyLimit = 50) {
    this.save();
  }

  /**
   * Executes a command, updates the current state, and saves it to history.
   * @param command The command to execute.
   */
  execute(command: Command<T>): void {
    const newState = command.execute(this.currentState);

    // If we have undone actions, new actions should clear the "future" history.
    if (this.cursor < this.history.length - 1) {
      this.history = this.history.slice(0, this.cursor + 1);
    }
    
    this.currentState = newState;
    this.save();
  }

  /**
   * Saves the current state to the history stack.
   */
  private save(): void {
    if (this.history.length >= this.historyLimit) {
      this.history.shift(); // Remove the oldest state
    }
    
    // Deep clone the state to prevent mutations
    const deepClonedState = JSON.parse(JSON.stringify(this.currentState));
    this.history.push(new ConcreteMemento(deepClonedState));
    this.cursor = this.history.length - 1;
  }
  
  /**
   * Moves the cursor back in history and restores the previous state.
   */
  undo(): T {
    if (!this.canUndo()) {
      return this.currentState;
    }
    this.cursor--;
    this.currentState = this.history[this.cursor].getState();
    return this.currentState;
  }

  /**
   * Moves the cursor forward in history and restores the next state.
   */
  redo(): T {
    if (!this.canRedo()) {
      return this.currentState;
    }
    this.cursor++;
    this.currentState = this.history[this.cursor].getState();
    return this.currentState;
  }

  canUndo(): boolean {
    return this.cursor > 0;
  }

  canRedo(): boolean {
    return this.cursor < this.history.length - 1;
  }

  getCurrentState(): T {
    return this.currentState;
  }
}

// --- Example Usage with a Dream Journal State ---

interface Dream {
  id: string;
  title: string;
}

interface JournalState {
  dreams: Dream[];
  activeFilter: 'all' | 'lucid' | 'nightmare';
}

// Example Commands
class AddDreamCommand implements Command<JournalState> {
  constructor(private newDream: Dream) {}
  execute(state: JournalState): JournalState {
    return { ...state, dreams: [...state.dreams, this.newDream] };
  }
}

class UpdateFilterCommand implements Command<JournalState> {
  constructor(private newFilter: JournalState['activeFilter']) {}
  execute(state: JournalState): JournalState {
    return { ...state, activeFilter: this.newFilter };
  }
}

/*
  // --- How to use the HistoryManager ---
  const initialState: JournalState = {
    dreams: [],
    activeFilter: 'all',
  };

  const journalHistory = new HistoryManager(initialState);

  console.log('Initial State:', journalHistory.getCurrentState());

  // Execute some commands
  journalHistory.execute(new AddDreamCommand({ id: 'd1', title: 'Flying' }));
  journalHistory.execute(new AddDreamCommand({ id: 'd2', title: 'Underwater City' }));
  console.log('State after adding dreams:', journalHistory.getCurrentState());

  journalHistory.execute(new UpdateFilterCommand('lucid'));
  console.log('State after changing filter:', journalHistory.getCurrentState());

  // Undo and Redo
  console.log('\n--- Time Travel ---');
  journalHistory.undo();
  console.log('After Undo:', journalHistory.getCurrentState()); // Filter is back to 'all'

  journalHistory.undo();
  console.log('After 2nd Undo:', journalHistory.getCurrentState()); // Only first dream exists

  journalHistory.redo();
  console.log('After Redo:', journalHistory.getCurrentState()); // Both dreams exist again

  // Add a new command after undoing
  journalHistory.execute(new AddDreamCommand({ id: 'd3', title: 'New Future' }));
  console.log('\nAfter new command:', journalHistory.getCurrentState());

  console.log('Can redo?', journalHistory.canRedo()); // false, because the old "future" was erased.
*/ 