/**
 * AI服务模块
 * 处理与AI系统的通信和数据分析
 */

/**
 * 调用AI API进行艺术作品分析
 * @param {File} imageFile - 要分析的图像文件
 * @returns {Promise<Object>} 分析结果
 */
export const analyzeArtwork = async (imageFile) => {
  try {
    // 将图片文件转换为base64格式
    const base64Image = await convertToBase64(imageFile);
    
    // 构造API请求参数，严格按照示例格式
    const requestData = {
      model: "doubao-seed-1-6-flash-250828",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            },
            {
              type: "text",
              text: "请分析这幅艺术作品，解释笔法、墨色层次、构图布局、题款用印等特点，并介绍作品背后的故事。"
            }
          ]
        }
      ]
    };

    // 严格按照示例中的方式调用AI API（需要设置ARK_API_KEY环境变量）
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_ARK_API_KEY || 'YOUR_API_KEY_HERE'}`
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('AI分析出错:', error);
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

/**
 * 将图片文件转换为base64编码
 * @param {File} file - 图片文件
 * @returns {Promise<string>} base64编码字符串
 */
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // 移除data URL前缀，只保留base64部分
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// 导出默认对象
const aiService = {
  analyzeArtwork
};

export default aiService;