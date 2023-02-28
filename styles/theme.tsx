import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import type { StyleFunctionProps } from "@chakra-ui/styled-system";

const breakpoints = {
  sm: "380px",
  md: "720px",
  lg: "968px",
  xl: "1200px",
  "2xl": "1536px",
  "3xl": "1920px",
};

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
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
        // minHeight: "100vh",
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
          fontSize: "2.25rem",
          lineHeight: "100%",
        },
        heading: {
          fontFamily: "Integral CF",
          fontWeight: "400",
          fontStyle: "normal",
          fontSize: "2.25rem",
          lineHeight: "100%",
        },
        colored: {
          fontFamily: "Integral CF",
          fontWeight: "400",
          fontStyle: "normal",
          fontSize: "2.25rem",
          lineHeight: "100%",
          textShadow: "0px 4px 12px #518128",
        },
      },
    },
    Text: {
      variants: {
        paragraph: (props: StyleFunctionProps) => ({
          fontFamily: "Inter",
          color: props.colorMode === "dark" ? "#FFFFFF" : "#182112",
          opacity: "0.7",
          fontWeight: "400",
          fontStyle: "normal",
          fontSize: "1rem",
          lineHeight: "1.5rem",
        }),
      },
    },
    Button: {
      variants: {
        primary: (props: StyleFunctionProps) => ({
          bgColor: props.colorMode === "dark" ? "brand" : "#222222",
          color: props.colorMode === "dark" ? "#242524" : "#FFFFFF",
          _hover: {
            bgColor: props.colorMode === "dark" ? "#3EB751" : "#BBFF81",
          },
          borderRadius: "12px",
          fontFamily: "Integral CF",
          fontWeight: "400",
          fontStyle: "normal",
          w: "155px",
          h: "48px",
        }),
        secondary: (props: StyleFunctionProps) => ({
          bgColor: props.colorMode === "dark" ? "#FFFFFF" : "#E6E6E6",
          color: props.colorMode === "dark" ? "#182112" : "#222222",
          _hover: {
            bgColor: props.colorMode === "dark" ? "#cccccc" : "#E6E6E6",
          },
          borderRadius: "12px",
          fontFamily: "Integral CF",
          fontWeight: "400",
          fontStyle: "normal",
          w: "155px",
          h: "48px",
        }),
        tertiary: {
          bgColor: "#FFFFFF",
          color: "#182112",
          _hover: {
            bgColor: "#cccccc",
          },
          borderRadius: "12px",
          fontFamily: "Inter",
          fontWeight: "600",
          fontStyle: "normal",
          width: "full",
          fontSize: "1.25rem",
        },
      },
    },
  },
};

const theme = extendTheme(customTheme);

export default theme;
