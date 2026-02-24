const auth = {
    // وظيفة تسجيل الدخول
    login: async () => {
        const user = document.getElementById('loginUser').value;
        const pass = document.getElementById('loginPass').value;

        if (!user || !pass) {
            alert("يرجى إدخال اسم المستخدم وكلمة المرور");
            return;
        }

        console.log("جاري محاولة تسجيل الدخول لـ:", user);

        // هنا يمكن إضافة كود fetch لاحقاً لربطه مع Google Apps Script
        // مثال:
        /*
        const response = await fetch('رابط_جوجل_سكريبت', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: "login", user, pass })
        });
        */
        // window.location.href = 'dashboard.html';
    },

    // وظيفة إنشاء الحساب
    signup: async () => {
        const name = document.getElementById('regName').value;
        const lib = document.getElementById('regLib').value;
        const phone = document.getElementById('regPhone').value;
        const addr = document.getElementById('regAddr').value;

        if (!name || !lib || !phone || !addr) {
            alert("يرجى ملأ جميع الحقول");
            return;
        }

        const userData = {
            action: "signup",
            name: name,
            library: lib,
            phone: phone,
            address: addr
        };

        console.log("جاري إرسال طلب التسجيل لبوت التليجرام...");

        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbyKZk-rCkPHH8bYCnU4vl6YmATxgrCvylPaMgoIFtq3jjtIIx3HiejHXaVBALOj81qT/exec', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            alert("تم إرسال معلوماتك! سيقوم البوت الآن بإنشاء حسابك وإرسال قائمة الاشتراكات.");
            window.location.href = "https://t.me/mb4x_bot"; 

        } catch (error) {
            console.error("خطأ في الاتصال:", error);
            alert("حدث خطأ أثناء الإرسال، تأكد من الاتصال بالإنترنت.");
        }
    }
};
