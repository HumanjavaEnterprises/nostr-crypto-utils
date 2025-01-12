const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'production',
    entry: {
        main: './src/index.ts',
        crypto: './src/crypto.ts',
        validation: './src/utils/validation.ts',
        protocol: './src/protocol/index.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist/browser'),
        filename: '[name].nostr-crypto-utils.min.js',
        library: {
            name: ['NostrCryptoUtils', '[name]'],
            type: 'umd',
            export: 'default'
        },
        globalObject: 'this'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.browser.json',
                            transpileOnly: true
                        }
                    }
                ],
                exclude: [/node_modules/, /\.(spec|test)\.tsx?$/, /__tests__/]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.mjs', '.js', '.jsx'],
        modules: ['node_modules', path.resolve(__dirname, 'src')],
        fallback: {
            "crypto": require.resolve('crypto-browserify'),
            "buffer": require.resolve('buffer/'),
            "stream": require.resolve('stream-browserify'),
            "path": require.resolve('path-browserify'),
            "util": require.resolve('util/'),
            "assert": require.resolve('assert'),
            "vm": require.resolve('vm-browserify')
        },
        alias: {
            '@noble/curves': path.resolve(__dirname, 'node_modules/@noble/curves'),
            '@noble/hashes': path.resolve(__dirname, 'node_modules/@noble/hashes'),
            'node:crypto': 'crypto-browserify',
            'crypto': 'crypto-browserify'
        },
        mainFields: ['browser', 'module', 'main']
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 50000,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
            crypto: ['crypto-browserify', 'default']
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'global.crypto': JSON.stringify({}),
            'window.crypto': JSON.stringify({})
        }),
        new webpack.NormalModuleReplacementPlugin(
            /node:crypto/,
            require.resolve('crypto-browserify')
        ),
        new webpack.NormalModuleReplacementPlugin(
            /\.js$/,
            resource => {
                if (resource.request.includes('src/')) {
                    resource.request = resource.request.replace(/\.js$/, '');
                }
            }
        )
    ]
};
