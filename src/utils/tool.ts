
export const omit = (obj: any, keysToOmit: string[]) => {
  // 如果 obj 不是对象或者 keysToOmit 不是数组，则直接返回 obj
  if (typeof obj !== 'object' || !Array.isArray(keysToOmit)) {
    return obj;
  }

  // 创建一个新的对象，避免修改原始对象
  const result = {} as any;

  // 遍历 obj 的所有键值对
  for (const key in obj) {
    // 如果当前键不在要忽略的键列表中，则复制到新对象
    if (!keysToOmit.includes(key)) {
      result[key] = obj[key];
    }
  }

  return result;
};
export const get = (object: any, path: string) => {
  // 如果 object 不是对象或者 path 不是字符串，则直接返回 defaultValue
  if (
    typeof object !== 'object' ||
    object === null ||
    typeof path !== 'string'
  ) {
    return object;
  }

  // 将路径字符串转换为数组
  const pathArray = path.split('.').filter(Boolean); // 过滤掉空字符串
  let current = object;

  // 遍历路径数组
  for (const element of pathArray) {
    // 如果当前层级不是对象或没有对应的键，则返回 defaultValue
    if (
      typeof current !== 'object' ||
      current === null ||
      !(element in current)
    ) {
      return object;
    }
    // 更新 current 到下一层级
    current = current[element];
  }

  // 返回最终找到的值
  return current;
};
export const ifDetail = (renderCallbackParams: any): boolean => {
  const schema = renderCallbackParams.schema;
  if(typeof schema.ifDetail === 'function'){
    return schema.ifDetail(renderCallbackParams);

  }
 
  return schema.ifDetail !== false;
};


// 获取子节点id
export const getChildIds = (record: any) => {
  const ids = [record.id];
  record.children?.forEach((item: any) => {
    ids.push(...getChildIds(item));
  });
  return ids;
};

/**
 * 获取所有叶子节点
 * @param treeData
 */
