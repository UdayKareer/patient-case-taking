import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import PatientLogin from './pages/PatientLogin';
import PatientDashboard from './pages/PatientDashboard';
import Consultation from './pages/Consultation';
import Summary from './pages/Summary';
import DoctorDashboard from './pages/DoctorDashboard';
import Login from './pages/Login';
import Layout from './components/Layout';
import DoctorLayout from './components/DoctorLayout';
import DemoControlHub from './pages/DemoControlHub';

const ProtectedDoctorRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = sessionStorage.getItem('doctor_logged_in') === 'true';
  if (!isLoggedIn) {
    return <Navigate to="/doctor/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <Routes>
        {/* Patient Portal Routes (uses Patient Layout) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/patient/login" replace />} />
          <Route path="patient/login" element={<PatientLogin />} />
          <Route path="patient/dashboard" element={<PatientDashboard />} />
          <Route path="consultation" element={<Consultation />} />
          <Route path="summary" element={<Summary />} />
        </Route>

        {/* Doctor Portal Login */}
        <Route path="/doctor/login" element={<Login />} />

        {/* Protected Doctor Routes (uses Doctor Layout) */}
        <Route 
          path="/doctor" 
          element={
            <ProtectedDoctorRoute>
              <DoctorLayout />
            </ProtectedDoctorRoute>
          }
        >
          <Route index element={<DoctorDashboard />} />
        </Route>

        {/* Standalone Demo & Presentation Simulator Hub */}
        <Route path="/demo" element={<DemoControlHub />} />
        <Route path="/doctor/demo" element={<Navigate to="/demo" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
