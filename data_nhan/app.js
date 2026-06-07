/* =============================================================
   CHATBOT CẨM NANG KHO HÀNG - RAG FRONTEND (app.js)
   ============================================================= */

(function () {
    'use strict';

    // ─── DOM References ──────────────────────────────────────
    const loadingScreen  = document.getElementById('loading-screen');
    const appContainer   = document.getElementById('app');
    const chatMessages   = document.getElementById('chat-messages');
    const suggestionsArea = document.getElementById('suggestions-area');
    const messageInput   = document.getElementById('message-input');
    const sendBtn        = document.getElementById('send-btn');
    const botNameEl      = document.getElementById('bot-name');
    const botAvatarEl    = document.getElementById('bot-avatar');
    
    const botModeBadge       = document.getElementById('bot-mode-badge');

    // Cẩm Nang Số Panel & RAG elements
    const kbToggleBtn    = document.getElementById('kb-toggle-btn');
    const closeKbBtn     = document.getElementById('close-kb-btn');
    const kbWorkspace    = document.getElementById('kb-workspace');
    const dragDropZone   = document.getElementById('drag-drop-zone');
    const fileUploader   = document.getElementById('file-uploader');
    const docsList       = document.getElementById('docs-list');
    const uploadStatus   = document.getElementById('upload-status');

    // Tự động chuyển hướng API về port 5000 nếu trang được tải từ port khác (như Live Server 5500)
    const API_BASE = (window.location.port && window.location.port !== '5000') 
        ? `${window.location.protocol}//${window.location.hostname}:5000` 
        : '';
    let botName = 'Tùng';
    let isProcessing = false;
    
    let lastTopicId = null;

    // ─── Init ────────────────────────────────────────────────
    async function initialize() {
        try {
            updateModeBadge();

            // Load bot init metadata
            const res = await fetch(`${API_BASE}/api/init`);
            if (!res.ok) throw new Error('Init API failed');
            const data = await res.json();

            botName = data.bot_name || 'Tùng';
            botNameEl.textContent = botName;
            botAvatarEl.textContent = botName.charAt(0).toUpperCase();

            // Show app, hide loading
            appContainer.classList.remove('hidden');
            loadingScreen.classList.add('fade-out');
            setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);

            // Show greeting message
            if (data.greeting) {
                addBotMessage(data.greeting);
            }

            // Show initial suggestions
            if (data.suggestions && data.suggestions.length > 0) {
                renderSuggestions(data.suggestions);
            }

            // Load digitized manuals list
            loadDocumentsList();

            messageInput.focus();

        } catch (err) {
            console.error('Init error:', err);
            loadingScreen.querySelector('.loading-text').textContent =
                'Lỗi kết nối server. Hãy chạy python server.py trước.';
            loadingScreen.querySelector('.loading-spinner').style.borderTopColor = '#ef4444';
        }
    }

    function updateModeBadge() {
        botModeBadge.textContent = 'AI Local - RAG';
        botModeBadge.classList.add('rag-mode');
    }

    // ─── Message Rendering ───────────────────────────────────
    function formatMessageText(text) {
        if (!text) return '';

        const lines = text.split('\n');
        let html = '';
        let insideList = null; // can be 'ul', 'ol', or null

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            let escapedLine = escapeHtml(line);

            // Parse Bold & Italic
            escapedLine = escapedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            escapedLine = escapedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
            escapedLine = escapedLine.replace(/_(.*?)_/g, '<em>$1</em>');

            // Check for headings
            if (escapedLine.startsWith('### ')) {
                if (insideList) {
                    html += `</${insideList}>`;
                    insideList = null;
                }
                html += `<h3>${escapedLine.substring(4)}</h3>`;
                continue;
            }
            if (escapedLine.startsWith('## ')) {
                if (insideList) {
                    html += `</${insideList}>`;
                    insideList = null;
                }
                html += `<h2>${escapedLine.substring(3)}</h2>`;
                continue;
            }
            if (escapedLine.startsWith('# ')) {
                if (insideList) {
                    html += `</${insideList}>`;
                    insideList = null;
                }
                html += `<h1>${escapedLine.substring(2)}</h1>`;
                continue;
            }

            // Check for lists
            const olMatch = escapedLine.match(/^(\d+)\.\s+(.*)$/);
            const ulMatch = escapedLine.match(/^([-\*•])\s+(.*)$/);

            if (olMatch) {
                if (insideList !== 'ol') {
                    if (insideList) html += `</${insideList}>`;
                    html += '<ol>';
                    insideList = 'ol';
                }
                html += `<li>${olMatch[2]}</li>`;
            } else if (ulMatch) {
                if (insideList !== 'ul') {
                    if (insideList) html += `</${insideList}>`;
                    html += '<ul>';
                    insideList = 'ul';
                }
                html += `<li>${ulMatch[2]}</li>`;
            } else {
                if (insideList) {
                    html += `</${insideList}>`;
                    insideList = null;
                }

                if (escapedLine.trim() === '') {
                    continue;
                }

                // Gather consecutive normal lines
                let paragraphLines = [escapedLine];
                while (i + 1 < lines.length && 
                       lines[i + 1].trim() !== '' && 
                       !lines[i + 1].startsWith('#') && 
                       !lines[i + 1].match(/^\d+\.\s+/) && 
                       !lines[i + 1].match(/^([-\*•])\s+/)) {
                    i++;
                    let nextLineEscaped = escapeHtml(lines[i]);
                    nextLineEscaped = nextLineEscaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    nextLineEscaped = nextLineEscaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
                    nextLineEscaped = nextLineEscaped.replace(/_(.*?)_/g, '<em>$1</em>');
                    paragraphLines.push(nextLineEscaped);
                }
                html += `<p>${paragraphLines.join('<br>')}</p>`;
            }
        }

        if (insideList) {
            html += `</${insideList}>`;
        }

        return html;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function getTimeString() {
        const now = new Date();
        return now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }

    function addBotMessage(text, topicTitle) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message bot';

        let badgeHtml = '';
        if (topicTitle) {
            badgeHtml = `<div class="topic-badge">${escapeHtml(topicTitle)}</div>`;
        }

        msgDiv.innerHTML = `
            <div class="message-avatar">${botName.charAt(0).toUpperCase()}</div>
            <div>
                <div class="message-content">
                    ${badgeHtml}
                    ${formatMessageText(text)}
                </div>
                <div class="message-time">${getTimeString()}</div>
            </div>
        `;

        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user';

        msgDiv.innerHTML = `
            <div class="message-avatar">U</div>
            <div>
                <div class="message-content">
                    ${formatMessageText(text)}
                </div>
                <div class="message-time">${getTimeString()}</div>
            </div>
        `;

        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    // ─── Typing Indicator ────────────────────────────────────
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = 'typing-indicator';

        indicator.innerHTML = `
            <div class="message-avatar">${botName.charAt(0).toUpperCase()}</div>
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;

        chatMessages.appendChild(indicator);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // ─── Suggestions ─────────────────────────────────────────
    function renderSuggestions(suggestions) {
        suggestionsArea.innerHTML = '';

        if (!suggestions || suggestions.length === 0) return;

        suggestions.forEach(text => {
            const chip = document.createElement('button');
            chip.className = 'suggestion-chip';
            chip.textContent = text;
            chip.addEventListener('click', () => {
                sendMessage(text);
            });
            suggestionsArea.appendChild(chip);
        });
    }

    function clearSuggestions() {
        suggestionsArea.innerHTML = '';
    }

    // ─── Send Message ────────────────────────────────────────
    async function sendMessage(text) {
        if (isProcessing || !text.trim()) return;

        const userText = text.trim();
        isProcessing = true;
        sendBtn.disabled = true;
        messageInput.value = '';
        autoResizeTextarea();

        addUserMessage(userText);
        clearSuggestions();
        showTypingIndicator();

        try {
            const thinkDelay = 200 + Math.random() * 300;
            await new Promise(r => setTimeout(r, thinkDelay));

            const res = await fetch(`${API_BASE}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: userText,
                    detail_level: 'detailed',
                    last_topic_id: lastTopicId
                })
            });

            if (!res.ok) throw new Error('Chat API error');
            const data = await res.json();

            removeTypingIndicator();

            if (data.success && data.response) {
                addBotMessage(data.response, data.topic_title);

                if (data.topic_id) {
                    lastTopicId = data.topic_id;
                }

                if (data.suggestions && data.suggestions.length > 0) {
                    renderSuggestions(data.suggestions);
                }


            } else {
                addBotMessage('Hmm tớ gặp lỗi rồi. Cậu thử hỏi lại nhé.');
            }

        } catch (err) {
            console.error('Chat error:', err);
            removeTypingIndicator();
            addBotMessage('Tớ không kết nối được server. Kiểm tra lại server.py đang chạy không nhé.');
        }

        isProcessing = false;
        updateSendButton();
        messageInput.focus();
    }

    // ─── Scroll ──────────────────────────────────────────────
    function scrollToBottom() {
        requestAnimationFrame(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }

    // ─── Input Handling ──────────────────────────────────────
    function autoResizeTextarea() {
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 100) + 'px';
    }

    function updateSendButton() {
        sendBtn.disabled = isProcessing || !messageInput.value.trim();
    }

    messageInput.addEventListener('input', () => {
        autoResizeTextarea();
        updateSendButton();
    });

    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendBtn.disabled) {
                sendMessage(messageInput.value);
            }
        }
    });

    sendBtn.addEventListener('click', () => {
        sendMessage(messageInput.value);
    });

    // ─── Cẩm Nang Số Panel Toggles ───────────────────────────
    kbToggleBtn.addEventListener('click', () => {
        kbWorkspace.classList.toggle('open');
    });

    closeKbBtn.addEventListener('click', () => {
        kbWorkspace.classList.remove('open');
    });

    // ─── Knowledge Base Document Manager ─────────────────────
    async function loadDocumentsList() {
        try {
            const res = await fetch(`${API_BASE}/api/list_docs`);
            if (!res.ok) throw new Error('Failed to fetch documents list');
            const data = await res.json();
            
            if (data.success) {
                renderDocuments(data.documents);
            }
        } catch (err) {
            console.error('Error loading documents:', err);
            docsList.innerHTML = `<div class="empty-text text-danger">Không tải được danh sách tài liệu.</div>`;
        }
    }

    function renderDocuments(documents) {
        docsList.innerHTML = '';
        if (!documents || documents.length === 0) {
            docsList.innerHTML = `<div class="empty-text">Chưa có tài liệu cẩm nang nào được số hóa. Hãy kéo thả file để tải lên!</div>`;
            return;
        }
        
        documents.forEach(doc => {
            const card = document.createElement('div');
            card.className = 'doc-card';
            const kbSize = (doc.char_count / 1024).toFixed(1);
            
            card.innerHTML = `
                <div class="doc-icon">📄</div>
                <div class="doc-info">
                    <div class="doc-name-text" title="${escapeHtml(doc.doc_name)}">${escapeHtml(doc.doc_name)}</div>
                    <div class="doc-meta-text">Tải lên: ${escapeHtml(doc.upload_date)} | Size: ${kbSize} KB</div>
                </div>
                <button class="btn-delete-doc" data-name="${escapeHtml(doc.doc_name)}" title="Xóa tài liệu">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            `;
            
            card.querySelector('.btn-delete-doc').addEventListener('click', async (e) => {
                e.stopPropagation();
                const docName = e.currentTarget.getAttribute('data-name');
                if (confirm(`Cậu có chắc chắn muốn xóa tài liệu cẩm nang "${docName}" và toàn bộ dữ liệu vector liên quan không?`)) {
                    await deleteDocument(docName);
                }
            });
            
            card.querySelector('.doc-info').addEventListener('click', () => {
                window.open(`${API_BASE}/api/uploads/${encodeURIComponent(doc.doc_name)}`, '_blank');
            });
            
            docsList.appendChild(card);
        });
    }

    async function deleteDocument(docName) {
        try {
            const res = await fetch(`${API_BASE}/api/delete_doc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ doc_name: docName })
            });
            if (!res.ok) throw new Error('Delete API failed');
            const data = await res.json();
            if (data.success) {
                loadDocumentsList();
                addBotMessage(`Đã xóa tài liệu cẩm nang **${docName}** và dọn dẹp các đoạn vector khỏi Database rồi nhé!`);
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert(`Lỗi khi xóa tài liệu: ${err.message}`);
        }
    }

    // ─── Drag & Drop File Upload Handlers ─────────────────────
    dragDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragDropZone.classList.add('dragover');
    });
    
    dragDropZone.addEventListener('dragleave', () => {
        dragDropZone.classList.remove('dragover');
    });
    
    dragDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dragDropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0]);
        }
    });
    
    dragDropZone.addEventListener('click', () => {
        fileUploader.click();
    });
    
    fileUploader.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0]);
        }
    });

    async function handleFileUpload(file) {
        if (!file) return;
        
        const validExtensions = ['.txt', '.pdf'];
        const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (!validExtensions.includes(fileExt)) {
            alert("Hệ thống chỉ hỗ trợ số hóa file cẩm nang dạng .txt hoặc .pdf!");
            return;
        }

        // Show status steps panel
        uploadStatus.classList.remove('hidden');
        resetUploadSteps();
        
        // Step 1: Đọc nội dung file
        setStepStatus('step-read', 'active');
        await sleep(600);
        setStepStatus('step-read', 'completed');
        
        // Step 2: Băm nhỏ văn bản (Chunking)
        setStepStatus('step-chunk', 'active');
        await sleep(800);
        setStepStatus('step-chunk', 'completed');
        
        // Step 3: Mã hóa vector
        setStepStatus('step-embed', 'active');
        await sleep(1000);
        setStepStatus('step-embed', 'completed');
        
        // Step 4: Lưu trữ cơ sở dữ liệu
        setStepStatus('step-save', 'active');
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const res = await fetch(`${API_BASE}/api/upload_doc`, {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error('Upload API failed');
            const data = await res.json();
            
            if (data.success) {
                setStepStatus('step-save', 'completed');
                await sleep(500);
                uploadStatus.classList.add('hidden');
                
                // Reload list
                loadDocumentsList();
                
                // Bot notification
                addBotMessage(`Tớ đã số hóa thành công tài liệu **${file.name}** thành ${data.chunks_count} đoạn vector rồi nhé! Cậu có thể hỏi tớ bất kỳ quy trình nào trong tài liệu này rồi đó. 😊`);
            } else {
                throw new Error(data.error || 'Unknown upload error');
            }
        } catch (err) {
            console.error('Upload error:', err);
            alert(`Lỗi số hóa cẩm nang: ${err.message}`);
            uploadStatus.classList.add('hidden');
        }
    }
    
    function resetUploadSteps() {
        const steps = ['step-read', 'step-chunk', 'step-embed', 'step-save'];
        steps.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.className = 'step-item pending';
        });
    }
    
    function setStepStatus(stepId, status) {
        const el = document.getElementById(stepId);
        if (!el) return;
        el.className = `step-item ${status}`;
    }
    
    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }



    // ─── Start App ───────────────────────────────────────────
    initialize();

})();
