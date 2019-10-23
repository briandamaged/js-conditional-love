
import {
  Conditional,
  DispatcherInstance,
  Rule,
  Handler,
} from '../typings/index';

/**
 * A factory for creating "Command Dispatchers".  The general
 * concept is outlined here:
 *
 *   https://olvlvl.com/2018-04-command-dispatcher-pattern
 *
 * Think of it as a mechanism for programmatically constructing
 * conditional logic. Thus, you can easily plug-in new behaviors
 * without actually needing to change the lower-level code.
 */
export function Dispatcher<INPUT extends any[], OUTPUT>(): DispatcherInstance<INPUT, OUTPUT> {

  const dispatch: DispatcherInstance<INPUT, OUTPUT> = function _dispatch(...args: INPUT) {
    for(const r of dispatch.rules) {
      const h = r(...args);
      if(h) {
        return h(...args);
      }
    }

    return dispatch.onMatchFailure(...args);
  }

  dispatch.rules = [];
  dispatch.onMatchFailure = THROW_ERROR;

  dispatch.use = function(rule) {
    dispatch.rules.push(rule);
    return dispatch;
  }


  dispatch.otherwise = function(handler: Handler<INPUT, OUTPUT>) {
    dispatch.onMatchFailure = handler;
    return dispatch;
  }

  return dispatch;
}


export function IF<INPUT extends any[], OUTPUT>(condition: Conditional<INPUT>, handler: Handler<INPUT, OUTPUT>) {
  function _if(...args: INPUT) {
    if(condition(...args)) {
      return handler;
    }
  }

  return _if;
}


export function RETURN<OUTPUT>(value: OUTPUT) {
  function _return() {
    return value;
  }

  return _return;
}


export function DO_NOTHING() {
  // Works as exactly advertised!
}

export function THROW_ERROR(): never {
  throw new Error("Unhandled arguments");
}





export function AND<ARGS extends any[]>(expressions: Conditional<ARGS>[]): Conditional<ARGS> {
  function _and(this: any, ...args: ARGS): boolean {
    for(const expr of expressions) {
      if(!expr.apply(this, args)) {
        return false;
      }
    }

    return true;
  }

  return _and;
}


export function OR<ARGS extends any[]>(expressions: Conditional<ARGS>[]): Conditional<ARGS> {
  function _or(this: any, ...args: ARGS): boolean {
    for(const expr of expressions) {
      if(expr.apply(this, args)) {
        return true;
      }
    }

    return false;
  }

  return _or;
}

export function NOT<ARGS extends any[]>(expr: Conditional<ARGS>): Conditional<ARGS> {
  function _not(this: any, ...args: ARGS): boolean {
    return !expr.apply(this, args);
  }

  return _not;
}




