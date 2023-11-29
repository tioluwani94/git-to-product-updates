import { theme as proTheme } from "@chakra-ui/pro-theme";
import { extendTheme, theme as baseTheme } from "@chakra-ui/react";
import "@fontsource/inter/variable.css";

export const theme = extendTheme(
  {
    fonts: {
      heading: "'InterVariable', -apple-system, system-ui, sans-serif",
      body: "'InterVariable', -apple-system, system-ui, sans-serif",
    },
    colors: {
      ...baseTheme.colors,
      brand: baseTheme.colors.blue,
      linear: "#5e6ad2",
    },
  },
  proTheme
);
