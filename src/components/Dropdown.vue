<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface Item {
    label: string
    value: string
}

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
const selected = defineModel<Item>('selected', {
    default: { label: '', value: '' },
})

const toggleOpen = (value?: boolean) => {
    open.value = value === undefined ? !open.value : value
}
const handleSelectItem = (e: Event) => {
    const li = e.target as HTMLLIElement

    const item = props.data.find((item) => item.value === li.getAttribute('value'))
    if (!item) return

    selected.value = item

    if (props.closeOnSelect) toggleOpen(false)
}

const dropdownRef = ref<HTMLDivElement>()
const handleClickOutside = (e: MouseEvent) => {
    console.log('click outside')
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
        open.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
    <form @submit.prevent v-bind:data-open="open" ref="dropdownRef" :style="{ '--mah': props.mah }">
        <label>{{ label }}</label>

        <div class="input" @click="() => toggleOpen()">
            <input readonly type="text" autocomplete="off" v-model="selected.label" />
        </div>

        <div class="dropdown-container subtle-scrollbar">
            <div class="dropdown">
                <ul @click="handleSelectItem">
                    <li
                        v-for="(item, index) in data"
                        :key="item.value"
                        :value="item.value"
                        :data-active="item.value === selected.value"
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

    /* ::-webkit-scrollbar-track {
        background: yellow;
    } */

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
    padding: 0;
    /* 
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;

        background-color: var(--color-bg-0);

        opacity: 0;
        animation: fadeIn ease var(--dd-anim-timing-out) forwards;
        animation-delay: 0.3s;
    } */
}

li {
    list-style: none;
    padding-inline: var(--spacing-xxxs);
    opacity: 0;

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

    form[data-open='true'] & {
        animation: fadeInMoveX ease var(--dd-anim-timing-out) forwards;
        animation-delay: calc(var(--index) * 0.1s);
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
