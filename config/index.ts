const env = process.env.NODE_ENV || 'dev';

type Config = {
  serverUrl: string;
  serverPort: number;
  serverDatabase: string;
  jwtSecret: string;
  inviteDuration: string;
};

const config: Config = require(`./${env}`).default;

export default config;
