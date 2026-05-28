import React, { createContext, useContext, useEffect, useState } from 'react';
import { labApi } from '../services/api';

const LabInfoContext = createContext(null);

export const LabInfoProvider = ({ children }) => {
  const [labInfo, setLabInfo] = useState(() => {
    try {
      const cached = localStorage.getItem('lmit_lab_info_cache');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const refresh = () =>
    labApi
      .getLabInfo()
      .then((data) => {
        setLabInfo(data);
        try {
          localStorage.setItem('lmit_lab_info_cache', JSON.stringify(data));
        } catch {}
      })
      .catch(() => {
        if (!labInfo) setLabInfo(null);
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (labInfo?.name) {
      document.title = labInfo.name;
    }
  }, [labInfo?.name]);

  return (
    <LabInfoContext.Provider value={{ labInfo, loading, refresh }}>
      {children}
    </LabInfoContext.Provider>
  );
};

export const useLabInfo = () => useContext(LabInfoContext);
