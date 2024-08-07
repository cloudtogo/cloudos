import { Alignment } from "@blueprintjs/core";
import type { IconName } from "@blueprintjs/icons";
import type {
  ButtonPlacement,
  ButtonVariant,
  RecaptchaType,
} from "components/constants";
import {
  ButtonPlacementTypes,
  ButtonVariantTypes,
  RecaptchaTypes,
} from "components/constants";
import type { ExecutionResult } from "constants/AppsmithActionConstants/ActionConstants";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import type { SetterConfig, Stylesheet } from "entities/AppTheming";
import React from "react";
import type { DerivedPropertiesMap } from "WidgetProvider/factory";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import ButtonComponent, { ButtonType } from "../component";
import { DefaultAutocompleteDefinitions } from "widgets/WidgetUtils";
import type {
  AnvilConfig,
  AutocompletionDefinitions,
} from "WidgetProvider/constants";
import { isAirgapped } from "@appsmith/utils/airgapHelpers";
import { BUTTON_MIN_WIDTH } from "constants/minWidthConstants";
import { ResponsiveBehavior } from "layoutSystems/common/utils/constants";
import IconSVG from "../icon.svg";

import type {
  PropertyUpdates,
  SnipingModeProperty,
} from "WidgetProvider/constants";
import { WIDGET_TAGS } from "constants/WidgetConstants";

class ButtonWidget extends BaseWidget<ButtonWidgetProps, ButtonWidgetState> {
  onButtonClickBound: (event: React.MouseEvent<HTMLElement>) => void;
  clickWithRecaptchaBound: (token: string) => void;
  constructor(props: ButtonWidgetProps) {
    super(props);
    this.onButtonClickBound = this.onButtonClick.bind(this);
    this.clickWithRecaptchaBound = this.clickWithRecaptcha.bind(this);
    this.state = {
      isLoading: false,
    };
  }

  static type = "BUTTON_WIDGET";

  static getConfig() {
    return {
      name: "按钮",
      iconSVG: IconSVG,
      tags: [WIDGET_TAGS.BUTTONS],
      needsMeta: true,
      searchTags: ["click", "submit", "button"],
    };
  }

  static getDefaults() {
    return {
      animateLoading: false,
      text: "提交",
      buttonVariant: ButtonVariantTypes.PRIMARY,
      placement: ButtonPlacementTypes.CENTER,
      rows: 4,
      columns: 16,
      widgetName: "Button",
      isDisabled: false,
      isVisible: true,
      isDefaultClickDisabled: true,
      disabledWhenInvalid: false,
      resetFormOnClick: false,
      recaptchaType: RecaptchaTypes.V3,
      version: 1,
      responsiveBehavior: ResponsiveBehavior.Hug,
      minWidth: BUTTON_MIN_WIDTH,
    };
  }

  static getMethods() {
    return {
      getSnipingModeUpdates: (
        propValueMap: SnipingModeProperty,
      ): PropertyUpdates[] => {
        return [
          {
            propertyPath: "onClick",
            propertyValue: propValueMap.run,
            isDynamicPropertyPath: true,
          },
        ];
      },
    };
  }

