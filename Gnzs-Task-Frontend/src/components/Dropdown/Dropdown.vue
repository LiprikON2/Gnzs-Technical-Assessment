<script setup lang="ts">
import { computed, ref, useId, useTemplateRef } from 'vue'

import { useClickOutside } from '@/composables'
import type { Item } from './Dropdown.types'
import { useDropdownControl } from './composables'

const props = defineProps<{
    label: string
    items: Item[]
    /* max-height of dropdown */
    mah?: number
}>()

const listboxId = useId()

const inputRef = ref<HTMLUListElement | null>(null)

const handleItemSelection = (e: Event) => {
    const li = (e.target as HTMLLIElement).closest('li')
    if (!li) return

    const item = props.items.find((item) => item.value === li.getAttribute('value'))
    if (!item) return

    active.value = item
    open.value = false
}

const dropdownRef = useClickOutside<HTMLDivElement>(() => closeDropdown(false))

const active = defineModel<Item>('active', {
    default: { label: '', value: '' },
})

const itemRefs = useTemplateRef('items')

const { open, focus, scrollRef, listRef, navigateUp, navigateDown, toggleDropdown, closeDropdown } =
    useDropdownControl({
        active,
        items: props.items,
        getFocusedItem: () => {
            return itemRefs.value?.find((item) => item.dataset.focused === 'true')
        },
    })

const value = computed(() => `${props.label}: ${active.value.label}`)
</script>

<template>
    <form
        @submit.prevent
        @keydown.prevent.enter="toggleDropdown({ selectOnClose: true, focusOnOpen: true })"
        @keydown.prevent.space="toggleDropdown({ focusOnOpen: true })"
        @keydown.prevent.esc="closeDropdown()"
        @keydown.prevent.up="navigateUp"
        @keydown.prevent.down="navigateDown"
        :data-open="open"
        ref="dropdownRef"
        :style="{ '--mah': props.mah }"
    >
        <div
            ref="inputRef"
            class="input"
            role="button"
            aria-haspopup="listbox"
            :aria-expanded="open"
            :aria-controls="listboxId"
            @click="toggleDropdown()"
            tabindex="0"
        >
            <input tabindex="-1" readonly type="text" autocomplete="off" v-model="value" />
        </div>

        <div class="dropdown-container subtle-scrollbar">
            <div ref="scrollRef" class="dropdown" tabindex="-1">
                <ul
                    ref="listRef"
                    role="listbox"
                    :id="listboxId"
                    :aria-label="`${label} options`"
                    @click="handleItemSelection"
                    tabindex="-1"
                    :style="{ '--count': items.length }"
                >
                    <li
                        tabindex="-1"
                        role="option"
                        v-for="(item, index) in items"
                        :key="item.value"
                        :value="item.value"
                        ref="items"
                        :aria-selected="item.value === active.value"
                        :data-active="item.value === active.value"
                        :data-focused="index === focus"
                        :style="{ '--index': index }"
                    >
                        <span>{{ item.label }}</span>
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

    --dd-color: var(--clr-brand-text-dark);
    --dd-input-color: var(--clr-brand-background-1);
    --dd-dropdown-color: var(--clr-brand-background-0);
    --dd-border-color: var(--clr-brand-border);

    --dd-max-height: calc(var(--mah) * 0.0625rem);

    --dd-anim-timing-in: 0.5s;
    --dd-anim-timing-out: 0.25s;

    @media (prefers-reduced-motion) {
        --dd-anim-timing-in: 0.01s;
        --dd-anim-timing-out: 0.01s;
    }
}

form {
    max-width: fit-content;
    position: relative;
    z-index: 1;
    border: 1px solid var(--dd-border-color);
    border-radius: var(--dd-border-radius);
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
    outline-offset: calc(-1 * var(--outline-width));

    input {
        width: 100%;
        font-size: var(--dd-font-size);
        border: none;
        padding: var(--dd-padding);
        border-radius: var(--dd-border-radius);

        color: var(--dd-color);
        background-color: var(--dd-input-color);

        &::selection {
            background: transparent;
        }
    }

    form[data-open='true'] &::before {
        animation: fadeIn ease var(--dd-anim-timing-in) forwards;
    }
    form[data-open='false'] &::before {
        animation: fadeOut ease var(--dd-anim-timing-out) forwards;
    }

    &::after {
        --padding: 6px;
        /* ref: https://stackoverflow.com/a/42317014 */
        content: '';
        -webkit-mask: url(@/assets/chevron-down.svg) no-repeat 50% 50%;
        mask: url(@/assets/chevron-down.svg) no-repeat 50% 50%;
        -webkit-mask-size: cover;
        mask-size: cover;
        background-color: currentColor;
        margin: var(--padding);

        position: absolute;
        right: 0;
        height: calc(100% - var(--padding) * 2);
        aspect-ratio: 1;

        transition: transform 0.2s ease;

        @media (prefers-reduced-motion) {
            transition-duration: 0.01s;
        }
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

    border: 1px solid var(--dd-border-color);
    margin-top: var(--spacing-xxxs);
    border-radius: var(--dd-border-radius);

    opacity: 0;

    form[data-open='true'] & {
        animation: fadeIn ease var(--dd-anim-timing-out) forwards;
    }
    form[data-open='false'] & {
        animation: fadeOut ease var(--dd-anim-timing-out) forwards;
    }
}

.dropdown {
    font-size: var(--dd-font-size);
    background-color: var(--dd-dropdown-color);
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
    outline: none;

    list-style: none;
    padding-inline: var(--spacing-xxxs);
    opacity: 0;

    &[data-active='true'],
    &:hover {
        color: var(--color-accent);
        background-color: var(--clr-brand-hover);
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
        outline: var(--outline-style);
        outline-offset: calc(-1 * var(--outline-width));
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
        visibility: hidden;
    }
    100% {
        opacity: 1;
        visibility: visible;
    }
}
@keyframes fadeOut {
    0% {
        opacity: 1;
        visibility: visible;
    }
    100% {
        opacity: 0;
        visibility: hidden;
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
