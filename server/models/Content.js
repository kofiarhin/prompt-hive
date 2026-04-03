const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 1000,
    },
    type: {
      type: String,
      required: [true, "Content type is required"],
      enum: ["prompt", "skill"],
    },
    skillProvider: {
      type: String,
      enum: ["claude", "codex", null],
      default: null,
    },
    contentText: {
      type: String,
      required: [true, "Content text is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    useCase: {
      type: String,
      default: "",
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
      index: true,
    },
    ownerType: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    copyCount: { type: Number, default: 0 },
    saveCount: { type: Number, default: 0 },
    upvoteCount: { type: Number, default: 0 },
    downvoteCount: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false, index: true },
    featuredOrder: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Compound indexes for discovery queries
contentSchema.index({ visibility: 1, isDeleted: 1, createdAt: -1 });
contentSchema.index({ visibility: 1, isDeleted: 1, type: 1, skillProvider: 1 });
contentSchema.index({ visibility: 1, isDeleted: 1, category: 1, useCase: 1 });
contentSchema.index(
  { title: "text", description: "text", contentText: "text", tags: "text" },
  { name: "content_text_search" }
);

module.exports = mongoose.model("Content", contentSchema);
