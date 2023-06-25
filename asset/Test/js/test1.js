let inputStates = document.querySelector("#state-input");
const inputAlphabets = document.querySelector("#alphabet-input");
const inputStartState = document.querySelector("#start-state-input");
const inputAcceptState = document.querySelector("#accept-states-input");



class FiniteAutomaton {
    constructor(states, symbols, transitions, startState, acceptStates) {
        this.states = states;
        this.symbols = symbols;
        this.transitions = transitions;
        this.startState = startState;
        this.acceptStates = acceptStates;
    }

    run(input) {
        let currentState = this.startState;
        for (const symbol of input) {
            if (!this.symbols.includes(symbol)) {
                return false; // Invalid symbol in the input
            }
            if (!this.transitions[currentState][symbol]) {
                return false; // No transition defined for the current state and symbol
            }
            currentState = this.transitions[currentState][symbol];
        }
        return this.acceptStates.includes(currentState);
    }
}

function stringToList(str) {
    str = str.replaceAll(" ", "");
    return str.split(',');
}

function test() {


    
    // Example usage
    //   const states = ["q0", "q1", "q2"];
    const states = stringToList(inputStates.value);
    // const symbols = ["0", "1"];
    const symbols = stringToList(inputAlphabets.value);

    const transitions = {
        q0: { "0": "q1", "1": "q0" },
        q1: { "0": "q2", "1": "q0" },
        q2: { "0": "q2", "1": "q2" },
    };

    

    // const startState = "q0";
    const startState = inputStartState.value;

    // const acceptStates = ["q2"];
    const acceptStates = stringToList(inputAcceptState.value);


    const automaton = new FiniteAutomaton(
        states,
        symbols,
        transitions,
        startState,
        acceptStates
    );

    console.log("States:", automaton.states);
    console.log("Symbols:", automaton.symbols);
    console.log("Transitions:", automaton.transitions);
    console.log("Start State:", automaton.startState);
    console.log("Accept States:", automaton.acceptStates);

    // Test the automaton with input strings
    const input1 = "010101";
    const input2 = "101010";
    const input3 = "110";
    const input4 = "001";

    console.log(input1 + ": " + automaton.run(input1));
    console.log(input2 + ": " + automaton.run(input2));
    console.log(input3 + ": " + automaton.run(input3));
    console.log(input4 + ": " + automaton.run(input4));
}