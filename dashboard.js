/**
 * برنامج أحسبلي - المحرك الرئيسي للوحة التحكم
 * وظائف الكود: (إدارة الجلسة، الحاسبة الذكية، إدارة المواد، ربط تليجرام، والتقارير)
 */

// --- الإعدادات العامة ---
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyKZk-rCkPHH8bYCnU4vl6YmATxgrCvylPaMgoIFtq3jjtIIx3HiejHXaVBALOj81qT/exec"; // تأكد من وضع الرابط الصحيح هنا

// الحالة المؤقتة للبرنامج (State)
let appState = {
    items: [],
    stats: {
        count: 0,
        money: 0,
        pages: 0
    },
    tgSettings: {
        connected: false,
        phone: "",
        ai: false,
        welcome: false
    }
};

// --- 1. إدارة الواجهة (UI Management) ---
const ui = {
    // التنقل بين التبويبات (Tabs)
    showTab: (tabId) => {
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        
        document.getElementById(tabId).classList.add('active');
        event.currentTarget.classList.add('active');
    },

    // رفع اللوجو وحفظه
    uploadLogo: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('logoImg').src = event.target.result;
                document.getElementById('logoImg').style.display = 'block';
                document.getElementById('plusIcon').style.display = 'none';
                localStorage.setItem('userLogo', event.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        };
        input.click();
    },

    // حفظ الإعدادات العامة
    saveSettings: () => {
        const price = document.getElementById('settingDefaultPrice').value;
        const tax = document.getElementById('settingTax').value;
        localStorage.setItem('defaultPrice', price);
        localStorage.setItem('taxPercent', tax);
        alert("✅ تم حفظ الإعدادات بنجاح");
        calc.run();
    }
};

