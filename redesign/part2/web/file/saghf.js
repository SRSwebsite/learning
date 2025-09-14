document.querySelectorAll(".accordion-header").forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const isActive = item.classList.contains("active");
      const siblings = Array.from(item.parentElement.children).filter(child => child !== item && child.classList.contains("accordion-item"));
      siblings.forEach(sibling => sibling.classList.remove("active"));
      item.classList.toggle("active", !isActive);
    });
  });