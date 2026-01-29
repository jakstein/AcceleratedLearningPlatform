// ===========================================
// Module 99: Interview Preparation
// ===========================================
// EXAMPLE MODULE - Shows interview Q&A format with:
//   - Good Answer / Bad Answer reveal buttons
//   - Key Takeaways (What to Mention / What to Avoid)
// 
// CUSTOMIZE: Replace questions array with your subject's
// interview questions. Follow the data structure below.
// ===========================================

registerModule({
    number: 99,
    title: 'Interview Preparation',
    shortTitle: 'Interview Prep',
    section: 'advanced',
    
    content: `
        <section class="module-section">
            <h2>[Your Subject] Interview Preparation</h2>
            
            <p>This guide covers common interview questions for [your subject] positions. Each question includes:</p>
            
            <ul>
                <li><strong>Good Answer:</strong> What interviewers want to hear</li>
                <li><strong>Bad Answer:</strong> Common mistakes to avoid</li>
                <li><strong>Key Takeaways:</strong> What to mention and what to avoid</li>
            </ul>
            
            <div class="info-box">
                <h4>💡 Interview Tips</h4>
                <ul>
                    <li>Use specific examples from your experience when possible</li>
                    <li>Demonstrate practical knowledge, not just theory</li>
                    <li>Be honest about what you don't know, but show willingness to learn</li>
                </ul>
            </div>
        </section>

        <!-- FUNDAMENTALS SECTION -->
        <!-- CUSTOMIZE: Update section title and id for your subject -->
        <section class="module-section">
            <h2>Part 1: Fundamentals</h2>
            <div class="interview-questions-container" id="fundamentals-questions">
                <!-- Questions rendered dynamically -->
            </div>
        </section>

        <!-- TECHNICAL SECTION -->
        <!-- CUSTOMIZE: Add/remove sections as needed for your subject -->
        <section class="module-section">
            <h2>Part 2: Technical Concepts</h2>
            <div class="interview-questions-container" id="technical-questions">
                <!-- Questions rendered dynamically -->
            </div>
        </section>

        <!-- BEHAVIORAL SECTION -->
        <section class="module-section">
            <h2>Part 3: Behavioral Questions</h2>
            <div class="interview-questions-container" id="behavioral-questions">
                <!-- Questions rendered dynamically -->
            </div>
        </section>
    `,
    
    init: function() {
        this.renderAllQuestions();
        this.setupRevealButtons();
    },
    
    // ===========================================
    // CUSTOMIZE: Replace these example questions with
    // your subject's interview questions.
    // 
    // Structure for each question:
    // {
    //     num: 1,                          // Question number
    //     question: "Question text here",  // The interview question
    //     goodAnswer: "<p>HTML content</p>", // Ideal answer (supports HTML)
    //     badAnswer: "<p>HTML content</p>",  // Poor answer example
    //     toMention: ["point 1", "point 2"], // Key things to say
    //     toAvoid: ["mistake 1", "mistake 2"] // Things NOT to say
    // }
    // ===========================================
    questions: {
        fundamentals: [
            {
                num: 1,
                question: "What is [core concept] and why is it important?",
                goodAnswer: `<p><strong>[Core Concept]</strong> is [clear definition].</p>
                    <p><strong>Why it matters:</strong></p>
                    <ul>
                        <li><strong>Reason 1:</strong> Explanation of first benefit or use case</li>
                        <li><strong>Reason 2:</strong> Explanation of second benefit</li>
                        <li><strong>Reason 3:</strong> Practical application example</li>
                    </ul>
                    <p><strong>Example:</strong> In practice, this means [specific example demonstrating understanding].</p>`,
                badAnswer: `<p>"It's just [oversimplified definition]. I use it because that's what everyone does."</p>
                    <p>This answer is weak because it shows no understanding of <em>why</em> the concept matters or how to apply it appropriately.</p>`,
                toMention: [
                    "Clear, accurate definition",
                    "Practical applications and examples",
                    "Trade-offs or considerations",
                    "Related concepts that show broader knowledge",
                    "Personal experience if relevant"
                ],
                toAvoid: [
                    "Vague or incorrect definitions",
                    "Saying 'I don't really know why'",
                    "Oversimplifying without nuance",
                    "Not connecting to practical use"
                ]
            },
            {
                num: 2,
                question: "Explain the difference between [Term A] and [Term B].",
                goodAnswer: `<p><strong>[Term A]</strong> refers to [definition A].</p>
                    <p><strong>[Term B]</strong> refers to [definition B].</p>
                    <p><strong>Key differences:</strong></p>
                    <ul>
                        <li><strong>Scope:</strong> A is used for X, while B is used for Y</li>
                        <li><strong>When to use:</strong> Choose A when [conditions], choose B when [other conditions]</li>
                        <li><strong>Trade-offs:</strong> A offers [benefit] but lacks [feature]; B offers [other benefit] but requires [consideration]</li>
                    </ul>
                    <p><strong>Practical example:</strong> If you need [scenario], use A because [reason]. If you need [other scenario], use B.</p>`,
                badAnswer: `<p>"They're basically the same thing, just different names."</p>
                    <p>This shows fundamental misunderstanding. These are distinct concepts with important differences that affect real-world decisions.</p>`,
                toMention: [
                    "Clear distinction between the two",
                    "Specific use cases for each",
                    "Trade-offs and considerations",
                    "When you would choose one over the other"
                ],
                toAvoid: [
                    "Conflating the two terms",
                    "Not knowing key differences",
                    "Failing to provide examples",
                    "Guessing or being vague"
                ]
            }
        ],
        technical: [
            {
                num: 3,
                question: "How would you approach [technical problem/task]?",
                goodAnswer: `<p><strong>Systematic approach:</strong></p>
                    <ol>
                        <li><strong>Understand requirements:</strong> First, clarify what exactly is needed and any constraints</li>
                        <li><strong>Analyze options:</strong> Consider multiple approaches and their trade-offs</li>
                        <li><strong>Plan implementation:</strong> Break down into steps, identify dependencies</li>
                        <li><strong>Execute and validate:</strong> Implement solution, test thoroughly</li>
                        <li><strong>Document and iterate:</strong> Record decisions, improve based on feedback</li>
                    </ol>
                    <p><strong>Key considerations:</strong></p>
                    <ul>
                        <li>Factor 1 that affects the approach</li>
                        <li>Factor 2 to consider</li>
                        <li>Edge cases to handle</li>
                    </ul>`,
                badAnswer: `<p>"I would just start doing it and figure it out as I go."</p>
                    <p>This shows no systematic thinking. Real-world problems require planning and consideration of trade-offs.</p>`,
                toMention: [
                    "Systematic, step-by-step approach",
                    "Consideration of alternatives",
                    "Awareness of trade-offs",
                    "Validation and testing",
                    "Specific experience with similar tasks"
                ],
                toAvoid: [
                    "Jumping in without planning",
                    "Ignoring edge cases",
                    "Not considering alternatives",
                    "Skipping validation"
                ]
            },
            {
                num: 4,
                question: "What are common mistakes beginners make with [topic]?",
                goodAnswer: `<p><strong>Common mistakes include:</strong></p>
                    <ul>
                        <li><strong>Mistake 1:</strong> [Description]. This causes [problem]. Instead, [correct approach].</li>
                        <li><strong>Mistake 2:</strong> [Description]. Better to [alternative].</li>
                        <li><strong>Mistake 3:</strong> [Description]. Experienced practitioners [what they do instead].</li>
                    </ul>
                    <p><strong>How I learned:</strong> I made [specific mistake] early on, which taught me to always [lesson learned].</p>`,
                badAnswer: `<p>"I'm not sure, I don't really make mistakes."</p>
                    <p>This shows lack of self-awareness. Everyone makes mistakes; the key is learning from them.</p>`,
                toMention: [
                    "Specific, real mistakes (not abstract)",
                    "Why each mistake is problematic",
                    "How to avoid or fix each",
                    "Personal experience learning from mistakes"
                ],
                toAvoid: [
                    "Claiming you never make mistakes",
                    "Being vague about what goes wrong",
                    "Not offering solutions",
                    "Blaming tools or others"
                ]
            }
        ],
        behavioral: [
            {
                num: 5,
                question: "Tell me about a time you solved a difficult problem.",
                goodAnswer: `<p>Use the <strong>STAR method</strong> (Situation, Task, Action, Result):</p>
                    <p><strong>Example structure:</strong></p>
                    <p>"<strong>Situation:</strong> We faced [specific challenge] that was causing [impact]."</p>
                    <p>"<strong>Task:</strong> I needed to [specific goal] under [constraints]."</p>
                    <p>"<strong>Action:</strong> I approached it by [specific steps you took]. I also [collaboration or resources used]."</p>
                    <p>"<strong>Result:</strong> This led to [measurable outcome]. I learned [key takeaway] that I've applied since."</p>`,
                badAnswer: `<p>"I solve problems all the time. I'm good at figuring things out."</p>
                    <p>This is too vague. Use a specific example with concrete details and measurable results.</p>`,
                toMention: [
                    "Specific, real example",
                    "Your role and actions",
                    "Measurable results",
                    "What you learned",
                    "How you've applied the lesson since"
                ],
                toAvoid: [
                    "Vague generalizations",
                    "Taking all credit for team efforts",
                    "Examples without clear outcomes",
                    "Not explaining your thinking process"
                ]
            },
            {
                num: 6,
                question: "How do you stay current with developments in [field]?",
                goodAnswer: `<p><strong>My approach includes:</strong></p>
                    <ul>
                        <li><strong>Regular reading:</strong> [Specific publications, blogs, newsletters]</li>
                        <li><strong>Community involvement:</strong> [Forums, meetups, conferences]</li>
                        <li><strong>Hands-on practice:</strong> [Side projects, experiments, courses]</li>
                        <li><strong>Professional development:</strong> [Certifications, training]</li>
                    </ul>
                    <p><strong>Recent example:</strong> I recently learned about [specific topic] through [source] and I'm exploring how to apply it to [relevant application].</p>`,
                badAnswer: `<p>"I just Google things when I need to."</p>
                    <p>This shows no proactive learning. Employers want people who actively stay current, not just react to problems.</p>`,
                toMention: [
                    "Specific resources by name",
                    "Mix of learning methods",
                    "Recent example of learning something new",
                    "How you apply new knowledge"
                ],
                toAvoid: [
                    "Vague 'I read online'",
                    "No specific resources",
                    "Reactive-only learning",
                    "Appearing disinterested in growth"
                ]
            }
        ]
    },
    
    // ===========================================
    // Rendering methods - usually don't need to modify
    // ===========================================
    
    renderAllQuestions: function() {
        Object.keys(this.questions).forEach(category => {
            const container = document.getElementById(`${category}-questions`);
            if (container && this.questions[category].length > 0) {
                container.innerHTML = this.questions[category].map((q, index) => 
                    this.renderQuestion(q, `${category}-${index}`)
                ).join('');
            }
        });
    },
    
    renderQuestion: function(q, id) {
        return `
            <div class="interview-question-card">
                <div class="question-header">
                    <span class="question-number">Q${q.num || ''}</span>
                    <h4 class="question-text">${q.question}</h4>
                </div>
                
                <div class="answer-buttons">
                    <button class="reveal-btn good-answer-btn" data-target="${id}-good">
                        ✓ Show Good Answer
                    </button>
                    <button class="reveal-btn bad-answer-btn" data-target="${id}-bad">
                        ✗ Show Bad Answer
                    </button>
                    <button class="reveal-btn takeaways-btn" data-target="${id}-takeaways">
                        💡 Key Takeaways
                    </button>
                </div>
                
                <div class="answer-panel good-answer" id="${id}-good" style="display: none;">
                    <h5>✓ Good Answer:</h5>
                    <div class="answer-content">${q.goodAnswer}</div>
                </div>
                
                <div class="answer-panel bad-answer" id="${id}-bad" style="display: none;">
                    <h5>✗ Bad Answer:</h5>
                    <div class="answer-content">${q.badAnswer}</div>
                </div>
                
                <div class="answer-panel takeaways" id="${id}-takeaways" style="display: none;">
                    <div class="takeaways-grid">
                        <div class="mention-section">
                            <h5>✓ What to Mention:</h5>
                            <ul>${q.toMention.map(item => `<li>${item}</li>`).join('')}</ul>
                        </div>
                        <div class="avoid-section">
                            <h5>✗ What to Avoid:</h5>
                            <ul>${q.toAvoid.map(item => `<li>${item}</li>`).join('')}</ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    setupRevealButtons: function() {
        document.querySelectorAll('.reveal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.getAttribute('data-target');
                const panel = document.getElementById(targetId);
                if (panel) {
                    const isVisible = panel.style.display !== 'none';
                    panel.style.display = isVisible ? 'none' : 'block';
                    
                    // Update button text
                    if (e.target.classList.contains('good-answer-btn')) {
                        e.target.textContent = isVisible ? '✓ Show Good Answer' : '✓ Hide Good Answer';
                    } else if (e.target.classList.contains('bad-answer-btn')) {
                        e.target.textContent = isVisible ? '✗ Show Bad Answer' : '✗ Hide Bad Answer';
                    } else if (e.target.classList.contains('takeaways-btn')) {
                        e.target.textContent = isVisible ? '💡 Key Takeaways' : '💡 Hide Takeaways';
                    }
                    
                    // Render math formulas in the newly revealed panel if KaTeX is available
                    if (!isVisible && typeof renderMathInElement !== 'undefined') {
                        renderMathInElement(panel, {
                            delimiters: [
                                {left: '$$', right: '$$', display: true},
                                {left: '$', right: '$', display: false}
                            ],
                            throwOnError: false
                        });
                    }
                }
            });
        });
    }
});
