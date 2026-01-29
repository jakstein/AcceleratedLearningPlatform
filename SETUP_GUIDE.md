# Accelerated Learning Platform - Setup Guide

This guide walks you through customizing the learning platform template for your subject. Realistically you can feed this to Claude Opus alongside with the curriculum document and have it properly set up.

---

## Quick Start

1. **Copy the template** - This `generic` folder is your starting point
2. **Update branding** - Change titles, colors, and names
3. **Create modules** - Add your subject content
4. **Configure AI helper** - Update the system prompt
5. **Launch** - Open `index.html` in a browser

---

## Step-by-Step Customization

### 1. Update Branding (index.html)

Open `index.html` and update these sections:

```html
<!-- Page title -->
<title>Your Subject Learning Platform</title>

<!-- Sidebar header -->
<div class="sidebar-header">
    <h2>Your Subject</h2>
    <p>Learning Platform</p>
</div>

<!-- Navigation sections (optional - add/remove categories) -->
<div class="nav-section">
    <h3>Your Category Name</h3>
    <ul id="nav-yourcategory"></ul>
</div>
```

### 2. Update Colors (css/styles.css)

At the top of `styles.css`, update the CSS variables:

```css
:root {
    /* Primary brand color - main buttons, links, accents */
    --primary: #2563eb;        /* Change to your brand color */
    --primary-dark: #1d4ed8;   /* Darker shade for hover states */
    --primary-light: #3b82f6;  /* Lighter shade */
    
    /* Secondary colors (optional to change) */
    --secondary: #10b981;      /* Green - for success states */
    --accent: #f59e0b;         /* Amber - for warnings/highlights */
    --danger: #ef4444;         /* Red - for errors/danger */
}
```

