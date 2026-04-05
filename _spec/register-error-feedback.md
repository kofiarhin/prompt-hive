# Spec: Registration Form — Inline Error Feedback

## Overview

Replace react-hot-toast error popups on the registration form with inline, per-field error messages. Users should be able to see exactly which field failed and why, without guessing.

---

## Background

**Current behaviour:** All registration errors (duplicate email, duplicate username, validation failures, server errors) are shown as a single toast notification that disappears after a few seconds. There is no indication of which field caused the problem.

**Desired behaviour:** Field-level error messages appear directly below the offending input, the input border turns red, and a general error banner appears at the bottom of the form only for unexpected server errors.

The backend already returns enough structured data to drive this — no backend changes are required.

---

## Error Sources & Field Mapping

| Scenario | HTTP Status | Code | Target |
|----------|-------------|------|--------|
| Username already registered | 409 | `DUPLICATE` | `username` field |
| Email already registered | 409 | `DUPLICATE` | `email` field |
| express-validator failure | 400 | `VALIDATION_ERROR` | per `details[].field` |
| Unexpected / server error | 5xx | — | General banner |

### 409 Disambiguation

The backend sends a single message string. Parse it to route to the correct field:

- `"Email already in use"` → email field error
- `"Username already taken"` → username field error

### 400 Validation Error Shape

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [
      { "field": "password", "message": "Password must be at least 6 characters" }
    ]
  }
}
```

Iterate `details` and map each entry to `fieldErrors[field]`.

---

## Client-Side Validation

Run synchronously on submit, before the API call. If any rule fails, set `fieldErrors` and abort — do not make an API request.

| Field | Rule | Error Message |
|-------|------|---------------|
| `name` | Non-empty | "Name is required." |
| `username` | Non-empty | "Username is required." |
| `username` | 3–30 chars, `/^[a-zA-Z0-9_-]+$/` | "Username must be 3–30 characters and contain only letters, numbers, _ or -." |
| `email` | Passes basic email regex | "Please enter a valid email address." |
| `password` | Min 8 characters | "Password must be at least 8 characters." |

---

## authSlice Change

`registerUser` in `client/src/features/auth/authSlice.js` currently passes only a string to `rejectWithValue`. Change it to pass a structured object so `RegisterPage` can route errors correctly.

**Before:**
```js
return rejectWithValue(error.response?.data?.error?.message || "Registration failed");
```

**After:**
```js
return rejectWithValue({
  message: error.response?.data?.error?.message || "Registration failed",
  code: error.response?.data?.error?.code,
  details: error.response?.data?.error?.details || [],
  status: error.response?.status,
});
```

> Note: Any other component that reads from `useAuth().error` (e.g. to display a string) will need to account for this now being an object. Check usages before implementing.

---

## RegisterPage Changes

**File:** `client/src/pages/RegisterPage.jsx`

### New State

```js
const [fieldErrors, setFieldErrors] = useState({});   // { username, email, password, name, emailIsConflict }
const [generalError, setGeneralError] = useState("");
```

### Submit Handler Logic

```
1. setFieldErrors({})
   setGeneralError("")

2. Run client-side validation
   → if any errors: setFieldErrors(errors) and return early

3. dispatch(registerUser(form))

4. If action.type === rejected:
     payload = action.payload  (structured object from rejectWithValue)

     if payload.status === 409:
       if payload.message includes "Email":
         setFieldErrors({ email: "An account with this email already exists.", emailIsConflict: true })
       else:
         setFieldErrors({ username: "This username is already taken. Try another one." })

     else if payload.status === 400 && payload.code === "VALIDATION_ERROR":
       const errors = {}
       payload.details.forEach(d => errors[d.field] = d.message)
       setFieldErrors(errors)

     else:
       setGeneralError("We couldn't create your account. Please try again.")
```

### Field Error UI Pattern

Apply to every form field. Example for email:

```jsx
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    value={form.email}
    onChange={...}
    className={`... border ${fieldErrors.email ? "border-red-500" : "border-gray-600"}`}
  />
  {fieldErrors.email && (
    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
      <span aria-hidden="true">!</span>
      <span>
        {fieldErrors.email}
        {fieldErrors.emailIsConflict && (
          <>
            {" "}
            <Link to="/login" className="underline">Log in instead.</Link>
          </>
        )}
      </span>
    </p>
  )}
</div>
```

Repeat the same pattern for `name`, `username`, and `password` fields (without the `emailIsConflict` link).

### General Error Banner

Render above the submit button:

```jsx
{generalError && (
  <div
    role="alert"
    className="flex items-center gap-2 rounded-md bg-gray-800 border border-red-500 px-4 py-3 text-sm text-red-400"
  >
    <span aria-hidden="true">!</span>
    <span>{generalError}</span>
  </div>
)}
```

### Remove Toast Error Calls

Remove the `toast.error(...)` calls inside the registration catch/rejected block. Keep any `toast.success(...)` calls for successful registration.

---

## Files to Modify

| File | Change |
|------|--------|
| `client/src/features/auth/authSlice.js` | `rejectWithValue` returns structured object |
| `client/src/pages/RegisterPage.jsx` | `fieldErrors` + `generalError` state, inline error UI, client-side validation, remove toast errors |

## Files Not Modified

- Backend — no changes needed
- `client/src/services/authService.js` — no change
- `client/src/services/api.js` — no change

---

## Verification Checklist

- [ ] Submit empty form → all required fields show inline errors, no API call fired
- [ ] Submit with password < 8 chars → inline password error shown, no API call fired
- [ ] Submit with existing username → username field shows "This username is already taken. Try another one."
- [ ] Submit with existing email → email field shows conflict message + "Log in instead." link
- [ ] "Log in instead." navigates to `/login`
- [ ] Submit with valid new credentials → registration succeeds, user redirected
- [ ] Simulate 500 response → general error banner shown, no field errors
- [ ] Fixing a field error and resubmitting clears the previous inline error for that field
