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
    /** End the turn early */
    end(): void {
        this.num_actions = this.limit;
    }
    over(): boolean {
        return this.num_actions >= this.limit;
    }
}