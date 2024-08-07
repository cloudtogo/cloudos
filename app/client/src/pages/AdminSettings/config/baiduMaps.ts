import { BAIDU_MAPS_SETUP_DOC } from "constants/ThirdPartyConstants";
import type { AdminConfigType } from "@appsmith/pages/AdminSettings/config/types";
import {
  CategoryType,
  SettingCategories,
  SettingSubtype,
  SettingTypes,
} from "@appsmith/pages/AdminSettings/config/types";

export const config: AdminConfigType = {
  icon: "map-pin-2-line",
  type: SettingCategories.BAIDU_MAPS,
  controlType: SettingTypes.GROUP,
  categoryType: CategoryType.GENERAL,
  title: "百度地图",
  canSave: true,
  settings: [
    {
      id: "APPSMITH_BAIDU_MAPS_READ_MORE",
      category: SettingCategories.BAIDU_MAPS,
      controlType: SettingTypes.CALLOUT,
      label: "如何配置？",
      url: BAIDU_MAPS_SETUP_DOC,
    },
    {
      id: "APPSMITH_BMAP_AK",
      category: SettingCategories.BAIDU_MAPS,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "百度地图服务密匙（AK）",
    },
  ],
};
