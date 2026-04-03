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

export default function CreateContentPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const metadata = useMetadata();
  const createMutation = useCreateContent();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (payload.type === "prompt") {
      delete payload.skillProvider;
    }
    if (!payload.useCase) delete payload.useCase;

    createMutation.mutate(payload, {
      onSuccess: (res) => {
        const slug = res.data.data.content.slug;
        navigate(`/content/${slug}`);
      },
    });
  };

  const handleTagToggle = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  if (metadata.isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Content</h1>
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        {/* Type */}
        <div className="flex gap-3">
          {metadata.data?.contentTypes?.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setForm({ ...form, type: t.value, skillProvider: "" })}
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
              onChange={(e) => setForm({ ...form, skillProvider: e.target.value })}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg"
            >
              <option value="">Select provider</option>
              {metadata.data?.skillProviders?.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            required
            maxLength={200}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            required
            maxLength={1000}
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Content Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {form.type === "prompt" ? "Prompt Text" : "Skill Content"}
          </label>
          <textarea
            required
            rows={8}
            value={form.contentText}
            onChange={(e) => setForm({ ...form, contentText: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg"
          >
            <option value="">Select category</option>
            {metadata.data?.categories?.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
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
