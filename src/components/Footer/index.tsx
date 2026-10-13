import { DefaultFooter } from '@ant-design/pro-components';

/** Footer shown under every page of the layout. */
export default function Footer() {
  return <DefaultFooter copyright={`${new Date().getFullYear()} My App`} links={[]} />;
}
