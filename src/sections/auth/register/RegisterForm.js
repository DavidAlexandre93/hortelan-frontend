import * as Yup from "yup";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
// form
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import {
  Alert,
  Stack,
  Link,
  Button,
  IconButton,
  Checkbox,
  InputAdornment,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import Iconify from "../../../components/Iconify";
import { FormProvider, RHFTextField } from "../../../components/hook-form";

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required("Nome é obrigatório"),
    email: Yup.string()
      .email("Informe um e-mail válido")
      .required("E-mail é obrigatório"),
    phone: Yup.string()
      .nullable()
      .test("phone-format", "Informe um telefone válido", (value) => {
        if (!value) return true;

        const digits = value.replace(/\D/g, "");
        return digits.length >= 10 && digits.length <= 11;
      }),
    password: Yup.string()
      .min(8, "A senha deve ter ao menos 8 caracteres")
      .required("Senha é obrigatória"),
    acceptedTerms: Yup.bool().oneOf(
      [true],
      "Você precisa aceitar os termos para continuar"
    ),
  });

  const defaultValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    acceptedTerms: false,
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async ({ email }) => {
    setVerificationEmail(email);
    reset();
  };

  if (verificationEmail) {
    return (
      <Stack spacing={3}>
        <Alert severity="success">
          Cadastro realizado com sucesso! Enviamos um link de verificação para{" "}
          <strong>{verificationEmail}</strong>. Confirme seu e-mail para ativar
          sua conta.
        </Alert>

        <Button
          component={RouterLink}
          to="/login"
          size="large"
          variant="contained"
        >
          Ir para login
        </Button>
      </Stack>
    );
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="name" label="Nome completo" />

        <RHFTextField name="email" label="E-mail" />

        <RHFTextField
          name="phone"
          label="Telefone (opcional)"
          placeholder="(11) 99999-9999"
        />

        <RHFTextField
          name="password"
          label="Senha"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Controller
          name="acceptedTerms"
          control={control}
          render={({ field }) => (
            <Stack>
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label={
                  <span>
                    Eu aceito os{" "}
                    <Link underline="always" color="text.primary" href="#">
                      Termos de Uso
                    </Link>{" "}
                    e a{" "}
                    <Link underline="always" color="text.primary" href="#">
                      Política de Privacidade
                    </Link>
                    .
                  </span>
                }
              />
              {errors.acceptedTerms && (
                <FormHelperText error>
                  {errors.acceptedTerms.message}
                </FormHelperText>
              )}
            </Stack>
          )}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Criar conta
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
