
export interface Resolver<ARGS extends any[], OUTPUT> {
  (...args: ARGS): Iterable<OUTPUT>;
}

export type ResolverResolver<ARGS extends any[], OUTPUT> = Resolver<ARGS, Resolver<ARGS, OUTPUT>>;

export interface CompositeResolver<ARGS extends any[], OUTPUT> extends Resolver<ARGS, OUTPUT> {
  getResolvers: ResolverResolver<ARGS, OUTPUT>;
}


// TODO: Extract this?
function* lazyMap<S, T>(iterable: Iterable<S>, f: (input: S)=> T) {
  for(const s of iterable) {
    yield f(s);
  }
}

export function* depthFirst<OUTPUT>(iterables: Iterable<Iterable<OUTPUT>>) {
  for(const iter of iterables) {
    yield* iter;
  }
}

export function breadthFirst<OUTPUT>(iterables: Iterable<Iterable<OUTPUT>>) {
  const iterators = lazyMap(iterables, (iterable)=> iterable[Symbol.iterator]());
  return _breadthFirst(iterators);
}

export function* _breadthFirst<OUTPUT>(iterators: Iterable<Iterator<OUTPUT>>) {
  let currentWave: Iterable<Iterator<OUTPUT>> = iterators;
  let nextWave: Iterator<OUTPUT>[] = [];

  while(true) {
    for(const iter of currentWave) {
      const result = iter.next();
      if(!result.done) {
        yield result.value;
        nextWave.push(iter);
      }
    }

    if(nextWave.length === 0) {
      break;
    }

    currentWave = nextWave;
    nextWave = [];
  }
}

export function DepthFirstResolver<ARGS extends any[], OUTPUT>(getResolvers: ResolverResolver<ARGS, OUTPUT> = ()=> [], strategy = depthFirst) {
  const resolve: CompositeResolver<ARGS, OUTPUT> = function*(this: any, ...args: ARGS) {

    const iterables = lazyMap(getResolvers.apply(this, args), (r)=> r.apply(this, args));
    yield* strategy(iterables);
  }

  resolve.getResolvers = getResolvers;

  return resolve;
}
