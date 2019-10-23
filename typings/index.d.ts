
export interface Conditional<INPUT extends any[]> {
  (...args: INPUT): boolean,
}

export interface Handler<INPUT extends any[], OUTPUT> {
  (...args: INPUT): OUTPUT,
}

export interface Rule<INPUT extends any[], OUTPUT> {
  (...args: INPUT): Handler<INPUT, OUTPUT>,
}

export interface DispatcherInstance<INPUT extends any[], OUTPUT> {
  (...args: INPUT): OUTPUT,

  rules: Rule<INPUT, OUTPUT>[],
  onMatchFailure: Handler<INPUT, OUTPUT>,
  use(rule: Rule<INPUT, OUTPUT>): DispatcherInstance<INPUT, OUTPUT>,
  otherwise(handler: Handler<INPUT, OUTPUT>): DispatcherInstance<INPUT, OUTPUT>,
}
