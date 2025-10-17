import React, { useEffect } from 'react';
import { Form, Input, DatePicker, Radio, Button, Row, Col, Space } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { useWizard } from '../context/WizardContext';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';


export default function Step1PersonalInfo({ onNext }: { onNext: () => void }) {
  const { state, setState } = useWizard();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      ...state.personal,
      dob: state.personal.dob ? dayjs(state.personal.dob) : null,
    });
  }, [state.personal]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...state.personal,
        dob: state.personal.dob ? dayjs(state.personal.dob) : null,
      }}
      onFinish={(vals) => {
        const nextPersonal = { ...state.personal, ...vals, dob: vals.dob?.format('YYYY-MM-DD') };
        setState({ personal: nextPersonal });
        onNext();
      }}
      aria-label={t('steps.personal') + ' form'}
    >
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="name"
            label={t('step1PersonalInfo.fullName')}
            rules={[{ required: true }]}
          >
            <Input
              onChange={(e) =>
                setState({ personal: { ...state.personal, name: e.target.value } })
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="nationalId"
            label={t('step1PersonalInfo.nationalId')}
            rules={[{ required: true }]}
          >
            <Input
              onChange={(e) =>
                setState({ personal: { ...state.personal, nationalId: e.target.value } })
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="dob" label={t('step1PersonalInfo.dob')}>
            <DatePicker
              style={{ width: '100%' }}
              onChange={(date) =>
                setState({ personal: { ...state.personal, dob: date?.format('YYYY-MM-DD') || null } })
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="gender" label={t('step1PersonalInfo.gender')}>
            <Radio.Group
              onChange={(e: RadioChangeEvent) =>
                setState({ personal: { ...state.personal, gender: e.target.value } })
              }
              value={state.personal.gender}
            >
              <Radio value="male">{t('step1PersonalInfo.male')}</Radio>
              <Radio value="female">{t('step1PersonalInfo.female')}</Radio>
              <Radio value="other">{t('step1PersonalInfo.other')}</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="phone" label={t('step1PersonalInfo.phone')}>
            <Input
              onChange={(e) =>
                setState({ personal: { ...state.personal, phone: e.target.value } })
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item name="address" label={t('step1PersonalInfo.address')}>
            <Input
              onChange={(e) =>
                setState({ personal: { ...state.personal, address: e.target.value } })
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="city" label={t('step1PersonalInfo.city')}>
            <Input
              onChange={(e) =>
                setState({ personal: { ...state.personal, city: e.target.value } })
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="state" label={t('step1PersonalInfo.state')}>
            <Input
              onChange={(e) =>
                setState({ personal: { ...state.personal, state: e.target.value } })
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="country" label={t('step1PersonalInfo.country')}>
            <Input
              onChange={(e) =>
                setState({ personal: { ...state.personal, country: e.target.value } })
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="step1PersonalInfo.email"
            label={t('step1PersonalInfo.email')}
            rules={[{ type: 'email' }]}
          >
            <Input
              onChange={(e) =>
                setState({ personal: { ...state.personal, email: e.target.value } })
              }
            />
          </Form.Item>
        </Col>
      </Row>

      <div style={{ marginTop: 16 }}>
        <Space>
          <Button type="primary" htmlType="submit">
            {t('buttons.next')}
          </Button>
        </Space>
      </div>
    </Form>
  );
}
