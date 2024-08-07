import React from "react";

import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { WIDGET_PADDING } from "constants/WidgetConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import { base64ToBlob, createBlobUrl } from "utils/AppsmithUtils";
import type { DerivedPropertiesMap } from "WidgetProvider/factory";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import {
  FileDataTypes,
  DefaultMobileCameraTypes,
} from "WidgetProvider/constants";

import type { SetterConfig, Stylesheet } from "entities/AppTheming";
import CameraComponent from "../component";
import type { CameraMode } from "../constants";
import { CameraModeTypes, MediaCaptureStatusTypes } from "../constants";
import type {
  AnvilConfig,
  AutocompletionDefinitions,
} from "WidgetProvider/constants";
import {
  BACK_CAMERA_LABEL,
  createMessage,
  DEFAULT_CAMERA_LABEL,
  DEFAULT_CAMERA_LABEL_DESCRIPTION,
  FRONT_CAMERA_LABEL,
} from "@appsmith/constants/messages";
import {
  FlexVerticalAlignment,
  ResponsiveBehavior,
} from "layoutSystems/common/utils/constants";
import IconSVG from "../icon.svg";
import { WIDGET_TAGS } from "constants/WidgetConstants";

class CameraWidget extends BaseWidget<CameraWidgetProps, WidgetState> {
  static type = "CAMERA_WIDGET";

  static getConfig() {
    return {
      name: "相机", // The display name which will be made in uppercase and show in the widgets panel ( can have spaces )
      iconSVG: IconSVG,
      tags: [WIDGET_TAGS.FEATRUE],
      needsMeta: true, // Defines if this widget adds any meta properties
      isCanvas: false, // Defines if this widget has a canvas within in which we can drop other widgets
      searchTags: ["photo", "video recorder"],
    };
  }

  static getDefaults() {
    return {
      widgetName: "Camera",
      rows: 33,
      columns: 25,
      mode: CameraModeTypes.CAMERA,
      isDisabled: false,
      isVisible: true,
      isMirrored: true,
      version: 1,
      responsiveBehavior: ResponsiveBehavior.Hug,
      flexVerticalAlignment: FlexVerticalAlignment.Top,
    };
  }

  static getAutoLayoutConfig() {
    return {
      widgetSize: [
        {
          viewportMinWidth: 0,
          configuration: () => {
            return {
              minWidth: "280px",
              minHeight: "300px",
            };
          },
        },
      ],
    };
  }

