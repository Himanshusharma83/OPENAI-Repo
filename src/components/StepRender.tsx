import React from 'react';

import Step1PersonalInfo from './Step1PersonalInfo';
import Step2FamilyFinancial from './Step2FamilyFinancial';
import Step3Situation from './Step3Situation';
import { useWizard } from '../context/WizardContext';

export default function StepRenderer() {
  const { state, setState } = useWizard();

  const next = () => setState({ step: Math.min(2, state.step + 1) });
  const prev = () => setState({ step: Math.max(0, state.step - 1) });

  return (
    <>
      {state.step === 0 && <Step1PersonalInfo onNext={next} />}
      {state.step === 1 && <Step2FamilyFinancial onNext={next} onPrev={prev} />}
      {state.step === 2 && <Step3Situation onPrev={prev} />}
    </>
  );
}
