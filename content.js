// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  if (request.type === 'darkMode') {
    document.documentElement.style.filter = request.enabled ? 
      'invert(1) hue-rotate(180deg)' : '';
    document.body.style.backgroundColor = request.enabled ? 
      '#ffffff' : '';
  }
  
  if (request.type === 'eyeCare') {
    document.body.style.backgroundColor = request.enabled ? 
      request.color : '';
  }
  
  if (request.type === 'brightness') {
    document.documentElement.style.filter = 
      `brightness(${request.value}%)`;
  }
  
  sendResponse({ success: true });
}); 