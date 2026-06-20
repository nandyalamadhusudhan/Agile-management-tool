const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    title: String,

    description: String,

    priority: {
      type: String,
      default: "Medium",
    },

    listName: {
      type: String,
      default: "Todo",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Card",
  cardSchema
);