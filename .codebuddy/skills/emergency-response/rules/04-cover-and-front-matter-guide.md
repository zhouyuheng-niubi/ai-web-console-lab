# 应急预案封面及前置文档编写指南

本指南涵盖应急预案封面、编制小组成立通知、发布实施令、执行部门签署页等前置文档的编写技能。

## 一、封面编写技能

### 1.1 封面必备核心内容

应急预案封面必须包含以下核心要素：

| 要素类别 | 具体内容 | 格式要求 |
|---------|---------|---------|
| 单位名称 | XX有限责任公司 | 红色宋体加粗，居中，字号36pt |
| 预案名称 | 生产安全事故应急预案 | 黑色黑体加粗，居中，字号22pt |
| 编号 | XX/2026 | 黑体，字号14pt，右对齐 |
| 版本号 | XX版/0次修改 | 黑体，字号14pt，右对齐 |
| 编制 | 编制人员姓名 | 宋体，字号12pt |
| 审核 | 审核人员姓名 | 宋体，字号12pt |
| 批准 | 批准人员姓名 | 宋体，字号12pt |
| 状态 | 现行/废止等 | 宋体，字号12pt |
| 发布日期 | YYYY-MM-DD | 宋体，字号12pt，左对齐 |
| 实施日期 | YYYY-MM-DD | 宋体，字号12pt，右对齐 |

### 1.2 封面HTML格式规范

```html
<!-- 封面 -->
<div style="page-break-after: always; text-align: center; padding-top: 100pt;">
    <!-- 单位名称（红头） -->
    <p style="font-family: '黑体', 'SimHei', sans-serif; font-size: 22pt; font-weight: bold; color: #000000; margin-bottom: 20pt; text-align: center;">
        XX有限责任公司
    </p>
    
    <!-- 预案名称（根据用户输入动态生成） -->
    <p style="font-family: '黑体', 'SimHei', sans-serif; font-size: 22pt; font-weight: bold; color: #000000; margin-bottom: 60pt; text-align: center;">
        [预案名称]
    </p>
    
    <!-- 编制信息表格 -->
    <table style="width: 60%; margin: 0 auto; border: none;">
        <tr>
            <td style="border: none; text-align: right; font-family: '黑体', 'SimHei', sans-serif; font-size: 14pt; padding: 8pt 0;">编  号：</td>
            <td style="border: none; text-align: left; font-family: '宋体', 'SimSun', serif; font-size: 14pt; padding: 8pt 0;">XX/2026</td>
        </tr>
        <tr>
            <td style="border: none; text-align: right; font-family: '黑体', 'SimHei', sans-serif; font-size: 14pt; padding: 8pt 0;">版本号：</td>
            <td style="border: none; text-align: left; font-family: '宋体', 'SimSun', serif; font-size: 14pt; padding: 8pt 0;">XX版/0次修改</td>
        </tr>
        <tr>
            <td style="border: none; text-align: right; font-family: '黑体', 'SimHei', sans-serif; font-size: 14pt; padding: 8pt 0;">编  制：</td>
            <td style="border: none; text-align: left; font-family: '宋体', 'SimSun', serif; font-size: 14pt; padding: 8pt 0;"></td>
        </tr>
        <tr>
            <td style="border: none; text-align: right; font-family: '黑体', 'SimHei', sans-serif; font-size: 14pt; padding: 8pt 0;">审  核：</td>
            <td style="border: none; text-align: left; font-family: '宋体', 'SimSun', serif; font-size: 14pt; padding: 8pt 0;">XX</td>
        </tr>
        <tr>
            <td style="border: none; text-align: right; font-family: '黑体', 'SimHei', sans-serif; font-size: 14pt; padding: 8pt 0;">批  准：</td>
            <td style="border: none; text-align: left; font-family: '宋体', 'SimSun', serif; font-size: 14pt; padding: 8pt 0;">XX</td>
        </tr>
        <tr>
            <td style="border: none; text-align: right; font-family: '黑体', 'SimHei', sans-serif; font-size: 14pt; padding: 8pt 0;">状  态：</td>
            <td style="border: none; text-align: left; font-family: '宋体', 'SimSun', serif; font-size: 14pt; padding: 8pt 0;"></td>
        </tr>
    </table>
    
    <!-- 发布和实施日期 -->
    <div style="margin-top: 80pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt;">
        <p style="text-align: left; margin-left: 100pt;">2025-12-31  发布</p>
        <p style="text-align: right; margin-right: 100pt;">2026-01-01  实施</p>
    </div>
</div>
```

## 二、编制小组成立通知编写技能

### 2.1 红头文件格式规范

