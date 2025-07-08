const gasUrl = "https://script.google.com/macros/s/AKfycbzLviqKjelz2rZL29qmqkf7N2s0kQy4r-nX_X8V7zu0jiwRRGuboMiQomECkf2_Rpay/exec";

function fetchData() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("loginError");
  const container = document.getElementById("accordionContainer");
  const welcome = document.getElementById("welcomeUser");

  errorBox.innerText = "";
  container.innerHTML = "";
  welcome.innerHTML = "";

  if (!username || !password) {
    errorBox.innerText = "لطفاً نام کاربری و رمز عبور را وارد کنید.";
    return;
  }

  const url = `${gasUrl}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        errorBox.innerText = data.error;
        return;
      }

      // نمایش نام کاربر و سطح دسترسی
      welcome.innerText = `خوش آمدید، ${data.user} (سطح دسترسی شما به محتوی جلسات این دور: ${data.level || "ندارد"})`;

      const contentData = data.content || [];
      if (contentData.length === 0) {
        container.innerHTML = "<em>محتوایی برای شما موجود نیست.</em>";
        return;
      }

      contentData.forEach((item, index) => {
        const accordion = document.createElement("div");
        accordion.className = "accordion";

        const header = document.createElement("div");
        header.className = "accordion-header";

        const panelNumber = index + 1;
        header.innerHTML = `
          <span style="margin-right: 10px; font-weight: bold; color: #333;">${panelNumber}.</span>
          <span style="flex:1;">${item.title}</span>
          <span style="margin: 0 10px; color: #666;">${item.date}</span>
          <span class="status-container">${getStatusIcon(item.status)}</span>
        `;

        const content = document.createElement("div");
        content.className = "accordion-content";
        content.style.display = "none";  // پیش‌فرض مخفی باشد

        const videoUrl = item.videoId ? `https://drive.google.com/file/d/${item.videoId}/preview` : null;
        const videoDownload = item.videoId ? `https://drive.google.com/uc?export=download&id=${item.videoId}` : null;
        const zipDownload = item.zipFileId ? `https://drive.google.com/uc?export=download&id=${item.zipFileId}` : null;
        const webglUrl = item.webglEmbed || ""; // ستون G

        const tabId = `tabs-${index}`;
        const tabs = `
          <div class="tabs">
            <div class="tab active" data-tab="${tabId}-desc">توضیحات</div>
            <div class="tab" data-tab="${tabId}-video">ویدیو</div>
            <div class="tab" data-tab="${tabId}-webgl">3D</div>
            <div class="tab" data-tab="${tabId}-downloads">دانلودها</div>
          </div>
          <div class="tab-content active" id="${tabId}-desc">
            ${item.content || "<em>بدون توضیحات</em>"}
          </div>
          <div class="tab-content" id="${tabId}-video">
            ${videoUrl ? `<iframe src="${videoUrl}" width="100%" height="300" allow="autoplay" style="border:none; border-radius:8px;"></iframe>` : "<em>ویدیو موجود نیست</em>"}
          </div>
          <div class="tab-content" id="${tabId}-webgl">
            ${webglUrl ? `<iframe src="${webglUrl}" width="100%" height="300" style="border:none; border-radius:8px;"></iframe>` : "سه بعدی در دسترس نیست</em>"}
          </div>
          <div class="tab-content" id="${tabId}-downloads">
            ${videoDownload ? `<a href="${videoDownload}" target="_blank" class="download-button"><i class="fas fa-download"></i> دانلود ویدیو</a>` : ""}
            ${zipDownload ? `<a href="${zipDownload}" target="_blank" class="download-button zip-download"><i class="fas fa-file-archive"></i> دانلود فایل پروژه</a>` : ""}
          </div>
        `;

        content.innerHTML = tabs;

        // باز و بسته شدن آکاردئون
        header.addEventListener("click", () => {
          header.classList.toggle("active");
          content.style.display = content.style.display === "block" ? "none" : "block";
        });

        // رویداد تب‌ها
        setTimeout(() => {
          content.querySelectorAll(".tab").forEach(tab => {
            tab.addEventListener("click", () => {
              const parent = tab.parentElement;
              const contents = content.querySelectorAll(".tab-content");
              const tabs = parent.querySelectorAll(".tab");

              tabs.forEach(t => t.classList.remove("active"));
              contents.forEach(c => c.classList.remove("active"));

              tab.classList.add("active");
              const tabContent = content.querySelector(`#${tab.dataset.tab}`);
              if (tabContent) tabContent.classList.add("active");
            });
          });
        }, 0);

        accordion.appendChild(header);
        accordion.appendChild(content);
        container.appendChild(accordion);
      });
    })
    .catch(err => {
      errorBox.innerText = "خطا در ارتباط با سرور.";
      console.error(err);
    });
}
 
 function getStatusIcon(status) {
  switch (status) {
    case "عمومی":
      return `<span title="دسترسی عمومی">🆓</span>`;
    case "نیمه":
      return `<span title="دسترسی نیمه">💸</span>`;
    case "کامل":
      return `<span title="دسترسی کامل">💰</span>`;
    default:
      return `<span title="نامشخص">❓</span>`;
  }
}
// ✅ JavaScript
function toggleLoginAccordion() {
  const header = document.querySelector('.login-header');
  const content = document.getElementById('loginContent');
  header.classList.toggle('active');
  if (content.style.maxHeight) {
    content.style.maxHeight = null;
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
  }
}
 function hardReload() {
    location.reload();
  }