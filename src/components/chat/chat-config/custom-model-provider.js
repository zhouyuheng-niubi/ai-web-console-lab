import { ref } from 'vue';
import { BaseModelProvider } from '@opentiny/tiny-robot-kit';
export const controller = ref({
  signal: null,
  resolve: null,
});
export class CustomModelProvider extends BaseModelProvider {
  constructor(options, { toolCallHandler, validator, getClientId }) {
    super();
    this.options = options || {};
    this.toolCallHandler = toolCallHandler;
    this.validator = validator;
    this.getClientId = getClientId;
  }
  async getData(request) {
    const verifyCode = await this.validator?.genCode();
    controller.value.signal = new AbortController();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'connector-client-id': this.getClientId(),
        'mcp-verify-code': verifyCode,
      },
      // 智能问答和分析请求
      body: JSON.stringify({
        messages: request.messages,
        llmModel: 'qwen-plus',
        // milvusCollectionName: 'knowledge_1755670594',
        milvusCollectionName: 'knowledge_1760425969',
        mcpServers: {
          'baidu-map-mcp': {
            ak: 'hupgDZFosbJ1wtWNV1io9Ql0X8xrnVsU',
          },
        },
      }),
      //隐患排查
      // body: JSON.stringify({
      //   messages:
      //     [{
      //       "role": "user",
      //       "content": [
      //         {
      //           "type": "video_url",
      //           "video_url": { "url": "https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20241115/cqqkru/1.mp4" }
      //         },
      //         {
      //           "type": "image_url",
      //           "image_url": {
      //             "url": "https://mp-ee5300dd-3fe6-4d07-be7d-e2574309c763.cdn.bspapp.com/xh.jpg"
      //           }
      //         },
      //         {
      //           "type": "text",
      //           "text": `请基于上传图片/视频开展**全维度安全隐患识别**：

    	// 	       输出结果需与「AI图片隐患识别与记录」工具的「recognizedHazards」参数结构完全匹配，每处隐患必须完整包含以下6个核心字段（字段定义及示例如下），禁止遗漏、简化或更改格式：
    	// 	       隐患类别（hazardType）：从预设类型中精准归类，可选类型包括但不限于：电气裸露、消防器材缺失、通道堵塞、未戴安全帽、设备防护缺失、安全标识缺失、人员违规操作、物料堆放违规；
    	// 	       隐患详情（hazardDesc）：需包含“具体位置+隐患状态+潜在风险”；
    	// 	       判定依据（basisRule）：优先匹配**行业核心标准**，需含“标准名称+编号+条款内容摘要”；
    	// 	       整改建议（rectifySuggestion）：需分“紧急程度+具体动作+验证标准”，如“【紧急】立即关闭配电箱门并上锁，由电工检查接线端子绝缘状态，确保无裸露后张贴‘有电危险’标识”“【一般】清理应急通道堆放的物料，确保通道宽度不小于1.2米，张贴‘保持畅通’警示标识”。
    	// 	      `
      //         },
      //       ]
      //     }]
      //   ,
      //   mcpToolDes: '调用MCP工具「HazardRecognition」（工具功能名：AI图片隐患识别与记录）',
      //   rankedDocsScore: 1,
      //   usageProcess: 'VisionTerminal', //LLMDriven 智能问答、风险分析   VisionTerminal隐患排查（通用版本）  VideoMultiStage隐患排查（专项版本）、智能识别共用属性：    
      //   milvusCollectionName: 'knowledge_1755670594',
      //   mcpServers: {
      //     'baidu-map-mcp': {
      //       ak: 'hupgDZFosbJ1wtWNV1io9Ql0X8xrnVsU'
      //     },
      //   },
      // }),
      signal: controller.value.signal?.signal,
    };

    const response = await fetch(
      `${import.meta.env.VITE_NEWAI_API}/ai/chat/jaa`,
      options,
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, details: ${errorText}`,
      );
    }
    return response;
  }

  async chat(request) {
    try {
      const response = await this.getData(request);
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let text = '';

      // 逐块读取流数据
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });

        try {
          const message = JSON.parse(chunk.slice(6));

          const extra = message.choices[0].delta.extra;
          if (
            this.toolCallHandler &&
            extra &&
            this.toolCallHandler.shouldHandle(extra)
          ) {
            text += this.toolCallHandler.handlerStatic(extra);
            continue;
          }
          text += message.choices[0].delta.content;
        } catch (error) {
          text += '';
        }
      }

      return { choices: [{ message: { content: text } }] };
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await this.validator?.clearCode();
    }
  }

  async chatStream(request, handler) {
    const { onData, onDone, onError } = handler;
    let reader = null;
    try {
      const response = await this.getData(request);
      reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        // Append new chunk to buffer
        buffer += decoder.decode(value, { stream: true });
        // Process complete lines from buffer
        while (true) {
          const lineEnd = buffer.indexOf('\n');
          if (lineEnd === -1) break;
          const line = buffer.slice(0, lineEnd).trim();
          buffer = buffer.slice(lineEnd + 1);
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              // onData({ choices: [{ delta: { content: '/end' } }] });
              break;
            }
            try {
              const parsed = JSON.parse(data);
              const extra = parsed.choices[0].delta.extra;
              if (
                this.toolCallHandler &&
                extra &&
                this.toolCallHandler.shouldHandle(extra)
              ) {
                // this.toolCallHandler.handler(extra, handler);
                continue;
              }
              const content = parsed.choices[0].delta.content;
              if (content) {
                onData({ choices: [{ delta: { content } }] });
              }
            } catch (e) {
              // Ignore invalid JSON
            }
          }
        }
      }
      onDone();
      // onData({ choices: [{ delta: { content: '/end' } }] });
    } catch (error) {
      // onData({ choices: [{ delta: { content: '/end' } }] });
      onError(error);
      throw error;
    } finally {
      reader?.cancel();
      this.validator?.clearCode();
      // onData({ choices: [{ delta: { content: '/end' } }] });
    }
  }

  destroy() {
    this.toolCallHandler?.cleanup();
  }
}
