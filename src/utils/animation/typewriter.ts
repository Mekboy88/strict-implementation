/**
 * Typewriter animation utility for smooth character-by-character text reveal
 */

export interface TypewriterOptions {
  text: string;
  speed?: number; // milliseconds per character
  onUpdate: (visibleText: string) => void;
  onComplete?: () => void;
}

export class Typewriter {
  private currentIndex = 0;
  private timerId: NodeJS.Timeout | null = null;
  private options: Required<TypewriterOptions>;

  constructor(options: TypewriterOptions) {
    this.options = {
      speed: 30,
      onComplete: () => {},
      ...options,
    };
  }

  start() {
    this.stop();
    this.currentIndex = 0;
    this.type();
  }

  private type() {
    if (this.currentIndex < this.options.text.length) {
      this.currentIndex++;
      this.options.onUpdate(this.options.text.slice(0, this.currentIndex));
      this.timerId = setTimeout(() => this.type(), this.options.speed);
    } else {
      this.options.onComplete();
    }
  }

  stop() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  skipToEnd() {
    this.stop();
    this.options.onUpdate(this.options.text);
    this.options.onComplete();
  }
}
