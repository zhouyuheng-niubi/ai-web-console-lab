// 数字化预案相关静态数据定义

// 数字化预案类型定义
export interface DigitalPlan {
  plan_id: string;
  plan_name: string;
  plan_type_id: string;
  plan_type_name?: string;
  department_id?: string;
  department_name?: string;
  status: "draft" | "active" | "inactive";
  update_time?: string;
  create_time?: string;
  plan_content?: string;
  responsible_person?: string;
  accident_type?: string;
}

export interface PlanType {
  plan_type_id: string;
  plan_type_name: string;
  parent_id?: string;
  children?: PlanType[];
  key: string;
}

export interface Department {
  department_id: string;
  department_name: string;
  status: string;
}
export const statusOptions = [
  { value: "draft", label: "草稿", color: "default" },
  { value: "active", label: "启用", color: "green" },
  { value: "inactive", label: "禁用", color: "red" },
];

export const accidentType = [
  {
    value: "accidentDisaster",
    label: "事故灾难",
    children: [
      { value: "fire_explosion", label: "火灾爆炸事故" },
      { value: "chemical_leak", label: "危险化学品泄漏" },
      { value: "mechanical_injury", label: "机械伤害事故" },
      { value: "fall_from_height", label: "高处坠落事故" },
      { value: "confined_space", label: "有限空间作业事故" },
      { value: "poisoning_asphyxiation", label: "中毒窒息事故" },
      { value: "lifting_injury", label: "起重伤害事故" },
      { value: "electric_shock", label: "触电事故" },
    ],
  },
  {
    value: "naturalDisaster",
    label: "自然灾害",
    children: [
      { value: "earthquake", label: "地震" },
      { value: "flood", label: "洪水" },
      { value: "typhoon", label: "台风" },
      { value: "wind_disaster", label: "风灾" },
      { value: "ice_disaster", label: "冰灾" },
      { value: "sandstorm", label: "沙尘暴" },
      { value: "other_disaster", label: "其他自然灾害" },
    ],
  },
  {
    value: "otherDisaster",
    label: "其他灾害",
  },
];

// 预案类型数据
export const staticPlanTypes: PlanType[] = [
  {
    plan_type_id: "general",
    plan_type_name: "总体应急预案",
    key: "general",
    children: [],
  },
  {
    plan_type_id: "special",
    plan_type_name: "专项应急预案",
    key: "special",
    children: [],
  },
  {
    plan_type_id: "department",
    plan_type_name: "部门应急预案",
    key: "department",
    children: [],
  },
  {
    plan_type_id: "onsite",
    plan_type_name: "现场处置方案预案",
    key: "onsite",
    children: [],
  },
  {
    plan_type_id: "major_activity",
    plan_type_name: "重大活动应急预案",
    key: "major_activity",
    children: [],
  },
  {
    plan_type_id: "other",
    plan_type_name: "其他类型预案",
    key: "other",
    children: [],
  },
];

// 部门静态数据
export const staticDepartments: Department[] = [
  {
    department_id: "dept001",
    department_name: "安全管理部门",
    status: "active",
  },
  {
    department_id: "dept002",
    department_name: "应急管理部门",
    status: "active",
  },
  { department_id: "dept003", department_name: "卫生部门", status: "active" },
  {
    department_id: "dept004",
    department_name: "交通管理部门",
    status: "active",
  },
];

