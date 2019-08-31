
const {expect} = require('chai');

const {
  Dispatcher,
  IF,
  RETURN,
} = require('../../src/');



describe('IF', function() {
  const scenarios = [
    {
      condition: (x, y)=> x < y,
      handler: Math.random(),
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
      condition: (x, y)=> (x > 3 && y > 3),
      handler: Math.random(),
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
    const d = Dispatcher();

    d.use(IF((x, y)=> x < y, (x, y)=> x + y));
    d.use(IF((x, y)=> x > y, (x, y)=> x * y));

    d.otherwise(RETURN(0));

    expect(d(2, 3)).to.equal(5);
    expect(d(5, 10)).to.equal(15);
    expect(d(10, 5)).to.equal(50);
    expect(d(10, 10)).to.equal(0);
  });
});
