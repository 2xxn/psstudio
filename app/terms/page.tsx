import React from 'react';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Agreement to Terms</h2>
        <p>By accessing our website, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations. If you do not agree with these terms, you are prohibited from using or accessing this site.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on PSStudio's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
        <ul className="list-disc pl-6 mt-2">
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose;</li>
            <li>attempt to decompile or reverse engineer any software contained on PSStudio's website;</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. Disclaimer</h2>
        <p>The materials on PSStudio's website are provided on an 'as is' basis. PSStudio makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">4. Limitations</h2>
        <p>In no event shall PSStudio or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on PSStudio's website, even if PSStudio or a PSStudio authorized representative has been notified orally or in writing of the possibility of such damage.</p>
      </section>
    </div>
  );
}
