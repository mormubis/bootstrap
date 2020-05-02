import { useEffect, useMemo, useReducer } from 'react';

import cache from 'Providers/cache';
import rest, { createToken, HTTPError, OPERATIONS } from 'Providers/rest';

function request(resource, operation, content, options = {}) {
  const { instance = rest } = options;

  const token = createToken();

  const handler = instance(resource, operation, content, {
    ...options,
    cancelToken: token,
  });
  handler.cancel = token.cancel;

  return handler;
}

function factory(...argv) {
  const handler = rest.configure(...argv);

  const instance = (resource, operation, content, options) =>
    request(resource, operation, content, { ...options, instance: handler });

  OPERATIONS.forEach(operation => {
    instance[operation] = (url, data, options) =>
      instance(url, operation, data, options);
  });

  instance.configure = factory;

  return instance;
}

const DONE = 4;
const ERROR = 8;
const IDLE = 1;
const LOADING = 2;

function reducer(state, action) {
  switch (action.type) {
    case IDLE:
      return { ...state, readyState: IDLE };

    case LOADING:
      return { ...state, promise: action.promise, readyState: LOADING };

    case ERROR:
      // eslint-disable-next-line no-bitwise
      return { ...state, readyState: state.readyState | ERROR };

    case DONE:
      return {
        ...state,
        promise: undefined,
        // eslint-disable-next-line no-bitwise
        readyState: (state.readyState & ~LOADING) | DONE,
        response: action.response,
      };

    default:
      return state;
  }
}

const initialState = reducer({}, { type: IDLE });

function useRequest(resource, operation, content, options) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const promise = useMemo(
    () => request(resource, operation, content, options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resource, operation, JSON.stringify(content), JSON.stringify(options)],
  );

  useEffect(() => {
    const key = [
      resource,
      operation,
      JSON.stringify(content),
      JSON.stringify(options),
    ].join(':');

    let current = true;

    if (state.promise) {
      state.promise.cancel();
    }

    dispatch({ promise, type: LOADING });

    const hit = cache.get(key);
    if (hit) {
      promise.cancel();
      dispatch({ response: hit, type: DONE });
    }

    (async () => {
      let response;
      try {
        response = await promise;

        if (current) {
          cache.set(key, response);
          dispatch({ response, type: DONE });
        }
      } catch (e) {
        if (current) {
          dispatch({ error: e, type: ERROR });
        }
      }
    })();

    return () => {
      current = false;
    };
  }, [promise]);

  return state;
}

export { createToken } from './rest';

export { useRequest };

export default factory();
