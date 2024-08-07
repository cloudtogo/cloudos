import {
  createMessage,
  TABLE_WIDGET_TOTAL_RECORD_TOOLTIP,
} from "@appsmith/constants/messages";
import type { PropertyPaneConfig } from "constants/PropertyControlConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { AutocompleteDataType } from "utils/autocomplete/AutocompleteDataType";
import type { TableWidgetProps } from "widgets/TableWidgetV2/constants";
import { ALLOW_TABLE_WIDGET_SERVER_SIDE_FILTERING } from "../../constants";
import { InlineEditingSaveOptions } from "widgets/TableWidgetV2/constants";
import { composePropertyUpdateHook } from "widgets/WidgetUtils";
import {
  tableDataValidation,
  totalRecordsCountValidation,
  uniqueColumnNameValidation,
  updateColumnOrderHook,
  updateCustomColumnAliasOnLabelChange,
  updateInlineEditingOptionDropdownVisibilityHook,
  updateInlineEditingSaveOptionHook,
} from "../propertyUtils";
import panelConfig from "./PanelConfig";
import Widget from "../index";

export default [
  {
    sectionName: "数据",
    children: [
      {
        helpText: "表格数组数据",
        propertyName: "tableData",
        label: "数据",
        controlType: "ONE_CLICK_BINDING_CONTROL",
        controlConfig: {
          searchableColumn: true,
        },
        placeholderText: '[{ "name": "John" }]',
        inputType: "ARRAY",
        isBindProperty: true,
        isTriggerProperty: false,
        isJSConvertible: true,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: tableDataValidation,
            expected: {
              type: "Array",
              example: `[{ "name": "John" }]`,
              autocompleteDataType: AutocompleteDataType.ARRAY,
            },
          },
        },
        evaluationSubstitutionType: EvaluationSubstitutionType.SMART_SUBSTITUTE,
        shouldSwitchToNormalMode: (
          isDynamic: boolean,
          isToggleDisabled: boolean,
          triggerFlag?: boolean,
        ) => triggerFlag && isDynamic && !isToggleDisabled,
      },
      {
        helpText: "表格数据列定义",
        propertyName: "primaryColumns",
        controlType: "PRIMARY_COLUMNS_V2",
        label: "数据列",
        updateHook: composePropertyUpdateHook([
          updateColumnOrderHook,
          updateInlineEditingOptionDropdownVisibilityHook,
          updateCustomColumnAliasOnLabelChange,
        ]),
        dependencies: [
          "primaryColumns",
          "columnOrder",
          "childStylesheet",
          "inlineEditingSaveOption",
          "textColor",
          "textSize",
          "fontStyle",
          "cellBackground",
          "verticalAlignment",
          "horizontalAlignment",
        ],
        isBindProperty: false,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: uniqueColumnNameValidation,
            expected: {
              type: "唯一列名",
              example: "abc",
              autocompleteDataType: AutocompleteDataType.STRING,
            },
          },
        },
        panelConfig,
      },
      {
        propertyName: "inlineEditingSaveOption",
        helpText: "选择如何保存编辑的单元格数据",
        label: "更新模式",
        controlType: "ICON_TABS",
        defaultValue: InlineEditingSaveOptions.ROW_LEVEL,
        fullWidth: true,
        isBindProperty: true,
        isTriggerProperty: false,
        hidden: (props: TableWidgetProps) => {
          return (
            !props.showInlineEditingOptionDropdown &&
            !Object.values(props.primaryColumns).find(
              (column) => column.isEditable,
            )
          );
        },
        dependencies: [
          "primaryColumns",
          "columnOrder",
          "childStylesheet",
          "showInlineEditingOptionDropdown",
        ],
        options: [
          {
            label: "行更新",
            value: InlineEditingSaveOptions.ROW_LEVEL,
          },
          {
            label: "自定义更新",
            value: InlineEditingSaveOptions.CUSTOM,
          },
        ],
        updateHook: updateInlineEditingSaveOptionHook,
      },
      {
        helpText: "数据主键值唯一，用于表格的 selectedRows 和 triggeredRows",
        propertyName: "primaryColumnId",
        dependencies: ["primaryColumns"],
        label: "主键列",
        controlType: "PRIMARY_COLUMNS_DROPDOWN",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
    ],
  },
  {
    sectionName: "分页配置",
    children: [
      {
        propertyName: "isVisiblePagination",
        helpText: "是否显示分页器",
        label: "显示分页器",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        helpText:
          "在 API 请求参数中绑定页号 Table.pageNo，onPageChange 换页的时候调用 API",
        propertyName: "serverSidePaginationEnabled",
        label: "服务端分页",
        controlType: "SWITCH",
        isBindProperty: false,
        isTriggerProperty: false,
      },
      {
        helpText: createMessage(TABLE_WIDGET_TOTAL_RECORD_TOOLTIP),
        propertyName: "totalRecordsCount",
        label: "总行数",
        controlType: "INPUT_TEXT",
        placeholderText: "配置表格总行数",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: totalRecordsCountValidation,
            expected: {
              type: "Number",
              example: "10",
              autocompleteDataType: AutocompleteDataType.STRING,
            },
          },
        },
        hidden: (props: TableWidgetProps) => !props.serverSidePaginationEnabled,
        dependencies: ["serverSidePaginationEnabled"],
      },
      {
        helpText: "表格换页时触发",
        propertyName: "onPageChange",
        label: "onPageChange",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
        hidden: (props: TableWidgetProps) => !props.serverSidePaginationEnabled,
        dependencies: ["serverSidePaginationEnabled"],
      },
      {
        helpText: "表格页大小改变时触发",
        propertyName: "onPageSizeChange",
        label: "onPageSizeChange",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
        hidden: (props: TableWidgetProps) => !props.serverSidePaginationEnabled,
        dependencies: ["serverSidePaginationEnabled"],
      },
    ],
  },
  {
    sectionName: "搜索过滤",
    children: [
      {
        propertyName: "isVisibleSearch",
        helpText: "是否显示的搜索框",
        label: "允许搜索",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "enableClientSideSearch",
        label: "前端搜索",
        helpText: "仅在加载的数据上搜索所有结果",
        controlType: "SWITCH",
        isBindProperty: false,
        isTriggerProperty: false,
        hidden: (props: TableWidgetProps) => !props.isVisibleSearch,
        dependencies: ["isVisibleSearch"],
      },
      {
        propertyName: "enableServerSideFiltering",
        label: "Server side filtering",
        helpText: "Filters all the results on the server side",
        controlType: "SWITCH",
        isBindProperty: false,
        isTriggerProperty: false,
        defaultValue: false,
        hidden: () =>
          !Widget.getFeatureFlag(ALLOW_TABLE_WIDGET_SERVER_SIDE_FILTERING),
      },
      {
        propertyName: "onTableFilterUpdate",
        label: "onTableFilterUpdate",
        helpText: "when table filter is modified by the user",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
        hidden: (props: TableWidgetProps) => !props.enableServerSideFiltering,
        dependencies: ["enableServerSideFiltering"],
      },
      {
        propertyName: "defaultSearchText",
        label: "默认搜索内容",
        helpText: "添加一个默认搜索关键字",
        controlType: "INPUT_TEXT",
        placeholderText: "{{global.user.name}}",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
        hidden: (props: TableWidgetProps) => !props.isVisibleSearch,
        dependencies: ["isVisibleSearch"],
      },
      {
        propertyName: "onSearchTextChanged",
        label: "onSearchTextChanged",
        helpText: "修改搜索关键字时触发",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
        hidden: (props: TableWidgetProps) => !props.isVisibleSearch,
        dependencies: ["isVisibleSearch"],
      },
      {
        propertyName: "isVisibleFilters",
        helpText: "是否显示过滤器",
        label: "支持过滤",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
    ],
  },
  {
    sectionName: "勾选行配置",
    children: [
      {
        helpText: "默认选中行的序号数组",
        propertyName: "defaultSelectedRowIndices",
        label: "默认选中多行",
        controlType: "INPUT_TEXT",
        placeholderText: "[0]",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.ARRAY,
          params: {
            children: {
              type: ValidationTypes.NUMBER,
              params: {
                min: -1,
                default: -1,
              },
            },
          },
        },
        hidden: (props: TableWidgetProps) => {
          return !props.multiRowSelection;
        },
        dependencies: ["multiRowSelection"],
      },
      {
        helpText: "默认选中行的序号",
        propertyName: "defaultSelectedRowIndex",
        label: "默认选中行",
        controlType: "INPUT_TEXT",
        defaultValue: 0,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.NUMBER,
          params: {
            min: -1,
            default: -1,
          },
        },
        hidden: (props: TableWidgetProps) => {
          return props.multiRowSelection;
        },
        dependencies: ["multiRowSelection"],
      },
      {
        propertyName: "multiRowSelection",
        label: "支持多选",
        helpText: "允许用户多选",
        controlType: "SWITCH",
        isBindProperty: false,
        isTriggerProperty: false,
      },
      {
        helpText: "选中行时触发",
        propertyName: "onRowSelected",
        label: "onRowSelected",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
    ],
  },
  {
    sectionName: "排序",
    children: [
      {
        helpText: "是否支持按列排序",
        propertyName: "isSortable",
        isJSConvertible: true,
        label: "列排序",
        controlType: "SWITCH",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.BOOLEAN,
          params: {
            default: true,
          },
        },
      },
      {
        helpText: "表格列排序时触发",
        propertyName: "onSort",
        label: "onSort",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
        hidden: (props: TableWidgetProps) => !props.isSortable,
        dependencies: ["isSortable"],
      },
    ],
  },
  {
    sectionName: "新增行数据",
    children: [
      {
        propertyName: "allowAddNewRow",
        helpText: "显示新增一行按钮",
        isJSConvertible: true,
        label: "允许新增一行",
        controlType: "SWITCH",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.BOOLEAN,
        },
      },
      {
        propertyName: "onAddNewRowSave",
        helpText: "点击新增行保存按钮时触发",
        label: "onSave",
        controlType: "ACTION_SELECTOR",
        hidden: (props: TableWidgetProps) => {
          return !props.allowAddNewRow;
        },
        dependencies: ["allowAddNewRow", "primaryColumns"],
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
        additionalAutoComplete: (props: TableWidgetProps) => {
          const newRow: Record<string, unknown> = {};

          if (props.primaryColumns) {
            Object.values(props.primaryColumns)
              .filter((column) => !column.isDerived)
              .forEach((column) => {
                newRow[column.alias] = "";
              });
          }

          return {
            newRow,
          };
        },
      },
      {
        propertyName: "onAddNewRowDiscard",
        helpText: "点击新增行丢弃按钮时触发",
        label: "onDiscard",
        controlType: "ACTION_SELECTOR",
        hidden: (props: TableWidgetProps) => {
          return !props.allowAddNewRow;
        },
        dependencies: ["allowAddNewRow"],
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
      {
        propertyName: "defaultNewRow",
        helpText: "默认新增行数据",
        label: "默认行数据",
        controlType: "INPUT_TEXT",
        dependencies: ["allowAddNewRow"],
        hidden: (props: TableWidgetProps) => {
          return !props.allowAddNewRow;
        },
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.OBJECT,
          params: {
            default: {},
          },
        },
      },
    ],
  },
  {
    sectionName: "属性",
    children: [
      {
        helpText: "控制组件的显示/隐藏",
        propertyName: "isVisible",
        isJSConvertible: true,
        label: "是否显示",
        controlType: "SWITCH",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.BOOLEAN,
        },
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
        propertyName: "isVisibleDownload",
        helpText: "是否显示下载按钮",
        label: "支持下载",
        controlType: "SWITCH",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "canFreezeColumn",
        helpText: "是否允许用户将表格列固定在表格的一侧",
        label: "允许固定列",
        controlType: "SWITCH",
        defaultValue: true,
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
      {
        propertyName: "delimiter",
        label: "CSV 分隔符",
        controlType: "INPUT_TEXT",
        placeholderText: "输入 CSV 分隔符",
        helpText: "用于分隔 CSV 下载文件的字符",
        isBindProperty: true,
        isTriggerProperty: false,
        defaultValue: ",",
        validation: {
          type: ValidationTypes.TEXT,
        },
        hidden: (props: TableWidgetProps) => !props.isVisibleDownload,
        dependencies: ["isVisibleDownload"],
      },
    ],
  },
] as PropertyPaneConfig[];
