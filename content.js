chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {

  if (req.action === "analyze") {

    const text = document.body.innerText || "";
    const words = text.split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter(Boolean);

    const wordCount = words.length;
    const avgSentence = sentences.length ? wordCount / sentences.length : 0;

    const unique = new Set(words);
    const redundancy = 1 - unique.size / wordCount;

    const h2 = document.querySelectorAll("h2").length;
    const lists = document.querySelectorAll("ul, ol").length;

    const hasFAQ = /faq/i.test(text);
    const hasCTA = /buy|contact|sign up/i.test(text);

    let markdown = 100 - (h2 === 0 ? 25 : 0) - (lists === 0 ? 15 : 0);
    let extract = 100 - (!hasFAQ ? 20 : 0);
    let token = 100 - (avgSentence > 25 ? 20 : 0) - (redundancy > 0.3 ? 25 : 0);
    let conversion = 100 - (!hasCTA ? 30 : 0);

    const finalScore = Math.round(
      markdown * 0.3 +
      extract * 0.3 +
      token * 0.25 +
      conversion * 0.15
    );

    sendResponse({
      llm_readiness_score: finalScore,
      scores: {
        markdown,
        extractability: extract,
        token_efficiency: token,
        conversion
      },
      stats: { wordCount, avgSentence, redundancy },
      top_issues: [
        h2 === 0 && "Missing headings",
        !hasFAQ && "No FAQ",
        avgSentence > 25 && "Long sentences"
      ].filter(Boolean),
      quick_fixes: [
        "Add H2 sections",
        "Add FAQ",
        "Break paragraphs"
      ]
    });

  }

  return true;
});
