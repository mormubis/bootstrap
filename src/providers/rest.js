import http, { createToken, HTTPError } from 'Providers/http';

const ERROR = {
  MALFORMED_CONTENT: 'Bad Request',
  NOT_FOUND: 'Not Found',
  UNAUTHORIZED: 'Forbidden',
  UNKOWN: 'Internal server error',
};

class RESTError extends HTTPError {
  constructor(message, request, response) {
    super(`${request.method.toUpperCase()} ${request.pathname} - ${message}`);

    this.request = request;
    this.response = response;
  }

  toString() {
    const { request } = this;
    const { method, pathname } = request;

    return `${method.toUpperCase()} ${pathname} - ${this.message}`;
  }
}

const OPERATIONS = ['create', 'delete', 'read', 'update'];

const TO_METHOD = {
  create: 'post',
  delete: 'delete',
  read: 'get',
  update: 'put',
};

async function $rest(resource, operation, content, options = {}) {
  const { instance = http } = options;
  const { data, status } = await instance(
    resource,
    TO_METHOD[operation] || operation,
    content,
    options,
  );

  const request = {
    data: content,
    method: TO_METHOD[operation] || operation,
    pathname: resource,
  };
  const response = { data, status };

  if (status === 400) {
    throw new RESTError(ERROR.MALFORMED_CONTENT, request, response);
  }

  if (status === 401 || status === 403) {
    throw new RESTError(ERROR.UNAUTHORIZED, request, response);
  }

  if (status === 404) {
    throw new RESTError(ERROR.NOT_FOUND, request, response);
  }

  if ((status < 200 || status >= 300) && status !== 304) {
    throw new RESTError(ERROR.UNKNOWN, request, response);
  }

  if (typeof data === 'object' && 'error' in data) {
    throw new RESTError(data.error || data.message, request, response);
  }

  return data;
}

function rest(resource, operation, content, options = {}) {
  const token = createToken();

  const request = $rest(resource, operation, content, {
    cancelToken: token,
    ...options,
  });
  request.cancel = token.cancel;

  return request;
}

function factory(...argv) {
  const handler = http.configure(...argv);

  const instance = (resource, operation, content, options) =>
    rest(resource, operation, content, { ...options, instance: handler });

  OPERATIONS.forEach(operation => {
    instance[operation] = (url, data, options) =>
      instance(url, operation, data, options);
  });

  instance.configure = factory;

  return instance;
}

export { createToken, HTTPError, RESTError, OPERATIONS };

export default factory();
