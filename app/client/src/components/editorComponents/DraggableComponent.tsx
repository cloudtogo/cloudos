import React, { useContext } from "react";
import styled from "styled-components";
import { WidgetProps, WidgetOperations } from "widgets/BaseWidget";
import { ContainerWidgetProps } from "widgets/ContainerWidget";
import { useDrag, DragSourceMonitor } from "react-dnd";
import { WIDGET_PADDING } from "constants/WidgetConstants";
import { EditorContext } from "components/editorComponents/EditorContextProvider";
import { ControlIcons } from "icons/ControlIcons";
import { Tooltip } from "@blueprintjs/core";
import { WIDGET_CLASSNAME_PREFIX } from "constants/WidgetConstants";
import { useSelector } from "react-redux";
import { PropertyPaneReduxState } from "reducers/uiReducers/propertyPaneReducer";
import { AppState } from "reducers";
import { theme, getColorWithOpacity } from "constants/DefaultTheme";
import { Colors } from "constants/Colors";
import {
  useWidgetSelection,
  useShowPropertyPane,
  useWidgetDragResize,
} from "utils/hooks/dragResizeHooks";
import AnalyticsUtil from "utils/AnalyticsUtil";

// FontSizes array in DefaultTheme.tsx
// Change this to toggle the size of delete and move handles.
const CONTROL_THEME_FONTSIZE_INDEX = 6;

const DraggableWrapper = styled.div<{ show: boolean }>`
  & > div.control {
    display: ${props => (props.show ? "block" : "none")};
  }
  display: block;
  flex-direction: column;
  width: 100%;
  height: 100%;
  userselect: none;
  cursor: grab;
`;

const WidgetBoundaries = styled.div`
  transform: translate3d(-${WIDGET_PADDING + 1}px, -${WIDGET_PADDING + 1}px, 0);
  z-index: 0;
  width: calc(100% + ${WIDGET_PADDING - 2}px);
  height: calc(100% + ${WIDGET_PADDING - 2}px);
  position: absolute;
  border: 1px dashed
    ${props => getColorWithOpacity(props.theme.colors.textAnchor, 0.5)};
  pointer-events: none;
`;

const ClickCaptureMask = styled.div`
  position: absolute;
  left: 0;
  top: 5%;
  width: 100%;
  height: 95%;
  z-index: 2;
`;

const DeleteControl = styled.div`
  position: absolute;
  right: ${props => props.theme.fontSizes[CONTROL_THEME_FONTSIZE_INDEX]}px;
  top: -${props => props.theme.fontSizes[CONTROL_THEME_FONTSIZE_INDEX]}px;
  display: none;
  cursor: pointer;
`;

const EditControl = styled.div`
  position: absolute;
  right: 0;
  top: -${props => props.theme.fontSizes[CONTROL_THEME_FONTSIZE_INDEX]}px;
  display: none;
  cursor: pointer;
`;

const CONTROL_ICON_SIZE = 20;

const deleteControlIcon = ControlIcons.DELETE_CONTROL({
  width: CONTROL_ICON_SIZE,
  height: CONTROL_ICON_SIZE,
});

type DraggableComponentProps = ContainerWidgetProps<WidgetProps>;

/* eslint-disable react/display-name */

