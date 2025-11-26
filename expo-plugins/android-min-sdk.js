const { withGradleProperties } = require('@expo/config-plugins');

const withMinSdk = (config) => {
  return withGradleProperties(config, (config) => {
    config.modResults.push({
      type: 'property',
      key: 'android.minSdkVersion',
      value: '26',
    });
    return config;
  });
};

module.exports = withMinSdk;