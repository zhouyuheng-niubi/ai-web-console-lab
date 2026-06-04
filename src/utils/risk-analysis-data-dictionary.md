# 综合风险研判数据字典

## 1. 汇总数据 (summary)

| 属性 | 类型 | 中文描述 |
|------|------|----------|
| total_alarm_count | number | 总告警数量 |
| total_warning_count | number | 总预警数量 |
| total_hidden_danger_count | number | 总隐患数量 |
| total_violation_count | number | 总违规数量 |
| total_operation_count | number | 总作业数量 |
| risk_level | string | 风险等级（low: 低风险, medium: 中风险, high: 高风险, critical: 重大风险） |
| risk_score | number | 风险评分 |

## 2. 告警分析 (alarm_analysis)

| 属性 | 类型 | 中文描述 |
|------|------|----------|
| alarm_trend | Array<{date: string, count: number}> | 告警趋势数据（按日期统计的告警数量） |
| alarm_by_type | Array<{type: string, count: number, percentage: number}> | 按类型分类的告警统计（告警类型、数量、占比） |
| alarm_by_region | Array<{region_name: string, count: number, percentage: number}> | 按区域分类的告警统计（区域名称、数量、占比） |
| alarm_handling_stats | Object | 告警处理统计信息 |
| handled_count | number | 已处理告警数量 |
| unhandled_count | number | 未处理告警数量 |
| handling_rate | number | 告警处理率 |
| average_handling_time | string | 平均处理时长 |

## 3. 预警分析 (warning_analysis)

| 属性 | 类型 | 中文描述 |
|------|------|----------|
| warning_by_level | Array<{type: string, count: number, percentage: number}> | 按等级分类的预警统计（预警等级、数量、占比） |
| warning_by_category | Array<{type: string, count: number, percentage: number}> | 按类别分类的预警统计（预警类别、数量、占比） |

## 4. 行为分析 (behavior_analysis)

| 属性 | 类型 | 中文描述 |
|------|------|----------|
| violation_trend | Array<{date: string, count: number}> | 违规趋势数据（按日期统计的违规数量） |
| violation_by_type | Array<{type: string, count: number, percentage: number}> | 按类型分类的违规统计（违规类型、数量、占比） |
| violation_by_person | Array<{person_name: string, violation_count: number, department: string}> | 按人员分类的违规统计（人员姓名、违规次数、所属部门） |
| shift_meeting_stats | Object | 班前会议统计信息 |
| total_meetings | number | 总会议数量 |
| qualified_meetings | number | 合格会议数量 |
| qualification_rate | number | 会议合格率 |
| average_participation | number | 平均参与率 |

## 5. 培训分析 (training_analysis)

| 属性 | 类型 | 中文描述 |
|------|------|----------|
| training_coverage | number | 培训覆盖率 |
| training_effectiveness | Object | 培训效果统计 |
| excellent | number | 优秀率 |
| good | number | 良好率 |
| pass | number | 及格率 |
| fail | number | 不及格率 |
| certification_status | Object | 证书状态统计 |
| valid_count | number | 有效证书数量 |
| expired_count | number | 过期证书数量 |
| expiring_soon_count | number | 即将过期证书数量 |
| total_count | number | 证书总数量 |
| training_by_department | Array<{department: string, coverage: number, avg_score: number}> | 按部门分类的培训统计（部门名称、覆盖率、平均分） |

## 6. 设备分析 (equipment_analysis)

| 属性 | 类型 | 中文描述 |
|------|------|----------|
| device_online_rate | number | 设备在线率 |
| device_failure_rate | number | 设备故障率 |
| equipment_coverage | Object | 设备覆盖率信息 |
| camera_coverage | number | 摄像头覆盖率 |
| sensor_coverage | number | 传感器覆盖率 |
| production_device_coverage | number | 生产设备覆盖率 |
| device_maintenance | Object | 设备维护统计 |
| total_maintenance | number | 总维护次数 |
| completed_maintenance | number | 已完成维护次数 |
| overdue_maintenance | number | 逾期维护次数 |

## 7. 作业分析 (operation_analysis)

| 属性 | 类型 | 中文描述 |
|------|------|----------|
| operation_by_type | Array<{type: string, count: number, risk_level: string}> | 按类型分类的作业统计（作业类型、数量、风险等级） |
| operation_by_region | Array<{region_name: string, count: number, percentage: number}> | 按区域分类的作业统计（区域名称、数量、占比） |
| operation_compliance_rate | number | 作业合规率 |

## 8. 应急分析 (emergency_analysis)

| 属性 | 类型 | 中文描述 |
|------|------|----------|
| emergency_drill_count | number | 应急演练次数 |
| drill_success_rate | number | 演练成功率 |
| resource_availability | Object | 资源可用性信息 |
| personnel_availability | number | 人员可用率 |
| equipment_availability | number | 设备可用率 |
| material_availability | number | 物资可用率 |

## 9. 风险评估 (risk_assessment)

| 属性 | 类型 | 中文描述 |
|------|------|----------|
| overall_risk_level | string | 整体风险等级 |
| risk_score | number | 风险评分 |
| main_risk_factors | Array<{factor: string, weight: number, score: number}> | 主要风险因素（风险因素名称、权重、评分） |
| high_risk_regions | Array<{region_name: string, risk_score: number, main_risks: Array<string>}> | 高风险区域（区域名称、风险评分、主要风险） |
| high_risk_time_periods | Array<{period: string, risk_description: string}> | 高风险时段（时段、风险描述） |

## 10. 趋势预测 (trend_prediction)

| 属性 | 类型 | 中文描述 |
|------|------|----------|
| next_7_days_prediction | Object | 未来7天预测信息 |
| predicted_alarm_count | number | 预测告警数量 |
| trend | string | 趋势（increasing: 增加, decreasing: 减少, stable: 稳定） |
| confidence | number | 预测置信度 |
| next_30_days_prediction | Object | 未来30天预测信息 |
| predicted_risk_level | string | 预测风险等级 |

## 11. 防控建议 (recommendations)

| 属性 | 类型 | 中文描述 |
|------|------|----------|
| recommendations | Array<string> | 防控建议列表（具体的改进措施和建议） |

## 12. 其他属性

| 属性 | 类型 | 中文描述 |
|------|------|----------|
| generated_at | string | 数据生成时间 |
| cache_key | string | 缓存键值 |