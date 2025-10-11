import { describe, it, expect, vi } from 'vitest';
import { EventEmitterAsync } from '../src/index.js';

const SYMBOL_EVENT = Symbol('symbolEvent');

interface MyEvents {
  hello: (name: string) => void | Promise<void>;
  count: (n: number) => void | Promise<void>;
  [SYMBOL_EVENT]: (msg: string) => void | Promise<void>;
}

describe('EventEmitterAsync', () => {
  it('emitAsync runs all listeners in parallel', async () => {
    const ee = new EventEmitterAsync<MyEvents>();

    const calls: number[] = [];

    ee.on('count', async (n) => {
      await new Promise((r) => setTimeout(r, Math.random() * 10));
      calls.push(n);
    });
    ee.on('count', (n) => calls.push(n + 100));

    await ee.emitAsync('count', 1);
    expect(calls).toHaveLength(2);
    expect(calls).toContain(1);
    expect(calls).toContain(101);
  });

  it('emitSeries runs listeners sequentially', async () => {
    const ee = new EventEmitterAsync<MyEvents>();
    const calls: number[] = [];

    ee.on('count', async (n) => {
      await new Promise((r) => setTimeout(r, 5));
      calls.push(n);
    });
    ee.on('count', async (n) => {
      calls.push(n + 100);
    });

    await ee.emitSeries('count', 2);
    expect(calls).toEqual([2, 102]); // order preserved
  });

  it('supports symbol events', async () => {
    const ee = new EventEmitterAsync<MyEvents>();
    let result = '';
    ee.on(SYMBOL_EVENT, (msg) => {
      result = msg;
    });

    await ee.emitAsync(SYMBOL_EVENT, 'ok');
    expect(result).toBe('ok');
  });

  it('listeners can be sync or async', async () => {
    const ee = new EventEmitterAsync<MyEvents>();
    const result: number[] = [];

    ee.on('count', (n) => result.push(n)); // sync
    ee.on('count', async (n) => {
      await new Promise((r) => setTimeout(r, 5));
      result.push(n + 100);
    }); // async

    await ee.emitAsync('count', 5);
    expect(result).toContain(5);
    expect(result).toContain(105);
  });

  it('emitSeries respects order with async listeners', async () => {
    const ee = new EventEmitterAsync<MyEvents>();
    const calls: string[] = [];

    ee.on('hello', async (name) => {
      await new Promise((r) => setTimeout(r, 5));
      calls.push('first-' + name);
    });

    ee.on('hello', (name) => {
      calls.push('second-' + name);
    });

    await ee.emitSeries('hello', 'world');
    expect(calls).toEqual(['first-world', 'second-world']);
  });
  it('emitAsync default T', async () => {
    const ee = new EventEmitterAsync();

    const calls: number[] = [];

    ee.on('count', async (n) => {
      await new Promise((r) => setTimeout(r, Math.random() * 10));
      calls.push(n);
    });
    ee.on('count', (n) => calls.push(n + 100));

    await ee.emitAsync('count', 1);
    expect(calls).toHaveLength(2);
    expect(calls).toContain(1);
    expect(calls).toContain(101);
  });
});
