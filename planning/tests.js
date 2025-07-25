let testCounter = 0;
let testFailedCounter = 0;
let testSuccessCounter = 0;
let DEBUG = false;

/** @deprecated */
function tests_todo() {
    console.warn(`Function non couverte par des tests unitaires`);
}

function tests(functionName, test) {
    if (DEBUG) console.warn(`Tests : "${functionName}"`);
    test();
}

function it({ condition, desciption, result, expected, args }, debug) {
    testCounter++;
    const message = `Test ${condition} : "${desciption}" \n With ${args} expected ${expected} but was ${result}`;
    if (condition) {
        testSuccessCounter++;
        if (debug) console.warn(message);
    } else {
        testFailedCounter++;
        console.error(message);
    }
    return { condition, desciption, result, expected, args };
}

function tests_stats() {
    console.warn(testCounter + " tests : " + testSuccessCounter + " success, " + testFailedCounter + " failed");
}