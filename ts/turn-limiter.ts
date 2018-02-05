export class TurnLimiter {
    private num_actions: number;
    private turns: number;
    limit: number;

    constructor(limit: number = 5) {
        this.limit = limit;
        this.num_actions = 0;
        this.num_actions = 0;
    }
    action(): boolean {
        this.num_actions += 1;
        return this.num_actions < this.limit;
    }
    next() {
        this.num_actions = 0;
        this.turns += 1;
    }

}