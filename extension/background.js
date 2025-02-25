chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchTranslations") {
    const translationFiles = ["data.json", "UI.json","药剂标签.json"]; // 你可以添加更多的 JSON 文件
    const translations = {};

    Promise.all(translationFiles.map(file => 
      fetch(chrome.runtime.getURL(`locales/${file}`))
        .then(response => response.json())
        .then(data => Object.assign(translations, data)) // 合并多个 JSON 数据
        .catch(error => console.error(`加载 ${file} 失败:`, error))
    )).then(() => {
      sendResponse({ success: true, translations });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });

    return true; // 让 Chrome 等待 `sendResponse`
  }
});
