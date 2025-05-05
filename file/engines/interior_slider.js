// تعیین آدرس پیش‌فرض برای آیفریم
document.addEventListener('DOMContentLoaded', function() {
    let iframe = document.getElementById('iframe_2');
    iframe.src = "s1/index.html";  // آدرس پیش‌فرض
});

// تغییر آدرس آیفریم با کلیک روی دکمه‌ها
function openTab(iframeId, tabIndex) {
    let iframe = document.getElementById(iframeId);
    if (iframeId === "iframe_2") {
        let urls1 = [
            "s1/index.html", 
            "s2/index.html",
            "s3/index.html",
            "s4/index.html",
            "s5/index.html"
        ];
        iframe.src = urls1[tabIndex];  // تغییر آدرس آیفریم
    } 
}