编制小组成立通知必须采用红头文件格式，包含以下要素：

| 要素类别 | 具体内容 | 格式要求 |
|---------|---------|---------|
| 单位文件头 | XX有限责任公司文件 | 红色宋体加粗，居中，字号36pt |
| 文件字号 | XX应急〔2026〕1号 | 黑色宋体加粗，居中，字号3号（16pt） |
| 分隔线 | 红色3磅实线 | 红色线条，宽度100%，居中 |
| 标题 | 关于成立《[预案名称]》编制小组的通知 | 黑体加粗，居中，字号16pt |
| 主送机关 | 公司各部门 | 宋体，字号12pt，左对齐 |
| 正文内容 | 编制目的、依据、人员组成 | 宋体，字号12pt，首行缩进2字符 |
| 落款 | 单位名称、日期 | 宋体，字号12pt，右对齐 |

### 2.2 编制小组成立通知HTML格式规范

```html
<!-- 编制小组成立通知 -->
<div style="page-break-after: always;">
    <!-- 单位文件头（红头） -->
    <p style="font-family: '宋体', 'SimSun', serif; font-size: 36pt; font-weight: bold; color: #FF0000; text-align: center; margin-bottom: 10pt;">
        XX有限责任公司文件
    </p>
    
    <!-- 文件字号 -->
    <p style="font-family: '宋体', 'SimSun', serif; font-size: 16pt; font-weight: bold; color: #000000; text-align: center; margin-bottom: 10pt;">
        XX应急〔2026〕1号
    </p>
    
    <!-- 红色分隔线 -->
    <div style="border-top: 3pt solid #FF0000; margin: 10pt 0; width: 100%;"></div>
    
    <!-- 标题 -->
    <p style="font-family: '黑体', 'SimHei', sans-serif; font-size: 16pt; font-weight: bold; text-align: center; margin-bottom: 20pt;">
        关于成立《[预案名称]》编制小组的通知
    </p>
    
    <!-- 主送机关 -->
    <p style="font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: left; margin-bottom: 12pt;">
        公司各部门：
    </p>
    
    <!-- 正文 -->
    <p style="font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: justify; text-indent: 2em; line-height: 1.5; margin-bottom: 12pt;">
        为了积极响应和认真贯彻落实《安全生产事故应急预案管理办法》（应急管理部令第2号）等文件的精神和要求，完善公司应急预案体系，增强安全生产事故应急处理能力，经研究决定成立《XX有限责任公司生产安全事故应急预案》编制小组。其具体人员组成如下：
    </p>
    
    <p style="font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: left; text-indent: 2em; line-height: 1.5; margin-bottom: 6pt;">
        组  长：XX
    </p>
    <p style="font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: left; text-indent: 2em; line-height: 1.5; margin-bottom: 6pt;">
        副组长：XX
    </p>
    <p style="font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: left; text-indent: 2em; line-height: 1.5; margin-bottom: 12pt;">
        组  员：XX、XX、XX、XX
    </p>
    
    <p style="font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: left; text-indent: 2em; line-height: 1.5; margin-bottom: 40pt;">
        特此通知！
    </p>
    
    <!-- 落款 -->
    <div style="text-align: right; margin-right: 40pt; margin-bottom: 60pt;">
        <p style="font-family: '宋体', 'SimSun', serif; font-size: 12pt; margin-bottom: 6pt;">
            XX有限责任公司
        </p>
        <p style="font-family: '宋体', 'SimSun', serif; font-size: 12pt;">
            2026年12月31日
        </p>
    </div>
</div>
```

## 三、发布实施令编写技能

### 3.1 发布实施令核心内容

| 要素类别 | 具体内容 | 格式要求 |
|---------|---------|---------|
| 文件字号 | XX应急〔2026〕2号 | 红色黑体，居中，字号36pt |
| 标题 | 关于《生产安全事故应急预案》的发布实施令 | 黑体加粗，居中，字号16pt |
| 发布依据 | 法律法规、标准规范 | 宋体，字号12pt |
| 发布内容 | 预案名称、批准日期、实施日期 | 宋体，字号12pt |
| 执行要求 | 培训、演练、执行要求 | 宋体，字号12pt |
| 签署 | 主要负责人签名 | 手写签名区域 |
| 落款 | 单位名称、日期 | 宋体，字号12pt，右对齐 |

### 3.2 发布实施令HTML格式规范

