import * as Yup from 'yup';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Alert, Button, Stack } from '@mui/material';
import AuthRecoveryLayout from '../../sections/auth/AuthRecoveryLayout';
import { FormProvider, RHFTextField } from '../../components/hook-form';
import { requestResetWithBackend } from '../../services/authApi';

const GENERIC_SUCCESS = 'Se houver uma conta para este e-mail, enviaremos as instrucoes de recuperacao.';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const methods = useForm({
    resolver: yupResolver(
      Yup.object({ email: Yup.string().email('Informe um e-mail valido').required('E-mail e obrigatorio') })
    ),
    defaultValues: { email: '' },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async ({ email }) => {
    try {
      await requestResetWithBackend(email);
    } catch {
      // A resposta permanece generica para nao revelar contas cadastradas.
    }
    setSubmitted(true);
  };

  return (
    <AuthRecoveryLayout
      title="Recuperar acesso"
      description="Informe seu e-mail. As instrucoes serao enviadas sem expor se a conta existe."
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5}>
          {submitted && <Alert severity="success">{GENERIC_SUCCESS}</Alert>}
          <RHFTextField name="email" label="E-mail" autoComplete="email" />
          <Button type="submit" size="large" variant="contained" loading={isSubmitting}>
            Enviar instrucoes
          </Button>
        </Stack>
      </FormProvider>
    </AuthRecoveryLayout>
  );
}
