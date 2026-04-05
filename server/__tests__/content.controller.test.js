const AppError = require("../utils/AppError");

jest.mock("../models/Content", () => ({
  findById: jest.fn(),
}));

jest.mock("../utils/response", () => ({
  success: jest.fn(),
  paginated: jest.fn(),
}));

const Content = require("../models/Content");
const { updateContent } = require("../controllers/contentController");

describe("contentController.updateContent", () => {
  it("rejects prompt -> skill update without a skillProvider", async () => {
    const save = jest.fn();
    const contentDoc = {
      _id: "content_1",
      title: "Prompt A",
      type: "prompt",
      skillProvider: null,
      isDeleted: false,
      createdBy: { toString: () => "user_1" },
      save,
    };

    Content.findById.mockResolvedValue(contentDoc);

    const req = {
      params: { id: "content_1" },
      user: { _id: "user_1", role: "user" },
      body: { type: "skill" },
    };
    const res = {};
    const next = jest.fn();

    await updateContent(req, res, next);

    expect(save).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(AppError);
    expect(next.mock.calls[0][0].statusCode).toBe(400);
    expect(next.mock.calls[0][0].message).toBe("Skill provider is required for skills");
  });
});
