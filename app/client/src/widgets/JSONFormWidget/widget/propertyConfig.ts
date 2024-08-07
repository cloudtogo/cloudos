import { Alignment } from "@blueprintjs/core";
import { ButtonPlacementTypes, ButtonVariantTypes } from "components/constants";
import type { OnButtonClickProps } from "components/propertyControls/ButtonControl";
import type { ValidationResponse } from "constants/WidgetValidation";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { EVALUATION_PATH } from "utils/DynamicBindingUtils";
import type { ButtonWidgetProps } from "widgets/ButtonWidget/widget";
import type { JSONFormWidgetProps } from ".";
import { FieldType, ROOT_SCHEMA_KEY } from "../constants";
import { ComputedSchemaStatus, computeSchema } from "./helper";
import generatePanelPropertyConfig from "./propertyConfig/generatePanelPropertyConfig";
import { AutocompleteDataType } from "utils/autocomplete/AutocompleteDataType";
import {
  JSON_FORM_CONNECT_BUTTON_TEXT,
  SUCCESSFULL_BINDING_MESSAGE,
} from "../constants/messages";
import { createMessage } from "@appsmith/constants/messages";
import { FieldOptionsType } from "components/editorComponents/WidgetQueryGeneratorForm/WidgetSpecificControls/OtherFields/Field/Dropdown/types";
import { DROPDOWN_VARIANT } from "components/editorComponents/WidgetQueryGeneratorForm/CommonControls/DatasourceDropdown/types";

const MAX_NESTING_LEVEL = 5;

const panelConfig = generatePanelPropertyConfig(MAX_NESTING_LEVEL);

export const sourceDataValidationFn = (
  value: any,
  props: JSONFormWidgetProps,
  _?: any,
): ValidationResponse => {
  if (value === "") {
    return {
      isValid: true,
      parsed: value,
    };
  }

  if (value === null || value === undefined) {
    return {
      isValid: false,
      parsed: value,
      messages: [
        {
          name: "ValidationError",
          message: `Data is undefined`,
        },
      ],
    };
  }

  if (_.isObject(value) && Object.keys(value).length === 0) {
    return {
      isValid: false,
      parsed: value,
      messages: [
        {
          name: "ValidationError",
          message: "Data is empty",
        },
      ],
    };
  }

  if (_.isNumber(value) || _.isBoolean(value)) {
    return {
      isValid: false,
      parsed: {},
      messages: [
        {
          name: "ValidationError",
          message: `Source data cannot be ${value}`,
        },
      ],
    };
  }

  if (_.isNil(value)) {
    return {
      isValid: true,
      parsed: {},
    };
  }

  if (_.isArray(value)) {
    return {
      isValid: false,
      parsed: {},
      messages: [
        {
          name: "TypeError",
          message: `The value does not evaluate to type Object`,
        },
      ],
    };
  }

  if (_.isPlainObject(value)) {
    return {
      isValid: true,
      parsed: value,
    };
  }

  try {
    return {
      isValid: true,
      parsed: JSON.parse(value as string),
    };
  } catch (e) {
    return {
      isValid: false,
      parsed: {},
      messages: [e as Error],
    };
  }
};

export const onGenerateFormClick = ({
  batchUpdateProperties,
  props,
}: OnButtonClickProps) => {
  const widgetProperties: JSONFormWidgetProps = props.widgetProperties;
  if (widgetProperties.autoGenerateForm) return;

  const currSourceData = widgetProperties[EVALUATION_PATH]?.evaluatedValues
    ?.sourceData as Record<string, any> | Record<string, any>[];

  const prevSourceData = widgetProperties.schema?.__root_schema__?.sourceData;

  const { dynamicPropertyPathList, schema, status } = computeSchema({
    currentDynamicPropertyPathList: widgetProperties.dynamicPropertyPathList,
    currSourceData,
    fieldThemeStylesheets: widgetProperties.childStylesheet,
    prevSchema: widgetProperties.schema,
    prevSourceData,
    widgetName: widgetProperties.widgetName,
  });

  if (status === ComputedSchemaStatus.LIMIT_EXCEEDED) {
    batchUpdateProperties({ fieldLimitExceeded: true });
    return;
  }

  if (status === ComputedSchemaStatus.UNCHANGED) {
    if (widgetProperties.fieldLimitExceeded) {
      batchUpdateProperties({ fieldLimitExceeded: false });
    }
    return;
  }

  if (status === ComputedSchemaStatus.UPDATED) {
    batchUpdateProperties({
      dynamicPropertyPathList,
      schema,
      fieldLimitExceeded: false,
    });
  }
};

