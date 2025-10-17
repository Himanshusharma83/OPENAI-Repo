import React, { useState } from 'react';
import { Form, Input, Button, Divider, Space, Modal, Spin, message, Alert } from 'antd';
import { useWizard } from '../context/WizardContext';
import { callOpenAIGenerate,submitDataToMockAPI } from '../utils/openaiHelper';
import { buildPrompt } from '../utils/buildPrompt';
import { useTranslation } from 'react-i18next';
import { useForm,Controller } from 'react-hook-form';

const { TextArea } = Input;

export default function Step3Situation({ onPrev }: { onPrev: () => void }) {
  const { state, setState } = useWizard();
 const { control, handleSubmit, setValue } = useForm({
  defaultValues: state.situation,
});
  const [loadingGen, setLoadingGen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const { t } = useTranslation();
  const [editingField, setEditingField] = useState<
    'currentFinancialSituation' | 'employmentCircumstances' | 'reasonForApplying' | null
  >(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const showError = (text: string) => message.error(text);

  const handleHelpMeWrite = async (field: typeof editingField) => {
    const prompt = buildPrompt(field!, state);
    setEditingField(field);
    setLoadingGen(true);
    setModalContent('');
    setModalOpen(true);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 15000)
      );

      const result = await Promise.race([
        callOpenAIGenerate(prompt, controller.signal),
        timeout,
      ]);

   
      setModalContent(result as string);
    } catch (e: any) {
     <Alert message={t('errors.generationFailed')} type="error" showIcon />
      if (e.name === 'AbortError') showError(t('errors.generationCancelled'));
      else showError(e?.message || t('errors.generationFailed'));
    } finally {
      setLoadingGen(false);
      setAbortController(null);
    }
  };

const acceptSuggestion = () => {
  if (!editingField) return;


  setState({ situation: { ...state.situation, [editingField]: modalContent } });

 
  setValue(editingField, modalContent);

  setModalOpen(false);
  setEditingField(null);
  message.success(t('messages.suggestionApplied'));
};

  const discardSuggestion = () => {
    setModalOpen(false);
    setEditingField(null);
    setModalContent('');
    if (abortController) abortController.abort();
  };

  const onSubmit = async (data: any) => {
    setState({ situation: data });
    const updatedState = {
      ...state,
      situation: data,
    };
    const apiPayload = {
      step1: updatedState.personal,
      step2: updatedState.family,
      step3: updatedState.situation,
    };

    localStorage.setItem('social_support_wizard_v1', JSON.stringify(updatedState));
    message.loading({
      content: t('messages.submitting'),
      key: 'sub',
    });

    try {
      const response = await submitDataToMockAPI(apiPayload);
      console.log('Mock API Response:', response);

      message.success({
        content: t('messages.submissionSuccess'),
        key: 'sub',
      });
      alert(t('messages.submissionAlert'));

      setState({
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
        lang: state.lang,
        direction: state.direction,
      });
      localStorage.removeItem('social_support_wizard_v1');
    } catch (error: any) {
      console.error('Submission Error:', error);
      message.error({ content: t('messages.submissionFailed') });
    }
  };

  return (
    <div>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} aria-label={t('steps.situation') + ' form'}>
        {(['currentFinancialSituation', 'employmentCircumstances', 'reasonForApplying'] as const).map(
          (field) => (
            <Form.Item
              key={field}
              label={t(`step3Details.${field}`)}
            >
              <Controller
                name={field}
                control={control}
                render={({ field: controllerField }) => (
                  <TextArea
                    {...controllerField}
                    rows={4}
                  />
                )}
              />
              <div style={{ marginTop: 8 }}>
                <Button
                  onClick={() => handleHelpMeWrite(field)}
                  loading={loadingGen && editingField === field}
                  aria-label={t('buttons.help')}
                >
                  {t('buttons.help')}
                </Button>
              </div>
            </Form.Item>
          )
        )}

        <Divider />

        <Space>
          <Button onClick={onPrev}>{t('buttons.previous')}</Button>
          <Button type="primary" htmlType="submit">
            {t('buttons.submit')}
          </Button>
        </Space>
      </Form>

      <Modal
        open={modalOpen}
        title={t('modals.aiSuggestion')}
        onCancel={discardSuggestion}
        footer={
          <Space>
            <Button onClick={discardSuggestion}>
              {t('modals.discard')}
            </Button>
            <Button
              type="primary"
              onClick={acceptSuggestion}
              disabled={!modalContent || loadingGen}
            >
              {t('modals.accept')}
            </Button>
          </Space>
        }
      >
        {loadingGen ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <Spin />
            <div style={{ marginTop: 8 }}>
              {t('modals.generating')}
            </div>
          </div>
        ) : (
          <TextArea
            rows={8}
            value={modalContent}
            onChange={(e) => setModalContent(e.target.value)}
            placeholder={t('modals.editSuggestion')}
          />
        )}
      </Modal>
    </div>
  );
}
