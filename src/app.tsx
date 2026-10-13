import type { RunTimeLayoutConfig } from '@umijs/max';
import { requestConfig } from './requestConfig';
import { fetchInitialState } from './runtime/initialState';
import { buildLayout } from './runtime/layout';
import { withLocale } from './runtime/rootContainer';

/**
 * Umi runtime entry. It only CONNECTS the pieces; the real code lives in
 * small files so this one never grows:
 *
 *  getInitialState -> src/runtime/initialState.ts   (who is logged in?)
 *  layout          -> src/runtime/layout.tsx        (sidebar, header, login guard)
 *  rootContainer   -> src/runtime/rootContainer.tsx (language of Ant Design texts)
 *  request         -> src/requestConfig.ts          (token header, 401 handling)
 */
export const getInitialState = fetchInitialState;
export const layout: RunTimeLayoutConfig = buildLayout;
export const rootContainer = withLocale;
export const request = requestConfig;
