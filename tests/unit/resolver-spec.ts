
import {expect} from 'chai';

import {
  DepthFirstResolver,
} from '../../src/resolver';

describe('DepthFirstResolver', function() {
  it('works', function() {
    function *itemsResolver() {
      yield "get";
      yield "drop";
      yield "items";
    }

    function *navigationResolver() {
      yield "go";
      yield "teleport";
    }


    const resolve = DepthFirstResolver<[], string>(()=> [
      itemsResolver,
      navigationResolver,
    ]);

    expect(Array.from(resolve())).to.deep.equal([
      "get", "drop", "items", "go", "teleport",
    ]);

  });
});
