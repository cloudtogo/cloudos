import InputTextControl, {
  InputControlProps,
} from "components/propertyControls/InputTextControl";
import DropDownControl, {
  DropDownControlProps,
} from "components/propertyControls/DropDownControl";
import SwitchControl, {
  SwitchControlProps,
} from "components/propertyControls/SwitchControl";
import OptionControl from "components/propertyControls/OptionControl";
import BaseControl, {
  ControlProps,
} from "components/propertyControls/BaseControl";
import CodeEditorControl from "components/propertyControls/CodeEditorControl";
import MultiSelectControl, {
  MultiSelectControlProps,
} from "components/propertyControls/MultiSelectControl";
import DatePickerControl, {
  DatePickerControlProps,
} from "components/propertyControls/DatePickerControl";
import ChartDataControl from "components/propertyControls/ChartDataControl";
import LocationSearchControl from "components/propertyControls/LocationSearchControl";
import StepControl, {
  StepControlProps,
} from "components/propertyControls/StepControl";
import TabControl from "components/propertyControls/TabControl";
import ActionSelectorControl from "components/propertyControls/ActionSelectorControl";
import ColumnActionSelectorControl from "components/propertyControls/ColumnActionSelectorControl";
import PrimaryColumnsControl from "components/propertyControls/PrimaryColumnsControl";
import PrimaryColumnDropdownControl, {
  PrimaryColumnDropdownControlProps,
} from "components/propertyControls/PrimaryColumnDropdownControl";
import ColorPickerControl, {
  ColorPickerControlProps,
} from "components/propertyControls/ColorPickerControl";
import ComputeTablePropertyControl, {
  ComputeTablePropertyControlProps,
} from "components/propertyControls/ComputeTablePropertyControl";
import IconTabControl, {
  IconTabControlProps,
} from "components/propertyControls/IconTabControl";
import ButtonTabControl, {
  ButtonTabControlProps,
} from "components/propertyControls/ButtonTabControl";
import MultiSwitchControl, {
  MultiSwitchControlProps,
} from "components/propertyControls/MultiSwitchControl";
import MenuItemsControl from "./MenuItemsControl";
import ButtonListControl from "./ButtonListControl";
import IconSelectControl from "./IconSelectControl";
import FormilyControl from "./FormilyControl";
import CellControl from "./taro/CellControl";
import RadioControl from "./RadioControl";
import VantIconSelectControl from "./taro/IconSelectControl";
import ActionControl from "./taro/ActionControl";
import FieldControl from "./taro/FieldControl";
import BoxShadowOptionsControl from "./BoxShadowOptionsControl";
import BorderRadiusOptionsControl from "./BorderRadiusOptionsControl";
import ButtonBorderRadiusOptionsControl from "./ButtonBorderRadiusControl";
import FieldConfigurationControl from "components/propertyControls/FieldConfigurationControl";
import JSONFormComputeControl from "./JSONFormComputeControl";
import ButtonControl from "./ButtonControl";

export const PropertyControls = {
  InputTextControl,
  DropDownControl,
  SwitchControl,
  OptionControl,
  CodeEditorControl,
  MultiSelectControl,
  DatePickerControl,
  ActionSelectorControl,
  ColumnActionSelectorControl,
  MultiSwitchControl,
  ChartDataControl,
  LocationSearchControl,
  StepControl,
  TabControl,
  ColorPickerControl,
  PrimaryColumnsControl,
  PrimaryColumnDropdownControl,
  IconTabControl,
  ButtonTabControl,
  ComputeTablePropertyControl,
  MenuItemsControl,
  ButtonListControl,
  IconSelectControl,
  FormilyControl,
  CellControl,
  RadioControl,
  VantIconSelectControl,
  ActionControl,
  FieldControl,
  BoxShadowOptionsControl,
  BorderRadiusOptionsControl,
  ButtonBorderRadiusOptionsControl,
  FieldConfigurationControl,
  JSONFormComputeControl,
  ButtonControl,
};

export type PropertyControlPropsType =
  | ControlProps
  | InputControlProps
  | DropDownControlProps
  | SwitchControlProps
  | MultiSelectControlProps
  | DatePickerControlProps
  | MultiSwitchControlProps
  | IconTabControlProps
  | ButtonTabControlProps
  | StepControlProps
  | ColorPickerControlProps
  | ComputeTablePropertyControlProps
  | PrimaryColumnDropdownControlProps;

export const getPropertyControlTypes = (): { [key: string]: string } => {
  const _types: { [key: string]: string } = {};
  Object.values(PropertyControls).forEach(
    (Control: typeof BaseControl & { getControlType: () => string }) => {
      const controlType = Control.getControlType();
      _types[controlType] = controlType;
    },
  );
  return _types;
};
