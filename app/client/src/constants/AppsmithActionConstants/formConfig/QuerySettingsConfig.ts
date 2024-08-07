export default [
  {
    sectionName: "",
    id: 1,
    children: [
      {
        label: "页面加载后立即执行查询",
        configProperty: "executeOnLoad",
        controlType: "SWITCH",
        subtitle: "页面每次加载都会执行查询",
      },
      {
        label: "执行前确认",
        configProperty: "confirmBeforeExecute",
        controlType: "SWITCH",
        subtitle: "执行前弹窗提醒用户确认执行",
      },
      {
        label: "超时时间 (毫秒)",
        subtitle: "最多忍受查询多久返回",
        configProperty: "actionConfiguration.timeoutInMillisecond",
        controlType: "INPUT_TEXT",
        dataType: "NUMBER",
      },
    ],
  },
];
