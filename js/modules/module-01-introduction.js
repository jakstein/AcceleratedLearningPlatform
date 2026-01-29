// ===========================================
// Module 01: Introduction
// ===========================================
// EXAMPLE MODULE - Shows basic module structure
// CUSTOMIZE: Replace content with your subject's introduction
// ===========================================

registerModule({
    // REQUIRED: Unique module number (determines sort order)
    number: 1,
    
    // REQUIRED: Full title displayed in header
    title: 'Introduction to [Your Subject]',
    
    // OPTIONAL: Short title for navigation
    shortTitle: 'Introduction',
    
    // REQUIRED: Category for navigation placement
    // Must match a key in App.navStructure (app.js)
    section: 'fundamentals',
    
    // REQUIRED: HTML content (use template literals for multi-line)
    content: `
        <!-- ============================================
             EXAMPLE CONTENT - Replace with your own
             This demonstrates various formatting options
             ============================================ -->
        
        <section class="module-section">
            <h2>What is [Your Subject]?</h2>
            <p>This is an introduction paragraph. Replace with an overview of your subject matter.</p>
            
            <!-- INFO BOX: Use for key definitions or important callouts -->
            <div class="info-box">
                <h4>📋 Key Definition</h4>
                <p>"A formal definition or important concept goes here. This styled box draws attention to critical information."</p>
            </div>
            
            <p>Key characteristics of the subject:</p>
            <ul>
                <li><strong>Characteristic 1</strong> - Brief explanation of this characteristic.</li>
                <li><strong>Characteristic 2</strong> - Another important aspect to understand.</li>
                <li><strong>Characteristic 3</strong> - Continue building foundational knowledge.</li>
            </ul>
        </section>
        
        <section class="module-section">
            <h2>Historical Timeline</h2>
            
            <!-- TIMELINE: Good for showing evolution/history -->
            <div class="timeline">
                <div class="timeline-item">
                    <div class="year">1900</div>
                    <div class="content">
                        <strong>Early Milestone</strong> - Description of what happened.
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="year">1950</div>
                    <div class="content">
                        <strong>Middle Era Development</strong> - Another key event.
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="year">2000s</div>
                    <div class="content">
                        <strong>Modern Era</strong> - Recent developments and current state.
                    </div>
                </div>
            </div>
        </section>
        
        <section class="module-section">
            <h2>Key Statistics</h2>
            
            <!-- STATS GRID: Good for impressive numbers -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">1M+</div>
                    <div class="stat-label">First statistic description</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">~500</div>
                    <div class="stat-label">Second statistic</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">75%</div>
                    <div class="stat-label">Third statistic</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">24/7</div>
                    <div class="stat-label">Fourth statistic</div>
                </div>
            </div>
            
            <p><em>Source: Add your data source here</em></p>
        </section>
        
        <section class="module-section">
            <h2>Main Categories</h2>
            
            <!-- COMPARISON CARDS: Good for showing different types/categories -->
            <div class="comparison-grid">
                <div class="comparison-card">
                    <div class="card-header">
                        <h4>🔧 Category A</h4>
                    </div>
                    <div class="card-body">
                        <ul>
                            <li>Feature or subtopic 1</li>
                            <li>Feature or subtopic 2</li>
                            <li>Feature or subtopic 3</li>
                        </ul>
                    </div>
                </div>
                
                <div class="comparison-card">
                    <div class="card-header" style="background: linear-gradient(135deg, #22c55e, #16a34a);">
                        <h4>⚡ Category B</h4>
                    </div>
                    <div class="card-body">
                        <ul>
                            <li>Feature or subtopic 1</li>
                            <li>Feature or subtopic 2</li>
                            <li>Feature or subtopic 3</li>
                        </ul>
                    </div>
                </div>
                
                <div class="comparison-card">
                    <div class="card-header" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                        <h4>🎨 Category C</h4>
                    </div>
                    <div class="card-body">
                        <ul>
                            <li>Feature or subtopic 1</li>
                            <li>Feature or subtopic 2</li>
                            <li>Feature or subtopic 3</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
        
        <section class="module-section">
            <h2>Core Components</h2>
            
            <!-- DATA TABLE: Good for structured information -->
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Component</th>
                        <th>Function</th>
                        <th>Key Considerations</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Component A</strong></td>
                        <td>What it does</td>
                        <td>Important notes</td>
                    </tr>
                    <tr>
                        <td><strong>Component B</strong></td>
                        <td>What it does</td>
                        <td>Important notes</td>
                    </tr>
                    <tr>
                        <td><strong>Component C</strong></td>
                        <td>What it does</td>
                        <td>Important notes</td>
                    </tr>
                </tbody>
            </table>
        </section>
        
        <section class="module-section">
            <h2>Advanced Concepts</h2>
            
            <!-- SUCCESS INFO BOX: Use for best practices or positive notes -->
            <div class="info-box success">
                <h4>🎯 Key Concepts</h4>
                <ul>
                    <li><strong>Concept 1</strong> - Explanation of this concept.</li>
                    <li><strong>Concept 2</strong> - Another important concept.</li>
                    <li><strong>Concept 3</strong> - Third concept to understand.</li>
                </ul>
            </div>
            
            <!-- WARNING INFO BOX: Use for cautions -->
            <div class="info-box warning">
                <h4>⚠️ Common Pitfalls</h4>
                <p>Describe common mistakes or things to watch out for.</p>
            </div>
        </section>
        
        <section class="module-section">
            <h2>Summary</h2>
            
            <div class="info-box">
                <h4>📝 Key Takeaways</h4>
                <ul>
                    <li>Main point 1 to remember</li>
                    <li>Main point 2 to remember</li>
                    <li>Main point 3 to remember</li>
                    <li>Main point 4 to remember</li>
                </ul>
            </div>
        </section>
    `,
    
    // OPTIONAL: Initialization function for interactivity
    // Called after content is loaded into the DOM
    init: function() {
        // No special initialization needed for this simple module
        // See module-02-example-topic.js for interactive examples
    }
});
