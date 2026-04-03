const Vote = require("../models/Vote");
const Content = require("../models/Content");
const { success } = require("../utils/response");
const { calculateRating, calculateScore } = require("../utils/rating");
const AppError = require("../utils/AppError");

async function toggleVote(req, res, next) {
  try {
    const { contentId } = req.params;
    const { voteType } = req.body;
    const userId = req.user._id;

    if (!["up", "down"].includes(voteType)) {
      throw new AppError("Vote type must be 'up' or 'down'", 400, "VALIDATION_ERROR");
    }

    const content = await Content.findById(contentId);
    if (!content || content.isDeleted) {
      throw new AppError("Content not found", 404, "NOT_FOUND");
    }
    if (content.visibility !== "public") {
      throw new AppError("Content not found", 404, "NOT_FOUND");
    }

    const existingVote = await Vote.findOne({ user: userId, content: contentId });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Same vote — remove it
        await existingVote.deleteOne();
        if (voteType === "up") {
          content.upvoteCount = Math.max(0, content.upvoteCount - 1);
        } else {
          content.downvoteCount = Math.max(0, content.downvoteCount - 1);
        }
      } else {
        // Opposite vote — switch
        existingVote.voteType = voteType;
        await existingVote.save();
        if (voteType === "up") {
          content.upvoteCount += 1;
          content.downvoteCount = Math.max(0, content.downvoteCount - 1);
        } else {
          content.downvoteCount += 1;
          content.upvoteCount = Math.max(0, content.upvoteCount - 1);
        }
      }
    } else {
      // New vote
      await Vote.create({ user: userId, content: contentId, voteType });
      if (voteType === "up") {
        content.upvoteCount += 1;
      } else {
        content.downvoteCount += 1;
      }
    }

    content.score = calculateScore(content.upvoteCount, content.downvoteCount);
    content.rating = calculateRating(content.upvoteCount, content.downvoteCount);
    await content.save();

    // Determine current user's vote state
    const currentVote = await Vote.findOne({ user: userId, content: contentId });

    return success(res, {
      currentUserVote: currentVote ? currentVote.voteType : null,
      upvoteCount: content.upvoteCount,
      downvoteCount: content.downvoteCount,
      score: content.score,
      rating: content.rating,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { toggleVote };
