import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const contactEmail = "talelingo@oneway8x.com";
const lastUpdated = "April 25, 2026";

const TaleLingoPrivacy = () => {
  return (
    <>
      <Helmet>
        <title>TaleLingo Privacy Policy | oneway8x.com</title>
        <meta
          name="description"
          content="Privacy Policy for the TaleLingo language learning app."
        />
        <link rel="canonical" href="https://oneway8x.com/talelingo/privacy" />
      </Helmet>

      <Navbar />
      <main className="min-h-screen pt-20 md:pt-24 pb-12 md:pb-16">
        <article className="container mx-auto px-4 max-w-4xl">
          <Link to="/">
            <Button variant="ghost" className="mb-6 md:mb-8 -ml-2 md:-ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <header className="mb-8">
            <p className="text-sm text-muted-foreground mb-2">TaleLingo</p>
            <h1 className="mb-3 text-3xl md:text-5xl">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
          </header>

          <div className="markdown-content">
            <p>
              This Privacy Policy explains how TaleLingo, operated by oneway8x.com, collects,
              uses, shares, and protects information when you use the TaleLingo mobile app,
              website, and related services.
            </p>

            <h2>Contact</h2>
            <p>
              For privacy questions, data requests, or account deletion requests, contact us at{" "}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </p>

            <h2>Information We Collect</h2>
            <p>We may collect the following information:</p>
            <ul>
              <li>Account information, such as your email address and authentication status.</li>
              <li>
                Learning profile information, such as display name, app language, learner
                language, study language, level, and playback speed preferences.
              </li>
              <li>
                Learning activity, such as story progress, favorite stories, quiz attempts,
                saved vocabulary, review history, and training status.
              </li>
              <li>
                Purchase and subscription status from app store billing providers and RevenueCat.
              </li>
              <li>
                Technical information, such as app version, device type, operating system,
                diagnostics, crash reports, and server logs.
              </li>
              <li>
                Support messages or other information you choose to send us by email.
              </li>
            </ul>

            <h2>How We Use Information</h2>
            <p>We use information to:</p>
            <ul>
              <li>Create and manage your TaleLingo account.</li>
              <li>Provide stories, audio, vocabulary, quizzes, grammar notes, and training.</li>
              <li>Save your progress and sync learning data across sessions.</li>
              <li>Process subscriptions, restore purchases, and manage premium access.</li>
              <li>Improve app reliability, fix bugs, prevent abuse, and secure the service.</li>
              <li>Respond to support, privacy, and account requests.</li>
            </ul>

            <h2>Third-Party Services</h2>
            <p>
              We use trusted service providers to operate TaleLingo. These providers may process
              information on our behalf:
            </p>
            <ul>
              <li>Apple App Store and Google Play for purchases and subscription billing.</li>
              <li>RevenueCat for subscription entitlement management and purchase restoration.</li>
              <li>Sentry for crash reporting and error diagnostics.</li>
              <li>Hosting, database, email, storage, and infrastructure providers.</li>
              <li>
                AI and language-processing providers when needed to generate or improve learning
                content.
              </li>
            </ul>

            <h2>Sharing Information</h2>
            <p>
              We do not sell your personal information. We share information only when needed to
              operate TaleLingo, comply with law, protect users and the service, process payments,
              or complete a business transfer such as a merger or acquisition.
            </p>

            <h2>Data Retention</h2>
            <p>
              We keep account and learning data while your account is active or as needed to
              provide TaleLingo. We may retain limited records after deletion when required for
              legal, security, tax, accounting, billing, fraud prevention, or dispute-resolution
              purposes.
            </p>

            <h2>Account Deletion</h2>
            <p>
              You can request deletion of your TaleLingo account and associated personal data by
              emailing <a href={`mailto:${contactEmail}`}>{contactEmail}</a> from the email address
              linked to your account. We may need to verify your identity before completing the
              request.
            </p>

            <h2>Security</h2>
            <p>
              We use reasonable administrative, technical, and organizational safeguards designed
              to protect personal information. No online service can guarantee complete security.
            </p>

            <h2>Children</h2>
            <p>
              TaleLingo is not intended for children under 13. If you believe a child has provided
              personal information, contact us so we can review and delete it where appropriate.
            </p>

            <h2>International Use</h2>
            <p>
              Your information may be processed in countries other than where you live. When we
              transfer information internationally, we take steps intended to protect it according
              to this Privacy Policy and applicable law.
            </p>

            <h2>Your Rights</h2>
            <p>
              Depending on your location, you may have rights to access, correct, delete, restrict,
              or object to certain processing of your personal information. To make a request,
              contact <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </p>

            <h2>Changes</h2>
            <p>
              We may update this Privacy Policy from time to time. The updated version will be
              posted on this page with a new last updated date.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default TaleLingoPrivacy;