```html
<!-- 发布实施令 -->
<div style="page-break-after: always;">
    <!-- 文件字号（红头） -->
    <p style="font-family: '宋体', 'SimSun', serif; font-size: 36pt; font-weight: bold; color: #FF0000; text-align: center; margin-bottom: 20pt;">
        XX应急〔2026〕2号
    </p>
    
    <!-- 标题 -->
    <p style="font-family: '黑体', 'SimHei', sans-serif; font-size: 16pt; font-weight: bold; text-align: center; margin-bottom: 20pt;">
        关于《[预案名称]》的发布实施令
    </p>
    
    <!-- 正文 -->
    <p style="font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: justify; text-indent: 2em; line-height: 1.5; margin-bottom: 12pt;">
        为认真贯彻执行相关法律法规的规定，预防安全生产事故发生，确保一旦发生重大事故后能及时控制事态，防止重大事故蔓延，有效地组织抢险和救助，保障员工人身安全及企业财产安全，依据《生产经营单位生产安全事故应急预案编制导则》（GB/T 29639-2020），结合本公司实际，本着"预防为主、平战结合、快速响应、果断处置"的原则，编制了本公司《生产安全事故应急预案》，并于2026年3月31日批准发布，2026年4月1日正式实施。请本公司全体员工遵照执行。
    </p>
    
    <p style="font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: justify; text-indent: 2em; line-height: 1.5; margin-bottom: 40pt;">
        本《生产安全事故应急预案》是本公司应对突发事故实施应急救援工作的规范性文件，用于规范指导生产安全事故的应急救援行动，各部门应按照《生产安全事故应急预案》内容与要求，对员工进行培训和训练，以便有效预防各类生产安全事故的发生，在重大事故发生时，能及时按照预案方案进行救援，在短时间内使事故得到有效控制。
    </p>
    
    <!-- 落款和签名 -->
    <div style="text-align: right; margin-right: 40pt; margin-bottom: 60pt;">
        <p style="font-family: '宋体', 'SimSun', serif; font-size: 12pt; margin-bottom: 30pt;">
            XX有限责任公司
        </p>
        <p style="font-family: '宋体', 'SimSun', serif; font-size: 12pt; margin-bottom: 6pt;">
            主要负责人（签名）：
        </p>
        <p style="font-family: '宋体', 'SimSun', serif; font-size: 12pt;">
            2026年3月31日
        </p>
    </div>
</div>
```

## 四、执行部门签署页编写技能

### 4.1 执行部门签署页核心内容

| 要素类别 | 具体内容 | 格式要求 |
|---------|---------|---------|
| 文件字号 | XX应急〔2026〕3号 | 红色黑体，居中，字号16pt |
| 标题 | 关于《生产安全事故应急预案》执行部门签署页 | 黑体加粗，居中，字号16pt |
| 编制依据 | 法律法规、标准规范 | 宋体，字号12pt |
| 签署表格 | 部门名称、能否执行、签字确认、时间 | 表格形式 |

### 4.2 执行部门签署页HTML格式规范

```html
<!-- 执行部门签署页 -->
<div style="page-break-after: always;">
    <!-- 文件字号（红头） -->
    <p style="font-family: '宋体', 'SimSun', serif; font-size: 36pt; font-weight: bold; color: #FF0000; text-align: center; margin-bottom: 20pt;">
        XX应急〔2026〕3号
    </p>
    
    <!-- 标题 -->
    <p style="font-family: '黑体', 'SimHei', sans-serif; font-size: 16pt; font-weight: bold; text-align: center; margin-bottom: 20pt;">
        关于《[预案名称]》执行部门签署页
    </p>
    
    <!-- 正文 -->
    <p style="font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: justify; text-indent: 2em; line-height: 1.5; margin-bottom: 20pt;">
        根据《生产安全事故应急预案管理办法》、《生产经营单位生产安全事故应急预案编制导则》（GB/T 29639-2020）以及公司生产安全事故应急预案的相关要求，相关执行部门签署意见如下：
    </p>
    
    <!-- 签署表格 -->
    <table style="width: 100%; border-collapse: collapse; margin-top: 20pt;">
        <thead>
            <tr>
                <th style="border: 1pt solid #000; padding: 8pt; background-color: #E7E7E7; font-family: '黑体', 'SimHei', sans-serif; font-size: 12pt; font-weight: bold; text-align: center; width: 8%;">序号</th>
                <th style="border: 1pt solid #000; padding: 8pt; background-color: #E7E7E7; font-family: '黑体', 'SimHei', sans-serif; font-size: 12pt; font-weight: bold; text-align: center; width: 22%;">部门名称</th>
                <th style="border: 1pt solid #000; padding: 8pt; background-color: #E7E7E7; font-family: '黑体', 'SimHei', sans-serif; font-size: 12pt; font-weight: bold; text-align: center; width: 25%;">能否执行预案中内容</th>
                <th style="border: 1pt solid #000; padding: 8pt; background-color: #E7E7E7; font-family: '黑体', 'SimHei', sans-serif; font-size: 12pt; font-weight: bold; text-align: center; width: 25%;">部门签字确认</th>
                <th style="border: 1pt solid #000; padding: 8pt; background-color: #E7E7E7; font-family: '黑体', 'SimHei', sans-serif; font-size: 12pt; font-weight: bold; text-align: center; width: 20%;">时间</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;">1</td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;">生产部</td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;">能  否</td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;"></td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;"></td>
            </tr>
            <tr>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;">2</td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;">人事行政部</td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;">能  否</td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;"></td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;"></td>
            </tr>
            <tr>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;">3</td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;">财务部</td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;">能  否</td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;"></td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;"></td>
            </tr>
            <tr>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;">4</td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;">仓储部</td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;">能  否</td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;"></td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;"></td>
            </tr>
            <tr>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;">5</td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;">品质工程部</td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;">能  否</td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;"></td>
                <td style="border: 1pt solid #000; padding: 8pt; font-family: '宋体', 'SimSun', serif; font-size: 12pt; text-align: center;"></td>
            </tr>
        </tbody>
    </table>
</div>
```

