export const faq = [
  {
    q: "What do I have at the end of the month?",
    a: "Four 45-minute one-on-one training sessions, the Claude desktop app installed with instruction on Claude Cowork and Claude Code, your website built out or optimized together, a HighLevel sub-account for social media posting, and training on your Google Business Profile, editing video with Claude Code, and researching social content with Claude.",
  },
  {
    q: "Who owns the website?",
    a: "You do. The website we build during your month is yours.",
  },
  {
    q: "What do I need to provide?",
    a: "Your domain or website access, your business details, social logins, and a computer for Claude, and time for the kickoff and sessions.",
  },
  {
    q: "Who is it for?",
    a: "Real estate agents and teams, mortgage lenders and brokers, CPA firms, and personal brands who want to put Claude to work in their business.",
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
    a: "Yes. At the end of the month, you decide whether to continue with the twelve-month plan.",
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
