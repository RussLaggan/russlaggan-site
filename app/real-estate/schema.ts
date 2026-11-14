const ORIGIN = "https://www.russlaggan.com";

export const CITIES = [
  "Livonia",
  "Dearborn Heights",
  "Redford",
  "Westland",
  "Garden City",
  "Plymouth",
  "Canton",
  "Northville",
  "Farmington",
  "Farmington Hills",
  "Novi",
  "Southfield",
  "Royal Oak",
  "Troy",
  "West Bloomfield",
  "Bloomfield Township",
  "Birmingham",
] as const;

export const PROFILES = [
  { name: "Zillow", href: "https://www.zillow.com/profile/Russell%20Laggan" },
  { name: "Realty.com", href: "https://www.realty.com/real-estate-agents/4205141/russell_laggan" },
  { name: "HomeLight", href: "https://www.homelight.com/agents/russell-laggan-fl-03148352" },
  { name: "RealEstateAgent.com", href: "https://www.realestateagent.com/russell-laggan.html" },
  { name: "Instacard", href: "https://instacard.co/Russell-Laggan/home" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/rlaggan" },
] as const;

const sameAs = PROFILES.map((profile) => profile.href);

export const realEstateSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateAgent",
      "@id": `${ORIGIN}/real-estate#agent`,
      name: "Russ Laggan",
      alternateName: "Russell Scott Laggan",
      url: `${ORIGIN}/real-estate`,
      image: `${ORIGIN}/images/russ-home.webp`,
      email: "russ@russlaggan.com",
      description:
        "Russ Laggan, REALTOR®, is a licensed Michigan real estate agent with eXp Realty. He helps people buy and sell homes in Livonia and nearby communities.",
      areaServed: CITIES.map((name) => ({
        "@type": "City",
        name,
        containedInPlace: { "@type": "State", name: "Michigan" },
      })),
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "17:00",
        },
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Livonia",
        addressRegion: "MI",
        addressCountry: "US",
      },
      worksFor: {
        "@type": "RealEstateAgent",
        name: "eXp Realty LLC",
        address: {
          "@type": "PostalAddress",
          streetAddress: "39555 Orchard Hill Place, Suite 600",
          addressLocality: "Novi",
          addressRegion: "MI",
          postalCode: "48375",
          addressCountry: "US",
        },
        telephone: "+1-888-501-7085",
      },
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Licensure",
        name: "Michigan real estate license",
        identifier: "65010317013",
        recognizedBy: {
          "@type": "Organization",
          name: "Michigan Department of Licensing and Regulatory Affairs",
        },
      },
      memberOf: {
        "@type": "Organization",
        name: "National Association of REALTORS®",
      },
      sameAs,
    },
    {
      "@type": "Person",
      "@id": `${ORIGIN}/#person-agent`,
      name: "Russ Laggan",
      alternateName: ["Russell Laggan", "Russell Scott Laggan"],
      url: `${ORIGIN}/real-estate`,
      image: `${ORIGIN}/images/russ-home.webp`,
      email: "russ@russlaggan.com",
      jobTitle: "REALTOR®",
      worksFor: { "@id": `${ORIGIN}/real-estate#agent` },
      sameAs,
    },
  ],
};
