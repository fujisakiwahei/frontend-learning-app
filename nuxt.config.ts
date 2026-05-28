export default defineNuxtConfig({
  compatibilityDate: "2026-05-28",
  devtools: { enabled: true },
  ssr: true,

  modules: ["@pinia/nuxt", "@nuxt/icon", "@nuxt/eslint"],

  css: [
    "~/assets/css/reset.css",
    "~/assets/css/tokens.css",
    "~/assets/css/typography.css",
    "~/assets/css/global.css",
  ],

  app: {
    head: {
      htmlAttrs: { lang: "ja" },
      title: "frontend-learning-app",
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&family=Noto+Sans+JP:wght@400;700;800&display=swap",
        },
      ],
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  eslint: {
    config: {
      stylistic: false,
    },
  },
});
