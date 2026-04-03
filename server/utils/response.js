const { apiSuccess, apiPaginated } = require("./apiResponse");
const { apiError } = require("./apiError");

module.exports = {
  success: apiSuccess,
  paginated: apiPaginated,
  error: apiError,
};
