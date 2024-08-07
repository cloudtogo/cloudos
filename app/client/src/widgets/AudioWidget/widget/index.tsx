import Skeleton from "components/utils/Skeleton";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import React, { lazy, Suspense } from "react";
import type ReactPlayer from "react-player";
import { retryPromise } from "utils/AppsmithUtils";
import { AutocompleteDataType } from "utils/autocomplete/AutocompleteDataType";
import type { WidgetProps, WidgetState } from "../../BaseWidget";
import BaseWidget from "../../BaseWidget";
import type {
  AnvilConfig,
  AutocompletionDefinitions,
} from "WidgetProvider/constants";
import { ASSETS_CDN_URL } from "constants/ThirdPartyConstants";
import { getAssetUrl } from "@appsmith/utils/airgapHelpers";
import type { SetterConfig } from "entities/AppTheming";
import { FILL_WIDGET_MIN_WIDTH } from "constants/minWidthConstants";
import { ResponsiveBehavior } from "layoutSystems/common/utils/constants";
import IconSVG from "../icon.svg";
import { WIDGET_TAGS } from "constants/WidgetConstants";

const AudioComponent = lazy(async () =>
  retryPromise(async () => import("../component")),
);

export enum PlayState {
  NOT_STARTED = "NOT_STARTED",
  PAUSED = "PAUSED",
  ENDED = "ENDED",
  PLAYING = "PLAYING",
}

class AudioWidget extends BaseWidget<AudioWidgetProps, WidgetState> {
  static type = "AUDIO_WIDGET";

  static getConfig() {
    return {
      name: "音频",
      iconSVG: IconSVG,
      tags: [WIDGET_TAGS.FEATRUE],
      needsMeta: true,
      searchTags: ["mp3", "sound", "wave", "player"],
    };
  }

  static getDefaults() {
    return {
      rows: 4,
      columns: 28,
      widgetName: "Audio",
      url: getAssetUrl(`${ASSETS_CDN_URL}/widgets/birds_chirping.mp3`),
      autoPlay: false,
      version: 1,
      animateLoading: false,
      responsiveBehavior: ResponsiveBehavior.Fill,
      minWidth: FILL_WIDGET_MIN_WIDTH,
    };
  }

  static getAutoLayoutConfig() {
    return {
      widgetSize: [
        {
          viewportMinWidth: 0,
          configuration: () => {
            return {
              minWidth: "180px",
              minHeight: "40px",
            };
          },
        },
      ],
      disableResizeHandles: {
        vertical: true,
      },
    };
  }

  static getAnvilConfig(): AnvilConfig | null {
    return {
      widgetSize: {
        maxHeight: {},
        maxWidth: {},
        minHeight: { base: "40px" },
        minWidth: { base: "180px" },
      },
    };
  }

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      "!doc":
        "Audio widget can be used for playing a variety of audio formats like MP3, AAC etc.",
      "!url": "https://docs.appsmith.com/widget-reference/audio",
      playState: "number",
      autoPlay: "bool",
    };
  }

  static getSetterConfig(): SetterConfig {
    return {
      __setters: {
        setVisibility: {
          path: "isVisible",
          type: "boolean",
        },
        setURL: {
          path: "url",
          type: "string",
        },
        setPlaying: {
          path: "autoPlay",
          type: "boolean",
          accessor: "playState",
        },
      },
    };
  }

  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "数据",
        children: [
          {
            propertyName: "url",
            label: "URL",
            helpText: "Link to the audio file which should be played",
            controlType: "INPUT_TEXT",
            placeholderText: "请填写 url",
            inputType: "TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                regex:
                  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
                expected: {
                  type: "Audio URL",
                  example: getAssetUrl(
                    `${ASSETS_CDN_URL}/widgets/birds_chirping.mp3`,
                  ),
                  autocompleteDataType: AutocompleteDataType.STRING,
                },
              },
            },
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "autoPlay",
            label: "自动播放",
            helpText: "在组件初始化完成后自动播放音频",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "控制组件的显示/隐藏",
            propertyName: "isVisible",
            label: "是否显示",
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
            defaultValue: false,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "事件",
        children: [
          {
            helpText: "开始播放时触发",
            propertyName: "onPlay",
            label: "onPlay",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "暂停播放时触发",
            propertyName: "onPause",
            label: "onPause",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
          {
            helpText: "播放结束时触发",
            propertyName: "onEnd",
            label: "onEnd",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  private _player = React.createRef<ReactPlayer>();

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      // Property reflecting the state of the widget
      playState: PlayState.NOT_STARTED,
      // Property passed onto the audio player making it a controlled component
      playing: false,
    };
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {
      playing: "autoPlay",
    };
  }

  // TODO: (Rishabh) When we have the new list widget, we need to make the playState as a derived propery.
  // TODO: (Balaji) Can we have dynamic default value that accepts current widget values and determines the default value.
  componentDidUpdate(prevProps: AudioWidgetProps) {
    // When the widget is reset
    if (
      prevProps.playState !== "NOT_STARTED" &&
      this.props.playState === "NOT_STARTED"
    ) {
      this._player.current?.seekTo(0);

      if (this.props.playing) {
        this.props.updateWidgetMetaProperty("playState", PlayState.PLAYING);
      }
    }

    // When autoPlay changes from property pane
    if (prevProps.autoPlay !== this.props.autoPlay) {
      if (this.props.autoPlay) {
        this.props.updateWidgetMetaProperty("playState", PlayState.PLAYING);
      } else {
        this.props.updateWidgetMetaProperty("playState", PlayState.PAUSED);
      }
    }
  }

  getWidgetView() {
    const { onEnd, onPause, onPlay, playing, url } = this.props;
    return (
      <Suspense fallback={<Skeleton />}>
        <AudioComponent
          controls
          onEnded={() => {
            // Stopping the audio from playing when the media is finished playing
            this.props.updateWidgetMetaProperty("playing", false);
            this.props.updateWidgetMetaProperty("playState", PlayState.ENDED, {
              triggerPropertyName: "onEnd",
              dynamicString: onEnd,
              event: {
                type: EventType.ON_AUDIO_END,
              },
            });
          }}
          onPause={() => {
            // TODO: We do not want the pause event for onSeek or onEnd.
            // Don't set playState to paused on onEnded
            if (
              this._player.current &&
              this._player.current.getDuration() ===
                this._player.current.getCurrentTime()
            ) {
              return;
            }
            // Stopping the media when it is playing and pause is hit
            if (this.props.playing) {
              this.props.updateWidgetMetaProperty("playing", false);
              this.props.updateWidgetMetaProperty(
                "playState",
                PlayState.PAUSED,
                {
                  triggerPropertyName: "onPause",
                  dynamicString: onPause,
                  event: {
                    type: EventType.ON_AUDIO_PAUSE,
                  },
                },
              );
            }
          }}
          onPlay={() => {
            // Playing the media when it is stopped / paused and play is hit
            if (!this.props.playing) {
              this.props.updateWidgetMetaProperty("playing", true);
              this.props.updateWidgetMetaProperty(
                "playState",
                PlayState.PLAYING,
                {
                  triggerPropertyName: "onPlay",
                  dynamicString: onPlay,
                  event: {
                    type: EventType.ON_AUDIO_PLAY,
                  },
                },
              );
            }
          }}
          player={this._player}
          playing={playing}
          url={url}
        />
      </Suspense>
    );
  }
}

export interface AudioWidgetProps extends WidgetProps {
  url: string;
  autoPlay: boolean;
  onPause?: string;
  onPlay?: string;
  onEnd?: string;
}

export default AudioWidget;
