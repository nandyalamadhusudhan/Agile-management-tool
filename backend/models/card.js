const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
  },

  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  dueDate: Date,
  listName: {
    type: String,
    default: "Todo",
  },
}, {
  timestamps: true,
});
module.exports = mongoose.model("card", CardSchema);