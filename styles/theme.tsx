import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const breakpoints = {
  sm: "380px",
  md: "720px",
  lg: "968px",
  xl: "1200px",
  "2xl": "1536px",
  "3xl": "1920px",
};

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

export const customTheme = {
  config,
  breakpoints,
  styles: {
    global: {
      html: {
        scrollBehavior: "smooth",
        fontDisplay: "swap",
      },
      body: {
        minHeight: "100vh",
      },
      svg: {
        display: "inline",
        verticalAlign: "bottom",
      },
    },
  },
  fonts: {
    heading: "Integral CF",
    body: "InterVariable",
  },
  colors: {
    transparent: "transparent",
    black: "#111A0C",
    white: "#FFFFFF",
    brand: "#ACE075",
  },
  components: {
    Heading: {
      variants: {
        hero: {
            fontFamily: "Integral CF Medium",
            fontStyle: "normal",
            fontSize: "100px",
            lineHeight: "100%",
        },
        heading: {
          fontFamily: "Integral CF",
          fontWeight: "400",
          fontStyle: "normal",
          fontSize: "37px",
          lineHeight: "100%",
        },
        colored: {    
            fontFamily: "Integral CF",
            fontWeight: "400",
            fontStyle: "normal",
            fontSize: "37px",
            lineHeight: "100%",
            textShadow: "0px 4px 12px #518128",
        },
        },
      },
    },
    Text: {
      variants: {
        paragraph: {
          fontFamily: "Inter",
          fontWeight: "400",
          fontStyle: "normal",
          fontSize: "1rem",
          lineHeight: "1.5rem",
        },
      },
  },
};

const theme = extendTheme(customTheme);

export default theme;
