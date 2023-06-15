import { customAlphabet } from 'nanoid';
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
const alphabet: (size: number) => string = customAlphabet('abcdefghijklmnopqrstuwxyz0123456789');

const uid = (size = 10): string => {
  return alphabet(size);
};

export class TinyDispatcher {
  private static instance: TinyDispatcher;
  private listeners: { [key: string]: { [key: string]: any } } = {};
  private once: { [key: string]: string } = {};

  static getInstance(): TinyDispatcher {
    if (!this.instance) this.instance = new TinyDispatcher();
    return this.instance;
  }

  addListener<T>(event: string, handler: (event: string, key: string, value: T) => void, once = false): string {
    if (!this.listeners[event]) {
      this.listeners[event] = {};
    }
    const key = uid();
    if (once) this.once[key] = event;
    this.listeners[event][key] = handler;
    return key;
  }

  dispatch<T>(event: string, value?: T): void {
    if (this.listeners[event]) {
      for (const key in this.listeners[event]) {
        this.listeners[event][key](event, key, value); // eslint-disable-line @typescript-eslint/no-unsafe-call
        if (this.once[key]) {
          this.removeListener(event, key);
          delete this.once[key];
        }
      }
    }
  }

  removeListener(event: string, key: string): boolean {
    if (!this.listeners[event]) return false;
    if (this.listeners[event][key]) {
      delete this.listeners[event][key];
      return true;
    }
    return false;
  }

  removeAllListener(event: string): boolean {
    if (!this.listeners[event]) return false;
    delete this.listeners[event];
    return true;
  }

  cleanup() {
    this.listeners = {};
    this.once = {};
  }
}
