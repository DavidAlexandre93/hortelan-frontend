import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import GrassIcon from '@mui/icons-material/Grass';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LinkIcon from '@mui/icons-material/Link';
import BlockIcon from '@mui/icons-material/Block';
import ScienceIcon from '@mui/icons-material/Science';
import Page from '../components/Page';
import speciesCatalog from '../data/speciesCatalog';

export default function SpeciesCatalog() {
  const [query, setQuery] = useState('');

  const filteredSpecies = useMemo(
    () =>
      speciesCatalog.filter((species) => {
        const haystack = [
          species.nomePopular,
          species.nomeCientifico,
          species.agua,
          species.luz,
          species.solo,
          species.consortios.join(' '),
          species.evitarConsorcios.join(' '),
        ]
          .join(' ')
          .toLowerCase();

        return haystack.includes(query.toLowerCase());
      }),
    [query]
  );

  return (
    <Page title="Catálogo de espécies e variedades">
      <Container>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4">Catálogo de espécies e variedades</Typography>
          <Typography color="text.secondary">
            Consulte informações agronômicas essenciais para apoiar o planejamento de cultivo e consórcios.
          </Typography>
        </Stack>

        <TextField
          fullWidth
          placeholder="Buscar por espécie, nome científico, necessidade ou consórcio..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ mb: 3 }}
        />

        <Grid container spacing={3}>
          {filteredSpecies.map((species) => (
            <Grid item xs={12} md={6} key={species.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                      <Stack>
                        <Typography variant="h6">{species.nomePopular}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <ScienceIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {species.nomeCientifico}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Chip label={`Dificuldade ${species.dificuldade}`} color="primary" variant="outlined" />
                    </Stack>

                    <Divider />

                    <Stack spacing={1.2}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <WaterDropIcon fontSize="small" color="info" />
                        <Typography variant="body2">{species.agua}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <WbSunnyIcon fontSize="small" color="warning" />
                        <Typography variant="body2">{species.luz}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <GrassIcon fontSize="small" color="success" />
                        <Typography variant="body2">{species.solo}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ScheduleIcon fontSize="small" color="action" />
                        <Typography variant="body2">{species.desenvolvimentoMedio}</Typography>
                      </Stack>
                    </Stack>

                    <Divider />

                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LinkIcon fontSize="small" color="success" />
                        <Typography variant="subtitle2">Consórcios recomendados</Typography>
                      </Stack>
                      <Stack direction="row" gap={1} flexWrap="wrap">
                        {species.consortios.map((crop) => (
                          <Chip key={`${species.id}-${crop}`} size="small" label={crop} color="success" variant="outlined" />
                        ))}
                      </Stack>
                    </Stack>

                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <BlockIcon fontSize="small" color="error" />
                        <Typography variant="subtitle2">Evitar no mesmo canteiro</Typography>
                      </Stack>
                      <Stack direction="row" gap={1} flexWrap="wrap">
                        {species.evitarConsorcios.map((crop) => (
                          <Chip key={`${species.id}-${crop}-avoid`} size="small" label={crop} color="error" variant="outlined" />
                        ))}
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {!filteredSpecies.length && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="body1">Nenhuma espécie encontrada para o termo informado.</Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </Page>
  );
}
