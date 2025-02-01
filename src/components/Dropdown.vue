<script setup lang="ts">
import { onMounted, onUnmounted, ref, useId, watch } from 'vue'

interface Item {
    label: string
    value: string
}

const labelId = useId()
const listboxId = useId()

const dropdownRef = ref<HTMLDivElement>()
const inputRef = ref<HTMLUListElement>()
const listboxRef = ref<HTMLUListElement>()

const props = defineProps<{
    label: string
    data: Item[]
    closeOnSelect?: boolean
    /* max-height of dropdown */
    mah?: number
}>()

const open = defineModel('open', {
    default: false,
})
const focus = defineModel<number | null>('focus', {
    default: null,
})

const active = defineModel<Item>('active', {
    default: { label: '', value: '' },
})

const toggleOpen = (value?: boolean) => {
    open.value = value === undefined ? !open.value : value
}
const handleSelectItem = (e: Event) => {
    const li = e.target as HTMLLIElement

    const item = props.data.find((item) => item.value === li.getAttribute('value'))
    if (!item) return

    active.value = item

    if (props.closeOnSelect) toggleOpen(false)
}

const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
        open.value = false
    }
}

const handleKeydown = (e: KeyboardEvent) => {
    if (!inputRef.value?.contains(document.activeElement)) return

    const currentFocus = focus.value ?? 0

    if (open.value) {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                focus.value = Math.min(currentFocus + 1, props.data.length - 1)
                scrollToNext('forwards')
                break

            case 'ArrowUp':
                e.preventDefault()
                focus.value = Math.max(currentFocus - 1, 0)
                scrollToNext('backwards')
                break

            case 'Enter':
                e.preventDefault()
                if (currentFocus >= 0) {
                    const selectedItem = props.data[currentFocus]
                    active.value = selectedItem
                    toggleOpen(false)
                }
                break

            case ' ':
            case 'Escape':
                e.preventDefault()
                toggleOpen(false)
                break
        }
    } else {
        // When closed, handle opening
        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault()
                toggleOpen(true)
                focus.value = currentFocus
                break
        }
    }
}

// Scroll focused option into view
const scrollToNext = (direction: 'forwards' | 'backwards') => {
    if (!listboxRef.value) return

    const prevOption = listboxRef.value.querySelector('li[data-focused="true"]')
    const focusedOption =
        direction === 'forwards'
            ? prevOption?.nextElementSibling
            : prevOption?.previousElementSibling
    if (!focusedOption) return

    if (focusedOption) {
        focusedOption.scrollIntoView({
            block: 'nearest',
            inline: 'nearest',
        })
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
})

// Reset focus when dropdown closes
watch(open, (newValue) => {
    if (!newValue) {
        focus.value = null
    }
})
</script>

<template>
    <form @submit.prevent v-bind:data-open="open" ref="dropdownRef" :style="{ '--mah': props.mah }">
        <label :for="labelId">{{ label }}</label>

        <div
            ref="inputRef"
            class="input"
            role="button"
            aria-haspopup="listbox"
            :aria-expanded="open"
            :aria-controls="listboxId"
            @click="() => toggleOpen()"
            tabindex="0"
        >
            <input
                tabindex="-1"
                :id="labelId"
                readonly
                type="text"
                autocomplete="off"
                v-model="active.label"
            />
        </div>

        <div class="dropdown-container subtle-scrollbar">
            <div class="dropdown" tabindex="-1">
                <ul
                    ref="listboxRef"
                    role="listbox"
                    :id="listboxId"
                    :aria-label="`${label} options`"
                    @click="handleSelectItem"
                    tabindex="-1"
                    :style="{ '--count': data.length }"
                >
                    <li
                        tabindex="-1"
                        role="option"
                        v-for="(item, index) in data"
                        :key="item.value"
                        :value="item.value"
                        :aria-selected="item.value === active.value"
                        :data-active="item.value === active.value"
                        :data-focused="index === focus"
                        :style="{ '--index': index }"
                    >
                        {{ item.label }}
                    </li>
                </ul>
            </div>
        </div>
    </form>
</template>