const DraggableComponent = (props: DraggableComponentProps) => {
  const showPropertyPane = useShowPropertyPane();
  const { selectWidget, focusWidget } = useWidgetSelection();
  const { setIsDragging } = useWidgetDragResize();

  const propertyPaneState: PropertyPaneReduxState = useSelector(
    (state: AppState) => state.ui.propertyPane,
  );
  const selectedWidget = useSelector(
    (state: AppState) => state.ui.editor.selectedWidget,
  );
  const focusedWidget = useSelector(
    (state: AppState) => state.ui.editor.focusedWidget,
  );

  const isResizing = useSelector(
    (state: AppState) => state.ui.widgetDragResize.isResizing,
  );
  const isDragging = useSelector(
    (state: AppState) => state.ui.widgetDragResize.isDragging,
  );

  const editControlIcon = ControlIcons.EDIT_CONTROL({
    width: CONTROL_ICON_SIZE,
    height: CONTROL_ICON_SIZE,
    color:
      propertyPaneState.widgetId === props.widgetId &&
      propertyPaneState.isVisible
        ? theme.colors.textDefault
        : theme.colors.textOnDarkBG,
    background:
      propertyPaneState.widgetId === props.widgetId &&
      propertyPaneState.isVisible
        ? Colors.HIT_GRAY
        : Colors.SHARK,
  });

  const { updateWidget } = useContext(EditorContext);

  const isDraggingDisabled: boolean = useSelector(
    (state: AppState) => state.ui.widgetDragResize.isDraggingDisabled,
  );

  const deleteWidget = () => {
    AnalyticsUtil.logEvent("WIDGET_DELETE", {
      widgetName: props.widgetName,
      widgetType: props.type,
    });
    showPropertyPane && showPropertyPane();
    updateWidget &&
      updateWidget(WidgetOperations.DELETE, props.widgetId, {
        parentId: props.parentId,
      });
  };

  const togglePropertyEditor = (e: any) => {
    if (
      (!propertyPaneState.isVisible &&
        props.widgetId === propertyPaneState.widgetId) ||
      props.widgetId !== propertyPaneState.widgetId
    ) {
      showPropertyPane && showPropertyPane(props.widgetId, undefined, true);
    } else {
      showPropertyPane && showPropertyPane();
    }
    e.preventDefault();
    e.stopPropagation();
  };

  const [{ isCurrentWidgetDragging }, drag] = useDrag({
    item: props as WidgetProps,
    collect: (monitor: DragSourceMonitor) => ({
      isCurrentWidgetDragging: monitor.isDragging(),
    }),
    begin: () => {
      AnalyticsUtil.logEvent("WIDGET_DRAG", {
        widgetName: props.widgetName,
        widgetType: props.type,
      });
      showPropertyPane && showPropertyPane(undefined, true);
      selectWidget && selectWidget(props.widgetId);
      setIsDragging && setIsDragging(true);
    },
    end: (widget, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        showPropertyPane && showPropertyPane(props.widgetId, true);
      }
      AnalyticsUtil.logEvent("WIDGET_DROP", {
        widgetName: props.widgetName,
        widgetType: props.type,
        didDrop: didDrop,
      });
      // Take this to the bottom of the stack. So that it runs last.
      setTimeout(() => setIsDragging && setIsDragging(false), 0);
    },
    canDrag: () => {
      return !isResizing && !isDraggingDisabled;
    },
  });

  const isResizingOrDragging = !!isResizing || !!isDragging;
  const className = `${WIDGET_CLASSNAME_PREFIX +
    props.widgetId} t--draggable-${props.type
    .split("_")
    .join("")
    .toLowerCase()}`;

  return (
    <React.Fragment>
      <DraggableWrapper
        className={className}
        ref={drag}
        onMouseOver={(e: any) => {
          focusWidget &&
            !isResizingOrDragging &&
            focusedWidget !== props.widgetId &&
            focusWidget(props.widgetId);
          e.stopPropagation();
        }}
        onClick={(e: any) => {
          if (!isResizingOrDragging) {
            const shouldForceOpen = selectedWidget !== props.widgetId;
            showPropertyPane &&
              showPropertyPane(props.widgetId, undefined, shouldForceOpen);
            selectWidget &&
              selectedWidget !== props.widgetId &&
              selectWidget(props.widgetId);
          }
          e.stopPropagation();
        }}
        show={
          (props.widgetId === focusedWidget ||
            props.widgetId === selectedWidget) &&
          !isResizing
        }
        style={{
          display: isCurrentWidgetDragging ? "none" : "flex",
        }}
      >
        {selectedWidget !== props.widgetId && props.isDefaultClickDisabled && (
          <ClickCaptureMask
            onClick={(e: any) => {
              const shouldForceOpen = selectedWidget !== props.widgetId;
              showPropertyPane &&
                showPropertyPane(props.widgetId, undefined, shouldForceOpen);
              selectWidget && selectWidget(props.widgetId);
              e.preventDefault();
              e.stopPropagation();
            }}
          />
        )}

        {props.children}
        <DeleteControl
          className="control t--widget-delete-control"
          onClick={deleteWidget}
        >
          <Tooltip content="Delete" hoverOpenDelay={500}>
            {deleteControlIcon}
          </Tooltip>
        </DeleteControl>
        <EditControl
          className="control t--widget-propertypane-toggle"
          onClick={togglePropertyEditor}
        >
          <Tooltip content="Show props" hoverOpenDelay={500}>
            {editControlIcon}
          </Tooltip>
        </EditControl>
        <WidgetBoundaries
          style={{
            opacity:
              isResizingOrDragging && selectedWidget !== props.widgetId ? 1 : 0,
          }}
        />
      </DraggableWrapper>
    </React.Fragment>
  );
};

export default DraggableComponent;
