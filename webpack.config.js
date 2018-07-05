const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const resources = path.resolve(__dirname, 'resources');
const src = path.resolve(__dirname, 'src');

const polyfills = [
  'whatwg-fetch',
  'babel-polyfill',
];

module.exports = function(env, argv) {
  const isProduction = argv.mode === 'production';
  const isStartedLocally = process.argv[1].indexOf('webpack-dev-server') > -1;
  const dist = path.resolve(__dirname, 'dist-' + env.tool);

  return {
    entry: isStartedLocally
      ? {
        'local-test-preparation': `./resources/webpack-dev-server/${env.tool}`,
        'feedback-tool': [...polyfills, './src/scripts/index']
      }
      : {
        'feedback-tool': [...polyfills, './src/scripts/index']
      },
    output: {
      filename: '[name].js',
      path: dist,
      publicPath: '/'
    },
    mode: argv.mode || 'production',
    devtool: isProduction ? false : 'eval-source-map',
    plugins: [
      isStartedLocally ? null : new CleanWebpackPlugin([dist]),
      isStartedLocally ? new webpack.HotModuleReplacementPlugin() : null,
      new webpack.DefinePlugin({
        // 'process.env.NODE_ENV': JSON.stringify(argv.mode), will be set by Webpack mode option
        'process.env.NODE_TOOL': JSON.stringify(env.tool),
        'process.env.NODE_IS_STARTED_LOCALLY': JSON.stringify(isStartedLocally),
        'process.env.NODE_IS_MOCK_API_SERVER': !!env.mockAPIServer
      }),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.p?css$/,
          include: [resources, src],
          use: [
            {
              loader: 'style-loader'
            }, {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: !isProduction,
                localIdentName: '[name]__[local]--[hash:base64:5]' //must be the same as for react-css-modules
              }
            }, {
              loader: 'postcss-loader'
            }
          ]
        },
        {
          test: /\.html$/,
          include: path.resolve(resources, 'webpack-dev-server'),
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]'
              }
            }
          ]
        },
        {
          test: /\.js$/,
          include: [resources, src],
          use: 'babel-loader'
        }
      ]
    },

    devServer: {
      contentBase: dist,
      port: 9092
    }
  };
};
