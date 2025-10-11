import { EventEmitter } from 'node:events';

export class EventEmitterAsync<
  E extends Record<string | symbol, (...args: unknown[]) => unknown> = Record<
    string | symbol,
    (...args: any[]) => any // eslint-disable-line @typescript-eslint/no-explicit-any
  >,
> extends EventEmitter {
  async emitAsync<K extends keyof E>(event: K, ...args: Parameters<E[K]>): Promise<void> {
    const listeners = this.listeners(event as string | symbol) as E[K][];
    await Promise.all(listeners.map((fn) => fn(...args)));
  }
  async emitSeries<K extends keyof E>(event: K, ...args: Parameters<E[K]>): Promise<void> {
    const listeners = this.listeners(event as string | symbol) as E[K][];
    for (const fn of listeners) {
      await fn(...args);
    }
  }

  on<K extends keyof E>(event: K, listener: E[K]): this {
    return super.on(event as string | symbol, listener);
  }
  addListener<K extends keyof E>(event: K, listener: E[K]): this {
    return super.addListener(event as string | symbol, listener);
  }

  // Override off/removeListener
  off<K extends keyof E>(event: K, listener: E[K]): this {
    return super.off(event as string | symbol, listener);
  }

  removeListener<K extends keyof E>(event: K, listener: E[K]): this {
    return super.removeListener(event as string | symbol, listener);
  }
}
