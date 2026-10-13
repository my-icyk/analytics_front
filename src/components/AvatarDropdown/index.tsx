import { LogoutOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Dropdown } from 'antd';
import type { ReactNode } from 'react';
import { LOGIN_PATH } from '@/constants/app';
import { logout } from '@/services/auth';
import { clearToken } from '@/utils/token';

/** Header user menu (top right). Wraps the avatar and adds "Log out". */
export default function AvatarDropdown({ children }: { children: ReactNode }) {
  const { setInitialState } = useModel('@@initialState');

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore: we log out locally anyway
    }
    clearToken();
    await setInitialState((state) => ({ ...state, currentUser: undefined }));
    history.replace(LOGIN_PATH);
  };

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Log out',
            onClick: handleLogout,
          },
        ],
      }}
    >
      {children}
    </Dropdown>
  );
}
