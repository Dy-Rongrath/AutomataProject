// Import the readline module for user input
const readline = require('readline');

// Create an interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to convert a string to a list of strings
function stringToList(str) {
  str = str.replaceAll(" ", ",");
  return str.split(',');
}

// Ask the user to enter the states
rl.question('Enter the automaton states separated by space: ', (inputStates) => {
  const states = stringToList(inputStates);

  // Ask the user to enter the alphabets
  rl.question('Enter the automaton alphabets separated by space: ', (inputAlphabets) => {
    const alphabets = stringToList(inputAlphabets);

    // Ask the user to enter the start state
    rl.question('Enter the start state of the automaton: ', (startState) => {

      // Ask the user to enter the accepting states
      rl.question('Enter the accepting states of the automaton separated by space: ', (inputAcceptStates) => {
        const acceptStates = stringToList(inputAcceptStates);

        // Create an object to store the transitions
        const transitions = {};

        // Function to handle transition input for each state and alphabet
        function handleTransitionInput(stateIndex, alphaIndex) {
          if (stateIndex === states.length) {
            // All transitions have been handled, proceed to check a string
            handleStringInput();
            return;
          }

          if (alphaIndex === alphabets.length) {
            // Move to the next state
            handleTransitionInput(stateIndex + 1, 0);
            return;
          }

          const currentState = states[stateIndex];
          const currentAlpha = alphabets[alphaIndex];

          rl.question(`\nEnter the next state for (${currentState}, ${currentAlpha}): `, (nextState) => {
            // Rejected states are represented as null in the transitions object
            transitions[[currentState, currentAlpha]] = nextState === '.' ? null : nextState;

            // Move to the next alphabet
            handleTransitionInput(stateIndex, alphaIndex + 1);
          });
        }

        // Function to handle input for the string to be checked
        function handleStringInput() {
          rl.question('\nEnter the string to be checked: ', (inputString) => {
            // Check if the string is accepted by the FA
            const isAccepted = checkString(states, alphabets, startState, acceptStates, transitions, inputString);

            // Display the result
            if (isAccepted) {
              console.log('Accepted');
            } else {
              console.log('Rejected');
            }

            // Close the interface
            rl.close();
          });
        }

        // Call the function to handle transition input starting from the initial state and alphabet
        handleTransitionInput(0, 0);
      });
    });
  });
});

// Function to check if a string is accepted by the FA
function checkString(states, alphabets, startState, acceptStates, transitions, inputString) {
  let currentState = startState;

  for (let i = 0; i < inputString.length; i++) {
    const currentSymbol = inputString[i];

    // Check if the current symbol is in the alphabet
    if (!alphabets.includes(currentSymbol)) {
      return false;
    }

    // Check if there is a transition for the current state and symbol
    if (transitions[[currentState, currentSymbol]]) {
      currentState = transitions[[currentState, currentSymbol]];
    } else {
      return false;
    }
  }

  // Check if the final state is an accepting state
  return acceptStates.includes(currentState);
}
