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

// const submissionRoutes = require("./routes/submissionRoutes");
// app.use("/api/submission", submissionRoutes);

// const userRoutes = require("./routes/userRoutes");
// app.use("/api/user", userRoutes);

module.exports = app;
