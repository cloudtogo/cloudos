import type { AdminConfigType } from "@appsmith/pages/AdminSettings/config/types";
import {
  CategoryType,
  SettingCategories,
  SettingSubtype,
  SettingTypes,
} from "@appsmith/pages/AdminSettings/config/types";

export const config: AdminConfigType = {
  icon: "settings-line",
  type: SettingCategories.ADVANCED,
  categoryType: CategoryType.GENERAL,
  controlType: SettingTypes.GROUP,
  title: "高级配置",
  canSave: true,
  settings: [
    {
      id: "APPSMITH_MONGODB_URI",
      category: SettingCategories.ADVANCED,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "MongoDB URI",
      subText:
        "PagePlug 内部使用的 MongoDB，你可以修改为外部 MongoDB 来满足集群化需求",
    },
    {
      id: "APPSMITH_REDIS_URL",
      category: SettingCategories.ADVANCED,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "Redis URL",
      subText:
        "PagePlug 内部使用 Redis 来存储 session，你可以修改为外部 Redis 来满足集群化需求",
    },
    {
      id: "APPSMITH_CUSTOM_DOMAIN",
      category: SettingCategories.ADVANCED,
      controlType: SettingTypes.TEXTINPUT,
      controlSubType: SettingSubtype.TEXT,
      label: "自定义域名",
      subText: "为你的 PagePlug 实例自定义域名",
    },
  ],
};
