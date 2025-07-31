// Process Carousel Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Find the process section
    const processSection = document.getElementById('process');
    if (!processSection) return;

    // Find all process steps
    const stepsContainer = processSection.querySelector('.grid.gap-16');
    if (!stepsContainer) return;

    // Get all step divs (direct children with the step content)
    const steps = Array.from(stepsContainer.children);
    if (steps.length === 0) return;

    // Add process-step class to each step for styling
    steps.forEach(step => {
        step.classList.add('process-step');
    });

    // Create navigation container
    const navContainer = document.createElement('div');
    navContainer.className = 'flex justify-between items-center mt-8';
    navContainer.innerHTML = `
        <button id="prev-step" class="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <span>Previous</span>
        </button>
        <div class="flex gap-2">
            ${steps.map((_, index) => `
                <button class="step-indicator w-3 h-3 rounded-full bg-gray-600 transition-colors" data-step="${index}"></button>
            `).join('')}
        </div>
        <button id="next-step" class="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <span>Next</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
        </button>
    `;

    // Insert navigation after the steps container
    stepsContainer.parentNode.insertBefore(navContainer, stepsContainer.nextSibling);

    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    progressBar.className = 'absolute w-1 bg-gray-800';
    progressBar.innerHTML = `
        <div id="progress-line" class="absolute top-0 left-0 w-full bg-gradient-to-b from-purple-500 to-blue-500"></div>
        <div id="progress-dot" class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full"></div>
    `;
    
    // Insert progress bar at the beginning of steps container
    stepsContainer.style.position = 'relative';
    stepsContainer.insertBefore(progressBar, stepsContainer.firstChild);

    // Initialize carousel state
    let currentStep = 0;

    // Get navigation elements
    const prevButton = document.getElementById('prev-step');
    const nextButton = document.getElementById('next-step');
    const indicators = document.querySelectorAll('.step-indicator');
    const progressLine = document.getElementById('progress-line');
    const progressDot = document.getElementById('progress-dot');

    // Show only the first step initially
    function showStep(index) {
        steps.forEach((step, i) => {
            if (i === index) {
                step.style.display = 'block';
                step.style.animation = 'slideInFromRight 0.5s ease-out';
            } else {
                step.style.display = 'none';
            }
        });

        // Update indicators
        indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.remove('bg-gray-600');
                indicator.classList.add('bg-purple-500');
            } else {
                indicator.classList.remove('bg-purple-500');
                indicator.classList.add('bg-gray-600');
            }
        });

        // Update progress bar
        const progress = (index / (steps.length - 1)) * 100;
        progressLine.style.height = progress + '%';
        progressDot.style.top = progress + '%';

        // Update button states
        prevButton.disabled = index === 0;
        nextButton.disabled = index === steps.length - 1;

        currentStep = index;
    }

    // Navigation event handlers
    prevButton.addEventListener('click', () => {
        if (currentStep > 0) {
            showStep(currentStep - 1);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            showStep(currentStep + 1);
        }
    });

    // Indicator click handlers
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showStep(index);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Only work when process section is in view
        const rect = processSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInView) {
            if (e.key === 'ArrowLeft' && currentStep > 0) {
                showStep(currentStep - 1);
            } else if (e.key === 'ArrowRight' && currentStep < steps.length - 1) {
                showStep(currentStep + 1);
            }
        }
    });

    // Initialize
    showStep(0);
});