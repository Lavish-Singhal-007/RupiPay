const express = require("express");
const cors = require("cors");
const { PORT } = require("./config");

const mainRouter = require("./routes/index");

const app = express();

app.use(cors()); // enable CORS
app.use(express.json()); // body parser

app.use("/api/v1", mainRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
