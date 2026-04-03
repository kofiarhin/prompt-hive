const SavedContent = require("../models/SavedContent");
const Content = require("../models/Content");
const { success, paginated } = require("../utils/response");
const AppError = require("../utils/AppError");

async function saveContent(req, res, next) {
  try {
    const { contentId } = req.params;
    const userId = req.user._id;

    const content = await Content.findById(contentId);
    if (!content || content.isDeleted) {
      throw new AppError("Content not found", 404, "NOT_FOUND");
    }

    // Can't save inaccessible private content
    if (content.visibility === "private") {
      const isOwner = content.createdBy.toString() === userId.toString();
      const isAdmin = req.user.role === "admin";
      if (!isOwner && !isAdmin) {
        throw new AppError("Content not found", 404, "NOT_FOUND");
      }
    }

    // Check for duplicate
    const existing = await SavedContent.findOne({ user: userId, content: contentId });
    if (existing) {
      throw new AppError("Content already saved", 409, "DUPLICATE_SAVE");
    }

    // Get next order number
    const lastSaved = await SavedContent.findOne({ user: userId })
      .sort({ order: -1 })
      .lean();
    const nextOrder = lastSaved ? lastSaved.order + 1 : 0;

    const saved = await SavedContent.create({
      user: userId,
      content: contentId,
      order: nextOrder,
    });

    content.saveCount += 1;
    await content.save();

    return success(res, { saved }, {}, 201);
  } catch (err) {
    next(err);
  }
}

async function unsaveContent(req, res, next) {
  try {
    const { contentId } = req.params;
    const userId = req.user._id;

    const saved = await SavedContent.findOneAndDelete({
      user: userId,
      content: contentId,
    });

    if (!saved) {
      throw new AppError("Saved item not found", 404, "NOT_FOUND");
    }

    await Content.findByIdAndUpdate(contentId, {
      $inc: { saveCount: -1 },
    });

    return success(res, { message: "Content unsaved" });
  } catch (err) {
    next(err);
  }
}

async function getSavedContent(req, res, next) {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const filter = { user: userId };
    const total = await SavedContent.countDocuments(filter);

    const data = await SavedContent.find(filter)
      .sort({ order: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "content",
        populate: { path: "createdBy", select: "name username avatar" },
      })
      .lean();

    // Filter out items where content was deleted or missing
    const cleaned = data.map((item) => {
      if (!item.content || item.content.isDeleted) {
        return { ...item, content: null, _unavailable: true };
      }
      return item;
    });

    return paginated(res, cleaned, { page, limit, total });
  } catch (err) {
    next(err);
  }
}

async function reorderSaved(req, res, next) {
  try {
    const userId = req.user._id;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError("Items array is required", 400, "VALIDATION_ERROR");
    }

    // Bulk update — only user's own items
    const ops = items.map(({ contentId, order }) => ({
      updateOne: {
        filter: { user: userId, content: contentId },
        update: { $set: { order } },
      },
    }));

    await SavedContent.bulkWrite(ops);

    // Return updated list
    const data = await SavedContent.find({ user: userId })
      .sort({ order: 1 })
      .populate({
        path: "content",
        populate: { path: "createdBy", select: "name username avatar" },
      })
      .lean();

    return success(res, data);
  } catch (err) {
    next(err);
  }
}

module.exports = { saveContent, unsaveContent, getSavedContent, reorderSaved };
