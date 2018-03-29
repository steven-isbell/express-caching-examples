const express = require("express");
const NodeCache = require("node-cache");
const axios = require("axios");

const port = 3002;

const app = express();

// because this is stored in node memory,
// if the server goes down, our cache is dumped
const cache = new NodeCache({ stdTTL: 120 });

app.get("/api/people", (req, res) => {
  cache.get("people", (err, result) => {
    if (err) return res.status(500).json(err);
    if (result) {
      res.status(200).json({ people: result, source: "NodeCache" });
    } else {
      axios
        .get("https://swapi.co/api/people")
        .then(response => {
          cache.set("people", response.data.results, (error, success) => {
            if (success) {
              res.status(200).json({
                people: response.data.results,
                source: "Swapi"
              });
            }
          });
        })
        .catch(err => res.status(500).json(err));
    }
  });
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
