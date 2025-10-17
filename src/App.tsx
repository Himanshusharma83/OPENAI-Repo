import React from 'react';
import { ConfigProvider, Steps, Row, Col, Typography } from 'antd';
import { WizardProvider, useWizard } from './context/WizardContext';
import StepRenderer from './components/StepRender';
import { useTranslation } from 'react-i18next';
import './i18n';

const { Step } = Steps;
const { Title } = Typography;

function AppInner() {
  const { state } = useWizard();
  const { t, i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';

  return (
    <ConfigProvider direction={direction}>
      <div style={{ padding: 16, minHeight: '100vh', background: '#f5f7fa' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
          <Col>
            <Title level={3}>{t('title')}</Title>
          </Col>
        </Row>

        <Steps current={state.step}>
          <Step title={t('steps.personal')} />
          <Step title={t('steps.family')} />
          <Step title={t('steps.situation')} />
        </Steps>

        <div style={{ marginTop: 24 }}>
          <StepRenderer />
        </div>
      </div>
    </ConfigProvider>
  );
}

export default function App() {
  return (
    <WizardProvider>
      <AppInner />
    </WizardProvider>
  );
}
