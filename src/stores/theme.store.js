import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    const darkMode = ref(localStorage.getItem('dark_mode') == 'true' || false)

    if (darkMode.value) {
        console.log()
        document.body.classList.add('dark')
    } else {
        document.body.classList.remove('dark')
    }


    function toggleDark() {
        darkMode.value = !darkMode.value
        localStorage.setItem('dark_mode', darkMode.value)
        if (darkMode.value) {
            document.body.classList.add('dark')
        } else {
            document.body.classList.remove('dark')
        }
    }

    return { darkMode, toggleDark }
})