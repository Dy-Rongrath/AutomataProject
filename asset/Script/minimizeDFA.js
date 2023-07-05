//ALgorithim
//Minimization of DFA 
//Suppose there is a DFA D < Q, Σ, q0, δ, F > which recognizes a language L. Then the minimized DFA D < Q’, Σ, q0, δ’, F’ > can be constructed for language L as: 
//Step 1: We will divide Q (set of states) into two sets. One set will contain all final states and other set will contain non-final states. This partition is called P0. 
//Step 2: Initialize k = 1 
//Step 3: Find Pk by partitioning the different sets of Pk-1. In each set of Pk-1, we will take all possible pair of states. If two states of a set are distinguishable, we will split the sets into different sets in Pk. 
//Step 4: Stop when Pk = Pk-1 (No change in partition) 
//Step 5: All states of one set are merged into one. No. of states in minimized DFA will be equal to no. of sets in Pk. 
//How to find whether two states in partition Pk are distinguishable ? 
//Two states ( qi, qj ) are distinguishable in partition Pk if for any input symbol a, δ ( qi, a ) and δ ( qj, a ) are in different sets in partition Pk-1.

function minimizeDFA(dfa) {
  // Step 1: Initialize the partitions
  let partitions = [dfa.acceptStates, difference(dfa.states, dfa.acceptStates)];

  while (true) {
    let newPartitions = [];
    let changed = false;

    // Step 2: Iterate over the partitions and split if necessary
    for (let partition of partitions) {
      let subPartitions = splitPartition(partition, dfa.alphabet, partitions);
      if (subPartitions.length > 1) {
        newPartitions.push(...subPartitions);
        changed = true;
      } else {
        newPartitions.push(partition);
      }
    }

    if (!changed) {
      // Step 4: Stop if no change in partition occurs
      break;
    }

    // Step 5: Update the partitions
    partitions = newPartitions;
  }

  // Construct the minimized DFA using the final partitions
  const minimizedDFA = {
    states: partitions.map(partition => partition.join(',')),
    alphabet: dfa.alphabet,
    transitions: {},
    startState: findPartition(dfa.startState, partitions),
    acceptStates: partitions.filter(partition =>
      partition.some(state => dfa.acceptStates.includes(state))
    ).map(partition => partition.join(',')),
  };

  // Update the transitions of the minimized DFA
  for (let partition of partitions) {
    const representative = partition[0];
    minimizedDFA.transitions[representative] = {};

    for (let symbol of dfa.alphabet) {
      const nextState = dfa.transitions[representative][symbol][0];
      const nextStatePartition = findPartition(nextState, partitions);
      minimizedDFA.transitions[representative][symbol] = [nextStatePartition.join(',')];
    }
  }

  return minimizedDFA;
}

// Helper function to find the difference between two arrays
function difference(array1, array2) {
  return array1.filter(item => !array2.includes(item));
}

// Helper function to split a partition based on the input symbols
function splitPartition(partition, alphabet, partitions) {
  const result = [];

  for (let symbol of alphabet) {
    const transitions = new Map();

    for (let state of partition) {
      const nextState = dfa.transitions[state][symbol][0];
      const nextStatePartition = findPartition(nextState, partitions);

      if (!transitions.has(nextStatePartition)) {
        transitions.set(nextStatePartition, [state]);
      } else {
        transitions.get(nextStatePartition).push(state);
      }
    }

    if (transitions.size > 1) {
      result.push(...Array.from(transitions.values()));
    }
  }

  return result;
}

// Helper function to find the partition that contains a specific state
function findPartition(state, partitions) {
  return partitions.find(partition => partition.includes(state));
}

// Example usage
const dfa = {
  states: ['q0', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'],
  alphabet: ['a', 'b'],
  transitions: {
    'q0': { 'a': ['q1'], 'b': ['q5'] },
    'q1': { 'a': ['q6'], 'b': ['q2'] },
    'q2': { 'a': ['q0'], 'b': ['q2'] },
    'q3': { 'a': ['q2'], 'b': ['q6'] },
    'q4': { 'a': ['q7'], 'b': ['q5'] },
    'q5': { 'a': ['q2'], 'b': ['q6'] },
    'q6': { 'a': ['q6'], 'b': ['q4'] },
    'q7': { 'a': ['q6'], 'b': ['q2'] },
  },
  startState: 'q0',
  acceptStates: ['q2'],
};

const minimizedDFA = minimizeDFA(dfa);
console.log(minimizedDFA);

let output = document.getElementById("output");
document.getElementById("btn").addEventListener('click', function(){
  let text = '';
});
