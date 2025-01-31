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
    <form @submit.prevent v-bind:data-open="open" ref="dropdownRef">
        <label>{{ label }}</label>
        <div class="input" @click="() => toggleOpen()">
            <input readonly type="text" autocomplete="off" v-model="selected.label" />
        </div>

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
    </form>
</template>

<style scoped>
form {
    --dd-padding: var(--spacing-xxs);
    --dd-border-radius: var(--radius-default);
    --dd-font-size: var(--font-size-sm);
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
        font-size: var(--dd-font-size);
        border: none;
        padding: var(--dd-padding);
        border-radius: var(--dd-border-radius);
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

.dropdown {
    position: absolute;
    width: 100%;

    padding-block: var(--spacing-xxs);
    display: none;
    font-size: var(--dd-font-size);

    form[data-open='true'] & {
        display: block;
    }
}
ul {
    padding: 0;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        width: 100%;
        height: calc(100% + var(--dd-font-size));
        margin-top: calc(-1 * var(--dd-font-size));
        padding-top: var(--dd-font-size);

        border-radius: var(--dd-border-radius);
        background-color: var(--color-bg-0);
        opacity: 0;
        animation: fadeIn ease 0.5s forwards;
        animation-delay: 0.3s;
    }
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
        animation: fadeInMove ease 0.5s forwards;
        animation-delay: calc(var(--index) * 0.1s);
    }
}

@keyframes fadeInMove {
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
</style>
