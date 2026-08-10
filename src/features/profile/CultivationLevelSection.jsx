import PropTypes from 'prop-types';
import { Card, CardContent, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { CULTIVATION_LEVEL_OPTIONS, sectionCardContentSx } from './model';

export default function CultivationLevelSection({ controller }) {
  const { form, setField } = controller;
  return (
    <>
      <Card>
        <CardContent sx={sectionCardContentSx}>
          <Stack spacing={2}>
            <Typography variant="h6">Dados de cultivo</Typography>
            <FormControl fullWidth>
              <InputLabel id="cultivation-level-label">Nível de cultivo</InputLabel>
              <Select
                labelId="cultivation-level-label"
                label="Nível de cultivo"
                value={form.cultivationLevel}
                onChange={(event) => setField('cultivationLevel', event.target.value)}
              >
                {CULTIVATION_LEVEL_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

CultivationLevelSection.propTypes = { controller: PropTypes.object.isRequired };
