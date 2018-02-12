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

    private original_function: any;
    private original_function_name: string;
    private original_class: any;

    constructor(cls, func, return_value?) {
        this.called = new CallTracker();
        this.original_function = null;
        this.mock(cls, func, return_value);
    }

    /**
     * 
     * @param cls The class which contains the function
     * @param func The function, as would be called, e.g. Issues.retrieve, but without brackets
     * @param return_value The return value when the mock is called, by default it will be void
     */
    mock(cls, func, return_value?) {
        this.original_class = cls;
        this.original_function = func;
        this.original_function_name = func["name"];

        if (return_value) {
            cls[func["name"]] = () => this.default_callback(return_value);
        } else {
            cls[func["name"]] = () => this.default_callback();
        }
    }
    restore(): any {
        this.original_class[this.original_function_name] = this.original_function;
    }

    /**
     * 
     * @param return_value The mock function will return this value when executed
     */
    default_callback(return_value?) {
        this.called.increment();
        if (this.returns && return_value) {
            throw Error("Mock return value specified more than once!");
        }
        if (this.returns) {
            return this.returns;
        }
        if (return_value) {
            return return_value;
        }
    }
}

/** Mock that must be called only once, 
 * because it will automatically restore the mocked function after being called.
 * 
 * This class is for convenience.
 */
export class SingleCallMock extends Mock {
    default_callback(return_value?) {
        if (this.called.once()) {
            throw new Error("This mock must only be called once! Use normal Mock for more than a single call.");
        }
        this.called.increment();
        if (this.returns && return_value) {
            throw Error("Mock return value specified more than once!");
        }
        if (this.returns) {
            return this.returns;
        }
        if (return_value) {
            return return_value;
        }
        this.restore();
    }
}