function apiSuccess(res, data = {}, meta = {}, statusCode = 200) {
  const payload = { success: true, data };
  if (Object.keys(meta).length > 0) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
}

function apiPaginated(res, data, { page, limit, total }) {
  return apiSuccess(
    res,
    data,
    {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    200
  );
}

module.exports = { apiSuccess, apiPaginated };
