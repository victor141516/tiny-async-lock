# tiny-async-lock

A lightweight (520 bytes minified), promise-based asynchronous lock implementation for TypeScript/JavaScript applications.

## Features

- Promise-based locking mechanism
- Simple API with `acquire()`, `release()`, and `isAcquired()` methods
- `waitForRelease()` method to observe lock state without acquiring
- Proper queuing of concurrent acquire requests
- Zero dependencies
- Fully typed for TypeScript

## Installation

```bash
npm install tiny-async-lock
```

## Usage

```typescript
import { Lock } from "tiny-async-lock";

async function example() {
  const lock = new Lock();

  // Check if the lock is acquired
  console.log("Currently acquired:", lock.isAcquired); // false

  // Acquire the lock
  await lock.acquire();

  lock.waitForRelease().then(() => {
    console.log("Released!");
  });

  try {
    // Perform operations requiring exclusive access
    await someOperation();
  } finally {
    // Always release the lock when done
    lock.release();
  }
}
```

## API

### `constructor()`

Creates a new instance of Lock.

### `isAcquired: boolean`

Returns whether the lock is currently acquired.

### `async acquire(): Promise<void>`

Acquires the lock. If the lock is already acquired, this method will wait until the lock is released and then acquire it.

### `release(): void`

Releases the lock. If there are other callers waiting to acquire the lock, the next caller in the queue will be granted the lock.

### `async waitForRelease(): Promise<void>`

Waits for the lock to be completely released (not acquired by anyone) without acquiring it. This is useful for monitoring the state of the lock.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
