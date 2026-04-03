const mongoose = require("mongoose");

const savedContentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

savedContentSchema.index({ user: 1, content: 1 }, { unique: true });
savedContentSchema.index({ user: 1, order: 1 });

module.exports = mongoose.model("SavedContent", savedContentSchema);
