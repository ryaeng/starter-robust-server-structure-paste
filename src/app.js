const express = require("express");
const app = express();
const pastes = require('./data/pastes-data');
const pastesRouter = require("./pastes/pastes.router");

app.use(express.json());

// TODO: Follow instructions in the checkpoint to implement ths API.
app.use('/pastes/:pasteId', (req, res, next) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));

  if (foundPaste) {
    res.json({ data: foundPaste });
  } else {
    next({
      status: 404,
      message: `Paste id not found: ${pasteId}`
    });
  }
});

app.use("/pastes", pastesRouter); // Note: app.use

// New middleware function to validate the request body
function bodyHasTextProperty(req, res, next) {
  const { data: { text } = {} } = req.body;
  if (text) {
    return next(); // Call `next()` without an error message if the result exists
  }
  next({
    status: 400,
    message: "A 'text' property is required.",
  });
}

let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

app.post(
  '/pastes', 
  bodyHasTextProperty, // Add validation middleware function
  (req, res) => {
    // Route handler no longer has validation code.
    const { data: { name, syntax, exposure, expiration, text, user_id } = {} } = req.body;
    const newPaste = {
      id: ++lastPasteId, // Increment last ID, then assign as the current ID
      name,
      syntax,
      exposure,
      expiration,
      text,
      user_id,
    };
    pastes.push(newPaste);
    res.status(201).json({ data: newPaste });
});

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
