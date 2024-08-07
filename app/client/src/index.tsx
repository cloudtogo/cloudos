// This file must be executed as early as possible to ensure the preloads are triggered ASAP
import "./preload-route-chunks";

import React from "react";
import "./wdyr";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import { ThemeProvider } from "styled-components";
import { taroifyTheme } from "constants/DefaultTheme";
import { appInitializer } from "utils/AppUtils";
import store, { runSagaMiddleware } from "./store";
import { LayersContext, Layers } from "constants/Layers";
import AppRouter from "@appsmith/AppRouter";
import * as Sentry from "@sentry/react";
import { getCurrentThemeDetails } from "selectors/themeSelectors";
import { connect } from "react-redux";
import type { AppState } from "@appsmith/reducers";
import { Toast } from "design-system";
import "./assets/styles/index.css";
import "./index.less";
import "design-system-old/build/css/design-system-old.css";
import "./polyfills";
import GlobalStyles from "globalStyles";
// locale
import { ConfigProvider } from "antd";
import zhCNantd from "antd/locale/zh_CN";
import zhCN from "locales/zh-CN";
import { IntlProvider } from "react-intl";
import "moment/locale/zh-cn";
import "dayjs/locale/zh-cn";
import { StyleProvider } from "@ant-design/cssinjs";
// enable autofreeze only in development
import { setAutoFreeze } from "immer";
import AppErrorBoundary from "./AppErrorBoundry";
// taro-components polyfills
import { ConfigProvider as TaroifyTheme } from "@taroify/core";
import {
  applyPolyfills,
  defineCustomElements,
} from "@tarojs/components/loader";
import "@tarojs/components/dist/taro-components/taro-components.css";
import "./taroifyStyles";
applyPolyfills().then(() => {
  defineCustomElements(window);
});
// // create taro runtime in React
import { createReactApp } from "@tarojs/runtime";
class Empty extends React.Component {
  render() {
    return null;
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const inst = createReactApp(Empty, React, ReactDOM, {});
// add touch emulator
// import "@vant/touch-emulator";
import "react-sortable-tree-patch-react-17/style.css";
import log from "loglevel";
import { getAppsmithConfigs } from "@appsmith/configs";

const shouldAutoFreeze = process.env.NODE_ENV === "development";
const { newRelic } = getAppsmithConfigs();

setAutoFreeze(shouldAutoFreeze);
runSagaMiddleware();

appInitializer();
const { enableNewRelic } = newRelic;
enableNewRelic &&
  (async () => {
    try {
      await import(
        /* webpackChunkName: "otlpTelemetry" */ "./auto-otel-web.js"
      );
    } catch (e) {
      log.error("Error loading telemetry script", e);
    }
  })();

function App() {
  return (
    <Sentry.ErrorBoundary fallback={"报错了:<"}>
      <Provider store={store}>
        <LayersContext.Provider value={Layers}>
          <ThemedAppWithProps />
        </LayersContext.Provider>
      </Provider>
    </Sentry.ErrorBoundary>
  );
}

class ThemedApp extends React.Component<{
  currentTheme: any;
}> {
  render() {
    return (
      <ThemeProvider theme={this.props.currentTheme}>
        <Toast />
        <GlobalStyles />
        <AppErrorBoundary>
          <IntlProvider locale="zh-CN" messages={zhCN}>
            <StyleProvider hashPriority="high">
              <ConfigProvider
                locale={zhCNantd}
                theme={{
                  token: {
                    colorPrimary: "#27b7b7",
                  },
                  components: {
                    Menu: {
                      darkItemColor: "rgba(0, 0, 0, 0.8)",
                      darkItemHoverColor: "rgba(0, 0, 0, 0.8)",
                      darkItemSelectedColor: "#fff",
                      darkItemSelectedBg: "rgba(0, 0, 0, 0.09)",
                      darkSubMenuItemBg: "transparent",
                    },
                  },
                }}
              >
                <TaroifyTheme theme={taroifyTheme}>
                  <AppRouter />
                </TaroifyTheme>
              </ConfigProvider>
            </StyleProvider>
          </IntlProvider>
        </AppErrorBoundary>
      </ThemeProvider>
    );
  }
}
const mapStateToProps = (state: AppState) => ({
  currentTheme: getCurrentThemeDetails(state),
});

const ThemedAppWithProps = connect(mapStateToProps)(ThemedApp);

ReactDOM.render(<App />, document.getElementById("root"));

// expose store when run in Cypress
if ((window as any).Cypress) {
  (window as any).store = store;
}