  static getAnvilConfig(): AnvilConfig | null {
    return {
      widgetSize: {
        maxHeight: {},
        maxWidth: {},
        minHeight: { base: "300px" },
        minWidth: { base: "280px" },
      },
    };
  }

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      "!doc":
        "Camera widget allows users to take a picture or record videos through their system camera using browser permissions.",
      "!url": "https://docs.appsmith.com/widget-reference/camera",
      imageBlobURL: "string",
      imageDataURL: "string",
      imageRawBinary: "string",
      videoBlobURL: "string",
      videoDataURL: "string",
      videoRawBinary: "string",
    };
  }

  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "mode",
            label: "模式",
            controlType: "ICON_TABS",
            defaultValue: "CAMERA",
            fullWidth: true,
            helpText: "选择拍照模式还是录像模式",
            options: [
              {
                label: "拍照",
                value: "CAMERA",
              },
              {
                label: "录像",
                value: "VIDEO",
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: ["CAMERA", "VIDEO"],
              },
            },
          },
          {
            propertyName: "isVisible",
            label: "是否显示",
            helpText: "控制组件的显示/隐藏",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isDisabled",
            label: "禁用",
            controlType: "SWITCH",
            helpText: "让组件不可交互",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isMirrored",
            label: "显示镜像",
            helpText: "是否显示镜像效果",
            controlType: "SWITCH",
            dependencies: ["mode"],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "defaultCamera",
            label: createMessage(DEFAULT_CAMERA_LABEL),
            helpText: createMessage(DEFAULT_CAMERA_LABEL_DESCRIPTION),
            controlType: "DROP_DOWN",
            defaultValue: DefaultMobileCameraTypes.BACK,
            options: [
              {
                label: createMessage(FRONT_CAMERA_LABEL),
                value: DefaultMobileCameraTypes.FRONT,
              },
              {
                label: createMessage(BACK_CAMERA_LABEL),
                value: DefaultMobileCameraTypes.BACK,
              },
            ],
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                allowedValues: [
                  DefaultMobileCameraTypes.FRONT,
                  DefaultMobileCameraTypes.BACK,
                ],
                default: DefaultMobileCameraTypes.BACK,
              },
            },
          },
        ],
      },
      {
        sectionName: "事件",
        children: [
          {
            helpText: "拍照时触发",
            propertyName: "onImageCapture",
            label: "OnImageCapture",
            controlType: "ACTION_SELECTOR",
            hidden: () => true,
            dependencies: ["mode"],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "图片保存时触发",
            propertyName: "onImageSave",
            label: "onImageCapture",
            controlType: "ACTION_SELECTOR",
            hidden: (props: CameraWidgetProps) =>
              props.mode === CameraModeTypes.VIDEO,
            dependencies: ["mode"],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "录像开始时触发",
            propertyName: "onRecordingStart",
            label: "OnRecordingStart",
            controlType: "ACTION_SELECTOR",
            hidden: () => true,
            dependencies: ["mode"],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "录像结束时触发",
            propertyName: "onRecordingStop",
            label: "OnRecordingStop",
            controlType: "ACTION_SELECTOR",
            hidden: () => true,
            dependencies: ["mode"],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "录像保存时触发",
            propertyName: "onVideoSave",
            label: "onVideoSave",
            controlType: "ACTION_SELECTOR",
            hidden: (props: CameraWidgetProps) =>
              props.mode === CameraModeTypes.CAMERA,
            dependencies: ["mode"],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  static getPropertyPaneStyleConfig() {
    return [
      {
        sectionName: "轮廓样式",
        children: [
          {
            propertyName: "borderRadius",
            label: "边框圆角",
            helpText: "边框圆角样式",
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
    ];
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {};
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {};
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      image: null,
      imageBlobURL: undefined,
      imageDataURL: undefined,
      imageRawBinary: undefined,
      mediaCaptureStatus: MediaCaptureStatusTypes.IMAGE_DEFAULT,
      videoBlobURL: undefined,
      videoDataURL: undefined,
      videoRawBinary: undefined,
      isDirty: false,
    };
  }

  static getStylesheetConfig(): Stylesheet {
    return {
      borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
      boxShadow: "none",
    };
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

  getWidgetView() {
    const {
      componentHeight,
      componentWidth,
      defaultCamera,
      isDisabled,
      isMirrored,
      mode,
      videoBlobURL,
    } = this.props;

    const height = componentHeight - WIDGET_PADDING * 2;
    const width = componentWidth - WIDGET_PADDING * 2;

    return (
      <CameraComponent
        borderRadius={this.props.borderRadius}
        boxShadow={this.props.boxShadow}
        defaultCamera={defaultCamera}
        disabled={isDisabled}
        height={height}
        mirrored={isMirrored}
        mode={mode}
        onImageCapture={this.handleImageCapture}
        onImageSave={this.handleImageSave}
        onRecordingStart={this.handleRecordingStart}
        onRecordingStop={this.handleRecordingStop}
        onVideoSave={this.handleVideoSave}
        videoBlobURL={videoBlobURL}
        width={width}
      />
    );
  }

  handleImageCapture = (image?: string | null) => {
    if (!image) {
      URL.revokeObjectURL(this.props.imageBlobURL);

      this.props.updateWidgetMetaProperty("imageBlobURL", undefined);
      this.props.updateWidgetMetaProperty("imageDataURL", undefined);
      this.props.updateWidgetMetaProperty("imageRawBinary", undefined);
      return;
    }
    // Set isDirty to true when an image is captured
    if (!this.props.isDirty) {
      this.props.updateWidgetMetaProperty("isDirty", true);
    }

    const base64Data = image.split(",")[1];
    const imageBlob = base64ToBlob(base64Data, "image/webp");
    const blobURL = URL.createObjectURL(imageBlob);
    const blobIdForBase64 = createBlobUrl(imageBlob, FileDataTypes.Base64);
    const blobIdForRaw = createBlobUrl(imageBlob, FileDataTypes.Binary);

    this.props.updateWidgetMetaProperty("imageBlobURL", blobURL);
    this.props.updateWidgetMetaProperty("imageDataURL", blobIdForBase64, {
      triggerPropertyName: "onImageCapture",
      dynamicString: this.props.onImageCapture,
      event: {
        type: EventType.ON_CAMERA_IMAGE_CAPTURE,
      },
    });
    this.props.updateWidgetMetaProperty("imageRawBinary", blobIdForRaw, {
      triggerPropertyName: "onImageCapture",
      dynamicString: this.props.onImageCapture,
      event: {
        type: EventType.ON_CAMERA_IMAGE_CAPTURE,
      },
    });
  };

  handleImageSave = () => {
    if (this.props.onImageSave) {
      super.executeAction({
        triggerPropertyName: "onImageSave",
        dynamicString: this.props.onImageSave,
        event: {
          type: EventType.ON_CAMERA_IMAGE_SAVE,
        },
      });
    }
  };

  handleRecordingStart = () => {
    if (!this.props.isDirty) {
      this.props.updateWidgetMetaProperty("isDirty", true);
    }

    if (this.props.onRecordingStart) {
      super.executeAction({
        triggerPropertyName: "onRecordingStart",
        dynamicString: this.props.onRecordingStart,
        event: {
          type: EventType.ON_CAMERA_VIDEO_RECORDING_START,
        },
      });
    }
  };

  handleRecordingStop = (video?: Blob | null) => {
    if (!video) {
      if (this.props.videoBlobURL) {
        URL.revokeObjectURL(this.props.videoBlobURL);
      }

      this.props.updateWidgetMetaProperty("videoBlobURL", undefined);
      this.props.updateWidgetMetaProperty("videoDataURL", undefined);
      this.props.updateWidgetMetaProperty("videoRawBinary", undefined);
      return;
    }

    const blobURL = URL.createObjectURL(video);
    const blobIdForBase64 = createBlobUrl(video, FileDataTypes.Base64);
    const blobIdForRaw = createBlobUrl(video, FileDataTypes.Binary);

    this.props.updateWidgetMetaProperty("videoBlobURL", blobURL);
    this.props.updateWidgetMetaProperty("videoDataURL", blobIdForBase64, {
      triggerPropertyName: "onRecordingStop",
      dynamicString: this.props.onRecordingStop,
      event: {
        type: EventType.ON_CAMERA_VIDEO_RECORDING_STOP,
      },
    });
    this.props.updateWidgetMetaProperty("videoRawBinary", blobIdForRaw, {
      triggerPropertyName: "onRecordingStop",
      dynamicString: this.props.onRecordingStop,
      event: {
        type: EventType.ON_CAMERA_VIDEO_RECORDING_STOP,
      },
    });
  };

  handleVideoSave = () => {
    if (this.props.onVideoSave) {
      super.executeAction({
        triggerPropertyName: "onVideoSave",
        dynamicString: this.props.onVideoSave,
        event: {
          type: EventType.ON_CAMERA_VIDEO_RECORDING_SAVE,
        },
      });
    }
  };
}

export interface CameraWidgetProps extends WidgetProps {
  isDisabled: boolean;
  isMirrored: boolean;
  isVisible: boolean;
  mode: CameraMode;
  onImageCapture?: string;
  onImageSave?: string;
  onRecordingStart?: string;
  onRecordingStop?: string;
  onVideoSave?: string;
  videoBlobURL?: string;
  borderRadius: string;
  boxShadow: string;
  isDirty: boolean;
  defaultCamera: string;
}

export default CameraWidget;