**Color picker tools:**
- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
- [Coolors](https://coolors.co/)

### 3. Update Navigation Categories (js/app.js)

If you add/change navigation sections in `index.html`, update `app.js`:

```javascript
// Near the top of the App object
navStructure: {
    'fundamentals': [],
    'core': [],
    'advanced': [],
    'yourcategory': []  // Add new categories here
},

// In the buildNavigation function
const navMappings = {
    'fundamentals': document.getElementById('nav-fundamentals'),
    'core': document.getElementById('nav-core'),
    'advanced': document.getElementById('nav-advanced'),
    'yourcategory': document.getElementById('nav-yourcategory')  // Match here
};
```

### 4. Configure AI Chat Helper (js/chat-helper.js)

Update the system prompt to match your subject:

```javascript
systemPrompt: `You are an expert AI tutor for [YOUR SUBJECT HERE].

Your role:
- Explain [your subject] concepts in clear, practical terms
- Use relevant examples from [your industry/field]
- Break down complex topics step by step
- Connect theory to real-world applications

When the user highlights text from the module, explain that specific concept in detail.`,
```

Also update the model configuration if needed:

```javascript
config: {
    apiUrl: 'http://127.0.0.1:1234',  // LM Studio default
    model: 'your-preferred-model',     // Model name in LM Studio
    maxTokens: 8096,
    temperature: 0.7
}, // Other params, consult the LM Studio docs
```

### 5. Create Your First Module

Create a new file `js/modules/module-03-your-topic.js`:

```javascript
// ===========================================
// Module 03: Your Topic Name
// ===========================================

registerModule({
    number: 3,
    title: 'Your Topic Title',
    shortTitle: 'Topic',  // Optional: shown in nav if title is long
    section: 'core',      // Must match a category in app.js
    
    content: `
        <section class="module-section">
            <h2>Introduction</h2>
            <p>Your content here...</p>
            
            <div class="info-box">
                <h4>💡 Key Point</h4>
                <p>Important information to highlight.</p>
            </div>
        </section>
        
        <section class="module-section">
            <h2>Details</h2>
            <p>More content...</p>
        </section>
    `,
    
    init: function() {
        // Optional: Add interactivity here
    }
});
```

Then add it to `index.html`:

```html
<!-- Add BEFORE chat-helper.js -->
<script src="js/modules/module-03-your-topic.js"></script>
```

### 6. Delete Example Modules (Optional)

Once you understand the patterns, you can:
1. Delete `module-01-introduction.js`, `module-02-example-topic.js`, `module-99-interview-questions.js`
2. Remove their `<script>` tags from `index.html`
3. Create your own modules following the templates

---

## Running the Platform

### Option 1: Simple File Open
Just double-click `index.html` to open in your default browser.

**Note:** The AI chat feature requires LM Studio running locally.

### Option 2: Local Server (Recommended)
Using a local server avoids some browser restrictions:

```bash
# Python 3
python -m http.server 8000

# Node.js (if http-server is installed)
npx http-server

# Then open http://localhost:8000/index.html
```

### Option 3: VS Code Live Server
1. Install the "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

---

## Setting Up AI Chat (LM Studio)

The platform uses LM Studio for AI chat functionality.

### Install LM Studio
1. Download from [lmstudio.ai](https://lmstudio.ai/)
2. Install and launch

### Load a Model
1. In LM Studio, search for a model (if you are VRAM constrained: `gemma-2b`, `phi-2`, `mistral-7b`). I personally used `GLM 4.7 Flash` (30B-A3B MoE) since it fits on RTX 5090 at a good quant, and is rather capable.
2. Download and load the model
3. Ensure CORS is enabled in LM Studio settings. Authentication not supported.
4. Start the local server (it runs on `http://127.0.0.1:1234`) (or whatever port you set)

### Update Configuration (if needed)
In `js/chat-helper.js`:
```javascript
config: {
    apiUrl: 'http://127.0.0.1:1234',
    model: 'your-model-name',  // Match the loaded model
    // ...
}
```

---

## Adding Interactive Visualizations

### Basic Canvas Setup

```javascript
init: function() {
    const canvas = document.getElementById('my-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function render() {
        // Clear
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw
        CanvasUtils.drawGrid(ctx, canvas, 50);
        CanvasUtils.drawCircle(ctx, 200, 200, 50, '#3b82f6');
    }
    
    render();
}
```

### Adding Slider Controls

In your module content:
```html
<div class="canvas-container">
    <canvas id="my-canvas" width="700" height="400"></canvas>
    <div class="canvas-controls">
        <div class="control-group">
            <label>Size: <span id="size-value">50</span></label>
            <input type="range" id="size-slider" min="10" max="100" value="50">
        </div>
    </div>
</div>
```

In your init function:
```javascript
let size = 50;

document.getElementById('size-slider').addEventListener('input', (e) => {
    size = parseInt(e.target.value);
    document.getElementById('size-value').textContent = size;
    render();
});
```

---

## Math Formulas

Use KaTeX syntax in your content. **Important:** Use double backslashes in JavaScript strings.

```javascript
content: `
    <p>Inline formula: $E = mc^2$</p>
    
    <div class="formula-box">
        $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$
    </div>
`
```

---

## Common Patterns

### Info Boxes
```html
<div class="info-box">Default blue</div>
<div class="info-box success">Green for tips</div>
<div class="info-box warning">Yellow for cautions</div>
<div class="info-box danger">Red for warnings</div>
```

### Comparison Cards
```html
<div class="comparison-grid">
    <div class="comparison-card">
        <div class="card-header"><h4>Option A</h4></div>
        <div class="card-body"><ul><li>Point 1</li></ul></div>
    </div>
    <div class="comparison-card">
        <div class="card-header"><h4>Option B</h4></div>
        <div class="card-body"><ul><li>Point 1</li></ul></div>
    </div>
</div>
```

### Data Tables
```html
<table class="data-table">
    <thead>
        <tr><th>Header 1</th><th>Header 2</th></tr>
    </thead>
    <tbody>
        <tr><td>Data 1</td><td>Data 2</td></tr>
    </tbody>
</table>
```

### Interview Questions (Module 99 Pattern)

The interview module uses a special format with reveal buttons for Good Answer, Bad Answer, and Key Takeaways. Questions are stored in a `questions` object and rendered dynamically. If you don't care about interview-tailored content, you can skip this part. In fact you can just delete `module-99-interview-questions.js` entirely. I do think that it's still useful even if not applying for interview, as it's a good way to just test own knowledge.

**Question data structure:**
```javascript
questions: {
    category_name: [
        {
            num: 1,                              // Question number
            question: "Your question here?",     // The interview question
            goodAnswer: `<p>HTML content showing ideal answer...</p>`,
            badAnswer: `<p>HTML showing what NOT to say...</p>`,
            toMention: [                         // Key points to include
                "Important point 1",
                "Important point 2"
            ],
            toAvoid: [                           // Common mistakes
                "Mistake to avoid",
                "Another pitfall"
            ]
        }
    ]
}
```

**Adding a new category:**
1. Add a section container in the module's `content`:
   ```html
   <section class="module-section">
       <h2>Part N: Category Name</h2>
       <div class="interview-questions-container" id="categoryname-questions"></div>
   </section>
   ```
2. Add the questions array in the `questions` object:
   ```javascript
   questions: {
       categoryname: [ /* your questions */ ]
   }
   ```

The module's `renderAllQuestions()` and `setupRevealButtons()` methods handle the rendering and interactivity automatically.

---

## Troubleshooting

### Modules not appearing in navigation
- Check the `section` property matches a category in `app.js`
- Verify the script tag is in `index.html` before `chat-helper.js`
- Check browser console for JavaScript errors

### Math formulas not rendering
- Make sure KaTeX CDN links are in `index.html`
- Use double backslashes (`\\`) in JavaScript strings
- Check for LaTeX syntax errors

### AI chat not working
- Ensure LM Studio is running with a model loaded
- Check that the server is on `http://127.0.0.1:1234`
- Look for CORS errors in browser console

### Canvas not displaying
- Verify the canvas ID matches in HTML and JavaScript
- Make sure `init()` function exists and is called
- Check browser console for errors

---

## File Reference

| File | Purpose | Customize? |
|------|---------|------------|
| `index.html` | Main entry, scripts, navigation | ✅ Yes - branding, modules |
| `css/styles.css` | Global styles, colors | ✅ Yes - colors |
| `css/modules.css` | Component styles | ⚪ Optional |
| `js/app.js` | App controller | ✅ Yes - categories |
| `js/module-registry.js` | Module system | ❌ No |
| `js/chat-helper.js` | AI chat | ✅ Yes - system prompt |
| `js/utils/*.js` | Utility functions | ⚪ Optional - add your own |
| `js/modules/*.js` | Your content | ✅ Yes - add your modules |

---

## Next Steps

1. ✅ Update branding in `index.html`
2. ✅ Change colors in `styles.css`
3. ✅ Configure AI prompt in `chat-helper.js`
4. ✅ Create your first module
5. ✅ Plan your curriculum in `TOPICS_CURRICULUM.md`
6. ✅ Build out your learning content!

For detailed technical reference, see `ARCHITECTURE.md`.

---
