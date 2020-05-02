import axios from 'axios';

class HTTPError extends Error {}

const ERROR = {
  CANCELED: 'Request has been canceled by the client',
  NETWORK: 'Offline',
};

const METHODS = ['delete', 'get', 'head', 'options', 'patch', 'post', 'put'];

function deep(base = {}, extension = {}) {
  return Object.entries(extension).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]:
        !Array.isArray(value) && typeof value === 'object'
          ? deep(acc[key], value)
          : value,
    }),
    base,
  );
}

function merge(base, ...rest) {
  return rest.reduce((acc, item) => deep(acc, item), base);
}

const createToken = axios.CancelToken.source;

async function $http(url, method = 'get', data = {}, options = {}) {
  const { cancelToken, instance = axios } = options;
  const hasBody = ['delete', 'patch', 'post', 'put'].includes(
    method.toLowerCase(),
  );
  let response;

  try {
    // eslint-disable-next-line no-console
    console.debug('[http]: ', method.toUpperCase(), url, data);

    const query = merge(
      {
        [hasBody ? 'data' : 'params']: data,
        method,
        url,
      },
      options,
    );

    response = await instance({
      ...query,
      cancelToken: cancelToken && cancelToken.token,
      instance: undefined,
    });
  } catch (error) {
    ({ response } = error);

    if (axios.isCancel(error)) {
      response = {};
      throw new HTTPError(ERROR.CANCELED);
    }

    if (!response) {
      response = {};
      throw new HTTPError(ERROR.NETWORK);
    }
  } finally {
    // eslint-disable-next-line no-console
    console.debug(
      '[http]: ',
      method.toUpperCase(),
      url,
      response.status,
      response.data,
    );
  }

  return response;
}

function http(url, method, data, options = {}) {
  const token = createToken();

  const request = $http(url, method, data, {
    cancelToken: token,
    ...options,
  });
  request.cancel = token.cancel;

  return request;
}

function factory(defaults) {
  const handler = axios.create();

  const instance = (url, method, data, { cancelToken, ...options }) =>
    http(url, method, data, {
      ...merge(defaults, options, { instance: handler }),
      cancelToken,
    });

  METHODS.forEach(method => {
    instance[method] = (url, data, options) =>
      instance(url, method, data, options);
  });

  instance.configure = factory;

  return instance;
}

export { createToken, HTTPError };

export default factory();
