import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Descriptions } from 'antd';

/** Placeholder account page: shows who is logged in. Grow it as you need. */
export default function SettingsPage() {
  const { initialState } = useModel('@@initialState');
  const user = initialState?.currentUser;

  return (
    <PageContainer>
      <ProCard title="My account">
        <Descriptions column={1}>
          <Descriptions.Item label="Name">{user?.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
          <Descriptions.Item label="Role">{user?.role}</Descriptions.Item>
        </Descriptions>
      </ProCard>
    </PageContainer>
  );
}
