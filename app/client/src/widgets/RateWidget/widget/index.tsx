import React from "react";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import RateComponent from "../component";
import type { RateSize } from "../constants";

import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { ValidationTypes } from "constants/WidgetValidation";

import type { SetterConfig, Stylesheet } from "entities/AppTheming";
import { AutocompleteDataType } from "utils/autocomplete/AutocompleteDataType";
import type { DerivedPropertiesMap } from "WidgetProvider/factory";
import { DefaultAutocompleteDefinitions } from "widgets/WidgetUtils";
import { isAutoLayout } from "layoutSystems/autolayout/utils/flexWidgetUtils";
import type {
  AnvilConfig,
  AutocompletionDefinitions,
} from "WidgetProvider/constants";
import { Colors } from "constants/Colors";
import IconSVG from "../icon.svg";
import type {
  SnipingModeProperty,
  PropertyUpdates,
} from "WidgetProvider/constants";
import { WIDGET_TAGS } from "constants/WidgetConstants";

function validateDefaultRate(value: unknown, props: any, _: any) {
  try {
    let parsed = value;
    let isValid = false;

    if (_.isString(value as string)) {
      if (/^\d+\.?\d*$/.test(value as string)) {
        parsed = Number(value);
        isValid = true;
      } else {
        if (value === "") {
          return {
            isValid: true,
            parsed: 0,
          };
        }

        return {
          isValid: false,
          parsed: 0,
          messages: [
            {
              name: "TypeError",
              message: `Value must be a number`,
            },
          ],
        };
      }
    }

    if (Number.isFinite(parsed)) {
      isValid = true;
    }

    // default rate must be less than max count
    if (!_.isNaN(props.maxCount) && Number(value) > Number(props.maxCount)) {
      return {
        isValid: false,
        parsed,
        messages: [
          {
            name: "RangeError",
            message: `This value must be less than or equal to max count`,
          },
        ],
      };
    }

    // default rate can be a decimal only if Allow half property is true
    if (!props.isAllowHalf && !Number.isInteger(parsed)) {
      return {
        isValid: false,
        parsed,
        messages: [
          {
            name: "ValidationError",
            message: `This value can be a decimal only if 'Allow half' is true`,
          },
        ],
      };
    }

    return { isValid, parsed };
  } catch (e) {
    return {
      isValid: false,
      parsed: value,
      messages: [
        {
          name: "ValidationError",
          message: `Could not validate `,
        },
      ],
    };
  }
}

class RateWidget extends BaseWidget<RateWidgetProps, WidgetState> {
  static type = "RATE_WIDGET";

  static getConfig() {
    return {
      name: "评分",
      iconSVG: IconSVG,
      tags: [WIDGET_TAGS.SELECT],
      needsMeta: true,
      searchTags: ["rating", "rate", "star", "stars"],
    };
  }

  static getDefaults() {
    return {
      rows: 4,
      columns: 20,
      animateLoading: false,
      maxCount: 5,
      defaultRate: 3,
      activeColor: Colors.RATE_ACTIVE,
      inactiveColor: Colors.ALTO2,
      size: "LARGE",
      isRequired: false,
      isAllowHalf: false,
      isDisabled: false,
      isReadOnly: false,
      tooltips: ["烂透了", "不好", "一般", "好", "好极了"],
      widgetName: "Rating",
    };
  }

  static getFeatures() {
    return {
      dynamicHeight: {
        sectionIndex: 1,
        active: true,
      },
    };
  }

  static getAutoLayoutConfig() {
    return {
      disabledPropsDefaults: {
        size: "LARGE",
      },
      defaults: {
        columns: 7.272727,
        rows: 4,
      },
      autoDimension: {
        width: true,
      },
      widgetSize: [
        {
          viewportMinWidth: 0,
          configuration: (props: RateWidgetProps) => {
            let maxCount = props.maxCount;
            if (typeof maxCount !== "number")
              maxCount = parseInt(props.maxCount as any, 10);
            return {
              // 21 is the size of a star, 5 is the margin between stars
              minWidth: `${maxCount * 21 + (maxCount + 1) * 5}px`,
              minHeight: "40px",
            };
          },
        },
      ],
      disableResizeHandles: {
        horizontal: true,
        vertical: true,
      },
    };
  }

  static getAnvilConfig(): AnvilConfig | null {
    return {
      widgetSize: (props: RateWidgetProps) => {
        let maxCount = props.maxCount;
        if (typeof maxCount !== "number")
          maxCount = parseInt(props.maxCount as any, 10);

        return {
          maxHeight: {},
          maxWidth: {},
          minHeight: { base: "40px" },
          minWidth: { base: `${maxCount * 21 + (maxCount + 1) * 5}px` },
        };
      },
    };
  }

