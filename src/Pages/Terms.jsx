import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="space-y-8 text-gray-600">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Use License</h2>
              <p className="mb-4">
                Permission is granted to temporarily view the materials (information or software) on Rudra Tank's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Intellectual Property Rights</h2>
              <p className="mb-4">
                All content on this website, including but not limited to text, graphics, logos, images, audio clips, digital downloads, data compilations, and software, is the property of Rudra Tank or its content suppliers and protected by international copyright laws.
              </p>
              <p>
                The compilation of all content on this site is the exclusive property of Rudra Tank and protected by international copyright laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. User Content</h2>
              <p className="mb-4">
                If you submit any information or content to the website through contact forms or other means, you grant Rudra Tank a non-exclusive, royalty-free, perpetual, irrevocable right to use, reproduce, modify, adapt, publish, translate, distribute, and display such content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Disclaimer</h2>
              <p className="mb-4">
                The materials on this website are provided on an 'as is' basis. Rudra Tank makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Limitations</h2>
              <p>
                In no event shall Rudra Tank or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Links</h2>
              <p>
                Rudra Tank has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Rudra Tank of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Modifications</h2>
              <p>
                Rudra Tank may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Contact</h2>
              <p>
                If you have any questions about these Terms of Service, please contact me at{' '}
                <a href="mailto:rudratank07@.com" className="text-blue-600 hover:text-blue-800">
                  rudratank07@gmail.com
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

export default Terms;