import { PageContainer } from "@ant-design/pro-components";
import { history, useAccess, useParams } from "@umijs/max";

export default function GroupDetails() {
  const { id } = useParams<{ id: string }>();
  return <PageContainer>TEST</PageContainer>;
}
