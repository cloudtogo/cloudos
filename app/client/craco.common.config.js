/* eslint-disable @typescript-eslint/no-var-requires */
const CracoAlias = require("craco-alias");
const CracoLessPlugin = require("craco-less");
const {
  DefinePlugin,
  EnvironmentPlugin
} = require("webpack");
const {
  merge
} = require("webpack-merge");
const CracoBabelLoader = require("craco-babel-loader");
const { removeModuleScopePlugin } = require("customize-cra");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  devServer: {
    open: false,
    client: {
      webSocketURL: {
        hostname: "127.0.0.1",
        pathname: "/ws",
        port: 3000,
        protocol: "ws",
      },
    },
  },
  babel: {
    plugins: ["babel-plugin-lodash"],
  },
  webpack: {
    configure: (webpackConfig) => {
      const config = {
        resolve: {
          alias: {
            "lodash-es": "lodash",
          },
          fallback: {
            assert: false,
            stream: false,
            util: false,
            fs: false,
            os: false,
            path: false,
          },
        },
        module: {
          rules: [{
            test: /\.m?js/,
            resolve: {
              fullySpecified: false,
            },
          }, ],
        },
        optimization: {
          splitChunks: {
            cacheGroups: {
              icons: {
                // This determines which modules are considered icons
                test: (module) => {},
                // This determines which chunk to put the icon into.
                //
                // Why have three separate cache groups for three different kinds of
                // icons? Purely as an optimization: not every page needs all icons,
                // so we can avoid loading unused icons sometimes.
                name: (module) => {},
                // This specifies that only icons from import()ed chunks should be moved
                chunks: "async",
                // This makes webpack ignore the minimum chunk size requirement
                enforce: true,
              },
            },
          },
        },
        ignoreWarnings: [
          function ignoreSourcemapsloaderWarnings(warning) {
            return (
              warning.module &&
              warning.module.resource.includes("node_modules") &&
              warning.details &&
              warning.details.includes("source-map-loader")
            );
          },
        ],
        plugins: [
          // Replace BlueprintJS’s icon component with our own implementation
          // that code-splits icons away
          new webpack.NormalModuleReplacementPlugin(
            /@blueprintjs\/core\/lib\/\w+\/components\/icon\/icon\.\w+/,
            require.resolve(
              "./src/components/designSystems/blueprintjs/icon/index.js",
            ),
          ),
        ],
      };
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({
          constructor
        }) =>
        constructor && constructor.name === "ModuleScopePlugin",
      );
      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      return merge(webpackConfig, config);
    },
    plugins: [
      new DefinePlugin({
        ENABLE_INNER_HTML: true,
        ENABLE_ADJACENT_HTML: true,
        ENABLE_TEMPLATE_CONTENT: true,
        ENABLE_CLONE_NODE: true,
        ENABLE_SIZE_APIS: false,
      }),
      new EnvironmentPlugin({
        TARO_ENV: "h5",
      }),
    ],
  },
  style: {
    postcss: {
      loaderOptions: {
        postcssOptions: {
          ident: "postcss",
          plugins: [
            "tailwindcss",
            "autoprefixer",
            [
              "postcss-pageplug-pxtorem",
              {
                h5Width: 450,
              },
            ],
          ],
        },
      },

    },
  },
  plugins: [{
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        // baseUrl SHOULD be specified
        // plugin does not take it from tsconfig
        baseUrl: "./src",
        // tsConfigPath should point to the file where "baseUrl" and "paths" are specified
        tsConfigPath: "./tsconfig.path.json",
      },
    },
    {
      plugin: CracoBabelLoader,
      options: {
        includes: [path.resolve("packages")],
      },
    },
    {
      plugin: "prismjs",
      options: {
        languages: ["javascript"],
        plugins: [],
        theme: "twilight",
        css: false,
      },
    },
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
    {
      // Prioritize the local src directory over node_modules.
      // This matters for cases where `src/<dirname>` and `node_modules/<dirname>` both exist –
      // e.g., when `<dirname>` is `entities`: https://github.com/appsmithorg/appsmith/pull/20964#discussion_r1124782356
      plugin: {
        overrideWebpackConfig: ({
          webpackConfig
        }) => {
          webpackConfig.resolve.modules = [
            path.resolve(__dirname, "src"),
            ...webpackConfig.resolve.modules,
          ];
          removeModuleScopePlugin()(webpackConfig);
          return webpackConfig;
        },
      },
    },
  ],
  typescript: {
    enableTypeChecking: false,
  },
};
