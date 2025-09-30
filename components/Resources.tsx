import React, { useState, useCallback } from 'react';
import { getHealthInfo } from '../services/contentService';
import Spinner from './Spinner';

const predefinedTopics = [
    "Type 2 Diabetes",
    "Hypertension",
    "Heart Disease",
    "Healthy Diet",
    "Benefits of Exercise",
    "Managing Stress"
];

const Resources: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchContent = useCallback(async (currentTopic: string) => {
        if (!currentTopic) return;
        setIsLoading(true);
        setError(null);
        setContent('');
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
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Health & Wellness Resources</h2>
                    <p className="text-slate-600 mt-1">Get AI-powered information on health topics.</p>
                </div>

                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., 'What are the signs of high blood pressure?'"
                        className="flex-grow block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button type="submit" disabled={isLoading || !topic} className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed">
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                <div className="mt-6 max-w-3xl mx-auto">
                    <p className="text-center text-sm text-slate-500 mb-2">Or select a topic:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {predefinedTopics.map(item => (
                            <button
                                key={item}
                                onClick={() => handleTopicClick(item)}
                                className="px-3 py-1 text-sm font-semibold rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
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
                    <p className="mt-4 text-lg text-slate-600">Fetching information...</p>
                </div>
            )}
            
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md max-w-4xl mx-auto" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {content && (
                <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto prose lg:prose-lg">
                    <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
                </div>
            )}
        </div>
    );
};

export default Resources;
