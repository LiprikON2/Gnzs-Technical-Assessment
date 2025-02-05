<script setup lang="ts">
import Dropdown from '@/components/Dropdown/Dropdown.vue'
import Button from '@/components/Button/Button.vue'
import Table from '@/components/Table/Table.vue'
import { ref } from 'vue'

const languages = [
    { label: 'Russian', value: 'russian' },
    { label: 'English', value: 'english' },
    { label: 'Italian', value: 'italian' },
    { label: 'German', value: 'german' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
    { label: 'Korean', value: 'korean' },
]
const language = ref(languages[0])

const loading = ref(false)

const handleMockLoad = () => {
    loading.value = true
    setTimeout(() => {
        loading.value = false
    }, 2000)
}

const elements = [{ position: 1, name: 'Hydrogen', symbol: 'H', mass: 1.008 }]
</script>

<template>
    <header>
        <h1 class="green">amoCRM deals. For <span class="bold">you</span>. <i>Now</i>.</h1>
    </header>

    <main>
        <Dropdown label="Language" v-model:active="language" :items="languages" :mah="120" />
        <Button @click="handleMockLoad" :loading="loading">Test1</Button>
        <Button @click="handleMockLoad" :loading="loading" disabled>Test2</Button>
        <Button @click="handleMockLoad" :loading="loading" variant="secondary"> Test3 </Button>
        <Button @click="handleMockLoad" :loading="loading" variant="secondary" disabled>
            Test4
        </Button>

        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Element position</Table.Th>
                    <Table.Th>Element name</Table.Th>
                    <Table.Th>Symbol</Table.Th>
                    <Table.Th>Atomic mass</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                <Table.Tr v-for="element in elements" :key="element.name">
                    <Table.Td>{{ element.position }}</Table.Td>
                    <Table.Td>{{ element.name }}</Table.Td>
                    <Table.Td>{{ element.symbol }}</Table.Td>
                    <Table.Td>{{ element.mass }}</Table.Td>
                </Table.Tr>
            </Table.Tbody>
        </Table>
    </main>
</template>

<style scoped>
header {
    line-height: 1.5;
    font-size: var(--font-size-xl);
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .dropdown {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }
}
</style>
