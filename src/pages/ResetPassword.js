import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Alert, Card, Container, Link, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Page from '../components/Page';
import { FormProvider, RHFTextField } from '../components/hook-form';
import { resetPasswordWithToken, validatePasswordResetToken } from '../auth/session';
import { resetPasswordWithBackend, validateResetTokenWithBackend } from '../services/authApi';
import { evaluatePasswordPolicy } from '../auth/securityPolicy';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [submitStatus, setSubmitStatus] = useState(null);

  const token = searchParams.get('token') || '';

  const [tokenValidation, setTokenValidation] = useState({ valid: Boolean(token), error: token ? '' : 'Token inválido' });

  useEffect(() => {
    let active = true;

    const validateToken = async () => {
      if (!token) {
        setTokenValidation({ valid: false, error: 'Token inválido' });
        return;
      }

      try {
        const result = await validateResetTokenWithBackend(token);
        if (active) {
          setTokenValidation(result);
        }
      } catch (error) {
        if (active) {
          setTokenValidation(validatePasswordResetToken(token));
        }
      }
    };

    validateToken();

    return () => {
      active = false;
    };
  }, [token]);

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
    try {
      await resetPasswordWithBackend({ token, password });
      setSubmitStatus({ type: 'success' });
    } catch (error) {
      const fallback = resetPasswordWithToken({ token, newPassword: password });
      setSubmitStatus(
        fallback.error
          ? { type: 'error', message: error.message || fallback.error }
          : { type: 'success' }
      );
    }
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
