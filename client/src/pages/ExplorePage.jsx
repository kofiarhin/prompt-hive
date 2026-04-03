import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useExploreContent } from "../hooks/queries/useContent";
import { useMetadata } from "../hooks/queries/useMetadata";
import ContentCard from "../components/ContentCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import EmptyState from "../components/ui/EmptyState";
import ErrorMessage from "../components/ui/ErrorMessage";
import { Search, Filter, X } from "lucide-react";

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [showFilters, setShowFilters] = useState(false);

  const params = {
    search: searchParams.get("search") || undefined,
    type: searchParams.get("type") || undefined,
    category: searchParams.get("category") || undefined,
    tags: searchParams.get("tags") || undefined,
    useCase: searchParams.get("useCase") || undefined,
    sort: searchParams.get("sort") || "newest",
    page: searchParams.get("page") || 1,
    limit: 20,
  };

  const { data, isLoading, error } = useExploreContent(params);
  const metadata = useMetadata();

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.delete("page");
    setSearchParams(next);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParam("search", searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const meta = data?.meta;
  const items = data?.data || [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore</h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search prompts and skills..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <button type="submit" className="bg-amber-500 text-white px-5 py-2.5 rounded-lg hover:bg-amber-600">
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="border border-gray-300 px-3 py-2.5 rounded-lg hover:bg-gray-50"
        >
          <Filter size={18} />
        </button>
      </form>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <select
            value={params.type || ""}
            onChange={(e) => updateParam("type", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Types</option>
            {metadata.data?.contentTypes?.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <select
            value={params.category || ""}
            onChange={(e) => updateParam("category", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Categories</option>
            {metadata.data?.categories?.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <select
            value={params.useCase || ""}
            onChange={(e) => updateParam("useCase", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Use Cases</option>
            {metadata.data?.useCases?.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
          <select
            value={params.sort || "newest"}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            {metadata.data?.sortOptions?.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <X size={14} /> Clear filters
          </button>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message="Failed to load content" />
      ) : items.length === 0 ? (
        <EmptyState message="No content found" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <ContentCard key={item._id} content={item} />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: meta.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => updateParam("page", page)}
                  className={`px-3 py-1.5 rounded text-sm ${
                    page === meta.page
                      ? "bg-amber-500 text-white"
                      : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
