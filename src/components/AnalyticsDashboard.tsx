import React, { useState, useEffect, useCallback } from 'react';

// 类型定义
interface OnlineVisitor {
  id: string;
  visitor_id: string;
  session_id: string;
  ip_address: string;
  country: string;
  city: string;
  page_url: string;
  page_title: string;
  browser: string;
  os: string;
  device_type: string;
  started_at: string;
  last_activity_at: string;
  page_views: number;
}

interface StatsOverview {
  totalVisitors: number;
  newVisitors: number;
  returningVisitors: number;
  totalPageViews: number;
  avgDuration: number;
  bounceRate: number;
}

interface TopPage {
  path: string;
  title: string;
  views: number;
}

interface TopCountry {
  country: string;
  count: number;
}

interface TrafficSource {
  source: string;
  count: number;
}

interface DailyStat {
  date: string;
  visitors: number;
  pageViews: number;
}

interface AnalyticsData {
  overview: StatsOverview;
  topPages: TopPage[];
  topCountries: TopCountry[];
  trafficSources: TrafficSource[];
  dailyStats: DailyStat[];
}

// 格式化时间
function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// 格式化时长
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}秒`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分${seconds % 60}秒`;
  return `${Math.floor(seconds / 3600)}时${Math.floor((seconds % 3600) / 60)}分`;
}

// 设备图标
function DeviceIcon({ type }: { type: string }) {
  if (type === 'mobile') {
    return <i className="fa-solid fa-mobile-screen text-blue-500"></i>;
  }
  if (type === 'tablet') {
    return <i className="fa-solid fa-tablet-screen-button text-purple-500"></i>;
  }
  return <i className="fa-solid fa-desktop text-green-500"></i>;
}

// 访问统计仪表盘组件
const AnalyticsDashboard: React.FC = () => {
  const [period, setPeriod] = useState<'24h' | '7d' | '30d'>('7d');
  const [onlineVisitors, setOnlineVisitors] = useState<OnlineVisitor[]>([]);
  const [stats, setStats] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 加载数据
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [onlineRes, statsRes] = await Promise.all([
        fetch('/api/analytics/online'),
        fetch(`/api/analytics/stats?period=${period}`),
      ]);

      const onlineData = await onlineRes.json();
      const statsData = await statsRes.json();

      if (onlineData.success) {
        setOnlineVisitors(onlineData.data || []);
      }
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error('Load analytics error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    loadData();
    // 每30秒刷新在线访客
    const interval = setInterval(() => {
      fetch('/api/analytics/online')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOnlineVisitors(data.data || []);
          }
        })
        .catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, [loadData]);

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#D4AF37] rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-500">加载统计数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 时间范围选择 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">访问统计</h2>
        <div className="flex items-center gap-2">
          {(['24h', '7d', '30d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                period === p
                  ? 'bg-[#D4AF37] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p === '24h' ? '24小时' : p === '7d' ? '7天' : '30天'}
            </button>
          ))}
          <button
            onClick={loadData}
            className="ml-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <i className="fa-solid fa-refresh"></i>
          </button>
        </div>
      </div>

      {/* 实时在线访客 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            实时在线访客 ({onlineVisitors.length})
          </h3>
        </div>

        {onlineVisitors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 font-medium text-gray-500">位置</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500">当前页面</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500">设备</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500">浏览</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500">进入时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {onlineVisitors.map((visitor) => (
                  <tr key={visitor.session_id} className="hover:bg-gray-50">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <DeviceIcon type={visitor.device_type} />
                        <div>
                          <p className="font-medium text-gray-900">{visitor.country || 'Unknown'}</p>
                          <p className="text-xs text-gray-400">{visitor.city || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <p className="text-gray-700 truncate max-w-[200px]">{visitor.page_title || visitor.page_url}</p>
                    </td>
                    <td className="py-2 px-3">
                      <div className="text-gray-500">
                        <p>{visitor.browser}</p>
                        <p className="text-xs">{visitor.os}</p>
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {visitor.page_views} 页
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-500">
                      {formatTime(visitor.started_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <i className="fa-solid fa-users text-3xl mb-2"></i>
            <p>暂无在线访客</p>
          </div>
        )}
      </div>

      {/* 概览统计 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500 mb-1">总访客</p>
          <p className="text-2xl font-bold text-gray-900">{stats?.overview.totalVisitors || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500 mb-1">新访客</p>
          <p className="text-2xl font-bold text-green-600">{stats?.overview.newVisitors || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500 mb-1">回访客</p>
          <p className="text-2xl font-bold text-blue-600">{stats?.overview.returningVisitors || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500 mb-1">页面浏览</p>
          <p className="text-2xl font-bold text-gray-900">{stats?.overview.totalPageViews || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500 mb-1">平均停留</p>
          <p className="text-2xl font-bold text-gray-900">{formatDuration(stats?.overview.avgDuration || 0)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500 mb-1">跳出率</p>
          <p className="text-2xl font-bold text-orange-600">{stats?.overview.bounceRate || 0}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 热门页面 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-fire text-orange-500"></i>
            热门页面
          </h3>
          <div className="space-y-3">
            {stats?.topPages && stats.topPages.length > 0 ? (
              stats.topPages.map((page, index) => (
                <div key={page.path} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    index === 2 ? 'bg-orange-50 text-orange-600' :
                    'bg-gray-50 text-gray-400'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{page.title || page.path}</p>
                    <p className="text-xs text-gray-400 truncate">{page.path}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">{page.views}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-4">暂无数据</p>
            )}
          </div>
        </div>

        {/* 国家/地区分布 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-globe text-blue-500"></i>
            国家/地区分布
          </h3>
          <div className="space-y-3">
            {stats?.topCountries && stats.topCountries.length > 0 ? (
              stats.topCountries.map((item) => (
                <div key={item.country} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <span className="text-sm">🌍</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.country}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-4">暂无数据</p>
            )}
          </div>
        </div>
      </div>

      {/* 流量来源 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i className="fa-solid fa-route text-purple-500"></i>
          流量来源
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats?.trafficSources && stats.trafficSources.length > 0 ? (
            stats.trafficSources.map((item) => (
              <div key={item.source} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">{item.count}</p>
                <p className="text-sm text-gray-500 capitalize">{item.source}</p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400 py-4">暂无数据</p>
          )}
        </div>
      </div>

      {/* 访问趋势 */}
      {stats?.dailyStats && stats.dailyStats.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-chart-line text-green-500"></i>
            访问趋势
          </h3>
          <div className="h-48 flex items-end gap-2">
            {stats.dailyStats.slice(-14).map((day) => {
              const maxPageViews = Math.max(...stats.dailyStats.map(d => d.pageViews), 1);
              const height = (day.pageViews / maxPageViews) * 100;
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '160px' }}>
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-[#D4AF37] to-[#E8C547] rounded-t transition-all"
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400">{new Date(day.date).getDate()}</p>
                  <p className="text-xs font-medium text-gray-600">{day.pageViews}</p>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#D4AF37] rounded"></span>
              页面浏览量
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
