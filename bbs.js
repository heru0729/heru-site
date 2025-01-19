// スレッドの投稿処理
document.getElementById('postForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const threadName = document.getElementById('threadName').value;
    const threadContent = document.getElementById('threadContent').value;

    if (threadName && threadContent) {
        const threadContainer = document.querySelector('.thread-container');
        const threadItem = document.createElement('div');
        threadItem.classList.add('thread-item');
        threadItem.innerHTML = `
            <div class="thread-name">${threadName}</div>
            <div class="thread-content">${threadContent}</div>
            <div class="thread-date">${new Date().toLocaleString()}</div>
            <section class="response-form">
                <h3>レスを投稿</h3>
                <textarea placeholder="レスの内容"></textarea>
                <button onclick="postResponse(event, this)">レスする</button>
            </section>
            <div class="responses"></div>
        `;
        threadContainer.appendChild(threadItem);

        // フォームをリセット
        document.getElementById('threadName').value = '';
        document.getElementById('threadContent').value = '';
    }
});

// レスポンスの投稿処理
function postResponse(event, button) {
    const responseContent = button.previousElementSibling.value;
    const responsesContainer = button.closest('.thread-item').querySelector('.responses');

    if (responseContent) {
        const responseItem = document.createElement('div');
        responseItem.classList.add('response-item');
        responseItem.innerHTML = `
            <div class="response-name">名無しさん</div>
            <div class="response-content">${responseContent}</div>
        `;
        responsesContainer.appendChild(responseItem);
        button.previousElementSibling.value = ''; // 入力フィールドをクリア
    }
}
