/**
 * A simple asynchronous lock that allows acquiring, releasing, and checking state.
 */
export declare class Lock {
    private acquired;
    private waitQueue;
    private releaseWaiters;
    /**
     * Checks if the lock is currently acquired.
     * @returns true if the lock is acquired, false otherwise.
     */
    get isAcquired(): boolean;
    /**
     * Acquires the lock. If the lock is already acquired,
     * the method will wait until it's released.
     * @returns A promise that resolves when the lock has been acquired.
     */
    acquire(): Promise<void>;
    /**
     * Releases the lock. If there are waiters in the queue,
     * the lock will be passed to the next in line.
     */
    release(): void;
    /**
     * Waits for the lock to be completely released without acquiring it.
     * @returns A promise that resolves when the lock is not acquired by anyone.
     */
    waitForRelease(): Promise<void>;
}
