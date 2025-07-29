// Final process navigation - guaranteed to show only one step
(function() {
    function init() {
        console.log('Starting process navigation...');
        
        const processSection = document.getElementById('process');
        if (!processSection) {
            setTimeout(init, 500);
            return;
        }
        
        // Find the steps container
        let stepsContainer = null;
        const divs = processSection.getElementsByTagName('div');
        
        for (let div of divs) {
            if (div.className && div.className.includes('space-y-16')) {
                stepsContainer = div;
                break;
            }
        }
        
        if (!stepsContainer) {
            console.error('Steps container not found');
            return;
        }
        
        // Get all step elements (direct children with 'relative' and 'grid' classes)
        const allSteps = [];
        for (let child of stepsContainer.children) {
            if (child.tagName === 'DIV' && 
                child.className.includes('relative') && 
                child.className.includes('grid')) {
                allSteps.push(child);
            }
        }
        
        if (allSteps.length === 0) {
            console.error('No steps found');
            return;
        }
        
        console.log(`Found ${allSteps.length} steps`);
        
        // Hide the progress line and dot
        const progressElements = processSection.querySelectorAll('[id*="progress"]');
        progressElements.forEach(elem => {
            if (elem.id && (elem.id.includes('progress-bar') || 
                          elem.id.includes('progress-line') || 
                          elem.id.includes('progress-dot'))) {
                elem.style.display = 'none';
            }
        });
        
        // Also hide any absolute positioned lines and dots
        const allDivs = processSection.querySelectorAll('div');
        allDivs.forEach(div => {
            if (div.className && div.className.includes('absolute') && 
                div.className.includes('w-1') && div.className.includes('bg-gradient')) {
                div.style.display = 'none';
            }
            // Hide any progress dots
            if (div.className && div.className.includes('absolute') && 
                div.className.includes('w-4') && div.className.includes('h-4') && 
                div.className.includes('rounded-full')) {
                div.style.display = 'none';
            }
        });
        
        // Process each step
        allSteps.forEach((step, index) => {
            // Hide ALL dots and circles within each step
            const dots = step.querySelectorAll('div');
            dots.forEach(dot => {
                // Check for any circular element
                if (dot.className && dot.className.includes('rounded-full')) {
                    // Check if it's a small dot (not the icon container)
                    if ((dot.className.includes('w-4') && dot.className.includes('h-4')) ||
                        (dot.className.includes('w-3') && dot.className.includes('h-3')) ||
                        (dot.className.includes('w-2') && dot.className.includes('h-2'))) {
                        dot.style.display = 'none';
                    }
                }
            });
            
            // Hide the numbered circle on the right
            const circles = step.querySelectorAll('div');
            circles.forEach(circle => {
                // Large decorative circle
                if (circle.className && 
                    circle.className.includes('rounded-full') && 
                    circle.className.includes('w-64')) {
                    circle.style.display = 'none';
                }
                // Small numbered circles
                if (circle.textContent && 
                    circle.textContent.match(/^[1-6]$/) && 
                    circle.className && 
                    circle.className.includes('rounded-full')) {
                    // Hide the entire number circle structure
                    let parent = circle.parentElement;
                    while (parent && parent !== step) {
                        if (parent.className && 
                            (parent.className.includes('absolute') || 
                             parent.className.includes('relative flex justify-center'))) {
                            parent.style.display = 'none';
                            break;
                        }
                        parent = parent.parentElement;
                    }
                }
            });
            
            // Make the step take full width and center content
            step.style.gridTemplateColumns = '1fr';
            step.style.justifyItems = 'center';
            
            // Center the content
            const contentAreas = step.querySelectorAll('div');
            contentAreas.forEach(div => {
                if (div.className && div.className.includes('space-y-4')) {
                    div.style.textAlign = 'center';
                    div.style.margin = '0 auto';
                    div.style.maxWidth = '500px';
                    div.style.padding = '40px 0';
                    
                    // Center the icon/title flex container
                    const flexDivs = div.querySelectorAll('div');
                    flexDivs.forEach(flex => {
                        if (flex.className && 
                            flex.className.includes('flex') && 
                            flex.className.includes('items-center')) {
                            flex.style.justifyContent = 'center';
                            flex.style.gap = '16px';
                            flex.style.marginBottom = '20px';
                        }
                    });
                    
                    // Make icon bigger
                    const icon = div.querySelector('[style*="width: 2.5rem"]');
                    if (icon) {
                        icon.style.width = '3.5rem';
                        icon.style.height = '3.5rem';
                    }
                    
                    // Make title bigger
                    const h3 = div.querySelector('h3');
                    if (h3) {
                        h3.style.fontSize = '2rem';
                        h3.style.fontWeight = '700';
                    }
                    
                    // Make description bigger
                    const p = div.querySelector('p');
                    if (p) {
                        p.style.fontSize = '1.125rem';
                        p.style.lineHeight = '1.75';
                    }
                }
            });
            
            // Initially hide all steps
            step.style.display = 'none';
        });
        
        // Show only the first step
        let currentStep = 0;
        allSteps[0].style.display = 'grid';
        
        // Hide existing navigation
        const existingButtons = processSection.querySelectorAll('button');
        existingButtons.forEach(btn => {
            if (btn.textContent.includes('Previous') || 
                btn.textContent.includes('Next') || 
                btn.textContent.includes('Start Your Journey')) {
                btn.parentElement.style.display = 'none';
            }
        });
        
        // Create simple navigation
        const nav = document.createElement('div');
        nav.style.cssText = 'display: flex; justify-content: center; gap: 20px; margin-top: 40px;';
        
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '← Previous';
        prevBtn.style.cssText = 'padding: 10px 20px; background: #a855f7; color: white; border: none; border-radius: 8px; cursor: pointer; opacity: 0.5;';
        prevBtn.disabled = true;
        
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = 'Next →';
        nextBtn.style.cssText = 'padding: 10px 20px; background: #a855f7; color: white; border: none; border-radius: 8px; cursor: pointer;';
        
        nav.appendChild(prevBtn);
        nav.appendChild(nextBtn);
        stepsContainer.parentElement.appendChild(nav);
        
        // Navigation functions
        function updateView() {
            // Hide all steps
            allSteps.forEach((step, i) => {
                step.style.display = (i === currentStep) ? 'grid' : 'none';
            });
            
            // Update buttons
            prevBtn.disabled = currentStep === 0;
            prevBtn.style.opacity = currentStep === 0 ? '0.5' : '1';
            nextBtn.disabled = currentStep === allSteps.length - 1;
            nextBtn.style.opacity = currentStep === allSteps.length - 1 ? '0.5' : '1';
        }
        
        prevBtn.onclick = () => {
            if (currentStep > 0) {
                currentStep--;
                updateView();
            }
        };
        
        nextBtn.onclick = () => {
            if (currentStep < allSteps.length - 1) {
                currentStep++;
                updateView();
            }
        };
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && currentStep > 0) {
                currentStep--;
                updateView();
            } else if (e.key === 'ArrowRight' && currentStep < allSteps.length - 1) {
                currentStep++;
                updateView();
            }
        });
        
        console.log('Navigation ready!');
    }
    
    // Start
    setTimeout(init, 100);
})();