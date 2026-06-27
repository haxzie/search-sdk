import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

// Flat, low-contrast theme tuned to the site's neutral dark palette.
export const flatDark = createTheme({
  theme: "dark",
  settings: {
    background: "transparent",
    backgroundImage: "",
    foreground: "#e4e4e7",
    caret: "#e4e4e7",
    selection: "#27272a",
    selectionMatch: "#27272a",
    lineHighlight: "transparent",
    gutterBackground: "transparent",
    gutterForeground: "#52525b",
    gutterBorder: "transparent",
  },
  styles: [
    { tag: t.comment, color: "#6b7280", fontStyle: "italic" },
    { tag: [t.string, t.special(t.string)], color: "#9ece6a" },
    { tag: [t.number, t.bool, t.null], color: "#e0af68" },
    { tag: [t.keyword, t.operatorKeyword, t.modifier], color: "#bb9af7" },
    { tag: [t.definitionKeyword, t.controlKeyword], color: "#bb9af7" },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "#7aa2f7" },
    { tag: [t.propertyName], color: "#7dcfff" },
    { tag: [t.variableName, t.attributeName], color: "#e4e4e7" },
    { tag: [t.typeName, t.className, t.namespace], color: "#2ac3de" },
    { tag: [t.punctuation, t.separator, t.bracket], color: "#a1a1aa" },
    { tag: [t.operator], color: "#89ddff" },
    { tag: [t.tagName], color: "#f7768e" },
    { tag: [t.meta], color: "#7aa2f7" },
  ],
});
