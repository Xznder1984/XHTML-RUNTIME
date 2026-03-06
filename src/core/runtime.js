// XHTML Runtime: Core client-side execution engine.

class XHTMLRuntime {
    constructor() {
        this.vars = {}; // For reactive data-binding
        this._initDataBinding();
        console.log("XHTML Runtime Initialized.");
    }

    _initDataBinding() {
        // Use a Proxy for reactive data handling
        this.vars = new Proxy({}, {
            set: (target, property, value) => {
                target[property] = value;
                this._updateBindings(property);
                return true;
            }
        });
    }

    _updateBindings(property) {
        // Update elements bound with x-text
        document.querySelectorAll(`[x-text="${property}"]`).forEach(el => {
            el.innerText = this.vars[property];
        });
        // Update input elements bound with x-model
        document.querySelectorAll(`[x-model="${property}"]`).forEach(el => {
            if (el.value !== this.vars[property]) {
                el.value = this.vars[property];
            }
        });
    }

    // --- Public API ---

    bind(name, initialValue) {
        this.vars[name] = initialValue;

        // Initial setup for two-way binding on inputs
        document.querySelectorAll(`[x-model="${name}"]`).forEach(el => {
            el.addEventListener('input', (e) => {
                this.vars[name] = e.target.value;
            });
            // Set initial value
            if(initialValue !== undefined) {
                el.value = initialValue;
            }
        });

        // Initial setup for one-way binding
        document.querySelectorAll(`[x-text="${name}"]`).forEach(el => {
            if(initialValue !== undefined) {
                el.innerText = initialValue;
            }
        });
    }

    dom = {
        select: (selector) => document.querySelector(selector),
        selectAll: (selector) => document.querySelectorAll(selector),
        create: (tagName) => document.createElement(tagName)
    };

    fs = {
        read: async (path) => {
            const response = await fetch('/api/fs/read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path })
            });
            const data = await response.json();
            return data.content;
        }
    };

    os = {
        info: async () => {
            const response = await fetch('/api/os/info');
            return await response.json();
        },
        notify: async (title, message) => {
            await fetch('/api/os/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, message })
            });
        }
    };
}

// Expose the single instance to the window
window.xhtml = new XHTMLRuntime();
