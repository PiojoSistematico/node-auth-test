import express from "express";
import { createUser, login } from "./database/db";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  const token = req.cookies.access_token;
  let data = null;
  req.session = { user: null };

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.session = data;
  } catch {}
  next();
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  const { user } = req.session;
  res.status(200).json({ user });
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
    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 1000 * 60 * 60,
      })
      .send({ user: info.userName, token: token });
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
      res.status(400).json({ message: "Unauthorized access" });
    }
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("access_token").json({ message: "Good bye" });
});

app.post("/protected", (req, res) => {
  const token = req.cookies.access_token;
  if (!token) res.status(400).json({ message: "error.message" });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    res.send({ data });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: "Unauthorized access" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
