import { Link } from "react-router-dom";
import { useFeaturedContent, useTopRatedContent } from "../hooks/queries/useContent";
import ContentCard from "../components/ContentCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import EmptyState from "../components/ui/EmptyState";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";

export default function HomePage() {
  const featured = useFeaturedContent();
  const topRated = useTopRatedContent();

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
          Discover & Share <span className="text-amber-500">AI Prompts</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          A community-driven platform for sharing, discovering, and organizing prompts and skills
          for your favorite AI tools.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/explore"
            className="bg-amber-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-600 flex items-center gap-2"
          >
            Explore Prompts <ArrowRight size={18} />
          </Link>
          <Link
            to="/register"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Featured */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles size={24} className="text-amber-500" /> Featured
          </h2>
          <Link to="/explore" className="text-amber-600 hover:text-amber-700 text-sm flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {featured.isLoading ? (
          <LoadingSpinner />
        ) : featured.data?.data?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.data.data.map((item) => (
              <ContentCard key={item._id} content={item} />
            ))}
          </div>
        ) : (
          <EmptyState message="No featured content yet" />
        )}
      </section>

      {/* Top Rated */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp size={24} className="text-amber-500" /> Top Rated
          </h2>
          <Link to="/explore?sort=rating" className="text-amber-600 hover:text-amber-700 text-sm flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {topRated.isLoading ? (
          <LoadingSpinner />
        ) : topRated.data?.data?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topRated.data.data.map((item) => (
              <ContentCard key={item._id} content={item} />
            ))}
          </div>
        ) : (
          <EmptyState message="No rated content yet" />
        )}
      </section>
    </div>
  );
}
