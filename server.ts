import express from "express";
import { createUser, login } from "./database/db";
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const info = await login({ userName, password });
    const token = jwt.sign(
      { id: info.id, userName: info.userName },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.send({ user: info.userName, token: token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
});

app.post("/register", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const id = await createUser({ userName, password });
    console.log(id);
    res.send({ id: id });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
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
