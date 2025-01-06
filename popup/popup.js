const { createApp, ref } = Vue;

const app = createApp({
    setup() {
        const title = ref('Dark Mode & Eye Protection');
        const darkMode = ref(false);
        const eyeCareMode = ref(false);
        const brightness = ref(100);
        const debug = ref('');

        // Debug function
        const log = (msg) => {
            debug.value = `${new Date().toLocaleTimeString()}: ${msg}\n${debug.value}`;
            console.log(msg);
        };

        log('App starting...');

        const toggleDarkMode = async () => {
            log(`Toggling dark mode: ${darkMode.value}`);
            try {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tab) {
                    await chrome.tabs.sendMessage(tab.id, {
                        type: 'darkMode',
                        enabled: darkMode.value
                    });
                    await chrome.storage.local.set({ darkMode: darkMode.value });
                    log('Dark mode toggled successfully');
                }
            } catch (error) {
                log(`Error: ${error.message}`);
            }
        };

        const toggleEyeCareMode = async () => {
            log(`Toggling eye care mode: ${eyeCareMode.value}`);
            try {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tab) {
                    await chrome.tabs.sendMessage(tab.id, {
                        type: 'eyeCare',
                        enabled: eyeCareMode.value
                    });
                    await chrome.storage.local.set({ eyeCareMode: eyeCareMode.value });
                    log('Eye care mode toggled successfully');
                }
            } catch (error) {
                log(`Error: ${error.message}`);
            }
        };

        const adjustBrightness = async () => {
            log(`Adjusting brightness: ${brightness.value}`);
            try {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tab) {
                    await chrome.tabs.sendMessage(tab.id, {
                        type: 'brightness',
                        value: brightness.value
                    });
                    await chrome.storage.local.set({ brightness: brightness.value });
                    log('Brightness adjusted successfully');
                }
            } catch (error) {
                log(`Error: ${error.message}`);
            }
        };

        // Load saved settings
        chrome.storage.local.get(['darkMode', 'eyeCareMode', 'brightness'], (result) => {
            log('Loading saved settings...');
            darkMode.value = result.darkMode || false;
            eyeCareMode.value = result.eyeCareMode || false;
            brightness.value = result.brightness || 100;
            log('Settings loaded');
        });

        return {
            title,
            darkMode,
            eyeCareMode,
            brightness,
            debug,
            toggleDarkMode,
            toggleEyeCareMode,
            adjustBrightness
        };
    }
});

// Mount the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.mount('#app');
    console.log('App mounted');
}); 