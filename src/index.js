
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
export function Dispatcher() {

  function dispatch(...args) {
    for(const r of dispatch.rules) {
      const h = r(...args);
      if(h) {
        return h(...args);
      }
    }

    return dispatch.onMatchFailure(...args);
  }

  dispatch.rules = [];
  dispatch.onMatchFailure = M.DO_NOTHING;

  dispatch.use = function(rule) {
    dispatch.rules.push(rule);
    return dispatch;
  }


  dispatch.otherwise = function(handler) {
    dispatch.onMatchFailure = handler;
  }

  return dispatch;
}


export function  IF(condition, handler) {
  function _if(...args) {
    if(condition(...args)) {
      return handler;
    }
  }

  return _if;
}


export function RETURN(value) {
  function _return() {
    return value;
  }

  return _return;
}


export function DO_NOTHING() {
  // Works as exactly advertised!
}


