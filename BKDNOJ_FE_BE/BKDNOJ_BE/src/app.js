const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const problemsRoutes = require("./routes/problemsRoutes");
app.use("/api/problems", problemsRoutes);

const problemRoutes = require("./routes/problemRoutes");
app.use("/api/problem", problemRoutes);

const contestsRoutes = require("./routes/contestsRoutes");
app.use("/api/contests", contestsRoutes);

const contestRoutes = require("./routes/contestRoutes");
app.use("/api/contest", contestRoutes);

const submissionsRoutes = require("./routes/submissionsRoutes");
app.use("/api/submissions", submissionsRoutes);

module.exports = app;
