// منوی کناری
const toggleBtn = document.getElementById('menuToggle');
const sidebar = document.getElementById('menuItems');
toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  toggleBtn.textContent = sidebar.classList.contains('active') ? '✕' : '☰';
});

// آکاردئون تماس
const accordion = document.querySelector('.accordion');
const panel = document.querySelector('.panel');
accordion.addEventListener('click', () => {
  accordion.classList.toggle('active');
  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
    panel.classList.remove('open');
  } else {
    panel.style.maxHeight = panel.scrollHeight + "px";
    panel.classList.add('open');
  }
});
// -----------------------------
// دریافت داده‌های داینامیک از GAS
// توضیح: این بخش با fetch به URL GAS متصل می‌شود و داده‌ها را به صورت JSON دریافت می‌کند.
// برای صفحات دیگر کافی است URL شیت و ID عناصر HTML را تغییر دهی.
// -----------------------------

const sheetUrl = "https://script.google.com/macros/s/AKfycbw1sOfph6jbimcHdZ9H94DMLQIaqQ9H1Y5hEPre9C03VqK78PiELAJev8AENkUZDSgu/exec";

// ارسال درخواست به GAS و دریافت داده
fetch(sheetUrl)
  .then(res => res.json()) // تبدیل پاسخ به JSON
  .then(data => {
    // مثال: پر کردن آیفریم با لینک دریافتی
    const iframe = document.getElementById("demo-iframe");
    iframe.src = data.demoLink;         // لینک داینامیک از شیت
    iframe.onload = () => iframe.classList.add('loaded'); // افکت نمایش بعد از لود
  

    // ⚡ نکته برای توسعه:
    // اگر داده‌های بیشتری از GAS اضافه شود، کافی است به این شکل عناصر HTML را پر کنید:
    // document.getElementById("author").textContent = data.author;
    // document.getElementById("unit").textContent = data.unit;
    // و ... بر اساس فیلدهایی که در JSON برگشتی دارید
  })
  .catch(err => console.error("خطا در دریافت لینک پیش‌نمایش:", err)); // مدیریت خطا
