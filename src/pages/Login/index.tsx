import {
  BarChartOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";
import { history, useModel } from "@umijs/max";
import { Flex, Typography, theme } from "antd";
import { useEffect } from "react";
import { fetchCurrentUser, login } from "@/services/auth";
import type { LoginParams } from "@/types/auth";
import { getRedirectTarget } from "@/utils/navigation";

const { Text } = Typography;

/** The only public page. */
export default function LoginPage() {
  const { token } = theme.useToken();
  const { initialState, setInitialState } = useModel("@@initialState");

  const goBack = () =>
    history.replace(getRedirectTarget(history.location.search));

  // Already logged in? Skip the form.
  useEffect(() => {
    if (initialState?.currentUser) goBack();
  }, [initialState?.currentUser]);

  const handleSubmit = async (values: LoginParams) => {
    try {
      await login(values);
      const currentUser = await fetchCurrentUser();
      await setInitialState({ currentUser });
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${token.colorPrimaryBg} 0%, ${token.colorBgLayout} 100%)`,
      }}
    >
      <div
        style={{
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          padding: "32px 16px 8px",
        }}
      >
        <LoginForm<LoginParams>
          logo={
            <BarChartOutlined
              style={{ fontSize: 40, color: token.colorPrimary }}
            />
          }
          title="Analytics Hub"
          subTitle="Insights that actually make sense"
          onFinish={handleSubmit}
          submitter={{
            searchConfig: { submitText: "Sign in" },
            submitButtonProps: { size: "large", style: { width: "100%" } },
          }}
        >
          <ProFormText
            name="username"
            fieldProps={{ size: "large", prefix: <UserOutlined /> }}
            placeholder="Username"
            rules={[{ required: true, message: "Please enter your username" }]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{ size: "large", prefix: <LockOutlined /> }}
            placeholder="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          />
          {/* TODO: Ar fi probabil util asa posibilitate
          <Flex justify="space-between" style={{ marginBottom: 24 }}>
            <ProFormCheckbox noStyle name="remember">
              Remember me
            </ProFormCheckbox>
            <a href="/forgot-password">Forgot password?</a>
          </Flex> */}
        </LoginForm>

        <Flex justify="center" style={{ padding: "16px 0" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            © {new Date().getFullYear()} Analytics Hub
          </Text>
        </Flex>
      </div>
    </Flex>
  );
}
