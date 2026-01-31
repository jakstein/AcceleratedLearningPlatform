// ===========================================
// Module 98: Interactive Test Generator
// AI-powered quiz system for knowledge assessment
// ===========================================
// TEMPLATE MODULE - Generates and grades tests using LLM.
// Features:
//   - Module selection for content context
//   - Multiple question types (Single/Multiple Choice, 
//     Open Answer, True/False, Fill in the Blank)
//   - Configurable question count
//   - AI generation and grading
//   - Detailed feedback with explanations
//
// REQUIRES: LLM connection configured in ChatHelper
// ===========================================

registerModule({
    number: 98,
    title: 'Knowledge Tests',
    shortTitle: 'Tests',
    section: 'advanced',
    
    content: `
        <section class="module-section">
            <h2>Interactive Knowledge Tests</h2>
            
            <p>Generate customized tests to assess your understanding of the curriculum. 
            Select modules to test on, choose your preferred question format, and get AI-powered grading with explanations.</p>
            
            <div class="info-box">
                <h4>💡 How It Works</h4>
                <ul>
                    <li><strong>Select Modules:</strong> Choose which topics you want to be tested on</li>
                    <li><strong>Configure Test:</strong> Pick question type and count</li>
                    <li><strong>Generate:</strong> AI creates questions based on module content</li>
                    <li><strong>Answer & Submit:</strong> Complete the test at your own pace</li>
                    <li><strong>Get Feedback:</strong> Receive detailed grading and explanations</li>
                </ul>
            </div>
        </section>

        <section class="module-section">
            <h2>Configure Your Test</h2>
            
            <div class="test-config-container">
                <div class="config-section">
                    <h3>📚 Select Modules</h3>
                    <p class="config-description">Choose one or more modules to generate questions from:</p>
                    <div class="module-selector-grid" id="module-selector">
                        <!-- Populated dynamically -->
                    </div>
                    <div class="selection-actions">
                        <button class="control-btn secondary" id="select-all-btn">Select All</button>
                        <button class="control-btn secondary" id="deselect-all-btn">Deselect All</button>
                        <span class="selection-count" id="selection-count">0 modules selected</span>
                    </div>
                </div>
                
                <div class="config-row">
                    <div class="config-section config-half">
                        <h3>📝 Question Type</h3>
                        <div class="question-type-selector" id="question-type-selector">
                            <label class="type-option">
                                <input type="radio" name="question-type" value="single" checked>
                                <span class="type-label">
                                    <span class="type-icon">○</span>
                                    <span class="type-name">Single Choice</span>
                                    <span class="type-desc">Pick the one correct answer</span>
                                </span>
                            </label>
                            <label class="type-option">
                                <input type="radio" name="question-type" value="multiple">
                                <span class="type-label">
                                    <span class="type-icon">☐</span>
                                    <span class="type-name">Multiple Choice</span>
                                    <span class="type-desc">Select all correct answers</span>
                                </span>
                            </label>
                            <label class="type-option">
                                <input type="radio" name="question-type" value="open">
                                <span class="type-label">
                                    <span class="type-icon">✎</span>
                                    <span class="type-name">Open Answer</span>
                                    <span class="type-desc">Write your own response</span>
                                </span>
                            </label>
                            <label class="type-option">
                                <input type="radio" name="question-type" value="true-false">
                                <span class="type-label">
                                    <span class="type-icon">⚖</span>
                                    <span class="type-name">True/False</span>
                                    <span class="type-desc">Determine statement accuracy</span>
                                </span>
                            </label>
                            <label class="type-option">
                                <input type="radio" name="question-type" value="fill-blank">
                                <span class="type-label">
                                    <span class="type-icon">___</span>
                                    <span class="type-name">Fill in the Blank</span>
                                    <span class="type-desc">Complete the statement</span>
                                </span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="config-section config-half">
                        <h3>🔢 Number of Questions</h3>
                        <div class="question-count-input">
                            <input type="number" id="question-count" min="1" max="30" value="5">
                            <span class="count-hint">Between 1 and 30</span>
                        </div>
                        
                        <h3 style="margin-top: 25px;">📋 Additional Instructions</h3>
                        <textarea id="extra-instructions" 
                                  placeholder="Optional: Add specific focus areas, difficulty preferences, or topics to emphasize...&#10;&#10;Examples:&#10;- Focus on practical applications&#10;- Include calculation-based questions&#10;- Emphasize key concepts"></textarea>
                    </div>
                </div>
                
                <div class="generate-section">
                    <button class="control-btn primary generate-test-btn" id="generate-test-btn">
                        <span class="btn-icon">🎯</span>
                        Generate Test
                    </button>
                    <div class="generate-status" id="generate-status"></div>
                </div>
            </div>
        </section>

        <section class="module-section" id="test-area" style="display: none;">
            <div class="test-header">
                <h2 id="test-title">Your Test</h2>
                <div class="test-info" id="test-info"></div>
            </div>
            
            <div class="test-questions" id="test-questions">
                <!-- Questions populated dynamically -->
            </div>
            
            <div class="test-submit-section" id="test-submit-section">
                <button class="control-btn primary submit-test-btn" id="submit-test-btn">
                    <span class="btn-icon">📤</span>
                    Submit for Grading
                </button>
                <div class="submit-status" id="submit-status"></div>
            </div>
        </section>

        <section class="module-section" id="results-area" style="display: none;">
            <div class="results-header">
                <h2>Test Results</h2>
                <div class="results-summary" id="results-summary">
                    <!-- Score summary -->
                </div>
            </div>
            
            <div class="results-details" id="results-details">
                <!-- Detailed results per question -->
            </div>
            
            <div class="results-actions">
                <button class="control-btn secondary" id="new-test-btn">
                    <span class="btn-icon">🔄</span>
                    Create New Test
                </button>
            </div>
        </section>
    `,
    
    // Test state management
    state: {
        selectedModules: [],
        currentTest: null,
        testAnswers: {},
        testResults: null
    },
    
    init: function() {
        this.state = {
            selectedModules: [],
            currentTest: null,
            testAnswers: {},
            testResults: null
        };
        this.populateModuleSelector();
        this.setupEventListeners();
    },
    
    // Get all non-special modules (exclude 97-99)
    getTestableModules: function() {
        const modules = window.LearningModules || [];
        return modules.filter(m => m.number < 97);
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
    
    // Populate the module selector grid
    populateModuleSelector: function() {
        const container = document.getElementById('module-selector');
        if (!container) return;
        
        const modules = this.getTestableModules();
        
        if (modules.length === 0) {
            container.innerHTML = '<p class="no-modules-message">No content modules available. Add modules numbered below 97.</p>';
            return;
        }
        
        container.innerHTML = modules.map(m => `
            <label class="module-checkbox">
                <input type="checkbox" value="${m.number}" data-title="${m.title}">
                <span class="checkbox-label">
                    <span class="module-num">${m.number}</span>
                    <span class="module-title">${m.shortTitle || m.title}</span>
                </span>
            </label>
        `).join('');
        
        // Update selection count on change
        container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', () => this.updateSelectionCount());
        });
    },
    
    // Update the selection count display
    updateSelectionCount: function() {
        const selected = document.querySelectorAll('#module-selector input:checked');
        const countEl = document.getElementById('selection-count');
        if (countEl) {
            countEl.textContent = `${selected.length} module${selected.length !== 1 ? 's' : ''} selected`;
        }
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Select all button
        document.getElementById('select-all-btn')?.addEventListener('click', () => {
            document.querySelectorAll('#module-selector input[type="checkbox"]').forEach(cb => cb.checked = true);
            this.updateSelectionCount();
        });
        
        // Deselect all button
        document.getElementById('deselect-all-btn')?.addEventListener('click', () => {
            document.querySelectorAll('#module-selector input[type="checkbox"]').forEach(cb => cb.checked = false);
            this.updateSelectionCount();
        });
        
        // Generate test button
        document.getElementById('generate-test-btn')?.addEventListener('click', () => {
            this.generateTest();
        });
        
        // Submit test button
        document.getElementById('submit-test-btn')?.addEventListener('click', () => {
            this.submitTest();
        });
        
        // New test button
        document.getElementById('new-test-btn')?.addEventListener('click', () => {
            this.resetToConfig();
        });
    },
    
    // Build the system prompt for test generation
    buildGenerationPrompt: function(modules, questionType, questionCount, extraInstructions) {
        const typeDescriptions = {
            'single': 'Single choice questions with 4 options where exactly one is correct',
            'multiple': 'Multiple choice questions with 4-5 options where 2-3 are correct',
            'open': 'Open-ended questions requiring short paragraph answers',
            'true-false': 'True/False statements that the test-taker must evaluate',
            'fill-blank': 'Sentences with a blank that must be filled with the correct term'
        };
        
        return `You are an expert educator creating a knowledge assessment test.

Your task: Generate exactly ${questionCount} ${typeDescriptions[questionType]} based on the provided module content.

IMPORTANT GUIDELINES:
- Questions should test understanding, not just memorization
- Mix difficulty levels: some basic recall, some application, some analysis
- Questions should be clear and unambiguous
- For choice questions, make distractors plausible but clearly incorrect
- Cover different topics from the selected modules proportionally
${extraInstructions ? `\nADDITIONAL INSTRUCTIONS FROM USER:\n${extraInstructions}` : ''}

Return ONLY a valid JSON object matching the schema provided. No additional text.`;
    },
    
    // Get JSON schema based on question type
    getTestSchema: function(questionType, questionCount) {
        const baseSchema = {
            type: "object",
            properties: {
                title: { type: "string", description: "A title for this test" },
                questions: {
                    type: "array",
                    items: {},
                    minItems: questionCount,
                    maxItems: questionCount
                }
            },
            required: ["title", "questions"]
        };
        
        switch (questionType) {
            case 'single':
                baseSchema.properties.questions.items = {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        question: { type: "string" },
                        options: {
                            type: "array",
                            items: { type: "string" },
                            minItems: 4,
                            maxItems: 4
                        },
                        correctIndex: { type: "integer", minimum: 0, maximum: 3 }
                    },
                    required: ["id", "question", "options", "correctIndex"]
                };
                break;
                
            case 'multiple':
                baseSchema.properties.questions.items = {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        question: { type: "string" },
                        options: {
                            type: "array",
                            items: { type: "string" },
                            minItems: 4,
                            maxItems: 5
                        },
                        correctIndices: {
                            type: "array",
                            items: { type: "integer" },
                            minItems: 1
                        }
                    },
                    required: ["id", "question", "options", "correctIndices"]
                };
                break;
                
            case 'open':
                baseSchema.properties.questions.items = {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        question: { type: "string" },
                        expectedPoints: {
                            type: "array",
                            items: { type: "string" },
                            description: "Key points that should be mentioned in a good answer"
                        }
                    },
                    required: ["id", "question", "expectedPoints"]
                };
                break;
                
            case 'true-false':
                baseSchema.properties.questions.items = {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        statement: { type: "string" },
                        isTrue: { type: "boolean" },
                        explanation: { type: "string" }
                    },
                    required: ["id", "statement", "isTrue", "explanation"]
                };
                break;
                
            case 'fill-blank':
                baseSchema.properties.questions.items = {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        sentence: { type: "string", description: "The sentence with _____ marking the blank" },
                        correctAnswer: { type: "string" },
                        acceptableVariations: {
                            type: "array",
                            items: { type: "string" },
                            description: "Other acceptable answers"
                        }
                    },
                    required: ["id", "sentence", "correctAnswer"]
                };
                break;
        }
        
        return baseSchema;
    },
    
    // Generate the test via LLM
    generateTest: async function() {
        const selectedCheckboxes = document.querySelectorAll('#module-selector input:checked');
        const questionType = document.querySelector('input[name="question-type"]:checked')?.value || 'single';
        const questionCount = parseInt(document.getElementById('question-count')?.value) || 5;
        const extraInstructions = document.getElementById('extra-instructions')?.value || '';
        
        // Validate
        if (selectedCheckboxes.length === 0) {
            this.showStatus('generate-status', 'Please select at least one module', 'error');
            return;
        }
        
        if (questionCount < 1 || questionCount > 30) {
            this.showStatus('generate-status', 'Please enter between 1 and 30 questions', 'error');
            return;
        }
        
        // Get selected module numbers
        const selectedModuleNumbers = Array.from(selectedCheckboxes).map(cb => parseInt(cb.value));
        
        // Get module content
        const modules = this.getTestableModules().filter(m => selectedModuleNumbers.includes(m.number));
        
        // Build content context
        let contentContext = '\n\n--- MODULE CONTENT FOR TEST GENERATION ---\n';
        modules.forEach(m => {
            const content = this.extractModuleContent(m);
            contentContext += `\n[MODULE ${m.number}: ${m.title}]\n${content}\n`;
        });
        contentContext += '\n--- END MODULE CONTENT ---\n';
        
        // Show loading state
        this.showStatus('generate-status', 'Generating test... This may take a moment.', 'loading');
        document.getElementById('generate-test-btn').disabled = true;
        
        try {
            const systemPrompt = this.buildGenerationPrompt(modules, questionType, questionCount, extraInstructions);
            const schema = this.getTestSchema(questionType, questionCount);
            
            const messages = [
                { role: 'system', content: systemPrompt },
                {
                    role: 'user',
                    content: `${contentContext}\n\nGenerate a ${questionType} test with ${questionCount} questions based on the module content above.\n\nJSON Schema to follow:\n${JSON.stringify(schema, null, 2)}`
                }
            ];
            
            const response = await fetch(`${ChatHelper.config.apiUrl}/v1/chat/completions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: ChatHelper.config.model,
                    messages: messages,
                    max_tokens: 8192,
                    temperature: 0.7
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API error response:', errorText);
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            let content = data.choices?.[0]?.message?.content;
            
            // Filter reasoning blocks if present
            content = this.filterReasoning(content);
            
            // Extract JSON from the response
            content = this.extractJSON(content);
            
            if (!content) {
                throw new Error('No response content received');
            }
            
            // Parse the JSON response
            const testData = JSON.parse(content);
            
            // Store test state
            this.state.currentTest = {
                ...testData,
                questionType: questionType,
                moduleNumbers: selectedModuleNumbers,
                moduleContent: contentContext // Save for grading if needed
            };
            this.state.testAnswers = {};
            
            // Render the test
            this.renderTest(testData, questionType);
            this.showStatus('generate-status', '', 'success');
            
        } catch (error) {
            console.error('Test generation error:', error);
            this.showStatus('generate-status', `Error generating test: ${error.message}. Make sure your LLM is running.`, 'error');
        } finally {
            document.getElementById('generate-test-btn').disabled = false;
        }
    },
    
    // Render the generated test
    renderTest: function(testData, questionType) {
        const testArea = document.getElementById('test-area');
        const questionsContainer = document.getElementById('test-questions');
        const testTitle = document.getElementById('test-title');
        const testInfo = document.getElementById('test-info');
        
        testTitle.textContent = testData.title || 'Knowledge Test';
        testInfo.innerHTML = `<span class="test-info-item">${testData.questions.length} questions</span>
                              <span class="test-info-item">${this.getQuestionTypeName(questionType)}</span>`;
        
        // Hide results if showing
        document.getElementById('results-area').style.display = 'none';
        
        // Render questions based on type
        questionsContainer.innerHTML = testData.questions.map((q, idx) => {
            return this.renderQuestion(q, idx, questionType);
        }).join('');
        
        // Setup event listeners for answers
        this.setupAnswerListeners(questionType);
        
        // Show test area
        testArea.style.display = 'block';
        testArea.scrollIntoView({ behavior: 'smooth' });
    },
    
    // Render a single question based on type
    renderQuestion: function(q, idx, questionType) {
        const questionNum = idx + 1;
        
        switch (questionType) {
            case 'single':
                return `
                    <div class="test-question-card" data-question-id="${q.id}">
                        <div class="question-header">
                            <span class="question-number">Q${questionNum}</span>
                            <span class="question-text">${this.renderKaTeX(q.question)}</span>
                        </div>
                        <div class="question-options single-choice">
                            ${q.options.map((opt, i) => `
                                <label class="option-item">
                                    <input type="radio" name="question-${q.id}" value="${i}">
                                    <span class="option-marker"></span>
                                    <span class="option-text">${this.renderKaTeX(opt)}</span>
                                </label>
                            `).join('')}
                        </div>
                        <div class="question-feedback" id="feedback-${q.id}" style="display: none;"></div>
                    </div>
                `;
                
            case 'multiple':
                return `
                    <div class="test-question-card" data-question-id="${q.id}">
                        <div class="question-header">
                            <span class="question-number">Q${questionNum}</span>
                            <span class="question-text">${this.renderKaTeX(q.question)}</span>
                            <span class="question-hint">(Select all that apply)</span>
                        </div>
                        <div class="question-options multiple-choice">
                            ${q.options.map((opt, i) => `
                                <label class="option-item">
                                    <input type="checkbox" name="question-${q.id}" value="${i}">
                                    <span class="option-marker checkbox"></span>
                                    <span class="option-text">${this.renderKaTeX(opt)}</span>
                                </label>
                            `).join('')}
                        </div>
                        <div class="question-feedback" id="feedback-${q.id}" style="display: none;"></div>
                    </div>
                `;
                
            case 'open':
                return `
                    <div class="test-question-card" data-question-id="${q.id}">
                        <div class="question-header">
                            <span class="question-number">Q${questionNum}</span>
                            <span class="question-text">${this.renderKaTeX(q.question)}</span>
                        </div>
                        <div class="question-input open-answer">
                            <textarea name="question-${q.id}" rows="4" placeholder="Type your answer here..."></textarea>
                        </div>
                        <div class="question-feedback" id="feedback-${q.id}" style="display: none;"></div>
                    </div>
                `;
                
            case 'true-false':
                return `
                    <div class="test-question-card" data-question-id="${q.id}">
                        <div class="question-header">
                            <span class="question-number">Q${questionNum}</span>
                            <span class="question-text">${this.renderKaTeX(q.statement)}</span>
                        </div>
                        <div class="question-options true-false">
                            <label class="option-item tf-option">
                                <input type="radio" name="question-${q.id}" value="true">
                                <span class="option-marker"></span>
                                <span class="option-text">True</span>
                            </label>
                            <label class="option-item tf-option">
                                <input type="radio" name="question-${q.id}" value="false">
                                <span class="option-marker"></span>
                                <span class="option-text">False</span>
                            </label>
                        </div>
                        <div class="question-feedback" id="feedback-${q.id}" style="display: none;"></div>
                    </div>
                `;
                
            case 'fill-blank':
                return `
                    <div class="test-question-card" data-question-id="${q.id}">
                        <div class="question-header">
                            <span class="question-number">Q${questionNum}</span>
                            <span class="question-text">${this.renderKaTeX(q.sentence).replace(/_____/g, '<span class="blank-marker">_____</span>')}</span>
                        </div>
                        <div class="question-input fill-blank">
                            <input type="text" name="question-${q.id}" placeholder="Fill in the blank...">
                        </div>
                        <div class="question-feedback" id="feedback-${q.id}" style="display: none;"></div>
                    </div>
                `;
        }
    },
    
    // Setup listeners to track answers
    setupAnswerListeners: function(questionType) {
        const questionsContainer = document.getElementById('test-questions');
        
        if (questionType === 'single' || questionType === 'true-false') {
            questionsContainer.querySelectorAll('input[type="radio"]').forEach(input => {
                input.addEventListener('change', (e) => {
                    const qId = e.target.name.replace('question-', '');
                    this.state.testAnswers[qId] = e.target.value;
                });
            });
        } else if (questionType === 'multiple') {
            questionsContainer.querySelectorAll('.test-question-card').forEach(card => {
                const qId = card.dataset.questionId;
                card.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    cb.addEventListener('change', () => {
                        const selected = Array.from(card.querySelectorAll('input:checked')).map(c => c.value);
                        this.state.testAnswers[qId] = selected;
                    });
                });
            });
        } else if (questionType === 'open' || questionType === 'fill-blank') {
            questionsContainer.querySelectorAll('input[type="text"], textarea').forEach(input => {
                input.addEventListener('input', (e) => {
                    const qId = e.target.name.replace('question-', '');
                    this.state.testAnswers[qId] = e.target.value;
                });
            });
        }
    },
    
    // Submit test for grading
    submitTest: async function() {
        const test = this.state.currentTest;
        const answers = this.state.testAnswers;
        
        // Validate that all questions have been answered
        const unanswered = test.questions.filter(q => {
            const answer = answers[q.id];
            if (Array.isArray(answer)) return answer.length === 0;
            return answer === undefined || answer === '';
        });
        
        if (unanswered.length > 0) {
            this.showStatus('submit-status', `Please answer all questions. ${unanswered.length} unanswered.`, 'error');
            return;
        }
        
        this.showStatus('submit-status', 'Grading your test...', 'loading');
        document.getElementById('submit-test-btn').disabled = true;
        
        try {
            // For non-open questions, we can grade locally
            if (test.questionType !== 'open') {
                const results = this.gradeTestLocally(test, answers);
                this.renderResults(results);
            } else {
                // For open-ended questions, use LLM grading
                const results = await this.gradeTestWithLLM(test, answers);
                this.renderResults(results);
            }
            
            this.showStatus('submit-status', '', 'success');
            
        } catch (error) {
            console.error('Grading error:', error);
            this.showStatus('submit-status', `Error grading test: ${error.message}`, 'error');
        } finally {
            document.getElementById('submit-test-btn').disabled = false;
        }
    },
    
    // Grade test locally (for objective questions)
    gradeTestLocally: function(test, answers) {
        const results = {
            totalQuestions: test.questions.length,
            correctCount: 0,
            questionResults: []
        };
        
        test.questions.forEach(q => {
            const userAnswer = answers[q.id];
            let isCorrect = false;
            let correctAnswer = '';
            let explanation = '';
            
            switch (test.questionType) {
                case 'single':
                    isCorrect = parseInt(userAnswer) === q.correctIndex;
                    correctAnswer = q.options[q.correctIndex];
                    explanation = isCorrect 
                        ? 'Correct!' 
                        : `The correct answer was: ${correctAnswer}`;
                    break;
                    
                case 'multiple':
                    const userIndices = (userAnswer || []).map(v => parseInt(v)).sort();
                    const correctIndices = q.correctIndices.sort();
                    isCorrect = JSON.stringify(userIndices) === JSON.stringify(correctIndices);
                    correctAnswer = q.correctIndices.map(i => q.options[i]).join(', ');
                    explanation = isCorrect 
                        ? 'Correct! You selected all the right answers.'
                        : `The correct answers were: ${correctAnswer}`;
                    break;
                    
                case 'true-false':
                    const userBool = userAnswer === 'true';
                    isCorrect = userBool === q.isTrue;
                    correctAnswer = q.isTrue ? 'True' : 'False';
                    explanation = q.explanation;
                    break;
                    
                case 'fill-blank':
                    const userText = (userAnswer || '').toLowerCase().trim();
                    const acceptableAnswers = [q.correctAnswer.toLowerCase(), ...(q.acceptableVariations || []).map(v => v.toLowerCase())];
                    isCorrect = acceptableAnswers.includes(userText);
                    correctAnswer = q.correctAnswer;
                    explanation = isCorrect 
                        ? 'Correct!' 
                        : `The correct answer was: ${q.correctAnswer}`;
                    break;
            }
            
            if (isCorrect) results.correctCount++;
            
            results.questionResults.push({
                id: q.id,
                question: q.question || q.statement || q.sentence,
                userAnswer: this.formatUserAnswer(userAnswer, q, test.questionType),
                isCorrect: isCorrect,
                correctAnswer: correctAnswer,
                explanation: explanation
            });
        });
        
        results.percentage = Math.round((results.correctCount / results.totalQuestions) * 100);
        return results;
    },
    
    // Grade open-ended test with LLM
    gradeTestWithLLM: async function(test, answers) {
        const gradingPrompt = `You are an expert educator grading student answers.

For each question, evaluate the student's answer and provide:
1. A score from 0-100
2. A brief explanation of what was good or missing
3. Key points they should have mentioned

Be fair but thorough. Partial credit is appropriate when some key points are addressed.

IMPORTANT: Return ONLY a valid JSON object. No additional text, explanations, or markdown formatting outside the JSON.`;

        const questionsWithAnswers = test.questions.map(q => ({
            id: q.id,
            question: q.question,
            expectedPoints: q.expectedPoints,
            studentAnswer: answers[q.id] || '[No answer provided]'
        }));
        
        const gradingSchema = {
            type: "object",
            properties: {
                results: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "integer" },
                            score: { type: "integer", minimum: 0, maximum: 100 },
                            explanation: { type: "string" },
                            missingPoints: { type: "array", items: { type: "string" } },
                            goodPoints: { type: "array", items: { type: "string" } }
                        },
                        required: ["id", "score", "explanation"]
                    }
                }
            },
            required: ["results"]
        };
        
        const messages = [
            { role: 'system', content: gradingPrompt },
            {
                role: 'user',
                content: `Grade these open-ended questions:\n\n${JSON.stringify(questionsWithAnswers, null, 2)}\n\nReturn JSON matching this schema:\n${JSON.stringify(gradingSchema, null, 2)}`
            }
        ];
        
        const response = await fetch(`${ChatHelper.config.apiUrl}/v1/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: ChatHelper.config.model,
                messages: messages,
                max_tokens: 8192,
                temperature: 0.3
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Grading API error response:', errorText);
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        let gradingContent = data.choices?.[0]?.message?.content || '';
        
        // Filter reasoning blocks if present
        gradingContent = this.filterReasoning(gradingContent);
        
        // Extract JSON from the response
        gradingContent = this.extractJSON(gradingContent);
        
        const gradingResults = JSON.parse(gradingContent);
        
        // Format results
        const results = {
            totalQuestions: test.questions.length,
            correctCount: 0,
            questionResults: []
        };
        
        let totalScore = 0;
        
        test.questions.forEach((q, idx) => {
            const grading = gradingResults.results.find(r => r.id === q.id) || gradingResults.results[idx];
            const score = grading?.score || 0;
            totalScore += score;
            
            if (score >= 70) results.correctCount++;
            
            results.questionResults.push({
                id: q.id,
                question: q.question,
                userAnswer: answers[q.id] || '[No answer provided]',
                isCorrect: score >= 70,
                score: score,
                explanation: grading?.explanation || 'Unable to grade',
                goodPoints: grading?.goodPoints || [],
                missingPoints: grading?.missingPoints || []
            });
        });
        
        results.percentage = Math.round(totalScore / results.totalQuestions);
        return results;
    },
    
    // Render the test results
    renderResults: function(results) {
        const resultsArea = document.getElementById('results-area');
        const summaryEl = document.getElementById('results-summary');
        const detailsEl = document.getElementById('results-details');
        const testArea = document.getElementById('test-area');
        
        // Determine grade color
        let gradeClass = 'grade-poor';
        if (results.percentage >= 90) gradeClass = 'grade-excellent';
        else if (results.percentage >= 70) gradeClass = 'grade-good';
        else if (results.percentage >= 50) gradeClass = 'grade-fair';
        
        summaryEl.innerHTML = `
            <div class="results-score ${gradeClass}">
                <div class="score-percentage">${results.percentage}%</div>
                <div class="score-label">${results.correctCount} / ${results.totalQuestions} correct</div>
            </div>
            <div class="results-message">
                ${this.getResultMessage(results.percentage)}
            </div>
        `;
        
        // Render detailed results
        detailsEl.innerHTML = results.questionResults.map((r, idx) => `
            <div class="result-card ${r.isCorrect ? 'correct' : 'incorrect'}">
                <div class="result-header">
                    <span class="result-indicator">${r.isCorrect ? '✓' : '✗'}</span>
                    <span class="result-question-num">Question ${idx + 1}</span>
                    ${r.score !== undefined ? `<span class="result-score">${r.score}%</span>` : ''}
                </div>
                <div class="result-question">${this.renderKaTeX(r.question)}</div>
                <div class="result-your-answer">
                    <strong>Your answer:</strong> ${this.renderKaTeX(r.userAnswer)}
                </div>
                ${!r.isCorrect && r.correctAnswer ? `
                    <div class="result-correct-answer">
                        <strong>Correct answer:</strong> ${this.renderKaTeX(r.correctAnswer)}
                    </div>
                ` : ''}
                <div class="result-explanation">
                    <strong>Feedback:</strong> ${this.renderKaTeX(r.explanation)}
                </div>
                ${r.goodPoints && r.goodPoints.length > 0 ? `
                    <div class="result-good-points">
                        <strong>Good points mentioned:</strong>
                        <ul>${r.goodPoints.map(p => `<li>${this.renderKaTeX(p)}</li>`).join('')}</ul>
                    </div>
                ` : ''}
                ${r.missingPoints && r.missingPoints.length > 0 ? `
                    <div class="result-missing-points">
                        <strong>Could have mentioned:</strong>
                        <ul>${r.missingPoints.map(p => `<li>${this.renderKaTeX(p)}</li>`).join('')}</ul>
                    </div>
                ` : ''}
            </div>
        `).join('');
        
        // Also show feedback inline on the test questions
        results.questionResults.forEach(r => {
            const feedbackEl = document.getElementById(`feedback-${r.id}`);
            if (feedbackEl) {
                feedbackEl.className = `question-feedback ${r.isCorrect ? 'correct' : 'incorrect'}`;
                feedbackEl.innerHTML = `
                    <span class="feedback-indicator">${r.isCorrect ? '✓ Correct' : '✗ Incorrect'}</span>
                    <span class="feedback-text">${this.renderKaTeX(r.explanation)}</span>
                `;
                feedbackEl.style.display = 'block';
            }
            
            // Mark the question card
            const card = document.querySelector(`.test-question-card[data-question-id="${r.id}"]`);
            if (card) {
                card.classList.add(r.isCorrect ? 'answered-correct' : 'answered-incorrect');
            }
        });
        
        // Hide submit button, show results
        document.getElementById('test-submit-section').style.display = 'none';
        resultsArea.style.display = 'block';
        resultsArea.scrollIntoView({ behavior: 'smooth' });
        
        this.state.testResults = results;
    },
    
    // Get a message based on score
    getResultMessage: function(percentage) {
        if (percentage >= 90) return '🎉 Excellent! Outstanding understanding of the material!';
        if (percentage >= 80) return '👏 Great job! You have a solid grasp of the concepts.';
        if (percentage >= 70) return '👍 Good work! You understand the fundamentals.';
        if (percentage >= 50) return '📚 Fair attempt. Review the modules for better understanding.';
        return '💪 Keep studying! The modules have the information you need.';
    },
    
    // Reset to configuration view
    resetToConfig: function() {
        document.getElementById('test-area').style.display = 'none';
        document.getElementById('results-area').style.display = 'none';
        document.getElementById('test-submit-section').style.display = 'block';
        
        // Reset state
        this.state.currentTest = null;
        this.state.testAnswers = {};
        this.state.testResults = null;
        
        // Scroll to top
        document.querySelector('.module-section').scrollIntoView({ behavior: 'smooth' });
    },
    
    // Show status message
    showStatus: function(elementId, message, type) {
        const el = document.getElementById(elementId);
        if (!el) return;
        
        if (!message) {
            el.innerHTML = '';
            el.className = 'generate-status';
            return;
        }
        
        el.className = `generate-status status-${type}`;
        el.innerHTML = type === 'loading' 
            ? `<span class="status-spinner"></span> ${message}`
            : message;
    },
    
    // Get human-readable question type name
    getQuestionTypeName: function(type) {
        const names = {
            'single': 'Single Choice',
            'multiple': 'Multiple Choice',
            'open': 'Open Answer',
            'true-false': 'True/False',
            'fill-blank': 'Fill in the Blank'
        };
        return names[type] || type;
    },
    
    // Format user answer for display
    formatUserAnswer: function(answer, question, questionType) {
        if (!answer) return '[No answer]';
        
        switch (questionType) {
            case 'single':
                return question.options[parseInt(answer)] || answer;
            case 'multiple':
                if (Array.isArray(answer)) {
                    return answer.map(i => question.options[parseInt(i)]).join(', ');
                }
                return answer;
            case 'true-false':
                return answer === 'true' ? 'True' : 'False';
            default:
                return answer;
        }
    },
    
    // Escape HTML to prevent XSS
    escapeHtml: function(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Render text with KaTeX support for math expressions
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
        
        return result;
    },
    
    // Filter out reasoning content from model output (like ChatHelper)
    filterReasoning: function(content) {
        if (!content) return '';
        
        let filtered = content;
        
        // Handle <think>...</think> tags (common in reasoning models)
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
        
        return filtered;
    },
    
    // Extract JSON from response text (handles extra text around JSON)
    extractJSON: function(text) {
        if (!text) return '{}';
        
        // Remove markdown code block wrappers
        let cleaned = text.replace(/```(?:json)?\s*/g, '').replace(/```/g, '').trim();
        
        // Try to find JSON object in the text
        // First, try the whole thing
        let parsed = null;
        try {
            parsed = JSON.parse(cleaned);
        } catch (e) {
            // Not valid JSON as-is, try to extract it
        }
        
        // Look for JSON object pattern
        if (!parsed) {
            const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    parsed = JSON.parse(jsonMatch[0]);
                } catch (e) {
                    // Try to find properly nested JSON
                }
            }
        }
        
        // Try to find JSON starting from first { to last }
        if (!parsed) {
            const firstBrace = cleaned.indexOf('{');
            const lastBrace = cleaned.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace > firstBrace) {
                const jsonCandidate = cleaned.substring(firstBrace, lastBrace + 1);
                try {
                    parsed = JSON.parse(jsonCandidate);
                } catch (e) {
                    console.warn('Could not parse extracted JSON:', e);
                }
            }
        }
        
        if (!parsed) {
            return cleaned;
        }
        
        // Handle schema-wrapped responses where the LLM returns {"type":"object","properties":{...}}
        // The actual data is inside "properties"
        if (parsed.type === 'object' && parsed.properties && parsed.properties.title && parsed.properties.questions) {
            return JSON.stringify(parsed.properties);
        }
        
        return JSON.stringify(parsed);
    }
});
