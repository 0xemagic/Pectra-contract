import { Html, Head, Main, NextScript } from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'
import theme from '../styles/theme'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <link
            rel="preload"
            href="/fonts/IntegralCF-Regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
           <link
            rel="preload"
            href="/fonts/IntegralCF-RegularOblique.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
            <link
            rel="preload"
            href="/fonts/IntegralCF-Bold.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
            <link
            rel="preload"
            href="/fonts/IntegralCF-ExtraBold.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
            <link
            rel="preload"
            href="/fonts/IntegralCF-Heavy.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
            <link
            rel="preload"
            href="/fonts/IntegralCF-Medium.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
       </Head> 
      <body>
        <Main />
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <NextScript />
      </body>
    </Html>
  )
}
