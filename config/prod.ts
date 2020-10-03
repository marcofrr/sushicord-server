const config = {
  serverUrl: process.env.SERVER_URL,
  serverPort: process.env.PORT,
  serverDatabase: process.env.SERVER_DB_PROD,
  jwtSecret: process.env.JWT_SECRET,
  inviteDuration: process.env.INVITE_DURATION,
};

export default config;
