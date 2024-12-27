export class ChatBox {
  constructor() {
    this.element = this.create();
    this.messages = [];
    this.maxMessages = 50;
    this.activeTab = 'all';
    this.setupEventListeners();
  }

  create() {
    const chat = document.createElement('div');
    chat.className = 'chat-container';
    
    chat.innerHTML = `
      <div class="chat-header">
        <div class="chat-tabs">
          <div class="chat-tab active" data-tab="all">All</div>
          <div class="chat-tab" data-tab="system">System</div>
          <div class="chat-tab" data-tab="combat">Combat</div>
        </div>
        <button class="chat-toggle">_</button>
      </div>
      <div class="chat-content">
        <div class="chat-messages"></div>
        <div class="chat-input-container">
          <input type="text" class="chat-input" placeholder="Press Enter to chat...">
          <div class="chat-commands"></div>
        </div>
      </div>
    `;

    document.body.appendChild(chat);
    return chat;
  }

  setupEventListeners() {
    const input = this.element.querySelector('.chat-input');
    const toggle = this.element.querySelector('.chat-toggle');
    const tabs = this.element.querySelectorAll('.chat-tab');

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        this.addMessage('You', input.value);
        input.value = '';
      }
    });

    toggle.addEventListener('click', () => {
      this.element.classList.toggle('minimized');
      toggle.textContent = this.element.classList.contains('minimized') ? '+' : '_';
    });

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.setActiveTab(tab.dataset.tab);
      });
    });
  }

  setActiveTab(tabName) {
    const tabs = this.element.querySelectorAll('.chat-tab');
    const messages = this.element.querySelector('.chat-messages');
    
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    this.activeTab = tabName;
    this.filterMessages();
  }

  filterMessages() {
    const messages = this.element.querySelector('.chat-messages');
    messages.innerHTML = '';

    this.messages
      .filter(msg => this.activeTab === 'all' || msg.type === this.activeTab)
      .forEach(msg => {
        const messageEl = this.createMessageElement(msg);
        messages.appendChild(messageEl);
      });

    messages.scrollTop = messages.scrollHeight;
  }

  createMessageElement(message) {
    const div = document.createElement('div');
    div.className = `chat-message ${message.type}`;
    
    div.innerHTML = `
      <span class="message-timestamp">${message.timestamp}</span>
      <span class="message-sender">${message.sender}:</span>
      <span class="message-text">${this.formatMessage(message.text)}</span>
    `;
    
    return div;
  }

  formatMessage(text) {
    // Convert URLs to links
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    
    // Convert emotes using a safer approach
    const emotes = {
      ':\\)': '😊',
      ':\\(': '😢',
      ':D': '😃',
      ';\\)': '😉',
      '<3': '❤️',
      'o/': '👋',
      '\\\\o/': '🙌'
    };
    
    Object.entries(emotes).forEach(([pattern, emoji]) => {
      text = text.replace(new RegExp(pattern, 'g'), emoji);
    });
    
    return text;
  }

  addMessage(sender, text, type = 'normal') {
    const message = {
      sender,
      text,
      type,
      timestamp: new Date().toLocaleTimeString()
    };

    this.messages.push(message);
    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }

    // Flash tab if not active
    if (type !== this.activeTab && type !== 'normal') {
      const tab = this.element.querySelector(`[data-tab="${type}"]`);
      if (tab) {
        tab.classList.add('flash');
        setTimeout(() => tab.classList.remove('flash'), 1000);
      }
    }

    this.filterMessages();
  }
}