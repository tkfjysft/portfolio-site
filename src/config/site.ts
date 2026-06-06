// src/config/site.ts

export const siteConfig = {
name: "K.",
  role: "DTP Designer / Operator",
  description: "これまでの実務案件につきましては守秘義務の関係上、公開を控えさせていただいております。本サイトでは、実務と同等の要件・ターゲットを想定し、新たに制作したデザインサンプルを掲載しております。構成からデザインまで、実務を強く意識したクオリティを追求しておりますので、ぜひご高覧いただけますと幸いです。",
  copyright: "© 2026 RYOTA KONDO All Rights Reserved.",
  links: {
    mail: "your-email@example.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
