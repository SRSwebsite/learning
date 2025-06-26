const scriptURL = "https://script.google.com/macros/s/AKfycbyn00zJE9tzC5HK20fPQOSoys58rAy5i2nXY9kQisAIxYINbYHyIGs5nacmTY1Alx3lSw/exec";

// دریافت IP
async function getIPAddress() {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    document.getElementById('ipAddress').value = data.ip;
}

// دریافت موقعیت مکانی
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const location = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
            document.getElementById('location').value = location;
        });
    }
}

// اطلاعات مرورگر
function getBrowserInfo() {
    document.getElementById('browserInfo').value = navigator.userAgent;
}

// ذخیره ایمیل
function saveEmail() {
    const email = document.getElementById('email').value;
    if (email) {
        localStorage.setItem("userEmail", email);
    }
}

// پر کردن ایمیل از localStorage
function autofillEmail() {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
        document.getElementById('email').value = storedEmail;
        alert("ایمیل با موفقیت پر شد.");
    } else {
        alert("ایمیلی ذخیره نشده است.");
    }
}

document.getElementById('autoFillEmail').addEventListener('click', autofillEmail);

// فقط یک بار تعریف فرم
document.getElementById("myForm").onsubmit = async function (event) {
    event.preventDefault();

    saveEmail();

    const formData = new FormData(this);

    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert("اطلاعات با موفقیت ارسال شد!");
            this.reset();
        } else {
            alert("خطا در ارسال اطلاعات!");
        }
    } catch (error) {
        alert("خطای شبکه!");
        console.error(error);
    }
};

// اجرای توابع کمکی
getIPAddress();
getLocation();
getBrowserInfo();
