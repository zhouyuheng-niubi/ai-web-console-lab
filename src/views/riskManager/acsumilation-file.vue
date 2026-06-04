<template>
    <div class="acsumilation-file flex h-full">
        <!-- 左侧文件列表 -->
        <div class="left-panel w-1/4 bg-white p-4 border-r">
            <h2 class="text-lg font-bold mb-4">文件列表</h2>
            <div class="file-list">
                <div 
                    v-for="(file, index) in fileList" 
                    :key="index"
                    class="file-item p-3 mb-2 cursor-pointer rounded hover:bg-gray-100 transition-colors"
                    :class="{ 'bg-blue-100': selectedFile && selectedFile.name === file.name }"
                    @click="selectFile(file)"
                >
                    <div class="file-name font-medium text-sm">{{ file.name }}</div>
                    <div class="file-meta text-xs text-gray-500 mt-1">
                        <span class="file-size">{{ file.size }}</span>
                        <span class="file-date ml-2">{{ file.date }}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 右侧文件详情 -->
        <div class="right-panel w-3/4 bg-gray-50 p-4">
            <div v-if="selectedFile" class="file-detail">
                <h2 class="text-xl font-bold mb-2">{{ selectedFile.name }}</h2>
                <div class="file-info">
                    <div class="info-item mb-2">
                        <span class="font-medium">文件大小：</span>
                        <span>{{ selectedFile.size }}</span>
                    </div>
                    <div class="info-item mb-2">
                        <span class="font-medium">上传日期：</span>
                        <span>{{ selectedFile.date }}</span>
                    </div>
                    <div class="info-item mb-2">
                        <span class="font-medium">文件链接：</span>
                        <a :href="selectedFile.url" target="_blank" class="text-blue-500 hover:underline break-all">{{ selectedFile.url }}</a>
                    </div>
                </div>
                
                <div class="file-preview">
                    <h3 class="text-lg font-semibold m-2">文件预览</h3>
                    <iframe 
                        :src="selectedFile.url" 
                        width="100%" 
                        height="630px"
                        frameborder="0"
                        class="rounded border"
                    ></iframe>
                </div>
            </div>
            <div v-else class="no-file-selected text-center text-gray-500 mt-20">
                <p>请选择一个文件查看详细信息</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import accsumilationFile from '@/assets/acsumilation.pdf'
import AQTFile from '@/assets/AQT.pdf'
import { ref, onMounted } from 'vue'
import { staticFileToBase64 } from '@/utils/tool'
const Base64 = window.Base64
const fileList = ref([
    { name: '事故后果模拟子系统 设计文档', size: '754 KB', 
    date: '2025-12-29', url: accsumilationFile },
    { name: 'AQT 3046-2013化工企业定量风险评价导则', size: '896 KB', date: '2025-12-29', url: AQTFile },
])

const selectedFile = ref(null)
const selectFile = (file) => {
    selectedFile.value = file
}
// 默认选择第一个文件
onMounted(async () => {
    //  const imgModule = await import("@/assets/acsumilation.pdf"); // 替换为你的文件路径
    //  const baseUrl = await staticFileToBase64(imgModule.default);
    // fileList.value[0].url = `http://10.0.0.1:8012/onlinePreview?url=${encodeURIComponent(Base64.encode(baseUrl))}`
    // console.log(baseUrl, 'baseUrl')
    // if (fileList.value.length > 0) {
    //     selectedFile.value = fileList.value[0]
    // }
    selectedFile.value = fileList.value[0]
})

</script>

<style scoped>
.acsumilation-file {
    min-height: 600px;
}

.left-panel {
    border-right: 1px solid #e5e7eb;
    overflow-y: auto;
}

.file-item {
    border: 1px solid #e5e7eb;
    transition: all 0.2s ease;
    border-radius: 6px;
}

.file-item:hover {
    border-color: #93c5fd;
    background-color: #f9fafb;
}

.file-item.active {
    border-color: #3b82f6;
    background-color: #dbeafe;
}

.file-actions button {
    transition: all 0.2s ease;
    border: none;
    font-weight: 500;
}

.file-preview {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.no-file-selected {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
</style>
