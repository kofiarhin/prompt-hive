const Content = require("../models/Content");
const User = require("../models/User");
const { success, paginated } = require("../utils/response");
const { generateUniqueSlug } = require("../utils/slug");
const AppError = require("../utils/AppError");

async function getContent(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const filter = { isDeleted: false };
    const total = await Content.countDocuments(filter);
    const data = await Content.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("createdBy", "name username avatar")
      .lean();

    return paginated(res, data, { page, limit, total });
  } catch (err) {
    next(err);
  }
}

async function createContent(req, res, next) {
  try {
    const {
      title, description, type, skillProvider,
      contentText, category, tags, useCase, visibility,
    } = req.body;

    if (type === "skill" && !skillProvider) {
      throw new AppError("Skill provider is required for skills", 400, "VALIDATION_ERROR");
    }

    const slug = await generateUniqueSlug(title);

    const content = await Content.create({
      title,
      slug,
      description,
      type,
      skillProvider: type === "skill" ? skillProvider : null,
      contentText,
      category,
      tags: tags || [],
      useCase: useCase || "",
      visibility: visibility || "public",
      ownerType: "admin",
      createdBy: req.user._id,
    });

    return success(res, { content }, {}, 201);
  } catch (err) {
    next(err);
  }
}

async function updateContent(req, res, next) {
  try {
    const content = await Content.findById(req.params.id);
    if (!content || content.isDeleted) {
      throw new AppError("Content not found", 404, "NOT_FOUND");
    }

    const allowedFields = [
      "title", "description", "type", "skillProvider",
      "contentText", "category", "tags", "useCase",
      "visibility", "isFeatured", "featuredOrder",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.title && updates.title !== content.title) {
      updates.slug = await generateUniqueSlug(updates.title);
    }

    Object.assign(content, updates);
    await content.save();

    return success(res, { content });
  } catch (err) {
    next(err);
  }
}

async function deleteContent(req, res, next) {
  try {
    const content = await Content.findById(req.params.id);
    if (!content || content.isDeleted) {
      throw new AppError("Content not found", 404, "NOT_FOUND");
    }

    content.isDeleted = true;
    await content.save();

    return success(res, { message: "Content deleted" });
  } catch (err) {
    next(err);
  }
}

async function getUsers(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const total = await User.countDocuments();
    const data = await User.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return paginated(res, data, { page, limit, total });
  } catch (err) {
    next(err);
  }
}

async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      throw new AppError("Invalid role", 400, "VALIDATION_ERROR");
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) throw new AppError("User not found", 404, "NOT_FOUND");

    return success(res, { user });
  } catch (err) {
    next(err);
  }
}

async function updateUserStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!["active", "suspended"].includes(status)) {
      throw new AppError("Invalid status", 400, "VALIDATION_ERROR");
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!user) throw new AppError("User not found", 404, "NOT_FOUND");

    return success(res, { user });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getContent,
  createContent,
  updateContent,
  deleteContent,
  getUsers,
  updateUserRole,
  updateUserStatus,
};
