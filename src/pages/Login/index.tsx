import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Flex } from 'antd';
import { useEffect } from 'react';
import { fetchCurrentUser, login } from '@/services/auth';
import type { LoginParams } from '@/types/auth';
import { getRedirectTarget } from '@/utils/navigation';
import { clearToken, setToken } from '@/utils/token';

/** The only public page. */
export default function LoginPage() {
  const { initialState, setInitialState } = useModel('@@initialState');

  const goBack = () => history.replace(getRedirectTarget(history.location.search));

  // Already logged in? Skip the form.
  useEffect(() => {
    if (initialState?.currentUser) goBack();
  }, [initialState?.currentUser]);

  const handleSubmit = async (values: LoginParams) => {
    try {
      const { access_token } = await login(values);
      setToken(access_token); // must be saved first: the next call needs it in the header
      try {
        const currentUser = await fetchCurrentUser(); // GET /api/v1/users/me
        await setInitialState({ currentUser });
      } catch (error) {
        clearToken(); // token is useless if we cannot load the user
        throw error;
      }
      goBack();
      return true;
    } catch {
      // The global error handler (src/requestConfig.ts) already showed the message.
      return false;
    }
  };

  return (
    <Flex justify="center" align="center" style={{ minHeight: '100vh' }}>
      <LoginForm<LoginParams>
        title="My App"
        subTitle="Demo accounts: admin / admin123 or user / user123"
        onFinish={handleSubmit}
      >
        <ProFormText
          name="username"
          fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
          placeholder="Username"
          rules={[{ required: true, message: 'Please enter your username' }]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
          placeholder="Password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        />
      </LoginForm>
    </Flex>
  );
}
