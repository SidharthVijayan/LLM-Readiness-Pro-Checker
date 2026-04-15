chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {

  if (req.action === "analyze") {

    try {
      const text = document.body?.innerText || "";

      if (!text || text.length < 50) {
        sendResponse({ error: "No readable content" });
        return;
      }

      const words = text.split(/\s+/);
      const unique = new Set(words);

      const redundancy = 1 - unique.size / words.length;

      const sentences = text.split(/[.!?]+/).filter(Boolean);
      const avgSentence = sentences.length
        ? words.length / sentences.length
        : 0;

      const h2s = [...document.querySelectorAll("h2")];

      const sections = h2s.map(h2 => ({
        title: h2.innerText || "Section",
        score: 80,
        issues: [],
        rewrite: "Content can be improved with bullets and clarity"
      }));

      const result = {
        llm_readiness_score: 70,
        scores: {
          markdown: h2s.length ? 80 : 60,
          extractability: text.includes("faq") ? 80 : 60,
          token_efficiency: redundancy < 0.3 ? 80 : 60,
          conversion: text.includes("contact") ? 80 : 60
        },
        sections,
        top_issues: ["Structure can improve", "No FAQ"],
        quick_fixes: ["Add headings", "Add FAQ"]
      };

      sendResponse(result);

    } catch (e) {
      console.error("LLM Analyzer Error:", e);
      sendResponse({ error: "Script failed" });
    }
  }

  return true;
});
