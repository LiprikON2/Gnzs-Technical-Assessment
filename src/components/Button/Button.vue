<script setup lang="ts">
//

defineProps<{
    variant?: 'default' | 'outline'
    onClick?: (e: Event) => void
}>()
</script>

<template>
    <button :class="{ outline: variant === 'outline' }" @click="onClick"><slot /></button>
</template>

<style scoped>
button {
    --b-color: var(--color-background);
    --b-color-disabled: var(--color-disabled);

    --b-bg-color: var(--color-soft);
    --b-bg-color-disabled: var(--color-background-disabled);
    --b-bg-color-active: var(--color-accent);

    --b-border-color: transparent;
    --b-font-size: var(--font-size-sm);
    --b-transition-timing: 0.1s;

    @media (prefers-reduced-motion) {
        --b-transition-timing: 0.01s;
    }

    all: unset;
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    position: relative;
    display: inline-block;

    line-height: 1.1;
    outline-offset: calc(-1 * var(--outline-width));
    vertical-align: middle;
    text-align: center;

    border: 2px solid var(--b-border-color);
    border-radius: var(--radius-default);
    color: var(--b-color);
    background-color: var(--b-bg-color);

    font-size: var(--b-font-size);
    padding-block: 0.25rem;
    padding-inline: 0.5rem;

    transition: transform var(--b-transition-timing);

    &:hover:enabled {
        filter: brightness(0.75);
    }

    &:active:enabled {
        background-color: var(--b-bg-color-active);

        filter: none;
        transform: scale(0.96);
    }

    &:focus-visible {
        outline: var(--outline-style);
    }
    &:disabled {
        color: var(--b-color-disabled);
        background-color: var(--b-bg-color-disabled);

        cursor: not-allowed;
    }

    &.outline {
        --b-border-color: var(--b-color);

        --b-bg-color: transparent;
        --b-color: var(--color-soft);

        --b-bg-color-active: unset;

        &:hover:enabled {
            filter: none;
            background-color: var(--color-subtle);
        }

        &:active:enabled {
            border-color: var(--color-accent);
            background-color: var(--color-accent-subtle);
        }
    }
}
</style>
