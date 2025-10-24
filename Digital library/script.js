document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap Tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });

    // Search Functionality
    function searchBooks() {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        const searchLoading = document.querySelector('.search-loading');
        searchLoading.style.display = 'block';
        setTimeout(() => {
            const bookCards = document.querySelectorAll('.book-card');
            let found = false;
            bookCards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const text = card.querySelector('.card-text').textContent.toLowerCase();
                if (title.includes(searchInput) || text.includes(searchInput)) {
                    card.style.display = 'block';
                    found = true;
                } else {
                    card.style.display = 'none';
                }
            });
            searchLoading.style.display = 'none';
            if (!found) {
                alert('No books found matching your search.');
            }
        }, 1000);
    }

    function clearSearch() {
        document.getElementById('searchInput').value = '';
        const bookCards = document.querySelectorAll('.book-card');
        bookCards.forEach(card => card.style.display = 'block');
    }

    window.searchBooks = searchBooks;
    window.clearSearch = clearSearch;

    // Category Filter
    function filterCategory() {
        const category = document.getElementById('categoryFilter').value;
        const sections = document.querySelectorAll('.accordion-item');
        sections.forEach(section => {
            if (category === 'all' || section.id.toLowerCase().includes(category.toLowerCase())) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }

    window.filterCategory = filterCategory;

    /* ---- REAL SEARCH FUNCTION ---- */
    function searchBooks() {
        const term = document.getElementById('searchInput').value.trim().toLowerCase();
        const loading = document.querySelector('.search-loading');
        loading.style.display = 'block';

        setTimeout(() => {
            const cards = document.querySelectorAll('.book-card');
            let found = false;

            cards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const desc  = card.querySelector('.card-text').textContent.toLowerCase();

                if (term === '' || title.includes(term) || desc.includes(term)) {
                    card.style.display = 'block';
                    found = true;
                } else {
                    card.style.display = 'none';
                }
            });

            loading.style.display = 'none';
            if (!found && term !== '') {
                alert('No books match your search.');
            }
        }, 600);
    }

    function clearSearch() {
        document.getElementById('searchInput').value = '';
        document.querySelectorAll('.book-card').forEach(c => c.style.display = 'block');
    }

    window.searchBooks = searchBooks;
    window.clearSearch = clearSearch;

    // Pagination for Books
    function setupPagination() {
        const bookCarousels = document.querySelectorAll('.book-carousel');
        bookCarousels.forEach(carousel => {
            const books = carousel.querySelectorAll('.book-card');
            const pagination = carousel.nextElementSibling.querySelector('.pagination');
            const booksPerPage = 3;
            const totalPages = Math.ceil(books.length / booksPerPage);

            for (let i = 0; i < totalPages; i++) {
                const pageItem = document.createElement('li');
                pageItem.className = 'page-item';
                pageItem.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
                pagination.appendChild(pageItem);
            }

            pagination.querySelector('.page-item').classList.add('active');
            books.forEach((book, index) => {
                if (index >= booksPerPage) book.style.display = 'none';
            });

            pagination.querySelectorAll('.page-item').forEach((item, index) => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    pagination.querySelectorAll('.page-item').forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                    books.forEach((book, bookIndex) => {
                        book.style.display = (bookIndex >= index * booksPerPage && bookIndex < (index + 1) * booksPerPage) ? 'block' : 'none';
                    });
                });
            });
        });
    }

    setupPagination();

    // Chatbot Functionality
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');

    function toggleChatbot() {
        chatbotWindow.style.display = chatbotWindow.style.display === 'none' ? 'flex' : 'none';
    }

    function closeChatbot() {
        chatbotWindow.style.display = 'none';
    }

    function sendChatbotMessage() {
        const message = chatbotInput.value.trim();
        if (message === '') return;

        const userMessage = document.createElement('div');
        userMessage.className = 'chatbot-message user';
        userMessage.textContent = message;
        chatbotMessages.appendChild(userMessage);

        const techKeywords = ['robotics', 'programming', 'ui', 'ux', 'machine learning', 'data science', 'web development', 'ai', 'artificial intelligence', 'python', 'javascript', 'html', 'css'];
        const isTechRelated = techKeywords.some(keyword => message.toLowerCase().includes(keyword));

        const botMessage = document.createElement('div');
        botMessage.className = 'chatbot-message bot';
        if (isTechRelated) {
            botMessage.textContent = `Great question about ${message}! Here's a brief answer: This topic is part of our library's resources. Check out the relevant section for books and videos, or ask me for specific recommendations!`;
        } else {
            botMessage.textContent = `Hmm, that doesn't seem to be a tech-related question. I can help with topics like Robotics, Programming, UI/UX, Machine Learning, Data Science, Web Development, or AI. Try asking about one of those!`;
        }
        chatbotMessages.appendChild(botMessage);

        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        chatbotInput.value = '';
    }

    chatbotToggle.addEventListener('click', toggleChatbot);
    chatbotClose.addEventListener('click', closeChatbot);
    window.sendChatbotMessage = sendChatbotMessage;

    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatbotMessage();
        }
    });
});