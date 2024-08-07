import * as Sentry from "@sentry/react";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { isMobileLayout } from "selectors/applicationSelectors";

import { Button, Tooltip } from "design-system";

import { openAppSettingsPaneAction } from "actions/appSettingsPaneActions";
import ConversionButton from "../CanvasLayoutConversion/ConversionButton";
import styled from "styled-components";
import AnalyticsUtil from "utils/AnalyticsUtil";
import {
  LayoutSystemFeatures,
  useLayoutSystemFeatures,
} from "../../../layoutSystems/common/useLayoutSystemFeatures";
import { MainContainerWidthToggles } from "../MainContainerWidthToggles";
import { useFeatureFlag } from "utils/hooks/useFeatureFlag";
import { FEATURE_FLAG } from "@appsmith/entities/FeatureFlag";

const Title = styled.p`
  color: var(--ads-v2-color-fg);
`;
const MainHeading = styled.h3`
  color: var(--ads-v2-color-fg-emphasis);
`;
export function CanvasPropertyPane() {
  const dispatch = useDispatch();
  const isAppSidebarEnabled = useFeatureFlag(
    FEATURE_FLAG.release_app_sidebar_enabled,
  );

  const openAppSettingsPane = () => {
    AnalyticsUtil.logEvent("APP_SETTINGS_BUTTON_CLICK");
    dispatch(openAppSettingsPaneAction());
  };

  const isMobile = useSelector(isMobileLayout);
  const checkLayoutSystemFeatures = useLayoutSystemFeatures();
  const [enableLayoutControl, enableLayoutConversion] =
    checkLayoutSystemFeatures([
      LayoutSystemFeatures.ENABLE_CANVAS_LAYOUT_CONTROL,
      LayoutSystemFeatures.ENABLE_LAYOUT_CONVERSION,
    ]);

  return (
    <div className="relative ">
      <MainHeading className="px-4 py-3 text-sm font-medium">
        全局配置
      </MainHeading>

      <div className="mt-3 space-y-6">
        <div className="px-4 space-y-2">
          {enableLayoutControl && !isMobile && (
            <>
              <Title className="text-sm">画布尺寸</Title>
              <MainContainerWidthToggles />
            </>
          )}
          {!isMobile && enableLayoutConversion && <ConversionButton />}
          {!isAppSidebarEnabled && (
            <Tooltip
              content={
                isMobile ? null : (
                  <>
                    <p className="text-center">更新应用主题、URL</p>
                    <p className="text-center">和其他设置</p>
                  </>
                )
              }
              placement="bottom"
            >
              <Button
                UNSAFE_width="100%"
                className="t--app-settings-cta"
                kind="secondary"
                onClick={openAppSettingsPane}
                size="md"
              >
                应用设置
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}

CanvasPropertyPane.displayName = "CanvasPropertyPane";

export default Sentry.withProfiler(CanvasPropertyPane);