<style scoped>
form {
    --dd-padding: var(--spacing-xxs);
    --dd-border-radius: var(--radius-default);
    --dd-font-size: var(--font-size-sm);
    --dd-anim-timing-in: 0.5s;
    --dd-anim-timing-out: 0.25s;
    --dd-max-height: calc(var(--mah) * 0.0625rem);

    max-width: fit-content;
    position: relative;
}

.input,
input,
.dropdown {
    user-select: none;
    cursor: pointer;
}

.input {
    appearance: none;
    position: relative;
    z-index: 10;
    border-radius: var(--dd-border-radius);
    outline-offset: -2px;

    input {
        width: 100%;
        font-size: inherit;
        border: none;
        padding: var(--dd-padding);
        border-radius: var(--dd-border-radius);

        color: var(--color-bg-0);
        background-color: var(--color-fg-0);
    }

    &::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: -1;
        border-radius: 100% 100% 0 0;
        background-color: var(--color-bg-0);

        opacity: 0;
    }

    form[data-open='true'] &::before {
        animation: fadeIn ease var(--dd-anim-timing-in) forwards;
    }
    form[data-open='false'] &::before {
        animation: fadeOut ease var(--dd-anim-timing-out) forwards;
    }

    &::after {
        content: url(@/assets/chevron-down.svg);
        position: absolute;
        right: 0;
        height: 100%;
        aspect-ratio: 1;

        padding: calc(var(--dd-padding) / 1.5);

        color: var(--dark-active-list);
        transition: transform 0.2s ease;
    }

    form[data-open='true'] &::after {
        transform: rotate(180deg);
    }
}
.dropdown-container {
    --padding: var(--spacing-xxs);
    position: absolute;
    width: 100%;

    overflow: hidden;

    border-radius: 0 0 var(--dd-border-radius) var(--dd-border-radius);

    opacity: 0;

    form[data-open='true'] & {
        animation: fadeIn ease var(--dd-anim-timing-out) forwards;
    }
    form[data-open='false'] & {
        animation: fadeOut ease var(--dd-anim-timing-out) forwards;
    }
}

.dropdown {
    padding-block: var(--padding);
    font-size: var(--dd-font-size);
    background-color: var(--color-bg-0);
    max-height: var(--dd-max-height, unset);

    overflow-x: clip;
    overflow-y: auto;

    form[data-open='true'] & {
        pointer-events: unset;
        animation: fadeInMoveY ease var(--dd-anim-timing-out) forwards;
        opacity: 1;
    }
    form[data-open='false'] & {
        pointer-events: none;
        animation: fadeOutMoveY ease var(--dd-anim-timing-out) forwards;
        opacity: 0;
    }
}
ul {
    --count: 0;
    padding: 0;
}

li {
    --index: 0;

    list-style: none;
    padding-inline: var(--spacing-xxxs);
    opacity: 0;
    border-radius: var(--dd-border-radius);

    &[data-active='true'] {
        color: var(--color-accent);
    }

    &::before {
        content: '✓';
        padding-right: var(--spacing-xxxxs);
        visibility: hidden;
    }
    &[data-active='true']::before {
        visibility: visible;
    }
    &[data-focused='true'] {
        outline: 2px solid var(--color-accent);
        outline-offset: -2px;
    }

    form[data-open='true'] & {
        animation: fadeInMoveX ease var(--dd-anim-timing-out) forwards;
        animation-delay: calc(var(--index) * var(--dd-anim-timing-out) / var(--count));
    }
    form[data-open='false'] & {
        animation: fadeOut ease var(--dd-anim-timing-in) forwards;
    }
}

@keyframes fadeInMoveX {
    0% {
        opacity: 0;
        transform: translateX(25%);
    }
    100% {
        opacity: 1;
        transform: translateX(0%);
    }
}
@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
@keyframes fadeOut {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
@keyframes fadeInMoveY {
    0% {
        opacity: 0;
        transform: translateY(-100%);
    }
    100% {
        opacity: 1;
        transform: translateY(0%);
    }
}
@keyframes fadeOutMoveY {
    0% {
        opacity: 1;
        transform: translateY(0%);
    }
    100% {
        opacity: 0;
        transform: translateY(-100%);
    }
}
</style>
