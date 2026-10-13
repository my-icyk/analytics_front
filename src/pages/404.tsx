import { history } from '@umijs/max';
import { Button, Result } from 'antd';
import { HOME_PATH } from '@/constants/app';

/** Shown for unknown URLs (inside the layout, so only for logged-in users). */
export default function NotFoundPage() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="This page does not exist."
      extra={
        <Button type="primary" onClick={() => history.push(HOME_PATH)}>
          Back home
        </Button>
      }
    />
  );
}
