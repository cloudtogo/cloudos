import * as React from "react";

import { ValidationTypes } from "constants/WidgetValidation";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import { AutocompleteDataType } from "utils/autocomplete/AutocompleteDataType";
import type { CircularProgressComponentProps } from "../component";
import CircularProgressComponent from "../component";
import type { Stylesheet } from "entities/AppTheming";
import { DefaultAutocompleteDefinitions } from "widgets/WidgetUtils";
import type { AutocompletionDefinitions } from "WidgetProvider/constants";
import { Colors } from "constants/Colors";
import IconSVG from "../icon.svg";
import { WIDGET_TAGS } from "constants/WidgetConstants";

interface CircularProgressWidgetProps
  extends WidgetProps,
    CircularProgressComponentProps {
  borderRadius?: string;
}

class CircularProgressWidget extends BaseWidget<
  CircularProgressWidgetProps,
  WidgetState
> {
  static type = "CIRCULAR_PROGRESS_WIDGET";

  static getConfig() {
    return {
      name: "环形进度条",
      hideCard: true,
      isDeprecated: true,
      replacement: "PROGRESS_WIDGET",
      iconSVG: IconSVG,
      tags: [WIDGET_TAGS.DISPLAY],
      searchTags: ["circular", "progress"],
    };
  }

  static getDefaults() {
    return {
      counterClockWise: false,
      fillColor: Colors.GREEN,
      isVisible: true,
      progress: 65,
      showResult: true,

      rows: 17,
      columns: 16,
      widgetName: "CircularProgress",
      shouldScroll: false,
      shouldTruncate: false,
      version: 1,
      animateLoading: false,
    };
  }

  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "progress",
            helpText: "设置组件进度值",
            label: "进度",
            controlType: "INPUT_TEXT",
            placeholderText: "进度值：",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.NUMBER },
          },
          {
            propertyName: "counterClockwise",
            helpText: "逆时针方向",
            label: "逆时针",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "showResult",
            helpText: "显示进度值",
            label: "显示进度值",
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
        ],
      },
      {
        sectionName: "样式",
        children: [
          {
            propertyName: "fillColor",
            label: "填充颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                regex: /^((?![<|{{]).+){0,1}/,
                expected: {
                  type: "string (HTML 颜色名称，HEX 值)",
                  example: `red | #9C0D38`,
                  autocompleteDataType: AutocompleteDataType.STRING,
                },
              },
            },
          },
        ],
      },
    ];
  }

  static getStylesheetConfig(): Stylesheet {
    return {
      fillColor: "{{appsmith.theme.colors.primaryColor}}",
      borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    };
  }

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      "!doc": "Circular Progress is a simple UI widget used to show progress",
      "!url": "https://docs.appsmith.com/widget-reference/circular-progress",
      isVisible: DefaultAutocompleteDefinitions.isVisible,
      progress: "number",
    };
  }

  getWidgetView() {
    return (
      <CircularProgressComponent
        counterClockwise={this.props.counterClockwise}
        fillColor={this.props.fillColor}
        progress={this.props.progress}
        showResult={this.props.showResult}
      />
    );
  }
}

export default CircularProgressWidget;
