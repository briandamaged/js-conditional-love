
import {expect} from 'chai';

import {
  DepthFirstResolver,
} from '../../src/resolver';
import { Resolver } from 'dns';

describe('DepthFirstResolver', function() {
  it('yields values in a depth-first order', function() {
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

  it('allows Resolver participants to be chosen', function() {
    function* foo(x: number) {
      for(let i = 0; i < x; ++i) {
        yield i;
      }
    }

    function *bar(x: number) {
      for(let i = x; i < 10; ++i) {
        yield i;
      }
    }

    const resolve = DepthFirstResolver<[number], number>(
      function* getResolvers(x: number) {
        if(x < 4) {
          yield foo;
        }

        if(x > 2) {
          yield bar;
        }
      }
    );

    // Only `foo` is participating
    expect(Array.from(resolve(2))).to.deep.equal([
      0, 1,
    ]);

    // Both `foo` and `bar` are participating
    expect(Array.from(resolve(3))).to.deep.equal([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);

    // Only `bar` is participating
    expect(Array.from(resolve(5))).to.deep.equal([
      5, 6, 7, 8, 9,
    ]);

    // No resolvers are participating
    expect(Array.from(resolve(NaN))).to.deep.equal([]);
  });
});
