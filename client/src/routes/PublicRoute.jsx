import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthLoading, selectUser } from "../features/auth/selectors";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function PublicRoute({ children }) {
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);

  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}
