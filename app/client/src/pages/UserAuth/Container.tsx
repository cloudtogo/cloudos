import React from "react";
import { useSelector } from "react-redux";

import { getTenantConfig } from "@appsmith/selectors/tenantSelectors";
import { getAssetUrl } from "@appsmith/utils/airgapHelpers";

interface ContainerProps {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  disabledLoginForm?: boolean;
  testId?: string;
}

function Container(props: ContainerProps) {
  const { children, footer, subtitle, testId, title } = props;
  const tenantConfig = useSelector(getTenantConfig);

  return (
    <div
      className="flex flex-col items-center gap-4 my-auto min-w-min"
      data-testid={testId}
    >
      <div className="py-8 px-6 w-[min(400px,80%)] flex flex-col gap-6 t--login-container">
        <img
          className="mx-auto login-img"
          src={getAssetUrl(tenantConfig.brandLogoUrl)}
        />
        {children}
      </div>
      {footer}
    </div>
  );
}

export default Container;