export const getLeafNodeIds = (treeData: any) => {
  const leafNodeIds: any = [];

  function traverse(node: any) {
    // 如果当前节点没有 children 或 children 是空数组，则它是叶子节点
    if (!node.children || node.children.length === 0) {
      leafNodeIds.push(node.id);
    } else {
      // 否则，递归遍历每个子节点
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  // 遍历树的根节点
  for (const root of treeData) {
    traverse(root);
  }
  return leafNodeIds;
};

/**
 * 获取所有节点id
 * @param treeData
 */
export const getAllNodeIds = (treeData: any) => {
  const allNodeIds: any = [];

  function traverse(node: any) {
    // 收集当前节点的 id
    allNodeIds.push(node.id);

    // 如果当前节点有 children，则递归遍历每个子节点
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  // 遍历树的根节点
  for (const root of treeData) {
    traverse(root);
  }

  return allNodeIds;
};

/**
 * -转大驼峰
 * @param str
 */
export const toPascalCase = (str: any) => {
  // 将连字符或下划线替换为空格，以便后续处理
  const words = str.replaceAll(/[-_]/g, ' ').split(' ');

  // 将每个单词的首字母大写，并将其余部分保持原样
  const pascalCaseWords = words.map((word: any) => {
    if (word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return word;
  });

  // 将处理后的单词拼接成一个新的字符串
  return pascalCaseWords.join('');
};

/**
 * 转-kebab
 */
export const toKebabCase = (str: string) => {
  // 将每个单词的首字母小写，并在单词之间插入连字符
  return str
    .replaceAll(/([A-Z])/g, (match, _p1, offset) => {
      // 如果是第一个字符，直接转为小写
      if (offset === 0) {
        return match.toLowerCase();
      }
      // 否则，在大写字母前加上连字符，并将大写字母转为小写
      return `-${match.toLowerCase()}`;
    })
    .toLowerCase(); // 确保整个字符串都是小写
};
/**
 * 检查传入的字符串是否为有效的HTTP或HTTPS URL。
 *
 * @param {string} url 要检查的字符串。
 * @return {boolean} 如果字符串是有效的HTTP或HTTPS URL，返回true，否则返回false。
 */
export function isHttpUrl(url?: string): boolean {
  if (!url) {
    return false;
  }
  // 使用正则表达式测试URL是否以http:// 或 https:// 开头
  const httpRegex = /^https?:\/\/.*$/;
  return httpRegex.test(url);
}

/**
 * 生成带Logo（左侧）和文本的水印
 * @param {Object} config - 水印配置
 * @param {string[]} config.texts - 多行文本数组
 * @param {string} config.logoUrl - Logo图片URL
 * @param {number} config.density - 水印密度（控制Canvas大小）
 * @param {number} config.fontSize - 字体大小
 * @param {string} config.color - 文本颜色
 * @param {number} config.angle - 旋转角度
 * @param {number} config.logoSize - Logo大小
 * @param {number} config.spacing - 文本行间距
 * @param {number} config.gap - Logo与文本间距
 * @returns {Promise<string>} - 水印图片的Base64数据
 */
export const generateWatermark = (config) => {
  return new Promise((resolve, reject) => {
    const {
      texts = ['Default Watermark'],
      logoUrl,
      density = 150,
      fontSize = 14,
      color = 'rgba(100, 100, 100, 0.2)',
      angle = -20,
      logoSize = 20,
      spacing = 20,
      gap = 10, // Logo与文本之间的间距
    } = config;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 设置Canvas尺寸 - 根据密度调整
    canvas.width = density * 2;
    canvas.height = density * 2;

    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = 'left'; // 改为左对齐
    ctx.textBaseline = 'middle';

    // 平移和旋转坐标系
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((Math.PI / 180) * angle);

    // 如果有Logo，先绘制Logo
    if (logoUrl) {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';

      logoImg.onload = () => {
        // 计算文本总高度
        const textHeight = texts.length * (fontSize + spacing) - spacing;

        // 绘制Logo（在左侧）
        const logoX = -((logoSize + gap) / 2); // Logo位置偏左
        const logoY = -textHeight / 2;
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

        // 绘制文本（在Logo右侧）
        texts.forEach((text, index) => {
          const textX = logoX + logoSize + gap; // 文本起始位置在Logo右侧
          const textY =
            index * (fontSize + spacing) -
            ((texts.length - 1) * (fontSize + spacing)) / 2;
          ctx.fillText(text, textX, textY);
        });

        resolve(canvas.toDataURL('image/png'));
      };

      logoImg.onerror = () => {
        // Logo加载失败时只绘制文本
        drawTextOnly();
        resolve(canvas.toDataURL('image/png'));
      };

      logoImg.src = logoUrl;
    } else {
      drawTextOnly();
      resolve(canvas.toDataURL('image/png'));
    }

    function drawTextOnly() {
      // 只绘制文本（无Logo时）
      texts.forEach((text, index) => {
        const yPosition =
          index * (fontSize + spacing) -
          ((texts.length - 1) * (fontSize + spacing)) / 2;
        ctx.fillText(text, 0, yPosition);
      });
    }
  });
};

/**
 * 2025-10-17T17:30:01.361709 转成时间戳
 * @param isoString ISO 8601格式的时间字符串
 * @returns 时间戳（毫秒）
 */
export const isoToTimestamp = (isoString: string): number => {
    if (!isoString) return 0
    try {
        return new Date(isoString).getTime()
    } catch (error) {
        console.error('ISO时间转换时间戳失败:', error)
        return 0
    }
}


function zeroize(num:number) {
    return (String(num).length == 1 ? "0" : "") + num;
}
/**
 * @param {timestamp} /1000 单位秒
 * @returns {accurate}  是否需要精确显示
 * 1分钟以内显示为：刚刚
    1小时以内显示为：N分钟前
    当天以内显示为：今天 N点N分（如：今天 22:33）
    昨天时间显示为：昨天 N点N分（如：昨天 10:15）
    当年以内显示为：N月N日 N点N分（如：09月17日 09:33）
    今年以前显示为：N年N月N日 N点N分（如：2022年10月17日 15:59）
 */
export const dealDateMethod = (timestamp:number,accurate:boolean = false) => {
    let currentStamp = new Date().getTime() / 1000
    var curTimestamp = parseInt(currentStamp); //当前时间戳
    var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
    
    var curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
    var tmDate = new Date(timestamp * 1000); // 参数时间戳转换成的日期对象
    var Y = tmDate.getFullYear(),
        m = tmDate.getMonth() + 1,
        d = tmDate.getDate();
    var H = tmDate.getHours(),
        i = tmDate.getMinutes(),
        s = tmDate.getSeconds();
    
    //针对评论 首先判断是否需要精确显示
    let minutDifff = 60 //1分钟以内
    if (accurate && timestampDiff < minutDifff) { 
        return "刚刚";
    } else if (accurate && timestampDiff < 3600) {
        return Math.floor(timestampDiff / 60) + "分钟前";
    }
    // end

    else if (
        curDate.getFullYear() == Y &&
        curDate.getMonth() + 1 == m &&
        curDate.getDate() == d
    ) {
        // 一天内
        return "今天" + zeroize(H) + ":" + zeroize(i);
    } else {
        var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
        if (
            newDate.getFullYear() == Y &&
            newDate.getMonth() + 1 == m &&
            newDate.getDate() == d
        ) {
            // 昨天
            return "昨天" + zeroize(H) + ":" + zeroize(i);
        } else if (curDate.getFullYear() == Y) {
            // 一年内
            return (
                zeroize(m) +
                "月" +
                zeroize(d) +
                "日 " +
                zeroize(H) +
                ":" +
                zeroize(i)
            );
        } else {
            // 一年之前
            return (
                Y +
                "-" +
                zeroize(m) +
                "-" +
                zeroize(d) +
                " " +
                zeroize(H) +
                ":" +
                zeroize(i)
            );
        }
    }
}


export function stopAllNativeAudioElements() {
  try {
    console.log('停止所有原生音频元素...');
    
    // 停止所有可能正在播放的音频元素
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      try {
        if (!audio.paused) {
          audio.pause();
          audio.currentTime = 0;
          // 在 iOS Safari 中，还需要设置 src 为空来确保完全停止
          audio.src = '';
          console.log('已停止音频元素:', audio.src);
        }
      } catch (error) {
        console.warn('停止音频元素时出错:', error);
      }
    });
    
    console.log(`已检查${audioElements.length}个音频元素，已停止正在播放的元素`);
    return true;
  } catch (error) {
    console.error('停止所有原生音频元素失败:', error);
    return false;
  }
}

// 获取所有非叶子节点的key
export const getAllNodeKeys = (nodes) => {
    const keys = []
    if (!nodes) return keys
    
    nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
            keys.push(node.key)
            keys.push(...getAllNodeKeys(node.children))
        }
    })
    return keys
}

