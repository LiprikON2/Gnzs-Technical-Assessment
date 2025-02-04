<script setup lang="ts">
import Spinner from '@/components/Spinner/Spinner.vue'

defineProps<{
    variant?: 'default' | 'secondary'
    onClick?: (e: Event) => void
    loading?: boolean
    disabled?: boolean
}>()
</script>

<template>
    <button
        :disabled="disabled || loading"
        :class="{ secondary: variant === 'secondary', disabled, loading }"
        @click="onClick"
    >
        <Spinner class="spinner" v-if="loading" />
        <span class="inner">
            <slot />
        </span>
    </button>
</template>

<style scoped>
button {
    --btn-color: var(--clr-brand-text-light);
    --btn-color-disabled: var(--clr-brand-text-dark);

    --btn-bg-color: var(--clr-brand-accent);
    --btn-bg-color-disabled: var(--clr-brand-disabled);

    --btn-bg-color-hover: var(--clr-brand-accent-hover);
    --btn-border-color: var(--clr-brand-accent-hover);
    --btn-border-color-disabled: var(--clr-brand-border);
    --btn-font-size: var(--font-size-sm);
    --btn-transition-timing: 0.1s;

    @media (prefers-reduced-motion) {
        --btn-transition-timing: 0.01s;
    }
}
button {
    all: unset;
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    position: relative;
    display: inline-block;

    line-height: 1.1;
    outline-offset: calc(0.5 * var(--outline-width));
    vertical-align: middle;
    text-align: center;

    border: 1px solid var(--btn-border-color);
    border-radius: var(--radius-default);
    color: var(--btn-color);
    background-color: var(--btn-bg-color);

    font-size: var(--btn-font-size);
    padding-block: 0.25rem;
    padding-inline: 0.5rem;

    transition: transform var(--btn-transition-timing);

    &.loading .inner {
        visibility: hidden;
    }

    &:hover:enabled {
        background-color: var(--btn-bg-color-hover);
    }

    &:active:enabled {
        transform: scale(0.96);
    }

    &:focus-visible {
        outline: var(--outline-style);
    }
    &:disabled {
        cursor: not-allowed;

        &.disabled {
            color: var(--btn-color-disabled);
            background-color: var(--btn-bg-color-disabled);
            border-color: var(--btn-border-color-disabled);
        }
    }

    &.secondary {
        --btn-color: var(--clr-brand-text-dark);
        --btn-bg-color: transparent;
        --btn-bg-color-hover: var(--clr-brand-background-1);
        --btn-border-color: var(--clr-brand-text-dark);
    }
}

.spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 70%;
    height: 70%;
}
</style>
