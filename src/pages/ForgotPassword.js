import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Alert, Card, Container, Link, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Page from '../components/Page';
import { FormProvider, RHFTextField } from '../components/hook-form';
import { requestPasswordReset } from '../auth/session';
import { requestResetWithBackend } from '../services/authApi';

export default function ForgotPassword() {
  const [response, setResponse] = useState(null);

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Informe um e-mail válido').required('E-mail é obrigatório'),
  });

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async ({ email }) => {
    try {
      const result = await requestResetWithBackend(email);
      setResponse(result);
    } catch (error) {
      const fallback = requestPasswordReset(email);
      setResponse({ ...fallback, message: error.message || fallback.message });
    }
  };

  return (
    <Page title="Esqueci minha senha">
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Esqueci minha senha
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Informe seu e-mail para gerar um link/token de redefinição de senha.
          </Typography>

          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              {response && <Alert severity="success">{response.message}</Alert>}

              <RHFTextField name="email" label="E-mail" />

              {response?.resetLink && (
                <Alert severity="info">
                  Token válido até: <strong>{new Date(response.expiresAt).toLocaleString()}</strong>
                  <br />
                  Link de redefinição:{' '}
                  <Link component={RouterLink} to={response.resetLink.replace(window.location.origin, '')}>
                    Abrir redefinição
                  </Link>
                </Alert>
              )}

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Enviar link de redefinição
              </LoadingButton>

              <Link component={RouterLink} to="/login" underline="hover">
                Voltar para login
              </Link>
            </Stack>
          </FormProvider>
        </Card>
      </Container>
    </Page>
  );
}
