// Enhanced Timer with Seconds
let timerInterval;
let timeLeft = 25 * 60; // in seconds
let isRunning = false;

document.getElementById('startTimer').addEventListener('click', startTimer);
document.getElementById('pauseTimer').addEventListener('click', pauseTimer);
document.getElementById('resetTimer').addEventListener('click', resetTimer);

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                alert('Time is up! Take a break!');
            }
        }, 1000);
    }
    toggleTimerButtons(true);
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    toggleTimerButtons(false);
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 25 * 60;
    isRunning = false;
    updateTimerDisplay();
    toggleTimerButtons(false);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.querySelector('.timer-display').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function toggleTimerButtons(running) {
    document.getElementById('startTimer').disabled = running;
    document.getElementById('pauseTimer').disabled = !running;
}

// PDF Download Functionality
document.getElementById('downloadNotes').addEventListener('click', () => {
    const doc = new jspdf.jsPDF();
    const text = document.getElementById('mainEditor').value;
    doc.text(text, 10, 10);
    doc.save('study-notes.pdf');
});

// Working Chat System
const chatMessages = document.getElementById('chatMessages');
document.getElementById('sendMessage').addEventListener('click', sendMessage);

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        messageDiv.innerHTML = `
            <div class="message-user">You:</div>
            <div class="message-content">${message}</div>
        `;
        chatMessages.appendChild(messageDiv);
        input.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate received message (replace with actual WebSocket implementation)
        setTimeout(() => {
            const responseDiv = document.createElement('div');
            responseDiv.className = 'message received';
            responseDiv.innerHTML = `
                <div class="message-user">StudyBot:</div>
                <div class="message-content">Thanks for your message!</div>
            `;
            chatMessages.appendChild(responseDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
}

// YouTube Video Search
let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        events: {
            'onReady': onPlayerReady
        }
    });
}

document.getElementById('searchVideos').addEventListener('click', async () => {
    const searchQuery = document.getElementById('videoSearch').value;
    const API_KEY = 'YOUR_YOUTUBE_API_KEY';
    
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(searchQuery + ' educational')}&type=video&key=${API_KEY}`
        );
        const data = await response.json();
        
        const results = document.getElementById('videoResults');
        results.innerHTML = '';
        
        data.items.forEach(item => {
            const videoHtml = `
                <div class="col-md-6">
                    <div class="glass-card p-3 video-card">
                        <div class="ratio ratio-16x9 mb-3">
                            <iframe src="https://www.youtube.com/embed/${item.id.videoId}" 
                                    allowfullscreen></iframe>
                        </div>
                        <h6 class="text-light">${item.snippet.title}</h6>
                    </div>
                </div>
            `;
            results.insertAdjacentHTML('beforeend', videoHtml);
        });
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
});

// Live Classes (Sample Data)
const liveClasses = [
    {
        title: "Physics Masterclass",
        time: "Starts in 15 mins",
        tutor: "Dr. Emily Johnson"
    },
    // Add more sample classes
];

function populateLiveClasses() {
    const container = document.getElementById('liveClasses');
    container.innerHTML = liveClasses.map(cls => `
        <div class="col-md-4">
            <div class="glass-card p-3 live-class">
                <div class="badge bg-danger mb-2">Starting Soon</div>
                <h5 class="text-light">${cls.title}</h5>
                <p class="text-light opacity-75">${cls.time}</p>
                <p class="text-light opacity-75">With ${cls.tutor}</p>
                <button class="btn btn-sm btn-primary w-100">
                    Join Class
                </button>
            </div>
        </div>
    `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateLiveClasses();
    updateTimerDisplay();
});


// Task Management
function addTask() {
    const input = document.getElementById('taskInput');
    const list = document.getElementById('taskList');
    
    if (input.value.trim()) {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            ${input.value}
            <button class="btn btn-sm btn-danger" onclick="this.parentElement.remove()">
                <i class="fas fa-trash"></i>
            </button>
        `;
        list.appendChild(li);
        input.value = '';
    }
}







// ################################################       Feature Tabs Interaction





document.querySelectorAll('#featureTabs .nav-link').forEach(tab => {
    tab.addEventListener('shown.bs.tab', event => {
        const target = document.querySelector(event.target.dataset.bsTarget);
        target.querySelectorAll('.feature-card').forEach(card => {
            card.style.opacity = 0;
            setTimeout(() => {
                card.style.opacity = 1;
                card.style.transform = 'translateY(0)';
            }, 200);
        });
    });
});

// Feature Filter System
const featureFilter = document.createElement('div');
featureFilter.innerHTML = `
    <div class="glass-card p-3 mb-4">
        <input type="text" class="form-control glass-input" 
               placeholder="Search features..." id="featureSearch">
    </div>
`;
document.querySelector('.features-hero').after(featureFilter);

document.getElementById('featureSearch').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    document.querySelectorAll('.feature-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
});

// Feature Tooltips
document.querySelectorAll('.feature-icon').forEach(icon => {
    new bootstrap.Tooltip(icon, {
        title: icon.parentNode.querySelector('h3').textContent,
        placement: 'right',
        trigger: 'hover'
    });
});

// Testimonial Carousel
const testimonialCarousel = new bootstrap.Carousel('#testimonialCarousel', {
    interval: 5000,
    wrap: true
});

// FAQ Interaction
document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
    });
});








/* #######################################   Contact Form    #################################   */




// Contact Form Handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.id = 'formSuccess';
    successMsg.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-check-circle me-2"></i>
            <span class="text-light">Message sent successfully!</span>
        </div>
    `;
    this.parentNode.insertBefore(successMsg, this.nextSibling);
    
    // Reset form
    this.reset();
    
    // Hide message after 5 seconds
    setTimeout(() => {
        successMsg.style.opacity = '0';
        setTimeout(() => successMsg.remove(), 300);
    }, 5000);
});