const express = require("express");
const app = express();
const pastesRouter = require("./pastes/pastes.router");

app.use(express.json());

app.use("/pastes", pastesRouter); // Note: app.use

// Not found handler
app.use((req, res, next) => {
  next(`Not found: ${req.originalUrl}`);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).json({ error: message });
});

module.exports = app;
