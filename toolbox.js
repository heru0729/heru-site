let cipherTable = {};
let reverseCipherTable = {};

// 初期化: JSONファイルから暗号テーブルを読み込む
async function loadCipherTable() {
  try {
    const response = await fetch("cipher.json");
    cipherTable = await response.json();
    reverseCipherTable = Object.fromEntries(
      Object.entries(cipherTable).map(([key, value]) => [value, key])
    );
    console.log("暗号テーブルを読み込みました:", cipherTable);
  } catch (error) {
    console.error("暗号テーブルの読み込み中にエラーが発生しました:", error);
  }
}

// ページ読み込み時に暗号テーブルをロード
window.onload = () => {
  loadCipherTable();
};

// ツールの切り替え
function showTool(toolId) {
  document.querySelectorAll(".tool").forEach(tool => {
    tool.style.display = "none";
  });
  document.getElementById(toolId).style.display = "block";
}

// 日付計算
function calculateDate() {
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);

  if (isNaN(startDate) || isNaN(endDate)) {
    document.getElementById("dateResult").textContent = "無効な日付です。";
    return;
  }

  const diff = Math.abs(endDate - startDate);
  const days = diff / (1000 * 60 * 60 * 24);
  document.getElementById("dateResult").textContent = `${days}日間`;
}

// 文字化け変換
function convertText() {
  const text = document.getElementById("textInput").value;
  const encoding = document.getElementById("encodingSelect").value;

  // 簡易なシミュレーション（エンコード処理を模倣）
  document.getElementById("textResult").textContent = `変換後(${encoding}): ${text}`;
}

function copyTextResult() {
  const result = document.getElementById("textResult").textContent;
  navigator.clipboard.writeText(result).then(() => {
    alert("結果をコピーしました！");
  });
}

// 暗号化/復号
function convertCipher() {
  const inputText = document.getElementById("cipherInput").value.trim();
  let result = "";

  if (/^[\dA-Z<>]+$/.test(inputText)) { // 復号処理
    const regex = /[A-Z<>]|[\d]{2}/g;
    result = inputText.match(regex).map(code => reverseCipherTable[code] || code).join('');
  } else if (/^[\u3040-\u309Fー。、]+$/.test(inputText)) { // 暗号化処理
    for (let char of inputText) {
      result += cipherTable[char] || char;
    }
  } else {
    result = "入力形式が不正です。平文または暗号を入力してください。";
  }

  document.getElementById("cipherResult").textContent = result;
}

function copyCipherResult() {
  const result = document.getElementById("cipherResult").textContent;
  navigator.clipboard.writeText(result).then(() => {
    alert("結果をコピーしました！");
  });
}

// Base64 エンコード/デコード
function convertBase64(action) {
  const mode = document.getElementById("base64Mode").value;
  const output = document.getElementById("base64Result");

  if (mode === "text") {
    const text = document.getElementById("base64Input").value;
    output.textContent = action === "encode"
      ? btoa(unescape(encodeURIComponent(text)))
      : decodeURIComponent(escape(atob(text)));
  } else {
    const file = document.getElementById("imageInput").files[0];
    const reader = new FileReader();
    if (action === "encode" && file) {
      reader.onload = () => output.textContent = reader.result;
      reader.readAsDataURL(file);
    } else if (action === "decode") {
      const base64String = document.getElementById("base64Input").value;
      output.innerHTML = `<img src="${base64String}" alt="Decoded Image" />`;
    }
  }
}

// モード切り替え
document.getElementById("base64Mode").addEventListener("change", () => {
  const mode = document.getElementById("base64Mode").value;
  document.getElementById("textInputSection").style.display = mode === "text" ? "block" : "none";
  document.getElementById("imageInputSection").style.display = mode === "image" ? "block" : "none";
});

// メインページへの遷移
function goToMainPage() {
  window.location.href = "index.html";
}
