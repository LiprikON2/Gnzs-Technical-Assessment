<script setup lang="ts">
interface GroupProps {
    justify?: 'flex-start' | 'center' | 'space-between' | 'flex-end'
    gap?: 'xxxxs' | 'xxxs' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | number
}

const props = withDefaults(defineProps<GroupProps>(), {
    justify: 'flex-start',
    gap: 'md',
})

const getSpacing = (value: GroupProps['gap']) => {
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
    justify-content: v-bind(justify);

    gap: v-bind(getSpacing(gap));
}
</style>
