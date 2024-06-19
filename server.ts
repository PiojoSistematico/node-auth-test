import express from "express";
import { createUser } from "./database/db";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/login", (req, res) => {
  res.send("Login");
});

app.post("/register", (req, res) => {
  const { userName, password } = req.body;

  try {
    const id = createUser({ userName, password });
    res.send({ id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

  res.send("Register");
});

app.post("/logout", (req, res) => {
  res.send("Logout");
});

app.post("/protected", (req, res) => {
  res.send("Protected");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
