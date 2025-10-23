// دریافت المان‌های HTML برای دکمه منو و سایدبار
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

// زمانی که روی دکمه منو کلیک می‌شود، کلاس مربوط به مخفی‌سازی سایدبار را فعال/غیرفعال می‌کنیم
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("translate-x-full"); // در Tailwind CSS برای نمایش/مخفی‌سازی از کلاس translate-x-full استفاده می‌شود
});

// تابعی برای نمایش تب‌های مختلف (مثلاً اطلاعات، دوره‌ها، وضعیت تحصیلی)
function showTab(tabId) {
  // ابتدا همه تب‌ها را مخفی می‌کنیم
  document.getElementById("infoTab").classList.add("hidden");
  document.getElementById("coursesTab").classList.add("hidden");
  document.getElementById("statusTab").classList.add("hidden"); // 👈 اضافه شده برای پنهان کردن تب وضعیت


  // فقط تب مربوط به tabId را نمایش می‌دهیم
  document.getElementById(tabId).classList.remove("hidden");

  // اگر صفحه کوچک‌تر از 768px بود (یعنی موبایل)، سایدبار را مخفی کن
  if (window.innerWidth < 768) {
    sidebar.classList.add("translate-x-full");
  }
}
// آدرس API اسکریپت Google Apps Script
const scriptURL = "https://script.google.com/macros/s/AKfycbxsOGADykPylH1luwax8kG7mlwfoVg0dSJMUyKQuTjLHa7p0aGoVYHBG7c0HXVAh49j/exec";

function generateCaptcha() {
  const captchaEl = document.getElementById("captchaCode");
  if (!captchaEl) return; // اگر المان هنوز وجود ندارد کاری نکن

  const code = Math.random().toString(36).substring(2, 6);
  captchaEl.textContent = code;
  return code;
}

// وقتی صفحه لود شد
document.addEventListener("DOMContentLoaded", generateCaptcha);


