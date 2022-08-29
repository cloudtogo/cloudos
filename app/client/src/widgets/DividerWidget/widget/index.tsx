import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import DividerComponent from "../component";

import { ValidationTypes } from "constants/WidgetValidation";

class DividerWidget extends BaseWidget<DividerWidgetProps, WidgetState> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "orientation",
            label: "方向",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "水平",
                value: "horizontal",
              },
              {
                label: "垂直",
                value: "vertical",
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "isVisible",
            label: "是否可见",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "animateLoading",
            label: "加载时显示动画",
            controlType: "SWITCH",
            helpText: "Controls the loading of the widget",
            defaultValue: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "样式",
        children: [
          {
            helpText: "线条样式",
            propertyName: "strokeStyle",
            label: "风格",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "实线",
                value: "solid",
                icon: "cap-solid",
                iconSize: "large",
              },
              {
                label: "虚线",
                value: "dashed",
                icon: "line-dashed",
                iconSize: "large",
              },
              {
                label: "点线",
                value: "dotted",
                icon: "line-dotted",
                iconSize: "large",
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "分隔线粗细",
            propertyName: "thickness",
            label: "粗细 (px)",
            controlType: "INPUT_TEXT",
            placeholderText: "5",
            isBindProperty: true,
            isTriggerProperty: false,
            isJSConvertible: true,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 0, default: 0 },
            },
          },
          {
            helpText: "分隔线颜色",
            propertyName: "dividerColor",
            label: "颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: true,
            isJSConvertible: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                regex: /^(?![<|{{]).+/,
              },
            },
          },
          {
            helpText: "线条边角类型",
            propertyName: "capType",
            label: "边角",
            controlType: "DROP_DOWN",
            isJSConvertible: true,
            options: [
              {
                label: "无",
                value: "nc",
                icon: "cap-solid",
                iconSize: "large",
              },
              {
                label: "箭头",
                value: "arrow",
                icon: "arrow-forward",
                iconSize: "large",
              },
              {
                label: "点",
                value: "dot",
                icon: "cap-dot",
                iconSize: "large",
              },
            ],
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: ["nc", "arrow", "dot"],
                required: true,
                default: "nc",
              },
            },
          },
          {
            helpText:
              "Changes the position of the cap if a valid cap is selected.",
            propertyName: "capSide",
            label: "Cap Position",
            controlType: "ICON_TABS",
            options: [
              {
                icon: "DIVIDER_CAP_LEFT",
                value: -1,
              },
              {
                icon: "DIVIDER_CAP_ALL",
                value: 0,
                width: 48,
              },
              {
                icon: "DIVIDER_CAP_RIGHT",
                value: 1,
              },
            ],
            defaultValue: "0",
            isBindProperty: false,
            isTriggerProperty: false,
          },
        ],
      },
    ];
  }

  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            helpText: "Controls the visibility of the widget",
            propertyName: "isVisible",
            label: "是否显示",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "animateLoading",
            label: "加载时显示动画",
            controlType: "SWITCH",
            helpText: "Controls the loading of the widget",
            defaultValue: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
    ];
  }

  static getPropertyPaneStyleConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            helpText: "Controls widget orientation",
            propertyName: "orientation",
            label: "Direction",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "Horizontal",
                value: "horizontal",
              },
              {
                label: "Vertical",
                value: "vertical",
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
      {
        sectionName: "Stroke",
        children: [
          {
            helpText: "Controls the stroke color of divider",
            propertyName: "dividerColor",
            label: "Color",
            controlType: "COLOR_PICKER",
            isBindProperty: true,
            isJSConvertible: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                regex: /^(?![<|{{]).+/,
              },
            },
          },
          {
            helpText: "Controls the style of the divider",
            propertyName: "strokeStyle",
            label: "Style",
            controlType: "DROP_DOWN",
            options: [
              {
                label: "Solid",
                value: "solid",
                icon: "cap-solid",
                iconSize: "large",
              },
              {
                label: "Dashed",
                value: "dashed",
                icon: "line-dashed",
                iconSize: "large",
              },
              {
                label: "Dotted",
                value: "dotted",
                icon: "line-dotted",
                iconSize: "large",
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "Controls the thickness of divider",
            propertyName: "thickness",
            label: "Thickness",
            controlType: "INPUT_TEXT",
            placeholderText: "5",
            isBindProperty: true,
            isTriggerProperty: false,
            isJSConvertible: true,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 0, default: 0 },
            },
          },
        ],
      },
      {
        sectionName: "Cap",
        children: [
          {
            helpText: "Controls the type of divider cap",
            propertyName: "capType",
            label: "Cap",
            controlType: "DROP_DOWN",
            isJSConvertible: true,
            options: [
              {
                label: "No Cap",
                value: "nc",
                icon: "cap-solid",
                iconSize: "large",
              },
              {
                label: "Arrow",
                value: "arrow",
                icon: "arrow-forward",
                iconSize: "large",
              },
              {
                label: "Dot",
                value: "dot",
                icon: "cap-dot",
                iconSize: "large",
              },
            ],
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: ["nc", "arrow", "dot"],
                required: true,
                default: "nc",
              },
            },
          },
          {
            helpText:
              "Changes the position of the cap if a valid cap is selected.",
            propertyName: "capSide",
            label: "Cap Position",
            controlType: "ICON_TABS",
            options: [
              {
                icon: "DIVIDER_CAP_LEFT",
                value: -1,
              },
              {
                icon: "DIVIDER_CAP_ALL",
                value: 0,
                width: 48,
              },
              {
                icon: "DIVIDER_CAP_RIGHT",
                value: 1,
              },
            ],
            defaultValue: "0",
            isBindProperty: false,
            isTriggerProperty: false,
          },
        ],
      },
    ];
  }

  getPageView() {
    return (
      <DividerComponent
        capSide={this.props.capSide}
        capType={this.props.capType}
        dividerColor={this.props.dividerColor}
        orientation={this.props.orientation}
        strokeStyle={this.props.strokeStyle}
        thickness={this.props.thickness}
      />
    );
  }

  static getWidgetType(): WidgetType {
    return "DIVIDER_WIDGET";
  }
}

export interface DividerWidgetProps extends WidgetProps {
  orientation: string;
  capType: string;
  capSide?: number;
  strokeStyle?: "solid" | "dashed" | "dotted";
  dividerColor?: string;
  thickness?: number;
}

export default DividerWidget;
