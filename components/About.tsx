import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800">About the AI Disease Risk Predictor</h2>
        <p className="mt-2 text-lg text-slate-600">Empowering individuals with AI-driven health insights.</p>
      </div>

      <div className="space-y-8 prose prose-lg max-w-none">
        <section>
          <h3 className="text-xl font-bold text-slate-700">Our Mission</h3>
          <p>
            Our mission is to provide an accessible and intuitive tool that helps users understand potential health risks based on their lifestyle, habits, and vital signs. By leveraging advanced AI, we aim to deliver personalized insights and actionable recommendations, encouraging proactive health management and fostering a better understanding of how daily choices impact long-term well-being.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-700">How It Works</h3>
          <p>
            The application uses Google's powerful Gemini model to analyze a comprehensive set of health data points. This includes:
          </p>
          <ul>
            <li><strong>Patient Profiles:</strong> Baseline information like age, BMI, and known medical conditions.</li>
            <li><strong>Daily Logs:</strong> Recent data on vital signs, symptoms, and sleep patterns.</li>
            <li><strong>Lifestyle Factors:</strong> Information on diet, activity levels, and habits like smoking.</li>
          </ul>
          <p>
            The AI processes this information to identify patterns and correlations, predicting the primary health risk and generating tailored recommendations to help mitigate that risk.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-700">Key Features</h3>
          <ul>
            <li><strong>Patient Dashboard:</strong> A centralized view of a patient's profile, recent vitals, and the latest AI-powered risk assessment.</li>
            <li><strong>Ad-Hoc Predictor:</strong> An on-demand tool to get a risk prediction based on manually entered data.</li>
            <li><strong>Health Resources:</strong> An AI-powered library of information on various health and wellness topics.</li>
            <li><strong>FAQ Chat Bot:</strong> An AI-powered assistant to answer your general health and wellness questions.</li>
          </ul>
        </section>

        <section className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <h4 className="text-lg font-bold text-red-800">Important Disclaimer</h4>
          <p className="text-red-700">
            This tool is for informational and educational purposes only. It is <strong>NOT</strong> a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or another qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this application.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;