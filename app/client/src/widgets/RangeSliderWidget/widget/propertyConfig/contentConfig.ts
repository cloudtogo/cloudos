import { Alignment } from "@blueprintjs/core";
import { LabelPosition } from "components/constants";
import { ValidationTypes } from "constants/WidgetValidation";
import { AutocompleteDataType } from "utils/autocomplete/AutocompleteDataType";
import { isAutoLayout } from "layoutSystems/autolayout/utils/flexWidgetUtils";
import type { RangeSliderWidgetProps } from "..";
import {
  endValueValidation,
  maxValueValidation,
  minRangeValidation,
  minValueValidation,
  startValueValidation,
  stepSizeValidation,
} from "../../validations";

export default [
  {
    sectionName: "数据",
    children: [
      {
        propertyName: "min",
        helpText: "设置滑动条最小值",
        label: "最小值",
        controlType: "INPUT_TEXT",
        placeholderText: "0",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: minValueValidation,
            expected: {
              type: "number",
              example: "0",
              autocompleteDataType: AutocompleteDataType.NUMBER,
            },
          },
        },
      },
      {
        propertyName: "max",
        helpText: "设置滑动条最大值",
        label: "最大值",
        controlType: "INPUT_TEXT",
        placeholderText: "100",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: maxValueValidation,
            expected: {
              type: "number",
              example: "100",
              autocompleteDataType: AutocompleteDataType.NUMBER,
            },
          },
        },
      },
      {
        propertyName: "step",
        helpText: "滑动条一格占多少值",
        label: "步长",
        controlType: "INPUT_TEXT",
        placeholderText: "10",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: stepSizeValidation,
            expected: {
              type: "number",
              example: "1",
              autocompleteDataType: AutocompleteDataType.NUMBER,
            },
          },
        },
      },
      {
        propertyName: "minRange",
        helpText: "设置组件最小区间",
        label: "最小区间",
        controlType: "INPUT_TEXT",
        placeholderText: "10",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: minRangeValidation,
            expected: {
              type: "number",
              example: "1",
              autocompleteDataType: AutocompleteDataType.NUMBER,
            },
          },
        },
      },
      {
        propertyName: "defaultStartValue",
        helpText: "设置组件默认起始值",
        label: "默认起始值",
        controlType: "INPUT_TEXT",
        placeholderText: "起始值",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: startValueValidation,
            expected: {
              type: "number",
              example: "20",
              autocompleteDataType: AutocompleteDataType.NUMBER,
            },
          },
        },
      },
      {
        propertyName: "defaultEndValue",
        helpText: "设置组件默认结束值",
        label: "默认结束值",
        controlType: "INPUT_TEXT",
        placeholderText: "结束值",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: endValueValidation,
            expected: {
              type: "number",
              example: "40",
              autocompleteDataType: AutocompleteDataType.NUMBER,
            },
          },
        },
      },
    ],
  },
  {
    sectionName: "标签",
    children: [
      {
        helpText: "设置组件标签文本",
        propertyName: "labelText",
        label: "文本",
        controlType: "INPUT_TEXT",
        placeholderText: "请输入标签文本",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        helpText: "设置组件标签位置",
        propertyName: "labelPosition",
        label: "位置",
        controlType: "ICON_TABS",
        fullWidth: true,
        hidden: isAutoLayout,
        options: [
          { label: "左", value: LabelPosition.Left },
          { label: "上", value: LabelPosition.Top },
        ],
        defaultValue: LabelPosition.Left,
        isBindProperty: false,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        helpText: "设置组件标签对齐方式",
        propertyName: "labelAlignment",
        label: "对齐",
        controlType: "LABEL_ALIGNMENT_OPTIONS",
        fullWidth: false,
        options: [
          {
            startIcon: "align-left",
            value: Alignment.LEFT,
          },
          {
            startIcon: "align-right",
            value: Alignment.RIGHT,
          },
        ],
        isBindProperty: false,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
        hidden: (props: RangeSliderWidgetProps) =>
          props.labelPosition !== LabelPosition.Left,
        dependencies: ["labelPosition"],
      },
      {
        helpText: "设置组件标签宽度占多少列",
        propertyName: "labelWidth",
        label: "宽度（所占列数）",
        controlType: "NUMERIC_INPUT",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        min: 0,
        validation: {
          type: ValidationTypes.NUMBER,
          params: {
            natural: true,
          },
        },
        hidden: (props: RangeSliderWidgetProps) =>
          props.labelPosition !== LabelPosition.Left,
        dependencies: ["labelPosition"],
      },
    ],
  },
  {
    sectionName: "属性",
    children: [
      {
        helpText: "提示信息",
        propertyName: "labelTooltip",
        label: "提示",
        controlType: "INPUT_TEXT",
        placeholderText: "请至少输入 6 个字符",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "showMarksLabel",
        helpText: "是否显示滑动条下标",
        label: "显示下标",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        helpText: "滑动条下标配置",
        propertyName: "marks",
        label: "下标",
        controlType: "INPUT_TEXT",
        placeholderText: '[{ "value": "20", "label": "20%" }]',
        isBindProperty: true,
        isTriggerProperty: false,
        hidden: (props: RangeSliderWidgetProps) => !props.showMarksLabel,
        dependencies: ["showMarksLabel"],
        validation: {
          type: ValidationTypes.ARRAY,
          params: {
            unique: ["value"],
            children: {
              type: ValidationTypes.OBJECT,
              params: {
                required: true,
                allowedKeys: [
                  {
                    name: "value",
                    type: ValidationTypes.NUMBER,
                    params: {
                      default: "",
                      requiredKey: true,
                    },
                  },
                  {
                    name: "label",
                    type: ValidationTypes.TEXT,
                    params: {
                      default: "",
                      requiredKey: true,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        propertyName: "isVisible",
        helpText: "控制组件的显示/隐藏",
        label: "是否显示",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "isDisabled",
        label: "禁用",
        controlType: "SWITCH",
        helpText: "禁用组件交互",
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
        propertyName: "tooltipAlwaysOn",
        helpText: "总是显示当前值提示",
        label: "总是显示当前值",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
    ],
  },
  {
    sectionName: "事件",
    children: [
      {
        helpText: "区间左值变化时触发",
        propertyName: "onStartValueChange",
        label: "onStartValueChange",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
      {
        helpText: "区间右值变化时触发",
        propertyName: "onEndValueChange",
        label: "onEndValueChange",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
    ],
  },
];
