import * as Sentry from "@sentry/react";
import TabBarIconPicker from "components/designSystems/taro/TabBarIconPicker";
import log from "loglevel";
import React from "react";
import styled from "styled-components";
import WidgetFactory from "utils/WidgetFactory";
import { CanvasWidgetStructure } from "widgets/constants";

import { RenderModes } from "constants/WidgetConstants";
import { useSelector } from "react-redux";
import { getSelectedAppTheme } from "selectors/appThemingSelectors";
import { previewModeSelector } from "selectors/editorSelectors";
import { isMobileLayout } from "selectors/applicationSelectors";
import useWidgetFocus from "utils/hooks/useWidgetFocus";

interface CanvasProps {
  widgetsStructure: CanvasWidgetStructure;
  pageId: string;
  canvasWidth: number;
}

const Container = styled.section<{
  background: string;
  width: number;
}>`
  background: ${({ background }) => background};
  width: ${(props) => props.width}px;
`;

const Canvas = (props: CanvasProps) => {
  const { canvasWidth } = props;
  const isPreviewMode = useSelector(previewModeSelector);
  const selectedTheme = useSelector(getSelectedAppTheme);
  const isMobile = useSelector(isMobileLayout);

  /**
   * background for canvas
   */
  let backgroundForCanvas;

  if (isPreviewMode) {
    backgroundForCanvas = isMobile ? "white" : "initial";
  } else {
    backgroundForCanvas = selectedTheme.properties.colors.backgroundColor;
  }

  const focusRef = useWidgetFocus();

  try {
    return (
      <Container
        background={backgroundForCanvas}
        className="relative mx-auto t--canvas-artboard pb-52"
        data-testid="t--canvas-artboard"
        id="art-board"
        ref={focusRef}
        width={canvasWidth}
      >
        {props.widgetsStructure.widgetId &&
          WidgetFactory.createWidget(
            props.widgetsStructure,
            RenderModes.CANVAS,
          )}
        {isPreviewMode ? null : <TabBarIconPicker />}
      </Container>
    );
  } catch (error) {
    log.error("Error rendering DSL", error);
    Sentry.captureException(error);
    return null;
  }
};

export default Canvas;
