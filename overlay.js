document.querySelectorAll("p").forEach(p => {
  if (p.innerText.split(" ").length > 120) {
    p.style.background = "rgba(255,0,0,0.08)";
  }
});
