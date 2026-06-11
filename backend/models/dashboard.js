const Workspace = require("../models/workspace");
const Board = require("../models/board");
const User = require("../models/user");
const Card = require("../models/card");

const getDashboardStats = async (req, res) => {
  try {
    const workspaceCount = await Workspace.countDocuments();
    const boardCount = await Board.countDocuments();
    const memberCount = await User.countDocuments();
    const cardCount = await Card.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        workspaces: workspaceCount,
        boards: boardCount,
        members: memberCount,
        cards: cardCount
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};