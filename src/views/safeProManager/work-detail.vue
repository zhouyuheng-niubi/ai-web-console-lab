<template>
  <div class="work-ticket-container">
    <div class="ticket-header">
      <h2>作业票编号：{{ ticketData.ticketNumber }}</h2>
    </div>

    <table class="work-ticket-table">
      <!-- Row 1 -->
      <tr>
        <td class="label">作业申请单位</td>
        <td colspan="3">{{ ticketData.applicantUnit }}</td>
        <td class="label">作业申请时间</td>
        <td colspan="3">{{ ticketData.applicationTime }}</td>
      </tr>

      <!-- Row 2 -->
      <tr>
        <td class="label">作业内容</td>
        <td colspan="3">{{ ticketData.workContent }}</td>
        <td class="label">受限空间名称</td>
        <td colspan="3">{{ ticketData.confinedSpaceName }}</td>
      </tr>

      <!-- Row 3 -->
      <tr>
        <td class="label">受限空间内原有介质名称</td>
        <td colspan="6">{{ ticketData.originalMedium }}</td>
      </tr>

      <!-- Row 4 -->
      <tr>
        <td class="label">作业单位</td>
        <td colspan="3">{{ ticketData.workUnit }}</td>
        <td class="label">作业负责人</td>
        <td colspan="3">{{ ticketData.workLeader }}</td>
      </tr>

      <!-- Row 5 -->
      <tr>
        <td class="label">监护人</td>
        <td colspan="3">{{ ticketData.guardian }}</td>
        <td class="label">作业人</td>
        <td colspan="3">{{ ticketData.workers }}</td>
      </tr>

      <!-- Row 6 -->
      <tr>
        <td class="label">关联的其他特殊作业票编号</td>
        <td colspan="6">{{ ticketData.relatedTickets }}</td>
      </tr>

      <!-- Row 7 -->
      <tr>
        <td class="label">风险识别结果</td>
        <td colspan="6">{{ ticketData.riskIdentification }}</td>
      </tr>

      <!-- Row 8 -->
      <tr>
        <td class="label">作业实施时间</td>
        <td colspan="6">{{ ticketData.implementationTime }}</td>
      </tr>

      <tr>
        <td colspan="1" class="label">序号</td>
        <td colspan="3" class="label center-text">安全措施</td>
        <td colspan="1" class="label center-text">是否涉及</td>
        <td colspan="1" class="label center-text">确认人</td>
        <td colspan="1" class="label center-text">签名图片</td>
      </tr>

      <tr>
        <td class="label">安全交底人</td>
        <td colspan="3">
          罗书明
        </td>
        <td class="label">接受交底人</td>
        <td colspan="3">岳林,邓林,王成富</td>
      </tr>
      <tr>
        <td class="label">作业负责人意见</td>
        <td colspan="3">
          同意
        </td>
        <td>2025-12-10 09:00:00</td>
        <td colspan="3">岳林</td>
      </tr>
      <tr>
        <td class="label">所在单位意见</td>
        <td colspan="3">
          同意
        </td>
        <td>2025-12-10 09:00:00</td>
        <td colspan="3">罗书明</td>
      </tr>

      <tr>
        <td colspan="8" class="center-text">进出人员及工具</td>
      </tr>
      <tr>
        <td class="label">进出人</td>
        <td colspan="3" class="label">
          进出人签字
        </td>
        <td class="label">进出状态</td>
        <td colspan="3" class="label">带入/离工具</td>
      </tr>
      <tr>
        <td>岳林</td>
        <td colspan="3">
          签字图片
        </td>
        <td>进入</td>
        <td colspan="3">铲子</td>
      </tr>

      <tr>
        <td colspan="8" class="center-text">完工验收</td>
      </tr>
      <tr>
        <td class="label">作业已完成现场恢复正常</td>
        <td colspan="3">
          无
        </td>
        <td class="label">现场未遗留材料和工具</td>
        <td colspan="3">无</td>
      </tr>

      <tr>
        <td class="label">安全防护设施已安装到位</td>
        <td colspan="3">
          无
        </td>
        <td class="label">作业负责人签名信息</td>
        <td colspan="3">无</td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue'

// 定义props接收外部传入的数据
const props = defineProps({
  ticketData: {
    type: Object,
    default: () => ({})
  }
})

// 使用传入的数据或默认数据
const ticketData = ref({
  ticketNumber: 'SX202512090000003',
  applicantUnit: '培浸车间',
  applicationTime: '-',
  workContent: '检修脱硫塔搅拌器B台',
  confinedSpaceName: '脱硫塔',
  originalMedium: '碳酸钠浆液',
  workUnit: '天齐射洪设备部',
  workLeader: '王成富',
  guardian: '岳林',
  workers: '邓林,王成富',
  relatedTickets: '无',
  riskIdentification: '机械伤害,中毒/窒息,其他伤害',
  implementationTime: '---',
  ...props.ticketData
})

// 监听props变化，更新ticketData
watch(() => props.ticketData, (newVal) => {
  if (newVal) {
    ticketData.value = {
      ticketNumber: 'SX202512090000003',
      applicantUnit: '培浸车间',
      applicationTime: '-',
      workContent: '检修脱硫塔搅拌器B台',
      confinedSpaceName: '脱硫塔',
      originalMedium: '碳酸钠浆液',
      workUnit: '天齐射洪设备部',
      workLeader: '王成富',
      guardian: '岳林',
      workers: '邓林,王成富',
      relatedTickets: '无',
      riskIdentification: '机械伤害,中毒/窒息,其他伤害',
      implementationTime: '---',
      ...newVal
    }
  }
}, { deep: true })
</script>

<style scoped>
.work-ticket-container {
  width: 100%;
  padding: 20px;
  font-family: 'Microsoft YaHei', 'SimSun', sans-serif;
  box-sizing: border-box;
}

.ticket-header {
  text-align: center;
  margin-bottom: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
}

.ticket-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.work-ticket-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.work-ticket-table td {
  border: 1px solid #d0d0d0;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.6;
}

.work-ticket-table .label {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  min-width: 40px;
}

.center-text {
  text-align: center;
}

.section-header {
  background-color: #e8e8e8;
  font-weight: 700;
  font-size: 15px;
  padding: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .work-ticket-container {
    padding: 10px;
  }

  .work-ticket-table td {
    padding: 8px 10px;
    font-size: 12px;
  }

  .ticket-header h2 {
    font-size: 16px;
  }
}
</style>