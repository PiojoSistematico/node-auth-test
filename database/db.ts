const dbLocal = require("db-local");
import crypto from "crypto";
const bcrypt = require("bcrypt");

const { Schema } = new dbLocal({ path: "./database" });

const User = Schema("User", {
  _id: { type: String, required: true },
  userName: { type: String, default: "Customer" },
  password: { type: String, default: "Customer" },
});

export async function createUser({
  userName,
  password,
}: {
  userName: string;
  password: string;
}): Promise<string> {
  /* Simple validations */
  if (typeof userName !== "string")
    throw new Error("userName must be a string");
  if (userName.length < 3)
    throw new Error("userName must be at least three characters long");
  if (typeof password !== "string")
    throw new Error("password must be a string");
  if (password.length < 6)
    throw new Error("password must be at least six characters long");

  /* Check unique id */
  const user = User.findOne({ userName: userName }); // Object
  if (user) throw new Error("userName already exists");
  const id = crypto.randomUUID();

  const hashedPassword = await bcrypt.hash(password, 10);

  /* Create and save the new user */
  User.create({ _id: id, userName: userName, password: hashedPassword }).save();

  return id;
}

export async function login({
  userName,
  password,
}: {
  userName: string;
  password: string;
}) {
  const user = User.findOne({ userName: userName }); // Object
  if (!user) throw new Error("userName does not exist");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("wrong password");

  return { id: user._id, userName: userName };
}

/* 
const user = User.create({
    _id: 1,
    username: "Lennart",
    tag: "Lennart#123",
    bag: { weapons: ["bow", "katana"] }
  }).save();
  
  User.find(user => user.bag.weapons.length >= 2); // Array(1)
  User.find({ _id: 1 }); // Array(1)
  User.find(1); // Array(1)
  
  // Ways to get only one document
  
  User.findOne(1); // Object
  User.findOne({ _id: 1, $limit 1 }); // Object
  
  user.update({ username: "Roger" });
  user.username = "Roger"; // same as above
  
  user.save(); // Always run the "save" function after creating or editing a user
  
  user.remove();
  User.remove(user => user.bag.weapons.length >= 2);
  User.remove({ _id: 1 });
  User.remove(1); */
