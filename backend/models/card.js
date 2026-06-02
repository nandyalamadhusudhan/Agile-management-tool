const mongoose = require("mongoose");
const CardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"]
  },
  dueDate: Date,
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "List"
  }
}, { timestamps: true });
module.exports = mongoose.model("card", CardSchema);