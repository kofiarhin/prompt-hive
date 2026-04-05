import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import toast from "react-hot-toast";

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.username.trim()) {
    errors.username = "Username is required.";
  } else if (form.username.length < 3 || form.username.length > 30 || !USERNAME_REGEX.test(form.username)) {
    errors.username = "Username must be 3–30 characters and contain only letters, numbers, _ or -.";
  }
  if (!form.email.trim() || !EMAIL_REGEX.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  return errors;
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();
  const submittingRef = useRef(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (fieldErrors[field]) setFieldErrors({ ...fieldErrors, [field]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || submittingRef.current) return;

    setFieldErrors({});
    setGeneralError("");

    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      if (err?.status === 409) {
        if (err.message?.includes("Email") || err.message?.includes("email")) {
          setFieldErrors({ email: "An account with this email already exists.", emailIsConflict: true });
        } else {
          setFieldErrors({ username: "This username is already taken. Try another one." });
        }
      } else if (err?.status === 400 && err?.code === "VALIDATION_ERROR") {
        const mapped = {};
        (err.details || []).forEach((d) => {
          mapped[d.field] = d.message;
        });
        setFieldErrors(mapped);
      } else {
        setGeneralError("We couldn't create your account. Please try again.");
      }
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 ${
      fieldErrors[field] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              className={inputClass("name")}
            />
            {fieldErrors.name && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <span aria-hidden="true">!</span>
                {fieldErrors.name}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={handleChange("username")}
              className={inputClass("username")}
            />
            {fieldErrors.username && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <span aria-hidden="true">!</span>
                {fieldErrors.username}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              className={inputClass("email")}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <span aria-hidden="true">!</span>
                <span>
                  {fieldErrors.email}
                  {fieldErrors.emailIsConflict && (
                    <>
                      {" "}
                      <Link to="/login" className="underline font-medium">
                        Log in instead.
                      </Link>
                    </>
                  )}
                </span>
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              className={inputClass("password")}
            />
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <span aria-hidden="true">!</span>
                {fieldErrors.password}
              </p>
            )}
          </div>
          {generalError && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              <span aria-hidden="true">!</span>
              {generalError}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-white py-2.5 rounded-lg font-medium hover:bg-amber-600 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
