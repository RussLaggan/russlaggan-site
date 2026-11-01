export const faq = [
  {
    q: "What do I have at the end of the month?",
    a: "A website marked up so Google and AI can read your business, your Google Business Profile and directory records corrected and kept current, every inquiry answered with a text, an email, and the file or quote in minutes, and AI training that saves 5 to 10 hours a week.",
  },
  {
    q: "Who owns the website?",
    a: "You do. The website we build during your month is yours.",
  },
  {
    q: "Does the buildout lock my market?",
    a: "No. The single month does not include market exclusivity. The twelve-month plan holds your category in your pack.",
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
    a: "You get a Stripe receipt by email, and we reach out within 1 business day to book your kickoff.",
  },
  {
    q: "Can I move to the twelve-month program?",
    a: "Yes, if your market is open. The twelve-month plan holds your category in your pack. Check whether your market is open at bestknownbrand.com.",
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
