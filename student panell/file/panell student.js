  const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");

    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("translate-x-full");
    });

    function showTab(tabId) {
      document.getElementById("infoTab").classList.add("hidden");
      document.getElementById("coursesTab").classList.add("hidden");
      document.getElementById(tabId).classList.remove("hidden");

      if (window.innerWidth < 768) {
        sidebar.classList.add("translate-x-full");
      }
    }

    const scriptURL = "https://script.google.com/macros/s/AKfycbw8RfekfO9Qm7nX4FAqb_RsAkokBGjvtOWrLdL8mlFtNj6IHoUMdpUGPTGCrxrFC5A-/exec";

    function login() {
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
      const loginMsg = document.getElementById("loginMsg");

      fetch(scriptURL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          document.getElementById("loginForm").style.display = "none";
          document.getElementById("userPanel").style.display = "block";
          showTab("infoTab");

          document.getElementById("userName").innerText = data.name;
          document.getElementById("userPhoto").src = `https://drive.google.com/file/d/${data.photoId}/preview`;
          document.getElementById("userContract").src = `https://drive.google.com/file/d/${data.contractId}/preview`;

     const coursesUl = document.getElementById("coursesUl");
coursesUl.innerHTML = "";

if (Array.isArray(data.activeCourses) && data.activeCourses.length > 0) {
  const tabsContainer = document.createElement("div");
  tabsContainer.className = "flex flex-wrap gap-2 mb-4";

  const contentContainer = document.createElement("div");
  contentContainer.className = "w-full";

  let currentCourseIndex = 0;

  function renderCourseSessions(course, courseIndex) {
    contentContainer.innerHTML = ""; // پاک کردن قبلی‌ها
    const contentDiv = document.createElement("div");
    contentDiv.className = "mt-4";

    if (Array.isArray(course.sessions) && course.sessions.length > 0) {
      course.sessions.forEach((session, sessionIndex) => {
        const accordion = document.createElement("div");
        accordion.className = "border border-gray-300 rounded-md overflow-hidden mb-4";

        const header = document.createElement("button");
        header.className = "w-full text-right px-4 py-3 bg-blue-100 font-semibold flex justify-between items-center";
        header.innerHTML = `<span>جلسه ${session.session || sessionIndex + 1} - ${course.title}</span><i class="fas fa-chevron-down ml-2 transition-transform"></i>`;
        
        const panel = document.createElement("div");
        panel.style.display = "none";
        panel.className = "p-4 bg-white";

        header.addEventListener("click", () => {
          const isOpen = panel.style.display === "block";
          panel.style.display = isOpen ? "none" : "block";
          header.querySelector("i").style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
        });

        const tabs = document.createElement("div");
        tabs.className = "flex gap-2 border-b mb-4";

        const tabContent = document.createElement("div");

        const tabData = [
          {
            title: "توضیحات",
            content: `<p class="text-sm text-gray-700 whitespace-pre-line">${session.description || "توضیحی ثبت نشده است."}</p>`
          },
          {
            title: "ویدئو",
            content: session.videoId
              ? `<iframe class="w-full h-64" src="https://drive.google.com/file/d/${session.videoId}/preview" allowfullscreen></iframe>`
              : `<p class="text-red-500">ویدئویی وجود ندارد.</p>`
          },
          {
            title: "WebGL",
            content: session.webglLink
              ? `<iframe class="w-full h-64" src="${session.webglLink}" allowfullscreen></iframe>`
              : `<p class="text-red-500">لینک WebGL وجود ندارد.</p>`
          },
          {
            title: "دانلودها",
            content: `
              <ul class="list-disc pr-5 text-sm space-y-2">
                <li>
                  ${session.videoId
                    ? `<a class="text-blue-600 underline" href="https://drive.google.com/u/0/uc?id=${session.videoId}&export=download" target="_blank">دانلود ویدئو</a>`
                    : "ویدئو موجود نیست"}
                </li>
                <li>
                  ${session.fileIds
                    ? `<a class="text-blue-600 underline" href="https://drive.google.com/drive/folders/${session.fileIds}" target="_blank">دانلود فایل‌ها</a>`
                    : "فایل‌ها موجود نیستند"}
                </li>
              </ul>`
          },
        ];

        tabData.forEach((tab, idx) => {
          const btn = document.createElement("button");
          btn.className = `px-3 py-1 text-sm border-b-2 ${idx === 0 ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600"} transition`;
          btn.textContent = tab.title;
          btn.addEventListener("click", () => {
            tabs.querySelectorAll("button").forEach(b => b.className = "px-3 py-1 text-sm border-b-2 border-transparent text-gray-600");
            btn.className = "px-3 py-1 text-sm border-b-2 border-blue-500 text-blue-600";
            tabContent.innerHTML = tab.content;
          });
          tabs.appendChild(btn);
          if (idx === 0) tabContent.innerHTML = tab.content;
        });

        panel.appendChild(tabs);
        panel.appendChild(tabContent);
        accordion.appendChild(header);
        accordion.appendChild(panel);
        contentDiv.appendChild(accordion);
      });
    } else {
      const p = document.createElement("p");
      p.textContent = "هیچ جلسه‌ای برای این دوره ثبت نشده.";
      p.className = "text-red-600";
      contentDiv.appendChild(p);
    }

    contentContainer.appendChild(contentDiv);
  }

  data.activeCourses.forEach((course, index) => {
    const tabButton = document.createElement("button");
    tabButton.textContent = course.title;
    tabButton.className = "px-4 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-blue-100 transition";
    if (index === 0) tabButton.classList.add("bg-blue-500", "text-white");

    tabButton.addEventListener("click", () => {
      tabsContainer.querySelectorAll("button").forEach(btn => {
        btn.classList.remove("bg-blue-500", "text-white");
        btn.classList.add("text-black");
      });
      tabButton.classList.add("bg-blue-500", "text-white");

      renderCourseSessions(course, index);
    });

    tabsContainer.appendChild(tabButton);
  });

  coursesUl.appendChild(tabsContainer);
  coursesUl.appendChild(contentContainer);

  // بار اول رندر کن
  renderCourseSessions(data.activeCourses[0], 0);
} else {
  const li = document.createElement("li");
  li.textContent = "هیچ دوره فعالی یافت نشد.";
  coursesUl.appendChild(li);
}

        } else {
          loginMsg.innerText = data.message || "اطلاعات ورود اشتباه است.";
        }
      })
      .catch(err => {
        loginMsg.innerText = "خطا در ارتباط با سرور.";
        console.error(err);
      });
    }