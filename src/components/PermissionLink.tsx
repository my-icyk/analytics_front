import { Link } from "umi";
import type { ReactNode } from "react";
import { LinkOutlined } from "@ant-design/icons";

type PermissionLinkProps = {
  to: string;
  canAccess: boolean;
  children: ReactNode;
};

export const PermissionLink = ({
  to,
  canAccess,
  children,
}: PermissionLinkProps) => {
  if (!canAccess) {
    return <>{children}</>;
  }

  return (
    <Link to={to}>
      {children}
      <LinkOutlined style={{ marginLeft: 4, fontSize: 12 }} />
    </Link>
  );
};
