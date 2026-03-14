import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// 生成唯一访客ID（基于浏览器指纹）
function generateVisitorId(): string {
  // 尝试从localStorage获取已有的visitorId
  const storedId = localStorage.getItem('visitor_id');
  if (storedId) return storedId;

  // 生成新的visitorId
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let fingerprint = '';

  try {
    // Canvas 指纹
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Hello, world!', 2, 15);
      fingerprint += canvas.toDataURL();
    }

    // 添加浏览器信息
    fingerprint += navigator.userAgent;
    fingerprint += navigator.language;
    fingerprint += screen.width + 'x' + screen.height;
    fingerprint += new Date().getTimezoneOffset();

    // 简单哈希
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    const visitorId = 'v_' + Math.abs(hash).toString(36) + '_' + Date.now().toString(36);
    localStorage.setItem('visitor_id', visitorId);
    return visitorId;
  } catch {
    // 降级方案
    const visitorId = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('visitor_id', visitorId);
    return visitorId;
  }
}

// 生成会话ID
function generateSessionId(): string {
  const storedId = sessionStorage.getItem('session_id');
  if (storedId) return storedId;

  const sessionId = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
  sessionStorage.setItem('session_id', sessionId);
  return sessionId;
}

// 获取屏幕分辨率
function getScreenResolution(): string {
  return `${window.screen.width}x${window.screen.height}`;
}

// 获取URL参数
function getUTMParams(): { utmSource: string | null; utmMedium: string | null; utmCampaign: string | null } {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source'),
    utmMedium: params.get('utm_medium'),
    utmCampaign: params.get('utm_campaign'),
  };
}

// 访客追踪组件
export default function VisitorTracker() {
  const location = useLocation();
  const visitorId = useRef<string>(generateVisitorId());
  const sessionId = useRef<string>(generateSessionId());
  const pageStartTime = useRef<number>(Date.now());
  const lastPath = useRef<string>('');
  const hasTracked = useRef<boolean>(false);

  // 发送追踪数据
  const trackPageView = useCallback(async (isLeave: boolean = false) => {
    const currentPath = location.pathname + location.search;
    
    // 如果是新页面且不是离开事件，记录进入
    if (!isLeave && lastPath.current === currentPath && hasTracked.current) {
      return; // 避免重复追踪
    }

    const utmParams = getUTMParams();
    const durationSeconds = isLeave ? Math.round((Date.now() - pageStartTime.current) / 1000) : 0;
    const scrollDepth = isLeave ? Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100) || 0 : 0;

    try {
      const endpoint = isLeave ? '/api/analytics/leave' : '/api/analytics/track';
      const body = isLeave ? {
        sessionId: sessionId.current,
        pageUrl: window.location.origin + lastPath.current,
        durationSeconds,
        scrollDepth: Math.min(100, Math.max(0, scrollDepth)),
      } : {
        visitorId: visitorId.current,
        sessionId: sessionId.current,
        pageUrl: window.location.origin + currentPath,
        pagePath: location.pathname,
        pageTitle: document.title,
        referrer: document.referrer || null,
        screenResolution: getScreenResolution(),
        language: navigator.language,
        ...utmParams,
      };

      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        keepalive: true, // 确保在页面关闭时也能发送
      });

      if (!isLeave) {
        lastPath.current = currentPath;
        hasTracked.current = true;
        pageStartTime.current = Date.now();
      }
    } catch (error) {
      console.error('Visitor tracking error:', error);
    }
  }, [location]);

  // 页面加载时追踪
  useEffect(() => {
    // 延迟一小段时间确保页面标题已更新
    const timer = setTimeout(() => {
      trackPageView(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, trackPageView]);

  // 页面离开时追踪
  useEffect(() => {
    const handleBeforeUnload = () => {
      // 使用 sendBeacon 确保数据能发送出去
      const data = {
        sessionId: sessionId.current,
        pageUrl: window.location.origin + lastPath.current,
        durationSeconds: Math.round((Date.now() - pageStartTime.current) / 1000),
        scrollDepth: Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100) || 0,
      };

      // 发送停留时长数据
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/leave', JSON.stringify(data));
      }

      // 结束会话
      navigator.sendBeacon('/api/analytics/end-session', JSON.stringify({ sessionId: sessionId.current }));
    };

    // 页面可见性变化时处理
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackPageView(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [trackPageView]);

  // 不渲染任何内容
  return null;
}
