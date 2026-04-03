const Content = require("../models/Content");
const { success } = require("../utils/response");
const AppError = require("../utils/AppError");

async function trackCopy(req, res, next) {
  try {
    const content = await Content.findById(req.params.id);
    if (!content || content.isDeleted) {
      throw new AppError("Content not found", 404, "NOT_FOUND");
    }

    // Private content — only owner or admin
    if (content.visibility === "private") {
      const userId = req.user?._id?.toString();
      const isOwner = userId === content.createdBy.toString();
      const isAdmin = req.user?.role === "admin";
      if (!isOwner && !isAdmin) {
        throw new AppError("Content not found", 404, "NOT_FOUND");
      }
    }

    content.copyCount += 1;
    await content.save();

    return success(res, { copyCount: content.copyCount });
  } catch (err) {
    next(err);
  }
}

module.exports = { trackCopy };
