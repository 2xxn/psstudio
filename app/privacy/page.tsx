import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
        <p>Welcome to PSStudio. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">2. Data Collection and Storage</h2>
        <p>PSStudio operates as a stateless application. We do not maintain a database and do not permanently store your personal data or photos on our servers.</p>
        <p className="mt-2">How we handle your data:</p>
        <ul className="list-disc pl-6 mt-2">
            <li><strong>Authentication Tokens:</strong> Your Google OAuth tokens are encrypted and stored securely in cookies on your own device. They are only used to authenticate your requests to Google's services.</li>
            <li><strong>Photos and Metadata:</strong> When you upload or edit photos, the data is transmitted directly to Google's Street View Publish API. We act solely as a conduit and do not retain copies of your content.</li>
            <li><strong>Temporary Processing:</strong> Data is processed in memory only for the duration of your active session and requests.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. Third-Party Services</h2>
        <p>Our service relies on Google Street View services. By using PSStudio, you are also interacting with Google's services. We recommend reviewing Google's Privacy Policy to understand how they handle your data.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">4. Google User Data</h2>
        <p>Our application uses Google OAuth to authenticate users and access Google Street View Publish API. We access your Google Photos and Street View data only to provide the core functionality of managing your photospheres.</p>
        <p className="mt-2">We do not share your Google user data with any third parties, except as required by law.</p>
      </section>
    </div>
  );
}
