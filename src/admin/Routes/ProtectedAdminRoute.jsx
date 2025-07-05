// ProtectedAdminRoute.jsx
export default function ProtectedAdminRoute({ children }) {
  const user = auth.currentUser;
  return user?.email === 'admin@swiftaid.com' ? children : <Navigate to="/admin-login" />;
}
