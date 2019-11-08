
export interface Resolver<ARGS extends any[], OUTPUT> {
  (...args: ARGS): Iterable<OUTPUT>;
}

export type ResolverResolver<ARGS extends any[], OUTPUT> = Resolver<ARGS, Resolver<ARGS, OUTPUT>>;

export interface CompositeResolver<ARGS extends any[], OUTPUT> extends Resolver<ARGS, OUTPUT> {
  getResolvers: ResolverResolver<ARGS, OUTPUT>;
}



export function DepthFirstResolver<ARGS extends any[], OUTPUT>(getResolvers: ResolverResolver<ARGS, OUTPUT> = ()=> []) {
  const resolve: CompositeResolver<ARGS, OUTPUT> = function*(...args: ARGS) {
    for(const r of resolve.getResolvers(...args)) {
      yield* r(...args);
    }
  }

  resolve.getResolvers = getResolvers;

  return resolve;
}
