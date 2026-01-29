// ===========================================
// Canvas Drawing Utilities
// ===========================================
// Generic canvas helpers for visualizations.
// CUSTOMIZE: Add subject-specific drawing functions as needed.
// ===========================================

const CanvasUtils = {
    // --- GENERIC CANVAS FUNCTIONS (Keep these) ---
    
    // Create a canvas element
    createCanvas: (width, height, id) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.id = id || '';
        return canvas;
    },
    
    // Clear canvas with optional background color
    clear: (ctx, canvas, bgColor = null) => {
        if (bgColor) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    },
    
    // Draw grid
    drawGrid: (ctx, canvas, spacing = 50, color = '#e2e8f0') => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        
        for (let x = 0; x <= canvas.width; x += spacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        for (let y = 0; y <= canvas.height; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    },
    
    // Draw coordinate axes
    drawAxes: (ctx, origin, length = 50, labels = true) => {
        const { x: ox, y: oy } = origin;
        
        // X axis (horizontal - right)
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + length, oy);
        ctx.stroke();
        
        // Y axis (vertical - up in screen coords is down)
        ctx.strokeStyle = '#22c55e';
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox, oy - length);
        ctx.stroke();
        
        if (labels) {
            ctx.font = 'bold 14px sans-serif';
            ctx.fillStyle = '#ef4444';
            ctx.fillText('X', ox + length + 5, oy + 5);
            ctx.fillStyle = '#22c55e';
            ctx.fillText('Y', ox - 5, oy - length - 5);
        }
    },
    
    // Draw arrow from point to point
    drawArrow: (ctx, fromX, fromY, toX, toY, color = '#000', headSize = 10) => {
        const angle = Math.atan2(toY - fromY, toX - fromX);
        
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2;
        
        // Line
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
            toX - headSize * Math.cos(angle - Math.PI / 6),
            toY - headSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            toX - headSize * Math.cos(angle + Math.PI / 6),
            toY - headSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
    },
    
    // Draw a circle
    drawCircle: (ctx, x, y, radius, fillColor, strokeColor = null, lineWidth = 2) => {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
        if (strokeColor) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        }
    },
    
    // Draw a line
    drawLine: (ctx, x1, y1, x2, y2, color = '#000', lineWidth = 2) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    },
    
    // Draw text with optional background
    drawLabel: (ctx, text, x, y, options = {}) => {
        const {
            font = '12px sans-serif',
            textColor = '#fff',
            bgColor = '#1e293b',
            padding = 4
        } = options;
        
        ctx.font = font;
        const metrics = ctx.measureText(text);
        
        if (bgColor) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(
                x - padding,
                y - 12 - padding,
                metrics.width + padding * 2,
                16 + padding * 2
            );
        }
        
        ctx.fillStyle = textColor;
        ctx.fillText(text, x, y);
    },
    
    // --- COLOR UTILITIES ---
    
    // Lighten a hex color
    lightenColor: (hex, percent) => {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    },
    
    // Darken a hex color
    darkenColor: (hex, percent) => {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    },
    
    // Create gradient
    createLinearGradient: (ctx, x1, y1, x2, y2, colorStops) => {
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        colorStops.forEach(([stop, color]) => gradient.addColorStop(stop, color));
        return gradient;
    },
    
    // --- EXAMPLE: SUBJECT-SPECIFIC DRAWING ---
    // CUSTOMIZE: Add your own visualization helpers
    
    /*
    // Example: Draw a bar chart
    drawBarChart: (ctx, data, x, y, width, height, colors) => {
        const barWidth = width / data.length;
        const maxValue = Math.max(...data);
        
        data.forEach((value, i) => {
            const barHeight = (value / maxValue) * height;
            ctx.fillStyle = colors[i % colors.length];
            ctx.fillRect(
                x + i * barWidth,
                y + height - barHeight,
                barWidth - 2,
                barHeight
            );
        });
    },
    
    // Example: Draw a line graph
    drawLineGraph: (ctx, points, color, lineWidth = 2) => {
        if (points.length < 2) return;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
    }
    */
};

// Make available globally
window.CanvasUtils = CanvasUtils;
