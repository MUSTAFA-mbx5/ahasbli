const ui = {
    // التنقل بين التبويبات
    showTab: (tabId) => {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        
        document.getElementById(tabId).classList.add('active');
        event.currentTarget.classList.add('active');
    },

    // رفع اللوجو وحفظه في الذاكرة
    uploadLogo: () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('displayLogo').src = event.target.result;
                document.getElementById('displayLogo').style.display = 'block';
                document.getElementById('plusIcon').style.display = 'none';
                localStorage.setItem('userLogo', event.target.result);
            };
            reader.readAsDataURL(file);
        };
        fileInput.click();
    }
};

const calc = {
    run: () => {
        const from = parseInt(document.getElementById('pageFrom').value);
        const to = parseInt(document.getElementById('pageTo').value);
        const total = parseInt(document.getElementById('pageTotal').value);
        
        let pages = 0;
        if (total) pages = total;
        else if (from && to) pages = (to - from) + 1;

        const result = pages * 250; // افتراض السعر 250
        document.getElementById('finalTotal').innerText = result.toLocaleString() + " د.ع";
    },

    print: () => {
        window.print();
    }
};

// عند تحميل الصفحة
window.onload = () => {
    // جلب اسم المكتبة واللوجو من الذاكرة
    const libName = localStorage.getItem('libName') || "مكتبة أحسبلي";
    document.getElementById('sidebarLibName').innerText = libName;
    
    if (localStorage.getItem('userLogo')) {
        document.getElementById('displayLogo').src = localStorage.getItem('userLogo');
        document.getElementById('displayLogo').style.display = 'block';
        document.getElementById('plusIcon').style.display = 'none';
    }
};
