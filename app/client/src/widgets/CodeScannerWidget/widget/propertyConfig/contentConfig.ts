import type { PropertyPaneConfig } from "constants/PropertyControlConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import { isAutoLayout } from "layoutSystems/autolayout/utils/flexWidgetUtils";
import type { CodeScannerWidgetProps } from "widgets/CodeScannerWidget/constants";
import { ScannerLayout } from "widgets/CodeScannerWidget/constants";
import {
  BACK_CAMERA_LABEL,
  DEFAULT_CAMERA_LABEL,
  DEFAULT_CAMERA_LABEL_DESCRIPTION,
  FRONT_CAMERA_LABEL,
  createMessage,
} from "@appsmith/constants/messages";
import { DefaultMobileCameraTypes } from "WidgetProvider/constants";
export default [
  {
    sectionName: "标签",
    children: [
      {
        propertyName: "scannerLayout",
        label: "扫码方式",
        controlType: "ICON_TABS",
        defaultValue: ScannerLayout.ALWAYS_ON,
        fullWidth: true,
        helpText:
          "选择扫码方式。直接扫码：让组件直接展示扫码相机；点击扫码：组件显示为按钮，点击后弹出扫码相机。",
        options: [
          {
            label: "直接扫码",
            value: ScannerLayout.ALWAYS_ON,
          },
          {
            label: "点击扫码",
            value: ScannerLayout.CLICK_TO_SCAN,
          },
        ],
        hidden: isAutoLayout,
        isJSConvertible: false,
        isBindProperty: false,
        isTriggerProperty: false,
      },
      {
        propertyName: "label",
        label: "文本",
        controlType: "INPUT_TEXT",
        helpText: "扫码按钮文本",
        placeholderText: "扫描二维码/条形码",
        inputType: "TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
        hidden: (props: CodeScannerWidgetProps) =>
          props.scannerLayout === ScannerLayout.ALWAYS_ON,
        dependencies: ["scannerLayout"],
      },
    ],
  },
  {
    sectionName: "属性",
    children: [
      {
        propertyName: "isVisible",
        label: "是否显示",
        helpText: "控制组件的显示/隐藏",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "isDisabled",
        label: "禁用",
        helpText: "让组件不可交互",
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
        helpText: "组件依赖的数据加载时显示加载动画",
        defaultValue: false,
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        helpText: "鼠标悬浮时显示提示信息",
        propertyName: "tooltip",
        label: "提示信息",
        controlType: "INPUT_TEXT",
        placeholderText: "扫一扫",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
        hidden: (props: CodeScannerWidgetProps) =>
          props.scannerLayout === ScannerLayout.ALWAYS_ON,
        dependencies: ["scannerLayout"],
      },
      {
        propertyName: "defaultCamera",
        label: createMessage(DEFAULT_CAMERA_LABEL),
        helpText: createMessage(DEFAULT_CAMERA_LABEL_DESCRIPTION),
        controlType: "DROP_DOWN",
        defaultValue: DefaultMobileCameraTypes.BACK,
        options: [
          {
            label: createMessage(FRONT_CAMERA_LABEL),
            value: DefaultMobileCameraTypes.FRONT,
          },
          {
            label: createMessage(BACK_CAMERA_LABEL),
            value: DefaultMobileCameraTypes.BACK,
          },
        ],
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.TEXT,
          params: {
            allowedValues: [
              DefaultMobileCameraTypes.FRONT,
              DefaultMobileCameraTypes.BACK,
            ],
            default: DefaultMobileCameraTypes.BACK,
          },
        },
      },
    ],
  },

  {
    sectionName: "事件",
    children: [
      {
        helpText: "扫码成功时触发",
        propertyName: "onCodeDetected",
        label: "onCodeDetected",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
    ],
  },
] as PropertyPaneConfig[];
