const express = require("express");
const axios = require("axios");

const port = 3003;

const app = express();

// because this is stored in node memory,
// if the server goes down, our cache is dumped
const cache = {};

app.get("/api/people", (req, res) => {
  if (cache.people) {
    res.status(200).json({ people: cache.people, source: "Cache" });
  } else {
    axios
      .get("https://swapi.co/api/people")
      .then(response => {
        cache.people = response.data.results;
        res.status(200).json({
          people: response.data.results,
          source: "Swapi"
        });
      })
      .catch(err => res.status(500).json(err));
  }
});

// Should fire this on initial app load to have clean slate
app.get("/api/clearcache", (req, res) => {
  for (let key in cache) {
    delete cache[key];
  }
  res.status(200).json({ message: "Cache Cleared" });
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