## 五、红头文件通用格式要求

### 5.1 字体规范

| 文件要素 | 字体 | 字号 | 颜色 | 其他 |
|---------|------|------|------|------|
| 单位文件头 | 宋体 | 36pt | 红色(#FF0000) | 加粗，居中 |
| 文件字号 | 宋体 | 3号(16pt) | 黑色(#000000) | 加粗，居中 |
| 分隔线 | - | 3pt | 红色(#FF0000) | 实线，宽度100% |
| 标题 | 黑体 | 16pt | 黑色(#000000) | 加粗，居中 |
| 正文 | 宋体 | 12pt | 黑色(#000000) | 首行缩进2字符 |
| 表格表头 | 黑体 | 12pt | 黑色(#000000) | 加粗，居中，灰色背景 |
| 表格内容 | 宋体 | 12pt | 黑色(#000000) | 居中或左对齐 |
| 落款 | 宋体 | 12pt | 黑色(#000000) | 右对齐 |

### 5.2 排版规范

| 排版要素 | 规范要求 |
|---------|---------|
| 页边距 | 上下左右各2.54cm |
| 行距 | 1.5倍行距 |
| 段落间距 | 段前段后各6pt |
| 对齐方式 | 正文两端对齐，标题居中，落款右对齐 |
| 页码 | 页面底部居中，阿拉伯数字 |

### 5.3 样式优先级

所有style绑定的属性样式都需添加 `!important` 标记，确保样式不被覆盖。

## 六、封面与前置文档生成流程

### 6.1 自动生成流程

生成应急预案时，应按照以下顺序生成封面和前置文档：

1. **封面**：包含单位名称、预案名称、编号、版本号、编制/审核/批准/状态、发布/实施日期
2. **编制小组成立通知**（XX应急〔YYYY〕1号）
3. **发布实施令**（XX应急〔YYYY〕2号）
4. **执行部门签署页**（XX应急〔YYYY〕3号）
5. **正文内容**：从总则开始

### 6.2 信息提取要求

生成封面和前置文档时，需要从用户输入中提取以下信息：

| 信息类别 | 提取内容 | 用途 |
|---------|---------|------|
| 企业名称 | XX有限责任公司 | 封面单位名称、落款、红头文件头 |
| 预案名称 | [根据用户输入] | 封面预案名称、通知标题、红头文件标题 |
| 年份 | 2026 | 文件字号、日期 |
| 编制人员 | XX | 封面编制栏 |
| 审核人员 | XX | 封面审核栏、发布令签名 |
| 批准人员 | XX | 封面批准栏 |
| 发布日期 | YYYY-MM-DD | 封面、发布令 |
| 实施日期 | YYYY-MM-DD | 封面、发布令 |
| 编制小组成员 | 组长、副组长、组员 | 编制小组成立通知 |
| 执行部门 | 部门名称列表 | 执行部门签署页 |

## 七、注意事项

1. **文件字号连续性**：同一预案的红头文件字号应连续编号，如1号、2号、3号
2. **日期一致性**：封面、发布令、签署页中的日期应保持一致
3. **人员信息准确性**：编制、审核、批准人员应与实际一致
4. **签名区域**：发布令应预留主要负责人签名区域
5. **签署页空白**：执行部门签署页的签字确认和时间列应留空白，供手写填写
