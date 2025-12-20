/**
 * AI服务模块
 * 处理与AI系统的通信和数据分析
 */

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * 调用AI API进行艺术作品分析
 * @param {File} imageFile - 要分析的图像文件
 * @param {string} prompt - 可选的自定义提示词
 * @returns {Promise<Object>} 分析结果
 */
export const analyzeArtwork = async (imageFile, prompt = '') => {
  try {
    // 创建 FormData
    const formData = new FormData();
    formData.append('file', imageFile);
    if (prompt) {
      formData.append('prompt', prompt);
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
      data: result.data
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

// 导出默认对象
const aiService = {
  analyzeArtwork
};

export default aiService;
