function chessBoardPattern() {
    let pattern = [];
    const lines = {
        even: '',
        odd: ''
    };

    let j = 0;
    while (j < 8) {
        lines.even += ((j % 2 == 0 ? " " : "#"));
        lines.odd += ((j % 2 == 0 ? "#" : " "));
        j++;
    }
    lines.even += "\n"
    lines.odd += "\n";

    for (let i = 0; i < 8; i++) {
        if (i % 2 == 0) {
            pattern.push(lines.even);
        } else {
            pattern.push(lines.odd);
        }
    }
    return pattern;
}


const funcFizzBuzz = (n) => {
    let i = 1;
    let result = `${i} `;
    while (i != n) {
        if (i % 3 == 0 && i % 5 == 0) { result += "FizzBuzz "; }
        else if (i % 3 == 0) { result += "Fizz "; }
        else if (i % 5 == 0) { result += "Buzz "; }
        else { result += i + " "; }
        i++;
    }
    return result;
}



// Add 5 or Multiply by 3 to reach target
function findSequenceTo(target) {
    let start = 1;
    let log = "1";
    function search(currentNum, history) {
        if (currentNum == target) { return history; }
        else if (currentNum > target) { return null; }
        else {
            return (target - currentNum + 5 > target - currentNum * 3) ?
                search(currentNum + 5, `(${history} + 5)`) ?? search(currentNum * 3, `(${history} * 3)`) :
                search(currentNum * 3, `(${history} * 3)`) ?? search(currentNum + 5, `(${history} + 5)`);
        }
    }

    return search(start, log);
}


function isEven(target) {
    if (Math.abs(target) === 0) { return true; }
    else if (Math.abs(target) === 1) { return false; }
    else {
        return isEven(Math.abs(target) - 2);
    }
}


function countBs(word) {
    let count = null;
    let i = 0;
    while (i < word.length) {
        if (word[i] === "B") { count++; }
        i++;
    }
    return count;
}


function countChar(word, char) {
    let count = null;
    let i = 0;
    while (i < word.length) {
        if (word[i] === char) { count++; }
        i++;
    }
    return count;
}

let funcArray = [];
funcArray.push(funcFizzBuzz);
funcArray.push(findSequenceTo);
funcArray.push(isEven);

const randomNum = Math.ceil(Math.random() * 10);
console.log(`randomNum = ${randomNum}`);

funcArray.forEach((func) => {
    console.log(`${func.name} : ${func(randomNum)}`);
})

console.log(chessBoardPattern());
console.log(countBs("ThisIs A string Of Words with 1 B in it"));
console.log(countChar("RandomStringcharaCterGobRRRR", 'R'));