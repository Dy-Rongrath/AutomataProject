let allStates = document.querySelector("#allStates");
let startState = document.querySelector("#startState");
let alphabet = document.querySelector("#alphabets");
let isAccept = document.querySelector("#acceptState");
let transition = document.querySelector("#transitions");

const resetBtn = document.querySelector("#resetBtn");
const addTransition = document.querySelector("#new-transition");
const visualize = document.querySelector("#visualization");

function reset(){
    allStates.value="";
    startState.value="";
    alphabet.value="";
    isAccept.value="";

}
resetBtn.addEventListener('click', reset);