require("dotenv").config();

const env = process.env.NODE_ENV || "dev";

const config = {
  dev: {
    APP_PORT: process.env.APP_PORT_DEV || 3000,
    APP_HOST: process.env.APP_HOST_DEV || "localhost",
    APP_NAME: process.env.APP_NAME_DEV || "NodeJSBackendEcomerce",
    APP_ENV: "development",
  },
  prod: {
    APP_PORT: process.env.APP_PORT_PRODUCT || 3000,
    APP_HOST: process.env.APP_HOST_PRODUCT || "serverhost",
    APP_NAME: process.env.APP_NAME_PRODUCT || "NodeJSBackendEcomerce",
    APP_ENV: "production",
  },
};

module.exports = config[env];