const generateFormCTADisabled = (widgetProps: JSONFormWidgetProps) =>
  widgetProps.autoGenerateForm;

export const contentConfig = [
  {
    sectionName: "数据",
    children: [
      {
        propertyName: "sourceData",
        helpText: "样例 JSON 数据",
        label: "源数据",
        controlType: "ONE_CLICK_BINDING_CONTROL",
        controlConfig: {
          showEditFieldsModal: true, // Shows edit field modals button in the datasource table control
          datasourceDropdownVariant: DROPDOWN_VARIANT.CREATE_OR_EDIT_RECORDS, // Decides the variant of the datasource dropdown which alters the text and some options
          actionButtonCtaText: createMessage(JSON_FORM_CONNECT_BUTTON_TEXT), // CTA text for the connect action button in property pane
          excludePrimaryColumnFromQueryGeneration: true, // Excludes the primary column from the query generation by default
          isConnectableToWidget: true, // Whether this widget can be connected to another widget like Table,List etc
          alertMessage: {
            success: {
              update: createMessage(SUCCESSFULL_BINDING_MESSAGE, "updated"),
            }, // Alert message to show when the binding is successful
          },
          /* other form config options like create or update flow, get default values from widget and data identifier to be used in the generated query as primary key*/
          otherFields: [
            {
              label: "表单类型",
              name: "formType",
              fieldType: FieldType.SELECT,
              optionType: FieldOptionsType.CUSTOM, // Dropdown options can be custom ( options provided by the widget config like Line 193 ) or widgets ( connectable widgets in the page ) or columns ( columns from the datasource )
              isRequired: true,
              getDefaultValue: () => {
                return "create";
              },
              allowClear: false, // whether the dropdown should have a clear option
              options: [
                {
                  label: "创建记录",
                  value: "create",
                  id: "create",
                },
                {
                  label: "编辑记录",
                  value: "edit",
                  id: "edit",
                },
              ],
              isVisible: (config: Record<string, any>) => {
                // Whether the field should be visible or not based on the config
                return config?.tableName !== "";
              },
            },
            {
              label: "获取值的来源",
              name: "defaultValues",
              fieldType: FieldType.SELECT,
              optionType: FieldOptionsType.WIDGETS,
              isRequired: true,
              isVisible: (config: Record<string, any>) => {
                return config?.otherFields?.formType === "edit";
              },
            },
            {
              label: "数据定义",
              name: "dataIdentifier",
              isDataIdentifier: true, // Whether the field is a data identifier or not
              fieldType: FieldType.SELECT,
              optionType: FieldOptionsType.COLUMNS,
              isRequired: true,
              getDefaultValue: (options: Record<string, unknown>) => {
                return options?.primaryColumn;
              },
              isVisible: (config: Record<string, any>) => {
                return config?.otherFields?.formType === "edit";
              },
            },
          ],
        },
        isJSConvertible: true,
        placeholderText: '{ "name": "John", "age": 24 }',
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: sourceDataValidationFn,
            expected: {
              type: "JSON",
              example: `{ "name": "John Doe", "age": 29 }`,
              autocompleteDataType: AutocompleteDataType.OBJECT,
            },
          },
        },
        evaluationSubstitutionType: EvaluationSubstitutionType.SMART_SUBSTITUTE,
      },
      {
        propertyName: "autoGenerateForm",
        helpText:
          "注意：如果开启了自动生成表单，在源数据发生改变的时候，所有的表单字段都会重新生成。",
        label: "自动生成表单",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        customJSControl: "INPUT_TEXT",
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "generateFormButton",
        label: "",
        controlType: "BUTTON",
        isJSConvertible: false,
        isBindProperty: false,
        buttonLabel: "生成表单",
        onClick: onGenerateFormClick,
        isDisabled: generateFormCTADisabled,
        isTriggerProperty: false,
        dependencies: [
          "autoGenerateForm",
          "schema",
          "fieldLimitExceeded",
          "childStylesheet",
          "dynamicPropertyPathList",
        ],
        evaluatedDependencies: ["sourceData"],
      },
      {
        propertyName: `schema.${ROOT_SCHEMA_KEY}.children`,
        helpText: "字段配置",
        label: "字段配置",
        controlType: "FIELD_CONFIGURATION",
        isBindProperty: false,
        isTriggerProperty: false,
        panelConfig,
        dependencies: ["schema", "childStylesheet"],
      },
    ],
  },
  {
    sectionName: "属性",
    children: [
      {
        propertyName: "title",
        label: "标题",
        helpText: "表单标题",
        controlType: "INPUT_TEXT",
        placeholderText: "Update Order",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
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
        propertyName: "useSourceData",
        helpText: "使用源数据来填充隐藏字段，以便在表单数据中显示它们。",
        label: "隐藏数据中的字段。",
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
        propertyName: "disabledWhenInvalid",
        helpText: "父级表单校验不通过时禁用提交按钮",
        label: "表单校验不成功时禁用",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "fixedFooter",
        helpText: "让底部信息固定在表单底部",
        label: "固定底部",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "scrollContents",
        helpText: "允许表单的内容滚动",
        label: "允许内容滚动",
        controlType: "SWITCH",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "showReset",
        helpText: "显示或隐藏表单重置按钮",
        label: "显示重置按钮",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "submitButtonLabel",
        helpText: "修改提交按钮文案",
        label: "提交按钮文案",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "resetButtonLabel",
        helpText: "修改重置按钮文案",
        label: "重置按钮文案",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
    ],
  },
  {
    sectionName: "事件",
    children: [
      {
        propertyName: "onSubmit",
        helpText: "点击提交按钮时触发",
        label: "提交时",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
    ],
  },
];

const generateButtonStyleControlsV2For = (prefix: string) => [
  {
    sectionName: "属性",
    collapsible: false,
    children: [
      {
        propertyName: `${prefix}.buttonColor`,
        helpText: "修改按钮颜色",
        label: "按钮颜色",
        controlType: "COLOR_PICKER",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: `${prefix}.buttonVariant`,
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
      {
        propertyName: `${prefix}.borderRadius`,
        label: "边框圆角",
        helpText: "边框圆角样式",
        controlType: "BORDER_RADIUS_OPTIONS",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: `${prefix}.boxShadow`,
        label: "阴影",
        helpText: "组件轮廓投影",
        controlType: "BOX_SHADOW_OPTIONS",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.TEXT,
        },
      },
    ],
  },
  {
    sectionName: "图标配置",
    collapsible: false,
    children: [
      {
        propertyName: `${prefix}.iconName`,
        label: "图标",
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
              propertyPath: `${prefix}.iconAlign`,
              propertyValue: Alignment.LEFT,
            });
          }
          return propertiesToUpdate;
        },
        validation: {
          type: ValidationTypes.TEXT,
        },
      },
      {
        propertyName: `${prefix}.iconAlign`,
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
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.TEXT,
          params: {
            allowedValues: ["center", "left", "right"],
          },
        },
      },
      {
        propertyName: `${prefix}.placement`,
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
];

export const styleConfig = [
  {
    sectionName: "颜色配置",
    children: [
      {
        propertyName: "backgroundColor",
        helpText: "使用 html 颜色名称，HEX，RGB 或者 RGBA 值",
        placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
        label: "背景颜色",
        controlType: "COLOR_PICKER",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "borderColor",
        helpText: "使用 html 颜色名称，HEX，RGB 或者 RGBA 值",
        placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
        label: "边框颜色",
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
        propertyName: "borderWidth",
        helpText: "输入边框宽度",
        label: "边框宽度",
        placeholderText: "以 px 为单位",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.NUMBER },
      },
      {
        propertyName: "borderRadius",
        helpText: "Enter value for border radius",
        label: "边框圆角",
        controlType: "BORDER_RADIUS_OPTIONS",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
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
  {
    sectionName: "提交按钮样式",
    children: generateButtonStyleControlsV2For("submitButtonStyles"),
  },
  {
    sectionName: "重置按钮样式",
    children: generateButtonStyleControlsV2For("resetButtonStyles"),
    dependencies: ["showReset"],
    hidden: (props: JSONFormWidgetProps) => !props.showReset,
  },
];