// تابع ورود (Login)
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const captchaInput = document.getElementById("captchaInput").value.trim();
  const loginMsg = document.getElementById("loginMsg");

  // بررسی ورود خالی
  if (!username || !password) {
    loginMsg.innerText = "لطفاً یوزرنیم و پسورد را وارد کنید.";
    return;
  }

  // بررسی کپچا
  if (captchaInput !== document.getElementById("captchaCode").textContent) {
    loginMsg.innerText = "کد امنیتی نادرست است.";
    generateCaptcha(); // تولید کپچای جدید
    return;
  }

  // ارسال درخواست POST به اسکریپت با نام کاربری و رمز عبور
  fetch(scriptURL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      loginMsg.style.color = "green";
      loginMsg.innerText = "ورود موفق بود!";
      document.getElementById("loginForm").style.display = "none";
      document.getElementById("userPanel").style.display = "block";

      // تنظیم iframe وضعیت تحصیلی اگر لینکی برای آن وجود دارد
      document.getElementById("eduStatusFrame").src = data.eduStatusLink || "";

      // نمایش تب اطلاعات کاربر
      showTab("infoTab");

      // نمایش نام و عکس و قرارداد کاربر
      document.getElementById("userName").innerText = data.name;
      document.getElementById("userPhoto").src = `https://drive.google.com/file/d/${data.photoId}/preview`;
      document.getElementById("userContract").src = `https://drive.google.com/file/d/${data.contractId}/preview`;
	  document.getElementById("userNationalId").innerText = data.nationalId || "نامشخص";
document.getElementById("userFatherName").innerText = data.fatherName || "نامشخص";
document.getElementById("userLevel").innerText = data.level || "نامشخص";

      // مقداردهی به هدر بالا
      document.getElementById("headerUserPhoto").src = `https://drive.google.com/file/d/${data.photoId}/preview`;
      document.getElementById("headerUserName").innerText = data.name;
      document.getElementById("userHeader").classList.remove("hidden");

      // نمایش لیست دوره‌های فعال
      const coursesUl = document.getElementById("coursesUl");
      coursesUl.innerHTML = ""; // پاک‌سازی محتوای قبلی

      if (Array.isArray(data.activeCourses) && data.activeCourses.length > 0) {
        // اگر دوره فعال داریم، ابتدا ساختار تب‌ها و محتوا ایجاد شود
        const tabsContainer = document.createElement("div");
        tabsContainer.className = "flex flex-wrap gap-2 mb-4";

        const contentContainer = document.createElement("div");
        contentContainer.className = "w-full";

        let currentCourseIndex = 0; // متغیر برای ردیابی دوره جاری

        // تابعی برای نمایش جلسات یک دوره
        function renderCourseSessions(course, courseIndex) {
          contentContainer.innerHTML = ""; // پاک‌سازی محتوا

          const contentDiv = document.createElement("div");
          contentDiv.className = "mt-4";

          if (Array.isArray(course.sessions) && course.sessions.length > 0) {
            // برای هر جلسه، آکاردئون ایجاد می‌کنیم
            course.sessions.forEach((session, sessionIndex) => {
              const accordion = document.createElement("div");
              accordion.className = "border border-gray-300 rounded-md overflow-hidden mb-4";

              const header = document.createElement("button");
              header.className = "w-full text-right px-4 py-3 bg-blue-100 font-semibold flex justify-between items-center";
              header.innerHTML = `<span>course ${session.session || sessionIndex + 1} - ${course.title}</span><i class="fas fa-chevron-down ml-2 transition-transform"></i>`;
              
              const panel = document.createElement("div");
              panel.style.display = "none";
              panel.className = "p-4 bg-white";

              // باز و بسته کردن آکاردئون
              header.addEventListener("click", () => {
                const isOpen = panel.style.display === "block";
                panel.style.display = isOpen ? "none" : "block";
                header.querySelector("i").style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
              });

            
const tabs = document.createElement("div");
tabs.className = "flex gap-2 border-b mb-4";

const tabContent = document.createElement("div");
// تنظیمات برای اسکرول عمودی وقتی محتوا زیاد بود
tabContent.style.maxHeight = "500px"; // ارتفاع دلخواه برای نمایش محتوا
tabContent.style.overflowY = "auto";
tabContent.style.overflowX = "hidden"; // جلوگیری از اسکرول افقی

tabContent.style.paddingRight = "10px"; // برای کمی فاصله از اسکرول


const iframeId = `iframe-${courseIndex}-${sessionIndex}`;
const userName = data.name; // دریافت نام کاربر از داده GAS

const tabData = [
  {
    title: "توضیحات",
    content: `<p class="text-sm text-gray-700 whitespace-pre-line">${session.description || "توضیحی ثبت نشده است."}</p>`
  },
  
  
  {
  title: "ویدئو",
  content: session.videoId
    ? `
      <div class="space-y-2">
        <div class="flex gap-2">
          <button onclick="document.getElementById('${iframeId}-container')?.requestFullscreen()" 
                  class="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600">
            نمایش تمام‌صفحه
          </button>
          <!-- دکمه هشدار -->
<button onclick="document.getElementById('${iframeId}-warning').classList.remove('hidden')" 
        class="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700">
  هشدار!
</button>

<!-- Popup سفارشی -->
<div id="${iframeId}-warning" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-50">
  <div class="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
    <h2 class="text-red-600 font-bold mb-2">هشدار!</h2>
    <p class="text-sm text-gray-700 leading-6">
      کاربر محترم ${userName}<br>
      در صورت مشاهده هرگونه کپی‌برداری (ضبط، کپی، ذخیره‌سازی) از محتوای پنل، 
      پنل شما به طور دائم مسدود خواهد شد.
    </p>
    <div class="mt-4 text-right">
      <button onclick="document.getElementById('${iframeId}-warning').classList.add('hidden')" 
              class="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">
        بستن
      </button>
    </div>
  </div>
</div>

        </div>

        <!-- این div کل ویدئو + واترمارک رو نگه میداره -->
        <div id="${iframeId}-container" class="relative w-full h-[450px] md:h-[600px]">
          <iframe id="${iframeId}-video"
                  class="w-full h-full"
                  src="https://drive.google.com/file/d/${session.videoId}/preview"
                  allowfullscreen>
          </iframe>

          <!-- واترمارک -->
          <div class="absolute bottom-6 right-2 text-red-500 text-lg opacity-100 pointer-events-none select-none">
            نام کاربر: ${userName}
          </div>
        </div>

        ${userName}
      </div>
    `
    : `<p class="text-red-500">ویدئویی وجود ندارد.</p>`
},



  {
    title: "3D",
    content: session.webglLink
      ? `
        <div class="space-y-2">
          <div class="flex gap-2">
            <button onclick="document.getElementById('${iframeId}-webgl')?.requestFullscreen()" 
                    class="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600">
              نمایش تمام‌صفحه
            </button>
          <!-- دکمه هشدار -->
<button onclick="document.getElementById('${iframeId}-warning').classList.remove('hidden')" 
        class="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700">
  هشدار!
</button>

<!-- Popup سفارشی -->
<div id="${iframeId}-warning" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-50">
  <div class="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
    <h2 class="text-red-600 font-bold mb-2">هشدار!</h2>
    <p class="text-sm text-gray-700 leading-6">
      کاربر محترم ${userName}<br>
      در صورت مشاهده هرگونه کپی‌برداری (ضبط، کپی، ذخیره‌سازی) از محتوای پنل، 
      پنل شما به طور دائم مسدود خواهد شد.
    </p>
    <div class="mt-4 text-right">
      <button onclick="document.getElementById('${iframeId}-warning').classList.add('hidden')" 
              class="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">
        بستن
      </button>
    </div>
  </div>
</div>
          </div>
          <iframe id="${iframeId}-webgl" class="w-full h-[450px] md:h-[600px]" 
                  src="${session.webglLink}" allowfullscreen></iframe>
        </div>
      `
      : `<p class="text-red-500">فایلی وجود ندارد</p>`
  },
{
  title: "دانلودها",
  content: `
    <ul class="list-disc pr-5 text-sm space-y-2">
      <li>
        ${session.fileIds
          ? `<a class="text-blue-600 underline" href="https://drive.google.com/uc?export=download&id=${session.fileIds}">دانلود فایل</a>`
          : "فایل‌ها موجود نیستند"}
      </li>
    </ul>
  `
}

];


              // ساخت دکمه‌های تب‌ها
  tabData.forEach((tab, idx) => {
  const btn = document.createElement("button");
  btn.className = `
    px-4 py-1 
    text-sm 
    font-medium 
    rounded-md 
    border 
    ${idx === 0 ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300"}
    hover:bg-blue-100 
    transition
  `.trim();

  btn.textContent = tab.title;

  btn.addEventListener("click", () => {
    // ریست استایل همه دکمه‌ها
    tabs.querySelectorAll("button").forEach(b => {
      b.className = `
        px-4 py-1 
        text-sm 
        font-medium 
        rounded-md 
        border 
        bg-white text-gray-700 border-gray-300 
        hover:bg-blue-100 
        transition
      `.trim();
    });

    // فعال‌سازی تب جاری
    btn.className = `
      px-4 py-1 
      text-sm 
      font-medium 
      rounded-md 
      border 
      bg-blue-500 text-white border-blue-500 
      transition
    `.trim();

    tabContent.innerHTML = tab.content;
  });

  tabs.appendChild(btn);

  if (idx === 0) tabContent.innerHTML = tab.content;
});

              // قرار دادن تب‌ها در پنل
              panel.appendChild(tabs);
              panel.appendChild(tabContent);

              // افزودن آکاردئون به content
              accordion.appendChild(header);
              accordion.appendChild(panel);
              contentDiv.appendChild(accordion);
            });
			
			
          } else {
            // اگر جلسه‌ای وجود نداشت
            const p = document.createElement("p");
            p.textContent = "هیچ جلسه‌ای برای این دوره ثبت نشده.";
            p.className = "text-red-600";
            contentDiv.appendChild(p);
          }

          contentContainer.appendChild(contentDiv);
        }

        // ساخت تب‌های مربوط به دوره‌ها
        data.activeCourses.forEach((course, index) => {
          const tabButton = document.createElement("button");
          tabButton.textContent = course.title;
          tabButton.className = "px-4 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-blue-100 transition";

          if (index === 0) tabButton.classList.add("bg-blue-500", "text-white"); // دوره اول به صورت پیش‌فرض انتخاب شده است

          // افزودن رویداد کلیک برای تغییر دوره فعال
          tabButton.addEventListener("click", () => {
            tabsContainer.querySelectorAll("button").forEach(btn => {
              btn.classList.remove("bg-blue-500", "text-white");
              btn.classList.add("text-black");
            });
            tabButton.classList.add("bg-blue-500", "text-white");

            renderCourseSessions(course, index); // نمایش جلسات دوره
          });

          tabsContainer.appendChild(tabButton);
        });

        // اضافه کردن همه به DOM
        coursesUl.appendChild(tabsContainer);
        coursesUl.appendChild(contentContainer);

        // اولین دوره را به صورت پیش‌فرض نمایش بده
        renderCourseSessions(data.activeCourses[0], 0);

      } else {
        // اگر هیچ دوره فعالی نبود
        const li = document.createElement("li");
        li.textContent = "هیچ دوره فعالی یافت نشد.";
        coursesUl.appendChild(li);
      }

    } else {
      // اگر ورود موفق نبود، پیام خطا را نمایش بده
      loginMsg.innerText = data.message || "اطلاعات ورود اشتباه است.";
    }
  })
  .catch(err => {
    // در صورت خطای ارتباط با سرور
    loginMsg.innerText = "خطا در ارتباط با سرور.";
    console.error(err);
  });
}

