export class Actions {
    private num_actions: number;
    private turns: number;
    limit: number;

    constructor(limit: number = 5) {
        this.limit = limit;
        this.num_actions = 0;
    }
    take(): void {
        this.num_actions += 1;
    }
    end(): boolean {
        this.num_actions += 1;
        console.log("Turn ", this.num_actions, " out of ", this.limit);
        return this.num_actions >= this.limit;
    }
    over(): boolean {
        return this.num_actions >= this.limit;
    }
    next() {
        this.num_actions = 0;
        this.turns += 1;
    }

}