<script setup lang="ts">
import type { Align, Gap, Justify, Padding } from '@/types'

interface StackProps {
    align?: Align
    justify?: Justify
    gap?: Gap
    px?: Padding
    py?: Padding
}

const props = withDefaults(defineProps<StackProps>(), {
    align: 'stretch',
    justify: 'flex-start',
    gap: 'md',
    px: 'md',
    py: 'md',
})

const getSpacing = (value: Gap) => {
    if (Number.isInteger(value)) {
        return `calc(0.0625rem * ${value})`
    }
    return `var(--spacing-${value})`
}
</script>

<template>
    <div><slot /></div>
</template>

<style scoped>
div {
    display: flex;
    flex-direction: column;
    align-items: v-bind(align);
    justify-content: v-bind(justify);

    gap: v-bind(getSpacing(gap));

    padding-inline: v-bind(getSpacing(px));
    padding-block: v-bind(getSpacing(py));
}
</style>
