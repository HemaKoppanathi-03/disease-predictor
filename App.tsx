import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Predictor from './components/Predictor';
import Resources from './components/Resources';
import About from './components/About';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Spinner from './components/Spinner';
import ChatbotWidget from './components/ChatbotWidget';
import { Patient, DailyLog } from './types';


export type Page = 'dashboard' | 'predictor' | 'resources' | 'about';
type AuthPage = 'login' | 'signup';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const [patientProfile, setPatientProfile] = useState<Patient | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  useEffect(() => {
    try {
      const sessionActive = localStorage.getItem('healthAppSessionActive');
      if (sessionActive === 'true') {
        const savedProfileJSON = localStorage.getItem('healthAppPatientProfile');
        const savedLogsJSON = localStorage.getItem('healthAppDailyLogs');
        
        if (savedProfileJSON && savedLogsJSON) {
          const savedProfile = JSON.parse(savedProfileJSON);
          const savedLogs = JSON.parse(savedLogsJSON);
          setPatientProfile(savedProfile);
          setDailyLogs(savedLogs);
        }
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      // Clear potentially corrupted data
      localStorage.removeItem('healthAppPatientProfile');
      localStorage.removeItem('healthAppDailyLogs');
      localStorage.removeItem('healthAppSessionActive');
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const handleSignUp = (patient: Patient) => {
    const generateDummyLogs = (patientId: string): DailyLog[] => {
        return [
            { log_id: 'L01', patient_id: patientId, date: '2024-07-18', vitals: { bp_systolic: 129, bp_diastolic: 83, fasting_glucose: 118, heart_rate: 79 }, sleep_hours: 5.5, symptoms: ['fatigue'], meals: [] },
            { log_id: 'L02', patient_id: patientId, date: '2024-07-19', vitals: { bp_systolic: 127, bp_diastolic: 82, fasting_glucose: 114, heart_rate: 77 }, sleep_hours: 7.5, symptoms: [], meals: [] },
        ];
    }
    const newLogs = generateDummyLogs(patient.patient_id);

    try {
      localStorage.setItem('healthAppPatientProfile', JSON.stringify(patient));
      localStorage.setItem('healthAppDailyLogs', JSON.stringify(newLogs));
      setAuthPage('login'); // Redirect to login page after sign up
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  };

  const handleLogin = () => {
    const savedProfileJSON = localStorage.getItem('healthAppPatientProfile');
    const savedLogsJSON = localStorage.getItem('healthAppDailyLogs');
    if (savedProfileJSON && savedLogsJSON) {
        const patient = JSON.parse(savedProfileJSON);
        const logs = JSON.parse(savedLogsJSON);
        setPatientProfile(patient);
        setDailyLogs(logs);
        localStorage.setItem('healthAppSessionActive', 'true');
    }
  };

  const handleLogout = () => {
    setPatientProfile(null);
    setDailyLogs([]);
    localStorage.removeItem('healthAppSessionActive');
  };

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-100">
        <Spinner />
      </div>
    );
  }

  if (!patientProfile) {
    if (authPage === 'login') {
      return <Login onLogin={handleLogin} onNavigateToSignUp={() => setAuthPage('signup')} />;
    }
    return <SignUp onSignUp={handleSignUp} onNavigateToLogin={() => setAuthPage('login')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard patient={patientProfile} dailyLogs={dailyLogs} />;
      case 'predictor':
        return <Predictor />;
      case 'resources':
        return <Resources />;
      case 'about':
        return <About />;
      default:
        return <Dashboard patient={patientProfile} dailyLogs={dailyLogs} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {renderPage()}
      </main>
      <ChatbotWidget />
    </div>
  );
};

export default App;