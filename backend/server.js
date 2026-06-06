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

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ---------------- DB CONNECTION ----------------
mongoose
  .connect("mongodb://127.0.0.1:27017/agiletool")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ---------------- AUTH MIDDLEWARE ----------------
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

// ---------------- AUTH ROUTES ----------------

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      avatar,
      role: "Member",
    });

    await user.save();

    res.status(201).json({ message: "Registration Successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      secretKey,
      { expiresIn: "2d" }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Login Failed" });
  }
});

// ---------------- DASHBOARD ----------------
app.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const workspaces = await Workspace.countDocuments();
    const boards = await Board.countDocuments();
    const users = await User.countDocuments();
    const cards = await Card.countDocuments();

    res.json({ workspaces, boards, users, cards });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- WORKSPACE ROUTES ----------------

// CREATE WORKSPACE
app.post("/workspace/create", authMiddleware, async (req, res) => {
  try {
    const { workspaceName, description } = req.body;

    const workspace = new Workspace({
      name: workspaceName,
      description,
      owner: req.user.id,
      members: [req.user.id],
    });

    await workspace.save();

    res.status(201).json({
      message: "Workspace Created Successfully",
      workspace,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// COUNT
app.get("/workspace/count", authMiddleware, async (req, res) => {
  try {
    const count = await Workspace.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL WORKSPACES
app.get("/workspace/all", authMiddleware, async (req, res) => {
  try {
    const workspaces = await Workspace.find().sort({ createdAt: -1 });
    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// INVITE MEMBER
app.post("/workspace/invite", authMiddleware, async (req, res) => {
  try {
    const { workspaceId, email } = req.body;
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only owner can add members" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const alreadyMember = workspace.members.some(
     member => member.toString() === user._id.toString()
   );

if (alreadyMember) {
  return res.status(400).json({
    message: "Already a member"
  });
}
    workspace.members.push(user._id);
    await workspace.save();
    res.json({ message: "Member added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET WORKSPACE MEMBERS
app.get("/workspace/:id/members", authMiddleware, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id).populate(
      "members",
      "name email"
    );

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.json(workspace.members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- BOARD ROUTES ----------------

// GET BOARDS
app.get("/boards/:workspaceId", authMiddleware, async (req, res) => {
  try {
    const boards = await Board.find({
      workspace: req.params.workspaceId,
    }).sort({ createdAt: 1 });

    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// CREATE BOARD
app.post("/boards", authMiddleware, async (req, res) => {
  try {
    const { title, workspace } = req.body;

    const board = new Board({
      title,
      workspace,
      createdBy: req.user.id, // ✅ real logged-in user
    });

    const saved = await board.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.delete("/boards/:id", authMiddleware, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    // 🔐 SECURITY CHECK (OWNER ONLY)
    if (board.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }
    await Board.findByIdAndDelete(req.params.id);
    res.json({ message: "Board deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/workspace/:id/members", authMiddleware, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate("members", "name email");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.json(workspace.members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- START SERVER ----------------
app.listen(5000, () => {
  console.log("Server running on port 5000");
});