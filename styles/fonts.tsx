import { Global } from "@emotion/react";

const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'Integral CF';
        font-style: normal;
        font-weight: 400;
        font-display: fallback;
        src: url('./fonts/IntegralCF-Regular.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Integral CF Italic';
        font-style: italic;
        font-weight: 400;
        font-display: fallback;
        src: url('./fonts/IntegralCF-RegularOblique.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Integral CF Bold';
        font-style: normal;
        font-weight: 600;
        font-display: fallback;
        src: url('./fonts/IntegralCF-Bold.woff2') format('woff2');
      }
    @font-face {
        font-family: 'Integral CF ExtraBold';
        font-style: normal;
        font-weight: 700;
        font-display: fallback;
        src: url('./fonts/IntegralCF-ExtraBold.woff2') format('woff2');
     }   
     @font-face {
        font-family: 'Integral CF Heavy';
        font-style: normal;
        font-weight: 900;
        font-display: fallback;
        src: url('./fonts/IntegralCF-Heavy.woff2') format('woff2');
     }   
     @font-face {
        font-family: 'Integral CF Medium';
        font-style: normal;
        font-weight: 500;
        font-display: fallback;
        src: url("./fonts/IntegralCF-Medium.woff2") format("woff2");
        url("./fonts/IntegralCF-Medium.woff") format("woff");
     }   
    `}
  />
);

export default Fonts;
