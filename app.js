const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3000;
const models = require("./models");
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, 
  })
);

app.use("/", require("./routes/authRoutes"));

const startServer = async () => {
  try {
    await models.sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Sync all defined models to the DB.
    await models.sequelize.sync();
    console.log("DB Sync complete.");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();


