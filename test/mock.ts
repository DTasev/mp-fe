function mock() {
    const m = new Mock();
    return m.mock;
}

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

    constructor() {
        this.called = new CallTracker();
        this.original_function = null;
    }

    /**
     * 
     * @param cls The class which contains the function
     * @param func The function, as would be called, e.g. Issues.retrieve, but without brackets
     * @param new_action The new action to be executed, by default it will run mock() without parameters
     */
    mock(cls, func, new_action?) {
        this.original_class = cls;
        this.original_function = func;
        this.original_function_name = func["name"];

        if (new_action) {
            cls[func["name"]] = new_action;
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