import { LogoutOutlined } from "@ant-design/icons";
import { history, useModel } from "@umijs/max";
import { Dropdown } from "antd";
import type { ReactNode } from "react";
import { LOGIN_PATH } from "@/constants/app";
import { logout } from "@/services/auth";

/** Header user menu (top right). Wraps the avatar and adds "Log out". */
export default function AvatarDropdown({ children }: { children: ReactNode }) {
  const { setInitialState } = useModel("@@initialState");

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // The global request handler shows the error.
      return;
    }

    await setInitialState((state) => ({
      ...state,
      currentUser: undefined,
    }));

    history.replace(LOGIN_PATH);
  };

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Log out",
            onClick: handleLogout,
          },
        ],
      }}
    >
      {children}
    </Dropdown>
  );
}
