/**
 * A middleware pipeline utility for processing data through a series of functions.
 * This pattern is common in web servers (like Express.js) and data processing tasks.
 * It allows for building flexible and reusable processing logic.
 */

// The context object that is passed through the middleware pipeline.
// It can be extended for specific use cases.
export interface MiddlewareContext {
  [key: string]: any;
}

// A middleware function.
// It receives the context and a `next` function to pass control to the next middleware.
export type Middleware<T extends MiddlewareContext> = (
  context: T,
  next: () => Promise<void>
) => Promise<void>;

/**
 * The MiddlewareRunner class composes and executes a pipeline of middleware.
 */
export class MiddlewareRunner<T extends MiddlewareContext> {
  private middlewares: Middleware<T>[] = [];

  /**
   * Adds a middleware function to the pipeline.
   * @param fn The middleware function.
   */
  use(fn: Middleware<T>): this {
    this.middlewares.push(fn);
    return this;
  }

  /**
   * Executes the middleware pipeline with a given context.
   * @param context The initial context object.
   */
  async run(context: T): Promise<T> {
    const execute = (index: number): Promise<void> => {
      if (index >= this.middlewares.length) {
        return Promise.resolve();
      }

      const middleware = this.middlewares[index];
      const next = () => execute(index + 1);

      return middleware(context, next);
    };

    await execute(0);
    return context;
  }
}

// --- Example Usage: API Request Processor ---

interface RequestContext extends MiddlewareContext {
  request: {
    path: string;
    method: 'GET' | 'POST';
    headers: Record<string, string>;
    body?: any;
  };
  response?: {
    statusCode: number;
    body: any;
  };
  user?: {
    id: string;
    roles: string[];
  };
  error?: Error;
}

// 1. Logging Middleware
const loggingMiddleware: Middleware<RequestContext> = async (ctx, next) => {
  console.log(`[Request Start] ${ctx.request.method} ${ctx.request.path}`);
  const startTime = Date.now();

  await next(); // Pass control to the next middleware

  const duration = Date.now() - startTime;
  console.log(`[Request End] Status: ${ctx.response?.statusCode || 'N/A'}. Duration: ${duration}ms`);
};

// 2. Authentication Middleware
const authMiddleware: Middleware<RequestContext> = async (ctx, next) => {
  const authHeader = ctx.request.headers['authorization'];
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // In a real app, you would validate the token here.
    if (token === 'valid-token') {
      ctx.user = { id: 'user-123', roles: ['user'] };
    }
  }
  await next();
};

// 3. Authorization Middleware
const adminAuthMiddleware: Middleware<RequestContext> = async (ctx, next) => {
  if (ctx.request.path.startsWith('/admin')) {
    if (!ctx.user || !ctx.user.roles.includes('admin')) {
      ctx.error = new Error('Forbidden');
      ctx.response = { statusCode: 403, body: { message: 'Forbidden' } };
      return; // Stop the pipeline
    }
  }
  await next();
};

// 4. JSON Body Parsing Middleware
const jsonBodyParserMiddleware: Middleware<RequestContext> = async (ctx, next) => {
  if (ctx.request.method === 'POST' && typeof ctx.request.body === 'string') {
    try {
      ctx.request.body = JSON.parse(ctx.request.body);
    } catch (e) {
      ctx.error = new Error('Invalid JSON body');
      ctx.response = { statusCode: 400, body: { message: 'Bad Request: Invalid JSON' } };
      return;
    }
  }
  await next();
};

// 5. Main Route Handler (as a middleware)
const routeHandler: Middleware<RequestContext> = async (ctx, next) => {
  if (ctx.request.path === '/dreams' && ctx.request.method === 'POST') {
    if (!ctx.user) {
        ctx.response = { statusCode: 401, body: { message: 'Unauthorized' } };
        return;
    }
    // Logic to save a dream...
    console.log('Saving dream for user:', ctx.user.id);
    ctx.response = {
      statusCode: 201,
      body: { id: 'dream-456', ...ctx.request.body },
    };
  }
  // If no route matches, next() will do nothing, and the request will "fall through".
  await next();
};

/*
  // --- How to use the pipeline ---
  async function processRequest() {
    const requestPipeline = new MiddlewareRunner<RequestContext>();

    requestPipeline
      .use(loggingMiddleware)
      .use(authMiddleware)
      .use(adminAuthMiddleware)
      .use(jsonBodyParserMiddleware)
      .use(routeHandler);

    const initialContext: RequestContext = {
      request: {
        path: '/dreams',
        method: 'POST',
        headers: { 'authorization': 'Bearer valid-token', 'content-type': 'application/json' },
        body: JSON.stringify({ title: 'My Awesome Dream', content: '...' }),
      },
    };

    console.log('--- Running pipeline ---');
    const finalContext = await requestPipeline.run(initialContext);

    console.log('\n--- Final Context ---');
    console.log(JSON.stringify(finalContext, null, 2));
  }

  processRequest();
*/ 