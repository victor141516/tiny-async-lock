/**
 * A simple asynchronous lock that allows acquiring, releasing, and checking state.
 */
export class Lock {
  private acquired: boolean = false;
  private waitQueue: Array<() => void> = [];
  private releaseWaiters: Array<() => void> = [];

  /**
   * Checks if the lock is currently acquired.
   * @returns true if the lock is acquired, false otherwise.
   */
  get isAcquired(): boolean {
    return this.acquired;
  }

  /**
   * Acquires the lock. If the lock is already acquired,
   * the method will wait until it's released.
   * @returns A promise that resolves when the lock has been acquired.
   */
  async acquire(): Promise<void> {
    // If the lock is not acquired, we acquire it immediately
    if (!this.acquired) {
      this.acquired = true;
      return;
    }

    // If the lock is acquired, we wait in the queue
    return new Promise<void>((resolve) => {
      this.waitQueue.push(resolve);
    });
  }

  /**
   * Releases the lock. If there are waiters in the queue,
   * the lock will be passed to the next in line.
   */
  release(): void {
    // If the lock is not acquired, we do nothing
    if (!this.acquired) {
      return;
    }

    // If someone is waiting, we pass the lock to the next in line
    if (this.waitQueue.length > 0) {
      const nextResolver = this.waitQueue.shift()!;
      // The lock remains acquired, but now by the next in the queue
      nextResolver();
    } else {
      // If no one is waiting, we release the lock
      this.acquired = false;

      // Notify all those waiting for the release
      const waiters = [...this.releaseWaiters];
      this.releaseWaiters = [];
      for (const waiter of waiters) {
        waiter();
      }
    }
  }

  /**
   * Waits for the lock to be completely released without acquiring it.
   * @returns A promise that resolves when the lock is not acquired by anyone.
   */
  async waitForRelease(): Promise<void> {
    // If the lock is not acquired, we return immediately
    if (!this.acquired) {
      return Promise.resolve();
    }

    // Wait for the lock to be completely released
    return new Promise<void>((resolve) => {
      this.releaseWaiters.push(resolve);
    });
  }
}
