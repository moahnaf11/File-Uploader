const urlDiv = document.querySelector('[data-id="url"]');

const copyButton = document.querySelector('[data-id="copy-button"]');
copyButton.addEventListener("click", async (e) => {
  const urlText = urlDiv.textContent.trim();
  try {
    await navigator.clipboard.writeText(urlText);
    alert("Url copied to clipboard");
  } catch (err) {
    console.log("failed to copy", err);
  }
});
