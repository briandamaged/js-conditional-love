
import * as sinon from 'sinon';
import {expect} from 'chai';

import {
  UnhandledArgumentsError,
  Dispatcher,
  IF,
  RETURN,
  DO_NOTHING,
  AND, OR, NOT,
} from '../../src/';



describe('IF', function() {
  const scenarios = [
    {
      condition: (x: number, y: number)=> x < y,
      handler: (x: number, y: number)=> Math.random(),
      cases: [
        {
          x: 2,
          y: 5,
          returnsHandler: true,
        },
        {
          x: 5,
          y: 2,
          returnsHandler: false,
        },
        {
          x: 5,
          y: 5,
          returnsHandler: false,
        },
        {
          x: -10,
          y: 10,
          returnsHandler: true,
        },
      ]
    },
    {
      condition: (x: number, y: number)=> (x > 3 && y > 3),
      handler: (x: number, y: number)=> Math.random(),
      cases: [
        {
          x: 2,
          y: 0,
          returnsHandler: false,
        },
        {
          x: 4,
          y: 0,
          returnsHandler: false,
        },
        {
          x: 4,
          y: 22,
          returnsHandler: true,
        },
      ]
    },
  ];

  for(const {condition, handler, cases} of scenarios) {
    context(`const condition = ${condition}`, function() {
      for(const {x, y, returnsHandler} of cases) {
        context(`given x = ${x} and y = ${y}`, function() {
          if(returnsHandler) {
            it('returns the handler', function() {
              const r = IF(condition, handler);
              expect(r(x, y)).to.equal(handler);
            });
          } else {
            it('returns undefined', function() {
              const r = IF(condition, handler);
              expect(r(x, y)).to.equal(undefined);
            });
          }
        })
      }
    });
  }
});


describe('RETURN', function() {
  it('always returns the specified value', function() {
    const value = {
      foo: 3,
    };

    const r = RETURN(value);

    expect(r()).to.deep.equal(value);
    expect(r()).to.equal(value);
  });
});


describe('Dispatcher', function() {

  it('works', function() {
    const d = Dispatcher<[number, number], number>();

    d.use(IF((x, y)=> x < y, (x, y)=> x + y));
    d.use(IF((x, y)=> x > y, (x, y)=> x * y));

    d.otherwise(RETURN(0));

    expect(d(2, 3)).to.equal(5);
    expect(d(5, 10)).to.equal(15);
    expect(d(10, 5)).to.equal(50);
    expect(d(10, 10)).to.equal(0);
  });

  it("Retains `this` when invoking rules", function() {
    const foo: any = {
      bar: Dispatcher<[string], number>(),
      x: 3,
      y: 5,
    };

    foo.bar.use(function(this: any, input: string) {
      this.z = ((input.length) + this.x) * this.y
    });

    foo.bar.otherwise(DO_NOTHING);

    foo.bar("hello");

    expect(foo.z).to.equal(40);

  });


  it("Retains `this` when invoking handlers", function() {
    const foo: any = {
      bar: Dispatcher<[string], number>(),
      x: 3,
      y: 5,
    };

    foo.bar.use(function(input: string) {
      return function(this: any, input: string) {
        return ((input.length) + this.x) * this.y;
      }
    });

    expect(foo.bar("still works")).to.equal(70);

  });

  context('None of the rules handle the given arguments', function() {
    context('A default handler was NOT specified via d.otherwise(..)', function() {
      it('throws an UnhandledArgumentsError', function() {
        const d = Dispatcher();

        expect(()=> d(1, 2, 3)).to.throw(UnhandledArgumentsError);
      });
    });

    context('A default handler was specified via d.otherwise(..)', function() {
      it('invokes the default Handler', function() {
        const d = Dispatcher();
        const h = sinon.stub().callsFake((x, y)=> x + y);

        d.otherwise(h);

        const result = d(3, 5);

        expect(h).to.have.been.calledWith(3, 5);
        expect(result).to.equal(8);
      });
    });
  });
});



describe('NOT', function() {
  beforeEach(function() {
    this.c = NOT<[number, number]>((x, y)=> x < y);
  });

  context('nested Conditional returns something truthy', function() {
    it('returns false', function() {
      expect(this.c(-10, 10)).to.equal(false);
      expect(this.c(0, 5)).to.equal(false);
    });
  });

  context('nested Conditional returns something falsey', function() {
    it('returns true', function() {
      expect(this.c(0, 0)).to.equal(true);
      expect(this.c(10, -10)).to.equal(true);
    });
  });
});


describe('AND', function() {
  beforeEach(function() {
    this.c = AND<[number, number]>([
      (x, y)=> x < y,
      (x, y)=> x > -10,
      (x, y)=> y < 10,
    ]);
  });

  context('all nested Conditionals return something truthy', function() {
    it('returns true', function() {
      expect(this.c(2, 4)).to.equal(true);
      expect(this.c(-5, 8)).to.equal(true);
    });
  });


  context('one or more of the nested Conditionals return something falsey', function() {
    it('returns false', function() {
      expect(this.c(4, 2)).to.equal(false);
      expect(this.c(-50, 8)).to.equal(false);
      expect(this.c(0, 80)).to.equal(false);

      expect(this.c(-20, 30)).to.equal(false);
    });
  });

});


describe('OR', function() {
  beforeEach(function() {
    this.c = OR<[number, number]>([
      (x, y)=> x < y,
      (x, y)=> x > -10,
      (x, y)=> y < 10,
    ]);
  });

  context('at least one nested Conditional returns something truthy', function() {
    it('returns true', function() {
      expect(this.c(-20, 40)).to.equal(true);
      expect(this.c(0, 800)).to.equal(true);
      expect(this.c(-50, 8)).to.equal(true);
    });
  });


  context('none of the nested Conditionals return something truthy', function() {
    it('returns false', function() {
      expect(this.c(NaN, NaN)).to.equal(false);
    });
  });

});
