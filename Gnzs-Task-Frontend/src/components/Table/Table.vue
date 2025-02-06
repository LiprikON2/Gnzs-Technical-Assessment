<script setup lang="ts">
import TableThead from './components/TableThead.vue'
import TableTbody from './components/TableTbody.vue'
import TableTr from './components/TableTr.vue'
import TableTh from './components/TableTh.vue'
import TableTd from './components/TableTd.vue'

defineOptions({
    Thead: TableThead,
    Tbody: TableTbody,
    Tr: TableTr,
    Th: TableTh,
    Td: TableTd,
})

interface TableProps {
    /* max-width of table */
    maw?: string | number
    /* min-width of table */
    miw?: string | number
}

const props = withDefaults(defineProps<TableProps>(), {
    maw: undefined,
    miw: undefined,
})

const getWidth = (value: TableProps['miw']) => {
    if (Number.isInteger(value)) {
        return `calc(0.0625rem * ${value})`
    }
    return value
}
</script>

<template>
    <table>
        <slot />
    </table>
</template>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
    max-width: v-bind(getWidth(maw));
    min-width: v-bind(getWidth(miw));

    background-color: var(--clr-brand-background-0);
    border-radius: var(--radius-default);
}

:deep(th) {
    text-align: start;
}

:deep(th),
:deep(td) {
    padding-inline: var(--spacing-sm);
}
</style>
