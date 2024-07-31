const inputObject = {
    A: (a, b, c) => a + b + c,
    B: (a, b, c) => a - b - c,
    C: (a, b, c) => a + b - c,
    D: {
        E: (a, b, c) => a + b + c,
        F: {
            G: (a, b, c) => a - b - c
        }
    }
}


function compute(inputObject, a, b, c) {
    let obj = {};
    Object.entries(inputObject).forEach(([key, value]) => {
        if (typeof value === 'function') {
            obj[key] = value(a, b, c);
        }
        else {
            obj[key] = compute(value, a, b, c)
        }

    })
    return obj
}


console.log(compute(inputObject, 1, 1, 1))


const output = {
    A: 3,
    B: -1,
    C: 1,
    D: {
        E: 3
    }
}



