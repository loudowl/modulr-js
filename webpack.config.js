const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const babel = require('@babel/core');

module.exports = {
  entry: './es6src/app/main.ts',
  output: {
    path: path.resolve(__dirname, 'es6dist'),
    filename: 'main.js',
    library: 'Modulr',
    libraryExport: 'default',
    libraryTarget: 'umd',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'es6dist'),
    },
    compress: true,
    hot: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/, /\.spec\.ts$/, /\.spec\.js$/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
            plugins: ['@babel/plugin-transform-typescript'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'es6src',
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ['**/*.spec.ts', '**/*.spec.js'],
          },
          to({ context, absoluteFilename }) {
            const relativePath = path.relative(context, absoluteFilename);
            const newFilename = relativePath.replace(/\.ts$/, '.js');
            return path.join('', newFilename);
          },
          transform(content, filePath) {
            if (path.extname(filePath) === '.ts') {
              const transpiled = babel.transformSync(content, {
                filename: filePath,
                presets: ['@babel/preset-env', '@babel/preset-typescript'],
                plugins: ['@babel/plugin-transform-typescript'],
              });
              return transpiled.code;
            }
            return content;
          },
        },
      ],
    }),
  ],
  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: false,
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
};
