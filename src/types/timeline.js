// types/timeline.js
export const EventType = {
    BIRTH: 'birth',
    EDUCATION: 'education',
    CREATION: 'creation',
    TRAVEL: 'travel',
    EXHIBITION: 'exhibition',
    PUBLICATION: 'publication',
    AWARD: 'award'
};

export const EventTypeLabels = {
    [EventType.BIRTH]: '出生',
    [EventType.EDUCATION]: '教育',
    [EventType.CREATION]: '创作',
    [EventType.TRAVEL]: '游历',
    [EventType.EXHIBITION]: '展览',
    [EventType.PUBLICATION]: '出版',
    [EventType.AWARD]: '荣誉'
};

// 时间轴事件数据结构
export const timelineEventSchema = {
    id: 'string',
    year: 'number',
    title: 'string',
    description: 'string',
    type: 'EventType',
    typeLabel: 'string',
    location: 'string',
    images: 'array', // { url: string, alt: string }[]
    relatedWorks: 'array' // { id: string, title: string }[]
};