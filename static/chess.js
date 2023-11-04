const body = document.querySelector("body");

const gameId = body.dataset.gameid;
const orientation = body.dataset.orientation;

console.log(`gameId: ${gameId}, orientation: ${orientation}`);

// Handle onDrop
const onDrop = (src, dst, piece) => {
  console.log(`src=${src}, dst=${dst}, piece=${piece}`);

  // Construct the move
  const move = { src, dst, piece };

  // PATCH /chess/:gameId
  fetch(`/chess/${gameId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(move),
  })
    .then((resp) => console.log("RESPONSE: ", resp))
    .catch((err) => console.error("ERROR: ", err));
};

// Create a chess configuration

const config = {
  draggable: true,
  position: "start",
  orientation,
  onDrop,
};

// Create instance of chess game
const chess = Chessboard("chess", config);

// Start SSE session
const sse = new EventSource("/chess/stream");
