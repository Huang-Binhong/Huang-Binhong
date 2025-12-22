/**
 * AI服务模块
 * 处理与AI系统的通信和数据分析
 */

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * 调用AI API进行艺术作品分析
 * @param {File} imageFile - 要分析的图像文件
 * @param {string} prompt - 可选的自定义提示词
 * @param {string} category - 作品类别（书法/画作）
 * @param {number|string} workId - 作品ID
 * @returns {Promise<Object>} 分析结果
 */
export const analyzeArtwork = async (imageFile, prompt = '', category = '', workId = null) => {
  try {
    // 创建 FormData
    const formData = new FormData();
    formData.append('file', imageFile);
    if (prompt) {
      formData.append('prompt', prompt);
    }
    if (category) {
      formData.append('category', category);
    }
    if (workId) {
      // 确保workId是整数类型
      const workIdInt = typeof workId === 'string' ? parseInt(workId, 10) : workId;
      formData.append('work_id', workIdInt.toString());
    }

    // 调用后端 API
    const response = await fetch(`${API_BASE}/api/ai/analyze`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API请求失败: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || '分析失败');
    }

    return {
      success: true,
      data: result.data,
      cached: result.cached || false
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
 * 与AI进行对话
 * @param {number|string} workId - 作品ID
 * @param {string} question - 用户问题
 * @returns {Promise<Object>} 对话结果
 */
export const chatWithAI = async (workId, question) => {
  try {
    // 确保workId是整数类型
    const workIdInt = typeof workId === 'string' ? parseInt(workId, 10) : workId;

    const response = await fetch(`${API_BASE}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        work_id: workIdInt,
        question: question,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API请求失败: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || '对话失败');
    }

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    console.error('AI对话出错:', error);
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

// 导出默认对象
const aiService = {
  analyzeArtwork,
  chatWithAI
};

export default aiService;
