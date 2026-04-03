import { useState } from "react";
import { Link } from "react-router-dom";
import { useMyContent } from "../hooks/queries/useContent";
import { useSavedContent } from "../hooks/queries/useSaved";
import { useUnsaveContent } from "../hooks/mutations/useSaveMutations";
import { useDeleteContent } from "../hooks/mutations/useContentMutations";
import ContentCard from "../components/ContentCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import EmptyState from "../components/ui/EmptyState";
import { Plus, Bookmark, FileText, Trash2, Edit, X } from "lucide-react";

export default function DashboardPage({ initialTab = "content", hideTabs = false }) {
  const [tab, setTab] = useState(initialTab);
  const myContent = useMyContent();
  const saved = useSavedContent();
  const unsaveMutation = useUnsaveContent();
  const deleteMutation = useDeleteContent();

  const tabs = [
    { key: "content", label: "My Content", icon: FileText },
    { key: "saved", label: "Saved", icon: Bookmark },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/dashboard/content/new"
          className="bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-600"
        >
          <Plus size={18} /> Create
        </Link>
      </div>

      {!hideTabs && (
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${
                tab === key
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {tab === "content" && (
        <>
          {myContent.isLoading ? (
            <LoadingSpinner />
          ) : myContent.data?.data?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myContent.data.data.map((item) => (
                <div key={item._id} className="relative group">
                  <ContentCard content={item} />
                  <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                    <Link
                      to={`/dashboard/content/${item._id}/edit`}
                      className="bg-white border border-gray-200 p-1.5 rounded-lg shadow-sm hover:bg-gray-50"
                    >
                      <Edit size={14} />
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (confirm("Delete this content?")) {
                          deleteMutation.mutate(item._id);
                        }
                      }}
                      className="bg-white border border-gray-200 p-1.5 rounded-lg shadow-sm hover:bg-red-50"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="You haven't created any content yet" />
          )}
        </>
      )}

      {tab === "saved" && (
        <>
          {saved.isLoading ? (
            <LoadingSpinner />
          ) : saved.data?.data?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {saved.data.data.map((item) =>
                item.content ? (
                  <div key={item._id} className="relative group">
                    <ContentCard content={item.content} />
                    <button
                      onClick={() => unsaveMutation.mutate(item.content._id)}
                      className="absolute top-2 right-2 hidden group-hover:flex bg-white border border-gray-200 p-1.5 rounded-lg shadow-sm hover:bg-red-50"
                    >
                      <X size={14} className="text-red-500" />
                    </button>
                  </div>
                ) : (
                  <div key={item._id} className="bg-gray-100 border border-gray-200 rounded-xl p-5 text-gray-400 text-sm">
                    This content is no longer available.
                    <button
                      onClick={() => unsaveMutation.mutate(item.content?._id || item._id)}
                      className="block mt-2 text-red-400 hover:text-red-500 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                )
              )}
            </div>
          ) : (
            <EmptyState message="No saved content yet" />
          )}
        </>
      )}
    </div>
  );
}
