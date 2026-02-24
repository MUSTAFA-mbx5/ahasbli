// الرابط الخاص بمحرك البيانات (Google Apps Script)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyKZk-rCkPHH8bYCnU4vl6YmATxgrCvylPaMgoIFtq3jjtIIx3HiejHXaVBALOj81qT/exec";

const auth = {
    // --- 1. وظيفة تسجيل الدخول ---
    login: async () => {
        const user = document.getElementById('loginUser').value.trim();
        const pass = document.getElementById('loginPass').value.trim();

        if (!user || !pass) {
            alert("⚠️ يرجى إدخال اسم المستخدم وكلمة المرور");
            return;
        }

        // تغيير نص الزر لإعطاء إشعار للمستخدم بجاري التحميل
        const loginBtn = document.querySelector('.button-submit');
        const originalText = loginBtn.innerText;
        loginBtn.innerText = "⏳ جاري التحقق...";
        loginBtn.disabled = true;

        try {
            // إرسال البيانات بطريقة "Simple Request" لتجنب مشاكل CORS
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'cors', // السماح بتبادل البيانات
                body: JSON.stringify({
                    action: "login",
                    user: user,
                    pass: pass
                })
            });

            const data = await response.json();

            if (data.status === "success") {
                // حفظ بيانات الجلسة في المتصفح
                localStorage.setItem('user', user);
                localStorage.setItem('session', data.session);
                localStorage.setItem('libName', data.libName);
                
                // الانتقال للوحة التحكم
                window.location.href = 'dashboard.html';
            } else {
                alert("❌ " + data.msg);
                loginBtn.innerText = originalText;
                loginBtn.disabled = false;
            }

        } catch (error) {
            console.error("Login Error:", error);
            alert("🔴 تعذر الاتصال بالسيرفر. تأكد من نشر السكريبت بصلاحية (Anyone).");
            loginBtn.innerText = originalText;
            loginBtn.disabled = false;
        }
    },

    // --- 2. وظيفة إنشاء الحساب ---
    signup: async () => {
        const name = document.getElementById('regName').value.trim();
        const lib = document.getElementById('regLib').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const addr = document.getElementById('regAddr').value.trim();

        if (!name || !lib || !phone || !addr) {
            alert("⚠️ يرجى ملأ جميع الحقول المطلوبة");
            return;
        }

        const signupBtn = document.querySelector('.button-submit');
        signupBtn.innerText = "⏳ جاري الإرسال...";
        signupBtn.disabled = true;

        const userData = {
            action: "signup",
            name: name,
            library: lib,
            phone: phone,
            address: addr
        };

        try {
            // ملاحظة: عند استخدام no-cors لن نستطيع قراءة الرد (JSON) 
            // لكن البيانات ستصل للسيرفر بنجاح وسيعمل البوت
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', 
                body: JSON.stringify(userData)
            });

            // بما أننا استخدمنا no-cors، سنفترض النجاح ونوجه المستخدم
            alert("✅ تم إرسال معلوماتك بنجاح! سيقوم البوت الآن بإرسال بيانات حسابك.");
            window.location.href = "https://t.me/mb4x_bot"; 

        } catch (error) {
            console.error("Signup Error:", error);
            alert("🔴 حدث خطأ أثناء الإرسال. تأكد من اتصالك بالإنترنت.");
            signupBtn.innerText = "إرسال وتفعيل";
            signupBtn.disabled = false;
        }
    },

    // --- 3. وظيفة تسجيل الخروج ---
    logout: () => {
        if(confirm("هل تريد تسجيل الخروج؟")) {
            localStorage.clear();
            window.location.href = 'index.html';
        }
    }
};
