const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

// JSONファイルに保存されたスレッド
let threads = [];

app.use(bodyParser.json());

// スレッドを保存するファイル
const THREADS_FILE = './threads.json';

// スレッドのロード
function loadThreads() {
  if (fs.existsSync(THREADS_FILE)) {
    threads = JSON.parse(fs.readFileSync(THREADS_FILE));
  }
}

// スレッドを保存
function saveThreads() {
  fs.writeFileSync(THREADS_FILE, JSON.stringify(threads, null, 2));
}

// 初期化
loadThreads();

// スレッド一覧取得
app.get('/api/threads', (req, res) => {
  res.json(threads);
});

// スレッド作成
app.post('/api/threads', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).send('タイトルが必要です');
  }

  // 新しいスレッド
  const newThread = { title, posts: [], id: Date.now() };
  threads.push(newThread);
  saveThreads();
  res.status(201).json(newThread);
});

// スレッドに書き込み
app.post('/api/threads/:id/posts', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  if (!content) {
    return res.status(400).send('書き込み内容が必要です');
  }

  const thread = threads.find(t => t.id == id);
  if (!thread) {
    return res.status(404).send('スレッドが見つかりません');
  }

  // 200レス制限
  if (thread.posts.length >= 200) {
    threads = threads.filter(t => t.id != id);
    saveThreads();
    return res.status(400).send('このスレッドは削除されました');
  }

  thread.posts.push({ content, id: Date.now() });
  saveThreads();
  res.status(201).json(thread);
});

// スレッド削除（200レスに達したら自動で削除される処理）
app.delete('/api/threads/:id', (req, res) => {
  const { id } = req.params;
  threads = threads.filter(t => t.id != id);
  saveThreads();
  res.status(204).send();
});

// サーバーの起動
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
