const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  cards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "card"
    }
  ]
},
{
  timestamps: true
});

module.exports = mongoose.model("Board", BoardSchema);