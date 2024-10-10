require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let users = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = (email, password) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Auto-generated Password",
    text: `Here is your password: ${password}`,
  };

  return transporter.sendMail(mailOptions);
};

const gtoken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

app.post(
  "/api/signup",
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("name").notEmpty().withMessage("Name is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;
    const password = Math.random().toString(36).slice(-8);
    const hashpass = await bcrypt.hash(password, 10);

    users[email] = { name, password: hashpass };

    try {
      await sendEmail(email, password);
      const token = gtoken(email);
      res
        .status(200)
        .json({ message: "User signed up and password sent to email", token });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Error sending email" });
    }
  }
);

app.post(
  "/api/login",
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = users[email];

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = gtoken(email);
      res.status(200).json({ message: "Login successful", token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  }
);

const authToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post(
  "/api/update-password",
  authToken,
  [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const email = req.user.email;

    const user = users[email];
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (await bcrypt.compare(oldPassword, user.password)) {
      user.password = await bcrypt.hash(newPassword, 10);
      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(400).json({ message: "Old password is incorrect" });
    }
  }
);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
