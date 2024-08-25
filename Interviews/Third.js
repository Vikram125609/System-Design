// const array = [1, 2, 3, 4, 5];

// Array.prototype.myMap = function (func) {
//     let result = [];
//     let array = this;
//     for (let i = 0; i < array.length; i++) {
//         result.push(func(array[i]));
//     }
//     return result;
// }

// function getDiameter(radius) {
//     return 2 * radius;
// }

// Array.prototype.myFilter = function (func) {
//     let result = [];
//     for (let i = 0; i < this.length; i++) {
//         if (func(this[i])) {
//             result.push(this[i]);
//         }
//     }
//     return result
// }

// function isOdd(value) {
//     return value % 2 === 0;
// }

// console.log(array.myFilter(isOdd));

const str = "ajfjadjdfnvnadsfjadsjadjfidnasvmcx,vnaoiejfsd";

const freq = str.split('').reduce(function (acc, curr) {
    if (acc[curr] === undefined) acc[curr] = 1;
    else acc[curr] += 1;
    return acc;
}, {});

console.log(freq)