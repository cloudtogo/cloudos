import { WidgetCardProps } from "widgets/BaseWidget";
import { generateReactKey } from "utils/generators";
/* eslint-disable no-useless-computed-key */

const WidgetSidebarResponse: {
  [id: string]: WidgetCardProps[];
} = {
  ["Common Widgets"]: [
    {
      type: "CONTAINER_WIDGET",
      widgetCardName: "Container",
      key: generateReactKey(),
    },
    {
      type: "TABLE_WIDGET",
      widgetCardName: "Table",
      key: generateReactKey(),
    },
    {
      type: "INPUT_WIDGET",
      widgetCardName: "Input",
      key: generateReactKey(),
    },
    {
      type: "BUTTON_WIDGET",
      widgetCardName: "Button",
      key: generateReactKey(),
    },
    {
      type: "TEXT_WIDGET",
      widgetCardName: "Text",
      key: generateReactKey(),
    },
  ],
  ["Form Widgets"]: [
    {
      type: "FORM_WIDGET",
      widgetCardName: "Form",
      key: generateReactKey(),
    },
    {
      type: "INPUT_WIDGET",
      widgetCardName: "Input",
      key: generateReactKey(),
    },
    {
      type: "DROP_DOWN_WIDGET",
      widgetCardName: "Dropdown",
      key: generateReactKey(),
    },
    {
      type: "CHECKBOX_WIDGET",
      widgetCardName: "Checkbox",
      key: generateReactKey(),
    },
    {
      type: "RADIO_GROUP_WIDGET",
      widgetCardName: "Radio",
      key: generateReactKey(),
    },
    // {
    //   type: "SWITCH_WIDGET",
    //   icon: "icon-switch",
    //   widgetCardName: "Switch",
    //   key: generateReactKey(),
    // },
    {
      type: "DATE_PICKER_WIDGET",
      widgetCardName: "DatePicker",
      key: generateReactKey(),
    },
    {
      type: "FILE_PICKER_WIDGET",
      widgetCardName: "FilePicker",
      key: generateReactKey(),
    },
    {
      type: "BUTTON_WIDGET",
      widgetCardName: "Button",
      key: generateReactKey(),
    },
  ],
  ["View widgets"]: [
    {
      type: "IMAGE_WIDGET",
      widgetCardName: "Image",
      key: generateReactKey(),
    },
    {
      type: "TEXT_WIDGET",
      widgetCardName: "Text",
      key: generateReactKey(),
    },
    {
      type: "TABLE_WIDGET",
      widgetCardName: "Table",
      key: generateReactKey(),
    },
    {
      type: "CHART_WIDGET",
      widgetCardName: "Chart",
      key: generateReactKey(),
    },
  ],
  ["Layout widgets"]: [
    {
      type: "CONTAINER_WIDGET",
      widgetCardName: "Container",
      key: generateReactKey(),
    },
  ],
};

export default WidgetSidebarResponse;
