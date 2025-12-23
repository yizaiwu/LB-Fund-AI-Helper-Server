import React, { useState, useEffect } from 'react';
import { Fund, fetchFunds, deleteFund } from '../services/api';

interface FundListProps {
  refreshTrigger: number;
}

export const FundList: React.FC<FundListProps> = ({ refreshTrigger }) => {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFunds = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchFunds();
      setFunds(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '獲取基金資料失敗');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFunds();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這筆基金資料嗎？')) return;

    try {
      await deleteFund(id);
      setFunds(funds.filter(f => f.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : '刪除失敗');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p className="text-slate-600">加載中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p className="text-red-600">❌ {error}</p>
        <button
          onClick={loadFunds}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          重試
        </button>
      </div>
    );
  }

  if (funds.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p className="text-slate-600">📭 暫無基金資料，請先上傳 Markdown 文件</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900">
          📊 基金資料列表 ({funds.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">基金名稱</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">代碼</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">類別</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">描述</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">操作</th>
            </tr>
          </thead>
          <tbody>
            {funds.map((fund) => (
              <tr key={fund.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-900">{fund.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{fund.code}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{fund.category}</td>
                <td className="px-6 py-4 text-sm text-slate-600 truncate max-w-xs">
                  {fund.description}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleDelete(fund.id)}
                    className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
