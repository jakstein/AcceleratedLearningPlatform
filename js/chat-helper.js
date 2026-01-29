// ===========================================
// AI Chat Helper for Accelerated Learning Platform
// Integrates with LM Studio (OpenAI-compatible API)
// ===========================================
// CUSTOMIZE: Update the systemPrompt below to match
// your subject matter expertise.
// ===========================================

const ChatHelper = {
    // Configuration
    // CUSTOMIZE: Adjust API settings for your LM Studio setup
    config: {
        apiUrl: 'http://127.0.0.1:1234',
        model: 'glm-4.7-flash',      // CUSTOMIZE: Change to your preferred model
        maxTokens: 8096,
        temperature: 0.7,
        frequency_penalty: 0,
        top_p: 0.95,
        top_k: 50,
        min_p: 0.01 // Kinda need to change these too depending on the model, esp the frequency penalty
        // Important when using LMStudio, remember to enable CORS or this won't work.
    },

    // Chat state
    state: {
        isOpen: false,
        messages: [],
        isLoading: false,
        abortController: null,
        responseLength: 'auto' // 'short', 'medium', 'long', 'auto'
    },

    // ===========================================
    // CUSTOMIZE: Replace this system prompt with
    // instructions specific to your subject matter
    // ===========================================
    systemPrompt: `You are an expert AI tutor for [Your Subject], helping learners understand key concepts and practical applications.

Your role:
- Explain complex concepts in clear, practical terms
- Use relevant examples when helpful
- Break down difficult topics step by step
- Connect theory to real-world applications

When the user highlights specific text from the learning module, they want you to:
1. Explain that specific concept in more detail
2. Provide additional examples or analogies
3. Connect it to broader principles
4. Suggest practical applications

Keep responses focused and helpful. Use code examples when relevant. For math, explain the intuition before the formulas.`,

    // Initialize the chat helper
    init: function() {
        this.createChatUI();
        this.setupEventListeners();
        this.loadChatHistory();
    },

    // Create the chat interface
    createChatUI: function() {
        const sidebar = document.getElementById('sidebar');
        
        // Create chat toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'chat-toggle-btn';
        toggleBtn.className = 'chat-toggle-btn';
        toggleBtn.innerHTML = '💬 AI Helper';
        toggleBtn.title = 'Open AI Learning Assistant';
        
        // Insert after sidebar header
        const sidebarHeader = sidebar.querySelector('.sidebar-header');
        sidebarHeader.appendChild(toggleBtn);
        
        // Create chat container
        const chatContainer = document.createElement('div');
        chatContainer.id = 'chat-container';
        chatContainer.className = 'chat-container';
        chatContainer.innerHTML = `
            <div class="chat-header">
                <span class="chat-title">🤖 AI Learning Helper</span>
                <div class="chat-header-actions">
                    <select id="response-length-select" class="response-length-select" title="Response Length">
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="long">Long</option>
                        <option value="auto" selected>Auto</option>
                    </select>
                    <button id="new-chat-btn" class="chat-action-btn" title="New Chat">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                    </button>
                    <button id="close-chat-btn" class="chat-action-btn" title="Close Chat">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="chat-messages" id="chat-messages">
                <div class="chat-welcome">
                    <div class="welcome-icon">🎓</div>
                    <h4>AI Learning Assistant</h4>
                    <p>Ask questions about the current module or highlight text to get explanations.</p>
                    <div class="quick-prompts">
                        <button class="quick-prompt" data-prompt="Explain the main concepts of this module">Explain this module</button>
                        <button class="quick-prompt" data-prompt="Give me a practical example">Practical example</button>
                        <button class="quick-prompt" data-prompt="What are common mistakes to avoid?">Common mistakes</button>
                    </div>
                </div>
            </div>
            <div class="chat-input-area">
                <div class="selected-text-preview" id="selected-text-preview" style="display: none;">
                    <span class="preview-label">Selected:</span>
                    <span class="preview-text" id="preview-text"></span>
                    <button id="clear-selection-btn" class="clear-selection-btn" title="Clear selection">×</button>
                </div>
                <div class="chat-input-wrapper">
                    <textarea 
                        id="chat-input" 
                        class="chat-input" 
                        placeholder="Ask about this topic..."
                        rows="1"
                    ></textarea>
                    <button id="send-btn" class="send-btn" title="Send message">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                        </svg>
                    </button>
                </div>
                <div class="chat-status" id="chat-status"></div>
            </div>
        `;
        
        // Insert after header
        sidebarHeader.insertAdjacentElement('afterend', chatContainer);
    },

    // Setup event listeners
    setupEventListeners: function() {
        // Toggle chat
        document.getElementById('chat-toggle-btn').addEventListener('click', () => {
            this.toggleChat();
        });

        // Close chat
        document.getElementById('close-chat-btn').addEventListener('click', () => {
            this.closeChat();
        });

        // New chat
        document.getElementById('new-chat-btn').addEventListener('click', () => {
            this.startNewChat();
        });

        // Response length selector
        document.getElementById('response-length-select').addEventListener('change', (e) => {
            this.state.responseLength = e.target.value;
            this.saveResponseLength();
        });

        // Load saved response length preference
        this.loadResponseLength();

        // Send message
        document.getElementById('send-btn').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter to send (Shift+Enter for newline)
        document.getElementById('chat-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        document.getElementById('chat-input').addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
        });

        // Quick prompts
        document.querySelectorAll('.quick-prompt').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('chat-input').value = btn.dataset.prompt;
                this.sendMessage();
            });
        });

        // Clear selection
        document.getElementById('clear-selection-btn').addEventListener('click', () => {
            this.clearSelectedText();
        });

        // Track text selection in module content
        document.addEventListener('mouseup', () => {
            this.captureSelection();
        });

        // Keyboard shortcut to open chat
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && e.ctrlKey) {
                e.preventDefault();
                this.toggleChat();
                if (this.state.isOpen) {
                    document.getElementById('chat-input').focus();
                }
            }
        });
    },

    // Toggle chat visibility
    toggleChat: function() {
        if (this.state.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    },

    // Open chat
    openChat: function() {
        this.state.isOpen = true;
        document.getElementById('chat-container').classList.add('open');
        document.getElementById('chat-toggle-btn').classList.add('active');
        document.getElementById('chat-input').focus();
    },

    // Close chat
    closeChat: function() {
        this.state.isOpen = false;
        document.getElementById('chat-container').classList.remove('open');
        document.getElementById('chat-toggle-btn').classList.remove('active');
    },

    // Start new chat
    startNewChat: function() {
        this.state.messages = [];
        this.saveChatHistory();
        
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.innerHTML = `
            <div class="chat-welcome">
                <div class="welcome-icon">🎓</div>
                <h4>AI Learning Assistant</h4>
                <p>Ask questions about the current module or highlight text to get explanations.</p>
                <div class="quick-prompts">
                    <button class="quick-prompt" data-prompt="Explain the main concepts of this module">Explain this module</button>
                    <button class="quick-prompt" data-prompt="Give me a practical example">Practical example</button>
                    <button class="quick-prompt" data-prompt="What are common mistakes to avoid?">Common mistakes</button>
                </div>
            </div>
        `;
        
        // Re-attach quick prompt listeners
        messagesContainer.querySelectorAll('.quick-prompt').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('chat-input').value = btn.dataset.prompt;
                this.sendMessage();
            });
        });

        this.clearSelectedText();
        this.updateStatus('New chat started');
        setTimeout(() => this.updateStatus(''), 2000);
    },

    // Capture selected text from module content
    captureSelection: function() {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        if (selectedText.length > 0) {
            // Check if selection is within module content
            const moduleContent = document.getElementById('module-content');
            if (moduleContent && moduleContent.contains(selection.anchorNode)) {
                this.showSelectedText(selectedText);
            }
        }
    },

    // Show selected text preview
    showSelectedText: function(text) {
        const preview = document.getElementById('selected-text-preview');
        const previewText = document.getElementById('preview-text');
        
        // Truncate for display
        const displayText = text.length > 100 ? text.substring(0, 100) + '...' : text;
        previewText.textContent = displayText;
        previewText.dataset.fullText = text;
        preview.style.display = 'flex';
    },

    // Clear selected text
    clearSelectedText: function() {
        document.getElementById('selected-text-preview').style.display = 'none';
        document.getElementById('preview-text').textContent = '';
        document.getElementById('preview-text').dataset.fullText = '';
    },

    // Get current module context
    getModuleContext: function() {
        const currentModule = window.App?.modules?.[window.App.currentModuleIndex];
        if (!currentModule) return null;

        return {
            title: currentModule.title,
            number: currentModule.number,
            // Extract text content from the module HTML
            content: this.extractTextFromHtml(currentModule.content)
        };
    },

    // Extract text from HTML content
    extractTextFromHtml: function(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // Remove script and style elements
        temp.querySelectorAll('script, style').forEach(el => el.remove());
        
        // Get text content
        let text = temp.textContent || temp.innerText || '';
        
        // Clean up whitespace
        text = text.replace(/\s+/g, ' ').trim();
        
        // Limit length to avoid token limits
        if (text.length > 8000) {
            text = text.substring(0, 8000) + '...';
        }
        
        return text;
    },

    // Get response length instruction based on current setting
    getResponseLengthInstruction: function() {
        switch (this.state.responseLength) {
            case 'short':
                return `\n\n--- RESPONSE STYLE ---
IMPORTANT: Be extremely concise and brief. Aim for 1-3 sentences or a short bulleted list. Skip lengthy explanations, examples, and elaboration. Get straight to the point. Only provide the essential answer.\n--- END RESPONSE STYLE ---`;
            case 'medium':
                return `\n\n--- RESPONSE STYLE ---
Provide a balanced response with moderate detail. Include a brief explanation and one example if helpful. Aim for 1-2 short paragraphs. Be informative but not exhaustive.\n--- END RESPONSE STYLE ---`;
            case 'long':
                return `\n\n--- RESPONSE STYLE ---
Provide a comprehensive, detailed response. Include thorough explanations, multiple examples, related concepts, and practical applications. Feel free to elaborate and cover edge cases. Be as educational and complete as possible.\n--- END RESPONSE STYLE ---`;
            case 'auto':
            default:
                return ''; // No instruction for auto - let the model decide
        }
    },

    // Save response length preference
    saveResponseLength: function() {
        try {
            localStorage.setItem('learning-chat-response-length', this.state.responseLength);
        } catch (e) {
            // Handle storage errors gracefully
        }
    },

    // Load response length preference
    loadResponseLength: function() {
        try {
            const saved = localStorage.getItem('learning-chat-response-length');
            if (saved && ['short', 'medium', 'long', 'auto'].includes(saved)) {
                this.state.responseLength = saved;
                document.getElementById('response-length-select').value = saved;
            }
        } catch (e) {
            // Handle storage errors gracefully
        }
    },

    // Build messages for API
    buildMessages: function(userMessage, selectedText = null) {
        const messages = [];
        
        // System prompt with optional response length instruction
        let systemContent = this.systemPrompt + this.getResponseLengthInstruction();
        
        // Add module context
        const moduleContext = this.getModuleContext();
        if (moduleContext) {
            systemContent += `\n\n--- CURRENT MODULE CONTEXT ---
Module: ${moduleContext.number}. ${moduleContext.title}

Content Summary:
${moduleContext.content}
--- END MODULE CONTEXT ---`;
        }
        
        messages.push({
            role: 'system',
            content: systemContent
        });
        
        // Add chat history
        this.state.messages.forEach(msg => {
            messages.push({
                role: msg.role,
                content: msg.content
            });
        });
        
        // Add current user message with selected text context
        let finalUserMessage = userMessage;
        
        if (selectedText) {
            finalUserMessage = `${userMessage}

[SELECTED/HIGHLIGHTED TEXT FROM MODULE - Focus your explanation on THIS specific content:]
"""
${selectedText}
"""`;
        }
        
        messages.push({
            role: 'user',
            content: finalUserMessage
        });
        
        return messages;
    },

    // Send message to LLM
    sendMessage: async function() {
        const input = document.getElementById('chat-input');
        const userMessage = input.value.trim();
        
        if (!userMessage || this.state.isLoading) return;
        
        // Capture selected text BEFORE clearing
        const selectedText = document.getElementById('preview-text')?.dataset?.fullText || null;
        const hadSelection = !!selectedText;
        
        // Clear input and selection
        input.value = '';
        input.style.height = 'auto';
        this.clearSelectedText();
        
        // Add user message to UI
        this.addMessageToUI('user', userMessage, hadSelection);
        
        // Show loading
        this.state.isLoading = true;
        this.updateStatus('Thinking...');
        const assistantMsgEl = this.addMessageToUI('assistant', '', null, true);
        
        try {
            // Create abort controller for cancellation
            this.state.abortController = new AbortController();
            
            // Build messages (before adding to history to avoid duplication)
            const messages = this.buildMessages(userMessage, selectedText);
            
            // Store in history after building messages
            this.state.messages.push({
                role: 'user',
                content: userMessage
            });
            
            // Make streaming request using OpenAI-compatible endpoint
            const response = await fetch(`${this.config.apiUrl}/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.config.model,
                    messages: messages,
                    stream: true,
                    max_tokens: this.config.maxTokens,
                    temperature: this.config.temperature,
                    frequency_penalty: this.config.frequency_penalty,
                    top_p: this.config.top_p,
                    top_k: this.config.top_k,
                    min_p: this.config.min_p
                }),
                signal: this.state.abortController.signal
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            // Process SSE stream
            await this.processStream(response, assistantMsgEl);
            
        } catch (error) {
            if (error.name === 'AbortError') {
                this.updateStatus('Cancelled');
            } else {
                console.error('Chat error:', error);
                this.updateStatus('Error: Could not connect to LM Studio');
                assistantMsgEl.querySelector('.message-content').innerHTML = 
                    '<span class="error-message">Failed to get response. Make sure LM Studio is running with a model loaded at http://127.0.0.1:1234</span>';
            }
        } finally {
            this.state.isLoading = false;
            this.state.abortController = null;
            assistantMsgEl.classList.remove('loading');
            setTimeout(() => this.updateStatus(''), 3000);
        }
    },

    // Process SSE stream from LM Studio (OpenAI-compatible format)
    processStream: async function(response, messageEl) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        const contentEl = messageEl.querySelector('.message-content');
        
        let fullContent = '';
        let buffer = '';
        
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                
                // Process each SSE line
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep incomplete line in buffer
                
                for (const line of lines) {
                    const trimmedLine = line.trim();
                    
                    if (trimmedLine === '' || trimmedLine === 'data: [DONE]') {
                        continue;
                    }
                    
                    if (trimmedLine.startsWith('data:')) {
                        try {
                            const jsonStr = trimmedLine.substring(5).trim();
                            if (jsonStr === '[DONE]') continue;
                            
                            const data = JSON.parse(jsonStr);
                            
                            // Handle OpenAI-compatible format
                            if (data.choices && data.choices[0]) {
                                const choice = data.choices[0];
                                
                                // Check for content delta
                                if (choice.delta && choice.delta.content) {
                                    fullContent += choice.delta.content;
                                    // Filter out reasoning content (everything before </think>)
                                    const displayContent = this.filterReasoning(fullContent);
                                    contentEl.innerHTML = this.formatMessage(displayContent);
                                    this.scrollToBottom();
                                    
                                    // Update status based on whether we're in reasoning or response
                                    if (fullContent.includes('</think>')) {
                                        this.updateStatus('Generating...');
                                    } else if (fullContent.includes('<think>') || fullContent.match(/^[\s\S]*think>/)) {
                                        this.updateStatus('Reasoning...');
                                    } else {
                                        this.updateStatus('Generating...');
                                    }
                                }
                                
                                // Check for reasoning content (some models include this separately)
                                if (choice.delta && choice.delta.reasoning_content) {
                                    this.updateStatus('Reasoning...');
                                }
                            }
                        } catch (e) {
                            // Skip invalid JSON lines
                        }
                    }
                }
            }
            
            // Store assistant response (filtered, without reasoning)
            if (fullContent) {
                const cleanContent = this.filterReasoning(fullContent);
                this.state.messages.push({
                    role: 'assistant',
                    content: cleanContent
                });
                this.saveChatHistory();
                this.updateStatus('Done');
            }
            
        } catch (error) {
            throw error;
        }
    },

    // Filter out reasoning content from model output
    filterReasoning: function(content) {
        // Handle <think>...</think> tags (common in reasoning models). If your model uses different tags, adjust accordingly.
        // Remove everything from start or <think> up to and including </think>
        let filtered = content;
        
        // If there's a </think> tag, only show content after it
        const thinkEndIndex = filtered.lastIndexOf('</think>');
        if (thinkEndIndex !== -1) {
            filtered = filtered.substring(thinkEndIndex + 8).trim();
        } else if (filtered.includes('<think>')) {
            // Still in reasoning phase, show placeholder
            return '';
        }
        
        // Also handle models that output "...think>" at the start (partial tag)
        if (filtered.match(/^[\s\S]*?think>\s*/)) {
            filtered = filtered.replace(/^[\s\S]*?think>\s*/, '');
        }
        
        return filtered;
    },

    // Format message content with markdown-like rendering
    formatMessage: function(content) {
        if (!content) return '';
        
        // Store math blocks ($$...$$) and inline math ($...$) temporarily
        const mathBlocks = [];
        let formatted = content.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
            mathBlocks.push({ type: 'block', content: math.trim() });
            return `%%MATHBLOCK_${mathBlocks.length - 1}%%`;
        });
        
        const mathInline = [];
        formatted = formatted.replace(/\$([^\$\n]+)\$/g, (match, math) => {
            mathInline.push(math.trim());
            return `%%MATHINLINE_${mathInline.length - 1}%%`;
        });
        
        // Store code blocks temporarily to prevent processing their content
        const codeBlocks = [];
        formatted = formatted.replace(/```(\w*)\n?([\s\S]*?)```/g, (match, lang, code) => {
            codeBlocks.push({ lang, code });
            return `%%CODEBLOCK_${codeBlocks.length - 1}%%`;
        });
        
        // Store inline code temporarily
        const inlineCodes = [];
        formatted = formatted.replace(/`([^`]+)`/g, (match, code) => {
            inlineCodes.push(code);
            return `%%INLINECODE_${inlineCodes.length - 1}%%`;
        });
        
        // Escape HTML (but not our placeholders)
        formatted = formatted
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        // Process tables
        formatted = this.formatTables(formatted);
        
        // Process headings (must be at start of line)
        formatted = formatted.replace(/^######\s+(.+)$/gm, '<h6 class="chat-heading">$1</h6>');
        formatted = formatted.replace(/^#####\s+(.+)$/gm, '<h5 class="chat-heading">$1</h5>');
        formatted = formatted.replace(/^####\s+(.+)$/gm, '<h4 class="chat-heading">$1</h4>');
        formatted = formatted.replace(/^###\s+(.+)$/gm, '<h3 class="chat-heading">$1</h3>');
        formatted = formatted.replace(/^##\s+(.+)$/gm, '<h2 class="chat-heading">$1</h2>');
        formatted = formatted.replace(/^#\s+(.+)$/gm, '<h1 class="chat-heading">$1</h1>');
        
        // Process horizontal rules
        formatted = formatted.replace(/^[-*_]{3,}\s*$/gm, '<hr class="chat-hr">');
        
        // Process unordered lists
        formatted = this.formatLists(formatted);
        
        // Bold
        formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        
        // Links [text](url)
        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        
        // Line breaks (but not within processed block elements)
        formatted = formatted.replace(/\n/g, '<br>');
        
        // Clean up extra <br> around block elements
        formatted = formatted.replace(/<br>\s*(<h[1-6]|<table|<ul|<ol|<hr)/g, '$1');
        formatted = formatted.replace(/(<\/h[1-6]>|<\/table>|<\/ul>|<\/ol>|<hr[^>]*>)\s*<br>/g, '$1');
        
        // Restore code blocks
        codeBlocks.forEach((block, i) => {
            const escapedCode = block.code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            const langClass = block.lang ? ` data-lang="${block.lang}"` : '';
            formatted = formatted.replace(
                `%%CODEBLOCK_${i}%%`,
                `<pre class="code-block"${langClass}><code>${escapedCode}</code></pre>`
            );
        });
        
        // Restore inline code
        inlineCodes.forEach((code, i) => {
            const escapedCode = code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            formatted = formatted.replace(
                `%%INLINECODE_${i}%%`,
                `<code class="inline-code">${escapedCode}</code>`
            );
        });
        
        // Restore math blocks (KaTeX rendering)
        mathBlocks.forEach((math, i) => {
            try {
                const rendered = window.katex && window.katex.renderToString 
                    ? window.katex.renderToString(math.content, {
                        displayMode: true,
                        throwOnError: false,
                        strict: false
                    })
                    : `<div class="math-block">$$${math.content}$$</div>`;
                formatted = formatted.replace(
                    `%%MATHBLOCK_${i}%%`,
                    `<div class="katex-display">${rendered}</div>`
                );
            } catch (e) {
                // Fallback if KaTeX fails
                formatted = formatted.replace(
                    `%%MATHBLOCK_${i}%%`,
                    `<div class="math-block">$$${math.content}$$</div>`
                );
            }
        });
        
        // Restore inline math (KaTeX rendering)
        mathInline.forEach((math, i) => {
            try {
                const rendered = window.katex && window.katex.renderToString
                    ? window.katex.renderToString(math, {
                        displayMode: false,
                        throwOnError: false,
                        strict: false
                    })
                    : `$${math}$`;
                formatted = formatted.replace(
                    `%%MATHINLINE_${i}%%`,
                    `<span class="katex-inline">${rendered}</span>`
                );
            } catch (e) {
                // Fallback if KaTeX fails
                formatted = formatted.replace(
                    `%%MATHINLINE_${i}%%`,
                    `<span class="math-inline">$${math}$</span>`
                );
            }
        });
        
        return formatted;
    },

    // Format markdown tables
    formatTables: function(content) {
        const lines = content.split('\n');
        let result = [];
        let inTable = false;
        let tableRows = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check if this line looks like a table row (starts and ends with |, or has | separators)
            const isTableRow = line.includes('|') && 
                              (line.match(/\|/g) || []).length >= 2;
            
            // Check if this is a separator row (contains only |, -, :, and spaces)
            const isSeparatorRow = /^[\|\-:\s]+$/.test(line) && line.includes('-');
            
            if (isTableRow) {
                if (!inTable) {
                    inTable = true;
                    tableRows = [];
                }
                tableRows.push({ line, isSeparator: isSeparatorRow });
            } else {
                if (inTable && tableRows.length > 0) {
                    // Process the table
                    result.push(this.buildTable(tableRows));
                    tableRows = [];
                    inTable = false;
                }
                result.push(lines[i]);
            }
        }
        
        // Handle table at end of content
        if (inTable && tableRows.length > 0) {
            result.push(this.buildTable(tableRows));
        }
        
        return result.join('\n');
    },

    // Build HTML table from parsed rows
    buildTable: function(rows) {
        if (rows.length === 0) return '';
        
        let html = '<table class="chat-table">';
        let headerDone = false;
        
        for (let i = 0; i < rows.length; i++) {
            const { line, isSeparator } = rows[i];
            
            // Skip separator rows (they just indicate header/body split)
            if (isSeparator) {
                headerDone = true;
                continue;
            }
            
            // Parse cells from the row
            let cells = line.split('|')
                .map(cell => cell.trim())
                .filter((cell, idx, arr) => {
                    // Remove empty cells at start/end caused by leading/trailing |
                    if (idx === 0 && cell === '') return false;
                    if (idx === arr.length - 1 && cell === '') return false;
                    return true;
                });
            
            // Determine if this is a header row (first row before separator)
            const isHeader = !headerDone && i === 0 && rows.length > 1 && rows[1]?.isSeparator;
            
            if (isHeader) {
                html += '<thead><tr>';
                cells.forEach(cell => {
                    html += `<th>${cell}</th>`;
                });
                html += '</tr></thead><tbody>';
            } else {
                if (!headerDone && i === 0) {
                    // No separator found, treat all as body
                    html += '<tbody>';
                }
                html += '<tr>';
                cells.forEach(cell => {
                    html += `<td>${cell}</td>`;
                });
                html += '</tr>';
            }
        }
        
        html += '</tbody></table>';
        return html;
    },

    // Format unordered and ordered lists
    formatLists: function(content) {
        const lines = content.split('\n');
        let result = [];
        let inUnorderedList = false;
        let inOrderedList = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            
            // Check for unordered list item (-, *, +)
            const unorderedMatch = trimmedLine.match(/^[-*+]\s+(.+)$/);
            // Check for ordered list item (1., 2., etc.)
            const orderedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
            
            if (unorderedMatch) {
                if (!inUnorderedList) {
                    if (inOrderedList) {
                        result.push('</ol>');
                        inOrderedList = false;
                    }
                    result.push('<ul class="chat-list">');
                    inUnorderedList = true;
                }
                result.push(`<li>${unorderedMatch[1]}</li>`);
            } else if (orderedMatch) {
                if (!inOrderedList) {
                    if (inUnorderedList) {
                        result.push('</ul>');
                        inUnorderedList = false;
                    }
                    result.push('<ol class="chat-list">');
                    inOrderedList = true;
                }
                result.push(`<li>${orderedMatch[2]}</li>`);
            } else {
                // Close any open lists
                if (inUnorderedList) {
                    result.push('</ul>');
                    inUnorderedList = false;
                }
                if (inOrderedList) {
                    result.push('</ol>');
                    inOrderedList = false;
                }
                result.push(line);
            }
        }
        
        // Close any remaining open lists
        if (inUnorderedList) result.push('</ul>');
        if (inOrderedList) result.push('</ol>');
        
        return result.join('\n');
    },

    // Add message to UI
    addMessageToUI: function(role, content, hadSelection = null, isLoading = false) {
        const messagesContainer = document.getElementById('chat-messages');
        
        // Remove welcome message if present
        const welcome = messagesContainer.querySelector('.chat-welcome');
        if (welcome) welcome.remove();
        
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${role} ${isLoading ? 'loading' : ''}`;
        
        let selectedIndicator = '';
        if (hadSelection && role === 'user') {
            selectedIndicator = '<div class="selection-indicator">📌 Asked about highlighted text</div>';
        }
        
        messageEl.innerHTML = `
            <div class="message-avatar">${role === 'user' ? '👤' : '🤖'}</div>
            <div class="message-body">
                ${selectedIndicator}
                <div class="message-content">${isLoading ? '<span class="typing-indicator"><span></span><span></span><span></span></span>' : this.formatMessage(content)}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
        
        return messageEl;
    },

    // Scroll chat to bottom
    scrollToBottom: function() {
        const container = document.getElementById('chat-messages');
        container.scrollTop = container.scrollHeight;
    },

    // Update status message
    updateStatus: function(message) {
        document.getElementById('chat-status').textContent = message;
    },

    // Save chat history to localStorage
    saveChatHistory: function() {
        try {
            localStorage.setItem('learning-chat-history', JSON.stringify(this.state.messages));
        } catch (e) {
            // Handle storage errors gracefully
        }
    },

    // Load chat history from localStorage
    loadChatHistory: function() {
        try {
            const saved = localStorage.getItem('learning-chat-history');
            if (saved) {
                this.state.messages = JSON.parse(saved);
                // Restore messages to UI
                this.state.messages.forEach(msg => {
                    this.addMessageToUI(msg.role, msg.content);
                });
            }
        } catch (e) {
            // Handle storage errors gracefully
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ChatHelper.init();
});

// Make ChatHelper available globally
window.ChatHelper = ChatHelper;
