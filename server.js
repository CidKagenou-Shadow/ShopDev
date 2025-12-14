const express = require("express");
const app = express();
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
const router = require("./src/v1/routes/route.js");
const config = require("./src/v1/configs/app.config.js");

//middleware

app.use(express.json());
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(morgan("dev"));

//database
require("./src/v1/databases/connect.databases.js");

//router
app.use("/", router);

app.listen(config.APP_PORT, () => {
  console.log(
    `${config.APP_NAME} running in ${config.APP_ENV} on port ${config.APP_PORT}`,
  );
});
