import { useState, useEffect } from 'react';

import api from '../api';

function useThemeData(id, setActivePlan) {
  const [themes, setThemes] = useState([]);
  const [currentTheme, setCurrentTheme] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getThemeData = async () => {
      setIsLoading(true);
      setActivePlan(null);

      // 計算打 API 開始的時間
      const startTime = Date.now();

      try {
        const [themesRes, plansRes] = await Promise.all([api.get('/themes'), api.get('/plans')]);

        setThemes(themesRes.data);

        const theme = themesRes.data.find((item) => item.id === Number(id));
        const relatedPlans = plansRes.data.filter((plan) => plan.themeId === Number(id));

        const combinedThemeData = {
          ...theme,
          plans: relatedPlans,
        };
        setCurrentTheme(combinedThemeData);
      } catch (error) {
        console.error('取得主題失敗：', error?.message);
      } finally {
        // 計算打 API 後過了多少時間 elapsed
        const elapsed = Date.now() - startTime;

        // 設定一個最少 loading 時間 minimumLoadingTime
        const minimumLoadingTime = 300;

        // 若 elapsed < minimumLoadingTime 則等待，反之直接結束
        if (elapsed < minimumLoadingTime) {
          await new Promise((resolve) => setTimeout(resolve, minimumLoadingTime - elapsed));
        }

        setIsLoading(false);
      }
    };
    getThemeData();
  }, [id, setActivePlan]);

  return { themes, currentTheme, isLoading };
}

export default useThemeData;
