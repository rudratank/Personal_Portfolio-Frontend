import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="space-y-8 text-gray-600">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Introduction</h2>
              <p className="mb-4">
                Welcome to Rudra Tank's portfolio website. This Privacy Policy explains how I collect, use, and protect any information you may provide while using this website.
              </p>
              <p>
                I am committed to ensuring that your privacy is protected. Any information collected will only be used in accordance with this privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Information Collection</h2>
              <p className="mb-4">
                I may collect the following information when you interact with the contact form or other interactive features of the website:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and contact information, including email address</li>
                <li>Professional information you choose to share</li>
                <li>Usage data and analytics</li>
                <li>Technical information about your device and browser</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Use of Information</h2>
              <p className="mb-4">
                Any information collected is used solely for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Responding to your inquiries and messages</li>
                <li>Improving the website's user experience</li>
                <li>Sending relevant updates or information (with your consent)</li>
                <li>Internal record keeping</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Security</h2>
              <p>
                I am committed to ensuring that your information is secure. I have implemented suitable physical, electronic, and managerial procedures to safeguard and secure the information collected online.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cookies</h2>
              <p className="mb-4">
                This website uses cookies to enhance your browsing experience. Cookies are small files stored on your computer's hard drive that track, save, and store information about your interactions with and usage of the website.
              </p>
              <p>
                You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Third-Party Links</h2>
              <p>
                This website may contain links to other websites of interest. However, once you use these links to leave my site, note that I do not have any control over external websites. Therefore, I cannot be responsible for the protection and privacy of any information you provide while visiting such sites.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <p className="mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
              <p>
                This Privacy Policy may be updated periodically. The latest version will be posted on this page with the effective date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p>
                If you have any questions about this Privacy Policy or how I handle your data, please contact me at{' '}
                <a href="mailto:contact@rudratank.com" className="text-blue-600 hover:text-blue-800">
                  contact@rudratank.com
                </a>
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;