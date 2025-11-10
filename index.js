import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateHelper, extractYoutubeTags, generateKGR } from './helper.js';

const app = express();

dotenv.config();
app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 5000;

// Default Route
app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
});

// AI Generation Route : Generate Title, Description, Tags etc.
app.get("/api/generate", async (req, res) => {
    const { prompt } = req.query;
    if (!prompt) {
        return res.status(400).json("message : A parameter prompt missing for generate title, desctription, tags etc., useage: /api/generate?prompt=How To Make Money On Online");
    }
    try {
        const response = await generateHelper(prompt);
        res.status(200).json({ response });
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).send("Error generating content");
    }
});

// Tags Extract Route : Extract Tags from Content
app.get("/api/tags-extract", async (req, res) => {
    const { videoId } = req.query;
    if (!videoId) {
        return res.status(400).send("Video ID is required");
    }
    try {
        const tags = await extractYoutubeTags(videoId);
        res.status(200).json({ tags });
    } catch (error) {
        console.error("Error extracting tags:", error);
        res.status(500).send("Error extracting tags");
    }
});

// KGR Ratio For Tags Route : Generate Most Valueable Tags For YouTube Videos
app.get("/api/kgr-ratio", async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) {
        return res.status(400).send("Keyword topic are required");
    }
    try {
        const kgr = await generateKGR(keyword);
        res.status(200).json({ kgr });
    } catch (error) {
        console.error("Error generating KGR:", error);
        res.status(500).send("Error generating KGR");
    }
});

// Running The Server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
