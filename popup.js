chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

  chrome.tabs.sendMessage(
    tabs[0].id,
    { action: "analyze" },
    function (res) {

      if (chrome.runtime.lastError) {
        console.error("Message error:", chrome.runtime.lastError);
        document.getElementById("score").innerText = "ERR";
        return;
      }

      if (!res || res.error) {
        document.getElementById("score").innerText = "No Data";
        return;
      }

      // NORMAL FLOW
      const score = res.llm_readiness_score;

      document.getElementById("score").innerText = score;

      const deg = score * 3.6;
      document.getElementById("ring").style.background =
        `conic-gradient(#6366f1 ${deg}deg, #1e293b ${deg}deg)`;

      document.getElementById("markdown").innerText = res.scores.markdown;
      document.getElementById("extract").innerText = res.scores.extractability;
      document.getElementById("token").innerText = res.scores.token_efficiency;
      document.getElementById("conversion").innerText = res.scores.conversion;
    }
  );

});
