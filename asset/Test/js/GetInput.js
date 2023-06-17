let inputStates = document.querySelector("#States");
const inputAlphabets = document.querySelector("#Alphabet");
const inputStartState = document.querySelector("#StartState");
const inputAcceptState = document.querySelector("#AcceptState");

function stringToList(str) {
    str = str.replaceAll(" ", "");
    return str.split(',');
}
// function trimString(str){
//     const list = {};
//     index = 0;
//     while(index < str.length){
//         list = str[index].replace(" ", "");
//         index+=1;
//     }
//     return list;
// }

inputStates.value = "q1, q2, q3";
inputAlphabets.value = "a, b";
inputStartState.value = "q1";
inputAcceptState.value = "q3";

// let states = {};
// let alphabets = {};
// let startState = {};
// let accepteState = {};



states = stringToList(inputStates.value);
alphabets = stringToList(inputAlphabets.value);
startState = stringToList(inputStartState.value);
accepteState = stringToList(inputAcceptState.value);
// console.log(inputStates.value);
console.log(states);
console.log(alphabets);
console.log(startState);
console.log(accepteState);

// inputStates.value = "";
document.querySelector(".show").innerHTML = inputStates.value;

let transitions = {};
