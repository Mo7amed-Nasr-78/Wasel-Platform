var addTwoNumbers = function(l1, l2) {
    // const sum = (parseInt(l1.join('')) + parseInt(l2.join('')));

    // const result = [];
    // for (let i = sum.toString().length - 1; i >= 0; i--) {
    //     result.push(parseInt(sum.toString()[i]));
    // }

    // return result;
    let firstNum = '';
    let secondNum = '';
    const result = [];

    for (let i = 0; i < l1.length; i++) {
        firstNum += l1[i];
    }

    for (let i = 0; i < l2.length; i++) {
        secondNum += l2[i];
    }

    const sum = (parseInt(firstNum) + parseInt(secondNum)).toString();

    for (let i = sum.length - 1; i >= 0; i--) {
        result.push(parseInt(sum[i]));
    }

    return result;
};
// console.log(addTwoNumbers([2,4,3], [5,6,4])); // [7,0,8]

function arrayDiff(a,b) {
    return a.filter(i => !b.includes(i));
}
// console.log(arrayDiff([1,2], [2]));

function addBinary(a,b) {
    if ( a + b === 0 ) return "0";

    let result = [];
    let sum = a + b;
    while(sum > 0) {
        if (sum % 2 === 1) {
            result.push(1);
        } else {
            result.push(0);
        }
        sum = Math.floor(sum / 2);
    };
    return result.reverse().join('');
}
// console.log(addBinary(5,5));

function sumTwoSmallestNumbers(numbers) {
    // const sortedNums = numbers.sort((a, b) => a - b);
    const sortedNums = numbers.toSorted();
    return sortedNums[0] + sortedNums[1];
}
// console.log(sumTwoSmallestNumbers([19, 5, 42, 2, 77]));


const items = [
    { name: "Edward", value: 21 },
    { name: "Sharpe", value: 37 },
    { name: "And", value: 45 },
    { name: "The", value: -12 },
    { name: "Magnetic", value: 13 },
    { name: "Zeros", value: 37 },
];

// sort by value
// console.log(items.sort((a, b) => a.value - b.value));

// sort by name
// console.log(
//     items.sort((a, b) => {
//     const nameA = a.name.toUpperCase(); // ignore upper and lowercase
//     const nameB = b.name.toUpperCase(); // ignore upper and lowercase
//     if (nameA < nameB) {
//         return -1;
//     }
//     if (nameA > nameB) {
//         return 1;
//     }

//     // names must be equal
//     return 0;
// }));

// console.log(items);

const submmation = (num) => {
    if (num === 0) return num;
    return num + submmation(num - 1);
}

// console.log(submmation(1));

const accum = (s) => {
    return s.split('').map((i, idx) => (i.toUpperCase() + i.repeat(idx).toLowerCase())).join('-');
}
// console.log(accum("cwAt"));

const getDivisors = (n) => {
    let divisors = new Set();
    for (let i = 1; i * i <= n; i++) {
        if (n % i === 0) {
        divisors.add(i);
        divisors.add(n / i);
        }
    }

    return Array.from(divisors).sort((a, b) => a - b).length;
}
// console.log(getDivisors(30)) // result: 3

const uniqueInOrder = function(iterable) {
    // Initial solution
    // let result = [];
    // for (let i = 0; i < iterable.length; i++) {
    //     if (iterable[i] !== iterable[i - 1]) {
    //         result.push(iterable[i]);
    //     }
    // }
    // return result;

    // Other one
    return [...iterable].filter((a, i) => a !== iterable[i - 1]);
}
// console.log(uniqueInOrder([1,2,2,3,3]));
// console.log(uniqueInOrder('AAAABBBCCDAABBB'));

const sameXO = function(str) {
    return str.match(/o/ig).length === str.match(/x/ig).length;
}
// console.log(sameXO('OoxxX'));

const arr = [1, 2, 3, 4];
const arr2 = arr.map((x) => [x, x * 2]); // [[1, 2], [2, 4], [3, 6], [4, 8]]
// console.log(arr2.flat());

// Depth => levels of the nested Array
// console.log([1, [2, 3, [4, 5, [6, 8]]]].flat(1));
// console.log([1, [2, 3, [4, 5, [6, 8]]]].flat(2));
// console.log([1, [2, 3, [4, 5, [6, 8]]]].flat(3));
// console.log([1, [2, 3, [4, 5, [6, 8]]]].flat(Infinity));

// console.log(arr.flatMap((x) => [x, x * 2])); // Falt & Map methods togather

// arr.flatMap((x) => [x, x * 2]);
// // is equivalent to
// const n = arr.length;
// const acc = new Array(n * 2);
// for (let i = 0; i < n; i++) {
//   const x = arr[i];
//   acc[i * 2] = x;
//   acc[i * 2 + 1] = x * 2;
// }
// [1, 2, 2, 4, 3, 6, 4, 8]

const date = new Date("2000-01-17T16:45:30");
const [month, day, year, hours, minutes] = [
  date.getMonth(),
  date.getDate(),
  date.getFullYear(),
  date.getUTCHours(),
  date.getUTCMinutes(),
];

console.log(month);
console.log(day);
console.log(year);
console.log(hours);
console.log(minutes);