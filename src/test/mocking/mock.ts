class CallTracker {
    times: number;

    constructor() {
        this.times = 0;
    }
    increment() {
        this.times += 1;
    }
    // I don't know how to do fancy language chains
    once() {
        return this.times === 1;
    }
    twice() {
        return this.times === 2;
    }
    thrice() {
        return this.times === 3;
    }
    quadrice() {
        return this.times === 4;
    }
    manyTimes() {
        return this.times > 0;
    }
    atLeast(times: number = 1) {
        return this.times >= times;
    }
    atMost(times: number = 1) {
        return this.times <= times;
    }
    exactly(times: number = 1) {
        return this.times === times;
    }
}

export class Mock {
    called: CallTracker;
    returns: any;

    private originalFunction: any;
    private originalFunctionName: string;
    private originalClass: any;

    constructor(cls, func, return_value?) {
        this.called = new CallTracker();
        this.originalFunction = null;
        this.mock(cls, func, return_value);
    }

    /**
     * 
     * @param cls The class which contains the function
     * @param func The function, as would be called, e.g. Issues.retrieve, but without brackets
     * @param returnValue The return value when the mock is called, by default it will be void
     */
    mock(cls, func, returnValue?) {
        this.originalClass = cls;
        this.originalFunction = func;
        this.originalFunctionName = func["name"];

        if (returnValue) {
            cls[func["name"]] = () => this.default_callback(returnValue);
        } else {
            cls[func["name"]] = () => this.default_callback();
        }
    }
    restore(): any {
        this.originalClass[this.originalFunctionName] = this.originalFunction;
    }

    /**
     * 
     * @param returnValue The mock function will return this value when executed
     */
    default_callback(returnValue?) {
        this.called.increment();
        if (this.returns && returnValue) {
            throw Error("Mock return value specified more than once!");
        }
        if (this.returns) {
            return this.returns;
        }
        if (returnValue) {
            return returnValue;
        }
    }
}

/** Mock that must be called only once, 
 * because it will automatically restore the mocked function after being called.
 * 
 * This class is for convenience.
 */
export class SingleCallMock extends Mock {
    default_callback(returnValue?) {
        if (this.called.once()) {
            throw new Error("This mock must only be called once! Use normal Mock for more than a single call.");
        }
        this.called.increment();
        if (this.returns && returnValue) {
            throw Error("Mock return value specified more than once!");
        }
        if (this.returns) {
            return this.returns;
        }
        if (returnValue) {
            return returnValue;
        }
        this.restore();
    }
}