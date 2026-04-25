import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const contactEmail = "talelingo@oneway8x.com";
const lastUpdated = "April 25, 2026";

const TaleLingoTerms = () => {
  return (
    <>
      <Helmet>
        <title>TaleLingo Terms of Service | oneway8x.com</title>
        <meta
          name="description"
          content="Terms of Service for the TaleLingo language learning app."
        />
        <link rel="canonical" href="https://oneway8x.com/talelingo/terms" />
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
            <h1 className="mb-3 text-3xl md:text-5xl">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
          </header>

          <div className="markdown-content">
            <p>
              These Terms of Service govern your access to and use of TaleLingo, a language
              learning app operated by oneway8x.com. By using TaleLingo, you agree to these Terms.
              If you do not agree, do not use the app.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these Terms can be sent to{" "}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </p>

            <h2>Using TaleLingo</h2>
            <p>
              TaleLingo provides story-based language learning, audio, vocabulary, grammar notes,
              quizzes, and training tools. You are responsible for keeping your account access
              secure and for all activity under your account.
            </p>

            <h2>Accounts</h2>
            <p>
              You must provide accurate information when signing in or creating an account. We may
              suspend or terminate accounts that violate these Terms, abuse the service, attempt to
              bypass access controls, or interfere with other users.
            </p>

            <h2>Subscriptions and Purchases</h2>
            <p>
              TaleLingo may offer free and paid features. Paid subscriptions and in-app purchases
              are processed through Apple App Store, Google Play, or other authorized billing
              providers. Pricing, renewal, cancellation, refunds, and payment methods are governed
              by the billing provider terms that apply to your purchase.
            </p>
            <p>
              You can cancel a subscription through the app store account settings for the platform
              where you purchased it. Deleting the app or your account does not automatically cancel
              an active app store subscription.
            </p>

            <h2>Learning Content</h2>
            <p>
              TaleLingo content is provided for educational purposes. We work to keep content useful
              and accurate, but we do not guarantee that every translation, grammar note,
              pronunciation, quiz answer, or AI-assisted explanation will be error-free.
            </p>

            <h2>Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use TaleLingo for unlawful, harmful, deceptive, or abusive purposes.</li>
              <li>Copy, scrape, resell, or redistribute app content without permission.</li>
              <li>Reverse engineer, disrupt, overload, or attack the app or related services.</li>
              <li>Bypass payment, subscription, authentication, or security controls.</li>
              <li>Upload or submit content that infringes rights or violates law.</li>
            </ul>

            <h2>Intellectual Property</h2>
            <p>
              TaleLingo, including its app design, software, branding, stories, exercises, and
              learning materials, is owned by us or our licensors and is protected by intellectual
              property laws. These Terms do not transfer ownership rights to you.
            </p>

            <h2>Feedback</h2>
            <p>
              If you send ideas, suggestions, or feedback, you allow us to use them without
              restriction or compensation to improve TaleLingo.
            </p>

            <h2>Service Changes</h2>
            <p>
              We may update, change, suspend, or discontinue parts of TaleLingo at any time. We may
              also change features, supported languages, pricing, or availability.
            </p>

            <h2>Disclaimers</h2>
            <p>
              TaleLingo is provided "as is" and "as available." To the fullest extent permitted by
              law, we disclaim warranties of merchantability, fitness for a particular purpose,
              non-infringement, uninterrupted availability, and error-free operation.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, we will not be liable for indirect,
              incidental, special, consequential, exemplary, or punitive damages, or for lost
              profits, data, goodwill, or business opportunities arising from your use of TaleLingo.
            </p>

            <h2>Termination</h2>
            <p>
              You may stop using TaleLingo at any time. We may suspend or terminate access if we
              reasonably believe you violated these Terms or created risk for the service, users, or
              us.
            </p>

            <h2>Privacy</h2>
            <p>
              Our <Link to="/talelingo/privacy">Privacy Policy</Link> explains how we collect, use,
              and protect information when you use TaleLingo.
            </p>

            <h2>Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. The updated version will be posted on
              this page with a new last updated date. Continued use of TaleLingo after changes means
              you accept the updated Terms.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default TaleLingoTerms;
