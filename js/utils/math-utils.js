// ===========================================
// Math Utilities
// ===========================================
// Generic math functions for visualizations.
// CUSTOMIZE: Add subject-specific calculations as needed.
// ===========================================

const MathUtils = {
    // --- GENERIC FUNCTIONS (Keep these) ---
    
    // Degree to Radian conversion
    degToRad: (deg) => deg * Math.PI / 180,
    
    // Radian to Degree conversion
    radToDeg: (rad) => rad * 180 / Math.PI,
    
    // Clamp value between min and max
    clamp: (value, min, max) => Math.min(Math.max(value, min), max),
    
    // Round to specified decimal places
    round: (value, decimals = 2) => {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    },
    
    // Linear interpolation
    lerp: (a, b, t) => a + (b - a) * t,
    
    // Smooth step for animations (ease in-out)
    smoothStep: (t) => t * t * (3 - 2 * t),
    
    // Map value from one range to another
    map: (value, inMin, inMax, outMin, outMax) => {
        return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
    },
    
    // Format number for display
    formatNumber: (num, decimals = 2) => {
        return num.toFixed(decimals);
    },
    
    // Format angle for display (in degrees)
    formatAngle: (rad) => {
        return MathUtils.formatNumber(MathUtils.radToDeg(rad), 1) + '°';
    },
    
    // --- VECTOR OPERATIONS (Generic, commonly needed) ---
    
    vectorAdd: (v1, v2) => v1.map((val, i) => val + v2[i]),
    vectorSubtract: (v1, v2) => v1.map((val, i) => val - v2[i]),
    vectorScale: (v, scalar) => v.map(val => val * scalar),
    vectorMagnitude: (v) => Math.sqrt(v.reduce((sum, val) => sum + val * val, 0)),
    vectorNormalize: (v) => {
        const mag = MathUtils.vectorMagnitude(v);
        return mag > 0 ? v.map(val => val / mag) : v;
    },
    vectorDot: (v1, v2) => v1.reduce((sum, val, i) => sum + val * v2[i], 0),
    
    // Distance between two 2D points
    distance: (p1, p2) => Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2),
    
    // --- MATRIX OPERATIONS (Generic) ---
    
    // 2x2 determinant
    det2x2: (a, b, c, d) => a * d - b * c,
    
    // Multiply two matrices (any size)
    multiplyMatrices: (A, B) => {
        const rowsA = A.length;
        const colsA = A[0].length;
        const colsB = B[0].length;
        const result = [];
        
        for (let i = 0; i < rowsA; i++) {
            result[i] = [];
            for (let j = 0; j < colsB; j++) {
                result[i][j] = 0;
                for (let k = 0; k < colsA; k++) {
                    result[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        return result;
    },
    
    // --- EXAMPLE: SUBJECT-SPECIFIC FUNCTIONS ---
    // CUSTOMIZE: Replace these with your subject's calculations
    
    /*
    // Example: Physics - projectile motion
    projectilePosition: (v0, angle, t, g = 9.81) => {
        const vx = v0 * Math.cos(angle);
        const vy = v0 * Math.sin(angle);
        return {
            x: vx * t,
            y: vy * t - 0.5 * g * t * t
        };
    },
    
    // Example: Finance - compound interest
    compoundInterest: (principal, rate, time, n = 12) => {
        return principal * Math.pow(1 + rate / n, n * time);
    },
    
    // Example: Statistics - normal distribution PDF
    normalPDF: (x, mean = 0, stdDev = 1) => {
        const exp = -0.5 * Math.pow((x - mean) / stdDev, 2);
        return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exp);
    }
    */
};

// Make available globally
window.MathUtils = MathUtils;
