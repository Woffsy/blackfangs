// random youtube video helped me make this bit

const express = require("express"); //this loads the package called express into the program yay

const app = express(); // this is our server
const PORT = 3000; // number for the funsies

app.use(express.static("."));

app.get("/api/guild", async (req, res) => {
    const response = await fetch("https://api.wynncraft.com/v3/guild/Black%20Fangs");

    const guild = await response.json(); // this makes bro into a js object :O

    res.json(guild); // this gives that js object to the browser
});

// this bit turns the server on
app.listen(PORT, () => {
    console.log("Website do be running at http://localhost:3000");
})