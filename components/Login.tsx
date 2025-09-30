import React, { useState } from 'react';

interface LoginProps {
    onLogin: () => void;
    onNavigateToSignUp: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToSignUp }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const savedProfileJSON = localStorage.getItem('healthAppPatientProfile');
        if (!savedProfileJSON) {
            setError("No account found. Please sign up.");
            return;
        }

        const savedProfile = JSON.parse(savedProfileJSON);

        if (savedProfile.username === username && savedProfile.password === password) {
            onLogin();
        } else {
            setError("Invalid username or password.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center space-x-3 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        <h1 className="text-2xl font-bold text-slate-800">
                            AI Disease Risk Predictor
                        </h1>
                    </div>
                    <p className="text-slate-600">Sign in to continue to your dashboard.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-slate-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-slate-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div className="pt-2">
                        <button type="submit" className="w-full flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Login
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-slate-600">
                    Don't have an account?{' '}
                    <button onClick={onNavigateToSignUp} className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline">
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;