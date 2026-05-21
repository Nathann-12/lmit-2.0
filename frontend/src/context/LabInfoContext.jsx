import React, { createContext, useContext, useEffect, useState } from 'react';
import { labApi } from '../services/api';

const LabInfoContext = createContext(null);

export const LabInfoProvider = ({ children }) => {
  const [labInfo, setLabInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = () =>
    labApi
      .getLabInfo()
      .then(setLabInfo)
      .catch(() => setLabInfo(null))
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
