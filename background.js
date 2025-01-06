// 监听扩展重新加载
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed or updated');
  chrome.storage.local.set({
    darkMode: false,
    eyeCareMode: false,
    brightness: 100,
    backgroundColor: '#F5DEB3'
  });
});

// 当标签页更新时，恢复保存的设置
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.local.get(['darkMode', 'eyeCareMode', 'brightness', 'backgroundColor'], (result) => {
      try {
        if (result.darkMode) {
          chrome.tabs.sendMessage(tabId, {
            type: 'darkMode',
            enabled: true
          });
        }
        if (result.eyeCareMode) {
          chrome.tabs.sendMessage(tabId, {
            type: 'eyeCare',
            enabled: true,
            color: result.backgroundColor
          });
        }
        if (result.brightness !== 100) {
          chrome.tabs.sendMessage(tabId, {
            type: 'brightness',
            value: result.brightness
          });
        }
      } catch (error) {
        console.error('Error applying settings:', error);
      }
    });
  }
});

// 监听重新加载请求
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'RELOAD_EXTENSION') {
    chrome.runtime.reload();
    sendResponse({ success: true });
  }
}); 