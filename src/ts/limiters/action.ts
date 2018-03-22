export class Actions {
    private actions: number;
    private turns: number;
    limit: number;

    constructor(limit: number = 5) {
        this.limit = limit;
        this.actions = 0;
    }
    take(): void {
        this.actions += 1;
    }
    /** End the turn early */
    end(): void {
        this.actions = this.limit;
    }
    over(): boolean {
        return this.actions >= this.limit;
    }
    reset() {
        this.actions = 0;
    }
    left() {
        return this.limit - this.actions;
    }
}