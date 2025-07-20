/**
 * A generic, type-safe Finite State Machine (FSM).
 * This provides a structured way to manage complex states and transitions,
 * preventing invalid state changes and making state logic predictable.
 * It's an excellent pattern for managing component state, API request cycles, etc.
 */

// TState and TEvent are generic and will be string literal types.
export interface StateMachineConfig<TState extends string, TEvent extends string> {
  id?: string;
  initial: TState;
  states: {
    [S in TState]: {
      on?: {
        [E in TEvent]?: {
          target: TState;
          action?: (payload?: any) => void;
        };
      };
      onEnter?: () => void;
      onExit?: () => void;
    };
  };
}

export interface State<TState extends string> {
  value: TState;
}

/**
 * The StateMachine class that interprets the config and manages state.
 */
export class StateMachine<TState extends string, TEvent extends string> {
  private currentState: TState;
  private config: StateMachineConfig<TState, TEvent>;

  constructor(config: StateMachineConfig<TState, TEvent>) {
    this.config = config;
    this.currentState = config.initial;
    this.config.states[this.currentState].onEnter?.();
  }

  /**
   * The current state of the machine.
   */
  public get value(): TState {
    return this.currentState;
  }

  /**
   * Transitions the machine to a new state based on an event.
   * @param event The event that triggers the transition.
   * @param payload Optional data to pass to the action.
   */
  public send(event: TEvent, payload?: any): TState {
    const currentStateConfig = this.config.states[this.currentState];
    const transitionConfig = currentStateConfig.on?.[event];

    if (!transitionConfig) {
      console.warn(`[FSM] No transition found for event '${event}' in state '${this.currentState}'.`);
      return this.currentState;
    }

    const { target, action } = transitionConfig;

    // Execute exit action of the current state
    currentStateConfig.onExit?.();

    // Execute the transition action
    action?.(payload);

    // Update the state
    this.currentState = target;

    // Execute enter action of the new state
    this.config.states[this.currentState].onEnter?.();

    return this.currentState;
  }

  /**
   * Checks if a transition is possible from the current state for a given event.
   * @param event The event to check.
   */
  public can(event: TEvent): boolean {
    return !!this.config.states[this.currentState].on?.[event];
  }
}

/**
 * Factory function to create a state machine.
 */
export function createMachine<TState extends string, TEvent extends string>(
  config: StateMachineConfig<TState, TEvent>
): StateMachine<TState, TEvent> {
  return new StateMachine(config);
}


// --- Example Usage: Data Fetching Machine ---

type FetchState = 'idle' | 'loading' | 'success' | 'failure';
type FetchEvent = 'FETCH' | 'RESOLVE' | 'REJECT' | 'RETRY';

export const fetchMachineConfig: StateMachineConfig<FetchState, FetchEvent> = {
  id: 'fetch-machine',
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: { target: 'loading' },
      },
      onEnter: () => console.log('Entering idle state. Ready to fetch.'),
    },
    loading: {
      on: {
        RESOLVE: { target: 'success' },
        REJECT: { target: 'failure' },
      },
      onEnter: () => console.log('Entering loading state. Fetching data...'),
      onExit: () => console.log('Exiting loading state.'),
    },
    success: {
      on: {
        FETCH: { target: 'loading' }, // Allow re-fetching
      },
      onEnter: () => console.log('Entering success state. Data fetched successfully!'),
    },
    failure: {
      on: {
        RETRY: {
          target: 'loading',
          action: (payload) => console.log(`Retrying fetch. Attempt #${payload?.attempt}`),
        },
      },
      onEnter: () => console.error('Entering failure state. Something went wrong.'),
    },
  },
};

/*
  // How to use the example machine:
  const machine = createMachine(fetchMachineConfig);

  console.log(`Current state: ${machine.value}`); // "idle"
  machine.send('FETCH');
  console.log(`Current state: ${machine.value}`); // "loading"

  // Simulate a successful API call
  setTimeout(() => {
    machine.send('RESOLVE');
    console.log(`Current state: ${machine.value}`); // "success"
  }, 1000);

  // Or simulate a failed API call
  // setTimeout(() => {
  //   machine.send('REJECT');
  //   console.log(`Current state: ${machine.value}`); // "failure"
  //   machine.send('RETRY', { attempt: 1 });
  //   console.log(`Current state: ${machine.value}`); // "loading"
  // }, 1000);
*/ 