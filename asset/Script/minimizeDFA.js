let inputStates = document.querySelector("#allStates");
let inputStartState = document.querySelector("#startState");
let inputAlphabets = document.querySelector("#alphabets");
let inputAcceptState = document.querySelector("#acceptState");

const resetBtn = document.querySelector("#resetBtn");
const addTransition = document.querySelector("#addTransition");
const visualize = document.querySelector("#visualization");

var allState = {};
var alphabet = {};
var startState = {};
var accepteState = {};
var allTransition = {};// this allTransition for use test string
var Transition = {}; // this for use to check DFA or not

//----------- for convert from string to array if have ","
function stringToList(str) {
    str = str.replaceAll(" ", "");
    str = str.trim();
    return str.split(",");
}


//-------------- get input for FA
function getInput() {
    allState = stringToList(inputStates.value);
    let alphabetop = inputAlphabets.value + ",op"; // alphabet + "op" that op equal to ∈ transition
    alphabet = stringToList(alphabetop);
    startState = stringToList(inputStartState.value);
    accepteState = stringToList(inputAcceptState.value);

    for (let i in alphabet) {
        console.log("\t", alphabet[i]);
    }
    for (let i in allState) {
        console.log(allState[i], "\t");
        for (let j in alphabet) {
            console.log(allState[i] + alphabet[j]);
        }
    }
    console.log(allState);
    console.log(alphabet);
    makeTransition();
}

//-------------- get all State and alphabet for create table transition
function makeTransition() {
    let outTransition = document.querySelector("#transitions");
    text = `<div class="classTransition">FA Transition</div>
      <table >
      <tr>`;
    for (let x = 0; x <= alphabet.length; x++) {
        if (x == 0) {
            text = text + `<th></th>`;
        } else {
            if (x == alphabet.length) {
                text = text + `<th>&#8712;</th>`;
            } else {
                text = text + `<th>${alphabet[x - 1]}</th>`;
            }
        }
    }

    for (let i = 0; i <= allState.length; i++) {
        if (i != 0) {
            text = text + `</tr><tr>`;
            text = text + `<th>${allState[i - 1]}</th>`;
            for (let j = 0; j <= alphabet.length; j++) {
                if (j != 0) {
                    text =
                        text +
                        `<td><input type="text" id="${allState[i - 1] + alphabet[j - 1]
                        }"></td>`;
                }
            }
        }
    }
    outTransition.innerHTML = text + `</tr></table>`;
}



//----------------------- get value in table to store in variable transition as opject of array
function visulize() {

    for (let i = 0; i < allState.length; i++) {
        var str = "";
        str = allState[i];
        let inputobj1 = {};
        let inputobj2 = {};
        for (let j = 0; j < alphabet.length; j++) {
            let getValue = "";
            getValue = allState[i] + alphabet[j];
            let temp = document.getElementById(getValue);
            
            // check get value use all part expect function check FA
            if (temp.value != "") {// check if it is not input value is not record
                let x = {[alphabet[j]]:stringToList(temp.value)}
                inputobj1 = {...inputobj1,...x};
            }

            // get value for use in function check FA
            let t = { [alphabet[j]]: stringToList(temp.value) };
            inputobj2 = { ...inputobj2, ...t };
        }
        allTransition[[str]] = inputobj1; // using for all part expect check FA
        Transition[[str]] = inputobj2;  // using for only function check FA
    }
    console.log(allTransition);
    // const Check = isDFA();
    // console.log(Check);
}

//------------------- Function for FA is DFA or not DFA->(NFA)
function isDFA() {
    for (let j = 0; j < allState.length; j++) {
        let transitions = Transition[allState[j]];
        console.log("transition: " + allState[j]);
        let symbols = Object.keys(transitions);

        // Check if multiple transitions exist for any symbol
        for (let i = 0; i < symbols.length; i++) {
            if (Array.isArray(transitions[symbols[i]])) {
                if (transitions[symbols[i]].length > 1) return false;
            }
            console.log("symbols length: " + symbols.length);
            if (i == symbols.length - 1) {
                console.log(transitions[symbols[i]] + "==" + allState[j]);

                // ----- if ∈ transition is null set it equal to transition to ownself
                if (transitions[symbols[i]] == "") {
                    transitions[symbols[i]] = allState[j];
                }
                // ----- if ∈ transition to other is return false (mean it is not DFA)
                if (transitions[symbols[i]] != allState[j]) return false;
            } else {
                if (transitions[symbols[i]] == "") return false;
            }
        }
    }
    return true;
}

//----------- test DFA of String
function isAcceptedDFA(input) {
    let currentState = startState;

    for (let i = 0; i < input.length; i++) {
        let string = input.charAt(i);

        if (!allTransition[currentState][string]) {
            return false; // No transition defined for the current state and symbol
        }
        currentState = allTransition[currentState][string];
    }

    for (let i = 0; i < accepteState.length; i++) {
        if (accepteState[i].includes(currentState)) {
            return true;
        }
    }
    return false;
}

