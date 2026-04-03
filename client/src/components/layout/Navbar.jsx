import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";
import { Search, Menu, X, LogOut, User, LayoutDashboard, Plus, Shield } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-amber-600">
            PromptHive
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/explore" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
              <Search size={16} />
              Explore
            </Link>
            {user && (
              <>
                <Link to="/dashboard/content/new" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                  <Plus size={16} />
                  Create
                </Link>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin/content" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                    <Shield size={16} />
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-700">
                  <User size={16} />
                  <span className="text-sm font-medium">{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
          <Link to="/explore" className="block py-2 text-gray-600" onClick={() => setMenuOpen(false)}>
            Explore
          </Link>
          {user ? (
            <>
              <Link to="/dashboard/content/new" className="block py-2 text-gray-600" onClick={() => setMenuOpen(false)}>
                Create
              </Link>
              <Link to="/dashboard" className="block py-2 text-gray-600" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              {user.role === "admin" && (
                <Link to="/admin/content" className="block py-2 text-gray-600" onClick={() => setMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="block py-2 text-red-500">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 text-gray-600" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="block py-2 text-amber-600 font-medium" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
