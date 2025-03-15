import { Lock } from "../src";
import { beforeEach, describe, expect, test } from "vitest";

describe("Lock", () => {
  let lock: Lock;

  beforeEach(() => {
    lock = new Lock();
  });

  test("basic lock operations", async () => {
    expect(lock.isAcquired).toBe(false);

    await lock.acquire();
    expect(lock.isAcquired).toBe(true);

    lock.release();
    expect(lock.isAcquired).toBe(false);
  });

  test("sequential acquires queue correctly", async () => {
    const executionOrder: number[] = [];

    await lock.acquire();
    executionOrder.push(1);

    const secondAcquire = (async () => {
      await lock.acquire();
      executionOrder.push(2);
      lock.release();
    })();

    const thirdAcquire = (async () => {
      await lock.acquire();
      executionOrder.push(3);
      lock.release();
    })();

    setTimeout(() => {
      lock.release();
    }, 10);

    await Promise.all([secondAcquire, thirdAcquire]);

    expect(executionOrder).toEqual([1, 2, 3]);
  });

  test("waitForRelease behavior", async () => {
    await lock.acquire();

    const waitPromise = lock.waitForRelease();

    let isResolved = false;
    waitPromise.then(() => {
      isResolved = true;
    });

    const secondAcquirePromise = lock.acquire();

    lock.release();

    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(isResolved).toBe(false);

    await secondAcquirePromise;

    lock.release();

    await waitPromise;
    expect(isResolved).toBe(true);
  });

  test("edge cases", async () => {
    lock.release();
    expect(lock.isAcquired).toBe(false);

    await expect(lock.waitForRelease()).resolves.toBeUndefined();
  });
});
