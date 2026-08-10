import PropTypes from 'prop-types';
import { Card, CardContent, FormControl, InputLabel, MenuItem, Select, Stack, Switch, Typography } from '@mui/material';
import { SECTION_CARD_SX, SECTION_CONTENT_SX, TWO_FACTOR_METHOD_LABELS } from './model';

export default function TwoFactorSection({ controller }) {
  const { twoFactor, busyAction, runAction, update2FASettings, method, setMethod, setError, setFeedback } = controller;
  return (
    <>
      <Card variant="outlined" sx={SECTION_CARD_SX}>
        <CardContent sx={SECTION_CONTENT_SX}>
          <Stack spacing={2}>
            <Typography variant="h6">Autenticação em dois fatores (2FA)</Typography>
            <Typography color="text.secondary">
              Ative o segundo fator por e-mail ou app autenticador para elevar o nível de proteção do login.
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Switch
                  checked={Boolean(twoFactor?.enabled)}
                  disabled={Boolean(busyAction)}
                  onChange={async (_, checked) => {
                    const result = await runAction('mfa-toggle', () => update2FASettings({ enabled: checked, method }));

                    if (result.error) setError(result.error);
                    else setFeedback(checked ? '2FA ativado com sucesso.' : '2FA desativado com sucesso.');
                  }}
                />
                <Typography>{twoFactor?.enabled ? '2FA habilitado' : '2FA desabilitado'}</Typography>
              </Stack>

              <FormControl sx={{ minWidth: 220 }} size="small" disabled={!twoFactor?.enabled || Boolean(busyAction)}>
                <InputLabel id="two-factor-method-label">Método</InputLabel>
                <Select
                  labelId="two-factor-method-label"
                  label="Método"
                  value={method}
                  onChange={async (event) => {
                    const nextMethod = event.target.value;
                    setMethod(nextMethod);
                    const result = await runAction('mfa-method', () =>
                      update2FASettings({ enabled: true, method: nextMethod })
                    );

                    if (result.error) setError(result.error);
                    else setFeedback(`Método de 2FA alterado para ${TWO_FACTOR_METHOD_LABELS[nextMethod]}.`);
                  }}
                >
                  <MenuItem value="email">E-mail</MenuItem>
                  <MenuItem value="authenticator">App autenticador</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

TwoFactorSection.propTypes = { controller: PropTypes.object.isRequired };
