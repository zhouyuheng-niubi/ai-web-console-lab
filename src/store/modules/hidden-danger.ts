interface ImageFile {
    name: string
    url: string
    uid: string
    status: string
    type: string
    size: number
}

interface VideoFile {
    name?: string
    url?: string
    uid?: string
    status?: string
    type?: string
    size?: number
}

interface Hazard {
    images: ImageFile[]
    videos: VideoFile[]
    hazardName: string
    hazardDesc: string
    area: string
    hazardLevel: string
    hazardType: string
    basisRule: string
    rectifySuggestion: string
    penaltyStandard: string
    expanded: boolean,
    rectifyDesc: string,
    rectifyImages: ImageFile[],
}

interface HiddenDanger {
    id: string
    status: string
    images: ImageFile[]
    videos: VideoFile[]
    hazardList: Hazard[]
    registerTime: string
    registerPerson: string
    registerPersonId: string
    deadline: string
    rectifyPerson: string
    rectifyPersonId: string
    orderName: string
}

import { defineStore } from 'pinia'
export const useHiddenDangerStore = defineStore('hiddenDanger', {
    state: () => {
        return {
            hiddenDangerList: JSON.parse(window.localStorage.getItem('hiddenDangerList') || '[]') as HiddenDanger[]
        }
    },
    actions: {
        getStatusOptions() {
            return [
                {
                    label: '隐患审核中',
                    value: 'hazard_auditing',
                    color: 'orange'
                },
                {
                    label: '隐患被驳回',
                    value: 'hazard_rejected',
                    color: 'red'
                },
                {
                    label: '待整改',
                    value: 'pending_rectification',
                    color: 'orange'
                },
                {
                    label: '整改审核中',
                    value: 'rectification_auditing',
                    color: 'blue'
                },
                {
                    label: '整改被驳回',
                    value: 'rectification_rejected',
                    color: 'red'
                },
                {
                    label: '待归档',
                    value: 'pending_archiving',
                    color: 'purple'
                },
                {
                    label: '已完成',
                    value: 'completed',
                    color: 'green'
                },
                {
                    label: '逾期未整改',
                    value: 'expired',
                    color: 'red'
                },
                {
                    label: '延期审核中',
                    value: 'defer_auditing',
                    color: 'green'
                },
                {
                    label: '延期被驳回',
                    value: 'defer_rejected',
                    color: 'red'
                }
            ]
        },
        saveHiddenDanger(hiddenDanger: HiddenDanger) {
            this.hiddenDangerList.unshift(hiddenDanger)
            window.localStorage.setItem('hiddenDangerList', JSON.stringify(this.hiddenDangerList))
        },
        updateHiddenDanger(hiddenDanger: HiddenDanger, type: string) {
            const index = this.hiddenDangerList.findIndex(item => item.id === hiddenDanger.id)
            if (index !== -1) {
                this.hiddenDangerList[index] = hiddenDanger
            }
            window.localStorage.setItem('hiddenDangerList', JSON.stringify(this.hiddenDangerList))
        },
        deleteHiddenDanger(id: string) {
            this.hiddenDangerList = this.hiddenDangerList.filter(item => item.id !== id)
            window.localStorage.setItem('hiddenDangerList', JSON.stringify(this.hiddenDangerList))
        },
        // 获取单条工单信息
        getHiddenDanger(id: string) {
            return this.hiddenDangerList.find(item => item.id === id)
        }
    }
})