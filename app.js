require("dotenv").config();
require("express-async-errors");
const path = require("path");

// security packages
const helmet = require("helmet");
// WE DON'T NEED OTHER APPS TO ACCESS OUR API, BECAUSE WE HAVE OUR OWN FRONTEND
// const cors = require("cors");
const { xss } = require("express-xss-sanitizer");

// WE DON'T USE SWAGGER IN THIS PROJECT BECAUSE WE HAVE FRONTEND
// -----
// const swaggerUI = require("swagger-ui-express");
// const YAML = require("yamljs");
// const swaggerDocument = YAML.load("./swagger.yaml");
// -----

const express = require("express");
const app = express();

// connectDB
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

// routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// error handlers
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// security middlewares

// WE RATE LIMIT ONLY LOGIN AND REGISTER ROUTES AT AUTH ROUTE
// -----
app.set("trust proxy", 1 /* number of proxies between user and server */);
// -----

app.use(express.static(path.resolve(__dirname, "./client/build")));
app.use(express.json());
app.use(helmet());

// WE DON'T NEED OTHER APPS TO ACCESS OUT API, BECAUSE WE HAVE OUR OWN FRONTEND
// -----
// app.use(cors());
// -----

app.use(xss());

// routes

// REMOVE SWAGGER UI ROUTES BECAUSE IN THIS PROJECT WE HAVE AN ACTUAL FRONTEND

// app.get("/api-docs/favicon-*.png", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "favicon.png"));
// });
// const options = {
//   // customFavicon: "/favicon.png",
//   customSiteTitle: "Jobs API Swagger documentation",
//   customCssUrl: "/swagger.css",
// };
// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument, options));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

// error handling middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
