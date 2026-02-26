import { useMemo, useRef, useState } from 'react';
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
import { motion } from '../lib/motionReact';
import useGSAP from '../hooks/useGSAP';
import Page from '../components/Page';
import { gamificationBlueprint, hortelanModules, releaseRoadmap, wowFeatures } from '../data/hortelanBlueprint';
import GSAPTypingText from '../components/GSAPTypingText';

const MotionCard = motion(Card);
const MotionAccordion = motion(Accordion);

export default function Hortelan360() {
  const [query, setQuery] = useState('');
  const sceneRef = useRef(null);

  const filteredModules = useMemo(
    () =>
      hortelanModules.filter((module) => {
        const value = `${module.title} ${module.tags.join(' ')} ${module.features.join(' ')}`.toLowerCase();
        return value.includes(query.toLowerCase());
      }),
    [query]
  );


  useGSAP(
    ({ gsap, selector }) => {
      const floating = selector('.floating-orb');
      floating.forEach((item, index) => {
        gsap.to(item, {
          y: index % 2 === 0 ? -20 : 24,
          x: index % 2 === 0 ? 18 : -16,
          duration: 4 + index,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

      gsap.fromTo(
        selector('.wow-chip'),
        { scale: 0.95, opacity: 0.7 },
        {
          scale: 1.04,
          opacity: 1,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          duration: 1.6,
          stagger: 0.08,
        }
      );

      gsap.fromTo(
        selector('.release-card'),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.09,
          ease: 'power3.out',
        }
      );

      gsap.fromTo(
        selector('.module-accordion'),
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.03,
          ease: 'power2.out',
        }
      );
    },
    { dependencies: [filteredModules.length], scope: sceneRef }
  );

  return (
    <Page title="Hortelan AgTech Ltda 360">
      <Container maxWidth="xl" ref={sceneRef} sx={{ position: 'relative', overflow: 'hidden', pb: 3 }}>
        {[1, 2, 3].map((orb) => (
          <Box
            key={orb}
            className="floating-orb"
            sx={{
              position: 'absolute',
              width: 180 + orb * 60,
              height: 180 + orb * 60,
              borderRadius: '50%',
              filter: 'blur(48px)',
              opacity: 0.24,
              top: `${8 + orb * 14}%`,
              left: orb % 2 === 0 ? '75%' : '-6%',
              zIndex: 0,
              background: orb % 2 === 0 ? 'primary.main' : 'success.main',
            }}
          />
        ))}

        <Stack spacing={3} sx={{ mb: 4, position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Typography variant="h4">
              <GSAPTypingText
                texts={[
                  'Hortelan AgTech Ltda — Blueprint completo da plataforma',
                  'Arquitetura 360 para evolução contínua do produto',
                  'Planejamento estratégico com foco em entregas por releases',
                ]}
              />
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15 }}>
            <Typography color="text.secondary">
              <GSAPTypingText
                texts={[
                  'Esta tela consolida 30 frentes de produto em uma arquitetura de entrega por releases.',
                  'Navegue por módulos, roadmap e funcionalidades WOW com visão executiva e operacional.',
                ]}
                speed={30}
                eraseSpeed={18}
                holdDuration={1100}
                startDelay={200}
              />
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.25 }}>
            <Alert severity="success">Cobertura funcional: 30 módulos estratégicos + roteiro de releases + diferenciais WOW.</Alert>
          </motion.div>
        </Stack>

        <Grid container spacing={3} sx={{ mb: 2, position: 'relative', zIndex: 2 }}>
          {releaseRoadmap.map((release) => (
            <Grid item xs={12} md={6} lg={3} key={release.name}>
              <MotionCard
                className="release-card"
                whileHover={{ y: -10, rotateX: 2.5, rotateY: -1.5 }}
                transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                sx={{ height: '100%', backdropFilter: 'blur(8px)' }}
              >
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
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <MotionCard
          sx={{ mb: 3, position: 'relative', zIndex: 2 }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Funcionalidades WOW para diferenciação
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {wowFeatures.map((feature) => (
                <Chip key={feature} className="wow-chip" label={feature} color="primary" variant="outlined" />
              ))}
            </Stack>
          </CardContent>
        </MotionCard>

        <MotionCard
          sx={{ mb: 3, position: 'relative', zIndex: 2 }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Programa de gamificação (detalhado)
            </Typography>
            <Grid container spacing={2}>
              {gamificationBlueprint.map((pillar, index) => (
                <Grid item xs={12} md={6} key={pillar.id}>
                  <MotionCard
                    variant="outlined"
                    sx={{ height: '100%' }}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -16 : 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.55, delay: index * 0.06 }}
                  >
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
              className="module-accordion"
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
