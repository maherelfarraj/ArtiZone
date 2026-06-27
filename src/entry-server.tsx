import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import type { HelmetServerState } from '@dr.pogodin/react-helmet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Outlet,
  StaticRouterProvider,
  createStaticHandler,
  createStaticRouter,
  type RouteObject,
} from 'react-router-dom';

import RootLayout from './layouts/RootLayout';
// SSR route tree uses eager (static) imports — React.lazy() always suspends
// during renderToString, causing the Suspense fallback to render instead of
// the real page, which produces an empty shell with the wrong title/meta.
import { ssrRoutes } from './ssr-routes';

export interface RenderResult {
  html: string;
  head: string;
  status: number;
  redirect?: string;
}

// No Suspense wrapper here — all components in ssrRoutes are eagerly imported
// so they never suspend. Suspense + renderToString swallows errors silently
// and renders the fallback spinner instead of the real page.
const routeTree: RouteObject[] = [
  {
    element: (
      <RootLayout>
        <Outlet />
      </RootLayout>
    ),
    children: ssrRoutes,
  },
];

const handler = createStaticHandler(routeTree);

export async function render(url: string): Promise<RenderResult> {
  // createStaticHandler works off a WHATWG Request. We only need the pathname +
  // search; scheme/host don't affect routing. Using a stable sentinel host
  // avoids env-dependent URL parsing.
  const context = await handler.query(new Request(`http://ssr${url}`));

  // A loader/action that throws a Response (or calls redirect()) surfaces here
  // as a Response instead of a StaticHandlerContext. Forward the redirect.
  if (context instanceof Response) {
    return {
      html: '',
      head: '',
      status: context.status,
      redirect: context.headers.get('Location') ?? undefined,
    };
  }

  const router = createStaticRouter(routeTree, context);
  const helmetContext: { helmet?: HelmetServerState } = {};
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: { retry: 0 },
    },
  });

  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <StaticRouterProvider router={router} context={context} />
        </QueryClientProvider>
      </HelmetProvider>
    </StrictMode>
  );

  const h = helmetContext.helmet;
  const head = h
    ? [
        h.title?.toString() ?? '',
        h.meta?.toString() ?? '',
        h.link?.toString() ?? '',
        h.script?.toString() ?? '',
      ]
        .filter(Boolean)
        .join('\n')
    : '';

  return { html, head, status: context.statusCode ?? 200 };
}
