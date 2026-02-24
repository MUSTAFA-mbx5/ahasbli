const auth = {
    login: async () => {
        const user = document.getElementById('loginUser').value;
        const pass = document.getElementById('loginPass').value;

        if (!user || !pass) {
            alert("يرجى إدخال اسم المستخدم وكلمة المرور");
            return;
        }

        console.log("جاري محاولة تسجيل الدخول لـ:", user);
        
        // هنا سنضيف كود fetch لاحقاً لربطه مع جوجل سكريبت
        // حالياً سننتقل للواجهة الرئيسية كمثال
        // window.location.href = 'dashboard.html';
    }
};
