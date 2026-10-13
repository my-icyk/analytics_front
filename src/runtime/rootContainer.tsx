import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import type { ReactElement } from 'react';

/**
 * Wraps the WHOLE app. Used here to force English texts.
 * Without it, Pro components (login button, table toolbar...) fall back to
 * Chinese. To change language, import another locale, e.g.
 * `antd/locale/ro_RO`, and use it below.
 */
export function withLocale(container: ReactElement) {
  return <ConfigProvider locale={enUS}>{container}</ConfigProvider>;
}
