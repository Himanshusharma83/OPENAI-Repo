import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Select, InputNumber, Button, Row, Col, Space, Divider } from 'antd';
import { useWizard } from '../context/WizardContext';
import { useTranslation } from 'react-i18next';

export default function Step2FamilyFinancial({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  const { state, setState } = useWizard();
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm({
    defaultValues: state.family,
  });

  const onSubmit = (data: any) => {
    setState({ family: data });
    onNext();
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit(onSubmit)}
      aria-label={t('steps.family') + ' form'}
    >
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item label={t('step2Details.maritalStatus')}>
            <Controller
              name="maritalStatus"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  <Select.Option value="single">{t('step2Details.single')}</Select.Option>
                  <Select.Option value="married">{t('step2Details.married')}</Select.Option>
                  <Select.Option value="widowed">{t('step2Details.widowed')}</Select.Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label={t('step2Details.dependents')}>
            <Controller
              name="dependents"
              control={control}
              render={({ field }) => (
                <InputNumber {...field} style={{ width: '100%' }} min={0} />
              )}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label={t('step2Details.employmentStatus')}>
            <Controller
              name="employmentStatus"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  <Select.Option value="employed">{t('step2Details.employed')}</Select.Option>
                  <Select.Option value="unemployed">{t('step2Details.unemployed')}</Select.Option>
                  <Select.Option value="self">{t('step2Details.selfEmployed')}</Select.Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label={t('step2Details.monthlyIncome')}>
            <Controller
              name="monthlyIncome"
              control={control}
              render={({ field }) => (
                <InputNumber {...field} style={{ width: '100%' }} />
              )}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label={t('step2Details.housingStatus')}>
            <Controller
              name="housingStatus"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  <Select.Option value="owned">{t('step2Details.owned')}</Select.Option>
                  <Select.Option value="rented">{t('step2Details.rented')}</Select.Option>
                  <Select.Option value="shelter">{t('step2Details.shelter')}</Select.Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider />

      <Space>
        <Button onClick={onPrev}>{t('buttons.previous')}</Button>
        <Button type="primary" htmlType="submit">
          {t('buttons.next')}
        </Button>
      </Space>
    </Form>
  );
}
