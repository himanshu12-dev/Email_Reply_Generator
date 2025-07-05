console.log("Email-writer");

function createAIButton() {
  const button = document.createElement("div");
  button.innerHTML = "AI Reply";
  button.className = "T-I J-J5-Ji aoO v7 T-I-atl L3";
  button.style.marginRight = "8px";
  button.setAttribute("role", "button");
  button.setAttribute("data-tooltip", "Generate AI Reply");
  button.classList.add("ai-reply-btn");
  return button;
}

function findToolBar() {
  const selectors = [".btC", ".aDh", '[role="toolbar"]', ".gU.Up"];

  for (selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) {
      return toolbar;
    }
  }
  return null;
}

function getEmailContent() {
  const selectors = [
    ".h7",
    ".a3s.ail",
    ".gmail_quote",
    '[role="presentation"]',
  ];
  for (selector of selectors) {
    const content = document.querySelector(selector);
    if (content) {
      return content.innerText.trim();
    }
  }
  return "";
}

function injectButton() {
  const button = document.querySelector(".ai-reply-btn");
  if (button) button.remove();

  const toolbar = findToolBar();
  if (!toolbar) {
    console.log("Tool bar not found");
    return;
  }
  console.log("Tool bar found, creating AI button");
  const btn = createAIButton();
  btn.addEventListener("click", async () => {
    try {
      btn.innerHTML = "Generating...";
      btn.disabled = true;

      const emailContent = getEmailContent();

      const response = await fetch("http://localhost:8080/api/gen-Email", {
        method: "POST",
        headers: "content-type: application/json",
        body: JSON.stringify({
          emailContent: emailContent,
          tone: "professional",
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }
      const generatedReply = await response.text();
      const composeBox = document.querySelector(
        '[role="textbox"][contenteditable="true"]'
      );
      if (composeBox) {
        composeBox.focus();
        document.execCommand("insertText", false, generatedReply);
      } else {
        console.error("compose box not found");
      }
    } catch (error) {
      console.error(error);
      alert("failed to generate reply");
    } finally {
      btn.innerHTML = "AI Reply";
      btn.disabled = false;
    }
  });
  toolbar.insertBefore(btn, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const addedNodes = Array.from(mutation.addedNodes);
    const hasComposeElements = addedNodes.some(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node.matches('.aDh, .btC, [role="dialog"]') ||
          node.querySelector('.aDh, .btC, [role="dialog"]'))
    );
    if (hasComposeElements) {
      console.log("Compose Window detected");
      setTimeout(injectButton, 500);
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });
