const environments = {};

environments.development = {
  envName: 'development',
  httpPort: 3000,
  httpsPort: 3001,
  hashSecret: 'iTiSaSeCrEt'
};

environments.production = {
  envName: 'production',
  httpPort: 5000,
  httpsPort: 5001,
  hashSecret: 'iTiSaLsOaSeCrEt'
};

module.exports =
  (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()) in environments
    ? environments[process.env.NODE_ENV]
    : environments.development;
