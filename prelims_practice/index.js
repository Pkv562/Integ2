const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
const PORT = 5000;

app.use(express.json());

app.get("/api/message", (req, res) => {
    res.json({message: "Hello from the backend!"});
});

app.post("/api/data", (req, res) => {
    const userData = req.body;
    res.json({received: userData});
})

app.listen(PORT, ()=> {console.log(`API is running on http://localhost:${PORT}`)});

