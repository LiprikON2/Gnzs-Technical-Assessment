<script setup lang="ts">
import { ref } from 'vue'

import Dropdown from '@/components/Dropdown/Dropdown.vue'
import Button from '@/components/Button/Button.vue'
import Table from '@/components/Table/Table.vue'
import Group from '@/components/Group/Group.vue'
import Stack from '@/components/Stack/Stack.vue'
import { isEntityType, useAmoCrm } from './stores'

const amoCrmOptions = [
    { label: 'Не выбрано', value: 'blank' },
    { label: 'Сделка', value: 'lead' },
    { label: 'Контакт', value: 'contact' },
    { label: 'Компания', value: 'company' },
]
const amoCrmOption = ref(amoCrmOptions[0])

const amoCrm = useAmoCrm()

const handleAddEntity = () => {
    if (isEntityType(amoCrmOption.value.value)) {
        amoCrm.addEntity(amoCrmOption.value.value)
    }
}
</script>

<template>
    <header>
        <h1>
            amoCRM контакты.<br />
            Сделки.<br />
            Компании.<br />
            Для <span class="bold">вас</span>.
        </h1>
    </header>

    <main>
        <Stack gap="xxxs" :px="0">
            <Group :px="0" :py="0" justify="space-between">
                <Dropdown label="Тип" v-model:active="amoCrmOption" :items="amoCrmOptions" />
                <Button
                    @click="handleAddEntity"
                    :disabled="amoCrmOption.value === 'blank'"
                    :loading="amoCrm.isPending"
                    >Добавить</Button
                >
            </Group>

            <div v-if="amoCrm.isError" style="color: red">{{ amoCrm.error }}</div>
        </Stack>

        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Тип</Table.Th>
                    <Table.Th>Название</Table.Th>
                    <Table.Th>Идентификатор</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                <Table.Tr v-for="entity in amoCrm.entities" :key="entity.type + entity.id">
                    <Table.Td>{{ entity.type }}</Table.Td>
                    <Table.Td>{{ entity.name }}</Table.Td>
                    <Table.Td>{{ entity.id }}</Table.Td>
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
