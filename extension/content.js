// 检查文本是否为英文字符
function isEnglish(text) {
  return /^[A-Za-z0-9\s]+$/.test(text);
}

// 用于替换文本的函数
function replaceText(node, translations) {
  if (node.nodeType === Node.TEXT_NODE) {
    const trimmedText = node.nodeValue.trim().replace(/'/g, ''); // 去除单引号
    if (isEnglish(trimmedText) && translations[trimmedText]) {
      node.nodeValue = translations[trimmedText];
    }
  }
}

// 递归遍历 DOM 树并替换文本
function traverseAndReplace(node, translations) {
  if (node) {
    const childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      replaceText(childNode, translations);
      traverseAndReplace(childNode, translations);
    }
  }
}

function observeDOM(translations) {
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          traverseAndReplace(node, translations);
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

chrome.runtime.sendMessage({ action: "fetchTranslations" }, (response) => {
  if (response.success) {
    const translations = response.translations;
    console.log("翻译数据加载成功:");

    // 初始翻译
    traverseAndReplace(document.body, translations);
    console.log("初始翻译完成");

    // 监听 DOM 变化
    observeDOM(translations);
    console.log("已启动 MutationObserver 监听动态内容");
  } else {
    console.error("翻译数据加载失败:", response.error);
  }
});


