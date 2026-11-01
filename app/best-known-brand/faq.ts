export const faq = [
  {
    q: "What do I have at the end of the month?",
    a: "A website marked up so Google and AI can read your business, a Google Business Profile and records that are corrected and agree with each other, and inquiry handling that sends a text, an email, and the file within minutes. It is built and running, not a plan on paper.",
  },
  {
    q: "Does the buildout lock my market?",
    a: "No. The single month has no lock. One client per category per Google Map Pack comes with the twelve-month Become Best Known program, and only while your market is open.",
  },
  {
    q: "Who is it for?",
    a: "Real estate agents and teams who already close and want their town's search working for them. Also mortgage lenders and brokers, CPA firms, and personal brands where the name is the product.",
  },
  {
    q: "How do I pay?",
    a: "One payment of $4,500 through Stripe's secure checkout. There is no subscription and nothing renews.",
  },
  {
    q: "What happens after I pay?",
    a: "We reach out within 1 business day to book your kickoff. At the kickoff we collect the access we need and start the build.",
  },
  {
    q: "Can I move to the twelve-month program?",
    a: "Yes, if your market is open. Become Best Known is $4,500 a month for twelve months. It holds your category in your Google Map Pack and keeps every system running and current.",
  },
  {
    q: "Do you guarantee rankings?",
    a: "No. Google and AI decide what they show, and nobody honest can promise a position. The buildout puts in place the things they read when they decide.",
  },
];

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};
