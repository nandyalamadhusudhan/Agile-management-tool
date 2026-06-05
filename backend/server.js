const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Workspace = require("./models/workspace");
const Board = require("./models/board");
const Card = require("./models/card");
const app = express();
const secretKey = "venkatalakshmi1";
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/agiletool")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// JWT Authentication Middleware
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Invalid token format",
      });
    }
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or Expired Token",
    });
  }
};

app.post("/register", async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = new User({
      name,
      email,
      password: hashedPassword,
      avatar,
      role: "Member"
    });

    await user.save();

    res.status(201).json({
      message: "Registration Successful"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    };

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(
      payload,
      secretKey,
      { expiresIn: "2d" }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Login Failed",
    });
  }
});
app.get("/dashboard", authMiddleware, async (req, res) => {
  try {

    const workspaces =
      await Workspace.countDocuments();

    const boards =
      await Board.countDocuments();

    const users =
      await User.countDocuments();

    const cards =
      await Card.countDocuments();

    res.status(200).json({
      workspaces,
      boards,
      users,
      cards
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});
app.post("/workspace/create", authMiddleware, async (req, res) => {
  try {
    const { workspaceName, description } = req.body;

    const workspace = new Workspace({
      name: workspaceName,
      description,
      owner: req.user.id,
      members: [req.user.id]
    });

    await workspace.save();

    res.status(201).json({
      message: "Workspace Created Successfully",
      workspace
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message
    });
  }
});
app.get("/workspace/count", authMiddleware, async (req, res) => {
  try {
    const count = await Workspace.countDocuments();

    res.status(200).json({
      count,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
app.get("/workspace/all", authMiddleware, async (req, res) => {
  try {
    const workspaces = await Workspace.find()
      .sort({ createdAt: -1 });

    res.status(200).json(workspaces);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
app.post("/workspace/invite", authMiddleware, async (req, res) => {
  try {
    const { workspaceId, email } = req.body;
    if (!workspaceId || !email) {
      return res.status(400).json({
        message: "Workspace ID and Email are required",
      });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // OPTIONAL: only owner can add members
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only workspace owner can add members",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (workspace.members.includes(user._id)) {
      return res.status(400).json({
        message: "User already a member",
      });
    }

    workspace.members.push(user._id);
    await workspace.save();

    res.status(200).json({
      message: "Member added successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});
// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});