// Standalone page controls. The homepage has its own section navigation script.
(() => {
  const nav = document.querySelector(".greedy-nav");
  if (nav) {
    const button = nav.querySelector("button");
    const visible = nav.querySelector(".visible-links");
    const overflow = nav.querySelector(".hidden-links");

    function updateNavigation() {
      while (overflow.firstElementChild) visible.append(overflow.firstElementChild);
      button.classList.add("hidden");
      overflow.classList.add("hidden");
      button.classList.remove("close");
      button.setAttribute("aria-expanded", "false");
      if (visible.offsetWidth > nav.clientWidth) {
        button.classList.remove("hidden");
        const available = nav.clientWidth - button.offsetWidth - 30;
        while (visible.offsetWidth > available && visible.children.length > 1) {
          overflow.prepend(visible.lastElementChild);
        }
      }
      button.setAttribute("count", overflow.children.length);
    }

    button.addEventListener("click", () => {
      const expanded = overflow.classList.toggle("hidden") === false;
      button.classList.toggle("close", expanded);
      button.setAttribute("aria-expanded", String(expanded));
    });
    nav.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      overflow.classList.add("hidden");
      button.classList.remove("close");
      button.setAttribute("aria-expanded", "false");
      button.focus();
    });
    new ResizeObserver(updateNavigation).observe(nav);
    updateNavigation();
  }

  const profileButton = document.querySelector(".author__urls-wrapper button");
  if (profileButton) {
    const links = document.querySelector(".author__urls");
    const desktop = window.matchMedia("(min-width: 925px)");
    function updateProfile() {
      links.style.display = desktop.matches ? "block" : "none";
      profileButton.setAttribute("aria-expanded", String(desktop.matches));
    }
    profileButton.addEventListener("click", () => {
      const expanded = profileButton.getAttribute("aria-expanded") !== "true";
      links.style.display = expanded ? "block" : "none";
      profileButton.classList.toggle("open", expanded);
      profileButton.setAttribute("aria-expanded", String(expanded));
    });
    desktop.addEventListener("change", updateProfile);
    updateProfile();
  }

  const imageLinks = Array.from(document.querySelectorAll("a[href]"))
    .filter((link) => /\.(jpe?g|png|gif)$/i.test(new URL(link.href).pathname));
  if (!imageLinks.length) return;

  const dialog = document.createElement("dialog");
  dialog.className = "image-viewer";
  dialog.setAttribute("aria-label", "Image viewer");
  const image = document.createElement("img");
  const controls = document.createElement("div");
  controls.className = "image-viewer__controls";
  let current = 0;
  function showImage(index) {
    current = (index + imageLinks.length) % imageLinks.length;
    const link = imageLinks[current];
    image.src = link.href;
    image.alt = link.querySelector("img")?.alt || link.textContent.trim();
  }
  for (const [label, action] of [
    ["Previous image", () => showImage(current - 1)],
    ["Next image", () => showImage(current + 1)],
    ["Close", () => dialog.close()],
  ]) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", action);
    controls.append(button);
  }
  dialog.append(image, controls);
  document.body.append(dialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showImage(current - 1);
    if (event.key === "ArrowRight") showImage(current + 1);
  });
  imageLinks.forEach((link, index) => link.addEventListener("click", (event) => {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showImage(index);
    dialog.showModal();
  }));
})();
