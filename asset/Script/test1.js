function createTransitionInput(state, alpha) {
  const transitionInput = document.createElement('div');
  transitionInput.classList.add('transition-input');

  const alphaLabel = document.createElement('label');
  alphaLabel.textContent = alpha;
  transitionInput.appendChild(alphaLabel);

  const stateLabel = document.createElement('label');
  stateLabel.textContent = state;
  transitionInput.appendChild(stateLabel);

  const arrowLabel = document.createElement('label');
  arrowLabel.textContent = ' ----> ';
  transitionInput.appendChild(arrowLabel);

  const destInput = document.createElement('input');
  destInput.type = 'text';
  transitionInput.appendChild(destInput);

  return { transitionInput, destInput };
}

function runAutomaton() {
  const states = document.getElementById('state-input').value.split(' ');
  const alphabets = document.getElementById('alphabet-input').value.split(' ');
  const startState = document.getElementById('start-state-input').value;
  const acceptStates = document.getElementById('accept-states-input').value.split(' ');
  

  const transitionContainer = document.getElementById('transition-container');
  transitionContainer.innerHTML = '';

  const transition = {};

  for (const state of states) {
    for (const alpha of alphabets) {
      const { transitionInput, destInput } = createTransitionInput(state, alpha);

      transitionContainer.appendChild(transitionInput);

      // Rejected states are represented as null in the transitions object
      destInput.addEventListener('input', () => {
        const dest = destInput.value;
        transition[state + alpha] = dest === '.' ? null : dest;
      });
    }
  }

  const inputString = document.getElementById('input-string').value;
  const result = document.getElementById('result');

  let currentState = startState;

  for (const char of inputString) {
    const next = transition[currentState + char];
    currentState = next;

    // Check whether the automaton goes into a rejected state
    if (currentState === null) {
      result.textContent = 'Rejected';
      result.style.color = 'red';
      return;
    }
  }

  if (acceptStates.includes(currentState)) {
    result.textContent = 'Accepted';
    result.style.color = 'green';
  } else {
    result.textContent = 'Rejected';
    result.style.color = 'red';
  }
}
