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
