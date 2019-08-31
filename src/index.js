

function Dispatcher() {

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
  dispatch.onMatchFailure = DO_NOTHING;

  dispatch.use = function(rule) {
    dispatch.rules.push(rule);
    return dispatch;
  }


  dispatch.otherwise = function(handler) {
    dispatch.onMatchFailure = handler;
  }

  return dispatch;
}




function IF(condition, handler) {
  function _if(...args) {
    if(condition(...args)) {
      return handler;
    }
  }

  return _if;
}


function RETURN(value) {
  function _return() {
    return value;
  }

  return _return;
}

function DO_NOTHING() {
  // Works as advertised.
}


Object.assign(exports, {
  Dispatcher,
  IF, RETURN, DO_NOTHING,
})

