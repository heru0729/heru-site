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
    console.log("逆暗号テーブルを作成しました:", reverseCipherTable);
  } catch (error) {
    console.error("暗号テーブルの読み込み中にエラーが発生しました:", error);
  }
}

// ページ読み込み時に暗号テーブルをロード
window.onload = () => {
  loadCipherTable();
};

// 暗号化/復号
function convertCipher() {
  const inputText = document.getElementById("cipherInput").value.trim();
  let result = "";

  if (/^[\dA-Z<>]+$/.test(inputText)) { // 復号処理
    let i = 0;
    while (i < inputText.length) {
      let code;
      if (i + 2 < inputText.length && /^[A-Z<>]$/.test(inputText[i + 2])) {
        code = inputText.slice(i, i + 3);
        i += 3;
      } else {
        code = inputText.slice(i, i + 2);
        i += 2;
      }
      result += reverseCipherTable[code] || code;
    }
  } else if (/^[\u3040-\u309Fー。、]+$/.test(inputText)) { // 暗号化処理
    for (let char of inputText) {
      result += cipherTable[char] || char;
    }
  } else {
    result = "入力形式が不正です。平文または暗号を入力してください。";
  }

  document.getElementById("cipherResult").textContent = result;
}

// 結果をコピー
function copyCipherResult() {
  const cipherResult = document.getElementById("cipherResult").textContent;
  navigator.clipboard.writeText(cipherResult).then(() => {
    alert("結果をコピーしました！");
  });
}

// Base64 エンコード/デコード
function convertBase64(action) {
  const mode = document.getElementById("base64Mode").value;
  const output = document.getElementById("base64Result");

  if (mode === "text") {
    const text = document.getElementById("base64Input").value;

    if (action === "encode") {
      output.textContent = btoa(unescape(encodeURIComponent(text)));
    } else {
      try {
        output.textContent = decodeURIComponent(escape(atob(text)));
      } catch {
        output.textContent = "デコードエラー: 無効なBase64形式です";
      }
    }
  } else if (mode === "image") {
    if (action === "encode") {
      const file = document.getElementById("imageInput").files[0];
      if (!file) {
        output.textContent = "画像ファイルを選択してください";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        output.textContent = reader.result;
      };
      reader.readAsDataURL(file);
    } else if (action === "decode") {
      const base64String = document.getElementById("base64Input").value;
      if (!base64String.startsWith("data:image/")) {
        output.textContent = "デコードエラー: 無効なBase64画像形式です";
        return;
      }
      const imgElement = document.createElement("img");
      imgElement.src = base64String;
      output.innerHTML = "";
      output.appendChild(imgElement);
    }
  }
}

// モード選択に応じたUIの切り替え
document.getElementById("base64Mode").addEventListener("change", () => {
  const mode = document.getElementById("base64Mode").value;
  const textInputSection = document.getElementById("textInputSection");
  const imageInputSection = document.getElementById("imageInputSection");

  if (mode === "text") {
    textInputSection.style.display = "block";
    imageInputSection.style.display = "none";
  } else if (mode === "image") {
    textInputSection.style.display = "none";
    imageInputSection.style.display = "block";
  }
});

// メインページに戻る
function goToMainPage() {
  window.location.href = 'index.html';
}
