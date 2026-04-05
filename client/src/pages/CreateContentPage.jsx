import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMetadata } from "../hooks/queries/useMetadata";
import { useCreateContent } from "../hooks/mutations/useContentMutations";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const INITIAL_FORM = {
  title: "",
  description: "",
  type: "prompt",
  skillProvider: "",
  contentText: "",
  category: "",
  tags: [],
  useCase: "",
  visibility: "private",
};

function validateForm(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "Title is required.";
  if (!form.description.trim()) errors.description = "Description is required.";
  if (!form.contentText.trim())
    errors.contentText = form.type === "prompt" ? "Prompt text is required." : "Skill content is required.";
  if (!form.category) errors.category = "Please select a category.";
  if (form.type === "skill" && !form.skillProvider) errors.skillProvider = "Please select a skill provider.";
  return errors;
}

export default function CreateContentPage({ defaultVisibility = "private" }) {
  const [form, setForm] = useState({ ...INITIAL_FORM, visibility: defaultVisibility });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const metadata = useMetadata();
  const createMutation = useCreateContent();
  const navigate = useNavigate();

  const clearFieldError = (field) => {
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");

    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const payload = { ...form };
    if (payload.type === "prompt") delete payload.skillProvider;
    if (!payload.useCase) delete payload.useCase;

    createMutation.mutate(payload, {
      onSuccess: (res) => {
        const slug = res.data.data.content.slug;
        navigate(`/content/${slug}`);
      },
      onError: (err) => {
        const apiError = err.response?.data?.error;
        const details = apiError?.details;
        if (details?.length) {
          setGeneralError(details[0]);
        } else {
          setGeneralError(apiError?.message || "Failed to create content. Please try again.");
        }
      },
    });
  };

  const handleTagToggle = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const inputClass = (field) =>
    `w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 ${
      fieldErrors[field] ? "border-red-500" : "border-gray-300"
    }`;

  const FieldError = ({ field }) =>
    fieldErrors[field] ? (
      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
        <span aria-hidden="true">!</span>
        {fieldErrors[field]}
      </p>
    ) : null;

  if (metadata.isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Content</h1>
      <form onSubmit={handleSubmit} noValidate className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        {/* Type */}
        <div className="flex gap-3">
          {metadata.data?.contentTypes?.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => {
                setForm({ ...form, type: t.value, skillProvider: "" });
                clearFieldError("skillProvider");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                form.type === t.value
                  ? "bg-amber-50 border-amber-300 text-amber-700"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Skill Provider */}
        {form.type === "skill" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skill Provider</label>
            <select
              value={form.skillProvider}
              onChange={(e) => {
                setForm({ ...form, skillProvider: e.target.value });
                clearFieldError("skillProvider");
              }}
              className={inputClass("skillProvider")}
            >
              <option value="">Select provider</option>
              {metadata.data?.skillProviders?.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <FieldError field="skillProvider" />
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            maxLength={200}
            value={form.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
              clearFieldError("title");
            }}
            className={inputClass("title")}
          />
          <FieldError field="title" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            maxLength={1000}
            rows={3}
            value={form.description}
            onChange={(e) => {
              setForm({ ...form, description: e.target.value });
              clearFieldError("description");
            }}
            className={inputClass("description")}
          />
          <FieldError field="description" />
        </div>

        {/* Content Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {form.type === "prompt" ? "Prompt Text" : "Skill Content"}
          </label>
          <textarea
            rows={8}
            value={form.contentText}
            onChange={(e) => {
              setForm({ ...form, contentText: e.target.value });
              clearFieldError("contentText");
            }}
            className={`${inputClass("contentText")} font-mono text-sm`}
          />
          <FieldError field="contentText" />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => {
              setForm({ ...form, category: e.target.value });
              clearFieldError("category");
            }}
            className={inputClass("category")}
          >
            <option value="">Select category</option>
            {metadata.data?.categories?.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <FieldError field="category" />
        </div>

        {/* Use Case */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Use Case (optional)</label>
          <select
            value={form.useCase}
            onChange={(e) => setForm({ ...form, useCase: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg"
          >
            <option value="">Select use case</option>
            {metadata.data?.useCases?.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {metadata.data?.tags?.map((tag) => (
              <button
                key={tag.value}
                type="button"
                onClick={() => handleTagToggle(tag.value)}
                className={`text-xs px-3 py-1.5 rounded-full border ${
                  form.tags.includes(tag.value)
                    ? "bg-amber-100 border-amber-300 text-amber-700"
                    : "border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
          <div className="flex gap-3">
            {metadata.data?.visibilityOptions?.map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={() => setForm({ ...form, visibility: v.value })}
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                  form.visibility === v.value
                    ? "bg-amber-50 border-amber-300 text-amber-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {generalError && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            <span aria-hidden="true">!</span>
            {generalError}
          </div>
        )}

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600 disabled:opacity-50"
        >
          {createMutation.isPending ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
