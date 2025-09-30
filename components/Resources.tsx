import React, { useState, useCallback } from 'react';
import { getHealthInfo } from '../services/contentService';
import Spinner from './Spinner';
import { HealthInfo } from '../types';

const predefinedTopics = [
    "Type 2 Diabetes",
    "Hypertension",
    "Heart Disease",
    "Healthy Diet",
    "Benefits of Exercise",
    "Managing Stress"
];

const parseMarkdownToHTML = (markdown: string): string => {
    const lines = markdown.split('\n');
    let html = '';
    let inList = false;

    for (const line of lines) {
        let processedLine = line;

        // Headers
        if (processedLine.startsWith('### ')) {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<h3>${processedLine.substring(4)}</h3>`;
            continue;
        }
        if (processedLine.startsWith('## ')) {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<h2>${processedLine.substring(3)}</h2>`;
            continue;
        }
        if (processedLine.startsWith('# ')) {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<h1>${processedLine.substring(2)}</h1>`;
            continue;
        }

        // Bold text
        processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // List items
        if (processedLine.startsWith('* ')) {
            if (!inList) {
                html += '<ul>';
                inList = true;
            }
            html += `<li>${processedLine.substring(2)}</li>`;
            continue;
        }
        
        if (inList) {
            html += '</ul>';
            inList = false;
        }
        
        if (processedLine.trim() !== '') {
            html += `<p>${processedLine}</p>`;
        }
    }

    if (inList) {
        html += '</ul>';
    }

    return html;
};

const SectionIcon: React.FC<{ title: string }> = ({ title }) => {
    const lowerTitle = title.toLowerCase();
    let icon;

    if (lowerTitle.includes('symptom')) {
        icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    } else if (lowerTitle.includes('prevent') || lowerTitle.includes('manage')) {
        icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
    } else if (lowerTitle.includes('cause') || lowerTitle.includes('risk')) {
        icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    } else if (lowerTitle.includes('diet') || lowerTitle.includes('food')) {
        icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 10h18M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    } else { // Default/Overview icon
        icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>;
    }

    return (
        <div className="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
            {icon}
        </div>
    );
};

const Resources: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState<HealthInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchContent = useCallback(async (currentTopic: string) => {
        if (!currentTopic) return;
        setIsLoading(true);
        setError(null);
        setContent(null);
        try {
            const result = await getHealthInfo(currentTopic);
            setContent(result);
        } catch (err) {
            console.error("Error fetching health info:", err);
            setError("Sorry, I couldn't fetch information on that topic. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleTopicClick = (selectedTopic: string) => {
        setTopic(selectedTopic);
        fetchContent(selectedTopic);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchContent(topic);
    };

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Health & Wellness Resources</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Get AI-powered information on health topics.</p>
                </div>

                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., 'What are the signs of high blood pressure?'"
                        className="flex-grow block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-200"
                    />
                    <button type="submit" disabled={isLoading || !topic} className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed">
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                <div className="mt-6 max-w-3xl mx-auto">
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-2">Or select a topic:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {predefinedTopics.map(item => (
                            <button
                                key={item}
                                onClick={() => handleTopicClick(item)}
                                className="px-3 py-1 text-sm font-semibold rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {isLoading && (
                <div className="flex flex-col items-center justify-center py-10">
                    <Spinner />
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Fetching information...</p>
                </div>
            )}
            
            {error && (
                <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md shadow-md max-w-4xl mx-auto" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {content && (
                <div className="max-w-4xl mx-auto space-y-8">
                    <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 text-center border-b-2 border-blue-200 dark:border-blue-800 pb-4">
                        {content.topic}
                    </h2>

                    {content.sections.map((section, index) => (
                        <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl dark:hover:shadow-black/50">
                            <div className="p-6 flex items-center space-x-4 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                <SectionIcon title={section.title} />
                                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">{section.title}</h3>
                            </div>
                            <div 
                                className="p-6 prose prose-slate dark:prose-invert max-w-none prose-h1:text-slate-800 prose-h2:text-slate-700 prose-h3:text-slate-600 prose-strong:text-slate-800 prose-a:text-blue-600 hover:prose-a:text-blue-500"
                                dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(section.content) }} 
                            />
                        </div>
                    ))}
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-300 p-4 rounded-md mt-8">
                        <h4 className="font-bold">Disclaimer</h4>
                        <p className="text-sm">{content.disclaimer}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Resources;