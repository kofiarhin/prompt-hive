const Content = require("../models/Content");
const { success, paginated } = require("../utils/response");
const { generateUniqueSlug } = require("../utils/slug");
const AppError = require("../utils/AppError");

// POST /api/content — create content
async function createContent(req, res, next) {
  try {
    const {
      title,
      description,
      type,
      skillProvider,
      contentText,
      category,
      tags,
      useCase,
      visibility,
    } = req.body;

    // Skills must have a provider
    if (type === "skill" && !skillProvider) {
      throw new AppError("Skill provider is required for skills", 400, "VALIDATION_ERROR");
    }
    // Prompts should not have a provider
    const resolvedProvider = type === "skill" ? skillProvider : null;

    const slug = await generateUniqueSlug(title);
    const ownerType = req.user.role === "admin" ? "admin" : "user";

    const content = await Content.create({
      title,
      slug,
      description,
      type,
      skillProvider: resolvedProvider,
      contentText,
      category,
      tags: tags || [],
      useCase: useCase || "",
      visibility: ownerType === "admin" ? (visibility || "public") : (visibility || "private"),
      ownerType,
      createdBy: req.user._id,
    });

    return success(res, { content }, {}, 201);
  } catch (err) {
    next(err);
  }
}

// PUT /api/content/:id — update content
async function updateContent(req, res, next) {
  try {
    const content = await Content.findById(req.params.id);
    if (!content || content.isDeleted) {
      throw new AppError("Content not found", 404, "NOT_FOUND");
    }

    // Authorization: owner or admin
    const isOwner = content.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      throw new AppError("Not authorized", 403, "FORBIDDEN");
    }

    const allowedFields = [
      "title",
      "description",
      "type",
      "skillProvider",
      "contentText",
      "category",
      "tags",
      "useCase",
      "visibility",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // If title changes, regenerate slug
    if (updates.title && updates.title !== content.title) {
      updates.slug = await generateUniqueSlug(updates.title);
    }

    // Resolve skill provider
    const finalType = updates.type || content.type;
    if (finalType === "prompt") {
      updates.skillProvider = null;
    } else if (finalType === "skill") {
      const finalProvider = updates.skillProvider !== undefined
        ? updates.skillProvider
        : content.skillProvider;

      if (!finalProvider) {
        throw new AppError("Skill provider is required for skills", 400, "VALIDATION_ERROR");
      }
    }

    Object.assign(content, updates);
    await content.save();

    return success(res, { content });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/content/:id — soft delete
async function deleteContent(req, res, next) {
  try {
    const content = await Content.findById(req.params.id);
    if (!content || content.isDeleted) {
      throw new AppError("Content not found", 404, "NOT_FOUND");
    }

    const isOwner = content.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      throw new AppError("Not authorized", 403, "FORBIDDEN");
    }

    content.isDeleted = true;
    await content.save();

    return success(res, { message: "Content deleted" });
  } catch (err) {
    next(err);
  }
}

// GET /api/content — explore (public, non-deleted)
async function getContent(req, res, next) {
  try {
    const {
      search,
      type,
      provider,
      category,
      tags,
      useCase,
      sort = "newest",
      page = 1,
      limit = 20,
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const filter = { visibility: "public", isDeleted: false };

    if (type) filter.type = type;
    if (provider) filter.skillProvider = provider;
    if (category) filter.category = category;
    if (useCase) filter.useCase = useCase;
    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
      if (tagList.length > 0) {
        filter.tags = { $in: tagList };
      }
    }

    let query;
    if (search) {
      filter.$text = { $search: search };
      query = Content.find(filter, { textScore: { $meta: "textScore" } });
      // When searching, default sort by relevance
      if (sort === "newest") {
        query = query.sort({ score: { $meta: "textScore" }, createdAt: -1 });
      }
    } else {
      query = Content.find(filter);
    }

    // Sort
    if (!search || sort !== "newest") {
      const sortMap = {
        newest: { createdAt: -1 },
        rating: { rating: -1, upvoteCount: -1, createdAt: -1 },
        upvotes: { upvoteCount: -1, createdAt: -1 },
      };
      query = query.sort(sortMap[sort] || sortMap.newest);
    }

    const total = await Content.countDocuments(filter);

    const data = await query
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("createdBy", "name username avatar")
      .lean();

    return paginated(res, data, { page: pageNum, limit: limitNum, total });
  } catch (err) {
    next(err);
  }
}

// GET /api/content/featured — homepage featured
async function getFeatured(req, res, next) {
  try {
    const data = await Content.find({
      visibility: "public",
      isDeleted: false,
      isFeatured: true,
    })
      .sort({ featuredOrder: 1 })
      .limit(10)
      .populate("createdBy", "name username avatar")
      .lean();

    return success(res, data);
  } catch (err) {
    next(err);
  }
}

// GET /api/content/top-rated — homepage top rated
async function getTopRated(req, res, next) {
  try {
    const data = await Content.find({
      visibility: "public",
      isDeleted: false,
    })
      .sort({ rating: -1, upvoteCount: -1, createdAt: -1 })
      .limit(10)
      .populate("createdBy", "name username avatar")
      .lean();

    return success(res, data);
  } catch (err) {
    next(err);
  }
}

// GET /api/content/:slug — detail
async function getContentBySlug(req, res, next) {
  try {
    const content = await Content.findOne({ slug: req.params.slug })
      .populate("createdBy", "name username avatar")
      .lean();

    if (!content || content.isDeleted) {
      throw new AppError("Content not found", 404, "NOT_FOUND");
    }

    // Private content: owner or admin only, else 404
    if (content.visibility === "private") {
      const userId = req.user?._id?.toString();
      const isOwner = userId === content.createdBy._id.toString();
      const isAdmin = req.user?.role === "admin";
      if (!isOwner && !isAdmin) {
        throw new AppError("Content not found", 404, "NOT_FOUND");
      }
    }

    return success(res, { content });
  } catch (err) {
    next(err);
  }
}

// GET /api/content/user/me — current user's content
async function getMyContent(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const filter = { createdBy: req.user._id, isDeleted: false };

    const total = await Content.countDocuments(filter);
    const data = await Content.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return paginated(res, data, { page, limit, total });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createContent,
  updateContent,
  deleteContent,
  getContent,
  getFeatured,
  getTopRated,
  getContentBySlug,
  getMyContent,
};
