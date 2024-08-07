import React from "react";
import type { WidgetProps, WidgetState } from "../../BaseWidget";
import BaseWidget from "../../BaseWidget";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import DropDownComponent from "../component";
import _ from "lodash";
import type { DropdownOption } from "../constants";
import type { ValidationResponse } from "constants/WidgetValidation";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { AutocompleteDataType } from "utils/autocomplete/AutocompleteDataType";
import { MinimumPopupWidthInPercentage } from "WidgetProvider/constants";
import { LabelPosition } from "components/constants";
import { Alignment } from "@blueprintjs/core";
import type { Stylesheet } from "entities/AppTheming";
import {
  DefaultAutocompleteDefinitions,
  isCompactMode,
} from "widgets/WidgetUtils";
import type {
  AutocompletionDefinitions,
  PropertyUpdates,
  SnipingModeProperty,
} from "WidgetProvider/constants";
import IconSVG from "../icon.svg";
import { layoutConfigurations } from "constants/WidgetConstants";

function defaultOptionValueValidation(value: unknown): ValidationResponse {
  if (typeof value === "string") return { isValid: true, parsed: value.trim() };
  if (value === undefined || value === null)
    return {
      isValid: false,
      parsed: "",
      messages: [
        {
          name: "TypeError",
          message: "This value does not evaluate to type: string",
        },
      ],
    };
  return { isValid: true, parsed: value };
}

class DropdownWidget extends BaseWidget<DropdownWidgetProps, WidgetState> {
  static type = "DROP_DOWN_WIDGET";

  static getConfig() {
    return {
      name: "下拉单选",
      iconSVG: IconSVG,
      needsMeta: true,
      hideCard: true,
      isDeprecated: true,
      replacement: "SELECT_WIDGET",
      searchTags: ["select", "dropdown", "options"],
    };
  }

  static getDefaults() {
    return {
      rows: 7,
      columns: 20,
      placeholderText: "请选择",
      labelText: "标签",
      labelPosition: LabelPosition.Left,
      labelAlignment: Alignment.LEFT,
      labelWidth: 5,
      selectionType: "SINGLE_SELECT",
      options: [
        { label: "蓝", value: "BLUE" },
        { label: "绿", value: "GREEN" },
        { label: "红", value: "RED" },
      ],
      serverSideFiltering: false,
      widgetName: "Select",
      defaultOptionValue: "GREEN",
      version: 1,
      isFilterable: false,
      isRequired: false,
      isDisabled: false,
      animateLoading: false,
    };
  }

