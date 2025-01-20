let cipherTable = {};
let reverseCipherTable = {};

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

window.onload = () => {
  loadCipherTable();
};

function convertCipher() {
  const inputText = document.getElementById("cipherInput").value.trim();
  let result = "";

  console.log("入力:", inputText);

  if (/^[\dA-Z<>]+$/.test(inputText)) {
    console.log("復号処理を開始");
    let i = 0;
    while (i < inputText.length) {
      let code = "";

      // 3文字の場合（例: "12A"）
      if (i + 2 < inputText.length && /^[A-C]$/.test(inputText[i + 2])) {
        code = inputText.slice(i, i + 3);
        i += 3;
      }
      // 2文字の場合（数字のみ、例: "12"）
      else if (i + 1 < inputText.length && /^[0-9]{2}$/.test(inputText.slice(i, i + 2))) {
        code = inputText.slice(i, i + 2);
        i += 2;
      }
      // 1文字の場合（例: "D", "<", ">"）
      else {
        code = inputText[i];
        i++;
      }

      result += reverseCipherTable[code] || code;
    }
  }
  // 入力が平文の場合
  else if (/^[\u3040-\u309Fー。、]+$/.test(inputText)) {
    console.log("暗号化処理を開始");
    for (let char of inputText) {
      result += cipherTable[char] || char;
    }
  }
  // 入力が無効な場合
  else {
    result = "入力形式が不正です。平文または暗号形式を入力してください。";
  }

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