//------------ test NFA accept string or not
function isAcceptedNFA(input) {
    let currentStates = getEpsilonClosure([startState]);

    for (let i = 0; i < input.length; i++) {
        const string = input.charAt(i);
        const nextStates = [];

        for (const state of currentStates) {
            const transitions = allTransition[state][string] || [];

            for (const nextState of transitions) {
                nextStates.push(...getEpsilonClosure([nextState]));
            }
        }

        currentStates = nextStates;
    }

    return currentStates.some((state) => accepteState.includes(state));
}
//-------- create getEpsilonClosure for all char if have ∈ transition
function getEpsilonClosure(states) {
    const visited = new Set(states);
    const stack = [...states];

    while (stack.length > 0) {
        const currentState = stack.pop();
        //--------------- op stand for epsilon
        const epsilonTransitions = allTransition[currentState]["op"] || [];

        for (const nextState of epsilonTransitions) {
            if (!visited.has(nextState)) {
                visited.add(nextState);
                stack.push(nextState);
            }
        }
    }

    return Array.from(visited);
}
//------------- make action

resetBtn.addEventListener('click', function () {
    inputStates.value = "";
    inputStartState.value = "";
    inputAlphabets.value = "";
    inputAcceptState.value = "";
    document.querySelector("#transitions").innerHTML = '';
    document.getElementById("typeFA").innerHTML = "N/A";


});

addTransition.addEventListener('click', function () {
    getInput();
});

visualize.addEventListener('click', function () {
    visulize();
    if(isDFA()){
        document.getElementById("typeFA").innerHTML = "DFA";
    }else{
        document.getElementById("typeFA").innerHTML = "NFA";
    }
});

let checkString = document.getElementById("inputString");
document.getElementById("forTest").addEventListener("click", function(){
    // visulize();
    let accept = true;
    if(isDFA()){
        accept = isAcceptedDFA(checkString.value);
        document.getElementById('test1').innerHTML = "Test String (DFA)";
    }else{
        accept = isAcceptedNFA(checkString.value);
        document.getElementById('test1').innerHTML = "Test String (NFA)";
    }

    if(accept){
        document.getElementById("result").innerHTML = "Accepted..";
        document.getElementById("result").style.color = "green";
    }else{
        document.getElementById("result").innerHTML = "Rejected!!";
        document.getElementById("result").style.color = "red";
    }
});

function minimizeDFA(dfa) {
    // Step 1: Split the states into two sets - final and non-final
    let finalStates = [];
    let nonFinalStates = [];
  
    for (let state of dfa.states) {
      if (dfa.acceptStates.includes(state)) {
        finalStates.push(state);
      } else {
        nonFinalStates.push(state);
      }
    }
  
    // Step 2: Initialize a partition containing the final and non-final sets
    let partition = [finalStates, nonFinalStates];
  
    // Step 3: Iterate until no further partition changes occur
    let prevPartition = [];
    while (!arraysEqual(partition, prevPartition)) {
      prevPartition = partition.slice();
  
      // Step 4: Refine the partition by splitting sets based on transitions
      partition = refinePartition(dfa, partition);
    }
  
    // Step 5: Create the minimized DFA using the final partition
    let minimizedDFA = createMinimizedDFA(dfa, partition);
  
    return minimizedDFA;
  }
  
  // Helper function to check if two arrays are equal
  function arraysEqual(a, b) {
    if (a.length !== b.length) {
      return false;
    }
  
    for (let i = 0; i < a.length; i++) {
      if (a[i].length !== b[i].length || !a[i].every((val) => b[i].includes(val))) {
        return false;
      }
    }
  
    return true;
  }
  
  // Helper function to refine the partition based on transitions
  function refinePartition(dfa, partition) {
    let newPartition = [];
  
    for (let set of partition) {
      let subsets = splitSet(dfa, set, partition);
      newPartition.push(...subsets);
    }
  
    return newPartition;
  }
  
  // Helper function to split a set into subsets based on transitions
  function splitSet(dfa, set, partition) {
    let subsets = [];
    let transitions = {};
  
    for (let symbol of dfa.alphabet) {
      transitions[symbol] = [];
    }
  
    // Group states in the set by their outgoing transitions
    for (let state of set) {
      for (let symbol of dfa.alphabet) {
        let nextState = dfa.transitions[state][symbol];
        transitions[symbol].push(nextState);
      }
    }
  
    // Split the set into subsets based on transitions
    for (let symbol of dfa.alphabet) {
      let subset = [];
      let states = transitions[symbol];
  
      for (let state of states) {
        let subsetIndex = findSubsetIndex(state, partition);
        if (subsetIndex !== -1) {
          subset.push(state);
        }
      }
  
      if (subset.length > 0) {
        subsets.push(subset);
      }
    }
  
    return subsets;
  }
  
  // Helper function to find the index of a state's subset in the partition
  function findSubsetIndex(state, partition) {
    for (let i = 0; i < partition.length; i++) {
      if (partition[i].includes(state)) {
        return i;
      }
    }
  
    return -1;
  }
  
  // Helper function to create the minimized DFA using the final partition
  function createMinimizedDFA(dfa, partition) {
    let minimizedDFA = {
      states: [],
      alphabet: dfa.alphabet,
      transitions: {},
      startState: null,
      acceptStates: [],
    };
  }

  const dfa = {
    states: ['q0', 'q1', 'q2', 'q3', 'q4', 'q5'],
    alphabet: ['0', '1'],
    transitions: {
      'q0': { '0': ['q3'], '1': ['q1'] },
      'q1': { '0': ['q2'], '1': ['q5'] },
      'q2': { '0': ['q2'], '1': ['q5'] },
      'q3': { '0': ['q0'], '1': ['q4'] },
      'q4': { '0': ['q2'], '1': ['q5'] },
      'q5': { '0': ['q5'], '1': ['q5'] },
    },
    startState: 'q0',
    acceptStates: ['q1', 'q2', 'q4']
  };
  
  const minimizedDFA = minimizeDFA(dfa);
  console.log(minimizedDFA);