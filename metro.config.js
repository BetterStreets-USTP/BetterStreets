const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Workaround for node:sea error
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