  static getMethods() {
    return {
      getSnipingModeUpdates: (
        propValueMap: SnipingModeProperty,
      ): PropertyUpdates[] => {
        return [
          {
            propertyPath: "onRateChanged",
            propertyValue: propValueMap.run,
            isDynamicPropertyPath: true,
          },
        ];
      },
    };
  }

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      "!doc": "Rating widget is used to display ratings in your app.",
      "!url": "https://docs.appsmith.com/widget-reference/rate",
      isVisible: DefaultAutocompleteDefinitions.isVisible,
      value: "number",
      maxCount: "number",
    };
  }

  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "数据",
        children: [
          {
            propertyName: "maxCount",
            helpText: "设置总分",
            label: "最大星星数",
            controlType: "INPUT_TEXT",
            placeholderText: "5",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { natural: true },
            },
          },
          {
            propertyName: "defaultRate",
            helpText: "设置默认评分",
            label: "默认评分",
            controlType: "INPUT_TEXT",
            placeholderText: "2.5",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: validateDefaultRate,
                expected: {
                  type: "number",
                  example: 5,
                  autocompleteDataType: AutocompleteDataType.NUMBER,
                },
              },
            },
            dependencies: ["maxCount", "isAllowHalf"],
          },
          {
            propertyName: "tooltips",
            helpText: "提示气泡",
            label: "提示气泡",
            controlType: "INPUT_TEXT",
            placeholderText: '["糟糕", "普通", "非常棒"]',
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: { children: { type: ValidationTypes.TEXT } },
            },
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "isAllowHalf",
            helpText: "是否允许打半星",
            label: "允许半星",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
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
            helpText: "让组件不可交互",
            label: "禁用",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isReadOnly",
            helpText: "让组件只读",
            label: "只读",
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
        ],
      },
      {
        sectionName: "事件",
        children: [
          {
            helpText: "评分变化时触发",
            propertyName: "onRateChanged",
            label: "onChange",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
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
            propertyName: "size",
            label: "尺寸",
            helpText: "Controls the size of the stars in the widget",
            controlType: "ICON_TABS",
            defaultValue: "LARGE",
            fullWidth: true,
            hidden: isAutoLayout,
            options: [
              {
                label: "小",
                value: "SMALL",
              },
              {
                label: "中",
                value: "MEDIUM",
              },
              {
                label: "大",
                value: "LARGE",
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
          },
        ],
      },
      {
        sectionName: "颜色配置",
        children: [
          {
            propertyName: "activeColor",
            label: "评分颜色",
            helpText: "Color of the selected stars",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "inactiveColor",
            label: "评分背景颜色",
            helpText: "Color of the unselected stars",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ];
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {
      rate: "defaultRate",
    };
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {
      value: `{{ this.rate }}`,
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      rate: undefined,
    };
  }

  static getStylesheetConfig(): Stylesheet {
    return {
      activeColor: "{{appsmith.theme.colors.primaryColor}}",
    };
  }

  valueChangedHandler = (value: number) => {
    this.props.updateWidgetMetaProperty("rate", value, {
      triggerPropertyName: "onRateChanged",
      dynamicString: this.props.onRateChanged,
      event: {
        type: EventType.ON_RATE_CHANGED,
      },
    });
  };

  static getSetterConfig(): SetterConfig {
    return {
      __setters: {
        setVisibility: {
          path: "isVisible",
          type: "boolean",
        },
        setDisabled: {
          path: "isDisabled",
          type: "boolean",
        },
        setValue: {
          path: "defaultRate",
          type: "number",
          accessor: "value",
        },
      },
    };
  }

  getWidgetView() {
    return (
      (this.props.rate || this.props.rate === 0) && (
        <RateComponent
          activeColor={this.props.activeColor}
          inactiveColor={this.props.inactiveColor}
          isAllowHalf={this.props.isAllowHalf}
          isDisabled={this.props.isDisabled}
          isLoading={this.props.isLoading}
          key={this.props.widgetId}
          maxCount={this.props.maxCount}
          minHeight={this.props.minHeight}
          onValueChanged={this.valueChangedHandler}
          readonly={this.props.isReadOnly}
          size={this.props.size}
          tooltips={this.props.tooltips}
          value={this.props.rate}
          widgetId={this.props.widgetId}
        />
      )
    );
  }
}

export interface RateWidgetProps extends WidgetProps {
  maxCount: number;
  size: RateSize;
  defaultRate?: number;
  rate?: number;
  activeColor?: string;
  inactiveColor?: string;
  isAllowHalf?: boolean;
  onRateChanged?: string;
  tooltips?: Array<string>;
  isReadOnly?: boolean;
}

export default RateWidget;
