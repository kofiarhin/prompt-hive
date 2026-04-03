function success(res, data = {}, meta = {}, statusCode = 200) {
  const payload = { success: true, data };
  if (Object.keys(meta).length > 0) {
    payload.meta = meta;
  }
  return res.status(statusCode).json(payload);
}

function paginated(res, data, { page, limit, total }) {
  return res.status(200).json({
    success: true,
    data,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

function error(res, message, statusCode = 500, code = "", details = []) {
  return res.status(statusCode).json({
    success: false,
    error: { message, code, details },
  });
}

module.exports = { success, paginated, error };
