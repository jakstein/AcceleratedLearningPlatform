// ===========================================
// Module 97: Assignment Generator
// AI-powered assignment system with persistent chat context
// ===========================================
// TEMPLATE MODULE - Generates comprehensive assignments
// based on module content using LLM. Features:
//   - Module selection for content context
//   - AI-generated multi-step assignments
//   - AI grading with persistent conversation
//   - Follow-up discussion capability
//
// REQUIRES: LLM connection configured in ChatHelper
// ===========================================

registerModule({
    number: 97,
    title: 'Assignments',
    shortTitle: 'Assignments',
    section: 'advanced',
    
    content: `
        <section class="module-section">
            <h2>Interactive Assignments</h2>
            
            <p>Generate comprehensive assignments to practice and deepen your understanding. 
            Unlike quick tests, assignments are larger, multi-step tasks similar to university coursework.</p>
            
            <div class="info-box">
                <h4>💡 How It Works</h4>
                <ul>
                    <li><strong>Select Topics:</strong> Choose modules to base the assignment on</li>
                    <li><strong>Generate:</strong> AI creates a detailed, multi-step assignment</li>
                    <li><strong>Work on It:</strong> Complete the task in the response area</li>
                    <li><strong>Submit:</strong> Get comprehensive feedback from the AI</li>
                    <li><strong>Discuss:</strong> Ask follow-up questions for clarification</li>
                </ul>
            </div>
            
            <div class="warning-box">
                <h4>⚠️ Important</h4>
                <p>Generating a new assignment will clear your current work. Make sure to save or submit your current assignment first.</p>
            </div>
        </section>

        <section class="module-section">
            <h2>Configure Assignment</h2>
            
            <div class="assignment-config-container">
                <div class="config-section">
                    <h3>📚 Select Modules</h3>
                    <p class="config-description">Choose one or more modules to generate an assignment from:</p>
                    <div class="module-selector-grid" id="assignment-module-selector">
                        <!-- Populated dynamically -->
                    </div>
                    <div class="selection-actions">
                        <button class="control-btn secondary" id="assignment-select-all-btn">Select All</button>
                        <button class="control-btn secondary" id="assignment-deselect-all-btn">Deselect All</button>
                        <span class="selection-count" id="assignment-selection-count">0 modules selected</span>
                    </div>
                </div>
                
                <div class="config-row">
                    <div class="config-section config-half">
                        <h3>🔢 Number of Tasks</h3>
                        <div class="question-count-input">
                            <input type="number" id="assignment-task-count" min="1" max="10" value="3">
                            <span class="count-hint">Between 1 and 10</span>
                        </div>
                    </div>
                    
                    <div class="config-section config-half">
                        <h3>📋 Additional Instructions (Optional)</h3>
                        <textarea id="assignment-extra-instructions" 
                                  placeholder="Optional: Add specific focus areas, difficulty preferences, or topics to emphasize...&#10;&#10;Examples:&#10;- Focus on real-world applications&#10;- Include calculation-based questions&#10;- Make it research-oriented"></textarea>
                    </div>
                </div>
                
                <div class="config-actions">
                    <button class="control-btn primary generate-btn" id="generate-assignment-btn" disabled>
                        <span class="btn-icon">🎯</span>
                        <span class="btn-text">Generate Assignment</span>
                    </button>
                </div>
            </div>
        </section>

        <section class="module-section" id="assignment-section" style="display: none;">
            <h2>Your Assignment</h2>
            
            <div class="assignment-container">
                <div class="assignment-header">
                    <span class="assignment-badge">Assignment</span>
                    <span class="assignment-modules" id="assignment-modules-badge"></span>
                </div>
                
                <div class="assignment-content" id="assignment-content">
                    <!-- Assignment content rendered here -->
                </div>
                
                <div class="assignment-response-section">
                    <h3>📝 Your Solution</h3>
                    <p class="response-hint">Complete your assignment below. You can include explanations, calculations, code, or any relevant content. For math, use LaTeX syntax with dollar signs.</p>
                    <textarea id="assignment-response" 
                              class="assignment-response-input" 
                              rows="15" 
                              placeholder="Enter your complete solution here..."></textarea>
                    
                    <div class="response-actions">
                        <button class="control-btn secondary" id="clear-response-btn">Clear Response</button>
                        <button class="control-btn primary submit-btn" id="submit-assignment-btn">
                            <span class="btn-icon">📤</span>
                            <span class="btn-text">Submit for Grading</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <section class="module-section" id="assignment-feedback-section" style="display: none;">
            <h2>Feedback</h2>
            
            <div class="feedback-container" id="feedback-container">
                <!-- Feedback rendered here -->
            </div>
            
            <div class="feedback-actions">
                <button class="control-btn secondary" id="continue-conversation-btn">
                    <span class="btn-icon">💬</span>
                    <span class="btn-text">Ask Follow-up Question</span>
                </button>
                <button class="control-btn primary" id="new-assignment-btn">
                    <span class="btn-icon">🎯</span>
                    <span class="btn-text">Generate New Assignment</span>
                </button>
            </div>
        </section>
        
        <section class="module-section" id="followup-section" style="display: none;">
            <h2>Continue Discussion</h2>
            
            <div class="followup-container">
                <textarea id="followup-input" 
                          class="followup-input" 
                          rows="4" 
                          placeholder="Ask a follow-up question or request clarification..."></textarea>
                <div class="followup-actions">
                    <button class="control-btn primary" id="send-followup-btn">
                        <span class="btn-icon">💬</span>
                        <span class="btn-text">Send</span>
                    </button>
                </div>
            </div>
            
            <div class="conversation-history" id="conversation-history">
                <!-- Conversation history rendered here -->
            </div>
        </section>
    `,
    
    // State management
    state: {
        selectedModules: [],
        conversationHistory: [],  // Persistent chat context
        currentAssignment: null,
        isProcessing: false
    },
    
    init: function() {
        this.state = {
            selectedModules: [],
            conversationHistory: [],
            currentAssignment: null,
            isProcessing: false
        };
        this.populateModuleSelector();
        this.setupEventListeners();
    },
    
    // Get all non-special modules (exclude 97-99)
    getAssignableModules: function() {
        const modules = window.LearningModules || [];
        return modules.filter(m => m.number < 97);
    },
    
    // Populate module selector with non-special modules
    populateModuleSelector: function() {
        const selector = document.getElementById('assignment-module-selector');
        if (!selector) return;
        
        const regularModules = this.getAssignableModules();
        
        if (regularModules.length === 0) {
            selector.innerHTML = '<p class="no-modules-message">No content modules available. Add modules numbered below 97.</p>';
            return;
        }
        
        selector.innerHTML = regularModules.map(mod => `
            <label class="module-checkbox">
                <input type="checkbox" name="assignment-module" value="${mod.number}" data-title="${mod.title}">
                <span class="checkbox-label">
                    <span class="module-num">${mod.number}</span>
                    <span class="module-title">${mod.shortTitle || mod.title}</span>
                </span>
            </label>
        `).join('');
    },
    
    // Setup all event listeners
    setupEventListeners: function() {
        const self = this;
        
        // Module selection
        const selector = document.getElementById('assignment-module-selector');
        if (selector) {
            selector.addEventListener('change', function(e) {
                if (e.target.type === 'checkbox') {
                    self.updateModuleSelection();
                }
            });
        }
        
        // Select/Deselect all
        const selectAllBtn = document.getElementById('assignment-select-all-btn');
        const deselectAllBtn = document.getElementById('assignment-deselect-all-btn');
        
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', function() {
                document.querySelectorAll('#assignment-module-selector input[type="checkbox"]')
                    .forEach(cb => cb.checked = true);
                self.updateModuleSelection();
            });
        }
        
        if (deselectAllBtn) {
            deselectAllBtn.addEventListener('click', function() {
                document.querySelectorAll('#assignment-module-selector input[type="checkbox"]')
                    .forEach(cb => cb.checked = false);
                self.updateModuleSelection();
            });
        }
        
        // Generate button
        const generateBtn = document.getElementById('generate-assignment-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', function() {
                self.generateAssignment();
            });
        }
        
        // Submit button
        const submitBtn = document.getElementById('submit-assignment-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', function() {
                self.submitAssignment();
            });
        }
        
        // Clear response
        const clearBtn = document.getElementById('clear-response-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                const textarea = document.getElementById('assignment-response');
                if (textarea) textarea.value = '';
            });
        }
        
        // New assignment
        const newBtn = document.getElementById('new-assignment-btn');
        if (newBtn) {
            newBtn.addEventListener('click', function() {
                self.resetToConfig();
            });
        }
        
        // Continue conversation
        const continueBtn = document.getElementById('continue-conversation-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', function() {
                document.getElementById('followup-section').style.display = 'block';
                document.getElementById('followup-input').focus();
            });
        }
        
        // Send follow-up
        const followupBtn = document.getElementById('send-followup-btn');
        if (followupBtn) {
            followupBtn.addEventListener('click', function() {
                self.sendFollowup();
            });
        }
    },
    
    // Update module selection state
    updateModuleSelection: function() {
        const checkboxes = document.querySelectorAll('#assignment-module-selector input[type="checkbox"]:checked');
        this.state.selectedModules = Array.from(checkboxes).map(cb => parseInt(cb.value));
        
        const countEl = document.getElementById('assignment-selection-count');
        if (countEl) {
            countEl.textContent = `${this.state.selectedModules.length} module${this.state.selectedModules.length !== 1 ? 's' : ''} selected`;
        }
        
        const generateBtn = document.getElementById('generate-assignment-btn');
        if (generateBtn) {
            generateBtn.disabled = this.state.selectedModules.length === 0;
        }
    },
    
    // Extract clean content from module (skip interactive code/demos)
    extractModuleContent: function(module) {
        const temp = document.createElement('div');
        temp.innerHTML = module.content || '';
        
        // Remove script tags, canvas elements, and interactive controls
        temp.querySelectorAll('script, canvas, .canvas-controls, .control-btn, button, input, select, textarea').forEach(el => el.remove());
        
        // Get text content
        let text = temp.textContent || temp.innerText || '';
        
        // Clean up whitespace
        text = text.replace(/\s+/g, ' ').trim();
        
        // Limit length per module
        if (text.length > 6000) {
            text = text.substring(0, 6000) + '...';
        }
        
        return text;
    },
    
    // Gather content from selected modules
    gatherModuleContent: function() {
        const modules = window.LearningModules || [];
        const selectedContent = [];
        
        this.state.selectedModules.forEach(modNum => {
            const mod = modules.find(m => m.number === modNum);
            if (mod) {
                const content = this.extractModuleContent(mod);
                selectedContent.push(`
=== Module ${mod.number}: ${mod.title} ===
${content}
`);
            }
        });
        
        return selectedContent.join('\n\n');
    },
    
    // Generate a new assignment
    generateAssignment: async function() {
        if (this.state.isProcessing || this.state.selectedModules.length === 0) return;
        
        this.state.isProcessing = true;
        const generateBtn = document.getElementById('generate-assignment-btn');
        const originalText = generateBtn.innerHTML;
        generateBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Generating...</span>';
        generateBtn.disabled = true;
        
        try {
            // Reset conversation for new assignment
            this.state.conversationHistory = [];
            this.state.currentAssignment = null;
            
            // Gather module content
            const moduleContent = this.gatherModuleContent();
            const extraInstructions = document.getElementById('assignment-extra-instructions')?.value || '';
            const taskCount = parseInt(document.getElementById('assignment-task-count')?.value) || 3;
            
            // Get LLM config from ChatHelper
            const apiUrl = ChatHelper.config.apiUrl + '/v1/chat/completions';
            const model = ChatHelper.config.model;
            
            // Build system prompt
            const systemPrompt = `You are an educational assignment creator. Your task is to create a comprehensive, university-level assignment based on the provided module content.

The assignment should:
1. Be substantial and multi-step (suitable for a homework assignment or lab exercise)
2. Test deep understanding, not just memorization
3. Include a mix of theoretical concepts and practical applications where appropriate
4. Be clearly structured with numbered steps or sections
5. Include any necessary context or constraints
6. Be achievable but challenging

Types of assignments you can create:
- Problem-solving exercises with calculations
- Research and analysis tasks
- Design challenges
- Case study analysis
- Conceptual questions requiring detailed explanations
- Practical implementation tasks (e.g., algorithm design, system design)

Format your response as a JSON object with the following structure:
{
    "title": "Assignment title",
    "description": "Brief overview of what this assignment covers",
    "objectives": ["Learning objective 1", "Learning objective 2", ...],
    "tasks": [
        {
            "number": 1,
            "title": "Task title",
            "description": "Detailed task description with all necessary information",
            "hints": ["Optional hint 1", "Optional hint 2"]
        }
    ],
    "estimatedTime": "Estimated time to complete (e.g., '1-2 hours')",
    "rubric": {
        "excellent": "Description of excellent work",
        "good": "Description of good work",
        "needsImprovement": "Description of work that needs improvement"
    }
}

Use LaTeX notation for any mathematical expressions: $...$ for inline math, $$...$$ for display math.
Return ONLY the JSON object with no additional text.`;

            // Build user prompt
            const userPrompt = `Please create a detailed assignment with exactly ${taskCount} task${taskCount !== 1 ? 's' : ''} based on the following module content:

${moduleContent}

${extraInstructions ? `\nAdditional requirements: ${extraInstructions}` : ''}

Generate a challenging but fair assignment that tests understanding of these concepts. Return only the JSON object.`;

            // Make API call
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 8192
                })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            let content = data.choices?.[0]?.message?.content || '';
            
            // Filter reasoning blocks and extract JSON
            content = this.filterReasoning(content);
            const assignment = this.extractJSON(content);
            
            if (!assignment || !assignment.tasks) {
                throw new Error('Invalid assignment format received');
            }
            
            // Store in state
            this.state.currentAssignment = assignment;
            
            // Store conversation history for grading context
            this.state.conversationHistory = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
                { role: 'assistant', content: JSON.stringify(assignment) }
            ];
            
            // Render assignment
            this.renderAssignment(assignment);
            
        } catch (error) {
            console.error('Assignment generation error:', error);
            alert('Failed to generate assignment. Please check your LLM connection and try again.\n\nError: ' + error.message);
        } finally {
            this.state.isProcessing = false;
            generateBtn.innerHTML = originalText;
            generateBtn.disabled = this.state.selectedModules.length === 0;
        }
    },
    
    // Render the assignment
    renderAssignment: function(assignment) {
        const contentEl = document.getElementById('assignment-content');
        const sectionEl = document.getElementById('assignment-section');
        const moduleBadge = document.getElementById('assignment-modules-badge');
        
        if (!contentEl || !sectionEl) return;
        
        // Update module badge
        const modules = window.LearningModules || [];
        const selectedTitles = this.state.selectedModules.map(num => {
            const mod = modules.find(m => m.number === num);
            return mod ? mod.shortTitle || mod.title : `Module ${num}`;
        });
        if (moduleBadge) {
            moduleBadge.textContent = selectedTitles.join(', ');
        }
        
        // Render assignment content
        contentEl.innerHTML = `
            <div class="assignment-title">${this.renderKaTeX(assignment.title)}</div>
            <div class="assignment-description">${this.renderKaTeX(assignment.description)}</div>
            
            ${assignment.objectives?.length ? `
                <div class="assignment-objectives">
                    <h4>🎯 Learning Objectives</h4>
                    <ul>
                        ${assignment.objectives.map(obj => `<li>${this.renderKaTeX(obj)}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <div class="assignment-tasks">
                <h4>📋 Tasks</h4>
                ${assignment.tasks.map(task => `
                    <div class="assignment-task">
                        <div class="task-header">
                            <span class="task-number">Task ${task.number}</span>
                            <span class="task-title">${this.renderKaTeX(task.title)}</span>
                        </div>
                        <div class="task-description">${this.renderKaTeX(task.description)}</div>
                        ${task.hints?.length ? `
                            <div class="task-hints">
                                <details>
                                    <summary>💡 Hints</summary>
                                    <ul>
                                        ${task.hints.map(hint => `<li>${this.renderKaTeX(hint)}</li>`).join('')}
                                    </ul>
                                </details>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            
            ${assignment.estimatedTime ? `
                <div class="assignment-meta">
                    <span class="meta-item">⏱️ Estimated time: ${assignment.estimatedTime}</span>
                </div>
            ` : ''}
            
            ${assignment.rubric ? `
                <div class="assignment-rubric">
                    <details>
                        <summary>📊 Grading Rubric</summary>
                        <div class="rubric-content">
                            <div class="rubric-item excellent">
                                <strong>Excellent:</strong> ${this.renderKaTeX(assignment.rubric.excellent)}
                            </div>
                            <div class="rubric-item good">
                                <strong>Good:</strong> ${this.renderKaTeX(assignment.rubric.good)}
                            </div>
                            <div class="rubric-item needs-improvement">
                                <strong>Needs Improvement:</strong> ${this.renderKaTeX(assignment.rubric.needsImprovement)}
                            </div>
                        </div>
                    </details>
                </div>
            ` : ''}
        `;
        
        // Show assignment section, hide feedback
        sectionEl.style.display = 'block';
        document.getElementById('assignment-feedback-section').style.display = 'none';
        document.getElementById('followup-section').style.display = 'none';
        
        // Clear response area
        const responseArea = document.getElementById('assignment-response');
        if (responseArea) responseArea.value = '';
        
        // Scroll to assignment
        sectionEl.scrollIntoView({ behavior: 'smooth' });
    },
    
    // Submit assignment for grading
    submitAssignment: async function() {
        const responseArea = document.getElementById('assignment-response');
        const response = responseArea?.value?.trim();
        
        if (!response) {
            alert('Please enter your solution before submitting.');
            return;
        }
        
        if (this.state.isProcessing) return;
        
        this.state.isProcessing = true;
        const submitBtn = document.getElementById('submit-assignment-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Grading...</span>';
        submitBtn.disabled = true;
        
        try {
            const apiUrl = ChatHelper.config.apiUrl + '/v1/chat/completions';
            const model = ChatHelper.config.model;
            
            // Add user response to conversation
            const gradingPrompt = `The student has submitted the following solution for the assignment:

---
${response}
---

Please evaluate this submission thoroughly. Provide:
1. An overall assessment (Excellent, Good, Satisfactory, Needs Improvement)
2. A score out of 100
3. Detailed feedback on each task
4. Strengths of the submission
5. Areas for improvement
6. Suggestions for further learning

IMPORTANT: Return ONLY a valid JSON object with this structure:
{
    "overallGrade": "Excellent|Good|Satisfactory|Needs Improvement",
    "score": 85,
    "summary": "Brief overall summary of the submission",
    "taskFeedback": [
        {
            "taskNumber": 1,
            "assessment": "How well this task was completed",
            "score": 90,
            "strengths": ["strength 1", "strength 2"],
            "improvements": ["suggestion 1", "suggestion 2"]
        }
    ],
    "overallStrengths": ["strength 1", "strength 2"],
    "areasForImprovement": ["area 1", "area 2"],
    "learningResources": ["Optional suggested resources for further study"]
}

Use LaTeX notation for any mathematical feedback: $...$ for inline, $$...$$ for display math.
No additional text outside the JSON.`;
            
            // Build messages including full conversation history
            const messages = [
                ...this.state.conversationHistory,
                { role: 'user', content: gradingPrompt }
            ];
            
            const apiResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    temperature: 0.5,
                    max_tokens: 8192
                })
            });
            
            if (!apiResponse.ok) {
                throw new Error(`API error: ${apiResponse.status}`);
            }
            
            const data = await apiResponse.json();
            let content = data.choices?.[0]?.message?.content || '';
            
            // Filter reasoning and extract JSON
            content = this.filterReasoning(content);
            const feedback = this.extractJSON(content);
            
            if (!feedback) {
                throw new Error('Invalid feedback format received');
            }
            
            // Update conversation history
            this.state.conversationHistory.push(
                { role: 'user', content: gradingPrompt },
                { role: 'assistant', content: JSON.stringify(feedback) }
            );
            
            // Render feedback
            this.renderFeedback(feedback);
            
        } catch (error) {
            console.error('Grading error:', error);
            alert('Failed to grade assignment. Please check your LLM connection and try again.\n\nError: ' + error.message);
        } finally {
            this.state.isProcessing = false;
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    },
    
    // Render feedback
    renderFeedback: function(feedback) {
        const container = document.getElementById('feedback-container');
        const section = document.getElementById('assignment-feedback-section');
        
        if (!container || !section) return;
        
        const gradeClass = feedback.overallGrade?.toLowerCase().replace(/\s+/g, '-') || 'good';
        
        container.innerHTML = `
            <div class="feedback-header">
                <div class="feedback-grade ${gradeClass}">
                    <span class="grade-label">${feedback.overallGrade || 'Graded'}</span>
                    <span class="grade-score">${feedback.score || '—'}/100</span>
                </div>
            </div>
            
            <div class="feedback-summary">
                <h4>📝 Summary</h4>
                <p>${this.renderKaTeX(feedback.summary || 'No summary provided.')}</p>
            </div>
            
            ${feedback.taskFeedback?.length ? `
                <div class="feedback-tasks">
                    <h4>📋 Task-by-Task Feedback</h4>
                    ${feedback.taskFeedback.map(tf => `
                        <div class="feedback-task">
                            <div class="feedback-task-header">
                                <span class="task-badge">Task ${tf.taskNumber}</span>
                                <span class="task-score">${tf.score}/100</span>
                            </div>
                            <div class="feedback-task-assessment">${this.renderKaTeX(tf.assessment)}</div>
                            ${tf.strengths?.length ? `
                                <div class="feedback-strengths">
                                    <strong>✅ Strengths:</strong>
                                    <ul>${tf.strengths.map(s => `<li>${this.renderKaTeX(s)}</li>`).join('')}</ul>
                                </div>
                            ` : ''}
                            ${tf.improvements?.length ? `
                                <div class="feedback-improvements">
                                    <strong>💡 Improvements:</strong>
                                    <ul>${tf.improvements.map(i => `<li>${this.renderKaTeX(i)}</li>`).join('')}</ul>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${feedback.overallStrengths?.length ? `
                <div class="feedback-overall-strengths">
                    <h4>✅ Overall Strengths</h4>
                    <ul>${feedback.overallStrengths.map(s => `<li>${this.renderKaTeX(s)}</li>`).join('')}</ul>
                </div>
            ` : ''}
            
            ${feedback.areasForImprovement?.length ? `
                <div class="feedback-improvements">
                    <h4>💡 Areas for Improvement</h4>
                    <ul>${feedback.areasForImprovement.map(a => `<li>${this.renderKaTeX(a)}</li>`).join('')}</ul>
                </div>
            ` : ''}
            
            ${feedback.learningResources?.length ? `
                <div class="feedback-resources">
                    <h4>📚 Suggested Learning Resources</h4>
                    <ul>${feedback.learningResources.map(r => `<li>${this.renderKaTeX(r)}</li>`).join('')}</ul>
                </div>
            ` : ''}
        `;
        
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });
    },
    
    // Send follow-up question (continues in same conversation)
    sendFollowup: async function() {
        const input = document.getElementById('followup-input');
        const question = input?.value?.trim();
        
        if (!question || this.state.isProcessing) return;
        
        this.state.isProcessing = true;
        const sendBtn = document.getElementById('send-followup-btn');
        const originalText = sendBtn.innerHTML;
        sendBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Sending...</span>';
        sendBtn.disabled = true;
        
        try {
            const apiUrl = ChatHelper.config.apiUrl + '/v1/chat/completions';
            const model = ChatHelper.config.model;
            
            // Add question to conversation
            this.state.conversationHistory.push({ role: 'user', content: question });
            
            const apiResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: model,
                    messages: this.state.conversationHistory,
                    temperature: 0.7,
                    max_tokens: 8192
                })
            });
            
            if (!apiResponse.ok) {
                throw new Error(`API error: ${apiResponse.status}`);
            }
            
            const data = await apiResponse.json();
            let content = data.choices?.[0]?.message?.content || '';
            content = this.filterReasoning(content);
            
            // Add response to conversation
            this.state.conversationHistory.push({ role: 'assistant', content: content });
            
            // Render conversation
            this.renderConversationHistory();
            
            // Clear input
            input.value = '';
            
        } catch (error) {
            console.error('Follow-up error:', error);
            alert('Failed to send message. Please try again.');
            // Remove the failed message from history
            this.state.conversationHistory.pop();
        } finally {
            this.state.isProcessing = false;
            sendBtn.innerHTML = originalText;
            sendBtn.disabled = false;
        }
    },
    
    // Render conversation history
    renderConversationHistory: function() {
        const container = document.getElementById('conversation-history');
        if (!container) return;
        
        // Filter to show only user/assistant messages after grading
        const gradingIndex = this.state.conversationHistory.findIndex(
            m => m.role === 'user' && m.content.includes('Please evaluate this submission')
        );
        
        const relevantHistory = this.state.conversationHistory.slice(gradingIndex);
        
        container.innerHTML = relevantHistory.map((msg, i) => {
            if (msg.role === 'system') return '';
            
            // Skip the grading prompt and response (already shown in feedback)
            if (i <= 1) return '';
            
            const isUser = msg.role === 'user';
            return `
                <div class="conversation-message ${isUser ? 'user' : 'assistant'}">
                    <div class="message-role">${isUser ? 'You' : 'AI Tutor'}</div>
                    <div class="message-content">${this.renderKaTeX(msg.content)}</div>
                </div>
            `;
        }).join('');
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    },
    
    // Reset to configuration view
    resetToConfig: function() {
        this.state.conversationHistory = [];
        this.state.currentAssignment = null;
        
        document.getElementById('assignment-section').style.display = 'none';
        document.getElementById('assignment-feedback-section').style.display = 'none';
        document.getElementById('followup-section').style.display = 'none';
        
        // Clear response area
        const responseArea = document.getElementById('assignment-response');
        if (responseArea) responseArea.value = '';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    // ==================== Helper Functions ====================
    
    // Escape HTML to prevent XSS
    escapeHtml: function(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Render text with KaTeX support
    renderKaTeX: function(text) {
        if (!text) return '';
        
        // Escape HTML first (but preserve math delimiters)
        let result = this.escapeHtml(text);
        
        // Process block math ($$...$$)
        result = result.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
            try {
                if (window.katex) {
                    const rendered = window.katex.renderToString(math.trim(), {
                        displayMode: true,
                        throwOnError: false,
                        strict: false
                    });
                    return `<div class="katex-display">${rendered}</div>`;
                }
            } catch (e) {
                console.warn('KaTeX block render error:', e);
            }
            return `<div class="math-block">$$${math}$$</div>`;
        });
        
        // Process inline math ($...$)
        result = result.replace(/\$([^\$\n]+)\$/g, (match, math) => {
            try {
                if (window.katex) {
                    const rendered = window.katex.renderToString(math.trim(), {
                        displayMode: false,
                        throwOnError: false,
                        strict: false
                    });
                    return `<span class="katex-inline">${rendered}</span>`;
                }
            } catch (e) {
                console.warn('KaTeX inline render error:', e);
            }
            return `<span class="math-inline">$${math}$</span>`;
        });
        
        // Convert newlines to <br>
        result = result.replace(/\n/g, '<br>');
        
        return result;
    },
    
    // Filter reasoning blocks from model output
    filterReasoning: function(text) {
        if (!text) return '';
        
        let filtered = text;
        
        // Handle </think> tag - take everything after it
        const thinkEndIndex = filtered.lastIndexOf('</think>');
        if (thinkEndIndex !== -1) {
            filtered = filtered.substring(thinkEndIndex + 8).trim();
        } else if (filtered.includes('<think>')) {
            // Still in reasoning phase, return empty
            return '';
        }
        
        // Also handle models that output "...think>" at the start
        if (filtered.match(/^[\s\S]*?think>\s*/)) {
            filtered = filtered.replace(/^[\s\S]*?think>\s*/, '');
        }
        
        return filtered.trim();
    },
    
    // Extract JSON from response text
    extractJSON: function(text) {
        if (!text) return null;
        
        // Remove markdown code block wrappers (```json ... ``` or ``` ... ```)
        let cleaned = text.replace(/```(?:json)?\s*/g, '').replace(/```/g, '').trim();
        
        // Try parsing the cleaned text first
        let parsed = null;
        try {
            parsed = JSON.parse(cleaned);
        } catch (e) {
            // Try to find JSON object in the text
            const firstBrace = cleaned.indexOf('{');
            const lastBrace = cleaned.lastIndexOf('}');
            
            if (firstBrace !== -1 && lastBrace > firstBrace) {
                const jsonStr = cleaned.substring(firstBrace, lastBrace + 1);
                try {
                    parsed = JSON.parse(jsonStr);
                } catch (e2) {
                    console.warn('Failed to parse extracted JSON:', e2);
                }
            }
        }
        
        if (!parsed) return null;
        
        // Handle schema-wrapped responses where the LLM returns {"type":"object","properties":{...}}
        // The actual data is inside "properties"
        if (parsed.type === 'object' && parsed.properties && parsed.properties.title && parsed.properties.tasks) {
            return parsed.properties;
        }
        
        return parsed;
    }
});
