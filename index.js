const express = require("express");
const axios = require("axios");
const redis = require("redis");

const port = 3001;

const app = express();

const client = redis.createClient();

client.on("error", err => console.log("Error in Connection: ", err));

app.get("/api/people", (req, res) => {
  client.get("people", (err, result) => {
    if (result) {
      res.status(200).json({ people: JSON.parse(result), source: "Redis" });
    } else {
      axios
        .get("https://swapi.co/api/people")
        .then(response => {
          client.setex("people", 120, JSON.stringify(response.data.results));
          res.status(200).json({
            people: response.data.results,
            source: "Swapi"
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    }
  });
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
