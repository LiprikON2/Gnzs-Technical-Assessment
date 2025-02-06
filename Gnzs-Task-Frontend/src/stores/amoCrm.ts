import axios, { AxiosError } from 'axios'
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
    typeLabel: string
    type: EntityType
    id: number
    name: string
}

export type Status = 'pending' | 'error' | 'success'

export type TError = AxiosError | null

export const useAmoCrm = defineStore('amoCrm', {
    state: () => ({
        entities: [] as Entity[],
        status: 'success' as Status,
        error: null as TError,
    }),
    actions: {
        async addEntity(type: EntityType, typeLabel: string, name?: string) {
            try {
                this.status = 'pending'
                const response = await axios.post<Omit<Entity, 'type'>>(amoCrmApi[type], {
                    ...(name && { name }),
                })

                const entity = { ...response.data, type, typeLabel }
                this.entities.push(entity)
                this.status = 'success'
            } catch (error) {
                console.warn('error', error)
                this.status = 'error'

                if (error instanceof AxiosError) {
                    this.error = error
                } else {
                    this.error = new AxiosError(
                        error instanceof Error ? error.message : 'Unknown error',
                    )
                }
            }
        },
    },
    getters: {
        isPending: ({ status }) => status === 'pending',
        isSuccess: ({ status }) => status === 'success',
        isError: ({ status }) => status === 'error',
    },
})
