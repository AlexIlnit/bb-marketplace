import { Helmet } from "react-helmet-async";

export default function SEO({
  title,
  description,
  image,
  url
}) {
  return (
    <Helmet>
      {/* Основное SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph (Telegram / Facebook / WhatsApp) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* ОПТИМИЗАЦИЯ СЕТИ */}
      {/* Заранее подключаемся к серверу картинок (убирает задержку на DNS/TLS) */}
      <link rel="preconnect" href="https://res.cloudinary.com" />
      <link rel="dns-prefetch" href="https://res.cloudinary.com" />

      {/* 🔥 УЛЬТРА-ОПТИМИЗАЦИЯ ДЛЯ LCP */}
      {/* Если картинка передана, заставляем браузер качать её ПЕРВЫМ делом, параллельно с JS-скриптами */}
      {image && (
        <link 
          rel="preload" 
          fetchpriority="high" 
          as="image" 
          href={image} 
        />
      )}
    </Helmet>
  );
}
