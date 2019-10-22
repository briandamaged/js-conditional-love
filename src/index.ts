
import {
  Condition,
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
  dispatch.onMatchFailure = DO_NOTHING;

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


export function IF<INPUT extends any[], OUTPUT>(condition: Condition<INPUT>, handler: Handler<INPUT, OUTPUT>) {
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
  return undefined;
}


