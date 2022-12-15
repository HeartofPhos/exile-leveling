export class ScopedLogger {
  scopes: string[];
  warnings: string[];

  constructor() {
    this.warnings = [];
    this.scopes = [];
  }

  pushScope(scope: string) {
    this.scopes.push(scope);
  }

  popScope() {
    this.scopes.pop();
  }

  warn(message: string) {
    this.warnings.push(`${this.scopes.join(", ")}: ${message}`);
  }

  drain(target: { warn: (msg: string) => void }) {
    for (const msg of this.warnings) {
      target.warn(msg);
    }
    this.warnings.length = 0;

    if (this.scopes.length !== 0)
      target.warn(
        `expected 0 scopes got ${this.scopes.length}, ${this.scopes.join(", ")}`
      );
  }
}
