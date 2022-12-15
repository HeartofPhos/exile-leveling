interface Log {
  type: "warning" | "error";
  msg: string;
}

interface Sink {
  warn: (msg: string) => void;
  error: (msg: string) => void;
  log: (msg: string) => void;
}

export class ScopedLogger {
  scopes: string[];
  logs: Log[];

  constructor() {
    this.scopes = [];
    this.logs = [];
  }

  pushScope(scope: string) {
    this.scopes.push(scope);
  }

  popScope() {
    this.scopes.pop();
  }

  private scopesToString() {
    return this.scopes.join(", ");
  }

  warn(msg: string) {
    this.logs.push({
      type: "warning",
      msg: `${this.scopesToString()}: ${msg}`,
    });
  }

  error(msg: string) {
    this.logs.push({ type: "error", msg: `${this.scopesToString()}: ${msg}` });
  }

  drain(sink: Sink) {
    for (const log of this.logs) {
      switch (log.type) {
        case "warning":
          sink.warn(log.msg);
          break;
        case "error":
          sink.error(log.msg);
          break;
        default:
          sink.log(log.msg);
          break;
      }
    }
    this.logs.length = 0;

    if (this.scopes.length !== 0)
      sink.warn(
        `expected 0 scopes got ${this.scopes.length}, ${this.scopesToString()}`
      );
  }
}
