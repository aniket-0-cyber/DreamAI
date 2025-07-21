// src/sample-files/state-machine.ts

interface StateMachineConfig<TState extends string, TAction extends string> {
  initial: TState;
  states: {
    [state in TState]: {
      on: {
        [action in TAction]?: TState;
      };
      onEnter?: () => void;
      onExit?: () => void;
    };
  };
}

class StateMachine<TState extends string, TAction extends string> {
  private currentState: TState;
  private config: StateMachineConfig<TState, TAction>;

  constructor(config: StateMachineConfig<TState, TAction>) {
    this.config = config;
    this.currentState = config.initial;
    this.config.states[this.currentState].onEnter?.();
  }

  public transition(action: TAction): TState {
    const nextState = this.config.states[this.currentState].on[action];
    if (nextState) {
      this.config.states[this.currentState].onExit?.();
      this.currentState = nextState;
      this.config.states[this.currentState].onEnter?.();
    }
    return this.currentState;
  }

  public getState(): TState {
    return this.currentState;
  }
}

export default StateMachine; 