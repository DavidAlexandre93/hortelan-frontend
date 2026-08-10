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
  GridLegacy as Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from '../../lib/motionReact';
import Page from '../../components/Page';
import { gamificationBlueprint, hortelanModules, releaseRoadmap, wowFeatures } from '../../data/hortelanBlueprint';

const MotionCard = motion(Card);
const MotionAccordion = motion(Accordion);

const sectionCardSx = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backdropFilter: 'blur(8px)',
};

const sectionCardContentSx = {
  p: { xs: 2, md: 3 },
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 1.25,
  '&:last-child': {
    pb: { xs: 2, md: 3 },
  },
};

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
    <Page title="Hortelan 360">
      <Container maxWidth="xl" sx={{ position: 'relative', overflow: 'hidden', pb: 3 }}>
        <Stack spacing={3} sx={{ mb: 4, position: 'relative', zIndex: 2 }}>
          <Typography variant="h4">Blueprint completo da plataforma</Typography>
          <Typography color="text.secondary">
            Explore módulos, roadmap e diferenciais em uma visão executiva e operacional da evolução do produto.
          </Typography>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Alert severity="success">
              Cobertura funcional: 30 módulos estratégicos + roteiro de releases + diferenciais WOW.
            </Alert>
          </motion.div>
        </Stack>

        <Grid container spacing={3} sx={{ mb: 2, position: 'relative', zIndex: 2 }}>
          {releaseRoadmap.map((release) => (
            <Grid item xs={12} md={6} lg={3} key={release.name}>
              <MotionCard
                whileHover={{ y: -10, rotateX: 2.5, rotateY: -1.5 }}
                transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                sx={sectionCardSx}
              >
                <CardContent sx={sectionCardContentSx}>
                  <Typography variant="h6" gutterBottom>
                    {release.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {release.focus}
                  </Typography>
                  <List dense sx={{ mt: 'auto', pt: 0.5 }}>
                    {release.items.map((item) => (
                      <ListItem key={item} sx={{ py: 0.2, px: 0 }}>
                        <ListItemText primary={`• ${item}`} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <MotionCard
          sx={{ ...sectionCardSx, mb: 3, position: 'relative', zIndex: 2 }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <CardContent sx={sectionCardContentSx}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Funcionalidades WOW para diferenciação
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {wowFeatures.map((feature) => (
                <Chip key={feature} label={feature} color="primary" variant="outlined" />
              ))}
            </Stack>
          </CardContent>
        </MotionCard>

        <MotionCard
          sx={{ ...sectionCardSx, mb: 3, position: 'relative', zIndex: 2 }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <CardContent sx={sectionCardContentSx}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Programa de gamificação (detalhado)
            </Typography>
            <Grid container spacing={2}>
              {gamificationBlueprint.map((pillar, index) => (
                <Grid item xs={12} md={6} key={pillar.id}>
                  <MotionCard
                    variant="outlined"
                    sx={sectionCardSx}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -16 : 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.55, delay: index * 0.06 }}
                  >
                    <CardContent sx={sectionCardContentSx}>
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
                  </MotionCard>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </MotionCard>

        <TextField
          fullWidth
          placeholder="Buscar módulo, tag ou funcionalidade..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ mb: 3, position: 'relative', zIndex: 2 }}
        />

        <Box sx={{ position: 'relative', zIndex: 2 }}>
          {filteredModules.map((module, index) => (
            <MotionAccordion
              key={module.id}
              defaultExpanded={module.id <= 3}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: index * 0.015 }}
            >
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
            </MotionAccordion>
          ))}
        </Box>
      </Container>
    </Page>
  );
}
