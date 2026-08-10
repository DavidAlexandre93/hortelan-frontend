import PropTypes from 'prop-types';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  GridLegacy as Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { climaOptions, estacaoOptions, periodicidadeOptions, responsaveisAgenda, tiposTarefaBase } from './model';

export default function TaskAgendaSection({ controller }) {
  const {
    novaTarefaAgenda,
    setNovaTarefaAgenda,
    novoChecklistItem,
    setNovoChecklistItem,
    agendaTarefas,
    adicionarItemChecklist,
    criarTarefaAgenda,
    tarefasDoDia,
    tarefasAtrasadas,
    proximasTarefas,
    alternarChecklistDaTarefa,
    marcarTarefaConcluida,
    evidenciaDraftPorTarefa,
    atualizarEvidenciaDraft,
    registrarEvidencia,
    reagendarTarefa,
    filtroRotina,
    setFiltroRotina,
    sugestoesEspecie,
    ajusteClima,
    ajusteEstacao,
    ajusteHistorico,
    taxaConclusao,
    opcoesEspecie,
  } = controller;

  return (
    <>
      <Grid item xs={12}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Agenda inteligente de tarefas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Gestão operacional com tarefas padrão, tarefas personalizadas, lembretes por vencimento e evidências de
              execução.
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={4}>
                <Alert severity="info">Tarefas do dia: {tarefasDoDia.length}</Alert>
              </Grid>
              <Grid item xs={12} md={4}>
                <Alert severity={tarefasAtrasadas.length > 0 ? 'warning' : 'success'}>
                  Tarefas atrasadas: {tarefasAtrasadas.length}
                </Alert>
              </Grid>
              <Grid item xs={12} md={4}>
                <Alert severity="success">Próximas tarefas: {proximasTarefas.length}</Alert>
              </Grid>
            </Grid>

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              7.1 e 7.2 — Tipos base e criação personalizada
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="agenda-tipo-label">Tipo</InputLabel>
                  <Select
                    labelId="agenda-tipo-label"
                    label="Tipo"
                    value={novaTarefaAgenda.tipo}
                    onChange={(event) => setNovaTarefaAgenda((prev) => ({ ...prev, tipo: event.target.value }))}
                  >
                    {tiposTarefaBase.map((tipo) => (
                      <MenuItem key={tipo} value={tipo}>
                        {tipo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Título"
                  value={novaTarefaAgenda.titulo}
                  onChange={(event) => setNovaTarefaAgenda((prev) => ({ ...prev, titulo: event.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="agenda-periodicidade-label">Periodicidade</InputLabel>
                  <Select
                    labelId="agenda-periodicidade-label"
                    label="Periodicidade"
                    value={novaTarefaAgenda.periodicidade}
                    onChange={(event) =>
                      setNovaTarefaAgenda((prev) => ({ ...prev, periodicidade: event.target.value }))
                    }
                  >
                    {periodicidadeOptions.map((periodicidade) => (
                      <MenuItem key={periodicidade} value={periodicidade}>
                        {periodicidade}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="agenda-responsavel-label">Responsável</InputLabel>
                  <Select
                    labelId="agenda-responsavel-label"
                    label="Responsável"
                    value={novaTarefaAgenda.responsavel}
                    onChange={(event) => setNovaTarefaAgenda((prev) => ({ ...prev, responsavel: event.target.value }))}
                  >
                    {responsaveisAgenda.map((responsavel) => (
                      <MenuItem key={responsavel} value={responsavel}>
                        {responsavel}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Descrição"
                  value={novaTarefaAgenda.descricao}
                  onChange={(event) => setNovaTarefaAgenda((prev) => ({ ...prev, descricao: event.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Vencimento"
                  type="date"
                  value={novaTarefaAgenda.vencimento}
                  onChange={(event) => setNovaTarefaAgenda((prev) => ({ ...prev, vencimento: event.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  size="small"
                  label="Adicionar item ao checklist"
                  value={novoChecklistItem}
                  onChange={(event) => setNovoChecklistItem(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button fullWidth variant="outlined" onClick={adicionarItemChecklist}>
                  Incluir checklist
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {novaTarefaAgenda.checklist.map((item) => (
                    <Chip key={item.id} size="small" label={item.texto} />
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={criarTarefaAgenda}>
                  Criar tarefa personalizada
                </Button>
              </Grid>
            </Grid>

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              7.3 e 7.4 — Lembretes, reagendamento, execução e evidências
            </Typography>
            <Stack spacing={1.2}>
              {agendaTarefas.map((tarefa) => {
                const draft = evidenciaDraftPorTarefa[tarefa.id] || { observacao: '', foto: '', insumo: '' };
                return (
                  <Card key={tarefa.id} variant="outlined">
                    <CardContent>
                      <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={1}
                        justifyContent="space-between"
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="subtitle2">
                          {tarefa.titulo} • {tarefa.tipo}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip label={tarefa.periodicidade} size="small" />
                          <Chip
                            label={`Resp: ${tarefa.responsavel}`}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                          <Chip
                            label={tarefa.concluida ? 'Concluída' : 'Pendente'}
                            size="small"
                            color={tarefa.concluida ? 'success' : 'warning'}
                          />
                        </Stack>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {tarefa.descricao || 'Sem descrição.'}
                      </Typography>
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 1 }}>
                        <TextField
                          size="small"
                          label="Vencimento"
                          type="date"
                          value={tarefa.vencimento}
                          onChange={(event) => reagendarTarefa(tarefa.id, event.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => marcarTarefaConcluida(tarefa.id)}
                          disabled={tarefa.concluida}
                        >
                          Marcar como concluída
                        </Button>
                      </Stack>
                      <Stack spacing={0.5} sx={{ mb: 1 }}>
                        {tarefa.checklist.map((item) => (
                          <FormControlLabel
                            key={item.id}
                            control={
                              <Checkbox
                                checked={item.concluido}
                                onChange={() => alternarChecklistDaTarefa(tarefa.id, item.id)}
                                size="small"
                              />
                            }
                            label={item.texto}
                          />
                        ))}
                      </Stack>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Adicionar observação"
                            value={draft.observacao}
                            onChange={(event) => atualizarEvidenciaDraft(tarefa.id, 'observacao', event.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Adicionar foto (URL)"
                            value={draft.foto}
                            onChange={(event) => atualizarEvidenciaDraft(tarefa.id, 'foto', event.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Insumo utilizado"
                            value={draft.insumo}
                            onChange={(event) => atualizarEvidenciaDraft(tarefa.id, 'insumo', event.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} md={1}>
                          <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            onClick={() => registrarEvidencia(tarefa.id)}
                          >
                            Salvar
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              7.5 — Rotinas automáticas sugeridas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="rotina-especie-label">Espécie</InputLabel>
                  <Select
                    labelId="rotina-especie-label"
                    label="Espécie"
                    value={filtroRotina.especie}
                    onChange={(event) => setFiltroRotina((prev) => ({ ...prev, especie: event.target.value }))}
                  >
                    {opcoesEspecie.map((especie) => (
                      <MenuItem key={especie} value={especie}>
                        {especie}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="rotina-clima-label">Clima</InputLabel>
                  <Select
                    labelId="rotina-clima-label"
                    label="Clima"
                    value={filtroRotina.clima}
                    onChange={(event) => setFiltroRotina((prev) => ({ ...prev, clima: event.target.value }))}
                  >
                    {climaOptions.map((clima) => (
                      <MenuItem key={clima} value={clima}>
                        {clima}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="rotina-estacao-label">Estação</InputLabel>
                  <Select
                    labelId="rotina-estacao-label"
                    label="Estação"
                    value={filtroRotina.estacao}
                    onChange={(event) => setFiltroRotina((prev) => ({ ...prev, estacao: event.target.value }))}
                  >
                    {estacaoOptions.map((estacao) => (
                      <MenuItem key={estacao} value={estacao}>
                        {estacao}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Alert severity="info">Taxa de conclusão: {taxaConclusao}%</Alert>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Sugestão por espécie
                    </Typography>
                    <List dense>
                      {sugestoesEspecie.map((item) => (
                        <ListItem key={item} sx={{ py: 0 }}>
                          <ListItemText primary={`• ${item}`} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Alert severity="warning">{ajusteClima}</Alert>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <Alert severity="info">{ajusteEstacao}</Alert>
                  <Alert severity={taxaConclusao >= 75 ? 'success' : 'warning'}>{ajusteHistorico}</Alert>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

TaskAgendaSection.propTypes = { controller: PropTypes.object.isRequired };
