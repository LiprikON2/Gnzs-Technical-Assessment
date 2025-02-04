<script setup lang="ts">
import { provide } from 'vue'

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
</script>

<template>
    <table>
        <slot />
    </table>
</template>

<style scoped></style>
