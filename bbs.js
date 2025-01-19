let threads = [];
let comments = [];

function postThread() {
    const title = document.getElementById('threadTitle').value;
    const content = document.getElementById('threadContent').value;

    if (title && content) {
        const thread = { title, content, id: Date.now() };
        threads.push(thread);
        displayThreads();
        document.getElementById('threadTitle').value = '';
        document.getElementById('threadContent').value = '';
    }
}

function postComment() {
    const commentContent = document.getElementById('commentContent').value;

    if (commentContent) {
        const comment = { content: commentContent, id: Date.now() };
        comments.push(comment);
        displayComments();
        document.getElementById('commentContent').value = '';
    }
}

function displayThreads() {
    const threadList = document.getElementById('threadList');
    threadList.innerHTML = '';

    threads.forEach(thread => {
        const threadElement = document.createElement('div');
        threadElement.classList.add('thread');
        threadElement.innerHTML = `
            <h3>${thread.title}</h3>
            <p>${thread.content}</p>
        `;
        threadList.appendChild(threadElement);
    });
}

function displayComments() {
    const commentList = document.getElementById('commentList');
    commentList.innerHTML = '';

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `<p>${comment.content}</p>`;
        commentList.appendChild(commentElement);
    });
}
