<script setup lang="ts">
import { ref } from 'vue'

import Dropdown from '@/components/Dropdown/Dropdown.vue'
import Button from '@/components/Button/Button.vue'
import Table from '@/components/Table/Table.vue'
import Group from '@/components/Group/Group.vue'
import Stack from '@/components/Stack/Stack.vue'
import Hero from '@/components/Hero/Hero.vue'
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
        amoCrm.addEntity(amoCrmOption.value.value, amoCrmOption.value.label)
    }
}
</script>

<template>
    <Hero>
        <template v-slot:header-top>
            <h1>
                Компании.<br />
                Контакты.<br />
                Сделки.<br />
            </h1>
        </template>
        <template v-slot:header-bottom><h2>amoCRM.</h2></template>

        <template v-slot:content>
            <div style="width: fit-content">
                <Stack gap="xxxs" :px="0" align="flex-start" style="width: fit-content">
                    <Group :px="0" :py="0" justify="space-between">
                        <Dropdown
                            label="Тип"
                            v-model:active="amoCrmOption"
                            :items="amoCrmOptions"
                        />
                        <Button
                            @click="handleAddEntity"
                            :disabled="amoCrmOption.value === 'blank'"
                            :loading="amoCrm.isPending"
                            >Добавить</Button
                        >
                    </Group>

                    <div v-if="amoCrm.isError" style="color: red">{{ amoCrm.error }}</div>
                </Stack>

                <Table :maw="12">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Тип</Table.Th>
                            <Table.Th>Название</Table.Th>
                            <Table.Th>Идентификатор</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <template v-for="entity in amoCrm.entities" :key="entity.type + entity.id">
                            <Table.Tr>
                                <Table.Td>{{ entity.typeLabel }}</Table.Td>
                                <Table.Td>{{ entity.name }}</Table.Td>
                                <Table.Td>{{ entity.id }}</Table.Td>
                            </Table.Tr>
                        </template>
                        <Table.Tr v-if="!amoCrm.entities.length">
                            <Table.Td colspan="3">
                                <Group justify="center" style="font-style: italic">Пусто.</Group>
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </div>
        </template>
    </Hero>
</template>

<style scoped></style>
