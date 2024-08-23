const express = require("express");
const mongoose = require("mongoose");
const { engine } = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const methodOverride = require("method-override");
const config = require("./config");
const moment = require("moment");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(cookieParser());

// DB Connection
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Handlebars
app.engine(
  "handlebars",
  engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: {
      formatDate: function (date) {
        return moment(date).format("MMMM Do YYYY, h:mm:ss A");
      },
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// Authentication Middleware
app.use((req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      res.locals.username = decoded.username;
    } catch (err) {
      console.log("Invalid token or no username found");
    }
  }
  next();
});

const expenseRoutes = require("./routes/expenses-route");
const authRoutes = require("./routes/auth-route");

app.use("/expenses", expenseRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.redirect("/expenses");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
