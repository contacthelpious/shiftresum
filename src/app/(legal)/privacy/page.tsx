
export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background text-foreground">
      <main className="container py-20 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tighter font-headline mb-8">
            Privacy Policy
          </h1>
          <div className="prose prose-lg text-muted-foreground max-w-none">
            <p>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <p>
              Welcome to ResumeFlow ("we," "us," or "our"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We may collect personal information that you voluntarily provide to us when you register on the website, create a resume, or contact us. This information may include:
            </p>
            <ul>
              <li><strong>Personal Data:</strong> Name, email address, phone number, and other contact details.</li>
              <li><strong>Resume Data:</strong> Employment history, educational background, skills, and any other information you include in your resumes.</li>
              <li><strong>Usage Data:</strong> Information your browser sends whenever you visit our Service, such as your computer's IP address, browser type, pages visited, and the time and date of your visit.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, operate, and maintain our services.</li>
              <li>Improve, personalize, and expand our services.</li>
              <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.</li>
              <li>Process your transactions.</li>
              <li>Analyze usage to improve the service.</li>
            </ul>

            <h2>3. Sharing Your Information</h2>
            <p>
              We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
            </p>
            
            <h2>4. Data Security</h2>
            <p>
                We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential.
            </p>

            <h2>5. Your Data Rights</h2>
            <p>
              Depending on your location, you may have rights under data protection laws in relation to your personal data, including the right to request access, correction, or deletion of your personal data.
            </p>

            <h2>6. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h2>7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please <a href="/contact" className="text-accent hover:underline">contact us</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
