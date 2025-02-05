import axios from 'axios'
import { defineStore } from 'pinia'

export const amoCrmApi = {
    lead: '/leads',
    contact: '/contacts',
    company: '/companies',
}

export type EntityType = keyof typeof amoCrmApi

export function isEntityType(entityTypeStr: unknown): entityTypeStr is EntityType {
    return typeof entityTypeStr === 'string' && Object.keys(amoCrmApi).includes(entityTypeStr)
}

export type Entity = {
    type: EntityType
    id: number
    name: string
}

export const useAmoCrm = defineStore('amoCrm', {
    state: () => ({
        entities: [] as Entity[],
    }),
    actions: {
        async addEntity(type: EntityType, name: string) {
            const response = await axios.post<Omit<Entity, 'type'>>(amoCrmApi[type], { name })

            const entity = { ...response.data, type }
            this.entities.push(entity)
        },
    },
})
