import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, Copy, Bookmark, Star } from "lucide-react";

export default function ContentCard({ content }) {
  return (
    <Link
      to={`/content/${content.slug}`}
      className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                content.type === "prompt"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {content.type}
            </span>
            {content.skillProvider && (
              <span className="text-xs text-gray-500">{content.skillProvider}</span>
            )}
            <span className="text-xs text-gray-400">{content.category}</span>
          </div>
          <h3 className="font-semibold text-gray-900 truncate">{content.title}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{content.description}</p>
        </div>
        {content.rating > 0 && (
          <div className="flex items-center gap-1 text-amber-500 shrink-0">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-medium">{content.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {content.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {content.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <ThumbsUp size={12} /> {content.upvoteCount}
        </span>
        <span className="flex items-center gap-1">
          <ThumbsDown size={12} /> {content.downvoteCount}
        </span>
        <span className="flex items-center gap-1">
          <Copy size={12} /> {content.copyCount}
        </span>
        <span className="flex items-center gap-1">
          <Bookmark size={12} /> {content.saveCount}
        </span>
        {content.createdBy && (
          <span className="ml-auto">by {content.createdBy.username || content.createdBy.name}</span>
        )}
      </div>
    </Link>
  );
}
