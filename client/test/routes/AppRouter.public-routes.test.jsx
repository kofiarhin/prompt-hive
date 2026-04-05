import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "../../src/routes/AppRouter";

vi.mock("../../src/components/layout/Layout", () => ({
  default: () => (
    <div>
      <Outlet />
    </div>
  ),
}));

vi.mock("../../src/pages/HomePage", () => ({ default: () => <div>Home Page</div> }));
vi.mock("../../src/pages/ExplorePage", () => ({ default: () => <div>Explore Page</div> }));
vi.mock("../../src/pages/ContentDetailPage", () => ({ default: () => <div>Content Detail Page</div> }));
vi.mock("../../src/pages/LoginPage", () => ({ default: () => <div>Login Page</div> }));
vi.mock("../../src/pages/RegisterPage", () => ({ default: () => <div>Register Page</div> }));
vi.mock("../../src/pages/DashboardOverviewPage", () => ({ default: () => <div>Dashboard Page</div> }));
vi.mock("../../src/pages/DashboardSavedPage", () => ({ default: () => <div>Dashboard Saved Page</div> }));
vi.mock("../../src/pages/DashboardContentPage", () => ({ default: () => <div>Dashboard Content Page</div> }));
vi.mock("../../src/pages/DashboardContentCreatePage", () => ({ default: () => <div>Dashboard Content Create Page</div> }));
vi.mock("../../src/pages/DashboardContentEditPage", () => ({ default: () => <div>Dashboard Content Edit Page</div> }));
vi.mock("../../src/pages/AdminContentPage", () => ({ default: () => <div>Admin Content Page</div> }));
vi.mock("../../src/pages/AdminContentCreatePage", () => ({ default: () => <div>Admin Content Create Page</div> }));
vi.mock("../../src/pages/AdminUsersPage", () => ({ default: () => <div>Admin Users Page</div> }));

function renderRouter({ route, user = null, status = "succeeded" }) {
  const store = configureStore({
    reducer: {
      auth: (state = { user, status, isAuthenticated: Boolean(user) }) => state,
    },
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>
          <AppRouter />
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
}

describe("AppRouter public route access", () => {
  it("allows unauthenticated users to access /login", () => {
    const { unmount } = renderRouter({ route: "/login" });
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    unmount();
  });

  it("allows unauthenticated users to access /register", () => {
    const { unmount } = renderRouter({ route: "/register" });
    expect(screen.getByText("Register Page")).toBeInTheDocument();
    unmount();
  });

  it("redirects authenticated users from /login to /dashboard", () => {
    const user = { id: "1", username: "alice", role: "user" };
    const { unmount } = renderRouter({ route: "/login", user });

    expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
    unmount();
  });

  it("redirects authenticated users from /register to /dashboard", () => {
    const user = { id: "1", username: "alice", role: "user" };
    renderRouter({ route: "/register", user });

    expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
  });
});
