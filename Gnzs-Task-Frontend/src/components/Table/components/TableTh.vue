<script setup lang="ts"></script>

<template>
    <th>
        <slot />
    </th>
</template>

<style scoped>
th {
    font-weight: var(--font-weight-lg);
    border-bottom: var(--clr-brand-border) solid 1px;
}
</style>