export const templatePlans = {
  general: `
    <p style="text-align:center; font-family:'SimHei'; font-weight:bold; font-size:16pt;">企业总体应急预案报告</p>
    <p style="text-align:center; font-family:'SimSun'; font-size:12pt; font-weight:normal;">报告日期：2025-11-05</p>
    <p style="font-family:'SimSun'; font-size:12pt; line-height:1.5; text-align:justify; text-indent:2em; margin:0; padding:0;">
    <h1 style="text-align:left; font-weight:bold; font-size:14pt; margin-top:1em; margin-bottom:1em;">1 总则</h1>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">1.1 编制目的</h2>
    <p>为规范本单位生产安全事故应急管理工作，提高应对突发事故的处置能力，确保在事故发生时能够迅速、有序、高效地开展应急救援行动，防止事故扩大，最大限度减少人员伤亡、财产损失和环境影响，保障职工生命安全与企业稳定运行，依据国家相关法律法规及技术标准，结合本单位实际，特制定本应急预案.</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">1.2 编制依据</h2>
    <p>
      （1）《中华人民共和国安全生产法》（主席令第88号，2021年修订）<br>
      （2）《中华人民共和国突发事件应对法》（主席令第69号）<br>
      （3）《生产安全事故应急预案管理办法》（应急管理部令第2号修正）<br>
      （4）《生产经营单位生产安全事故应急预案编制导则》（GB/T 29639-2013）<br>
      （5）《危险化学品安全管理条例》（国务院令第591号）<br>
      （6）本单位安全生产管理制度、风险评估报告及相关技术资料
    </p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">1.3 适用范围</h2>
    <p>本预案适用于本单位范围内发生的各类生产安全事故的应急响应与处置工作，包括但不限于火灾、爆炸、危险化学品泄漏、中毒窒息、机械伤害、触电、高处坠落等事故类型。适用于事故预警、信息报告、应急响应、现场处置、后期恢复等全过程管理。同时适用于本单位内部各部门、岗位以及相关协作单位在应急状态下的联动响应.</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">1.4 应急预案体系</h2>
    <p>本单位应急预案体系由综合应急预案、专项应急预案和现场处置方案三级构成：</p>
    <p>（1）<strong>综合应急预案</strong>：作为本单位应急预案体系的总纲，统筹指导各类事故的应急工作原则、组织机构、响应程序和保障措施。</p>
    <p>（2）<strong>专项应急预案</strong>：针对特定事故类型（如火灾爆炸、危险化学品泄漏、特种设备事故等）制定的专业性应急方案。</p>
    <p>（3）<strong>现场处置方案</strong>：针对具体作业场所、装置或设施（如配电室、危化品仓库、生产车间等）制定的操作级应急处置措施。</p>
    <p>所有预案之间相互衔接，形成统一协调、分级响应的应急管理体系.</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">1.5 应急工作原则</h2>
    <p>（1）<strong>以人为本，安全第一</strong>：把保障员工生命安全和身体健康放在首位，最大限度减少人员伤亡。</p>
    <p>（2）<strong>预防为主，防救结合</strong>：强化风险辨识与隐患排查治理，提升事故防范能力。</p>
    <p>（3）<strong>统一指挥，分级负责</strong>：建立统一的应急指挥体系，明确各级职责，实现快速响应。</p>
    <p>（4）<strong>依法依规，科学施救</strong>：遵循国家法律法规和技术标准，采取科学合理的救援措施。</p>
    <p>（5）<strong>资源整合，协同应对</strong>：充分利用内部应急资源，加强与外部救援力量的协调联动。</p>
    <p>（6）<strong>信息公开，及时准确</strong>：按规定程序发布事故信息，维护社会稳定.</p>
    <h1 style="text-align:left; font-weight:bold; font-size:14pt; margin-top:1em; margin-bottom:1em;">2 事故风险描述</h1>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">2.1 生产经营单位的基本情况</h2>
    <p>本单位名称为XXX有限公司，位于XX省XX市XX区XX路XX号，占地面积约XX亩，建筑面积XX平方米。主要从事XX产品的生产加工/制造/储存等业务，主要工艺流程包括XX、XX、XX。现有员工XXX人，其中专职安全管理人员X人，特种作业人员XX人。配备有消防系统、可燃气体报警系统、视频监控系统等安全设施，并设有独立的安全管理部门.</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">2.2 危险源与风险评估</h2>
    <p>根据风险评估结果，本单位存在的主要危险源包括：</p>
    <p>（1）<strong>火灾爆炸风险</strong>：涉及易燃液体（如乙醇、汽油）、可燃气体（如液化石油气）的使用与储存；</p>
    <p>（2）<strong>危险化学品泄漏风险</strong>：使用盐酸、氢氧化钠等腐蚀性物质，存在泄漏引发中毒、灼伤风险；</p>
    <p>（3）<strong>机械伤害风险</strong>：生产设备运转部件未有效防护，可能导致夹击、卷入等伤害；</p>
    <p>（4）<strong>触电风险</strong>：电气设备老化、线路敷设不规范可能引发电击事故；</p>
    <p>（5）<strong>高处坠落风险</strong>：登高作业平台、屋顶检修区域缺乏有效护栏；</p>
    <p>（6）<strong>中毒窒息风险</strong>：密闭空间作业时通风不良，可能积聚有毒有害气体。</p>
    <p>以上风险经LEC法评估，均处于可控范围，但需持续监控并落实防控措施.</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">2.3 重大危险源辨识</h2>
    <p>依据《危险化学品重大危险源辨识》（GB 18218-2018），对本单位储存和使用的危险化学品数量进行核算。经辨识，各危险化学品存量均未达到临界量标准，故本单位不构成危险化学品重大危险源。但仍将其纳入重点监管范围，执行严格管理制度。</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">2.4 重点防护目标</h2>
    <p>（1）<strong>危化品仓库</strong>：存放易燃、腐蚀性化学品，为重点防火防泄漏区域；</p>
    <p>（2）<strong>配电室</strong>：全厂供电中枢，需防止电气火灾和误操作；</p>
    <p>（3）<strong>生产车间</strong>：人员密集，设备集中，为事故易发区；</p>
    <p>（4）<strong>锅炉房/空压机房</strong>：涉及压力容器运行，存在爆炸风险；</p>
    <p>（5）<strong>办公楼及员工宿舍</strong>：保障人员疏散与安置的重要区域.</p>
    <h1 style="text-align:left; font-weight:bold; font-size:14pt; margin-top:1em; margin-bottom:1em;">3 应急组织机构及职责</h1>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">3.1 指挥机构</h2>
    <p>成立“公司生产安全事故应急指挥部”，作为应急响应最高决策机构。指挥部设总指挥1名，由公司主要负责人担任；副总指挥若干名，由分管安全、生产、设备的负责人担任。指挥部下设办公室，设在安全环保部，负责日常应急管理事务。</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">3.2 主要职责</h2>
    <p><strong>总指挥</strong>：全面负责应急指挥工作，启动和终止应急预案，调配应急资源，对外信息发布审批。</p>
    <p><strong>副总指挥</strong>：协助总指挥开展工作，在总指挥不在时代行其职责，分管各专业组应急行动。</p>
    <p><strong>通讯联络组</strong>：负责内外部通信联络、信息传递、警报发布与解除。</p>
    <p><strong>警戒疏散组</strong>：负责事故现场警戒、交通管制、人员疏散引导与安置。</p>
    <p><strong>抢险灭火组</strong>：负责初期火灾扑救、泄漏控制、设备抢修等现场处置。</p>
    <p><strong>医疗救护组</strong>：负责伤员急救、转运及医疗协调。</p>
    <p><strong>后勤保障组</strong>：负责应急物资供应、车辆调度、食宿安排等支持工作。</p>
    <p><strong>环境监测组</strong>：负责事故后大气、水质、土壤污染监测与评估（视需要设立）。</p>
    <h1 style="text-align:left; font-weight:bold; font-size:14pt; margin-top:1em; margin-bottom:1em;">4 预警及信息报告</h1>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">4.1 预警</h2>
    <p>根据监测监控系统数据变化、气象预警信息或现场异常情况，设置四级预警级别：</p>
    <p>（1）<strong>蓝色预警</strong>（Ⅳ级）：发现一般隐患，可能发生轻微事故；</p>
    <p>（2）<strong>黄色预警</strong>（Ⅲ级）：隐患升级，可能发生一般事故；</p>
    <p>（3）<strong>橙色预警</strong>（Ⅱ级）：险情明显，可能发生较大事故；</p>
    <p>（4）<strong>红色预警</strong>（Ⅰ级）：紧急状态，可能发生重大及以上事故。</p>
    <p>预警信息由安全管理部门提出，经应急指挥部批准后通过广播、短信、电话等方式发布.</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">4.2 信息报告</h2>
    <p>事故发生后，现场人员应立即向当班负责人和安全管理部门报告。安全管理部门须在接报后10分钟内向应急指挥部报告，指挥部应在30分钟内向属地应急管理局、行业主管部门报告。报告内容包括：事故发生时间、地点、类型、初步原因、伤亡情况、已采取措施及发展趋势。后续情况应及时续报。</p>
    <h1 style="text-align:left; font-weight:bold; font-size:14pt; margin-top:1em; margin-bottom:1em;">5 应急响应</h1>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">5.1 响应分级</h2>
    <p>根据事故严重程度、可控性和影响范围，将应急响应分为三级：</p>
    <p>（1）<strong>Ⅲ级响应</strong>：发生一般事故，依靠本单位力量可控制；</p>
    <p>（2）<strong>Ⅱ级响应</strong>：发生较大事故，需调动全部应急力量并请求外部支援；</p>
    <p>（3）<strong>Ⅰ级响应</strong>：发生重大或特别重大事故，立即启动最高级别响应，全面疏散并报请政府介入.</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">5.2 响应程序</h2>
    <p>（1）事故发现与初报；</p>
    <p>（2）应急指挥部召集会议，研判形势</p>
    <p>（3）发布预警或启动相应级别响应</p>
    <p>（4）各应急小组赶赴现场，按职责展开行动</p>
    <p>（5）实施现场处置、人员疏散、医疗救护</p>
    <p>（6）动态评估事态，调整响应策略</p>
    <p>（7）直至应急结束.</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">5.3 处置措施</h2>
    <p>根据不同事故类型采取针对性措施：</p>
    <p>（1）<strong>火灾爆炸</strong>：切断电源/气源，使用干粉、泡沫灭火器扑救，划定警戒区；</p>
    <p>（2）<strong>危险化学品泄漏</strong>：堵漏、围堰、中和处理，佩戴个人防护装备；</p>
    <p>（3）<strong>中毒窒息</strong>：迅速撤离至通风处，实施心肺复苏，送医救治；</p>
    <p>（4）<strong>机械伤害</strong>：停止设备运行，止血包扎，避免二次伤害；</p>
    <p>（5）<strong>触电</strong>：切断电源，使用绝缘工具施救，进行急救.</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">5.4 应急结束</h2>
    <p>当满足以下条件时，由应急指挥部宣布应急结束：</p>
    <p>（1）事故现场得到有效控制，无次生、衍生事故风险</p>
    <p>（2）受伤人员全部得到妥善救治</p>
    <p>（3）环境污染物已基本清除或受控</p>
    <p>（4）现场清理完毕，具备恢复生产条件。</p>
    <p>应急结束后，转入后期处置阶段，并做好记录归档.</p>
    <h1 style="text-align:left; font-weight:bold; font-size:14pt; margin-top:1em; margin-bottom:1em;">6 信息公开</h1>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">6.1 信息发布程序</h2>
    <p>事故信息由应急指挥部统一管理，指定新闻发言人负责对外发布。信息发布前须经总指挥审批，确保内容真实、准确、权威。严禁任何部门和个人擅自对外透露事故详情。</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">6.2 信息发布原则</h2>
    <p>（1）<strong>及时性</strong>：第一时间向社会通报事故基本情况；</p>
    <p>（2）<strong>准确性</strong>：发布信息必须经过核实，不得传播未经证实的消息；</p>
    <p>（3）<strong>一致性</strong>：保持口径统一，避免多头发布造成混乱；</p>
    <p>（4）<strong>适度性</strong>：兼顾公众知情权与社会稳定，防止引发恐慌.</p>
    <h1 style="text-align:left; font-weight:bold; font-size:14pt; margin-top:1em; margin-bottom:1em;">7 后期处置</h1>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">7.1 污染物处理</h2>
    <p>对事故产生的废水、废渣、残留化学品等按照环保要求进行分类收集、安全处置，防止二次污染。委托有资质单位进行无害化处理，并留存处置记录。</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">7.2 生产秩序恢复</h2>
    <p>在事故调查完成、安全隐患整改到位、设备设施检测合格后，制定复产方案，经应急指挥部批准后逐步恢复生产。</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">7.3 医疗救治</h2>
    <p>持续跟踪伤员治疗进展，协调医疗机构提供必要支持，保障工伤认定和医疗保险待遇落实。</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">7.4 人员安置</h2>
    <p>对因事故导致临时无法返岗的员工，合理安排休息或调岗；对受影响Maintainer边居民，配合政府部门做好安抚与临时安置。</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">7.5 善后赔偿</h2>
    <p>依据国家有关法律法规，开展事故损失评估，依法依规对伤亡人员及其家属进行赔偿，妥善处理民事纠纷。</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">7.6 应急救援预案评估</h2>
    <p>应急结束后15日内，由安全管理部门牵头组织对本次应急响应全过程进行评估，总结经验教训，提出改进意见，形成书面报告报应急指挥部，并作为预案修订依据。</p>
    <h1 style="text-align:left; font-weight:bold; font-size:14pt; margin-top:1em; margin-bottom:1em;">8 保障措施</h1>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">8.1 通信与信息保障</h2>
    <p>建立固定电话、移动通信、对讲机相结合的应急通信网络，确保指挥畅通。关键岗位人员保持24小时通讯畅通。</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">8.2 应急队伍保障</h2>
    <p>组建专兼职应急救援队伍，定期开展培训与演练，确保具备初期处置能力。与当地消防、医疗等专业救援机构建立联动机制。</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">8.3 物资装备保障</h2>
    <p>配备必要的应急物资与装备，包括灭火器、消防栓、防毒面具、急救箱、堵漏工具、应急照明、防护服等，并建立台账，定期检查维护。</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">8.4 其他保障</h2>
    （1）<p><strong>经费保障</strong>：设立专项应急资金，用于预案编制、培训、演练、物资采购等；</p>
    （2）<p><strong>交通运输保障</strong>：确保应急车辆随时可用，保持良好车况；</p>
    （3）<p><strong>治安保障</strong>：配合公安部门维护事故现场及Maintainer边秩序；</p>
    （4）<p><strong>技术支撑保障</strong>：聘请安全专家提供技术支持，提升应急决策水平.</p>
    <h1 style="text-align:left; font-weight:bold; font-size:14pt; margin-top:1em; margin-bottom:1em;">9 应急预案管理</h1>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">9.1 应急预案培训</h2>
    <p>每年至少组织一次全员应急预案培训，重点岗位人员每半年培训一次。培训内容包括预案内容、应急职责、处置程序、逃生技能等，并建立培训档案。</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">9.2 应急预案演练</h2>
    <p>每年至少组织一次综合应急演练，每半年开展一次专项或现场处置方案演练。演练结束后进行评估总结，提出改进建议，并形成闭环管理。</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">9.3 应急预案修订</h2>
    <p>有下列情形之一时，应及时修订预案：</p>
    <p>（1）法律、法规、标准发生变化；</p>
    <p>（2）单位隶属关系、生产工艺、规模发生重大变更；</p>
    <p>（3）应急组织机构调整；</p>
    <p>（4）演练或事故应急中发现重大缺陷；</p>
    <p>（5）其他需修订的情况。修订后的预案须重新评审、签发、备案。</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">9.4 应急预案备案</h2>
    <p>本预案经评审通过后，由主要负责人签署发布，并在30日内报送属地县级以上应急管理部门和其他负有安全生产监督管理职责的部门备案，取得备案登记表。</p>
    <h2 style="text-align:left; font-weight:bold; font-size:13pt; margin-top:0.5em; margin-bottom:0.5em;">9.5 应急预案实施</h2>
    <p>本预案自发布之日起正式实施。原相关应急预案同时废止。各部门应认真学习本预案内容，严格落实各项应急职责和措施，确保应急管理体系有效运行.</p>
    <h1 style="text-align:left; font-weight:bold; font-size:14pt; margin-top:1em; margin-bottom:1em;">10 附件</h1>
    <p>
      附件1：应急救援指挥序列图<br>
      附件2：事故应急救援指挥领导小组、事故应急救援专业队伍名单<br>
      附件3：应急通讯录（含内部人员及外部救援单位联系方式）<br>
      附件4：应急物资装备一览表<br>
      附件5：Maintainer边企业可调用应急物资清单<br>
      附件6：典型事故现场处置方案（火灾、泄漏、触电等）<br>
      附件7：公司危险物质主要危险特性表<br>
      附件8：主要易燃物质适用灭火剂对照表<br>
      附件9：厂区平面布置图<br>
      附件10：应急设施物资分布图<br>
      附件11：报警系统分布图及覆盖范围<br>
      附件12：人员撤离、疏散通道示意图<br>
      附件13：应急救援指挥部位置及救援队伍行动路线图<br>
      附件14：企业地理位置分布图（含Maintainer边敏感点）
    </p>
    </p>
    `,

  onsite: `
    <h1 style="text-align:center;font-family:'SimHei';font-weight:bold;font-size:16pt;margin:0;padding:0;">现场处置方案</h1>
    <p style="font-family:'SimSun';font-size:12pt;line-height:1.5;text-align:justify;text-indent:2em;margin:0;padding:0;">
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">1 事故特征</h1>
    <p>1.1 事故类型：【请填写具体事故类型，如：火灾爆炸、危险化学品泄漏、机械伤害等】</p>
    <p>1.2 危害程度：事故可能造成人员伤亡、设备损毁、环境污染等，影响范围涵盖作业现场及Maintainer边区域。</p>
    <p>1.3 事故征兆：【请填写具体事故征兆，如：可燃气体检测仪报警、温度/压力异常升高、发现明显泄漏或冒烟等】</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">2 应急组织机构及职责</h1>
    <p>2.1 现场应急小组：成立由现场负责人任组长的现场应急小组，负责现场事故应急工作的组织与指挥。</p>
    <p>2.2 职责分工：</p>
    <p>（1）组长：全面负责现场应急指挥工作；</p>
    <p>（2）现场处置人员：负责实施现场应急处置；</p>
    <p>（3）疏散引导人员：负责组织现场人员撤离；</p>
    <p>（4）通信联络人员：负责向上级报告事故情况。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">3 应急处置</h1>
    <p>3.1 事故应急处置程序：</p>
    <p>（1）发现险情，立即报警并向上级报告；</p>
    <p>（2）切断事故区域电源、气源，停止相关作业；</p>
    <p>（3）根据事故类型，采取相应的初期处置措施；</p>
    <p>（4）组织现场人员按预定路线有序撤离；</p>
    <p>（5）设置警戒区域，防止无关人员进入；</p>
    <p>（6）配合专业救援力量开展救援行动。</p>
    <p>3.2 现场应急处置措施：</p>
    <p>（1）【请填写具体处置措施1】；</p>
    <p>（2）【请填写具体处置措施2】；</p>
    <p>（3）【请填写具体处置措施3】。</p>
    <p>3.3 报警电话：应急值守电话：【请填写电话号码】；火警电话：119；急救电话：120。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">4 注意事项</h1>
    <p>4.1 佩戴个人防护装备：进入事故现场必须佩戴相应的个人防护装备，如安全帽、防护服、防毒面具、空气呼吸器等。</p>
    <p>4.2 遵循安全原则：坚持"救人第一、防止扩散、科学施救"的原则，确保救援人员自身安全。</p>
    <p>4.3 防止次生灾害：注意观察现场情况，防止发生爆炸、中毒、坍塌等次生灾害。</p>
    <p>4.4 及时报告：事故发生后，必须及时向上级报告，不得迟报、漏报、谎报或瞒报。</p>
    <p>4.5 配合调查：事故处理结束后，配合有关部门开展事故调查，提供相关资料和信息。</p>
    </p>`,

  major_activity: `
    <h1 style="text-align:center;font-family:'SimHei';font-weight:bold;font-size:16pt;margin:0;padding:0;">重大活动应急预案</h1>
    <p style="font-family:'SimSun';font-size:12pt;line-height:1.5;text-align:justify;text-indent:2em;margin:0;padding:0;">
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">1 总则</h1>
    <p>1.1 编制目的：为规范重大活动应急管理工作，提高应对各类突发事件的能力，保障重大活动安全、有序进行，最大程度减少人员伤亡和财产损失，特制定本预案。</p>
    <p>1.2 编制依据：依据《中华人民共和国突发事件应对法》《大型群众性活动安全管理条例》《生产经营单位生产安全事故应急预案编制导则》（GB/T 29639-2013）等法律法规和标准规范，结合重大活动实际情况制定。</p>
    <p>1.3 适用范围：本预案适用于本单位组织或参与的各类重大活动，包括大型会议、展览、演出、体育比赛、庆典活动等。</p>
    <p>1.4 工作原则：坚持"以人为本、安全第一，预防为主、常备不懈，统一指挥、分级负责，快速反应、协同应对"的原则。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">2 活动概况及风险分析</h1>
    <p>2.1 活动概况：活动名称：【请填写活动名称】；活动时间：【请填写活动时间】；活动地点：【请填写活动地点】；参与人数：【请填写参与人数】。</p>
    <p>2.2 风险分析：重大活动主要存在以下风险：</p>
    <p>（1）人员密集场所踩踏事故；</p>
    <p>（2）火灾爆炸事故；</p>
    <p>（3）恐怖袭击事件；</p>
    <p>（4）公共卫生事件；</p>
    <p>（5）自然灾害；</p>
    <p>（6）设备设施故障；</p>
    <p>（7）群体性事件。</p>
    <p>各类事故可能造成人员伤亡、财产损失及社会影响，影响范围涵盖活动现场及Maintainer边区域。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">3 应急组织机构及职责</h1>
    <p>3.1 活动应急指挥部：成立由活动负责人任总指挥的活动应急指挥部，全面负责活动应急工作的组织、协调与决策。指挥部下设现场指挥组、安全保卫组、医疗救护组、疏散引导组、通信联络组、后勤保障组、宣传报道组等。</p>
    <p>3.2 职责分工：</p>
    <p>（1）总指挥：全面负责活动应急指挥工作，决定启动和终止应急响应；</p>
    <p>（2）现场指挥组：负责事故现场应急处置的统一指挥与协调；</p>
    <p>（3）安全保卫组：负责活动现场安全保卫、秩序维护、交通管制；</p>
    <p>（4）医疗救护组：负责伤员初步救治、联系并配合医疗机构转运；</p>
    <p>（5）疏散引导组：负责组织人员按预定路线有序撤离；</p>
    <p>（6）通信联络组：保障内外部通信畅通，及时传递信息；</p>
    <p>（7）后勤保障组：提供应急物资、装备及生活支持；</p>
    <p>（8）宣传报道组：负责信息发布和舆情引导。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">4 预警及信息报告</h1>
    <p>4.1 预警：建立活动监测预警机制，对活动现场实施动态监控。预警条件包括：人员密集、发现可疑物品、发生冲突、设备故障、天气异常等。预警方式为广播通知、短信提醒、现场喊话等。</p>
    <p>4.2 信息报告：任何人员发现险情，应立即向活动应急指挥部报告。活动应急指挥部接报后，立即启动应急响应，并在规定时间内向相关部门报告。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">5 应急响应</h1>
    <p>5.1 响应分级：根据事故危害程度和可控性，将应急响应分为三级：</p>
    <p>（1）Ⅲ级响应（现场级）：事故影响较小，由现场人员即可控制；</p>
    <p>（2）Ⅱ级响应（活动级）：事故影响较大，需启动活动全部应急力量；</p>
    <p>（3）Ⅰ级响应（社会联动级）：事故失控，可能危及Maintainer边区域，需请求外部救援力量联合处置。</p>
    <p>5.2 响应程序：现场人员发现险情立即报警并尝试初期处置；活动应急指挥部接警后迅速评估，宣布启动相应级别响应；各应急小组赶赴现场，按职责开展救援行动；根据事态发展，决定是否扩大响应级别或请求外部支援。</p>
    <p>5.3 应急结束：满足事故得到控制、受伤人员已妥善救治、现场秩序恢复正常等条件，由活动总指挥签署应急结束指令。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">6 保障措施</h1>
    <p>6.1 应急物资装备：配备足量消防器材、医疗急救用品、个人防护装备、应急照明、通讯设备等，并建立《应急物资储备清单》，定期检查维护。</p>
    <p>6.2 应急队伍：组建活动应急队伍，定期开展培训与演练，确保具备快速响应能力。与公安、消防、医疗等部门建立联动机制。</p>
    <p>6.3 通信与信息：建立可靠的内外部通信网络，确保应急期间信息传递畅通。保存关键联络人名单及外部救援单位联系方式。</p>
    <p>6.4 场地保障：合理规划活动场地，设置安全通道、应急出口、医疗点等，确保场地符合安全要求。</p>
    <p>6.5 交通保障：制定交通疏导方案，确保应急车辆通行畅通。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">7 应急预案管理</h1>
    <p>7.1 培训与演练：活动前组织应急知识培训，使所有工作人员熟悉应急职责和处置流程。根据活动规模和风险程度，组织开展应急演练。</p>
    <p>7.2 评估与修订：活动结束后，对应急预案的执行情况进行评估，总结经验教训，分析存在的问题，及时组织修订。</p>
    <p>7.3 备案与告知：本预案经评审通过后，由活动负责人签署，并向相关部门备案。将活动风险性质、影响范围及应急防范措施告知参与人员和Maintainer边单位。</p>
    </p>`,

  other: `
    <h1 style="text-align:center;font-family:'SimHei';font-weight:bold;font-size:16pt;margin:0;padding:0;">其他类型应急预案</h1>
    <p style="font-family:'SimSun';font-size:12pt;line-height:1.5;text-align:justify;text-indent:2em;margin:0;padding:0;">
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">1 总则</h1>
    <p>1.1 编制目的：为规范【请填写预案类型】应急管理工作，提高应对突发事件的能力，最大程度减少人员伤亡和财产损失，保障生产经营安全，特制定本预案。</p>
    <p>1.2 编制依据：依据《中华人民共和国安全生产法》《中华人民共和国突发事件应对法》《生产经营单位生产安全事故应急预案编制导则》（GB/T 29639-2013）等法律法规和标准规范，结合本单位实际情况制定。</p>
    <p>1.3 适用范围：本预案适用于【请填写适用范围】的预防、预警、应急响应、现场处置及后期恢复等全过程应急管理工作。</p>
    <p>1.4 工作原则：坚持"以人为本、安全第一，预防为主、常备不懈，统一指挥、分级负责，快速反应、协同应对"的原则。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">2 风险分析</h1>
    <p>2.1 风险描述：【请填写具体风险描述】</p>
    <p>2.2 危害程度：事故可能造成人员伤亡、设备损毁、环境污染等，影响范围涵盖【请填写影响范围】。</p>
    <p>2.3 事故征兆：【请填写具体事故征兆】</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">3 应急组织机构及职责</h1>
    <p>3.1 应急小组：成立由【请填写负责人】任组长的应急小组，全面负责应急工作的组织、协调与决策。</p>
    <p>3.2 职责分工：</p>
    <p>（1）组长：全面负责应急指挥工作，决定启动和终止应急响应；</p>
    <p>（2）现场处置人员：负责实施现场应急处置；</p>
    <p>（3）疏散引导人员：负责组织人员撤离；</p>
    <p>（4）医疗救护人员：负责伤员初步救治；</p>
    <p>（5）通信联络人员：负责内外部通信联络和信息上报。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">4 预警及信息报告</h1>
    <p>4.1 预警：建立监测预警机制，对【请填写监测对象】实施动态监控。预警条件包括：【请填写具体预警条件】。预警方式为【请填写预警方式】。</p>
    <p>4.2 信息报告：任何人员发现险情，应立即向【请填写报告对象】报告。接报后，立即启动应急响应，并在规定时间内向相关部门报告。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">5 应急响应</h1>
    <p>5.1 响应分级：根据事故危害程度和可控性，将应急响应分为【请填写响应级别】。</p>
    <p>5.2 响应程序：现场人员发现险情立即报警并尝试初期处置；应急小组接警后迅速评估，宣布启动相应级别响应；各小组赶赴现场，按职责开展救援行动；根据事态发展，决定是否请求外部支援。</p>
    <p>5.3 应急结束：满足事故得到控制、受伤人员已妥善救治、现场秩序恢复正常等条件，由【请填写结束指令签署人】签署应急结束指令。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">6 保障措施</h1>
    <p>6.1 应急物资装备：配备必要的【请填写应急物资装备】，并建立《应急物资储备清单》，定期检查维护。</p>
    <p>6.2 应急队伍：组建【请填写应急队伍类型】，定期开展培训与演练，确保具备快速响应能力。</p>
    <p>6.3 通信与信息：建立可靠的内外部通信网络，确保应急期间信息传递畅通。保存关键联络人名单及外部救援单位联系方式。</p>
    <p>6.4 其他保障：【请填写其他保障措施】</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">7 应急预案管理</h1>
    <p>7.1 培训与演练：【请填写培训与演练要求】</p>
    <p>7.2 评估与修订：每【请填写时间间隔】对应急预案进行一次评估，分析其针对性和实用性。在发生事故后、演练发现问题或法律法规变更时，应及时组织修订。</p>
    <p>7.3 备案与告知：本预案经评审通过后，由【请填写签署人】签署，并向相关部门备案。将事故风险性质、影响范围及应急防范措施告知相关人员。</p>
    </p>`,
  special: `
    <h1 style="text-align:center;font-family:'SimHei';font-weight:bold;font-size:16pt;margin:0;padding:0;">专项应急预案</h1>
    <p style="font-family:'SimSun';font-size:12pt;line-height:1.5;text-align:justify;text-indent:2em;margin:0;padding:0;">
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">1 总则</h1>
    <p>1.1 编制目的：为规范【请填写专项预案类型】事故应急管理工作，提高应对此类事故的能力，最大程度减少人员伤亡和财产损失，保障生产经营安全，特制定本预案。</p>
    <p>1.2 编制依据：依据《中华人民共和国安全生产法》《中华人民共和国突发事件应对法》《生产安全事故应急条例》《生产经营单位生产安全事故应急预案编制导则》（GB/T 29639-2013）等法律法规和标准规范，以及公司总体应急预案，结合本单位实际情况制定。</p>
    <p>1.3 适用范围：本预案适用于本单位【请填写专项预案类型】事故的预防、预警、应急响应、现场处置及后期恢复等全过程应急管理工作。</p>
    <p>1.4 工作原则：坚持"以人为本、安全第一，预防为主、常备不懈，统一指挥、分级负责，快速反应、协同应对"的原则。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">2 事故风险描述</h1>
    <p>2.1 风险类型：【请填写具体事故类型，如：火灾爆炸、危险化学品泄漏、机械伤害、高处坠落、有限空间作业事故、中毒窒息、起重伤害、触电事故等】</p>
    <p>2.2 风险分析：本单位【请填写专项预案类型】主要风险点包括：</p>
    <p>（1）【请填写具体风险点1】；</p>
    <p>（2）【请填写具体风险点2】；</p>
    <p>（3）【请填写具体风险点3】。</p>
    <p>2.3 危害程度：事故可能造成人员伤亡、设备损毁、环境污染及生产中断，影响范围涵盖作业区域及Maintainer边设施。</p>
    <p>2.4 事故征兆：【请填写具体事故征兆，如：可燃气体检测仪报警、温度/压力异常升高、发现明显泄漏或冒烟、设备异常声响等】</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">3 应急组织机构及职责</h1>
    <p>3.1 应急指挥部：成立由单位主要负责人任总指挥的专项应急指挥部，全面负责【请填写专项预案类型】事故应急工作的组织、协调与决策。指挥部下设现场指挥组、抢险救援组、疏散引导组、医疗救护组、警戒保卫组、通信联络组、后勤保障组等职能小组。</p>
    <p>3.2 职责分工：</p>
    <p>（1）总指挥：全面负责应急指挥工作，决定启动和终止应急响应；</p>
    <p>（2）副总指挥：协助总指挥工作，分管具体应急事务；</p>
    <p>（3）现场指挥组：负责事故现场应急处置的统一指挥与协调；</p>
    <p>（4）抢险救援组：负责实施抢险救援、搜救被困人员、控制事故源；</p>
    <p>（5）疏散引导组：负责组织人员按预定路线有序撤离；</p>
    <p>（6）医疗救护组：负责伤员初步救治、联系并配合医疗机构转运；</p>
    <p>（7）警戒保卫组：负责事故现场隔离、交通管制及秩序维护；</p>
    <p>（8）通信联络组：保障内外部通信畅通，及时传递信息；</p>
    <p>（9）后勤保障组：提供应急物资、装备及生活支持。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">4 预警及信息报告</h1>
    <p>4.1 预警：建立【请填写专项预案类型】监测预警机制，对关键部位实施24小时动态监控。预警条件包括：【请填写具体预警条件】。预警方式为声光报警系统启动，并通过广播系统发布预警信息。</p>
    <p>4.2 信息报告：设立24小时应急值守电话。任何人员发现险情，应立即向值班室报告。值班员接报后，立即通知应急指挥部成员并启动初步响应。事故发生后，单位负责人应在1小时内向所在地县级人民政府应急管理部门和负有安全生产监督管理职责的有关部门报告。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">5 应急响应</h1>
    <p>5.1 响应分级：根据事故危害程度和可控性，将应急响应分为三级：</p>
    <p>（1）Ⅲ级响应（现场级）：事故影响较小，由岗位人员即可控制；</p>
    <p>（2）Ⅱ级响应（企业级）：事故影响较大，需启动企业内部全部应急力量；</p>
    <p>（3）Ⅰ级响应（社会联动级）：事故失控，可能危及Maintainer边区域，需请求外部救援力量联合处置。</p>
    <p>5.2 响应程序：现场人员发现险情立即报警并尝试初期处置；应急指挥部接警后迅速评估，宣布启动相应级别响应；各应急小组赶赴现场，按职责开展救援行动；根据事态发展，决定是否扩大响应级别或请求外部支援。</p>
    <p>5.3 处置措施：</p>
    <p>（1）初期处置：切断事故区域电源、气源，停止相关工艺操作；【请填写具体初期处置措施】；</p>
    <p>（2）人员疏散：按照"向上风向、高处、远离危险源"原则组织人员撤离，清点人数，确保无遗漏；</p>
    <p>（3）专业救援：【请填写具体专业救援措施】；</p>
    <p>（4）现场恢复：确认无次生灾害风险后，组织清理现场，修复受损设施，开展环境监测，评估损失。</p>
    <p>5.4 应急结束：满足事故得到控制、受伤人员已妥善救治、环境监测数据达标、现场秩序恢复正常等条件，由应急总指挥签署应急结束指令。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">6 保障措施</h1>
    <p>6.1 应急物资装备：配备足量【请填写具体应急物资装备，如：消防器材、个人防护装备、堵漏工具、应急照明、通讯设备等】，并建立《应急物资储备清单》，定期检查维护。</p>
    <p>6.2 应急队伍：组建专兼职应急救援队伍，定期开展培训与演练，确保具备快速响应能力。与专业救援机构建立联动机制。</p>
    <p>6.3 通信与信息：建立可靠的内外部通信网络，确保应急期间信息传递畅通。保存关键联络人名单及外部救援单位联系方式。</p>
    <p>6.4 技术保障：配备必要的监测、检测、分析设备，为应急处置提供技术支撑。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">7 应急预案管理</h1>
    <p>7.1 培训与演练：每年至少组织一次【请填写专项预案类型】专项应急预案演练，每半年开展一次现场处置方案演练。组织相关员工参加应急知识培训，熟悉逃生路线、报警方法和自救互救技能。</p>
    <p>7.2 评估与修订：每三年对应急预案进行一次全面评估，分析其针对性和实用性。在发生事故后、演练发现问题或法律法规变更时，应及时组织修订。</p>
    <p>7.3 备案与告知：本预案经评审通过后，由单位主要负责人签署，并向属地应急管理部门备案。将事故风险性质、影响范围及应急防范措施告知Maintainer边单位和从业人员。</p>
    </p>`,
  department: `
    <h1 style="text-align:center;font-family:'SimHei';font-weight:bold;font-size:16pt;margin:0;padding:0;">部门应急预案</h1>
    <p style="font-family:'SimSun';font-size:12pt;line-height:1.5;text-align:justify;text-indent:2em;margin:0;padding:0;">
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">1 总则</h1>
    <p>1.1 编制目的：为规范本部门生产安全事故应急管理工作，提高应对各类突发事故的能力，最大程度减少人员伤亡和财产损失，保障部门生产经营安全，特制定本预案。</p>
    <p>1.2 编制依据：依据《中华人民共和国安全生产法》《生产经营单位生产安全事故应急预案编制导则》（GB/T 29639-2013）等法律法规和标准规范，以及公司总体应急预案，结合本部门实际情况制定。</p>
    <p>1.3 适用范围：本预案适用于本部门范围内发生的各类生产安全事故的预防、预警、应急响应、现场处置及后期恢复等全过程应急管理工作。</p>
    <p>1.4 工作原则：坚持"以人为本、安全第一，预防为主、常备不懈，统一指挥、分级负责，快速反应、协同应对"的原则。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">2 部门概况及风险分析</h1>
    <p>2.1 部门概况：本部门主要职责为【请填写部门主要职责】，现有员工【请填写人数】人，主要工作场所包括【请填写主要工作场所】。部门配备有【请填写主要设备设施】等安全设施。</p>
    <p>2.2 风险分析：本部门主要存在以下事故风险：</p>
    <p>（1）【请填写具体风险类型1，如：机械伤害、触电、火灾等】；</p>
    <p>（2）【请填写具体风险类型2】；</p>
    <p>（3）【请填写具体风险类型3】。</p>
    <p>2.3 危害程度：各类事故可能造成人员伤亡、设备损毁及生产中断，影响范围涵盖部门工作区域。</p>
    <p>2.4 事故征兆：【请填写具体事故征兆，如：设备异常声响、温度异常、气体泄漏报警等】</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">3 应急组织机构及职责</h1>
    <p>3.1 部门应急小组：成立由部门负责人任组长的部门应急小组，全面负责部门事故应急工作的组织、协调与决策。应急小组下设现场处置组、疏散引导组、医疗救护组、通信联络组等。</p>
    <p>3.2 职责分工：</p>
    <p>（1）组长：全面负责部门应急指挥工作，决定启动和终止部门应急响应；</p>
    <p>（2）现场处置组：负责事故现场应急处置；</p>
    <p>（3）疏散引导组：负责组织人员按预定路线有序撤离；</p>
    <p>（4）医疗救护组：负责伤员初步救治；</p>
    <p>（5）通信联络组：保障内外部通信畅通，及时传递信息。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">4 预警及信息报告</h1>
    <p>4.1 预警：建立部门监测预警机制，对关键岗位和重点区域实施动态监控。预警条件包括：【请填写具体预警条件】。预警方式为声光报警、电话通知等。</p>
    <p>4.2 信息报告：任何人员发现险情，应立即向部门负责人报告。部门负责人接报后，立即启动部门应急响应，并在规定时间内向公司应急指挥部报告。报告内容包括：事故发生时间、地点、类型、初步原因、伤亡情况、已采取措施等。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">5 应急响应</h1>
    <p>5.1 响应分级：根据事故危害程度和可控性，将应急响应分为两级：</p>
    <p>（1）Ⅱ级响应（部门级）：事故影响较小，由部门力量即可控制；</p>
    <p>（2）Ⅰ级响应（公司级）：事故影响较大，需请求公司应急力量支援。</p>
    <p>5.2 响应程序：现场人员发现险情立即报警并尝试初期处置；部门应急小组接警后迅速评估，宣布启动相应级别响应；各小组赶赴现场，按职责开展救援行动；根据事态发展，决定是否请求公司支援。</p>
    <p>5.3 处置措施：</p>
    <p>（1）初期处置：切断事故区域电源、气源，停止相关作业；【请填写具体初期处置措施】；</p>
    <p>（2）人员疏散：组织现场人员按预定路线有序撤离至安全集合点，清点人数，确保无遗漏；</p>
    <p>（3）现场控制：设置警戒区域，防止无关人员进入；【请填写其他现场控制措施】；</p>
    <p>（4）配合救援：配合公司应急力量或外部救援力量开展救援行动。</p>
    <p>5.4 应急结束：满足事故得到控制、受伤人员已妥善救治、现场秩序恢复正常等条件，由部门负责人签署应急结束指令。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">6 保障措施</h1>
    <p>6.1 应急物资装备：配备必要的【请填写具体应急物资装备，如：消防器材、个人防护装备、应急照明、通讯设备等】，并建立部门应急物资清单，定期检查维护。</p>
    <p>6.2 应急队伍：组建部门兼职应急救援队伍，定期开展培训与演练，确保具备快速响应能力。</p>
    <p>6.3 通信与信息：建立部门内外部通信网络，确保应急期间信息传递畅通。保存关键联络人名单。</p>
    <p>6.4 疏散通道：明确部门内各区域的疏散路线和集合点，确保疏散通道畅通无阻。</p>
    <h1 style="text-align:left;font-weight:bold;margin-top:1em;margin-bottom:1em;">7 应急预案管理</h1>
    <p>7.1 培训与演练：每半年至少组织一次部门应急预案演练。组织部门员工参加应急知识培训，熟悉逃生路线、报警方法和自救互救技能。培训与演练情况记入安全生产教育和培训档案。</p>
    <p>7.2 评估与修订：每年对应急预案进行一次评估，分析其针对性和实用性。在发生事故后、演练发现问题或公司总体预案变更时，应及时组织修订。</p>
    <p>7.3 备案与告知：本预案经评审通过后，由部门负责人签署，并向公司应急管理部门备案。将事故风险性质、影响范围及应急防范措施告知部门员工。</p>
    <p>7.4 档案管理：建立部门应急预案管理档案，包括预案文本、评审记录、培训记录、演练记录、修订记录等，确保档案完整、规范。</p>
    </p>`,
};
// 静态预案数据
export const staticPlans: DigitalPlan[] = [
  {
    plan_id: "plan012",
    plan_name: "总体应急预案",
    plan_type_id: "general",
    plan_type_name: "总体应急预案",
    department_id: "dept001",
    department_name: "安全管理部门",
    status: "active",
    plan_content: templatePlans.general,
    responsible_person: "张三",
    update_time: "2024-12-04 09:00:00",
    create_time: "2024-11-12 15:00:00",
    accident_type: "otherDisaster",
  },
  {
    plan_id: "plan001",
    plan_name: "火灾事故现场处置方案",
    plan_type_id: "onsite",
    plan_type_name: "现场处置方案",
    department_id: "dept001",
    department_name: "安全管理部门",
    status: "active",
    plan_content: `
      <h1 style="text-align: center; margin-bottom: 30px; color: #b71c1c;">火灾事故现场处置方案</h1>
        <p style="margin-bottom: 30px;">
        <h2 style=" padding-left: 10px; margin-top: 40px; color: #d32f2f;">1 事故风险分析</h2>
        <p style="padding-left: 20px;">
        <h3 style="color: #555; margin-top: 25px;">1.1 事故类型</h3>
        <p style="margin-left: 20px;">办公、生活区主要存在的火灾事故类型为电器起火、电线老化引发火灾、炊事中不当用火引发火灾、人为故意纵火、其他外部火源等。</p>

        <h3 style="color: #555; margin-top: 25px;">1.2 危害程度</h3>
        <p style="margin-left: 20px;">办公区域、员工宿舍、员工食堂等可能发生人为或者自然因素的火灾。其造成火灾的危险程度分析见下表：</p>
        <h4 style="text-align:center; margin-top:20px;">火灾危险程度分析表</h4><table style="width: 80%; border-collapse: collapse; margin: 20px auto;">
        <thead>
        <tr>
        <th style="border: 1px solid #999; padding: 12px 15px; text-align: left; background-color: #f5f5f5; font-weight: bold;">序号</th>
        <th style="border: 1px solid #999; padding: 12px 15px; text-align: left; background-color: #f5f5f5; font-weight: bold;">事故类型</th>
        <th style="border: 1px solid #999; padding: 12px 15px; text-align: left; background-color: #f5f5f5; font-weight: bold;">危险程度分析</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td style="border: 1px solid #999; padding: 12px 15px;">1</td>
        <td style="border: 1px solid #999; padding: 12px 15px;">电器火灾</td>
        <td style="border: 1px solid #999; padding: 12px 15px;">可能性：低；可控性：中；危害性：中</td>
        </tr>
        <tr>
        <td style="border: 1px solid #999; padding: 12px 15px;">2</td>
        <td style="border: 1px solid #999; padding: 12px 15px;">电线火灾</td>
        <td style="border: 1px solid #999; padding: 12px 15px;">可能性：低；可控性：中；危害性：中</td>
        </tr>
        <tr>
        <td style="border: 1px solid #999; padding: 12px 15px;">3</td>
        <td style="border: 1px solid #999; padding: 12px 15px;">食堂火灾</td>
        <td style="border: 1px solid #999; padding: 12px 15px;">可能性：低；可控性：中；危害性：中</td>
        </tr>
        <tr>
        <td style="border: 1px solid #999; padding: 12px 15px;">4</td>
        <td style="border: 1px solid #999; padding: 12px 15px;">人为纵火</td>
        <td style="border: 1px solid #999; padding: 12px 15px;">可能性：低；可控性：低；危害性：大</td>
        </tr>
        <tr>
        <td style="border: 1px solid #999; padding: 12px 15px;">5</td>
        <td style="border: 1px solid #999; padding: 12px 15px;">上、临楼层火灾</td>
        <td style="border: 1px solid #999; padding: 12px 15px;">可能性：低；可控性：中；危害性：中</td>
        </tr>
        </tbody>
        </table>

        <h3 style="color: #555; margin-top: 25px;">1.3 事故征兆</h3>
        <p style="margin-left: 20px;">火灾事故判断的基本征兆一般在火灾初起期就能确定，如：浓烟、明火。火灾事故的必要条件为助燃剂、可燃物和引火源。</p>
        </p>
        </p>

        <p style="margin-bottom: 30px;">
        <h2 style=" padding-left: 10px; margin-top: 40px; color: #d32f2f;">2 应急工作职责</h2>
        <p style="padding-left: 20px;">
        <h3 style="color: #555; margin-top: 25px;">2.1 应急处置小组组成</h3>
        <p style="margin-left: 20px;"><strong>组长：</strong>项目负责人</p>
        <p style="margin-left: 20px;"><strong>副组长：</strong>项目分管安全负责人/安全总监</p>
        <p style="margin-left: 20px;"><strong>成员：</strong>各部门/小组负责人、安全管理人员等</p>

        <h3 style="color: #555; margin-top: 25px;">2.2 工作职责</h3>
        <p style="margin-left: 20px;">(1) 组长负责了解和掌握事故现场情况，及时向上级汇报，在上级应急指挥机构到达前负责指挥和组织现场抢救。</p>
        <p style="margin-left: 20px;">(2) 副组长负责协助组长开展应急抢救工作。</p>
        <p style="margin:20px;"><p>恐后，互相拥挤，阻塞通道，导致自相践踏，会造成不应有的惨剧。</p>
            <p style="margin-left: 20px;">(5)楼内失火可向着火层以下疏散，逃生时不要乘普通电梯。下楼通道被火封住，欲逃无路时，将被子单、台布撕成布条，结成绳索，牢系窗槛，再用衣角护住手心，顺绳滑下。</p>
                <p style="margin-left: 20px;">(6)邻室起火，万勿开门，应跳入窗户阳台，呼减救援或用前法脱险。否则，热气浓烟，乘虚而入，使人室息。</p>
                    <p style="margin-left: 20px;">(7)烟雾较浓时，不必惊慌，宜用膝、肘着地，匍匐前进，因为近地处往往残留清新空气。注意，呼吸要小而浅。</p>
                    <p style="margin-left: 20px;">(8)逃离时，要用湿毛巾掩住口鼻。也可用房内花瓶、水壶、金鱼缸里的水打湿衣服、布类等掩住口鼻。带婴儿逃离时，可用湿布轻蒙在他的脸上，一手抱人，一手摸地爬行逃出。</p>
                    <p style="margin-left: 20px;">(9)逃离前必须先把有火房间的门关紧。特别是在住户多的大楼及旅馆里，采用这一措施，将浓烟禁锢在一个房间之内，不致迅速蔓延，能为本人和大家赢得宝贵时间。</p></p>


        <p style="font-family:宋体;font-size:12pt;line-height:1.5;margin:20px;">附件：1.应急联系表</p>
        <p style="font-family:宋体;font-size:12pt;line-height:1.5;margin:20px;">应包归口管理部或单位电话、项目部人员联系电话，相关方人员联系电话，政府有关部门联系电话，救援部门联系电话等。</p>

        <p style="font-family:宋体;font-size:12pt;line-height:1.5;margin:20px;">2.应急物质清单（略）</p>
        <p style="font-family:宋体;font-size:12pt;line-height:1.5;margin:20px;">应包含医用急救箱、担架和应急照明灯等急救物资，应救援车辆等。</p>

        </p>
        </p>

        <table border="1" cellspacing="0" cellpadding="8" style="border-collapse:collapse;width:100%;font-family:宋体;font-size:12pt;margin:20px auto;">
        <caption style="font-size:14pt;font-weight:bold;padding:10px;text-align:center;">火灾事故现场处置预案</caption>
        <tr>
        <th width="10%" style="background-color:#f2f2f2;text-align:center;">序号</th>
        <th width="15%" style="background-color:#f2f2f2;text-align:center;">事故类别</th>
        <th width="75%" style="background-color:#f2f2f2;text-align:center;">火灾事故</th>
        </tr>
        <tr>
        <td style="text-align:center;vertical-align:top;">1</td>
        <td style="text-align:center;vertical-align:top;">事故特征</td>
        <td>
        1. 办公、生活区主要存在的火灾事故类型为电器起火、电线老化引发火灾、炊事中不当用火引发火灾、人为故意纵火、其他外部火源等。<br>
        2. 办公区域、员工宿舍、员工食堂等可能发生人为或者自然因素的火灾，总体来看发生火灾的可能性较低，但如果不能及时发现并先期处置，将会造成较大影响。<br>
        3. 火灾事故判断的基本征兆一般在火灾初起期就能确定，如：浓烟、明火。火灾事故的必要条件为助燃剂、可燃物和引火源。
        </td>
        </tr>
        <tr>
        <td style="text-align:center;vertical-align:top;">2</td>
        <td style="text-align:center;vertical-align:top;">应急组织</td>
        <td>
        组长：项目负责人<br>
        副组长：项目分管安全负责人/安全总监<br>
        成员：各部门/小组负责人、安全管理人员等。
        </td>
        </tr>
        <tr>
        <td style="text-align:center;vertical-align:top;">3</td>
        <td style="text-align:center;vertical-align:top;">应急处置</td>
        <td>
        1. 现场人员第一时间报警，通知项目负责人，并实行自救，火势蔓延扩大时，拨打火警119，当发现有人员受伤时，拨打120向当地急救中心取得联系，详细说明事故地点、严重程度、联系电话，并派人到路口接应。<br>
        2. 有关人员赶赴现场，协助救助。<br>
        3. 疏散火灾及可能受影响区域的人员，转移易燃易爆物品，抢救人员应根据受伤者的具体情况，采取相应的救治措施。<br>
        4. 1小时内向上级报告，当事故超出本单位应急处置能力时，应立即向当地政府有关部门及上级单位请求支援。<br>
        5. 火灾事故现场采集相关资料，并通知保险公司。<br>
        6. 电线、电气设备着火时，应首先切断电源。扑救电气设备着火时，灭火人员应穿绝缘鞋、戴绝缘手套。可使用干粉灭火器或二氧化碳灭火器，不得使用泡沫灭火器。<br>
        7. 食堂油锅或者燃气着火时，可使用1211灭火器、干粉灭火器、二氧化碳灭火器或消防用砂进行灭火。
        </td>
        </tr>
        <tr>
        <td style="text-align:center;vertical-align:top;">4</td>
        <td style="text-align:center;vertical-align:top;">注意事项</td>
        <td>
        1. 火势很小，可以用手提灭火器、消防水源进行扑救。<br>
        2. 救人重于灭火，火场上如果有人受到火势威胁，首要任务是把被火围困的人员抢救出来。<br>
        3. 先控制、后灭火，对于不可能立即扑灭的火灾，首先控制火势的继续蔓延扩大，在具备扑灭火灾的条件时，展开攻势，扑灭火灾。<br>
        4. 灭火中应注意穿戴防护用品，防止爆炸、倒塌、坠落伤亡等事故。<br>
        5. 灭火时注意观察起火的部位、物质、蔓延方向等，灭火后要注意保护好现场的痕迹和遗留物品，以便查明起火原因，便于分析事故。<br>
        6. 备齐必要的应急救援物资，如车辆、灭火器材、担架、氧气袋、止血带、通讯设备、照明器材等。<br>
        7. 灭火结束后，应保护好现场，等待事故调查组进行调查处理。
        </td>
        </tr>
        <tr>
        <td style="text-align:center;vertical-align:top;">5</td>
        <td style="text-align:center;vertical-align:top;">应急保障</td>
        <td>
        1. 应急救援联络电话<br>
        &nbsp;&nbsp;项目部应急救援管理办公室电话：<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u><br>
        &nbsp;&nbsp;医务急救电话：120<br>
        2. 医用急救箱、担架和应急照明灯等急救物资存放工区办公室。<br>
        3. 事故救援车辆：<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>
        </td>
        </tr>
        </table>
    
    `,
    responsible_person: "张三",
    update_time: "2024-12-01 10:30:00",
    create_time: "2024-11-01 09:00:00",
    accident_type: "fire_explosion",
  },
  {
    plan_id: "plan008",
    plan_name: "触电事故现场处置方案",
    plan_type_id: "onsite",
    plan_type_name: "现场处置方案",
    department_id: "dept004",
    department_name: "交通管理部门",
    status: "active",
    plan_content: `
      <h1 style="text-align:center !important;">触电事故现场处置方案</h1>

      <h2>1 事故风险分析</h2>

      <h3>1.1 事故类型</h3>
      <p>触电事故一般分为电击事故和电伤事故。</p>

      <h3>1.2 危害程度</h3>
      <p>电流通过人体内部器官，会破坏人的心脏、肺部、神经系统，使人出现痉挛、呼吸窒息、心室纤维式颤动、心跳骤停甚至死亡。电流通过体表时，会对人体外部造成局部伤害，对人体外部组织和器官造成伤害，如电灼伤、金属溅伤、电烙印。</p>

      <h3>1.3 事故征兆</h3>
      <p>作业现场出现触电事故主要有以下情况：用电设备及用电装置未按照国家规范进行设计、安装及使用；设备的金属外壳未采用保护接地措施；漏电保护装置没有定期进行检查；供电系统没有正确采用接地系统以及避雷装置；人员未正确佩戴安全防护用品等。</p>

      <h2>2 应急工作职责</h2>

      <h3>2.1 应急处置小组组成</h3>
      <p><strong>组长：</strong>项目负责人</p>
      <p><strong>副组长：</strong>项目分管安全负责人/安全总监</p>
      <p><strong>成员：</strong>各部门/小组负责人、安全管理人员等</p>

      <h3>2.2 工作职责</h3>
      <ul>
      <li>(1) 组长负责了解和掌握事故现场情况，及时向上级汇报，在上级应急指挥机构到达前负责指挥和组织现场抢救。</li>
      <li>(2) 副组长负责协助组长开展应急抢救工作。</li>
      <li>(3) 事故现场人员负责组织开展前期现场抢救。</li>
      <li>(4) 各部门/小组负责人、安全管理人员负责维护现场秩序、保护事发现场。</li>
      <li>(5) 现场带班人员在遇到险情时，有第一时间下达停产撤人命令的直接决策权和指挥权。</li>
      </ul>

      <h2>3 应急处置</h2>

      <h3>3.1 事故应急处置程序</h3>
      <ul>
      <li>(1) 按照应急职责与工作职责紧密结合，第一发现者进行事故初步判断、依据事故现场必要信息明确报警、立即启动应急处置措施，按照本应急处置预案所提供的方法进行自救或实施救护。</li>
      <li>(2) 在紧急抢救的同时，事故现场人员应立即报告本项目的应急处置小组，应急处置小组根据事故的大小和发展态势启动本项目部相应级别的应急预案。</li>
      <li>(3) 当事故超出本项目部应急处置能力时，应向当地政府有关部门及上级主管部门请求支援。</li>
      </ul>

      <h3>3.2 现场应急处置措施</h3>

      <p class="sub-content">
      <h4>3.2.1 自救方法</h4>
      <ul>
      <li>(1) 如果一旦发生事故又无人救援，此时务须镇静自救。在触电后的最初几秒内，人的意识并未完全丧失，触电者可用另一只手抓住电线绝缘处，把电线拉开摆脱触电状态。</li>
      <li>(2) 如果触电时电线或电气固定在墙上，可用脚猛蹬墙壁，同时身体往后倒，借助身体重量甩开电源。</li>
      </ul>

      <h4>3.2.2 低压触电事故脱离电源方法</h4>
      <ul>
      <li>(1) 立即拉掉开关，拔出插销，切断电源。</li>
      <li>(2) 如果电源开关距离较远，用有绝缘柄的钳子或塑料布、木板断开电源线。或用木板等绝缘材料插入触电者身下，以隔断流经人体的电流。</li>
      <li>(3) 当电线搭落在触电者身上，可用干燥的衣服、手套、绳索、木板、木棍等绝缘物作为工具，拉开触电者及挑开电线使触电者脱离电源。</li>
      </ul>

      <h4>3.2.3 高压触电事故脱离电源方法</h4>
      <ul>
      <li>(1) 立即通知有关部门停电。</li>
      <li>(2) 戴上绝缘手套，穿上绝缘鞋用相应电压等级的绝缘工具拉开开关。</li>
      <li>(3) 抛掷一端可靠接地的裸金属线使线路接地，迫使保护装置动作，断开电源。</li>
      <li>(4) 当发现有人触电后，现场有关人员立即向Maintainer围人员呼救，采取相应的抢救措施，同时向项目部负责人报告。如有人受伤，应拨打"120"向急救中心取得联系，详细说明事故地点、严重程度、联系电话，并派人到路口接应。</li>
      </ul>
      </p>

      <h3>3.3 事故报告</h3>
      <ul>
      <li>(1) 事故发生后，由项目应急处置小组组长向上级主管单位汇报事故信息。</li>
      <li>(2) 事件报告要求：事件信息准确完整，事件内容描述清晰。事件报告内容主要包括：单位名称、地址、性质；事件发生时间、地点、已经造成或者可能造成的伤亡人数（包括下落不明、涉险的人数）等。</li>
      </ul>

      <h2>4 注意事项</h2>
      <ul>
      <li>(1) 触电事故发生后，必须不失时机地进行急救，动作迅速方法正确，使触电者尽快脱离电源是救治触电者的首要条件。</li>
      <li>(2) 救护人员不可直接用手或其他金属及潮湿的构件作为救护工具，而必须使用适当的绝缘工具，救护人员要一只手操作以防自己触电。</li>
      <li>(3) 防止触电者脱离电源后可能的摔伤，特别是当触电者在高处的情况下，应考虑防摔措施。即使触电者在平地，也要注意触电者倒下的方向，注意防摔。</li>
      <li>(4) 如果事故发生在夜间，应迅速解决临时照明，以利于抢救，并避免扩大事故。</li>
      <li>(5) 人触电后，会出现神经麻痹、呼吸中断、心脏停止跳动等现象，外表上呈现昏迷不醒的假死状态，不能马上送到医院时，应立即进行现场抢救，方法是人工呼吸和胸外心脏挤压法。</li>
      </ul>

      <p class="sub-content">
      <p><strong>对口（鼻）人工呼吸法：</strong></p>
      <ul>
      <li>——使触电者仰卧，并使其头部充分后仰（可用一只手托在其颈后），使鼻孔朝上，张开其嘴，迅速取出触电者口腔内妨碍呼吸的食物等杂物，使呼吸道畅通。同时解开衣领，松开紧身衣物，排除影响胸部自然扩张的障碍。</li>
      <li>——用一手紧捏其鼻子（避免漏气），救护人员深吸一口气后紧贴触电者的口（或鼻）内吹气，约为2秒钟。吹完气后立即让其自行将气呼出，约为3秒钟。照此步骤连续不断地进行下去，每一分钟11-13次，每5秒一次。</li>
      </ul>

      <p><strong>胸外心脏按压法：</strong></p>
      <ul>
      <li>——将已脱离电源的触电者直接（不要用软垫）仰卧在木板或较坚实的地方，姿势与口对口（鼻）人工呼吸法基本相同；</li>
      <li>——抢救者骑跨在触电人的腰部或跪在腰部一侧；</li>
      <li>——抢救者两手相叠，手掌根部放在心窝上方、胸骨下三分之一至二分之一处；</li>
      <li>——抢救者关节伸直，然后依靠体重和手臂力量向下垂直用力，向脊椎方向挤压，对于成人使胸骨下陷4-5cm，间接挤压心脏达到排血的目的；</li>
      <li>——向下挤压到位后，掌根突然放松，让触电者胸部自动复原，血液充满心脏。掌根放松时应注意不能完全离开胸部，以免发生挤压点位移后造成伤害。</li>
      <li>——按照上述步骤连续不断地进行，对于成人每分钟挤压80-100次。</li>
      <li>——对于儿童，按压部位与按压频率与成人相同，用力适当轻些，动作要平稳，不可用力过猛，以免损伤胸骨，使胸骨下陷3cm。</li>
      </ul>
      </p>

      <ul>
      <li>(6) 备齐必要的应急救援物资，如车辆、医药箱、担架、氧气袋、止血带、通讯设备、照明器材等。</li>
      <li>(7) 保护好事故现场，等待事故调查组进行调查处理。</li>
      </ul>

      <h2>附件</h2>
      <ul>
      <li>1. 应急联系表（略）<br><p>应包含归口管理部门或单位电话、项目部人员联系电话，相关方人员联系电话，政府有关部门联系电话，救援部门联系电话等。</p></li>
      <li>2. 应急物质清单（略）<br><p>应包含医用急救箱、担架和应急照明灯等急救物资，应急救援车辆等。</p></li>
      </ul>
      <table border="1" cellspacing="0" cellpadding="8" style="border-collapse:collapse;width:100%;font-family:宋体;font-size:12pt;margin:20px auto;">
      <caption style="font-size:14pt;font-weight:bold;color:#CC0000;padding:10px;text-align:center;">触电事故现场处置预案（表格化）</caption>
      <tr>
      <th width="10%" style="background-color:#f2f2f2;text-align:center;">序号</th>
      <th width="15%" style="background-color:#f2f2f2;text-align:center;">事故类别</th>
      <th width="75%" style="background-color:#f2f2f2;text-align:center;">内容</th>
      </tr>
      <tr>
      <td style="text-align:center;vertical-align:top;">1</td>
      <td style="text-align:center;vertical-align:top;">事故特征</td>
      <td>
      1. 触电事故一般分为电击事故和电伤事故。<br>
      2. 电流通过人体内部器官，会破坏人的心脏、肺部、神经系统，使人出现痉挛、呼吸窒息、心室纤维式颤动、心跳骤停甚至死亡。电流通过体表时，会对人体外部造成局部伤害，对人体外部组织和器官造成伤害，如电灼伤、金属溅伤、电烙印。<br>
      3. 作业现场出现触电事故主要有：用电设备及用电装置未按照国家规范进行设计、安装及使用；设备的金属外壳未采用保护接地措施；漏电保护装置没有定期进行检查；供电系统没有正确采用接地系统以及避雷装置；人员未正确佩戴安全防护用品。
      </td>
      </tr>
      <tr>
      <td style="text-align:center;vertical-align:top;">2</td>
      <td style="text-align:center;vertical-align:top;">应急组织</td>
      <td>
      组长：项目负责人<br>
      副组长：项目分管安全负责人/安全总监<br>
      成员：各部门/小组负责人、安全管理人员等
      </td>
      </tr>
      <tr>
      <td style="text-align:center;vertical-align:top;">3</td>
      <td style="text-align:center;vertical-align:top;">应急处置</td>
      <td>
      1. 当发现有人触电后，应立即停电，采取相应抢救措施，同时向现场应急处置小组报告。<br>
      2. 如电源开关距离太远，用有绝缘柄的钳子或用木柄的斧子断开电源线。或者用木板等绝缘物插入触电者身下，以隔断流经人体的电流。<br>
      3. 当电线搭落在触电者身上，可用干燥的衣服、手套、绳索、木板、木棍等绝缘物作为工具，拉开触电者及挑开电线使触电者脱离电源。<br>
      4. 抛掷一端可靠接地的金属线使线路接地，迫使保护装置动作，断开电源。
      </td>
      </tr>
      <tr>
      <td style="text-align:center;vertical-align:top;">4</td>
      <td style="text-align:center;vertical-align:top;">注意事项</td>
      <td>
      1. 触电事故发生后，必须不失时机地进行急救，动作迅速方法正确，使触电者尽快脱离电源是救治触电者的首要条件。<br>
      2. 救护人员不可直接用手或金属及潮湿的构件作为救护工具，而必须使用适当的绝缘工具。救护人要用一只手操作，以防自己触电。<br>
      3. 人触电后会出现神经麻痹、呼吸中断、心脏停止跳动等症状，外表上呈现昏迷不醒的"假死"状态，不能马上送到医院时，应立即进行现场急救。方法是人工呼吸法和胸外心脏按压法。<br>
      4. 应保护好事故现场，等待事故调查组进行调查处理。
      </td>
      </tr>
      <tr>
      <td style="text-align:center;vertical-align:top;">5</td>
      <td style="text-align:center;vertical-align:top;">应急保障</td>
      <td>
      1. 应急救援联络电话<br>
      &nbsp;&nbsp;项目部应急救援管理办公室电话：<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u><br>
      &nbsp;&nbsp;医务急救电话：120<br>
      2. 医用急救箱、担架和应急照明灯等急救物资存放工区办公室。<br>
      3. 事故救援车辆：<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>
      </td>
      </tr>
      </table>
    `,
    responsible_person: "赵六",
    update_time: "2024-12-02 16:00:00",
    create_time: "2024-11-08 11:00:00",
    accident_type: "electric_shock",
  },
  {
    plan_id: "plan004",
    plan_name: "高处坠落事故现场处置预案",
    plan_type_id: "onsite",
    plan_type_name: "现场处置预案",
    department_id: "dept003",
    department_name: "卫生部门",
    status: "draft",
    plan_content: `
      <h1 style="text-align: center; margin-bottom: 30px;">高处坠落事故现场处置预案</h1>

<h2 style="padding-left: 10px; margin-top: 30px; color: #333;">1 事故风险分析</h2>

<h3 style="color: #666; margin-top: 20px; margin-left: 20px;">1.1 事故类型</h3>
<p style="text-indent: 2em; margin: 10px 0; margin-left: 20px;">根据高处作业者工作时所处的部位不同，高处作业坠落事故可分为临边作业高处坠落事故、洞口（预留口、通道口、楼梯口、电梯口、阳台口等）作业高处坠落事故、攀登作业高处坠落事故、悬空作业高处坠落事故、操作平台作业高处坠落事故、交叉作业高处坠落事故等。脚手架、石棉瓦等轻型屋面、拆除作业中、登高过程中、梯子上作业、其他高处作业、（铁塔上、电杆上、设备上、构架上、树上等）坠落事故等。</p>

<h3 style="color: #666; margin-top: 20px; margin-left: 20px;">1.2 危害程度</h3>
<p style="text-indent: 2em; margin: 10px 0; margin-left: 20px;">高处作业易发生高处坠落事故，造成坠落人员身体摔伤，严重的可导致人员伤亡。</p>

<h3 style="color: #666; margin-top: 20px; margin-left: 20px;">1.3 事故征兆</h3>
<p style="text-indent: 2em; margin: 10px 0; margin-left: 20px;">洞口、临边等防护设施不齐全；脚手架搭设不规范、未挂警示牌；平台不牢固、有空洞；脚手板材质或铺设不符合要求；起重吊装、吊篮架、提升架等安装不良、装置失灵导致坠落或失稳；不具备高处作业资格（条件）的人员从事高处作业；作业人员未按规定配带劳动防护用品或其存在缺陷等。</p>

<h2 style="padding-left: 10px; margin-top: 30px; color: #333;">2 应急工作职责</h2>

<h3 style="color: #666; margin-top: 20px; margin-left: 20px;">2.1 现场应急处置小组</h3>
<p style="margin: 10px 0; margin-left: 20px;"><strong>组长：</strong>项目负责人</p>
<p style="margin: 10px 0; margin-left: 20px;"><strong>副组长：</strong>项目分管安全负责人/安全总监</p>
<p style="margin: 10px 0; margin-left: 20px;"><strong>成员：</strong>各部门/小组负责人、安全管理人员等</p>

<h3 style="color: #666; margin-top: 20px; margin-left: 20px;">2.2 工作职责</h3>
<ul style="margin-left: 40px;">
<li style="margin: 5px 0;">(1) 组长负责了解和掌握事故现场情况，及时向上级汇报，在上级应急指挥机构到达前负责指挥和组织现场抢救。</li>
<li style="margin: 5px 0;">(2) 副组长负责协助组长开展应急抢救工作。</li>
<li style="margin: 5px 0;">(3) 事故现场人员负责组织开展前期现场抢救。</li>
<li style="margin: 5px 0;">(4) 各部门/小组负责人、安全管理人员负责维护现场秩序、保护事发现场。</li>
<li style="margin: 5px 0;">(5) 现场带班人员在遇到险情时，有第一时间下达停产撤人命令的直接决策权和指挥权。</li>
</ul>

<h2 style="padding-left: 10px; margin-top: 30px; color: #333;">3 应急处置</h2>

<h3 style="color: #666; margin-top: 20px; margin-left: 20px;">3.1 事故应急处置程序</h3>
<ul style="margin-left: 40px;">
<li style="margin: 5px 0;">(1) 按照应急职责与工作职责紧密结合，第一发现者进行事故初步判断、依据事故现场必要信息明确报警、立即启动应急处置措施，按照本应急处置预案所提供的方法进行自救或实施救护。</li>
<li style="margin: 5px 0;">(2) 在紧急抢救的同时，事故现场人员应立即报告本项目的应急处置小组，应急处置小组根据事故的大小和发展态势启动本项目部相应级别的应急预案。</li>
<li style="margin: 5px 0;">(3) 当事故超出本项目部应急处置能力时，应立即向当地政府有关部门及上级主管部门请求支援。</li>
</ul>

<h3 style="color: #666; margin-top: 20px; margin-left: 20px;">3.2 现场应急处置措施</h3>
<ul style="margin-left: 40px;">
<li style="margin: 5px 0;">(1) 发生高空坠落事故后，现场人员应当立即采取措施，切断或隔离危险源，防止救援过程中发生次生灾害。</li>
<li style="margin: 5px 0;">(2) 马上组织人员抢救伤者，搬除压在伤者身上的物体，立即向项目部负责人报告。</li>
<li style="margin: 5px 0;">(3) 现场人员应做好受伤人员的现场救护工作。如受伤人员出现骨折、休克或昏迷状况，应采取临时包扎止血措施，进行人工呼吸或胸外心脏挤压，尽量努力抢救伤员。</li>
<li style="margin: 5px 0;">(4) 在伤员转送之前必须进行急救处理，避免伤情扩大，途中作进一步检查，进行病史采集，以发现一些隐蔽部位的伤情，做进一步处理，减轻患者伤情。转送途中密切观察患者的瞳孔、意识、体温、脉搏、呼吸、血压等情况，有异常应及早做出相应的处理措施。</li>
<li style="margin: 5px 0;">(5) 当有人受伤严重时，应派人拨打120向当地急救中心取得联系。</li>
</ul>
    `,
    responsible_person: "赵六",
    update_time: "2024-12-01 12:20:00",
    create_time: "2024-11-04 16:00:00",
    accident_type: "fall_from_height",
  },
  {
    plan_id: "plan002",
    plan_name: "危险化学品泄漏预案",
    plan_type_id: "special",
    plan_type_name: "专项应急预案",
    department_id: "dept001",
    department_name: "安全管理部门",
    status: "active",
    plan_content: templatePlans.special,
    responsible_person: "李四",
    update_time: "2024-12-01 11:15:00",
    create_time: "2024-11-02 10:00:00",
    accident_type: "chemical_leak",
  },
  {
    plan_id: "plan014",
    plan_name: "道路交通事故现场处置预案",
    plan_type_id: "onsite",
    plan_type_name: "现场处置方案",
    department_id: "dept001",
    department_name: "安全管理部门",
    status: "active",
    plan_content: `
      <h1>道路交通事故现场处置预案</h1>
      <h2>1 事故风险分析</h2>

      <h3>1.1 事故风险因素</h3>
      <p>交通事故风险因素为：</p>
      <p><strong>物的不安全状态：</strong>车辆突发故障、车辆带"病"行驶等；</p>
      <p><strong>人的不安全行为：</strong>疲劳驾驶、超速行车、酒后驾驶、私驾公车、搭乘社会非法营运车辆等违规行为。</p>

      <h3>1.2 危害程度</h3>
      <p>可能发生因人或物的原因造成的交通事故。其造成交通事故的危险程度分析见下表：</p>

      <h4 style="text-align:center; margin-top:20px;">交通事故危险程度分析表</h4>
      <table class="analysis-table">
          <thead>
              <tr>
                  <th>序号</th>
                  <th>风险因素</th>
                  <th>风险后果</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td>1</td>
                  <td>车辆不定期检修和维护保养造成的事故</td>
                  <td>可能性：低；可控性：高；危害性：中</td>
              </tr>
              <tr>
                  <td>2</td>
                  <td>车辆带"病"行驶</td>
                  <td>可能性：低；可控性：高；危害性：中</td>
              </tr>
              <tr>
                  <td>3</td>
                  <td>疲劳驾驶</td>
                  <td>可能性：低；可控性：中；危害性：中</td>
              </tr>
              <tr>
                  <td>4</td>
                  <td>超速行车</td>
                  <td>可能性：低；可控性：低；危害性：大</td>
              </tr>
              <tr>
                  <td>5</td>
                  <td>酒后驾驶</td>
                  <td>可能性：中；可控性：低；危害性：大</td>
              </tr>
              <tr>
                  <td>6</td>
                  <td>私驾公车</td>
                  <td>可能性：低；可控性：高；危害性：中</td>
              </tr>
              <tr>
                  <td>7</td>
                  <td>搭乘社会非法营运车辆</td>
                  <td>可能性：中；可控性：高；危害性：中</td>
              </tr>
          </tbody>
      </table>

      <h3>1.3 事故征兆</h3>
      <p>交通事故判断的基本征兆即车辆受损、人身伤害。</p>

      <h2>2 应急工作职责</h2>

      <h3>2.1 应急处置小组组成</h3>
      <p><strong>组长：</strong>项目负责人</p>
      <p><strong>副组长：</strong>项目分管安全负责人或安全总监</p>
      <p><strong>成员：</strong>小组负责人、安全管理人员等</p>

      <h3>2.2 工作职责</h3>
      <p>应急处置小组的分工与设置，在交通事故应急期间为：</p>
      <table border="1" cellspacing="0" cellpadding="8" style="border-collapse:collapse;width:100%;font-family:宋体;font-size:12pt;margin:20px auto;">
      <caption style="font-size:14pt;font-weight:bold;color:#CC0000;padding:10px;text-align:center;">道路交通事故现场处置预案（表格化）</caption>
      <tr>
      <th width="10%" style="background-color:#f2f2f2;text-align:center;">序号</th>
      <th width="15%" style="background-color:#f2f2f2;text-align:center;">事故类别</th>
      <th width="75%" style="background-color:#f2f2f2;text-align:center;">内容</th>
      </tr>
      <tr>
      <td style="text-align:center;vertical-align:top;">1</td>
      <td style="text-align:center;vertical-align:top;">事故特征</td>
      <td>
      <p>1. 物的不安全状态：车辆突发故障、车辆带“病”行驶等。人的不安全行为：疲劳驾驶、超速行车、酒后驾驶、私驾公车、搭乘社会非法营运车辆等违规行为。</p>
      <p>2. 可能发生因人或物的原因造成的交通事故。总体来看，车辆发生道路交通事故的可能性较低，但如果不能及时发现并先期处置，将会造成较大影响。</p>
      <p>3. 交通事故判断的基本征兆即车辆受损、人身伤害.</p>
      </td>
      </tr>
      <tr>
      <td style="text-align:center;vertical-align:top;">2</td>
      <td style="text-align:center;vertical-align:top;">应急组织</td>
      <td>
      <p>组长：项目负责人</p>
      <p>副组长：项目分管安全负责人/安全总监</p>
      <p>成员：各部门/小组负责人、安全管理人员等</p>
      <p>根据项目实际可成立抢险救援组、疏散引导组、联络通讯组、后勤保障组和安全警戒组等。</p>
      </td>
      </tr>
      <tr>
      <td style="text-align:center;vertical-align:top;">3</td>
      <td style="text-align:center;vertical-align:top;">应急处置</td>
      <td>
      <p>1. 发生交通事故，条件允许条件下，必须立即停车，开启应急灯；夜间需开启示宽灯、尾灯；在高速公路上，需在肇事点同向车道后按规定设置危险警告标志；做好防火防盗措施。</p>
      <p>2. 若驾乘人员未受伤或受不影响行动的轻伤，应拨打122电话报警，同时向交通应急领导小组报告，并拨打保险公司电话报案。</p>
      <p>3. 若现场有人受伤或驾乘人员受伤，应立即拨打或委托他人拨打120急救电话和122报警电话，说明事故地点、伤员人数等情况，等待救援。</p>
      <p>4. 若有人因为外伤流血，应采用包扎、止血带、填塞等方法进行止血，等待120医务人员到达现场做进一步治疗。</p>
      <p>5. 若有人被困无法救出，应立即拨打119电话，说明情况，等待救援。同时，利用现场工具，积极组织力所能及的自救。</p>
      <p>6. 若现场发生火灾，应立即拨打119报警电话，说明情况，等待救援。同时，根据现场火势，可利用现场灭火器材灭火。</p>
      </td>
      </tr>
      <tr>
      <td style="text-align:center;vertical-align:top;">4</td>
      <td style="text-align:center;vertical-align:top;">注意事项</td>
      <td>
      <p>1. 及时报案。</p>
      <p>2. 做好防火防爆措施。</p>
      <p>3. 受伤者无法从车内下车时，设法将其移出，避免二次受伤。</p>
      <p>4. 现场保护：作好现场原始状态，车辆、人员、牲畜、遗留物痕迹、散落物等不得随意摆动位置。为现场抢救伤员必须移动位置的，应作好原始位置标记。不得故意破坏现场，在交警部门未到达之前，可用绳索等设置警戒线，以保护现场。</p>
      <p>5. 配合处理：当事人必须如实向公安交通管理机关陈述事发经过，不得隐瞒、歪曲交通事故的真实情况，积极配合协助交警部门做好事故处理及善后工作，并听候处理。</p>
      </td>
      </tr>
      <tr>
      <td style="text-align:center;vertical-align:top;">5</td>
      <td style="text-align:center;vertical-align:top;">应急保障</td>
      <td>
      <p>1. 应急救援联络电话</p>
      <p>&nbsp;&nbsp;项目部应急救援管理办公室电话：<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u></p>
      <p>&nbsp;&nbsp;医务急救电话：120</p>
      <p>2. 医用急救箱、担架和应急照明灯等急救物资存放工区办公室。</p>
      <p>3. 事故救援车辆（如有）：<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u></p>
      </td>
      </tr>
      </table>
    `,
    responsible_person: "王五",
    update_time: "2024-12-04 11:00:00",
    create_time: "2024-11-14 09:00:00",
    accident_type: "otherDisaster",
  },
  {
    plan_id: "plan015",
    plan_name: "物体打击事故现场处置预案",
    plan_type_id: "onsite",
    plan_type_name: "现场处置预案",
    department_id: "dept002",
    department_name: "应急管理部门",
    status: "active",
    plan_content: `
       <table border="1" cellspacing="0" cellpadding="8" style="border-collapse:collapse;width:100%;font-family:宋体;font-size:12pt;margin:20px auto;">
        <caption style="font-size:14pt;font-weight:bold;color:#CC0000;padding:10px;text-align:center;">物体打击事故现场处置预案（表格化）</caption>
        <tr>
        <th width="10%" style="background-color:#f2f2f2;text-align:center;">序号</th>
        <th width="15%" style="background-color:#f2f2f2;text-align:center;">事故类别</th>
        <th width="75%" style="background-color:#f2f2f2;text-align:center;">内容</th>
        </tr>
        <tr>
        <td style="text-align:center;vertical-align:top;">1</td>
        <td style="text-align:center;vertical-align:top;">事故特征</td>
        <td>
        <p>1. 在高空作业中，物体坠落伤人；人为抛掷杂物伤人；起重吊装、拆装、拆模时，物料掉落伤人；爆破作业中飞石伤人；孤石及危石松动坠落伤人；张拉作业意外伤人等。</p>
        <p>2. 由于作业人员违规作业、材料堆放不平衡、装运物不规范等原因，坠落物或飞出物速度快，对作业人员造成伤害，甚至威胁生命，事故发生往往突然。</p>
        <p>3. 洞室内及路基边坡有危石或清理不彻底；临边、洞口等无防护或防护不可靠；物料堆放不平稳；高处作业人员未使用工具袋，乱扔乱抛物料（工具）；起重吊装、拆卸、爆破等作业未设警戒线，人员进入危险区；设备、张拉作业防护不到位等。</p>
        </td>
        </tr>
        <tr>
        <td style="text-align:center;vertical-align:top;">2</td>
        <td style="text-align:center;vertical-align:top;">应急组织</td>
        <td>
        <p>组长：项目负责人</p>
        <p>副组长：项目分管安全负责人/安全总监</p>
        <p>成员：各部门/小组负责人、安全管理人员等</p>
        <p>根据项目实际可成立抢险救援组、疏散引导组、联络通讯组、后勤保障组和安全警戒组等。</p>
        </td>
        </tr>
        <tr>
        <td style="text-align:center;vertical-align:top;">3</td>
        <td style="text-align:center;vertical-align:top;">应急处置</td>
        <td>
        <p>(1) 发生物体打击事故后，现场人员应当观察是否还存在坠落物和飞出物，立即采取措施，防止救援过程中再次发生伤害。</p>
        <p>(2) 应马上组织人员抢救伤者，搬除压在伤者身上的物体，同时应立即向项目部负责人报告。</p>
        <p>(3) 伤者受到物体打击，可能无法移动伤者，尽量当场施救。抢救的重点放在颅脑损伤、胸部骨折和出血上进行处理。</p>
        <p>(4) 当有人受伤严重时，应派人拨打120向当地急救中心取得联系，详细说明事故地点、严重程度、联系电话，并派人到路口接应。</p>
        </td>
        </tr>
        <tr>
        <td style="text-align:center;vertical-align:top;">4</td>
        <td style="text-align:center;vertical-align:top;">注意事项</td>
        <td>
        1. 当发生物体打击时，应优先对休克、骨折和出血者进行处理，应先救命，后治伤。
        2. 重伤员运送应用担架。腹部及脊柱损伤者，应用卧位运送；胸部伤者一般取卧位；颅脑损伤者一般取仰卧偏头或侧卧位。
        3. 抢救失血者，应先进行止血；抢救休克者，应采取保暖措施，防止热损耗；抢救脊椎受伤者，应将伤者平卧放在帆布担架或硬板上，严禁只抬伤者的两肩与两腿或单肩背运。
        4. 备齐必要的应急救援物资，如车辆、医药箱、担架、氧气袋、止血带、通讯设备等。
        5. 应保护好物体打击伤害事故现场，等待事故调查组进行调查处理。
        </td>
        </tr>
        <tr>
        <td style="text-align:center;vertical-align:top;">5</td>
        <td style="text-align:center;vertical-align:top;">应急保障</td>
        <td>
        <p>1. 应急救援联络电话</p>
        <p>&nbsp;&nbsp;项目部应急救援管理办公室电话：<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u></p>
        <p>&nbsp;&nbsp;医务急救电话：120</p>
        <p>2. 医用急救箱、担架和应急照明灯等急救物资存放工区办公室。</p>
        <p>3. 事故救援车辆：<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u></p>
        </td>
        </tr>
        </table>
    
    `,
    responsible_person: "张三",
    update_time: "2024-12-01",
    create_time: "2024-11-14 09:00:00",
    accident_type: "otherDisaster",
  },
  {
    plan_id: "plan016",
    plan_name: "溺水事故现场处置预案",
    plan_type_id: "onsite",
    plan_type_name: "现场处置预案",
    department_id: "dept002",
    department_name: "应急管理部门",
    status: "active",
    plan_content: `
      <h1 style="text-align: center; margin-bottom: 30px;padding-bottom: 10px;">溺水事故现场处置预案</h1>

      <h2 style="color: #333;padding-left: 10px; margin-top: 30px;">1 事故风险描述</h2>
      <p style="text-indent: 2em; margin: 10px 0;">本预案适用于本项目涉水作业区域，主要针对作业或巡查期间人员意外落水导致的溺水事故。事故风险包括但不限于：人员失足落水、水上作业设施故障倾覆、突发恶劣天气导致人员落水等。溺水事故发生突然，发展迅速，若处置不当或救援不及时，极易导致人员伤亡。</p>

      <h2 style="color: #333;padding-left: 10px; margin-top: 30px;">2 应急工作职责</h2>

      <h3 style="color: #666; margin-top: 20px; margin-left: 20px;">2.1 现场第一发现人/目击者</h3>
      <p style="text-indent: 2em; margin: 10px 0; margin-left: 20px;">立即高声呼救，在确保自身安全的前提下，迅速利用现场可及的救生器材（如救生圈、竹竿、绳索等）进行初步施救，并立即报告现场负责人或应急处置小组。</p>

      <h3 style="color: #666; margin-top: 20px; margin-left: 20px;">2.2 现场负责人/班组长</h3>
      <p style="text-indent: 2em; margin: 10px 0; margin-left: 20px;">接报后立即赶赴现场，指挥现场初期救援，组织协调现场可用资源，维护现场秩序，并立即向项目部应急处置小组报告。</p>

      <h3 style="color: #666; margin-top: 20px; margin-left: 20px;">2.3 项目部应急处置小组</h3>
      <ul style="margin-left: 40px;">
      <li style="margin: 5px 0;"><strong>组长：</strong>全面负责应急指挥、决策和协调；决定启动和终止应急预案；负责信息上报和对外联络。</li>
      <li style="margin: 5px 0;"><strong>副组长：</strong>协助组长工作，负责现场具体指挥与协调，调配应急资源。</li>
      <li style="margin: 5px 0;"><strong>抢险救援组：</strong>由具备相应救护知识和技能的人员组成，负责实施落水人员的救援、打捞及初步医疗救护。</li>
      <li style="margin: 5px 0;"><strong>医疗救护组：</strong>负责对获救溺水人员进行现场急救，配合专业医护人员进行转运。</li>
      <li style="margin: 5px 0;"><strong>警戒疏散组：</strong>负责事故现场警戒，疏散无关人员，保障救援通道畅通，引导外部救援力量进入。</li>
      <li style="margin: 5px 0;"><strong>后勤保障组：</strong>负责应急物资的调集、供应，保障通信、交通、照明等应急支持。</li>
      <li style="margin: 5px 0;"><strong>善后处理组：</strong>负责事故善后处理、家属联络，协助事故调查。</li>
      </ul>

      <h3 style="color: #666; margin-top: 20px; margin-left: 20px;">2.4 项目部全体人员</h3>
      <p style="text-indent: 2em; margin: 10px 0; margin-left: 20px;">熟悉本预案，掌握基本急救知识，服从应急指挥，积极参与或配合救援行动。</p>

      <h2 style="color: #333; padding-left: 10px; margin-top: 30px;">3 应急处置</h2>

      <h3 style="color: #666; margin-top: 20px; margin-left: 20px;">3.1 应急处置程序</h3>
      <p style="text-indent: 0; margin: 10px 0; margin-left: 20px;"><strong>（1）初步判断与报警：</strong>事故发生后，现场人员应迅速判断事故性质、地点及危害程度，立即高声呼救，并按照本预案方法进行自救或互救。</p>
      <p style="text-indent: 0; margin: 10px 0; margin-left: 20px;"><strong>（2）启动内部应急响应：</strong>在紧急施救的同时，现场人员应立即报告本项目部应急处置小组。应急处置小组根据事故严重程度和发展态势，立即启动本项目相应级别的应急预案，各应急小组按职责迅速展开行动。</p>
      <p style="text-indent: 0; margin: 10px 0; margin-left: 20px;"><strong>（3）请求外部支援：</strong>当事故超出本项目应急处置能力时，应急处置小组组长应立即下令向当地政府应急管理部门、公安（110）、消防（119）、急救中心（120）及上级主管部门请求支援。</p>

      <h3 style="color: #666; margin-top: 20px; margin-left: 20px;">3.2 现场应急处置措施</h3>
      <p style="text-indent: 0; margin: 10px 0; margin-left: 20px;"><strong>3.2.1 落水人员自救</strong></p>
      <p style="text-indent: 2em; margin: 10px 0; margin-left: 20px;">落水后应尽量保持冷静，切勿惊慌失措、大声喊叫，以免水呛入呼吸道。尽可能抓住身边的漂浮物（如木板、塑料桶等）。采用踩水、仰漂等方式保持头部露出水面，节省体力。利用头部露出水面间隙，深吸气后屏气，规律换气，等待救援。</p>

      <p style="text-indent: 0; margin: 10px 0; margin-left: 20px;"><strong>3.2.2 水上救援实施</strong></p>
      <p style="margin-left: 20px;"><strong>间接救援（优先）：</strong>救援人员应在岸上或船上，利用救生圈、抛绳包、竹竿、长棍等物品伸向或抛给溺水者，将其拖回。</p>
      <p style="margin-left: 20px;"><strong>直接下水救援（需具备专业能力）：</strong></p>
      <ul style="margin-left: 60px;">
      <li style="margin: 5px 0;">救援人员必须穿戴好救生衣等个人防护装备。</li>
      <li style="margin: 5px 0;">接近溺水者时，应避免被其慌乱中抓抱。对神志清醒者，应从背后接近，用手从其腋下穿过环抱其胸部，或托其头部，采用侧泳或反蛙泳将其带离。</li>
      <li style="margin: 5px 0;">对已昏迷者，可从正面接近，拖拽其衣领或夹住其腋下，使其口鼻露出水面，迅速游向安全区域。</li>
      </ul>

      <p style="text-indent: 0; margin: 10px 0; margin-left: 20px;"><strong>3.2.3 岸上急救</strong></p>
      <p style="margin-left: 20px;">溺水者被救上岸后，立即按以下步骤实施：</p>
      <ol style="margin-left: 60px;">
      <li style="margin: 5px 0;"><strong>迅速评估：</strong>立即检查其意识和呼吸、心跳。</li>
      <li style="margin: 5px 0;"><strong>清理气道：</strong>迅速清除其口、鼻中的泥沙、水草、呕吐物等，解开衣领、腰带，保持呼吸道畅通。对牙关紧闭者，可捏其两侧颊肌用力启开。</li>
      <li style="margin: 5px 0;"><strong>控水处理：</strong>若溺水者呼吸心跳存在，但有明显呼吸道阻塞或腹部膨胀，可进行控水。将溺水者置于俯卧位，腹部垫高，头部下垂，拍击其背部，促使水流出。控水时间不宜过长。</li>
      <li style="margin: 5px 0;"><strong>心肺复苏（CPR）：</strong>若溺水者无意识、无呼吸或仅有濒死喘息，应立即进行心肺复苏。
      <ul style="margin-left: 20px;">
      <li><strong>顺序：</strong>C-A-B（胸外按压-开放气道-人工呼吸）。</li>
      <li><strong>胸外按压：</strong>部位为胸骨中下1/3交界处或两乳头连线中点。按压深度成人5-6厘米，儿童约5厘米，婴儿约4厘米。频率100-120次/分钟。按压与放松时间大致相等，保证胸廓充分回弹。</li>
      <li><strong>开放气道：</strong>采用仰头抬颏法。</li>
      <li><strong>人工呼吸：</strong>捏住患者鼻子，口对口吹气，每次吹气约1秒，看到胸廓抬起即可。按压与通气比为30:2。</li>
      </ul>
      </li>
      <li style="margin: 5px 0;"><strong>持续救护：</strong>持续进行CPR，直至患者恢复自主呼吸和心跳，或专业急救人员到达接手。</li>
      </ol>

      <p style="text-indent: 0; margin: 10px 0; margin-left: 20px;"><strong>3.2.4 医疗支援与转运</strong></p>
      <p style="text-indent: 2em; margin: 10px 0; margin-left: 20px;">在进行现场急救的同时，应立即拨打“120”急救电话，清晰报告事故地点、人数、伤情、联系人及电话，并派人在显著位置接应。将溺水者用担架平稳转移至救护车，向医护人员交代伤情及已实施的救治措施。</p>

      <h3 style="color: #666; margin-top: 20px; margin-left: 20px;">3.3 事故报告</h3>
      <ol style="margin-left: 40px;">
      <li style="margin: 5px 0;"><strong>内部报告：</strong>事故发生后，现场负责人应立即向项目部应急处置小组组长报告。组长在组织救援的同时，按规定时限向上级主管单位报告。</li>
      <li style="margin: 5px 0;"><strong>外部报告：</strong>根据事态发展，按法律法规要求向地方政府应急管理、住建、安监等有关部门报告。</li>
      <li style="margin: 5px 0;"><strong>报告内容：</strong>单位名称、地址、性质；事件发生时间、地点、类别；已造成或可能造成的伤亡人数（包括失踪、涉险人数）；当前现场处置情况；已采取的措施；报告单位、联系人及联系方式等。</li>
      </ol>

      <h2 style="color: #333; padding-left: 10px; margin-top: 30px;">4 注意事项</h2>
      <ul style="margin-left: 40px;">
      <li style="margin: 5px 0;">坚持“以人为本、科学施救”原则，优先确保救援人员自身安全。未经专业训练者，严禁盲目下水施救。</li>
      <li style="margin: 5px 0;">下水救援时，须穿戴合格救生装备，并注意防止被溺水者慌乱中抱紧导致双双遇险。可递送漂浮物让溺水者抓住后再接近。</li>
      <li style="margin: 5px 0;">救援过程中，可对昏迷溺水者尝试边拖带边进行口对口人工呼吸。</li>
      <li style="margin: 5px 0;">进行人工呼吸和胸外心脏按压时，方法必须正确，动作规范，避免造成二次伤害。儿童按压力度应适当减轻。</li>
      <li style="margin: 5px 0;">定期检查、维护和补充应急救援物资（如救生衣、救生圈、绳索、担架、急救箱、应急照明、救援船只/车辆等），确保随时可用。</li>
      <li style="margin: 5px 0;">事故救援结束后，应保护现场，设立警戒，配合事故调查组进行勘查取证。做好现场记录和影像资料的收集整理。</li>
      <li style="margin: 5px 0;">做好获救人员及受影响人员的心理疏导工作。</li>
      </ul>
    `,
    responsible_person: "张三",
    update_time: "2024-12-01",
    create_time: "2024-11-14 09:00:00",
    accident_type: "otherDisaster",
  },

  {
    plan_id: "plan003",
    plan_name: "机械伤害事故预案",
    plan_type_id: "special",
    plan_type_name: "专项应急预案",
    department_id: "dept002",
    department_name: "应急管理部门",
    status: "inactive",
    plan_content: `<p>机械伤害事故应急响应流程...</p>`,
    responsible_person: "王五",
    update_time: "2024-12-01 09:45:00",
    create_time: "2024-11-03 14:00:00",
    accident_type: "mechanical_injury",
  },
  {
    plan_id: "plan005",
    plan_name: "有限空间作业事故预案",
    plan_type_id: "special",
    plan_type_name: "专项应急预案",
    department_id: "dept001",
    department_name: "安全管理部门",
    status: "active",
    plan_content: `<p>有限空间作业事故应急响应流程...</p>`,
    responsible_person: "张三",
    update_time: "2024-12-01 13:00:00",
    create_time: "2024-11-05 08:00:00",
    accident_type: "confined_space",
  },
  {
    plan_id: "plan006",
    plan_name: "中毒窒息事故预案",
    plan_type_id: "special",
    plan_type_name: "专项应急预案",
    department_id: "dept002",
    department_name: "应急管理部门",
    status: "active",
    plan_content: `<p>中毒窒息事故应急响应流程...</p>`,
    responsible_person: "李四",
    update_time: "2024-12-02 14:00:00",
    create_time: "2024-11-06 09:30:00",
    accident_type: "poisoning_asphyxiation",
  },
  {
    plan_id: "plan007",
    plan_name: "起重伤害事故预案",
    plan_type_id: "special",
    plan_type_name: "专项应急预案",
    department_id: "dept003",
    department_name: "卫生部门",
    status: "active",
    plan_content: `<p>起重伤害事故应急响应流程...</p>`,
    responsible_person: "王五",
    update_time: "2024-12-02 15:00:00",
    create_time: "2024-11-07 10:00:00",
    accident_type: "lifting_injury",
  },
  {
    plan_id: "plan009",
    plan_name: "地震应急预案",
    plan_type_id: "special",
    plan_type_name: "专项应急预案",
    department_id: "dept002",
    department_name: "应急管理部门",
    status: "active",
    plan_content: `<p>地震应急响应流程...</p>`,
    responsible_person: "李四",
    update_time: "2024-12-03 10:00:00",
    create_time: "2024-11-09 12:00:00",
    accident_type: "earthquake",
  },
  {
    plan_id: "plan010",
    plan_name: "洪水应急预案",
    plan_type_id: "special",
    plan_type_name: "专项应急预案",
    department_id: "dept003",
    department_name: "卫生部门",
    status: "active",
    plan_content: `<p>洪水应急响应流程...</p>`,
    responsible_person: "王五",
    update_time: "2024-12-03 11:00:00",
    create_time: "2024-11-10 13:00:00",
    accident_type: "flood",
  },
  {
    plan_id: "plan011",
    plan_name: "台风应急预案",
    plan_type_id: "special",
    plan_type_name: "专项应急预案",
    department_id: "dept004",
    department_name: "交通管理部门",
    status: "active",
    plan_content: `<p>台风应急响应流程...</p>`,
    responsible_person: "赵六",
    update_time: "2024-12-03 12:00:00",
    create_time: "2024-11-11 14:00:00",
    accident_type: "typhoon",
  },
  {
    plan_id: "plan013",
    plan_name: "专项应急预案",
    plan_type_id: "special",
    plan_type_name: "专项应急预案",
    department_id: "dept002",
    department_name: "应急管理部门",
    status: "active",
    plan_content: `<p>专项应急预案内容...</p>`,
    responsible_person: "李四",
    update_time: "2024-12-04 10:00:00",
    create_time: "2024-11-13 16:00:00",
    accident_type: "otherDisaster",
  },
  {
    plan_id: "plan014",
    plan_name: "部门应急预案",
    plan_type_id: "department",
    plan_type_name: "部门应急预案",
    department_id: "dept003",
    department_name: "卫生部门",
    status: "active",
    plan_content: `<p>部门应急预案内容...</p>`,
    responsible_person: "王五",
    update_time: "2024-12-04 11:00:00",
    create_time: "2024-11-14 09:00:00",
    accident_type: "otherDisaster",
  },
];
