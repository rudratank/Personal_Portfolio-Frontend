import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProjectDetails from './Pages/ProjectDetails';
import AdminDashboard from './Admin/AdminDashboard';
import { ProtectedRoute } from './Pages/ProtectedRoutes';
import Home from './Pages/Home';
import { AuthProvider } from './Pages/AuthProvider';
import Auth from './Admin/Authantication/Auth';
import Unauthorized from './Pages/Unauthorize';
import NotFound from './Pages/NotFound';
import Privacy from './Pages/Privacy';
import Terms from './Pages/Terms';
import HelpSignin from './Admin/helpsignin';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/auth" element={<Auth />} />
          <Route path='/privacy' element={<Privacy/>} />
          <Route path='/terms-of-service' element={<Terms />} />
          <Route path='/help-signin' element={<HelpSignin />} />

          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Admin Routes - Always use adminOnly=true */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;