import { ValidationTypes } from "constants/WidgetValidation";
import type { TableWidgetProps } from "widgets/TableWidgetV2/constants";
import { ColumnTypes } from "widgets/TableWidgetV2/constants";
import { get } from "lodash";
import {
  getBasePropertyPath,
  hideByColumnType,
  updateColumnLevelEditability,
  updateColumnOrderWhenFrozen,
  updateInlineEditingOptionDropdownVisibilityHook,
} from "../../propertyUtils";
import { isColumnTypeEditable } from "../../utilities";
import { composePropertyUpdateHook } from "widgets/WidgetUtils";
import { ButtonVariantTypes } from "components/constants";
import { StickyType } from "widgets/TableWidgetV2/component/Constants";

export default {
  sectionName: "属性",
  children: [
    {
      propertyName: "isCellVisible",
      dependencies: ["primaryColumns", "columnType"],
      label: "是否显示",
      helpText: "控制当前列是否显示",
      defaultValue: true,
      controlType: "SWITCH",
      customJSControl: "TABLE_COMPUTE_VALUE",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
        params: {
          type: ValidationTypes.BOOLEAN,
        },
      },
    },
    {
      propertyName: "isDisabled",
      label: "禁用",
      helpText: "Controls the disabled state of the button",
      defaultValue: false,
      controlType: "SWITCH",
      customJSControl: "TABLE_COMPUTE_VALUE",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
        params: {
          type: ValidationTypes.BOOLEAN,
        },
      },
      dependencies: ["primaryColumns", "columnOrder"],
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [
          ColumnTypes.ICON_BUTTON,
          ColumnTypes.MENU_BUTTON,
          ColumnTypes.BUTTON,
        ]);
      },
    },
    {
      propertyName: "isCompact",
      helpText: "菜单项占用更少的空间",
      label: "紧凑模式",
      controlType: "SWITCH",
      customJSControl: "TABLE_COMPUTE_VALUE",
      isJSConvertible: true,
      isBindProperty: true,
      validation: {
        type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
        params: {
          type: ValidationTypes.BOOLEAN,
        },
      },
      isTriggerProperty: false,
      dependencies: ["primaryColumns", "columnOrder"],
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [ColumnTypes.MENU_BUTTON]);
      },
    },
    {
      propertyName: "allowCellWrapping",
      dependencies: ["primaryColumns", "columnType"],
      label: "单元格换行",
      helpText: "允许单元格内容换行",
      defaultValue: false,
      controlType: "SWITCH",
      customJSControl: "TABLE_COMPUTE_VALUE",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
        params: {
          type: ValidationTypes.BOOLEAN,
        },
      },
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [
          ColumnTypes.TEXT,
          ColumnTypes.NUMBER,
          ColumnTypes.URL,
        ]);
      },
    },
    {
      propertyName: "isCellEditable",
      dependencies: [
        "primaryColumns",
        "columnOrder",
        "columnType",
        "childStylesheet",
        "inlineEditingSaveOption",
      ],
      label: "支持编辑",
      helpText: "让表格单元格可以编辑",
      defaultValue: false,
      controlType: "SWITCH",
      customJSControl: "TABLE_COMPUTE_VALUE",
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: false,
      updateHook: composePropertyUpdateHook([
        updateColumnLevelEditability,
        updateInlineEditingOptionDropdownVisibilityHook,
      ]),
      validation: {
        type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
        params: {
          type: ValidationTypes.BOOLEAN,
        },
      },
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        const baseProperty = getBasePropertyPath(propertyPath);
        const columnType = get(props, `${baseProperty}.columnType`, "");
        const isDerived = get(props, `${baseProperty}.isDerived`, false);
        return !isColumnTypeEditable(columnType) || isDerived;
      },
    },
    {
      propertyName: "sticky",
      helpText: "你可以选择将数据列固定在表格左边或者右边",
      controlType: "ICON_TABS",
      defaultValue: StickyType.NONE,
      label: "固定列",
      fullWidth: true,
      isBindProperty: true,
      isTriggerProperty: false,
      dependencies: ["primaryColumns", "columnOrder"],
      options: [
        {
          startIcon: "contract-left-line",
          value: StickyType.LEFT,
        },
        {
          startIcon: "column-freeze",
          value: StickyType.NONE,
        },
        {
          startIcon: "contract-right-line",
          value: StickyType.RIGHT,
        },
      ],
      updateHook: updateColumnOrderWhenFrozen,
    },
  ],
};

export const GeneralStyle = {
  sectionName: "通用配置",
  children: [
    {
      propertyName: "buttonVariant",
      label: "按钮类型",
      controlType: "ICON_TABS",
      fullWidth: true,
      customJSControl: "TABLE_COMPUTE_VALUE",
      isJSConvertible: true,
      helpText: "设置按钮样式类型",
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [
          ColumnTypes.ICON_BUTTON,
          ColumnTypes.BUTTON,
        ]);
      },
      dependencies: ["primaryColumns", "columnOrder"],
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
      defaultValue: ButtonVariantTypes.PRIMARY,
      isBindProperty: true,
      isTriggerProperty: false,
      validation: {
        type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
        params: {
          type: ValidationTypes.TEXT,
          params: {
            default: ButtonVariantTypes.PRIMARY,
            allowedValues: [
              ButtonVariantTypes.PRIMARY,
              ButtonVariantTypes.SECONDARY,
              ButtonVariantTypes.TERTIARY,
            ],
          },
        },
      },
    },
    {
      propertyName: "menuVariant",
      label: "按钮类型",
      controlType: "ICON_TABS",
      fullWidth: true,
      customJSControl: "TABLE_COMPUTE_VALUE",
      helpText: "Sets the variant of the menu button",
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
      dependencies: ["primaryColumns", "columnOrder"],
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [ColumnTypes.MENU_BUTTON]);
      },
      isBindProperty: true,
      isTriggerProperty: false,
      defaultValue: ButtonVariantTypes.PRIMARY,
      validation: {
        type: ValidationTypes.ARRAY_OF_TYPE_OR_TYPE,
        params: {
          type: ValidationTypes.TEXT,
          params: {
            default: ButtonVariantTypes.PRIMARY,
            allowedValues: [
              ButtonVariantTypes.PRIMARY,
              ButtonVariantTypes.SECONDARY,
              ButtonVariantTypes.TERTIARY,
            ],
          },
        },
      },
    },
    {
      propertyName: "imageSize",
      dependencies: ["primaryColumns", "columnType"],
      label: "图片尺寸",
      helpText: "设置图片尺寸大小",
      defaultValue: "DEFAULT",
      controlType: "ICON_TABS",
      fullWidth: true,
      options: [
        {
          label: "默认",
          value: "DEFAULT",
        },
        {
          label: "适中",
          value: "MEDIUM",
        },
        {
          label: "大",
          value: "LARGE",
        },
      ],
      isBindProperty: false,
      isTriggerProperty: false,
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [ColumnTypes.IMAGE]);
      },
    },
  ],
};
