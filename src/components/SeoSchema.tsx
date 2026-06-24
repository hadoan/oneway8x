import { Helmet } from "react-helmet-async";

const SeoSchema = () => {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Ha Doan",
    "url": "https://oneway8x.com",
    "jobTitle": "Founder-Engineer, Former CTO, AI Product Builder",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Berlin",
      "addressCountry": "Germany"
    },
    "sameAs": [
      "https://linkedin.com/in/oneway8x",
      "https://github.com/oneway8x"
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Oneway8X",
    "url": "https://oneway8x.com",
    "founder": {
      "@type": "Person",
      "name": "Ha Doan"
    }
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Ha Doan — Founder-Engineer, Former CTO, AI Product Builder",
    "url": "https://oneway8x.com"
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": personSchema
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify([personSchema, organizationSchema, webSiteSchema, profilePageSchema])}
      </script>
    </Helmet>
  );
};

export default SeoSchema;
