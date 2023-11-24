import React from "react";
import type { Uppy } from "@uppy/core";
import type { WidgetProps, WidgetState } from "../../BaseWidget";
import BaseWidget from "../../BaseWidget";
import type { WidgetType } from "constants/WidgetConstants";
import FilePickerComponent from "../component";
import { ValidationTypes } from "constants/WidgetValidation";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import type { DerivedPropertiesMap } from "utils/WidgetFactory";
import type Dashboard from "@uppy/dashboard";
import shallowequal from "shallowequal";
import _ from "lodash";
import FileDataTypes from "./FileDataTypes";
import log from "loglevel";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { DefaultAutocompleteDefinitions } from "widgets/WidgetUtils";
import type { AutocompletionDefinitions } from "widgets/constants";
import { importUppy, isUppyLoaded } from "utils/importUppy";
import type { SetterConfig } from "entities/AppTheming";

class FilePickerWidget extends BaseWidget<
  FilePickerWidgetProps,
  FilePickerWidgetState
> {
  constructor(props: FilePickerWidgetProps) {
    super(props);
    this.state = {
      areFilesLoading: false,
      isWaitingForUppyToLoad: false,
    };
  }

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      "!doc":
        "Filepicker widget is used to allow users to upload files from their local machines to any cloud storage via API. Cloudinary and Amazon S3 have simple APIs for cloud storage uploads",
      "!url": "https://docs.appsmith.com/widget-reference/filepicker",
      isVisible: DefaultAutocompleteDefinitions.isVisible,
      files: "[$__file__$]",
      isDisabled: "bool",
    };
  }

  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "label",
            label: "文本",
            controlType: "INPUT_TEXT",
            placeholderText: "输入按钮文本内容",
            inputType: "TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "maxNumFiles",
            label: "最大上传数",
            controlType: "INPUT_TEXT",
            placeholderText: "Enter no. of files",
            inputType: "INTEGER",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.NUMBER },
          },
          {
            propertyName: "maxFileSize",
            helpText: "每个文件的最大尺寸",
            label: "最大文件大小(Mb)",
            controlType: "INPUT_TEXT",
            placeholderText: "文件大小（MB）",
            inputType: "INTEGER",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.NUMBER,
              params: {
                min: 1,
                max: 100,
                default: 5,
                passThroughOnZero: false,
              },
            },
          },
          {
            propertyName: "allowedFileTypes",
            helpText: "限制那些类型的文件可以上传",
            label: "支持文件类型",
            controlType: "DROP_DOWN",
            isMultiSelect: true,
            placeholderText: "选择文件类型",
            options: [
              {
                label: "任意文件",
                value: "*",
              },
              {
                label: "图片",
                value: "image/*",
              },
              {
                label: "视频",
                value: "video/*",
              },
              {
                label: "音频",
                value: "audio/*",
              },
              {
                label: "文本",
                value: "text/*",
              },
              {
                label: "Word文档",
                value: ".doc",
              },
              {
                label: "JPEG",
                value: "image/jpeg",
              },
              {
                label: "PNG",
                value: ".png",
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: {
                allowedValues: [
                  "*",
                  "image/*",
                  "video/*",
                  "audio/*",
                  "text/*",
                  ".doc",
                  "image/jpeg",
                  ".png",
                ],
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
          {
            helpText: "文件数据读取格式",
            propertyName: "fileDataType",
            label: "数据格式",
            controlType: "DROP_DOWN",
            options: [
              {
                label: FileDataTypes.Base64,
                value: FileDataTypes.Base64,
              },
              {
                label: FileDataTypes.Binary,
                value: FileDataTypes.Binary,
              },
              {
                label: FileDataTypes.Text,
                value: FileDataTypes.Text,
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "isRequired",
            label: "必须",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isVisible",
            label: "是否可见",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isDisabled",
            label: "是否禁用",
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
            defaultValue: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "动作",
        children: [
          {
            helpText:
              "当用户选中文件后触发，上传文件到CDN，然后存储文件地址到 filepicker.files",
            propertyName: "onFilesSelected",
            label: "onFilesSelected",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }
  static getDefaultPropertiesMap(): Record<string, string> {
    return {};
  }
  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {
      isValid: `{{ this.isRequired ? this.files.length > 0 : true }}`,
      files: `{{this.selectedFiles.map((file) => { return { ...file, data: this.fileDataType === "Base64" ? file.base64 : this.fileDataType === "Binary" ? file.raw : file.text } })}}`,
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      selectedFiles: [],
      uploadedFileData: {},
    };
  }

  /**
   * Import and initialize the Uppy instance. We use memoize() to ensure that
   * once we initialize the instance, we keep returning it.
   */
  loadAndInitUppyOnce = _.memoize(async () => {
    const { Uppy } = await importUppy();

    const uppyState = {
      id: this.props.widgetId,
      autoProceed: false,
      allowMultipleUploads: true,
      debug: false,
      restrictions: {
        maxFileSize: this.props.maxFileSize
          ? this.props.maxFileSize * 1024 * 1024
          : null,
        maxNumberOfFiles: this.props.maxNumFiles,
        minNumberOfFiles: null,
        allowedFileTypes:
          this.props.allowedFileTypes &&
          (this.props.allowedFileTypes.includes("*") ||
            _.isEmpty(this.props.allowedFileTypes))
            ? null
            : this.props.allowedFileTypes,
      },
    };

    const uppy = Uppy(uppyState);

    await this.initializeUppyEventListeners(uppy);

    return uppy;
  });

  /**
   * set states on the uppy instance with new values
   */
  reinitializeUppy = async (props: FilePickerWidgetProps) => {
    const uppyState = {
      id: props.widgetId,
      autoProceed: false,
      allowMultipleUploads: true,
      debug: false,
      restrictions: {
        maxFileSize: props.maxFileSize ? props.maxFileSize * 1024 * 1024 : null,
        maxNumberOfFiles: props.maxNumFiles,
        minNumberOfFiles: null,
        allowedFileTypes:
          props.allowedFileTypes &&
          (this.props.allowedFileTypes.includes("*") ||
            _.isEmpty(props.allowedFileTypes))
            ? null
            : props.allowedFileTypes,
      },
    };

    const uppy = await this.loadAndInitUppyOnce();
    uppy.setOptions(uppyState);
  };

  /**
   * add all uppy events listeners needed
   */
  initializeUppyEventListeners = async (uppy: Uppy) => {
    const { Dashboard, GoogleDrive, OneDrive, Url, Webcam } =
      await importUppy();

    uppy
      .use(Dashboard, {
        target: "body",
        metaFields: [],
        inline: false,
        width: 750,
        height: 550,
        thumbnailWidth: 280,
        showLinkToFileUploadResult: true,
        showProgressDetails: false,
        hideUploadButton: false,
        hideProgressAfterFinish: false,
        note: null,
        closeAfterFinish: true,
        closeModalOnClickOutside: true,
        disableStatusBar: false,
        disableInformer: false,
        disableThumbnailGenerator: false,
        disablePageScrollWhenModalOpen: true,
        proudlyDisplayPoweredByUppy: false,
        onRequestCloseModal: () => {
          const plugin = uppy.getPlugin("Dashboard") as Dashboard;

          if (plugin) {
            plugin.closeModal();
          }
        },
        locale: {
          strings: {
            closeModal: "Close",
          },
        },
      })
      .use(GoogleDrive, { companionUrl: "https://companion.uppy.io" })
      .use(Url, { companionUrl: "https://companion.uppy.io" })
      .use(OneDrive, {
        companionUrl: "https://companion.uppy.io/",
      });

    if (location.protocol === "https:") {
      uppy.use(Webcam, {
        onBeforeSnapshot: () => Promise.resolve(),
        countdown: false,
        mirror: true,
        facingMode: "user",
        locale: {},
      });
    }

    uppy.on("file-removed", (file: any) => {
      const updatedFiles = this.props.selectedFiles
        ? this.props.selectedFiles.filter((dslFile) => {
            return file.id !== dslFile.id;
          })
        : [];
      this.props.updateWidgetMetaProperty("selectedFiles", updatedFiles);
    });

    uppy.on("files-added", (files: any[]) => {
      const dslFiles = this.props.selectedFiles
        ? [...this.props.selectedFiles]
        : [];
      const fileReaderPromises = files.map((file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.readAsDataURL(file.data);
          reader.onloadend = () => {
            const base64data = reader.result;
            const binaryReader = new FileReader();
            binaryReader.readAsBinaryString(file.data);
            binaryReader.onloadend = () => {
              const rawData = binaryReader.result;
              const textReader = new FileReader();
              textReader.readAsText(file.data);
              textReader.onloadend = () => {
                const text = textReader.result;
                const newFile = {
                  type: file.type,
                  id: file.id,
                  base64: base64data,
                  raw: rawData,
                  text: text,
                  data:
                    this.props.fileDataType === FileDataTypes.Base64
                      ? base64data
                      : this.props.fileDataType === FileDataTypes.Binary
                      ? rawData
                      : text,
                  name: file.meta ? file.meta.name : undefined,
                };

                resolve(newFile);
              };
            };
          };
        });
      });

      Promise.all(fileReaderPromises).then((files) => {
        this.props.updateWidgetMetaProperty(
          "selectedFiles",
          dslFiles.concat(files),
        );
      });
    });

    uppy.on("upload", () => {
      this.onFilesSelected();
    });
  };

  /**
   * this function is called when user selects the files and it do two things:
   * 1. calls the action if any
   * 2. set isLoading prop to true when calling the action
   */
  onFilesSelected = () => {
    if (this.props.onFilesSelected) {
      super.executeAction({
        triggerPropertyName: "onFilesSelected",
        dynamicString: this.props.onFilesSelected,
        event: {
          type: EventType.ON_FILES_SELECTED,
          callback: this.handleActionComplete,
        },
      });

      this.setState({ areFilesLoading: true });
    }
  };

  handleActionComplete = () => {
    this.setState({ areFilesLoading: false });
  };

  async componentDidUpdate(prevProps: FilePickerWidgetProps) {
    if (
      prevProps.selectedFiles &&
      prevProps.selectedFiles.length > 0 &&
      this.props.selectedFiles === undefined
    ) {
      (await this.loadAndInitUppyOnce()).reset();
    } else if (
      !shallowequal(prevProps.allowedFileTypes, this.props.allowedFileTypes) ||
      prevProps.maxNumFiles !== this.props.maxNumFiles ||
      prevProps.maxFileSize !== this.props.maxFileSize
    ) {
      await this.reinitializeUppy(this.props);
    }
  }

  async componentDidMount() {
    try {
      await this.loadAndInitUppyOnce();
    } catch (e) {
      log.debug("Error in initializing uppy");
    }
  }

  componentWillUnmount() {
    this.loadAndInitUppyOnce().then((uppy) => {
      uppy.close();
    });
  }

  static getSetterConfig(): SetterConfig {
    return {
      __setters: {
        setVisibility: {
          path: "isVisible",
          type: "boolean",
        },
        setDisabled: {
          path: "isDisabled",
          type: "boolean",
        },
      },
    };
  }

  getPageView() {
    return (
      <FilePickerComponent
        closeModal={async () => {
          const uppy = await this.loadAndInitUppyOnce();

          const dashboardPlugin = uppy.getPlugin("Dashboard") as Dashboard;
          dashboardPlugin.closeModal();
        }}
        files={this.props.selectedFiles || []}
        isDisabled={this.props.isDisabled}
        isLoading={
          this.props.isLoading ||
          this.state.areFilesLoading ||
          this.state.isWaitingForUppyToLoad
        }
        key={this.props.widgetId}
        label={this.props.label}
        openModal={async () => {
          // If Uppy is still loading, show a spinner to indicate that handling the click
          // will take some time.
          //
          // Copying the `isUppyLoaded` value because `isUppyLoaded` *will* always be true
          // by the time `await this.initUppyInstanceOnce()` resolves.
          const isUppyLoadedByThisPoint = isUppyLoaded;
          if (!isUppyLoadedByThisPoint)
            this.setState({ isWaitingForUppyToLoad: true });
          const uppy = await this.loadAndInitUppyOnce();
          if (!isUppyLoadedByThisPoint)
            this.setState({ isWaitingForUppyToLoad: false });

          const dashboardPlugin = uppy.getPlugin("Dashboard") as Dashboard;
          dashboardPlugin.openModal();
        }}
        widgetId={this.props.widgetId}
      />
    );
  }

  static getWidgetType(): WidgetType {
    return "FILE_PICKER_WIDGET";
  }
}

export interface FilePickerWidgetState extends WidgetState {
  areFilesLoading: boolean;
  isWaitingForUppyToLoad: boolean;
}

export interface FilePickerWidgetProps extends WidgetProps {
  label: string;
  maxNumFiles?: number;
  maxFileSize?: number;
  selectedFiles?: any[];
  allowedFileTypes: string[];
  onFilesSelected?: string;
  fileDataType: FileDataTypes;
  isRequired?: boolean;
}

export default FilePickerWidget;