  static getAutoLayoutConfig() {
    return {
      defaults: {
        rows: 4,
        columns: 6.453,
      },
      autoDimension: {
        width: true,
      },
      widgetSize: [
        {
          viewportMinWidth: 0,
          configuration: () => {
            return {
              minWidth: "120px",
              maxWidth: "360px",
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
      widgetSize: {
        maxHeight: {},
        maxWidth: { base: "360px" },
        minHeight: { base: "40px" },
        minWidth: { base: "120px" },
      },
    };
  }

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      "!doc":
        "Buttons are used to capture user intent and trigger actions based on that intent",
      "!url": "https://docs.appsmith.com/widget-reference/button",
      isVisible: DefaultAutocompleteDefinitions.isVisible,
      text: "string",
      isDisabled: "bool",
      recaptchaToken: "string",
    };
  }

  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "text",
            label: "标签",
            helpText: "设置按钮标签",
            controlType: "INPUT_TEXT",
            placeholderText: "提交",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "点击按钮时触发",
            propertyName: "onClick",
            label: "onClick",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            helpText: "鼠标交互时显示的提示信息",
            propertyName: "tooltip",
            label: "提示",
            controlType: "INPUT_TEXT",
            placeholderText: "提交表单",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
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
            controlType: "SWITCH",
            helpText: "让组件不可交互",
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
        sectionName: "校验",
        hidden: isAirgapped,
        children: [
          {
            propertyName: "googleRecaptchaKey",
            label: "Google reCAPTCHA 键值",
            helpText: "为按钮设置 Google reCAPTCHA 键值",
            controlType: "INPUT_TEXT",
            placeholderText: "reCAPTCHA Key",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "recaptchaType",
            label: "Google reCAPTCHA 版本",
            controlType: "DROP_DOWN",
            helpText: "选择 reCAPTCHA 版本",
            options: [
              {
                label: "reCAPTCHA v3",
                value: RecaptchaTypes.V3,
              },
              {
                label: "reCAPTCHA v2",
                value: RecaptchaTypes.V2,
              },
            ],
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: [RecaptchaTypes.V3, RecaptchaTypes.V2],
                default: RecaptchaTypes.V3,
              },
            },
          },
        ],
      },
      // TODO: refactor widgetParentProps implementation when we address #10659
      {
        sectionName: "表单设置",
        children: [
          {
            helpText: "当按钮位于表单下，表单必须校验成功时按钮才可以点击",
            propertyName: "disabledWhenInvalid",
            label: "表单校验不成功时禁用",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "当按钮位于表单下，表单提交成功后重置表单",
            propertyName: "resetFormOnClick",
            label: "提交成功后重置表单",
            controlType: "SWITCH",
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
            propertyName: "buttonVariant",
            label: "按钮类型",
            controlType: "ICON_TABS",
            defaultValue: ButtonVariantTypes.PRIMARY,
            fullWidth: true,
            helpText: "设置图标按钮类型",
            options: [
              {
                label: "主按钮",
                value: ButtonVariantTypes.PRIMARY,
              },
              {
                label: "次级按钮",
                value: ButtonVariantTypes.SECONDARY,
              },
              {
                label: "文本按钮",
                value: ButtonVariantTypes.TERTIARY,
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: [
                  ButtonVariantTypes.PRIMARY,
                  ButtonVariantTypes.SECONDARY,
                  ButtonVariantTypes.TERTIARY,
                ],
                default: ButtonVariantTypes.PRIMARY,
              },
            },
          },
        ],
      },
      {
        sectionName: "图标配置",
        children: [
          {
            propertyName: "iconName",
            label: "选择图标",
            helpText: "设置按钮图标",
            controlType: "ICON_SELECT",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            updateHook: (
              props: ButtonWidgetProps,
              propertyPath: string,
              propertyValue: string,
            ) => {
              const propertiesToUpdate = [{ propertyPath, propertyValue }];
              if (!props.iconAlign) {
                propertiesToUpdate.push({
                  propertyPath: "iconAlign",
                  propertyValue: Alignment.LEFT,
                });
              }
              return propertiesToUpdate;
            },
            dependencies: ["iconAlign"],
            validation: {
              type: ValidationTypes.TEXT,
            },
          },
          {
            propertyName: "iconAlign",
            label: "位置",
            helpText: "设置按钮图标对齐方向",
            controlType: "ICON_TABS",
            defaultValue: "left",
            fullWidth: false,
            options: [
              {
                startIcon: "skip-left-line",
                value: "left",
              },
              {
                startIcon: "skip-right-line",
                value: "right",
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: ["center", "left", "right"],
              },
            },
          },
          {
            propertyName: "placement",
            label: "排列方式",
            controlType: "ICON_TABS",
            fullWidth: true,
            helpText: "设置图标与标签的排列方式",
            options: [
              {
                label: "向前对齐",
                value: ButtonPlacementTypes.START,
              },
              {
                label: "两边对齐",
                value: ButtonPlacementTypes.BETWEEN,
              },
              {
                label: "居中对齐",
                value: ButtonPlacementTypes.CENTER,
              },
            ],
            defaultValue: ButtonPlacementTypes.CENTER,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: [
                  ButtonPlacementTypes.START,
                  ButtonPlacementTypes.BETWEEN,
                  ButtonPlacementTypes.CENTER,
                ],
                default: ButtonPlacementTypes.CENTER,
              },
            },
          },
        ],
      },
      {
        sectionName: "颜色配置",
        children: [
          {
            propertyName: "buttonColor",
            helpText: "修改按钮颜色",
            label: "按钮颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
      {
        sectionName: "轮廓样式",
        children: [
          {
            propertyName: "borderRadius",
            label: "边框圆角",
            helpText: "边框圆角样式",
            controlType: "BORDER_RADIUS_OPTIONS",
            isBindProperty: true,
            isJSConvertible: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
            },
          },
          {
            propertyName: "boxShadow",
            label: "阴影",
            helpText: "组件轮廓投影",
            controlType: "BOX_SHADOW_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ];
  }

  static getStylesheetConfig(): Stylesheet {
    return {
      buttonColor: "{{appsmith.theme.colors.primaryColor}}",
      borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
      boxShadow: "none",
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      recaptchaToken: undefined,
    };
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {};
  }

  onButtonClick() {
    if (this.props.onClick) {
      this.setState({
        isLoading: true,
      });
      super.executeAction({
        triggerPropertyName: "onClick",
        dynamicString: this.props.onClick,
        event: {
          type: EventType.ON_CLICK,
          callback: this.handleActionComplete,
        },
      });
    } else if (this.props.resetFormOnClick && this.props.onReset) {
      this.props.onReset();
    }
  }

  hasOnClickAction = () => {
    const { isDisabled, onClick, onReset, resetFormOnClick } = this.props;
    return Boolean((onClick || onReset || resetFormOnClick) && !isDisabled);
  };

  clickWithRecaptcha(token: string) {
    this.props.updateWidgetMetaProperty("recaptchaToken", token, {
      triggerPropertyName: "onClick",
      dynamicString: this.props.onClick,
      event: {
        type: EventType.ON_CLICK,
        callback: this.handleActionComplete,
      },
    });
  }

  handleRecaptchaV2Loading = (isLoading: boolean) => {
    if (this.props.onClick) {
      this.setState({ isLoading });
    }
  };

  handleActionComplete = (result: ExecutionResult) => {
    this.setState({
      isLoading: false,
    });
    if (result.success) {
      if (this.props.resetFormOnClick && this.props.onReset)
        this.props.onReset();
    }
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
        setLabel: {
          path: "text",
          type: "string",
        },
        setColor: {
          path: "buttonColor",
          type: "string",
        },
      },
    };
  }

  getWidgetView() {
    const disabled =
      this.props.disabledWhenInvalid &&
      "isFormValid" in this.props &&
      !this.props.isFormValid;
    const isDisabled = this.props.isDisabled || disabled;
    return (
      <ButtonComponent
        borderRadius={this.props.borderRadius}
        boxShadow={this.props.boxShadow}
        buttonColor={this.props.buttonColor}
        buttonVariant={this.props.buttonVariant}
        clickWithRecaptcha={this.clickWithRecaptchaBound}
        googleRecaptchaKey={this.props.googleRecaptchaKey}
        handleRecaptchaV2Loading={this.handleRecaptchaV2Loading}
        iconAlign={this.props.iconAlign}
        iconName={this.props.iconName}
        isDisabled={isDisabled}
        isLoading={this.props.isLoading || this.state.isLoading}
        key={this.props.widgetId}
        maxWidth={this.props.maxWidth}
        minHeight={this.props.minHeight}
        minWidth={this.props.minWidth}
        onClick={this.hasOnClickAction() ? this.onButtonClickBound : undefined}
        placement={this.props.placement}
        recaptchaType={this.props.recaptchaType}
        shouldFitContent={this.isAutoLayoutMode}
        text={this.props.text}
        tooltip={this.props.tooltip}
        type={this.props.buttonType || ButtonType.BUTTON}
        widgetId={this.props.widgetId}
        widgetName={this.props.widgetName}
      />
    );
  }
}

export interface ButtonWidgetProps extends WidgetProps {
  text?: string;
  onClick?: string;
  isDisabled?: boolean;
  isVisible?: boolean;
  recaptchaType?: RecaptchaType;
  buttonType?: ButtonType;
  googleRecaptchaKey?: string;
  buttonVariant?: ButtonVariant;
  buttonColor?: string;
  borderRadius?: string;
  boxShadow?: string;
  iconName?: IconName;
  iconAlign?: Alignment;
  placement?: ButtonPlacement;
  disabledWhenInvalid?: boolean;
  resetFormOnClick?: boolean;
}

interface ButtonWidgetState extends WidgetState {
  isLoading: boolean;
}

export default ButtonWidget;
