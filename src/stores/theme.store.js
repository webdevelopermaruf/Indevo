import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    const darkMode = ref(Boolean(localStorage.getItem('dark_mode')) || false)

    function toggleDark() {
        darkMode.value = !darkMode.value
        if (darkMode.value) {
            document.body.classList.add('dark')
        } else {
            document.body.classList.remove('dark')
        }
    }

    return { darkMode, toggleDark }
})