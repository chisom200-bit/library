document.addEventListener('DOMContentLoaded', function () {
    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // FAQ accordion toggle
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const answer = document.getElementById(targetId);
            const isOpen = answer.style.display === 'block';

            // Close all other answers
            document.querySelectorAll('.faq-answer').forEach(ans => {
                ans.style.display = 'none';
            });
            document.querySelectorAll('.faq-question').forEach(btn => {
                btn.classList.remove('active');
                btn.querySelector('i').classList.remove('fa-chevron-up');
                btn.querySelector('i').classList.add('fa-chevron-down');
            });

            // Toggle current answer
            if (!isOpen) {
                answer.style.display = 'block';
                this.classList.add('active');
                this.querySelector('i').classList.remove('fa-chevron-down');
                this.querySelector('i').classList.add('fa-chevron-up');
            }
        });
    });

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
        if (message.toLowerCase().includes('resources')) {
            botMessage.textContent = 'Browse free PDFs, videos, and research papers in our Books & Research section!';
        } else if (message.toLowerCase().includes('features')) {
            botMessage.textContent = 'Check out our code playground, AI recommendations, forums, and more on the Features page!';
        } else if (message.toLowerCase().includes('contact')) {
            botMessage.textContent = 'Use the Contact form or connect via Twitter, LinkedIn, or GitHub!';
        } else {
            botMessage.textContent = 'I can help with resources, features, or contact info. Try asking about one of those!';
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