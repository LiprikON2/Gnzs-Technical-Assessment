import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useClickOutside<T>(handler: () => any) {
    const componentRef = ref<T | null>(null)

    const handleClickOutside = (e: MouseEvent) => {
        if (componentRef.value && !componentRef.value.contains(e.target as Node)) {
            handler()
        }
    }

    onMounted(() => {
        document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside)
    })

    return componentRef
}
