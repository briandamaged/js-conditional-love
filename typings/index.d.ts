
export interface Condition<INPUT extends any[]> {
  (...args: INPUT): boolean,
}

export interface Handler<INPUT extends any[], OUTPUT> {
  (...args: INPUT): OUTPUT | undefined,
}

export interface Rule<INPUT extends any[], OUTPUT> {
  (...args: INPUT): Handler<INPUT, OUTPUT>,
}

export interface DispatcherInstance<INPUT extends any[], OUTPUT> {
  (...args: INPUT): OUTPUT | undefined,

  rules: Rule<INPUT, OUTPUT>[],
  onMatchFailure: Handler<INPUT, OUTPUT>,
  use(rule: Rule<INPUT, OUTPUT>): DispatcherInstance<INPUT, OUTPUT>,
  otherwise(handler: Handler<INPUT, OUTPUT>): DispatcherInstance<INPUT, OUTPUT>,
}
