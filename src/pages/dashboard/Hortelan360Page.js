import { Alert, Container } from '@mui/material';
import Page from '../../components/Page';
import AssistantExperience from '../../features/ai/components/AssistantExperience';
import AiInsightQueue from '../../features/ai/components/AiInsightQueue';

export default function Hortelan360Page() {
  return (
    <Page title="Hortelan 360">
      <Container maxWidth={false} disableGutters>
        <Alert severity="info" sx={{ mb: 2 }}>
          Respostas geradas apoiam a decisao, mas nao substituem dados da operacao, rotulos de produtos ou avaliacao
          agronomica qualificada.
        </Alert>
        <AiInsightQueue />
        <AssistantExperience
          open
          variant="workspace"
          pathname="/dashboard/hortelan-360"
          onClose={() => {}}
        />
      </Container>
    </Page>
  );
}
