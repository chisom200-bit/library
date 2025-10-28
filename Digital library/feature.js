document.addEventListener('DOMContentLoaded', function () {
    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Highlight active navbar link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Toggle feature details
    document.querySelectorAll('.toggle-details').forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const details = document.getElementById(targetId);
            details.style.display = details.style.display === 'block' ? 'none' : 'block';
            this.textContent = details.style.display === 'block' ? 'Show Less' : 'Learn More';
        });
    });

    // Resource filter
    const resourceFilter = document.getElementById('resourceFilter');
    const resourceList = document.getElementById('resourceList');
    const resourceCards = resourceList.querySelectorAll('.resource-card');

    window.filterResources = function () {
        const filterValue = resourceFilter.value;
        resourceCards.forEach(card => {
            if (filterValue === 'all' || card.classList.contains(filterValue)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        updatePagination();
    };

    // Pagination
    function updatePagination() {
        const visibleCards = Array.from(resourceCards).filter(card => card.style.display !== 'none');
        const itemsPerPage = 6;
        const totalPages = Math.ceil(visibleCards.length / itemsPerPage);
        const pagination = document.querySelector('.resource-pagination .pagination');
        pagination.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = 'page-item';
            li.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${i})">${i}</a>`;
            pagination.appendChild(li);
        }

        goToPage(1);
    }

    window.goToPage = function (page) {
        const itemsPerPage = 6;
        const visibleCards = Array.from(resourceCards).filter(card => card.style.display !== 'none');
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        resourceCards.forEach(card => card.style.display = 'none');
        visibleCards.slice(start, end).forEach(card => card.style.display = 'block');

        document.querySelectorAll('.resource-pagination .page-item').forEach((item, index) => {
            item.classList.toggle('active', index + 1 === page);
        });
    };

    // Initialize pagination
    updatePagination();

    // Chatbot functionality
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');

    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.style.display = chatbotWindow.style.display === 'block' ? 'none' : 'block';
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.style.display = 'none';
    });

    window.sendChatbotMessage = function () {
        const message = chatbotInput.value.trim();
        if (!message) return;

        const userMessage = document.createElement('div');
        userMessage.className = 'chatbot-message user';
        userMessage.textContent = message;
        chatbotMessages.appendChild(userMessage);

        // Simple AI response simulation
        const botMessage = document.createElement('div');
        botMessage.className = 'chatbot-message bot';
        if (message.toLowerCase().includes('video')) {
            botMessage.textContent = 'Check out our reliable video tutorials in the Resource Gallery, including Python and JavaScript courses!';
        } else if (message.toLowerCase().includes('pdf')) {
            botMessage.textContent = 'Explore our curated PDFs like "Eloquent JavaScript" in the Resource Gallery!';
        } else if (message.toLowerCase().includes('research')) {
            botMessage.textContent = 'Dive into research papers on AI and Machine Learning in our Research Works section!';
        } else {
            botMessage.textContent = 'I can help with videos, PDFs, or research works. Try asking about one of those!';
        }
        chatbotMessages.appendChild(botMessage);

        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        chatbotInput.value = '';
    };

    // Show back-to-top button on scroll
    window.addEventListener('scroll', () => {
        const backToTop = document.querySelector('.back-to-top');
        backToTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
});