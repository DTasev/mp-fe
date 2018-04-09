/**
 * Developed as part of the Tanks Major Project. More detailed blog post 
 * at https://tech.io/playgrounds/16686/single-access-design-pattern
 */
export class SingleAccess<T> {
    private resource: T = null;
    constructor(resource?: T) {
        // if there is anything to set
        if (resource) {
            this.set(resource);
        }
    }

    set(resource: T) {
        this.resource = resource;
    }

    available(): boolean {
        return this.resource !== null;
    }

    get(): T {
        if (this.available()) {
            const x = this.resource;
            this.resource = null;
            return x;
        } else {
            throw new Error("This object has already been accessed.");
        }
    }

    clear() {
        this.resource = null;
    }
}