import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import profileRoutes from "./routes/profile.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "uploads"))
);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
    res.send("Server is running...");
});

export default app;