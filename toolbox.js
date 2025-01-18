let cipherTable = {};
let reverseCipherTable = {};

// 初期化: JSONファイルから暗号テーブルを読み込む
async function loadCipherTable() {
  try {
    const response = await fetch("cipher.json");
    if (!response.ok) {
      throw new Error("cipher.json ファイルの読み込みに失敗しました");
    }
    cipherTable = await response.json();
    reverseCipherTable = Object.fromEntries(
      Object.entries(cipherTable).map(([key, value]) => [value, key])
    );
    console.log("暗号テーブルを読み込みました:", cipherTable);
    console.log("逆暗号テーブルを作成しました:", reverseCipherTable);
  } catch (error) {
    console.error("暗号テーブルの読み込み中にエラーが発生しました:", error);
    alert("暗号テーブルの読み込みに失敗しました。");
  }
}

// ページ読み込み時に暗号テーブルをロード
window.onload = () => {
  loadCipherTable();
};

// 暗号変換/復号
function convertCipher() {
  const inputText = document.getElementById("cipherInput").value.trim();
  let result = '';

  // デバッグ用ログ
  console.log("入力:", inputText);

  // 数字のみの場合（暗号と仮定して復号）
  if (/^\d+$/.test(inputText)) {
    console.log("復号処理を開始");
    let i = 0;
    while (i < inputText.length) {
      // ひらがな一文字に対応するコードは3桁
      const code = inputText.slice(i, i + 3); // 3桁ずつ取得
      result += reverseCipherTable[code] || code; // テーブルから復号、無ければそのまま
      i += 3; // 3文字分進む
    }
  } 
  // ひらがなの場合（平文と仮定して暗号化）
  else if (/^[\u3040-\u309F]+$/.test(inputText)) {
    console.log("暗号化処理を開始");
    for (let char of inputText) {
      result += cipherTable[char] || char; // テーブルから暗号化、無ければそのまま
    }
  } 
  // その他の入力（ひらがなまたは数字以外）
  else {
    result = "入力形式が不正です。ひらがなまたは数字のみを入力してください。";
  }

  // 結果の出力
  console.log("結果:", result);
  document.getElementById("cipherResult").textContent = result;
}

// 結果をコピー
function copyCipherResult() {
  const cipherResult = document.getElementById("cipherResult").textContent;
  navigator.clipboard.writeText(cipherResult).then(() => {
    alert("結果をコピーしました！");
  });
}

// 日付計算
function calculateDate() {
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);

  if (isNaN(startDate) || isNaN(endDate)) {
    document.getElementById("dateResult").textContent = "有効な日付を入力してください。";
    return;
  }

  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  document.getElementById("dateResult").textContent = `${diffDays}日`;
}

// 文字化け変換
function convertText() {
  const text = document.getElementById("textInput").value;
  const encoding = document.getElementById("encodingSelect").value;

  try {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder(encoding);
    const bytes = encoder.encode(text);
    const converted = decoder.decode(bytes);
    document.getElementById("textResult").textContent = converted;
  } catch (error) {
    console.error("文字化け変換中にエラーが発生しました:", error);
    document.getElementById("textResult").textContent = "変換中にエラーが発生しました。";
  }
}

// 結果をコピー
function copyTextResult() {
  const textResult = document.getElementById("textResult").textContent;
  navigator.clipboard.writeText(textResult).then(() => {
    alert("結果をコピーしました！");
  });
}

// ツール切り替え
function showTool(toolId) {
  document.querySelectorAll(".tool").forEach((tool) => {
    tool.style.display = "none";
  });
  document.getElementById(toolId).style.display = "block";
}

// メインページに戻る
function goToMainPage() {
  document.querySelectorAll(".tool").forEach((tool) => {
    tool.style.display = "none";
  });
}
