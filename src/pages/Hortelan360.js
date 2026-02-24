import { useMemo, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Page from '../components/Page';
import { gamificationBlueprint, hortelanModules, releaseRoadmap, wowFeatures } from '../data/hortelanBlueprint';

export default function Hortelan360() {
  const [query, setQuery] = useState('');

  const filteredModules = useMemo(
    () =>
      hortelanModules.filter((module) => {
        const value = `${module.title} ${module.tags.join(' ')} ${module.features.join(' ')}`.toLowerCase();
        return value.includes(query.toLowerCase());
      }),
    [query]
  );

  return (
    <Page title="Hortelan Agtech Ltda 360">
      <Container maxWidth="xl">
        <Stack spacing={3} sx={{ mb: 4 }}>
          <Typography variant="h4">Hortelan Agtech Ltda — Blueprint completo da plataforma</Typography>
          <Typography color="text.secondary">
            Esta tela consolida as 30 frentes de produto solicitadas em uma arquitetura de entrega por releases.
          </Typography>
          <Alert severity="success">Cobertura funcional: 30 módulos estratégicos + roteiro de releases + diferenciais WOW.</Alert>
        </Stack>

        <Grid container spacing={3} sx={{ mb: 2 }}>
          {releaseRoadmap.map((release) => (
            <Grid item xs={12} md={6} lg={3} key={release.name}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {release.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {release.focus}
                  </Typography>
                  <List dense>
                    {release.items.map((item) => (
                      <ListItem key={item} sx={{ py: 0.2, px: 0 }}>
                        <ListItemText primary={`• ${item}`} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Funcionalidades WOW para diferenciação
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {wowFeatures.map((feature) => (
                <Chip key={feature} label={feature} color="primary" variant="outlined" />
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Programa de gamificação (detalhado)
            </Typography>
            <Grid container spacing={2}>
              {gamificationBlueprint.map((pillar) => (
                <Grid item xs={12} md={6} key={pillar.id}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        {pillar.id} {pillar.title}
                      </Typography>
                      <List dense>
                        {pillar.items.map((item) => (
                          <ListItem key={`${pillar.id}-${item}`} sx={{ py: 0.25, px: 0 }}>
                            <ListItemText primary={`• ${item}`} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <TextField
          fullWidth
          placeholder="Buscar módulo, tag ou funcionalidade..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ mb: 3 }}
        />

        <Box>
          {filteredModules.map((module) => (
            <Accordion key={module.id} defaultExpanded={module.id <= 3}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                  <Typography variant="subtitle1">
                    {module.id}. {module.title}
                  </Typography>
                  {module.tags.map((tag) => (
                    <Chip size="small" key={`${module.id}-${tag}`} label={tag} />
                  ))}
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {module.features.map((feature) => (
                    <ListItem key={feature} sx={{ py: 0.3 }}>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Page>
  );
}
