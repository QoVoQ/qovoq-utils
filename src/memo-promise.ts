enum ResolveState {
  fresh,
  running,
  done,
}

// @todo should also consider request `param`, if different param, disable cache
export function memorizePromise<T>(
  asyncCall: () => Promise<T>
): (useCache?: boolean) => Promise<T> {
  let resolveState = ResolveState.fresh;
  let cacheResult: T;
  let runningPromise: Promise<T>;

  return function cachedCall(useCache = true) {
    const run = () =>
      asyncCall()
        .then((data) => {
          cacheResult = data;
          resolveState = ResolveState.done;
          runningPromise = undefined;

          return data;
        })
        .catch((err) => {
          if (cacheResult) {
            // if request succeed before, fallback to cache
            console.log('request succeed before, fallback to cache');
            resolveState = ResolveState.done;
            runningPromise = undefined;

            return cacheResult;
          }

          resolveState = ResolveState.fresh;
          runningPromise = undefined;
          throw err;
        });

    if (resolveState === ResolveState.running) return runningPromise;
    if (useCache && resolveState === ResolveState.done) return Promise.resolve(cacheResult);

    resolveState = ResolveState.running;
    runningPromise = run();
    return runningPromise;
  };
}
