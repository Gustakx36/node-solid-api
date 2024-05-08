import crypto from 'crypto';

export abstract class Entity<T> {
    public response: T;

    constructor(response : T) {
        this.response = response;
    }
}