// src/utils/base64Converter.js
/**
 * 转换项目内静态文件为 Base64
 * @param {string} filePath 文件路径（assets 需 import，public 直接写 /xxx.png）
 * @returns {Promise<string|null>} Base64 编码字符串
 */
export async function staticFileToBase64(filePath) {
  try {
    // 1. 请求文件获取 Blob
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`请求失败：${response.status}`);
    const blob = await response.blob();

    // 2. 读取 Blob 为 Base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); // Base64 结果
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(blob); // 核心方法
    });
  } catch (error) {
    console.error("静态文件转 Base64 失败：", error);
    return null;
  }
}

// 全屏
export const enterFullscreen = (element) => {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.webkitRequestFullscreen) { /* Safari */
    element.webkitRequestFullscreen()
  } else if (element.msRequestFullscreen) { /* IE11 */
    element.msRequestFullscreen()
  }
}


// 退出全屏

export const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen()
  }
}

export const getCurrentLocation = (func?:any) => {
  const BMap_AK = import.meta.env.VITE_BMAP_AK;
  const BMap_URL =
    `${import.meta.env.VITE_GLOB_URL_BAIDU}/api?v=2.0&s=1&ak=${BMap_AK}&callback=onBMapCallback`;
  const myBMap = new Promise((resolve, reject) => {
    if (typeof BMap !== "undefined") {
      resolve(BMap);
      return true;
    }
    window.onBMapCallback = function () {
      resolve(BMap);
    };
    // 插入script脚本
    let scriptNode = document.createElement("script");
    scriptNode.setAttribute("type", "text/javascript");
    scriptNode.setAttribute("src", BMap_URL);
    document.body.appendChild(scriptNode);
  });
  myBMap.then((BMap) => {
    // 浏览器定位  &&  开启SDK辅助定位 && 获取城市
    let geolocation = new BMap.Geolocation()
    geolocation.enableSDKLocation() // 开启SDK辅助定位
    geolocation.getCurrentPosition(function (r) {
      if(this.getStatus() == BMAP_STATUS_SUCCESS){
        const point1 = new BMap.Point(r.point.lng, r.point.lat);
        const geo = new BMap.Geocoder();
        console.log(r,'定位信息')
        console.log(point1,'定位信息')
        geo.getLocation(point1, (res) => {
          console.log(res,'定位信息')
          const content= {
            latitude: res?.point?.lat || 0,
            longitude: res?.point?.lng || 0,
            locality: r.address.city,
            subAdministrativeArea: r.address.city,
            administrativeArea: r.address.province,
            subLocality:r.address.district,
            roadName:r.address.street,
            placeName:res?.address || '',
          }
          if(typeof func === 'function') func(JSON.stringify(content))
        });
      }
    })
  })
  
}