import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { message } from 'antd';

export type PersonalInfo = {
  name: string;
  nationalId: string;
  dob?: string | null;
  gender?: 'male' | 'female' | 'other' | '';
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
};

export type FamilyFinancialInfo = {
  maritalStatus: string;
  dependents: number;
  employmentStatus: string;
  monthlyIncome: number | null;
  housingStatus: string;
};

export type SituationFields = {
  currentFinancialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
};

export type WizardState = {
  step: number;
  personal: PersonalInfo;
  family: FamilyFinancialInfo;
  situation: SituationFields;
  lang: 'en' | 'ar';
  direction: 'ltr' | 'rtl';
};

const defaultState: WizardState = {
  step: 0,
  personal: {
    name: '',
    nationalId: '',
    dob: null,
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
  },
  family: {
    maritalStatus: '',
    dependents: 0,
    employmentStatus: '',
    monthlyIncome: null,
    housingStatus: '',
  },
  situation: {
    currentFinancialSituation: '',
    employmentCircumstances: '',
    reasonForApplying: '',
  },
  lang: 'en',
  direction: 'ltr',
};

const STORAGE_KEY = 'social_support_wizard_v1';

export const WizardContext = createContext<{
  state: WizardState;
  setState: (s: Partial<WizardState>) => void;
  saveToStorage: () => void;
  clearStorage: () => void;
  setLanguage: (lang: 'en' | 'ar') => void;
}>({ state: defaultState, setState: () => { }, saveToStorage: () => { }, clearStorage: () => { }, setLanguage: () => { } });

export const useWizard = () => useContext(WizardContext);

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setRawState] = useState<WizardState>(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : defaultState;
  });
  const [storedStateLoaded, setStoredStateLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRawState({ ...defaultState, ...JSON.parse(raw) });
    } catch (e) {
      console.warn('Could not read storage', e);
    } finally {
      setStoredStateLoaded(true);
    }
  }, []);

  const setState = (patch: Partial<WizardState>) => setRawState((s) => ({ ...s, ...patch }));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    message.success('Progress saved locally');
  };

  const clearStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
    message.info('Local progress cleared');
  };

  const setLanguage = (lang: 'en' | 'ar') => {
    setRawState((prevState) => ({
      ...prevState,
      lang,
      direction: lang === 'ar' ? 'rtl' : 'ltr',
    }));
  };

  const value = useMemo(
    () => ({ state, setState, saveToStorage, clearStorage, setLanguage }),
    [state]
  );

  if (!storedStateLoaded) return <div>Loading...</div>;

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
};
