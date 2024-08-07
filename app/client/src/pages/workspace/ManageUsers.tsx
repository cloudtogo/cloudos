import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "design-system";

function ManageUsers({ workspaceId }: { workspaceId: string }) {
  const currentPath = useLocation().pathname;
  const pathRegex = /(?:\/workspace\/)\w+(?:\/settings)/;

  return !pathRegex.test(currentPath) ? (
    <Link
      endIcon="arrow-right-s-line"
      kind="secondary"
      target="_self"
      to={`/workspace/${workspaceId}/settings/members`}
    >
      管理成员
    </Link>
  ) : null;
}
export default ManageUsers;
