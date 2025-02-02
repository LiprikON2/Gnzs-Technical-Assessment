import { nextTick, ref, type ModelRef } from 'vue'
import type { Item } from '../Dropdown.types'

interface DropdownControl {
    active: ModelRef<Item>
    getFocusedItem: () => HTMLElement | undefined
    items: Item[]
}

export function useDropdownControl({ active, items, getFocusedItem }: DropdownControl) {
    const open = ref(false)
    const focus = ref<number | null>(null)

    const scrollRef = ref<HTMLElement | null>(null)
    const listRef = ref<HTMLElement | null>(null)

    const navigateUp = () => {
        const currentFocus = focus.value ?? 0

        focus.value = Math.max(currentFocus - 1, 0)
        scrollToFocused()
    }
    const navigateDown = () => {
        const currentFocus = focus.value ?? 0

        focus.value = Math.min(currentFocus + 1, items.length - 1)
        scrollToFocused()
    }

    const toggleDropdown = (selectOnClose: boolean = false) => {
        open.value ? closeDropdown(selectOnClose) : openDropdown()
    }

    const openDropdown = () => {
        const currentFocus = focus.value ?? 0
        open.value = true
        focus.value = currentFocus
    }

    const closeDropdown = (selectOnClose: boolean = false) => {
        const currentFocus = focus.value ?? 0

        if (selectOnClose && currentFocus >= 0) {
            const selectedItem = items[currentFocus]
            active.value = selectedItem
        }

        open.value = false

        // Reset focus when dropdown closes
        focus.value = null
        // Reset scroll
        if (scrollRef.value) scrollRef.value.scrollTop = 0
    }

    // Scroll focused option into view
    const scrollToFocused = async () => {
        if (!listRef.value) return
        await nextTick()

        const focusedItem = getFocusedItem()
        if (!focusedItem) return

        focusedItem.scrollIntoView({
            block: 'nearest',
            inline: 'nearest',
        })
    }

    return {
        open,
        focus,
        active,
        scrollRef,
        listRef,
        navigateUp,
        navigateDown,
        toggleDropdown,
        openDropdown,
        closeDropdown,
        scrollToFocused,
    }
}