  static getMethods() {
    return {
      getSnipingModeUpdates: (
        propValueMap: SnipingModeProperty,
      ): PropertyUpdates[] => {
        return [
          {
            propertyPath: "options",
            propertyValue: propValueMap.data,
            isDynamicPropertyPath: true,
          },
        ];
      },
    };
  }

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      "!doc":
        "Select is used to capture user input/s from a specified list of permitted inputs. A Select can capture a single choice",
      "!url": "https://docs.appsmith.com/widget-reference/dropdown",
      isVisible: DefaultAutocompleteDefinitions.isVisible,
      filterText: {
        "!type": "string",
        "!doc": "The filter text for Server side filtering",
      },
      selectedOptionValue: {
        "!type": "string",
        "!doc": "The value selected in a single select dropdown",
        "!url": "https://docs.appsmith.com/widget-reference/dropdown",
      },
      selectedOptionLabel: {
        "!type": "string",
        "!doc": "The selected option label in a single select dropdown",
        "!url": "https://docs.appsmith.com/widget-reference/dropdown",
      },
      isDisabled: "bool",
      options: "[$__dropdownOption__$]",
    };
  }

  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            helpText: "让用户选择一项，选项值必须唯一",
            propertyName: "options",
            label: "选项",
            controlType: "INPUT_TEXT",
            placeholderText: '[{ "label": "选项1", "value": "选项2" }]',
            isBindProperty: true,
            isTriggerProperty: false,
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
                        name: "label",
                        type: ValidationTypes.TEXT,
                        params: {
                          default: "",
                          required: true,
                        },
                      },
                      {
                        name: "value",
                        type: ValidationTypes.TEXT,
                        params: {
                          default: "",
                        },
                      },
                    ],
                  },
                },
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
          {
            helpText: "默认选中这个值",
            propertyName: "defaultOptionValue",
            label: "默认选项",
            controlType: "INPUT_TEXT",
            placeholderText: "GREEN",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: defaultOptionValueValidation,
                expected: {
                  type: "value or Array of values",
                  example: `option1 | ['option1', 'option2']`,
                  autocompleteDataType: AutocompleteDataType.STRING,
                },
              },
            },
            dependencies: ["selectionType"],
          },
          {
            helpText: "设置占位文本",
            propertyName: "placeholderText",
            label: "占位符",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入占位文本",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "isRequired",
            label: "必填",
            helpText: "强制用户填写",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "控制组件的显示/隐藏",
            propertyName: "isVisible",
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
            propertyName: "isFilterable",
            label: "支持过滤",
            helpText: "让下拉列表支持数据过滤",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "开启服务端数据过滤",
            propertyName: "serverSideFiltering",
            label: "服务端过滤",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
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
            placeholderText: "请输入文本内容",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "设置组件标签位置",
            propertyName: "labelPosition",
            label: "位置",
            controlType: "DROP_DOWN",
            options: [
              { label: "左", value: LabelPosition.Left },
              { label: "上", value: LabelPosition.Top },
              { label: "自动", value: LabelPosition.Auto },
            ],
            defaultValue: LabelPosition.Top,
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "设置组件标签的对齐方式",
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
            hidden: (props: DropdownWidgetProps) =>
              props.labelPosition !== LabelPosition.Left,
            dependencies: ["labelPosition"],
          },
          {
            helpText: "设置组件标签占用的列数",
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
            hidden: (props: DropdownWidgetProps) =>
              props.labelPosition !== LabelPosition.Left,
            dependencies: ["labelPosition"],
          },
        ],
      },
      {
        sectionName: "样式",
        children: [
          {
            propertyName: "labelTextColor",
            label: "标签文本颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "labelTextSize",
            label: "标签文本大小",
            controlType: "DROP_DOWN",
            defaultValue: "0.875rem",
            options: [
              {
                label: "S",
                value: "0.875rem",
                subText: "0.875rem",
              },
              {
                label: "M",
                value: "1rem",
                subText: "1rem",
              },
              {
                label: "L",
                value: "1.25rem",
                subText: "1.25rem",
              },
              {
                label: "XL",
                value: "1.875rem",
                subText: "1.875rem",
              },
              {
                label: "XXL",
                value: "3rem",
                subText: "3rem",
              },
              {
                label: "3XL",
                value: "3.75rem",
                subText: "3.75rem",
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "labelStyle",
            label: "字体样式",
            controlType: "BUTTON_GROUP",
            options: [
              {
                startIcon: "text-bold",
                value: "BOLD",
              },
              {
                startIcon: "text-italic",
                value: "ITALIC",
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
        sectionName: "动作",
        children: [
          {
            helpText: "用户选中一个选项时触发",
            propertyName: "onOptionChange",
            label: "onOptionChange",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "过滤关键字更改时触发",
            hidden: (props: DropdownWidgetProps) => !props.serverSideFiltering,
            dependencies: ["serverSideFiltering"],
            propertyName: "onFilterUpdate",
            label: "onFilterUpdate",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  static getDerivedPropertiesMap() {
    return {
      isValid: `{{this.isRequired  ? !!this.selectedOptionValue || this.selectedOptionValue === 0 : true}}`,
      selectedOptionLabel: `{{(()=>{const index = _.findIndex(this.options, { value: this.value }); return this.options[index]?.label; })()}}`,
      selectedOptionValue: `{{(()=>{const index = _.findIndex(this.options, { value: this.value }); return this.options[index]?.value; })()}}`,
    };
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {
      defaultValue: "defaultOptionValue",
      value: "defaultOptionValue",
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      defaultValue: undefined,
      value: undefined,
    };
  }

  static getStylesheetConfig(): Stylesheet {
    return {
      accentColor: "{{appsmith.theme.colors.primaryColor}}",
      borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
      boxShadow: "none",
    };
  }

  componentDidMount() {
    this.changeSelectedOption();
  }
  componentDidUpdate(prevProps: DropdownWidgetProps): void {
    // removing selectedOptionValue if defaultValueChanges
    if (
      prevProps.defaultOptionValue !== this.props.defaultOptionValue ||
      prevProps.option !== this.props.option
    ) {
      this.changeSelectedOption();
    }
  }

  getWidgetView() {
    const options = _.isArray(this.props.options) ? this.props.options : [];
    const isInvalid =
      "isValid" in this.props && !this.props.isValid && !!this.props.isDirty;
    const dropDownWidth =
      (MinimumPopupWidthInPercentage / 100) *
      (this.props.mainCanvasWidth ?? layoutConfigurations.MOBILE.maxWidth);

    const selectedIndex = _.findIndex(this.props.options, {
      value: this.props.selectedOptionValue,
    });

    const { componentHeight, componentWidth } = this.props;
    return (
      <DropDownComponent
        accentColor={this.props.accentColor}
        backgroundColor={this.props.backgroundColor}
        borderRadius={this.props.borderRadius}
        boxShadow={this.props.boxShadow}
        compactMode={isCompactMode(componentHeight)}
        disabled={this.props.isDisabled}
        dropDownWidth={dropDownWidth}
        hasError={isInvalid}
        height={componentHeight}
        isFilterable={this.props.isFilterable}
        isLoading={this.props.isLoading}
        isValid={this.props.isValid}
        labelAlignment={this.props.labelAlignment}
        labelPosition={this.props.labelPosition}
        labelStyle={this.props.labelStyle}
        labelText={this.props.labelText}
        labelTextColor={this.props.labelTextColor}
        labelTextSize={this.props.labelTextSize}
        labelWidth={this.props.labelComponentWidth}
        onFilterChange={this.onFilterChange}
        onOptionSelected={this.onOptionSelected}
        options={options}
        placeholder={this.props.placeholderText}
        selectedIndex={selectedIndex > -1 ? selectedIndex : undefined}
        serverSideFiltering={this.props.serverSideFiltering}
        widgetId={this.props.widgetId}
        width={componentWidth}
      />
    );
  }

  onOptionSelected = (selectedOption: DropdownOption) => {
    let isChanged = true;

    if (!this.props.isDirty) {
      this.props.updateWidgetMetaProperty("isDirty", true);
    }

    // Check if the value has changed. If no option
    // selected till now, there is a change
    if (this.props.selectedOptionValue) {
      isChanged = !(this.props.selectedOptionValue === selectedOption.value);
    }
    if (isChanged) {
      this.props.updateWidgetMetaProperty("value", selectedOption.value, {
        triggerPropertyName: "onOptionChange",
        dynamicString: this.props.onOptionChange as string,
        event: {
          type: EventType.ON_OPTION_CHANGE,
        },
      });
    }
  };
  changeSelectedOption = () => {
    const index = _.findIndex(this.props.options, {
      value: this.props.selectedOptionValue ?? this.props.defaultOptionValue,
    });
    const value = this.props.options?.[index]?.value;
    this.props.updateWidgetMetaProperty("value", value);
  };

  onFilterChange = (value: string) => {
    this.props.updateWidgetMetaProperty("filterText", value);

    super.executeAction({
      triggerPropertyName: "onFilterUpdate",
      dynamicString: this.props.onFilterUpdate,
      event: {
        type: EventType.ON_FILTER_UPDATE,
      },
    });
  };
}

export interface DropdownWidgetProps extends WidgetProps {
  placeholderText?: string;
  labelText: string;
  labelPosition?: LabelPosition;
  labelAlignment?: Alignment;
  labelWidth?: number;
  selectedIndex?: number;
  selectedOption: DropdownOption;
  options?: DropdownOption[];
  onOptionChange?: string;
  defaultOptionValue?: string;
  value?: string;
  isRequired: boolean;
  isFilterable: boolean;
  defaultValue: string;
  selectedOptionLabel: string;
  serverSideFiltering: boolean;
  onFilterUpdate: string;
  backgroundColor: string;
  borderRadius: string;
  boxShadow?: string;
  accentColor: string;
  fontFamily?: string;
  isDirty?: boolean;
  labelComponentWidth?: number;
}

export default DropdownWidget;
