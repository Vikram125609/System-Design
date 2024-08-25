const object = {
    first_name: "Shree Radha",
    last_name: "Pyari Radha",
}

function printName(value1, value2, value3, value4) {
    console.log(this.first_name + " " + this.last_name + " " + value1 + " " + value2 + " " + value3 + " " + value4);
}

Function.prototype.myBind = function (...args1) {
    const func = this
    const object = args1[0];
    args1 = args1.slice(1);
    return function (...args2) {
        func.apply(object, [...args1, ...args2]);
    }
}

// const getFullName = printName.bind(object, 'Bhori', 'Radha');
const getFullName = printName.myBind(object, 'Bhori', 'Radha');
getFullName('Chabili', 'Radha')