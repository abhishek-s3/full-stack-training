const express = require("express");
const client = require("./client");
const axios = require("axios");
const app = express();

app.get("/", (req, res) => {
  res.send("Performance checking...");
});

// with redis
app.get("/calculate-data-redis", async (req, res) => {
  try {
    let calculatedData = 0;

    // check if the data is already present in the cache
    const cachedData = await client.get("calculatedData");
    if (cachedData) {
      return res.json({ data: cachedData });
    }

    for (let i = 0; i < 10000000000; i++) {
      calculatedData += i;
    }

    // store the data in the cache with a TTL of 3 seconds
    await client.set("calculatedData", calculatedData);
    // with TTL logic
    // await client.set("calculatedData", calculatedData, 'EX', 10);
    const result = await client.get("calculatedData");

    return res.json({ data: result });
  } catch (error) {
    return res.json({ error: error.message });
  }
});


// without redis
app.get("/calculate-data", (req, res) => {
  //complex db call
  try {
    let calculatedData = 0;
    for (let i = 0; i < 10000000000; i++) {
      calculatedData += i;
    }

    return res.json({ data: calculatedData });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

// Normal api call
app.get("/get-posts", async (req, res) => {
  let data = [];
  try {
    const cachedData = await client.get("posts");
    if (cachedData) {
      return res.json({ data: JSON.parse(cachedData) });
    }

    const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
    data = response.data;

    // Save the response in Redis as JSON with a TTL of 3 seconds
    await client.set("posts", JSON.stringify(data), 'EX', 100);

    return res.json({ data });

  } catch (error) {
    return res.json({ error: error.message });
  }
});


app.listen(7009, () => {
  console.log("Server is running on port 7009");
});
