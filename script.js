document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("new-comment");
    const commentText = document.getElementById("comment-text");
    const commentsDiv = document.getElementById("comments");
    const clearButton = document.getElementById("clear-comments");
    const toggleThemeButton = document.getElementById("toggle-theme");

    // โหลดคอมเมนต์จาก LocalStorage เมื่อหน้าเว็บโหลด
    loadComments();

    // โหลดโหมดธีมจาก LocalStorage
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        toggleThemeButton.textContent = '☀️';
    }

    // ฟังก์ชันสลับธีม
    toggleThemeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            toggleThemeButton.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            toggleThemeButton.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const text = commentText.value.trim();
        if (text === "") {
            alert("กรุณากรอกข้อความก่อนส่ง");
            return;
        }

        const comment = {
            id: Date.now(),
            text: text,
            date: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }),
            likes: 0
        };

        saveComment(comment);
        addCommentToDOM(comment);
        commentText.value = "";
    });

    clearButton.addEventListener("click", function() {
        if (confirm("คุณต้องการล้างความคิดเห็นทั้งหมดหรือไม่?")) {
            localStorage.removeItem("comments");
            commentsDiv.innerHTML = "<h2>ความคิดเห็น:</h2>";
        }
    });

    function getComments() {
        let comments = localStorage.getItem("comments");
        return comments ? JSON.parse(comments) : [];
    }

    function saveComments(comments) {
        localStorage.setItem("comments", JSON.stringify(comments));
    }

    function saveComment(comment) {
        const comments = getComments();
        comments.push(comment);
        saveComments(comments);
    }

    function deleteComment(id) {
        let comments = getComments();
        comments = comments.filter(comment => comment.id !== id);
        saveComments(comments);
        displayComments();
    }

    function likeComment(id) {
        let comments = getComments();
        comments = comments.map(comment => {
            if (comment.id === id) {
                return { ...comment, likes: comment.likes + 1 };
            }
            return comment;
        });
        saveComments(comments);
        displayComments();
    }

    function addCommentToDOM(comment) {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");

        const textP = document.createElement("p");
        textP.classList.add("comment-text");
        textP.textContent = comment.text;

        const dateSpan = document.createElement("span");
        dateSpan.classList.add("comment-date");
        dateSpan.textContent = comment.date;

        const likeBtn = document.createElement("button");
        likeBtn.classList.add("like-button");
        likeBtn.textContent = `❤️ ${comment.likes}`;
        likeBtn.addEventListener("click", () => {
            likeComment(comment.id);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-button");
        deleteBtn.textContent = "ลบ";
        deleteBtn.addEventListener("click", () => {
            if (confirm("คุณต้องการลบความคิดเห็นนี้หรือไม่?")) {
                deleteComment(comment.id);
            }
        });

        commentDiv.appendChild(textP);
        commentDiv.appendChild(dateSpan);
        commentDiv.appendChild(likeBtn);
        commentDiv.appendChild(deleteBtn);
        commentsDiv.appendChild(commentDiv);
    }

    function displayComments() {
        const comments = getComments();
        commentsDiv.innerHTML = "<h2>ความคิดเห็น:</h2>";
        comments.reverse().forEach(comment => addCommentToDOM(comment));
    }

    function loadComments() {
        displayComments();
    }
});
