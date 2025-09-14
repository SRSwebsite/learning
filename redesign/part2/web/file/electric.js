document.querySelectorAll(".accordion-header").forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const isActive = item.classList.contains("active");

      // بستن بقیه
      const siblings = Array.from(item.parentElement.children).filter(
        child => child !== item && child.classList.contains("accordion-item")
      );
      siblings.forEach(sibling => sibling.classList.remove("active"));

      // باز یا بسته کردن فعلی
      item.classList.toggle("active", !isActive);
    });
  });