import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { store } from "./store";
import { queryClient } from "./queryClient";
import { restoreSession } from "../features/auth/actions";

function BootstrapAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return null;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <BootstrapAuth />
          {children}
          <Toaster position="bottom-right" />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}
