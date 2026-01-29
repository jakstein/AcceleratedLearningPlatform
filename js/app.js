// ===========================================
// Learning Platform - Main Application Controller
// ============================================
// CUSTOMIZE: This file controls navigation and module loading
// Key areas to modify are marked with CUSTOMIZE comments
// ===========================================

const App = {
    // All available modules
    modules: [],
    
    // Current module index
    currentModuleIndex: 0,
    
    // ============================================
    // CUSTOMIZE: Define your navigation structure
    // Map module prefixes to navigation sections
    // ============================================
    navStructure: {
        fundamentals: ['module-01'],
        core: ['module-02'],
        advanced: ['module-99']
    },
    
    // Initialize the application
    init: function() {
        this.registerModules();
        this.buildNavigation();
        this.setupEventListeners();
        this.loadModule(0);
        this.initKaTeX();
    },
    
    // Register all modules
    registerModules: function() {
        // Modules are registered by their individual script files
        // ============================================
        // CUSTOMIZE: Update to match your registry name
        // if you changed it in module-registry.js
        // ============================================
        if (window.LearningModules) {
            this.modules = window.LearningModules;
        }
    },
    
    // Build navigation sidebar
    buildNavigation: function() {
        // ============================================
        // CUSTOMIZE: Map section IDs from index.html
        // to their DOM elements
        // ============================================
        const navMappings = {
            'fundamentals': document.getElementById('nav-fundamentals'),
            'core': document.getElementById('nav-core'),
            'advanced': document.getElementById('nav-advanced')
        };
        
        this.modules.forEach((module, index) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = `${module.number}. ${module.shortTitle || module.title}`;
            a.dataset.moduleIndex = index;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadModule(index);
            });
            li.appendChild(a);
            
            // Add to appropriate section
            const section = module.section || 'fundamentals';
            if (navMappings[section]) {
                navMappings[section].appendChild(li);
            }
        });
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        document.getElementById('prev-btn').addEventListener('click', () => {
            if (this.currentModuleIndex > 0) {
                this.loadModule(this.currentModuleIndex - 1);
            }
        });
        
        document.getElementById('next-btn').addEventListener('click', () => {
            if (this.currentModuleIndex < this.modules.length - 1) {
                this.loadModule(this.currentModuleIndex + 1);
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' && e.altKey) {
                document.getElementById('next-btn').click();
            } else if (e.key === 'ArrowLeft' && e.altKey) {
                document.getElementById('prev-btn').click();
            }
        });
    },
    
    // Load a specific module
    loadModule: function(index) {
        if (index < 0 || index >= this.modules.length) return;
        
        // Stop any running animations
        if (window.AnimationUtils) {
            AnimationUtils.stopAll();
        }
        
        this.currentModuleIndex = index;
        const module = this.modules[index];
        
        // Update header
        document.getElementById('module-title').textContent = module.title;
        
        // Update progress bar
        const progress = ((index + 1) / this.modules.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        
        // Update page indicator
        document.getElementById('page-indicator').textContent = 
            `Module ${index + 1} of ${this.modules.length}`;
        
        // Update navigation buttons
        document.getElementById('prev-btn').disabled = index === 0;
        document.getElementById('next-btn').disabled = index === this.modules.length - 1;
        
        // Update active nav link
        document.querySelectorAll('#sidebar a').forEach(a => {
            a.classList.remove('active');
            if (parseInt(a.dataset.moduleIndex) === index) {
                a.classList.add('active');
            }
        });
        
        // Load module content
        const contentArea = document.getElementById('module-content');
        contentArea.innerHTML = module.content;
        contentArea.classList.add('fade-in');
        
        // Initialize module-specific scripts
        if (module.init) {
            setTimeout(() => module.init(), 100);
        }
        
        // Re-render KaTeX
        this.renderMath();
        
        // Scroll to top
        contentArea.scrollTop = 0;
        
        // Remove animation class after it completes
        setTimeout(() => {
            contentArea.classList.remove('fade-in');
        }, 500);
    },
    
    // Initialize KaTeX
    initKaTeX: function() {
        if (typeof renderMathInElement !== 'undefined') {
            this.renderMath();
        } else {
            // Wait for KaTeX to load
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.renderMath(), 500);
            });
        }
    },
    
    // Render math expressions
    renderMath: function() {
        if (typeof renderMathInElement === 'undefined') return;
        
        renderMathInElement(document.getElementById('module-content'), {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError: false
        });
    },
    
    // Helper to create info boxes
    createInfoBox: function(type, title, content) {
        return `
            <div class="info-box ${type}">
                <h4>${title}</h4>
                <p>${content}</p>
            </div>
        `;
    },
    
    // Helper to create code blocks
    createCodeBlock: function(code, language = 'text') {
        const highlighted = this.highlightCode(code, language);
        return `<div class="code-block">${highlighted}</div>`;
    },
    
    // Simple syntax highlighting
    highlightCode: function(code, language) {
        // Basic highlighting for robot languages
        let result = code
            .replace(/\b(PROC|ENDPROC|IF|THEN|ELSE|ENDIF|WHILE|ENDWHILE|FOR|ENDFOR|RETURN|VAR|CONST|MODULE|ENDMODULE|DEF|END|LOOP|WAIT|SWITCH|CASE|DEFAULT|ENDSWITCH)\b/g, '<span class="keyword">$1</span>')
            .replace(/\b(MoveJ|MoveL|MoveC|MoveAbsJ|WaitDI|SetDO|Set|Reset|WaitTime|TPWrite|PTP|LIN|CIRC|TRIGGER|INTERRUPT)\b/g, '<span class="function">$1</span>')
            .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
            .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
            .replace(/(\/\/.*$|!.*$)/gm, '<span class="comment">$1</span>');
        
        return result;
    },
    
    // Create tabs component
    createTabs: function(tabs) {
        const buttons = tabs.map((tab, i) => 
            `<button class="tab-btn ${i === 0 ? 'active' : ''}" data-tab="${tab.id}">${tab.label}</button>`
        ).join('');
        
        const contents = tabs.map((tab, i) => 
            `<div class="tab-content ${i === 0 ? 'active' : ''}" id="tab-${tab.id}">${tab.content}</div>`
        ).join('');
        
        return `
            <div class="tab-container">
                <div class="tab-buttons">${buttons}</div>
                ${contents}
            </div>
        `;
    },
    
    // Setup tab functionality
    setupTabs: function(container) {
        const buttons = container.querySelectorAll('.tab-btn');
        const contents = container.querySelectorAll('.tab-content');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
            });
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Make App available globally
window.App = App;