// --- 2. إدارة المواد (Items Manager) ---
const itemsManager = {
    add: () => {
        const nameInput = document.getElementById('itemName');
        const priceInput = document.getElementById('itemPrice');
        
        const name = nameInput.value;
        const price = parseInt(priceInput.value);

        if (!name || !price) return alert("❌ يرجى إدخال اسم المادة وسعرها");

        appState.items.push({ id: Date.now(), name, price });
        
        // تفريغ الحقول
        nameInput.value = '';
        priceInput.value = '';
        
        itemsManager.render();
        calc.run(); // تحديث المجموع
    },

    remove: (id) => {
        appState.items = appState.items.filter(item => item.id !== id);
        itemsManager.render();
        calc.run();
    },

    render: () => {
        const tbody = document.getElementById('itemsBody');
        tbody.innerHTML = appState.items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.price.toLocaleString()} د.ع</td>
                <td>
                    <button class="delete-btn-3d" onclick="itemsManager.remove(${item.id})">
                        <svg viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
                    </button>
                </td>
            </tr>
        `).join('');
    }
};

// --- 3. الحاسبة الذكية (Calculator) ---
const calc = {
    run: () => {
        // حساب الصفحات
        const from = parseInt(document.getElementById('pageFrom').value) || 0;
        const to = parseInt(document.getElementById('pageTo').value) || 0;
        const totalInput = parseInt(document.getElementById('pageTotal').value) || 0;
        const defaultPrice = parseInt(localStorage.getItem('defaultPrice')) || 250;
        const taxPercent = parseInt(localStorage.getItem('taxPercent')) || 0;

        let pages = 0;
        if (totalInput > 0) {
            pages = totalInput;
        } else if (from > 0 && to >= from) {
            pages = (to - from) + 1;
        }

        const pagesCost = pages * defaultPrice;
        
        // حساب المواد
        const itemsCost = appState.items.reduce((sum, item) => sum + item.price, 0);

        // المجموع الكلي مع الضريبة
        let finalTotal = pagesCost + itemsCost;
        if (taxPercent > 0) {
            finalTotal += (finalTotal * (taxPercent / 100));
        }

        document.getElementById('finalTotal').innerText = Math.round(finalTotal).toLocaleString() + " د.ع";
        
        return { finalTotal, pages };
    },

    print: () => {
        const result = calc.run();
        if (result.finalTotal === 0) return alert("⚠️ لا توجد بيانات لطباعة الفاتورة");

        // تحديث التقارير عند الطباعة (باعتبارها عملية بيع تمت)
        appState.stats.count++;
        appState.stats.money += result.finalTotal;
        appState.stats.pages += result.pages;
        reports.update();

        window.print();
    }
};

// --- 4. تليجرام الذكي (Telegram Management) ---
const tg = {
    connect: async () => {
        const phone = document.getElementById('tgPhoneInput').value;
        if (!phone) return alert("❌ يرجى إدخال رقم الهاتف");

        // محاكاة الاتصال وتفعيل الواجهة
        appState.tgSettings.connected = true;
        appState.tgSettings.phone = phone;

        document.getElementById('tgStatus').innerText = "متصل ✅";
        document.getElementById('tgStatus').className = "status-on";
        document.getElementById('tgFeatures').style.opacity = "1";
        document.getElementById('tgFeatures').style.pointerEvents = "auto";
        
        alert("🚀 تم ربط حساب تليجرام بنجاح! يمكنك الآن تفعيل ميزات الذكاء الاصطناعي.");
        tg.saveSettings();
    },

    saveSettings: async () => {
        const user = localStorage.getItem('user');
        const phone = appState.tgSettings.phone;
        const settings = {
            ai: document.getElementById('featAI').checked,
            welcome: document.getElementById('featWelcome').checked
        };

        try {
            await fetch(SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify({ action: "saveTgSettings", user, phone, settings })
            });
            console.log("TG Settings Saved to DB");
        } catch (e) {
            console.error("Error saving TG settings", e);
        }
    },

    broadcast: () => {
        const msg = prompt("📢 أدخل الرسالة التي تريد إرسالها لجميع المشتركين في البوت:");
        if (msg) {
            alert("جاري الإرسال... تنبيه: كثرة الإذاعة قد تعرض حسابك للحظر.");
            // كود إرسال الطلب للسيرفر لبدء الإذاعة
        }
    }
};

// --- 5. التقارير (Reports) ---
const reports = {
    update: () => {
        document.getElementById('repTotalInvoices').innerText = appState.stats.count;
        document.getElementById('repTotalPages').innerText = appState.stats.pages;
        document.getElementById('repTotalMoney').innerText = appState.stats.money.toLocaleString() + " د.ع";
    }
};

// --- 6. إدارة الجلسة (Auth & Logout) ---
const auth = {
    logout: () => {
        if (confirm("هل أنت متأكد من تسجيل الخروج؟")) {
            localStorage.clear();
            window.location.href = "index.html";
        }
    },
    checkSession: async () => {
        const user = localStorage.getItem('user');
        const session = localStorage.getItem('session');
        if (!user || !session) window.location.href = "index.html";

        // فحص الجلسة مع السيرفر لمنع تعدد الأجهزة
        try {
            const res = await fetch(SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify({ action: "checkSession", user, session })
            });
            const status = await res.text();
            if (status === "invalid") {
                alert("🔴 تم تسجيل الدخول من جهاز آخر!");
                auth.logout();
            }
        } catch (e) { console.log("Session check bypassed (Offline mode)"); }
    }
};

// --- 7. تشغيل عند تحميل الصفحة ---
window.onload = () => {
    // التحقق من الحماية
    auth.checkSession();
    setInterval(auth.checkSession, 30000); // فحص كل 30 ثانية

    // تحميل البيانات المحفوظة
    const libName = localStorage.getItem('libName') || "مكتبة أحسبلي";
    document.getElementById('sidebarLibName').innerText = libName;
    document.getElementById('repStoreName').innerText = libName;
    document.getElementById('repJoinDate').innerText = new Date().toLocaleDateString();

    if (localStorage.getItem('userLogo')) {
        document.getElementById('logoImg').src = localStorage.getItem('userLogo');
        document.getElementById('logoImg').style.display = 'block';
        document.getElementById('plusIcon').style.display = 'none';
    }

    // تعيين القيم الافتراضية في الإعدادات
    document.getElementById('settingDefaultPrice').value = localStorage.getItem('defaultPrice') || 250;
    document.getElementById('settingTax').value = localStorage.getItem('taxPercent') || 0;
};
