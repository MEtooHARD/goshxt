// 這個腳本在頁面主上下文執行，用來覆寫 alert
(function() {
    'use strict';
    
    const originalAlert = window.alert;
    window.alert = function(message) {
        console.log('[goshxt] Auto-accepted alert:', message);
        return true;
    };
    
    console.log('[goshxt] Alert override installed');
})();
