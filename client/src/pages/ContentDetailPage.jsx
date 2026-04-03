import { useParams, useNavigate } from "react-router-dom";
import { useContentBySlug } from "../hooks/queries/useContent";
import { useAuth } from "../features/auth/useAuth";
import { useVote } from "../hooks/mutations/useVoteMutation";
import { useSaveContent } from "../hooks/mutations/useSaveMutations";
import { useCopyContent } from "../hooks/mutations/useContentMutations";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import toast from "react-hot-toast";
import {
  ThumbsUp,
  ThumbsDown,
  Copy,
  Bookmark,
  BookmarkCheck,
  Star,
  ArrowLeft,
  Calendar,
  User,
} from "lucide-react";

export default function ContentDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading, error } = useContentBySlug(slug);
  const voteMutation = useVote();
  const saveMutation = useSaveContent();
  const copyMutation = useCopyContent();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Content not found" />;

  const content = data?.data?.content;
  if (!content) return <ErrorMessage message="Content not found" />;

  const handleVote = (voteType) => {
    if (!user) return toast.error("Please login to vote");
    voteMutation.mutate({ contentId: content._id, voteType });
  };

  const handleSave = () => {
    if (!user) return toast.error("Please login to save");
    saveMutation.mutate(content._id);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content.contentText);
      copyMutation.mutate(content._id);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  content.type === "prompt"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {content.type}
              </span>
              {content.skillProvider && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  {content.skillProvider}
                </span>
              )}
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                {content.category}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{content.title}</h1>
          </div>
          {content.rating > 0 && (
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={20} fill="currentColor" />
              <span className="text-lg font-semibold">{content.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          {content.createdBy && (
            <span className="flex items-center gap-1">
              <User size={14} />
              {content.createdBy.username || content.createdBy.name}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(content.createdAt).toLocaleDateString()}
          </span>
        </div>

        <p className="text-gray-600 mb-6">{content.description}</p>

        {/* Tags */}
        {content.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {content.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content text */}
        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-5 overflow-x-auto text-sm whitespace-pre-wrap">
            {content.contentText}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-gray-200 p-2 rounded-lg"
            title="Copy"
          >
            <Copy size={16} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => handleVote("up")}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-300 text-sm"
          >
            <ThumbsUp size={16} /> {content.upvoteCount}
          </button>
          <button
            onClick={() => handleVote("down")}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 text-sm"
          >
            <ThumbsDown size={16} /> {content.downvoteCount}
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-amber-50 hover:border-amber-300 text-sm"
          >
            <Bookmark size={16} /> Save
          </button>
          <span className="text-sm text-gray-400 ml-auto">
            <Copy size={14} className="inline mr-1" />
            {content.copyCount} copies
          </span>
        </div>
      </div>
    </div>
  );
}
