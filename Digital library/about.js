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

    // Toggle timeline details
    document.querySelectorAll('.toggle-timeline').forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const details = document.getElementById(targetId);
            details.style.display = details.style.display === 'block' ? 'none' : 'block';
            this.textContent = details.style.display === 'block' ? 'Show Less' : 'Details';
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
        if (message.toLowerCase().includes('mission')) {
            botMessage.textContent = 'Our mission is to democratize coding education with free, high-quality resources for all learners!';
        } else if (message.toLowerCase().includes('team')) {
            botMessage.textContent = 'Our team includes developers, educators, and community managers passionate about coding education. Check the Team section!';
        } else if (message.toLowerCase().includes('contact')) {
            botMessage.textContent = 'Reach out via our Contact modal, social media, or check our FAQ for quick answers!';
        } else if (message.toLowerCase().includes('history')) {
            botMessage.textContent = 'Our journey began in 2022, and we’ve grown to offer a wide range of coding resources. See the timeline for details!';
        } else {
            botMessage.textContent = 'I can help with our mission, team, history, or contact info. Try asking about one of those!';
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