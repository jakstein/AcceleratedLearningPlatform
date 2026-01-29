// ===========================================
// Module 02: Example Topic (Interactive)
// ===========================================
// EXAMPLE MODULE - Shows advanced features:
//   - Interactive canvas visualizations
//   - Slider controls for parameters
//   - Mathematical formulas with KaTeX
//   - Real-time updates
// CUSTOMIZE: Replace with your subject's interactive content
// ===========================================

registerModule({
    number: 2,
    title: 'Interactive Topic Example',
    shortTitle: 'Interactive Demo',
    section: 'core',
    
    content: `
        <!-- ============================================
             INTERACTIVE MODULE EXAMPLE
             Shows canvas + sliders + formulas + controls
             ============================================ -->
        
        <section class="module-section">
            <h2>Interactive Visualization</h2>
            <p>This module demonstrates how to create interactive canvas-based visualizations with real-time controls.</p>
            
            <div class="info-box">
                <h4>🎮 How to Use</h4>
                <p>Adjust the sliders below to see the visualization update in real-time. This pattern can be adapted for any subject that benefits from visual, interactive learning.</p>
            </div>
        </section>
        
        <section class="module-section">
            <h2>Demo: Parameter Visualization</h2>
            
            <!-- CANVAS CONTAINER: Standard structure for interactive demos -->
            <div class="canvas-container">
                <!-- Canvas element - ID used by init() function -->
                <canvas id="demo-canvas" width="700" height="400"></canvas>
                
                <!-- Controls panel alongside canvas -->
                <div class="canvas-controls">
                    <h4>Parameters</h4>
                    
                    <!-- SLIDER CONTROL: Standard pattern -->
                    <div class="control-group">
                        <label>Parameter A: <span id="param-a-value">50</span></label>
                        <input type="range" id="param-a" min="0" max="100" value="50">
                    </div>
                    
                    <div class="control-group">
                        <label>Parameter B: <span id="param-b-value">30</span></label>
                        <input type="range" id="param-b" min="0" max="100" value="30">
                    </div>
                    
                    <div class="control-group">
                        <label>Speed: <span id="speed-value">1.0</span>x</label>
                        <input type="range" id="speed" min="0.1" max="3" step="0.1" value="1">
                    </div>
                    
                    <!-- CHECKBOX CONTROL -->
                    <div class="control-group">
                        <label>
                            <input type="checkbox" id="show-grid" checked>
                            Show Grid
                        </label>
                    </div>
                    
                    <div class="control-group">
                        <label>
                            <input type="checkbox" id="show-labels" checked>
                            Show Labels
                        </label>
                    </div>
                    
                    <!-- BUTTON CONTROLS -->
                    <button id="reset-btn" class="control-btn">Reset</button>
                    <button id="animate-btn" class="control-btn primary">Start Animation</button>
                    
                    <!-- LIVE INFO DISPLAY -->
                    <div class="info-display" style="margin-top: 15px; padding: 10px; background: #1e293b; border-radius: 4px;">
                        <div style="font-size: 0.9em; color: #94a3b8;">Current Values:</div>
                        <div id="live-info" style="font-family: monospace; color: #22d3ee;">
                            X: 0, Y: 0
                        </div>
                    </div>
                </div>
            </div>
            
            <p><em>Example: This could visualize physics simulations, mathematical functions, data relationships, biological processes, etc.</em></p>
        </section>
        
        <section class="module-section">
            <h2>Mathematical Formulas</h2>
            <p>Use KaTeX for rendering mathematical equations. Wrap inline math in single $, block math in $$.</p>
            
            <!-- FORMULA GRID: Good for showing multiple related formulas -->
            <div class="formula-grid">
                <div class="formula-card">
                    <h4>Basic Formula</h4>
                    <p class="formula">$$y = mx + b$$</p>
                    <p>Linear equation example. Replace with your subject's formulas.</p>
                </div>
                
                <div class="formula-card">
                    <h4>More Complex</h4>
                    <p class="formula">$$f(x) = \\int_a^b g(x) \\, dx$$</p>
                    <p>Integration notation. KaTeX supports most LaTeX math.</p>
                </div>
                
                <div class="formula-card">
                    <h4>Multi-variable</h4>
                    <p class="formula">$$\\frac{\\partial f}{\\partial x} = 2x + y$$</p>
                    <p>Partial derivatives and fractions.</p>
                </div>
                
                <div class="formula-card">
                    <h4>Matrix Example</h4>
                    <p class="formula">$$\\mathbf{A} = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$$</p>
                    <p>Matrix notation for linear algebra topics.</p>
                </div>
            </div>
            
            <p>Inline formulas like $E = mc^2$ flow naturally within text.</p>
        </section>
        
        <section class="module-section">
            <h2>Code Examples</h2>
            
            <!-- CODE BLOCK: Use for algorithms, pseudocode, or actual code -->
            <pre><code>// Example algorithm structure
// CUSTOMIZE: Replace with subject-relevant code

function calculateResult(input) {
    // Step 1: Validate input
    if (!isValid(input)) {
        throw new Error("Invalid input");
    }
    
    // Step 2: Process data
    let result = transform(input);
    
    // Step 3: Apply formula
    result = result * CONSTANT_FACTOR;
    
    return result;
}</code></pre>
            
            <div class="info-box success">
                <h4>💡 Implementation Notes</h4>
                <p>Add practical notes about implementation, best practices, or common patterns relevant to your subject here.</p>
            </div>
        </section>
        
        <section class="module-section">
            <h2>Summary</h2>
            
            <div class="info-box">
                <h4>📝 Module Features Demonstrated</h4>
                <ul>
                    <li><strong>Canvas visualization</strong> - Interactive graphics with real-time updates</li>
                    <li><strong>Slider controls</strong> - Adjustable parameters for exploration</li>
                    <li><strong>Checkbox options</strong> - Toggle display features</li>
                    <li><strong>Buttons</strong> - Reset and animation controls</li>
                    <li><strong>KaTeX formulas</strong> - Beautiful mathematical typesetting</li>
                    <li><strong>Code blocks</strong> - Syntax-highlighted code examples</li>
                    <li><strong>Live info display</strong> - Real-time value feedback</li>
                </ul>
            </div>
        </section>
    `,
    
    // ===========================================
    // INITIALIZATION FUNCTION
    // ===========================================
    // Called after content is rendered to DOM
    // Use for setting up interactivity
    
    init: function() {
        // --- GET CANVAS CONTEXT ---
        const canvas = document.getElementById('demo-canvas');
        if (!canvas) return; // Safety check
        
        const ctx = canvas.getContext('2d');
        
        // --- STATE VARIABLES ---
        let paramA = 50;
        let paramB = 30;
        let speed = 1.0;
        let showGrid = true;
        let showLabels = true;
        let isAnimating = false;
        let animationTime = 0;
        let animationId = null;
        
        // --- GET CONTROL ELEMENTS ---
        const paramASlider = document.getElementById('param-a');
        const paramBSlider = document.getElementById('param-b');
        const speedSlider = document.getElementById('speed');
        const showGridCheckbox = document.getElementById('show-grid');
        const showLabelsCheckbox = document.getElementById('show-labels');
        const resetBtn = document.getElementById('reset-btn');
        const animateBtn = document.getElementById('animate-btn');
        const liveInfo = document.getElementById('live-info');
        
        // --- DRAWING FUNCTION ---
        function draw() {
            // Clear canvas
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw grid if enabled
            if (showGrid) {
                ctx.strokeStyle = '#334155';
                ctx.lineWidth = 1;
                
                // Vertical lines
                for (let x = 0; x <= canvas.width; x += 50) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                    ctx.stroke();
                }
                
                // Horizontal lines
                for (let y = 0; y <= canvas.height; y += 50) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y);
                    ctx.stroke();
                }
            }
            
            // Center point
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            // Draw axes
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(canvas.width, centerY);
            ctx.moveTo(centerX, 0);
            ctx.lineTo(centerX, canvas.height);
            ctx.stroke();
            
            // Calculate visualization based on parameters
            const radius = paramA * 1.5;
            const offset = paramB * 0.5;
            const angle = animationTime * speed * 0.05;
            
            // Draw main visualization element
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            // Outer circle (path)
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Moving point
            ctx.fillStyle = '#f472b6';
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, Math.PI * 2);
            ctx.fill();
            
            // Secondary element based on paramB
            ctx.fillStyle = '#4ade80';
            ctx.beginPath();
            ctx.arc(x + offset, y + offset, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw labels if enabled
            if (showLabels) {
                ctx.fillStyle = '#e2e8f0';
                ctx.font = '14px Inter, sans-serif';
                ctx.fillText('Center', centerX + 5, centerY - 10);
                ctx.fillText('A = ' + paramA, 20, 25);
                ctx.fillText('B = ' + paramB, 20, 45);
                
                // Position label
                ctx.fillStyle = '#f472b6';
                ctx.fillText('Point (' + Math.round(x) + ', ' + Math.round(y) + ')', x + 15, y - 15);
            }
            
            // Update live info
            if (liveInfo) {
                liveInfo.textContent = `X: ${Math.round(x - centerX)}, Y: ${Math.round(centerY - y)}, Angle: ${(angle % (Math.PI * 2)).toFixed(2)} rad`;
            }
        }
        
        // --- ANIMATION LOOP ---
        function animate() {
            animationTime++;
            draw();
            if (isAnimating) {
                animationId = requestAnimationFrame(animate);
            }
        }
        
        // --- EVENT LISTENERS ---
        if (paramASlider) {
            paramASlider.addEventListener('input', (e) => {
                paramA = parseInt(e.target.value);
                document.getElementById('param-a-value').textContent = paramA;
                if (!isAnimating) draw();
            });
        }
        
        if (paramBSlider) {
            paramBSlider.addEventListener('input', (e) => {
                paramB = parseInt(e.target.value);
                document.getElementById('param-b-value').textContent = paramB;
                if (!isAnimating) draw();
            });
        }
        
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                speed = parseFloat(e.target.value);
                document.getElementById('speed-value').textContent = speed.toFixed(1);
            });
        }
        
        if (showGridCheckbox) {
            showGridCheckbox.addEventListener('change', (e) => {
                showGrid = e.target.checked;
                if (!isAnimating) draw();
            });
        }
        
        if (showLabelsCheckbox) {
            showLabelsCheckbox.addEventListener('change', (e) => {
                showLabels = e.target.checked;
                if (!isAnimating) draw();
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                // Reset all values
                paramA = 50;
                paramB = 30;
                speed = 1.0;
                animationTime = 0;
                
                // Reset UI
                paramASlider.value = 50;
                paramBSlider.value = 30;
                speedSlider.value = 1;
                document.getElementById('param-a-value').textContent = '50';
                document.getElementById('param-b-value').textContent = '30';
                document.getElementById('speed-value').textContent = '1.0';
                
                if (!isAnimating) draw();
            });
        }
        
        if (animateBtn) {
            animateBtn.addEventListener('click', () => {
                isAnimating = !isAnimating;
                animateBtn.textContent = isAnimating ? 'Stop Animation' : 'Start Animation';
                animateBtn.classList.toggle('primary', !isAnimating);
                
                if (isAnimating) {
                    animate();
                } else if (animationId) {
                    cancelAnimationFrame(animationId);
                }
            });
        }
        
        // --- INITIAL DRAW ---
        draw();
    }
});
