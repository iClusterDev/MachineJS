function createMachine(stateMachineDefinition) {
  const machine = {
    value: stateMachineDefinition.initialState,
    transition(currentState, event) {
      // currentState: on || off
      // event: switch
      const currentStateDefinition = stateMachineDefinition[currentState];
      const destinationTransition = currentStateDefinition.transitions[event];
      if (!destinationTransition) return;

      const destinationState = destinationTransition.target;
      const destinationStateDefinition = stateMachineDefinition[destinationState];
      destinationTransition.action();
      currentStateDefinition.actions.onExit();
      destinationStateDefinition.actions.onEnter();

      machine.value = destinationState;

      return machine.value;
    }
  };
  return machine;
}

const toggle = createMachine({
  initialState: "off",
  off: {
    actions: {
      onEnter() {
        console.log("off: onEnter");
      },
      onExit() {
        console.log("off: onExit");
      }
    },
    transitions: {
      switch: {
        target: "on",
        action() {
          console.log('transition action for "switch" in "off" state');
        }
      }
    }
  },
  on: {
    actions: {
      onEnter() {
        console.log("on: onEnter");
      },
      onExit() {
        console.log("on: onExit");
      }
    },
    transitions: {
      switch: {
        target: "off",
        action() {
          console.log('transition action for "switch" in "on" state');
        }
      }
    }
  }
});

let state = toggle.value;
console.log(`current state: ${state}`); // off!

state = toggle.transition(state, "switch");
console.log(`current state: ${state}`); // on!

state = toggle.transition(state, "switch");
console.log(`current state: ${state}`); // off!
