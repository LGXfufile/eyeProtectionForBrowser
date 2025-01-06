const app = Vue.createApp({
    data() {
        return {
            darkMode: false,
            eyeCareMode: false,
            brightness: 100
        }
    },
    methods: {
        async toggleDarkMode() {
            try {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tab) {
                    await chrome.tabs.sendMessage(tab.id, {
                        type: 'darkMode',
                        enabled: this.darkMode
                    });
                    await chrome.storage.local.set({ darkMode: this.darkMode });
                }
            } catch (error) {
                console.error('Dark mode error:', error);
                this.darkMode = !this.darkMode;
            }
        },

        async toggleEyeCare() {
            try {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tab) {
                    await chrome.tabs.sendMessage(tab.id, {
                        type: 'eyeCare',
                        enabled: this.eyeCareMode
                    });
                    await chrome.storage.local.set({ eyeCareMode: this.eyeCareMode });
                }
            } catch (error) {
                console.error('Eye care error:', error);
                this.eyeCareMode = !this.eyeCareMode;
            }
        },

        async updateBrightness() {
            try {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tab) {
                    await chrome.tabs.sendMessage(tab.id, {
                        type: 'brightness',
                        value: this.brightness
                    });
                    await chrome.storage.local.set({ brightness: this.brightness });
                }
            } catch (error) {
                console.error('Brightness error:', error);
            }
        }
    },
    mounted() {
        // 加载保存的设置
        chrome.storage.local.get(['darkMode', 'eyeCareMode', 'brightness'], (result) => {
            this.darkMode = result.darkMode || false;
            this.eyeCareMode = result.eyeCareMode || false;
            this.brightness = result.brightness || 100;
        });
    }
}).mount('#app'); 