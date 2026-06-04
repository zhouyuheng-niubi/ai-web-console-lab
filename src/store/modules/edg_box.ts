import { defineStore } from 'pinia'
export const useEdgeBoxStore = defineStore('edgeBox', {
    state: () => {
        return {
            edgeToken: ''
        }
    },
    actions: {
        setEdgeToken(edgeToken: any) {
            this.edgeToken = edgeToken
        }
    }
})