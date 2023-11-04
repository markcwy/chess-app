import express from "express";
import morgan from "morgan";
import { engine } from "express-handlebars";
import { v4 as uuidv4 } from "uuid";

const port = process.env.PORT || 3000;

const app = express();

app.listen(port, () => {
  console.info(`Application bound to port ${port}.`);
});
