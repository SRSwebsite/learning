 const urlParams = new URLSearchParams(window.location.search);
    const adminId = urlParams.get("admin_id") || "خانم نرگس ملایی";
    document.getElementById("adminIdTitle").innerText = adminId;

    const scriptURL = "https://script.google.com/macros/s/AKfycbwnPKwvI7sQRaVazbXyFru72Z7YzaIq8EZ1PY93Bk6LWf8npYUHBiBcfaFOhyxo8wax/exec"; // ← لینک GAS

    function getStatusLabel(payment) {
      if (!payment || payment === "❌") return `<span class="status unpaid">ثبت‌نام ناقص ❌</span>`;
      if (payment === "✅") return `<span class="status paid">پرداخت کامل ✅</span>`;
      if (payment === "🔄") return `<span class="status installment">پرداخت اقساطی 🔄</span>`;
      return `<span class="status">${payment}</span>`;
    }

    fetch(`${scriptURL}?admin_id=${adminId}`)
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById("accordionContainer");
        container.innerHTML = "";

        if (data.length === 0) {
          container.innerHTML = "<p>هیچ ثبت‌نامی برای این ادمین یافت نشد.</p>";
          return;
        }

        data.forEach((item, index) => {
          const acc = document.createElement("button");
          acc.className = "accordion";
          acc.innerHTML = `👤 ${item.name} ${item.family} — ${getStatusLabel(item.payment)}`;

          const panel = document.createElement("div");
          panel.className = "panel";
          panel.innerHTML = `
            <p><strong>تاریخ ثبت‌نام:</strong> ${item.date}</p>
            <p><strong>عنوان دوره:</strong> ${item.course}</p>
            <p><strong>وضعیت پرداخت:</strong> ${getStatusLabel(item.payment)}</p>
          `;

          acc.addEventListener("click", function () {
            this.classList.toggle("active");
            panel.style.display = panel.style.display === "block" ? "none" : "block";
          });

          container.appendChild(acc);
          container.appendChild(panel);
        });
      })
      .catch(err => {
        document.getElementById("accordionContainer").innerHTML = "خطا در بارگذاری اطلاعات.";
        console.error(err);
      });
	  
// جلوگیری از کش با reload دستی
function hardReload() {
  const currentUrl = window.location.href.split('?')[0];
  const newUrl = `${currentUrl}?reload=${new Date().getTime()}`;
  window.location.href = newUrl;
}

