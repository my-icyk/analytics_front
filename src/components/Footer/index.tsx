import { DefaultFooter } from "@ant-design/pro-components";

const APP_NAME = "Analytics Hub";

export default function Footer() {
  return (
    <DefaultFooter
      copyright={`${new Date().getFullYear()} ${APP_NAME}`}
      links={[]}
    />
  );
}
