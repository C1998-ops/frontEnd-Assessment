import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { store, type RootState } from "./store/store";
import { ToastProvider } from "./context/ToastContext";
import { publicRoutes, protectedRoutes } from "./routes";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

function AppContent() {
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <ToastProvider>
        <Router basename={"/frontEnd-Assessment"}>
          <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Routes>
              {/* Public routes */}
              {publicRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    route.path === "login" && isAuthenticated ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      route.element
                    )
                  }
                />
              ))}

              {/* Protected routes */}
              {protectedRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<ProtectedRoute>{route.element}</ProtectedRoute>}
                >
                  {route.children?.map((child) => (
                    <Route
                      key={child.path || "index"}
                      path={child.path}
                      index={child.index}
                      element={child.element}
                    />
                  ))}
                </Route>
              ))}

              {/* Default redirect */}
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="*"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </div>
  );
}

export default App;
