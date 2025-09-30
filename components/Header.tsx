import React from 'react';
import { Page, Theme } from '../App';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

const NavButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => {
  const baseClasses = "px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap";
  const activeClasses = "bg-blue-600 text-white shadow";
  const inactiveClasses = "text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700";
  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      {label}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onLogout, theme, onToggleTheme }) => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md dark:shadow-none dark:border-b dark:border-slate-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
              AI Disease Risk Predictor
            </h1>
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                <NavButton label="Dashboard" isActive={currentPage === 'dashboard'} onClick={() => onNavigate('dashboard')} />
                <NavButton label="Predictor" isActive={currentPage === 'predictor'} onClick={() => onNavigate('predictor')} />
                <NavButton label="Resources" isActive={currentPage === 'resources'} onClick={() => onNavigate('resources')} />
                <NavButton label="About" isActive={currentPage === 'about'} onClick={() => onNavigate('about')} />
            </div>
             <ThemeToggle theme={theme} onToggle={onToggleTheme} />
             <button onClick={onLogout} className="px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-800">
                Logout
            </button>
          </div>
        </div>
        <div className="sm:hidden flex items-center justify-between space-x-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg mb-2">
            <div className="flex items-center overflow-x-auto space-x-1">
                <NavButton label="Dashboard" isActive={currentPage === 'dashboard'} onClick={() => onNavigate('dashboard')} />
                <NavButton label="Predictor" isActive={currentPage === 'predictor'} onClick={() => onNavigate('predictor')} />
                <NavButton label="Resources" isActive={currentPage === 'resources'} onClick={() => onNavigate('resources')} />
                <NavButton label="About" isActive={currentPage === 'about'} onClick={() => onNavigate('about')} />
            </div>
             <ThemeToggle theme={theme} onToggle={onToggleTheme} />
             <button onClick={onLogout} className="ml-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 focus:outline-none">
                Logout
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;