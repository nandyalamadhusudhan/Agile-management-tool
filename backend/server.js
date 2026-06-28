const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const http=require("http");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Workspace = require("./models/workspace");
const Board = require("./models/board");
const Card = require("./models/card");
const Message= require("./models/message");
const app = express();
const server=http.createServer(app);
const { Server }=require("socket.io");
const Invitation = require("./models/inivitation");
require("dotenv").config();
const port = process.env.PORT;
const mongouri=process.env.MONGO_URI;
const secretKey = process.env.JWT_SECRET;
const allowedOrigins = [
  "https://agile-management-tool.vercel.app",
  "https://agile-management-tool.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://realtimecollaborativeworkspace.vercel.app"
];
app.use(cors({
  origin: (origin, cb) => {
    // allow requests with no origin (like mobile apps, curl)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());
mongoose
  .connect(mongouri)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
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
const io = new Server(server, {
  cors: {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("register", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });
  socket.on("joinWorkspace", ({ workspaceId, token }) => {
    try {
      const payload = jwt.verify(token, secretKey);
      socket.username = payload.name;
      socket.join(workspaceId);
      console.log(
        `${socket.username} joined workspace ${workspaceId}`
      );
    } catch (err) {
      console.log(err);
    }
  });
  socket.on(
    "sendMessage",
    async ({ workspaceId, text }) => {
      const message = await Message.create({
        workspaceId,
        sender: socket.username,
        text,
        timestamp: new Date(),
      });

      io.to(workspaceId).emit(
        "receiveMessage",
        message
      );
    }
  );
});
app.get(
  "/workspace/:workspaceId/messages",
  async (req, res) => {
    const messages = await Message.find({
      workspaceId: req.params.workspaceId,
    }).sort({ timestamp: 1 });

    res.json(messages);
  }
);


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
      return res.status(400).json({ message: "User not found,please register" });
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
    // User workspaces
    const userWorkspaces = await Workspace.find({
      members: req.user.id,
    });

    const workspaceIds = userWorkspaces.map(
      (workspace) => workspace._id
    );

    // Boards in user's workspaces
    const boards = await Board.find({
      workspace: { $in: workspaceIds },
    });

    const boardIds = boards.map(
      (board) => board._id
    );

    // Tasks assigned to logged-in user
    const cards = await Card.countDocuments({
  board: { $in: boardIds },
  assignedTo: req.user.id,
});
    // Task status counts
    const pending = await Card.countDocuments({
      board: { $in: boardIds },
      assignedTo: req.user.id,
      listName: "Todo",
    });

    const inProgress = await Card.countDocuments({
      board: { $in: boardIds },
      assignedTo: req.user.id,
      listName: "In Progress",
    });

    const completed = await Card.countDocuments({
      board: { $in: boardIds },
      assignedTo: req.user.id,
      listName: "Completed",
    });

    // Unique team members
    const memberIds = new Set();

    userWorkspaces.forEach((workspace) => {
      workspace.members.forEach((memberId) => {
        memberIds.add(memberId.toString());
      });
    });

    res.json({
      workspaces: userWorkspaces.length,
      boards: boards.length,
      users: memberIds.size,
      cards,
      pending,
      inProgress,
      completed,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
// ---------------- WORKSPACE ROUTES ----------------
// CREATE WORKSPACE
app.post("/workspace/create", authMiddleware, async (req, res) => {
  try {
    const { workspaceName, description } = req.body;
    const newWorkspace = await Workspace.create({
      name:workspaceName,
      description,
      owner: req.user.id,
      members: [req.user.id]
    });

    await Board.create({
      title: "Project Board",
      workspace: newWorkspace._id,
      createdBy: req.user.id
    });
    res.status(201).json({
      message: "Workspace Created Successfully",
      workspace: newWorkspace
    });
    io.to(req.user.id).emit("workspace-created");
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});
app.get("/workspace/count", authMiddleware, async (req, res) => {
  try {
    const count = await Workspace.countDocuments({
    owner: req.user.id
});
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/workspace/all", authMiddleware, async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      members: req.user.id,
    });

    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/workspace/:workspaceId", authMiddleware, async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Validate MongoDB ObjectId format first
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({ message: "Invalid Workspace ID format" });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.json({
      workspace,
      isOwner: workspace.owner.toString() === req.user.id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/workspace/:id", authMiddleware, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }
    if (workspace.owner.toString() !== req.user.id) {
  return res.status(403).json({
    message: "Only owner can delete workspace",
  });
}
// Send notification to all members
    workspace.members.forEach((memberId) => {
      io.to(memberId.toString()).emit(
        "workspace-deleted",
        {
          type: "workspaceDeleted",
          workspaceName: workspace.name,
          message: `${workspace.name} workspace has been deleted`,
        }
      );
    });

    await Workspace.findByIdAndDelete(req.params.id);

    res.json({
      message: "Workspace deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
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
  const invitation = await Invitation.create({
  workspace: workspace._id,
  sender: req.user.id,
  receiver: user._id,
});

io.to(user._id.toString()).emit(
  "workspace-invited",
  {
    _id: invitation._id,
    sender: {
      name: req.user.name,
    },
    workspace: {
      name: workspace.name,
    },
  }
);
return res.status(200).json({
  message: "INVITATION REQUEST SEND WAITING FOR THE RESPONSE",
});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post("/workspace/accept",authMiddleware,async (req, res) => {
    try {
      const { invitationId } = req.body;
      const invitation =
        await Invitation.findById(
          invitationId
        );
      if (!invitation) {
        return res.status(404).json({
          message: "Invitation not found",
        });
      }

      const workspace =
        await Workspace.findById(
          invitation.workspace
        );

      if (!workspace) {
        return res.status(404).json({
          message: "Workspace not found",
        });
      }

      // Add receiver to members
     const exists = workspace.members.some(
  (member) => member.toString() === invitation.receiver.toString()
);

if (!exists) {
  workspace.members.push(invitation.receiver);
}
      await workspace.save();

invitation.status = "Accepted";
await invitation.save();

// Notify all members of this workspace
workspace.members.forEach((memberId) => {
  io.to(memberId.toString()).emit("workspaceJoined", {
    workspaceId: workspace._id,
    workspaceName: workspace.name,
  });
});

res.json({
  message: "Successfully joined workspace and Enjoy the workspace",
});
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: err.message,
      });
    }
  }
);
app.post("/workspace/reject",authMiddleware,async (req, res) => {
    try {
      const { invitationId } = req.body;
      const invitation =
        await Invitation.findById(
          invitationId
        );
      if (!invitation) {
        return res.status(404).json({
          message: "Invitation not found",
        });
      }
      invitation.status = "Rejected";
      await invitation.save();
      res.json({
        message:
          "Invitation rejected",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: err.message,
      });
    }
  }
);
app.get("/workspace/invitations",authMiddleware,async (req, res) => {
    try {
      const invitations =
        await Invitation.find({
          receiver: req.user.id,
          status: "Pending",
        })
          .populate("sender", "name")
          .populate("workspace", "name");
      res.json(invitations);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: err.message,
      });
    }
  }
);
// ---------------- BOARD ROUTES ----------------

// GET BOARDS
app.get("/boards/:workspaceId", authMiddleware, async (req, res) => {
  try {

    const boards = await Board.find({
      workspace: req.params.workspaceId,
    })
      .populate({
        path: "cards",
        populate: {
          path: "assignedTo",
          select: "name email",
        },
      });

    console.log(
      JSON.stringify(
        boards,
        null,
        2
      )
    );

    res.json(boards);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });

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
    if (board.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }
    await Card.deleteMany({
      board: board._id,
    });
    await Board.findByIdAndDelete(board._id);
    res.json({
      message: "Board and all tasks deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
app.post("/cards", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      assignedTo,
      boardId,
      listName,
    } = req.body;

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    const workspace = await Workspace.findById(board.workspace);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // ✅ Only workspace owner can create tasks
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only workspace owner can create tasks",
      });
    }

    const card = await Card.create({
      title,
      description,
      priority,
      assignedTo,
      board: boardId,
      listName,
    });

    await Board.findByIdAndUpdate(boardId, {
      $push: { cards: card._id },
    });

    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
//update tasks by drag and srop
app.put("/cards/:id/move", authMiddleware, async (req, res) => {

    const card = await Card.findById(req.params.id);

    if (!card) {
        return res.status(404).json({
            message: "Card not found"
        });
    }

    if (card.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({
            message: "Only assigned user can move this card"
        });
    }
    card.listName = req.body.listName;
    await card.save();
    res.json(card);
});
app.delete("/cards/:id", authMiddleware, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    await Card.findByIdAndDelete(req.params.id);

    res.json({ message: "Card deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/workspace/:workspaceId/members",authMiddleware,async (req, res) => {
    try {
      const workspace =
        await Workspace.findById(
          req.params.workspaceId
        ).populate("members", "name email");
      if (!workspace) {
        return res.status(404).json({
          message: "Workspace not found",
        });
      }
      res.json(workspace.members);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: err.message,
      });
    }
  }
);
app.delete("/workspace/:workspaceId/members/:memberId",authMiddleware,async (req, res) => {
    try {
      const { workspaceId, memberId } = req.params;
      const workspace = await Workspace.findById(
        workspaceId
      );
      if (workspace.owner.toString() !== req.user.id) {
  return res.status(403).json({
    message: "Only owner can remove members",
  });
}
      workspace.members = workspace.members.filter(
        (id) => id.toString() !== memberId
      );

      await workspace.save();
      // Send notification
      io.to(memberId).emit("member-removed", {
        workspaceId,
        workspaceName: workspace.name,
        message: `You have been removed from ${workspace.name} workspace`,
      });

      res.json({
        message: "Member removed successfully",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);
app.get("/api/workspaces/myteams", authMiddleware, async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    })
      .populate("members", "name email")
      .populate("owner", "name email");

    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/user/:id", authMiddleware,async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
app.put("/user/update/:id",authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ---------------- START SERVER ----------------
server.listen(port, () => {
  console.log("Server running on port 5000");
});