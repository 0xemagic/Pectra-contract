import { Global } from '@emotion/react'

const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'Integral CF';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('./fonts/IntegralCF-Regular.otf') format('otf');
      }
      @font-face {
        font-family: 'Integral CF Italic';
        font-style: italic;
        font-weight: 400;
        font-display: swap;
        src: url('../public/fonts/IntegralCF-RegularOblique.otf') format('otf');
      }
      @font-face {
        font-family: 'Integral CF Bold';
        font-style: normal;
        font-weight: 600;
        font-display: swap;
        src: url('./fonts/IntegralCF-Bold.otf') format('otf');
      }
    @font-face {
        font-family: 'Integral CF ExtraBold';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url('../public/fonts/IntegralCF-ExtraBold.otf') format('otf');
     }   
     @font-face {
        font-family: 'Integral CF Heavy';
        font-style: normal;
        font-weight: 900;
        font-display: swap;
        src: url('../public/fonts/IntegralCF-Heavy.otf') format('otf');
     }   
     @font-face {
        font-family: 'Integral CF Medium';
        font-style: normal;
        font-weight: 500;
        font-display: swap;
        src: url('./fonts/IntegralCF-Medium.otf') format('otf');
     }   
    `}
  />
)

export default Fonts