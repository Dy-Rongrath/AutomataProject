var duplicateValue = [];
function convertNFAToDFA(nfa) {
  const dfa = {
    states: [],
    symbols: nfa.symbols,
    transitions: {},
    startState: '',
    acceptStates: []
  };

  const initialState = getEpsilonClosure(nfa, [nfa.startState]);
  const unmarkedStates = [initialState];

  dfa.states.push(initialState);

  while (unmarkedStates.length > 0) {
    const currentState = unmarkedStates.shift();
    const currentStateKey = currentState.join(',');

    if (currentStateKey === '') {
      continue;
    }

    for (const symbol of dfa.symbols) {
      const nextStates = getNextStates(nfa, currentState, symbol);
      const epsilonClosure = getEpsilonClosure(nfa, nextStates);
      const epsilonClosureKey = epsilonClosure.join(',');

      if (!dfa.states.includes(epsilonClosureKey)) {
        dfa.states.push(epsilonClosureKey);
        unmarkedStates.push(epsilonClosure);
      }

      dfa.transitions[currentStateKey] = dfa.transitions[currentStateKey] || {};
      dfa.transitions[currentStateKey][symbol] = epsilonClosureKey;
    }

    if (currentState.some(state => nfa.acceptStates.includes(state))) {
      dfa.acceptStates.push(currentStateKey);
    }
  }

  dfa.startState = initialState.join(',');
  dfa.states = dfa.states.slice(1); // drop array index 0
  dfa.acceptStates = removeDuplicate(dfa.acceptStates); // change value of #duplicateValue follow acceptStates
  
   // change value of #duplicateValue again follow states that we need to remove duplicate value from transition
  dfa.states = removeDuplicate(dfa.states);
  
   // loop for remove duplicateValue transition
  for (let i=0; i<duplicateValue.length; i++){
    delete dfa.transitions[duplicateValue[i]];
  }

  return dfa;
}
// Rest of the code remains the same

function getEpsilonClosure(nfa, states) {
  const epsilonClosure = new Set(states);
  const stack = [...states];

  while (stack.length > 0) {
    const currentState = stack.pop();

    if (nfa.transitions[currentState] && nfa.transitions[currentState]['ε']) {
      const nextStates = nfa.transitions[currentState]['ε'];

      for (const nextState of nextStates) {
        if (!epsilonClosure.has(nextState)) {
          epsilonClosure.add(nextState);
          stack.push(nextState);
        }
      }
    }
  }

  return Array.from(epsilonClosure);
}

function getNextStates(nfa, states, symbol) {
  const nextStates = [];

  for (const state of states) {
    if (nfa.transitions[state] && nfa.transitions[state][symbol]) {
      nextStates.push(...nfa.transitions[state][symbol]);
    }
  }

  return nextStates;
}

// Example NFA
const nfa = {
  states: ['q0', 'q1', 'q2','q3'],
  symbols: ['a', 'b'],
  transitions: {
    'q0': { 'a': ['q0'],'b':['q0','q1'] },
    'q1': { 'a':['q2'],'b': ['q2'],'ε':['q2'] },
    'q2': { 'a': ['q3'],'b':['q3']},
    'q3':{}
  },
  startState: 'q0',
  acceptStates: ['q3']
};


function findDuplicate(states) {
  for (let i = 0; i < states.length; i++) {
    for (let j = i + 1; j < states.length; j++) {
      if (areSetsEqual(states[i].split(','), states[j].split(','))) {
        duplicateValue.push(states[j]);
        return j; // Return index of the duplicate element
      }
    }
  }
  return -1; // No duplicate found
}

function areSetsEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  
  for (let elem of set1) {
    if (!set2.has(elem)) {
      return false;
    }
  }
  
  return true;
}

function removeDuplicate(states) {
  duplicateValue = [];
  const duplicateIndex = findDuplicate(states);
  if(states.length != 1){
    if (duplicateIndex !== -1) {
      states.splice(duplicateIndex, 1); // Remove duplicate element
    }
  }
  return states;
}

let dfa = convertNFAToDFA(nfa);
console.log(dfa);