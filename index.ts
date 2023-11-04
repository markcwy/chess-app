import express from "express";
import morgan from "morgan";
import { engine } from "express-handlebars";
import { v4 as uuidv4 } from "uuid";
import { EventSource } from "express-ts-sse";

const port = process.env.PORT || 3000;

const app = express();

const sse = new EventSource();

// Configure render
app.engine("html", engine({ defaultLayout: false }));
app.set("view engine", "html");

// Log incoming requests
app.use(morgan("combined"));

// POST /chess
app.post("/chess", express.urlencoded({ extended: true }), (req, resp) => {
  const gameId = uuidv4().substring(0, 8);
  const orientation = "white";

  resp.status(200).render("chess", { gameId, orientation });
});

// GET /chess
app.get("/chess", (req, resp) => {
  const gameId = req.query.gameId;
  const orientation = "black";
  resp.status(200).render("chess", { gameId, orientation });
});

app.patch("/chess/:gameId", express.json(), (req, res) => {
  const gameId = req.params.gameId;
  const move = req.body;

  console.log(`Game ID: ${gameId}, Move: ${move}`);
  // Usually JSON data should be stringified first,
  // but this library stringifies it for you.
  sse.send({ event: gameId, data: move });

  res.status(201).json({ timestamp: new Date().getTime() });
});

app.get("/chess/stream", sse.init);

// Serve files from static
app.use(express.static(__dirname + "/static"));

app.listen(port, () => {
  console.info(`Application bound to port ${port}.`);
});
