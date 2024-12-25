const client = require('./client');

async function init() {
    await client.set("user:3", "Abhishek")
    const result = await client.get("user:3");
    console.log("Result -> ", result);
}

init();