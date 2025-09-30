import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Predictor from './components/Predictor';
import Resources from './components/Resources';
import About from './components/About';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Spinner from './components/Spinner';
import { Patient, DailyLog } from './types';


export type Page = 'dashboard' | 'predictor' | 'resources' | 'about';
type AuthPage = 'login' | 'signup';
export type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const [patientProfile, setPatientProfile] = useState<Patient | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as Theme;
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    try {
      const sessionActive = localStorage.getItem('healthAppSessionActive');
      if (sessionActive === 'true') {
        const savedProfileJSON = localStorage.getItem('healthAppPatientProfile');
        const savedLogsJSON = localStorage.getItem('healthAppDailyLogs');
        
        if (savedProfileJSON && savedLogsJSON) {
          handleLogin(); // Use handleLogin to process data
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

  const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  };

  const handleSignUp = (patient: Patient) => {
    const generateDummyLogs = (patientId: string): DailyLog[] => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        
        return [
            { log_id: 'L01', patient_id: patientId, date: formatDate(yesterday), vitals: { bp_systolic: 129, bp_diastolic: 83, fasting_glucose: 118, heart_rate: 79 }, sleep_hours: 5.5, symptoms: ['fatigue'], meals: [] },
            { log_id: 'L02', patient_id: patientId, date: formatDate(today), vitals: { bp_systolic: 127, bp_diastolic: 82, fasting_glucose: 114, heart_rate: 77 }, sleep_hours: 7.5, symptoms: [], meals: [] },
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
        let logs: DailyLog[] = JSON.parse(savedLogsJSON);

        // Update log dates to be current
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (logs.length >= 2) {
            logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            logs[logs.length - 1].date = formatDate(today);
            logs[logs.length - 2].date = formatDate(yesterday);
        }

        setPatientProfile(patient);
        setDailyLogs(logs);

        // Persist the updated logs and session
        localStorage.setItem('healthAppDailyLogs', JSON.stringify(logs));
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
      <div className="flex h-screen w-full items-center justify-center bg-slate-100 dark:bg-slate-900">
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
        return <Dashboard patient={patientProfile} dailyLogs={dailyLogs} theme={theme} />;
      case 'predictor':
        return <Predictor />;
      case 'resources':
        return <Resources />;
      case 'about':
        return <About />;
      default:
        return <Dashboard patient={patientProfile} dailyLogs={dailyLogs} theme={theme} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;