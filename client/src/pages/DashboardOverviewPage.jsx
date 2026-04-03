import { Link } from "react-router-dom";

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-600">Manage your content and saved items.</p>
      <div className="flex flex-wrap gap-3">
        <Link to="/dashboard/content" className="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600">
          My Content
        </Link>
        <Link to="/dashboard/saved" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
          Saved Content
        </Link>
      </div>
    </div>
  );
}
