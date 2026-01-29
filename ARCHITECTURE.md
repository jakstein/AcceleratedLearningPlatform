# Accelerated Learning Platform - Architecture Documentation

This document describes the architecture, patterns, and development guidelines for the Learning Platform template.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [File Structure](#file-structure)
3. [Categories (Navigation Sections)](#categories-navigation-sections)
4. [Creating New Modules](#creating-new-modules)
5. [Module Registration & Display](#module-registration--display)
6. [Interactive Elements & Canvas Visualizations](#interactive-elements--canvas-visualizations)
7. [Available Utility Functions](#available-utility-functions)
8. [HTML Content Patterns](#html-content-patterns)
9. [AI Chat Helper](#ai-chat-helper)
10. [Styling Reference](#styling-reference)
11. [Best Practices](#best-practices)

---

## Project Overview

The platform is a single-page application (SPA) for learning any subject. It features:

- **Modular content system**: Each topic is a self-contained JavaScript module
- **Interactive visualizations**: Canvas-based diagrams and simulations
- **AI Chat Helper**: Integrated LLM assistant (connects to LM Studio)
- **KaTeX math rendering**: LaTeX-style mathematical equations
- **Navigation sidebar**: Organized by topic categories

### Technology Stack

- **Pure JavaScript** (no frameworks)
- **HTML5 Canvas** for visualizations
- **KaTeX** for math rendering
- **CSS3** with custom properties (variables)
- **LM Studio API** for AI chat (OpenAI-compatible endpoint)

---

## File Structure

```
├── index.html                    # Main HTML entry point
├── TOPICS_CURRICULUM.md          # Curriculum tracking document
├── ARCHITECTURE.md               # This file
├── SETUP_GUIDE.md                # Setup instructions for customization
├── css/
│   ├── styles.css                # Global styles, layout, navigation
│   └── modules.css               # Module-specific component styles
└── js/
    ├── app.js                    # Main application controller
    ├── module-registry.js        # Module registration system (loads FIRST)
    ├── chat-helper.js            # AI chat integration
    ├── modules/
    │   ├── module-01-introduction.js
    │   ├── module-02-example-topic.js
    │   └── module-99-interview-questions.js
    └── utils/
        ├── math-utils.js         # Math functions
        ├── canvas-utils.js       # Drawing utilities
        └── animation-utils.js    # Animation system
```

### Load Order (Critical!)

Scripts must be loaded in this order in `index.html`:

```html
<!-- 1. Utility scripts first -->
<script src="js/utils/math-utils.js"></script>
<script src="js/utils/canvas-utils.js"></script>
<script src="js/utils/animation-utils.js"></script>

<!-- 2. Module registry (creates window.LearningModules array) -->
<script src="js/module-registry.js"></script>

<!-- 3. All module files (each calls registerModule()) -->
<script src="js/modules/module-01-introduction.js"></script>
<script src="js/modules/module-02-example-topic.js"></script>
<!-- ... more modules ... -->

<!-- 4. Chat helper and main app (LAST) -->
<script src="js/chat-helper.js"></script>
<script src="js/app.js"></script>
```

---

## Categories (Navigation Sections)

Navigation is organized into categories defined in the HTML sidebar and referenced by modules.

### Default Categories

| Category ID     | Display Name | Purpose                            |
|-----------------|--------------|-------------------------------------|
| `fundamentals`  | Fundamentals | Introductory topics                 |
| `core`          | Core Topics  | Main subject content                |
| `advanced`      | Advanced     | Complex topics, interview prep      |

### Category HTML Structure (in index.html)

```html
<nav id="sidebar">
    <div class="nav-section">
        <h3>Fundamentals</h3>
        <ul id="nav-fundamentals"></ul>  <!-- Modules populate this -->
    </div>
    <div class="nav-section">
        <h3>Core Topics</h3>
        <ul id="nav-core"></ul>
    </div>
    <div class="nav-section">
        <h3>Advanced</h3>
        <ul id="nav-advanced"></ul>
    </div>
</nav>
```

### How Modules Select Their Category

Each module specifies its category via the `section` property:

```javascript
registerModule({
    number: 2,
    title: 'Interactive Topic Example',
    section: 'core',  // <-- This determines navigation placement
    // ...
});
```

### Adding a New Category

1. Add the HTML structure in `index.html`:
   ```html
   <div class="nav-section">
       <h3>New Category</h3>
       <ul id="nav-newcategory"></ul>
   </div>
   ```

2. Update `App.navStructure` and `navMappings` in `app.js`:
   ```javascript
   navStructure: {
       'fundamentals': [],
       'core': [],
       'advanced': [],
       'newcategory': []  // Add here
   },
   
   // In buildNavigation():
   const navMappings = {
       'fundamentals': document.getElementById('nav-fundamentals'),
       'core': document.getElementById('nav-core'),
       'advanced': document.getElementById('nav-advanced'),
       'newcategory': document.getElementById('nav-newcategory')  // Add here
   };
   ```

---

## Creating New Modules

### Step-by-Step Process

1. **Create the file**: `js/modules/module-XX-topic-name.js`
2. **Add script tag** to `index.html` (before `chat-helper.js`)
3. **Register the module** using `registerModule()`
4. **Update TOPICS_CURRICULUM.md** to track progress

### Module Template

```javascript
// ===========================================
// Module XX: Topic Name
// ===========================================

registerModule({
    // REQUIRED: Unique module number (determines sort order)
    number: 3,
    
    // REQUIRED: Full title displayed in header
    title: 'Full Topic Title',
    
    // OPTIONAL: Short title for navigation (if full title is too long)
    shortTitle: 'Short Title',
    
    // REQUIRED: Category for navigation placement
    section: 'core',
    
    // REQUIRED: HTML content string (use template literals for multi-line)
    content: `
        <section class="module-section">
            <h2>Section Heading</h2>
            <p>Content goes here...</p>
        </section>
        
        <section class="module-section">
            <h2>Another Section</h2>
            <!-- Interactive elements, formulas, etc. -->
        </section>
    `,
    
    // OPTIONAL: Initialization function (runs after content is loaded)
    init: function() {
        // Setup code for interactive elements
    }
});
```

### Example: Module with Canvas Interactive

```javascript
registerModule({
    number: 3,
    title: 'Interactive Example',
    section: 'core',
    
    content: `
        <section class="module-section">
            <h2>Interactive Demo</h2>
            
            <div class="canvas-container">
                <canvas id="example-canvas" width="700" height="400"></canvas>
                
                <div class="canvas-controls">
                    <div class="control-group">
                        <label>Parameter: <span id="param-value">50</span></label>
                        <input type="range" id="param-slider" min="0" max="100" value="50">
                    </div>
                    <button class="control-btn" id="action-btn">Do Something</button>
                </div>
            </div>
        </section>
    `,
    
    init: function() {
        const canvas = document.getElementById('example-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        let paramValue = 50;
        
        function render() {
            CanvasUtils.clear(ctx, canvas, '#f8fafc');
            CanvasUtils.drawGrid(ctx, canvas, 50);
            // Draw your visualization...
        }
        
        document.getElementById('param-slider').addEventListener('input', (e) => {
            paramValue = parseInt(e.target.value);
            document.getElementById('param-value').textContent = paramValue;
            render();
        });
        
        render();  // Initial render
    }
});
```

---

## Module Registration & Display

### Registration System

The module registry (`js/module-registry.js`) creates a global array and registration function:

```javascript
window.LearningModules = [];

window.registerModule = function(module) {
    window.LearningModules.push(module);
};
```

### How Modules Appear

1. **Script loads** → `registerModule()` adds module to `window.LearningModules`
2. **App initializes** → `App.registerModules()` copies the array to `App.modules`
3. **Navigation builds** → `App.buildNavigation()` creates nav links based on `section`
4. **Module loads** → `App.loadModule(index)` injects HTML content and calls `init()`

### Module Properties Reference

| Property     | Required | Type     | Description                                     |
|--------------|----------|----------|-------------------------------------------------|
| `number`     | Yes      | Number   | Unique ID, determines display order             |
| `title`      | Yes      | String   | Full title shown in header                      |
| `shortTitle` | No       | String   | Shorter title for nav (default: title)          |
| `section`    | Yes      | String   | Navigation category ID                          |
| `content`    | Yes      | String   | HTML content (template literal recommended)     |
| `init`       | No       | Function | Called after content loads, for interactivity   |

---

## Interactive Elements & Canvas Visualizations

### Canvas Setup Pattern

```javascript
init: function() {
    const canvas = document.getElementById('my-canvas');
    if (!canvas) return;  // Guard clause
    const ctx = canvas.getContext('2d');
    
    // State variables
    let value = 50;
    
    // Rendering function
    function render() {
        CanvasUtils.clear(ctx, canvas, '#f8fafc');
        CanvasUtils.drawGrid(ctx, canvas, 50, '#e2e8f0');
        // Draw your content...
    }
    
    // Event listeners
    document.getElementById('slider').addEventListener('input', (e) => {
        value = parseFloat(e.target.value);
        render();
    });
    
    render();  // Initial render
}
```

### Continuous Animation Pattern

```javascript
init: function() {
    const canvas = document.getElementById('anim-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let time = 0;
    
    function update(deltaTime) {
        time += deltaTime;
    }
    
    function render() {
        CanvasUtils.clear(ctx, canvas, '#f8fafc');
        // Draw frame
    }
    
    AnimationUtils.startAnimation('my-animation', update, render);
}
```

---

## Available Utility Functions

### MathUtils (js/utils/math-utils.js)

```javascript
// Angle Conversion
MathUtils.degToRad(degrees)
MathUtils.radToDeg(radians)
MathUtils.formatAngle(radians)  // Returns "45.0°"

// General Math
MathUtils.clamp(value, min, max)
MathUtils.round(value, decimals)
MathUtils.lerp(a, b, t)
MathUtils.smoothStep(t)
MathUtils.map(value, inMin, inMax, outMin, outMax)

// Vector Operations
MathUtils.vectorAdd(v1, v2)
MathUtils.vectorSubtract(v1, v2)
MathUtils.vectorScale(v, scalar)
MathUtils.vectorMagnitude(v)
MathUtils.vectorNormalize(v)
MathUtils.vectorDot(v1, v2)
MathUtils.distance(p1, p2)

// Matrix Operations
MathUtils.det2x2(a, b, c, d)
MathUtils.multiplyMatrices(A, B)
```

### CanvasUtils (js/utils/canvas-utils.js)

```javascript
// Basic Drawing
CanvasUtils.clear(ctx, canvas, bgColor)
CanvasUtils.drawGrid(ctx, canvas, spacing, color)
CanvasUtils.drawAxes(ctx, origin, length, labels)
CanvasUtils.drawArrow(ctx, x1, y1, x2, y2, color, headSize)
CanvasUtils.drawCircle(ctx, x, y, radius, fillColor, strokeColor)
CanvasUtils.drawLine(ctx, x1, y1, x2, y2, color, lineWidth)
CanvasUtils.drawLabel(ctx, text, x, y, options)

// Color Helpers
CanvasUtils.lightenColor(hex, percent)
CanvasUtils.darkenColor(hex, percent)
CanvasUtils.createLinearGradient(ctx, x1, y1, x2, y2, colorStops)
```

### AnimationUtils (js/utils/animation-utils.js)

```javascript
// Animation Control
AnimationUtils.startAnimation(id, updateFn, renderFn)
AnimationUtils.stopAnimation(id)
AnimationUtils.stopAll()

// Easing Functions
AnimationUtils.easingFunctions.linear(t)
AnimationUtils.easingFunctions.easeIn(t)
AnimationUtils.easingFunctions.easeOut(t)
AnimationUtils.easingFunctions.easeInOut(t)
AnimationUtils.easingFunctions.elastic(t)
AnimationUtils.easingFunctions.bounce(t)

// Utility Functions
AnimationUtils.tween(from, to, duration, easing, onUpdate)
AnimationUtils.pulse(t, frequency)
AnimationUtils.oscillate(t, min, max, frequency)
AnimationUtils.interpolateArrays(arr1, arr2, t)
AnimationUtils.followPath(path, speed)
```

---

## HTML Content Patterns

### Section Structure

Always wrap content in `<section class="module-section">`:

```html
<section class="module-section">
    <h2>Section Title</h2>
    <p>Paragraph content...</p>
</section>
```

### Info Boxes

```html
<!-- Default (blue/info) -->
<div class="info-box">
    <h4>💡 Title</h4>
    <p>Content...</p>
</div>

<!-- Warning (yellow) -->
<div class="info-box warning">...</div>

<!-- Danger (red) -->
<div class="info-box danger">...</div>

<!-- Success (green) -->
<div class="info-box success">...</div>
```

### Math Formulas (KaTeX)

```html
<!-- Inline math -->
<p>The formula is $y = mx + b$</p>

<!-- Block/display math -->
<div class="formula-box">
    $$f(x) = \\int_a^b g(x) \\, dx$$
</div>
```

**Note:** Use double backslashes (`\\`) in JavaScript template literals.

### Canvas Container with Controls

```html
<div class="canvas-container">
    <canvas id="demo-canvas" width="700" height="400"></canvas>
    
    <div class="canvas-controls">
        <div class="control-group">
            <label>Label: <span id="value-display">50</span></label>
            <input type="range" id="my-slider" min="0" max="100" value="50">
        </div>
        <button class="control-btn" id="action-btn">Action</button>
    </div>
</div>
```

### Comparison Cards

```html
<div class="comparison-grid">
    <div class="comparison-card">
        <div class="card-header">
            <h4>Option A</h4>
        </div>
        <div class="card-body">
            <ul>
                <li>Point 1</li>
                <li>Point 2</li>
            </ul>
        </div>
    </div>
    <div class="comparison-card">
        <div class="card-header" style="background: linear-gradient(135deg, #22c55e, #16a34a);">
            <h4>Option B</h4>
        </div>
        <div class="card-body">
            <ul>
                <li>Point 1</li>
                <li>Point 2</li>
            </ul>
        </div>
    </div>
</div>
```

### Interview Question Cards (Module 99 Pattern)

The interview module uses dynamically rendered cards with reveal buttons for Good Answer, Bad Answer, and Key Takeaways.

**HTML Structure (rendered dynamically):**
```html
<div class="interview-question-card">
    <div class="question-header">
        <span class="question-number">Q1</span>
        <h4 class="question-text">Question text here?</h4>
    </div>
    
    <div class="answer-buttons">
        <button class="reveal-btn good-answer-btn">✓ Show Good Answer</button>
        <button class="reveal-btn bad-answer-btn">✗ Show Bad Answer</button>
        <button class="reveal-btn takeaways-btn">💡 Key Takeaways</button>
    </div>
    
    <div class="answer-panel good-answer" style="display: none;">
        <h5>✓ Good Answer:</h5>
        <div class="answer-content">...</div>
    </div>
    
    <div class="answer-panel bad-answer" style="display: none;">
        <h5>✗ Bad Answer:</h5>
        <div class="answer-content">...</div>
    </div>
    
    <div class="answer-panel takeaways" style="display: none;">
        <div class="takeaways-grid">
            <div class="mention-section">
                <h5>✓ What to Mention:</h5>
                <ul>...</ul>
            </div>
            <div class="avoid-section">
                <h5>✗ What to Avoid:</h5>
                <ul>...</ul>
            </div>
        </div>
    </div>
</div>
```

**Data Structure (in module JS):**
```javascript
questions: {
    category_name: [
        {
            num: 1,
            question: "Question text?",
            goodAnswer: "<p>HTML content...</p>",
            badAnswer: "<p>HTML content...</p>",
            toMention: ["Point 1", "Point 2"],
            toAvoid: ["Mistake 1", "Mistake 2"]
        }
    ]
}

---

## AI Chat Helper

### Overview

The chat helper (`js/chat-helper.js`) provides an AI assistant that:

- Answers questions about the current module
- Explains highlighted text from module content
- Supports streaming responses
- Persists chat history in localStorage

### Configuration

```javascript
// CUSTOMIZE: Update in chat-helper.js
ChatHelper.config = {
    apiUrl: 'http://127.0.0.1:1234',  // LM Studio endpoint
    model: 'your-model-name',
    maxTokens: 8096,
    temperature: 0.7
};
```

### System Prompt Customization

Update the `systemPrompt` in `chat-helper.js` to match your subject:

```javascript
systemPrompt: `You are an expert AI tutor for [Your Subject]...`
```

### User Keyboard Shortcuts

- `Ctrl + /` - Toggle chat panel
- `Enter` - Send message
- `Shift + Enter` - New line in input

---

## Styling Reference

### CSS Variables (defined in styles.css)

```css
:root {
    --primary: #2563eb;       /* Blue - CUSTOMIZE */
    --primary-dark: #1d4ed8;
    --primary-light: #3b82f6;
    --secondary: #10b981;     /* Green */
    --accent: #f59e0b;        /* Amber */
    --danger: #ef4444;        /* Red */
    --dark: #1e293b;          /* Dark slate */
    --gray: #64748b;
    --gray-light: #e2e8f0;
}
```

### Common CSS Classes

| Class                      | Purpose                                        |
|----------------------------|------------------------------------------------|
| `.module-section`          | Section wrapper with proper margins            |
| `.info-box`                | Styled callout box                             |
| `.formula-box`             | Math formula display block                     |
| `.comparison-grid`         | Two-column comparison layout                   |
| `.comparison-card`         | Card within comparison grid                    |
| `.canvas-container`        | Wrapper for canvas + controls                  |
| `.canvas-controls`         | Control panel styling                          |
| `.control-group`           | Group label + input together                   |
| `.control-btn`             | Styled button                                  |
| `.interview-question-card` | Interview Q&A card with reveal buttons         |
| `.reveal-btn`              | Button to show/hide answer panels              |
| `.answer-panel`            | Hidden panel for good/bad answer content       |
| `.takeaways-grid`          | Two-column grid for mention/avoid lists        |

---

## Best Practices

### Module Development

1. **Always use guard clauses** for DOM elements:
   ```javascript
   const canvas = document.getElementById('my-canvas');
   if (!canvas) return;
   ```

2. **Use descriptive IDs** prefixed with module context

3. **Keep state local** - Define variables inside `init()`, not at module scope

4. **Provide meaningful defaults** - Show interesting results at default values

### Content Writing

1. **Start with the "why"** - Explain practical relevance before theory
2. **Use progressive disclosure** - Simple → detailed → advanced
3. **Add interactive elements** - Every module should have something manipulable
4. **Use info boxes for key points** - Summarize takeaways clearly

### Canvas Visualizations

1. **Consistent color scheme** using CSS variables
2. **Always include a grid** for spatial reference
3. **Provide reset button** for complex demos
4. **Display numerical values** alongside visualizations

### After Creating a Module

1. Update `TOPICS_CURRICULUM.md` status
2. Add script tag to `index.html`
3. Test navigation placement
4. Verify KaTeX renders (escape backslashes!)
5. Test all interactive elements

---

## Example Modules

For implementation examples, see:

- **module-01-introduction.js** - Basic content patterns, formatting examples
- **module-02-example-topic.js** - Canvas interactive, sliders, animation
- **module-99-interview-questions.js** - Q&A reveal pattern

---

*Template Version 1.0*
