module.exports = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Important: return the modified config
    config.optimization.minimize = false;
    config.module.exprContextCritical = false;
    return config
  },
}
