import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.css";
import NavBar from "./components/navigation/navbar";
import '@fortawesome/fontawesome-free/css/all.min.css';


// Lazy load components for better initial load performance
const Login = lazy(() => import("./components/login/Login"));
const Register = lazy(() => import("./components/register/Register"));
const ForgetPassword = lazy(() => import("./components/forget-password/ForgetPassword"));
const EmailConfirmation = lazy(() => import("./components/email-confirmation/EmailConfirmation"));
const Profile = lazy(() => import("./components/profile/Profile"));
const Feeds = lazy(() => import("./components/feeds/Feeds"));

// Loading fallback component
const LoadingFallback = () => <div>Loading...</div>;

// Error boundary component
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    return <div>Something went wrong. Please try again.</div>;
  }
};

// Auth guard component
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // Replace with your auth logic
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

const App: React.FC = () => {

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Auth routes */}
            <Route path="/auth">
              <Route path="login" element={<Login />} />
              <Route path="register">
                <Route index element={<Register />} />
                <Route
                  path="email-confirmation"
                  element={<EmailConfirmation />}
                />
              </Route>
              <Route
                path="forget-password"
                element={<ForgetPassword />}
              />
            </Route>

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <AuthGuard>
                  <NavBar />
                  <Outlet />
                </AuthGuard>
              }
            >
              <Route index element={<Feeds />} />
              <Route path="/profile/:id" element={<Profile />} />
            </Route>
            {/* Redirect /login to /auth/login */}
            <Route
              path="/login"
              element={<Navigate to="/auth/login" replace />}
            />

            {/* 404 route */}
            <Route
              path="*"
              element={
                <div className="error-page">
                  <h1>404 Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary >
  );
};

export default App;
