import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser, registerUser } from "./actions";
import { selectAuthLoading, selectUser } from "./selectors";

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);

  return {
    user,
    loading,
    login: (data) => dispatch(loginUser(data)).unwrap(),
    register: (data) => dispatch(registerUser(data)).unwrap(),
    logout: () => dispatch(logoutUser()).unwrap(),
  };
}
