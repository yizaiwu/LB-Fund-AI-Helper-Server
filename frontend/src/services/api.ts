const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://fund-analyzer-api.zeabur.app';

export interface Fund {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  data: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  funds: Fund[];
}

// 上傳 Markdown 文件
export const uploadFunds = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`上傳失敗: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('上傳基金資料失敗:', error);
    throw error;
  }
};

// 獲取所有基金資料
export const fetchFunds = async (): Promise<Fund[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/funds`);
    
    if (!response.ok) {
      throw new Error(`獲取失敗: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('獲取基金資料失敗:', error);
    throw error;
  }
};

// 刪除基金
export const deleteFund = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/funds/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`刪除失敗: ${response.statusText}`);
    }
  } catch (error) {
    console.error('刪除基金失敗:', error);
    throw error;
  }
};

// 健康檢查
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('後端服務不可用:', error);
    return false;
  }
};
