// 创建并获取样式元素
let styleSheet = null;

function ensureStyleSheet() {
    if (!styleSheet) {
        styleSheet = document.createElement('style');
        styleSheet.id = 'eye-protection-styles';
        // 确保样式表被添加到文档中
        (document.head || document.documentElement).appendChild(styleSheet);
    }
    return styleSheet;
}

// 当前状态
let currentState = {
    darkMode: false,
    eyeCare: false,
    brightness: 100
};

// 更新样式
function updateStyles() {
    const style = ensureStyleSheet();
    let css = '';

    // 深色模式
    if (currentState.darkMode) {
        css += `
            html {
                filter: invert(1) hue-rotate(180deg) !important;
                background: white !important;
            }
            img, video, canvas, picture, [style*="background-image"] {
                filter: invert(1) hue-rotate(180deg) !important;
            }
        `;
    }

    // 护眼模式
    if (currentState.eyeCare) {
        css += `
            html {
                background-color: #F5DEB3 !important;
            }
            body {
                background-color: #F5DEB3 !important;
                color: #333333 !important;
            }
        `;
    }

    // 亮度调节
    if (currentState.brightness !== 100) {
        css += `
            html {
                filter: ${currentState.darkMode ? 
                    `brightness(${currentState.brightness}%) invert(1) hue-rotate(180deg)` : 
                    `brightness(${currentState.brightness}%)`} !important;
            }
        `;
    }

    // 应用样式
    style.textContent = css;
    console.log('Styles updated:', currentState);
}

// 监听消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message:', request);

    try {
        switch (request.type) {
            case 'darkMode':
                currentState.darkMode = request.enabled;
                break;
            case 'eyeCare':
                currentState.eyeCare = request.enabled;
                break;
            case 'brightness':
                currentState.brightness = request.value;
                break;
            case 'getStatus':
                sendResponse({ success: true, status: currentState });
                return true;
        }

        updateStyles();
        sendResponse({ success: true });
    } catch (error) {
        console.error('Error processing message:', error);
        sendResponse({ success: false, error: error.message });
    }

    return true;
});

// 初始化
function initialize() {
    console.log('Initializing content script...');
    
    // 加载保存的设置
    chrome.storage.local.get(['darkMode', 'eyeCareMode', 'brightness'], (result) => {
        console.log('Loaded settings:', result);
        
        currentState.darkMode = result.darkMode || false;
        currentState.eyeCare = result.eyeCareMode || false;
        currentState.brightness = result.brightness || 100;
        
        updateStyles();
    });
}

// 确保在文档加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// 监听页面变化
const observer = new MutationObserver((mutations) => {
    // 检查是否需要重新应用样式
    if (mutations.some(mutation => 
        mutation.type === 'childList' && 
        (mutation.target === document.head || mutation.target === document.body)
    )) {
        console.log('Critical DOM changes detected, reapplying styles...');
        updateStyles();
    }
});

// 开始观察
observer.observe(document, {
    childList: true,
    subtree: true
});

// 导出用于调试
window.__eyeProtection = {
    getState: () => currentState,
    updateStyles,
    reset: () => {
        currentState = {
            darkMode: false,
            eyeCare: false,
            brightness: 100
        };
        updateStyles();
    }
}; 