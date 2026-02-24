import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Alert, Card, Container, Link, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Page from '../components/Page';
import { FormProvider, RHFTextField } from '../components/hook-form';
import { resetPasswordWithToken, validatePasswordResetToken } from '../auth/session';
import { evaluatePasswordPolicy } from '../auth/securityPolicy';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [submitStatus, setSubmitStatus] = useState(null);

  const token = searchParams.get('token') || '';

  const tokenValidation = useMemo(() => validatePasswordResetToken(token), [token]);

  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .required('Senha é obrigatória')
      .test('password-policy', 'Senha deve seguir a política de segurança', (value) => evaluatePasswordPolicy(value).valid),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'As senhas precisam ser iguais')
      .required('Confirmação obrigatória'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async ({ password }) => {
    const result = resetPasswordWithToken({ token, newPassword: password });
    setSubmitStatus(result.error ? { type: 'error', message: result.error } : { type: 'success' });
  };

  return (
    <Page title="Redefinir senha">
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Redefinir senha
          </Typography>

          {!tokenValidation.valid && <Alert severity="error">{tokenValidation.error}</Alert>}

          {tokenValidation.valid && (
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3} sx={{ mt: 2 }}>
                {submitStatus?.type === 'error' && <Alert severity="error">{submitStatus.message}</Alert>}

                {submitStatus?.type === 'success' && (
                  <Alert severity="success">
                    Senha alterada com sucesso. <Link component={RouterLink} to="/login">Ir para login</Link>
                  </Alert>
                )}

                <RHFTextField name="password" label="Nova senha" type="password" />
                <Typography variant="caption" color="text.secondary">
                  Use ao menos 8 caracteres com maiúscula, minúscula, número e símbolo.
                </Typography>
                <RHFTextField name="confirmPassword" label="Confirmar nova senha" type="password" />

                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Salvar nova senha
                </LoadingButton>
              </Stack>
            </FormProvider>
          )}
        </Card>
      </Container>
    </Page>
  );
}
