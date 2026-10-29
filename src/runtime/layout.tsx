import type { RunTimeLayoutConfig } from "@umijs/max";
import { history } from "@umijs/max";
import AvatarDropdown from "@/components/AvatarDropdown";
import Footer from "@/components/Footer";
import { LOGIN_PATH } from "@/constants/app";
import { getLoginUrl } from "@/utils/navigation";
import { UserOutlined } from "@ant-design/icons";
import { Typography } from "antd";

/**
 * The frame around every page (sidebar, header, footer) AND the login guard.
 *
 * THE GUARD (this is what protects all routes):
 *  - /login is the only route with `layout: false`, so it is outside this frame.
 *  - Every other route is rendered inside it. If nobody is logged in,
 *    `onPageChange` redirects to /login and `childrenRender` renders nothing,
 *    so a protected page never flashes on screen.
 */
export const buildLayout: RunTimeLayoutConfig = ({ initialState }) => {
  const currentUser = initialState?.currentUser;

  return {
    layout: "mix", // header on top + sider menu below it
    logo: "/logo.svg", // file in /public, shown next to the title
    fixedHeader: true,
    footerRender: () => <Footer />,

    actionsRender: () => [
      <Typography.Text key="version" type="secondary" style={{ fontSize: 12 }}>
        v{APP_VERSION}
      </Typography.Text>,
    ],

    avatarProps: currentUser
      ? {
          icon: <UserOutlined />,
          title: currentUser.username,
          size: "small",
          render: (_, dom) => <AvatarDropdown>{dom}</AvatarDropdown>,
        }
      : undefined,

    onPageChange: () => {
      const { pathname, search } = history.location;
      if (!currentUser && pathname !== LOGIN_PATH) {
        history.replace(getLoginUrl(pathname + search));
      }
    },

    childrenRender: (children) => (currentUser ? children : null),
  };
};
