import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Alert, Button, Link, Stack, Typography } from '@mui/material';
import AuthRecoveryLayout from '../../sections/auth/AuthRecoveryLayout';
import { FormProvider, RHFTextField } from '../../components/hook-form';
import { resetPasswordWithBackend, validateResetTokenWithBackend } from '../../services/authApi';
import { evaluatePasswordPolicy } from '../../auth/securityPolicy';
import useLatestRequest from '../../hooks/useLatestRequest';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [validation, setValidation] = useState({
    loading: Boolean(token),
    valid: false,
    error: token ? '' : 'Link invalido ou incompleto.',
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const runLatest = useLatestRequest();

  useEffect(() => {
    if (!token) return undefined;

    runLatest(({ signal }) => validateResetTokenWithBackend(token, { signal }))
      .then((result) => {
        if (result.current) setValidation({ loading: false, valid: result.data.valid, error: result.data.error || '' });
      })
      .catch((error) => {
        if (error.kind !== 'cancellation')
          setValidation({
            loading: false,
            valid: false,
            error: 'Nao foi possivel validar este link. Solicite um novo.',
          });
      });
    return undefined;
  }, [runLatest, token]);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object({
        password: Yup.string()
          .required('Senha e obrigatoria')
          .test('policy', 'A senha nao atende aos requisitos', (value) => evaluatePasswordPolicy(value).valid),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password')], 'As senhas precisam ser iguais')
          .required('Confirme a nova senha'),
      })
    ),
    defaultValues: { password: '', confirmPassword: '' },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async ({ password }) => {
    setSubmitStatus(null);
    try {
      await resetPasswordWithBackend({ token, password });
      setSubmitStatus({ type: 'success' });
    } catch (error) {
      setSubmitStatus({ type: 'error', message: error.message || 'Nao foi possivel atualizar a senha.' });
    }
  };

  return (
    <AuthRecoveryLayout
      title="Definir nova senha"
      description="Crie uma senha forte e exclusiva para proteger sua operacao."
    >
      {validation.loading && <Alert severity="info">Validando o link de recuperacao...</Alert>}
      {!validation.loading && !validation.valid && <Alert severity="error">{validation.error}</Alert>}
      {validation.valid && (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            {submitStatus?.type === 'error' && <Alert severity="error">{submitStatus.message}</Alert>}
            {submitStatus?.type === 'success' && (
              <Alert severity="success">
                Senha atualizada.{' '}
                <Link component={RouterLink} to="/login">
                  Entrar na conta
                </Link>
              </Alert>
            )}
            <RHFTextField name="password" label="Nova senha" type="password" autoComplete="new-password" />
            <Typography variant="caption" color="text.secondary">
              Use 8 ou mais caracteres com letra maiuscula, minuscula, numero e simbolo.
            </Typography>
            <RHFTextField
              name="confirmPassword"
              label="Confirmar nova senha"
              type="password"
              autoComplete="new-password"
            />
            <Button type="submit" size="large" variant="contained" loading={isSubmitting}>
              Salvar nova senha
            </Button>
          </Stack>
        </FormProvider>
      )}
    </AuthRecoveryLayout>
  );
}
