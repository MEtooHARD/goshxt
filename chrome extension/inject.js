// 這個腳本在頁面主上下文執行，用來覆寫 alert
(function () {
    'use strict';

    const originalAlert = window.alert;
    window.alert = function (message) {
        console.log('[goshxt] Auto-accepted alert:', message);
        return true;
    };

    console.log('[goshxt] Alert override installed');

    // 優化選課速度：攔截 PostBack
    let blockPostBack = false;
    let original_doPostBack = null;

    // 延遲獲取 __doPostBack 引用
    setTimeout(() => {
        if (typeof window.__doPostBack === 'function') {
            original_doPostBack = window.__doPostBack;

            window.__doPostBack = function (eventTarget, eventArgument) {
                if (blockPostBack) {
                    console.log('[goshxt] Blocked PostBack:', eventTarget);
                    return false;
                }
                return original_doPostBack(eventTarget, eventArgument);
            };

            console.log('[goshxt] PostBack interceptor installed');
        }
    }, 500);

    // 監聽狀態控制事件
    window.addEventListener('goshxt-setBlockPostBack', function (e) {
        blockPostBack = e.detail.block;
        console.log('[goshxt] PostBack blocking:', blockPostBack);
    });

    // 監聽並發選課請求
    window.addEventListener('goshxt-batchSelect', async function (e) {
        // 從 DOM 讀取數據（因為 isolated world 的 detail 無法傳遞）
        const dataEl = document.getElementById('goshxt-batch-data');
        if (!dataEl) {
            console.error('[goshxt] No batch data element found');
            return;
        }

        const { courses, x_value } = JSON.parse(dataEl.textContent);
        console.log('[goshxt] Batch selecting', courses.length, 'courses');

        // 限制並發數，每次最多 3 個請求
        const batchSize = 3;
        const results = [];

        for (let i = 0; i < courses.length; i += batchSize) {
            const batch = courses.slice(i, i + batchSize);
            const batchResults = await Promise.all(batch.map(async (course) => {
                try {
                    const response = await fetch('course_sele.ashx', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'X-Requested-With': 'XMLHttpRequest',
                            'Accept': 'application/json, text/javascript, */*; q=0.01'
                        },
                        body: `type=1&x=${encodeURIComponent(x_value)}&no=${encodeURIComponent(course.code)}`,
                        credentials: 'same-origin'
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('[goshxt] HTTP error', response.status, 'for', course.code);
                        console.error('[goshxt] Response:', errorText.substring(0, 500));
                        return { course: course.code, result: -99, name: course.name, error: `HTTP ${response.status}` };
                    }

                    const data = await response.json();
                    console.log('[goshxt] ✓', course.code, 'result:', data.msg);
                    return { course: course.code, result: data.msg, name: course.name };
                } catch (error) {
                    console.error('[goshxt] Error selecting', course.code, error);
                    return { course: course.code, result: -99, error: error.message };
                }
            }));

            results.push(...batchResults);

            // 批次之間添加小延遲，避免觸發速率限制
            if (i + batchSize < courses.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        // 發送結果回 content script
        window.dispatchEvent(new CustomEvent('goshxt-batchSelectResults', {
            detail: { results }
        }));
    });
})();
