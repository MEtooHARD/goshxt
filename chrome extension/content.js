// NDHU Course Registration Helper - Content Script

(function () {
    'use strict';

    const LOG_PREFIX = '[goshxt]';

    // 全局狀態
    let plus_btns = [];
    let status_el;
    let display_el;
    let execute_bt;

    // #region toast
    // Toast 通知
    function show_toast(message, color = '#007bff') {
        const toast = document.createElement('div');
        toast.className = 'ndhu-toast';
        toast.textContent = message;
        toast.style.backgroundColor = color;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 1500);
    }
    // #endregion

    // 抓取課程
    function fetch_courses() {
        console.log(LOG_PREFIX, 'Fetch courses');
        status_el.textContent = 'Check table';
        display_el.textContent = '';

        const rows = document.querySelectorAll('#ContentPlaceHolder1_grd_subjs > tbody > tr');
        console.log('Found course items:', rows.length - 1);

        plus_btns = [];
        window.courses_info = []; // 改為全局以便 execute 使用
        let max_code_len = 0;

        for (let i = 1; i < rows.length; i++) {
            const button = rows[i].querySelector('td > input');
            const code = rows[i].querySelector('td:nth-child(2)')?.textContent?.trim() || `Course ${i}`;
            const name = rows[i].querySelector('td:nth-child(3)')?.textContent?.trim() || 'Unnamed';
            window.courses_info.push({ code, name, button });
            if (name.length > max_code_len) max_code_len = name.length;
        }

        console.log(LOG_PREFIX, `Found ${window.courses_info.length} courses`);
        status_el.textContent = `Found ${window.courses_info.length} courses`;

        if (window.courses_info.length === 0) {
            execute_bt.disabled = true;
            display_el.textContent = 'No courses found';
            show_toast('⚠️ No courses found', '#ffc107');
            return;
        }

        for (const course of window.courses_info) {
            if (course.button && !course.button.className.includes('hide'))
                plus_btns.push(course.button);
        }

        display_el.innerHTML = window.courses_info.map(course => {
            const hasButton = !!course.button && !course.button.className.includes('hide');
            const codeColor = hasButton ? '#28a745' : '#dc3545';
            return `<div class="course-item"><span class="code" style="color: ${codeColor}">${course.code}</span><span>${course.name}</span></div>`;
        }).join('');

        if (window.courses_info.length > 0) {
            execute_bt.disabled = false;
            show_toast(`📚 Found ${window.courses_info.length} courses`, '#28a745');
        } else {
            show_toast('⚠️ No courses found', '#ffc107');
        }
    }

// 執行選課
    function execute_courses() {
        if (plus_btns.length === 0) {
            show_toast('⚠️ No courses to be added', '#ffc107');
            return;
        }

        console.log(LOG_PREFIX, `Executing ${plus_btns.length} registration requests...`);
        show_toast('🚀 Executing...', '#007bff');

        execute_bt.disabled = true;
        status_el.textContent = 'Executing...';

        let successCount = 0;
        let errorCount = 0;

        const start = Date.now();

        // 阻止中間的 PostBack 以加速
        window.dispatchEvent(new CustomEvent('goshxt-setBlockPostBack', {
            detail: { block: true }
        }));

        // 直接點擊按鈕
        for (let i = 0; i < plus_btns.length; i++) {
            try {
                plus_btns[i].click();
                successCount++;
            } catch (e) {
                errorCount++;
                console.error(LOG_PREFIX, 'Error clicking button:', e);
            }
        }

        // 恢復 PostBack 並執行最後一次刷新
        window.dispatchEvent(new CustomEvent('goshxt-setBlockPostBack', {
            detail: { block: false }
        }));

        const end = Date.now();
        console.log(LOG_PREFIX, `Execution finished in ${(end - start)} ms`);

        console.log(LOG_PREFIX, 'Execution completed!');
        status_el.textContent = `Success click: ${successCount}/${errorCount + successCount}`;
        show_toast(`✅ Executed ${plus_btns.length} requests`, '#28a745');

        // 1秒後恢復按鈕
        setTimeout(() => {
            execute_bt.disabled = false;
        }, 1000);
    }

    // 創建控制面板
    function create_panel() {
        const panel = document.createElement('div');
        panel.id = 'ndhu-helper-panel';

        // 標題
        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = 'NDHU Helper';
        panel.appendChild(title);

        // 狀態顯示
        status_el = document.createElement('div');
        status_el.id = 'ndhu-status';
        status_el.textContent = 'Ready';
        panel.appendChild(status_el);

        // 顯示區域
        display_el = document.createElement('div');
        display_el.id = 'ndhu-display';
        panel.appendChild(display_el);

        // 按鈕容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'ndhu-button-container';

        // Fetch 按鈕
        const fetchBtn = document.createElement('button');
        fetchBtn.className = 'ndhu-btn ndhu-btn-fetch';
        fetchBtn.textContent = 'Fetch Courses';
        fetchBtn.onclick = async () => {
            try {
                execute_bt.disabled = true;
                fetch_courses();
            } catch (e) {
                console.error(LOG_PREFIX, 'Error fetching courses:', e);
                show_toast('⚠️ Error fetching courses', '#dc3545');
            } finally { execute_bt.disabled = false; }
        };

        // Execute 按鈕
        execute_bt = document.createElement('button');
        execute_bt.className = 'ndhu-btn ndhu-btn-execute';
        execute_bt.textContent = 'Execute';
        execute_bt.disabled = true;
        execute_bt.onclick = execute_courses;

        buttonContainer.appendChild(fetchBtn);
        buttonContainer.appendChild(execute_bt);
        panel.appendChild(buttonContainer);

        return panel;
    }

    // 初始化
    function init() {
        // 覆寫 alert，自動接受所有 alert
        const originalAlert = window.alert;
        window.alert = function (message) {
            console.log(LOG_PREFIX, 'Auto-accepted alert:', message);
            // 不顯示 alert，直接返回
        };

        const panel = create_panel();
        document.body.appendChild(panel);
        console.log(LOG_PREFIX, 'Panel injected');
        console.log(LOG_PREFIX, 'Alert auto-accept enabled');
    }

    // 啟動
    init();
})();
