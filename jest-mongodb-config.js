module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.0.7', // todo - upgrade version to current mongodb version
      skipMD5: true,
    },
    autoStart: false,
    instance: {},
  },
};
