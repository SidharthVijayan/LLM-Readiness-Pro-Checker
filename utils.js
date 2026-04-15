function rewriteText(text) {
  if (!text) return "No content";

  if (text.length > 200) {
    return text.split(".").map(t => "• " + t.trim()).join("\n");
  }

  return "Answer: " + text;
}
