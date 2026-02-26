import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import Page from '../components/Page';
import Iconify from '../components/Iconify';

const interestFeeds = [
  'Feed geral',
  'Espécies',
  'Tipo de cultivo',
  'Local/regional',
  'Usuários seguidos',
];

const profileData = {
  name: 'Ana Oliveira',
  handle: '@ana.horta',
  bio: 'Cultivo urbano em pequenos espaços. Foco em hortaliças resilientes e automações simples.',
  level: 'Especialista Nível 4',
  reputation: 1280,
  publicGardens: 3,
  achievements: ['Guardiã da Alface', 'Mentora da Comunidade', 'Top 10 mensal'],
};

const initialPosts = [
  {
    id: 1,
    author: 'Ana Oliveira',
    time: 'há 1h',
    text: 'Minhas folhas de manjericão começaram a amarelar após a onda de calor. Ajustei irrigação e cobertura do solo.',
    species: ['Manjericão'],
    tags: ['Problema', 'Solução', 'Receita compartilhada'],
    likes: 18,
    comments: [
      { id: 11, user: 'Luan', text: 'Usei sombrite 30% e resolveu aqui também.', replies: ['Boa! Vou testar.'] },
    ],
    saved: false,
  },
  {
    id: 2,
    author: 'Carlos Mendes',
    time: 'há 4h',
    text: 'Automação nova: rega acionada por umidade + previsão de chuva para evitar desperdício.',
    species: ['Tomate-cereja'],
    tags: ['Automação'],
    likes: 27,
    comments: [{ id: 21, user: 'Bruna', text: 'Consegue compartilhar o diagrama?', replies: [] }],
    saved: true,
  },
];

const qaTopics = ['Pragas', 'Nutrição', 'Irrigação', 'Substrato', 'Cultivo indoor'];

const moderationItems = [
  { id: 'm1', reason: 'Linguagem imprópria', status: 'Em análise' },
  { id: 'm2', reason: 'Informação potencialmente perigosa', status: 'Ocultado preventivamente' },
  { id: 'm3', reason: 'Spam', status: 'Conta suspensa (7 dias)' },
];

function PostCard({ post, onLike, onSave, onAddComment }) {
  const [commentText, setCommentText] = useState('');

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar>{post.author.charAt(0)}</Avatar>
            <Box>
              <Typography variant="subtitle2">{post.author}</Typography>
              <Typography variant="caption" color="text.secondary">
                {post.time}
              </Typography>
            </Box>
          </Stack>
          <Button size="small" startIcon={<Iconify icon="eva:share-fill" />}>
            Compartilhar
          </Button>
        </Stack>

        <Typography variant="body2" mb={1.5}>
          {post.text}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mb={2}>
          {post.species.map((species) => (
            <Chip key={species} size="small" color="success" label={`Espécie: ${species}`} />
          ))}
          {post.tags.map((tag) => (
            <Chip key={tag} size="small" variant="outlined" label={tag} />
          ))}
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <IconButton onClick={() => onLike(post.id)} color="error">
            <Iconify icon="eva:heart-fill" />
          </IconButton>
          <Typography variant="caption">{post.likes} curtidas</Typography>
          <IconButton onClick={() => onSave(post.id)} color={post.saved ? 'primary' : 'default'}>
            <Iconify icon="eva:bookmark-fill" />
          </IconButton>
          <Typography variant="caption">{post.saved ? 'Salvo' : 'Salvar post'}</Typography>
        </Stack>

        <Divider sx={{ mb: 1.5 }} />

        <Typography variant="subtitle2" mb={1}>
          Comentários e respostas
        </Typography>

        {post.comments.map((comment) => (
          <Box key={comment.id} mb={1}>
            <Typography variant="body2">
              <strong>{comment.user}:</strong> {comment.text}
            </Typography>
            {comment.replies.map((reply) => (
              <Typography key={reply} variant="caption" color="text.secondary" display="block" sx={{ pl: 1 }}>
                ↳ {reply}
              </Typography>
            ))}
          </Box>
        ))}

        <Stack direction="row" spacing={1} mt={1}>
          <TextField
            fullWidth
            size="small"
            placeholder="Adicionar comentário..."
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
          />
          <Button
            variant="contained"
            disabled={!commentText.trim()}
            onClick={() => {
              onAddComment(post.id, commentText.trim());
              setCommentText('');
            }}
          >
            Responder
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState(initialPosts);
  const [feedType, setFeedType] = useState(0);
  const [newPost, setNewPost] = useState({ text: '', species: '', tags: [] });
  const [question, setQuestion] = useState({ title: '', topic: qaTopics[0] });

  const reputationProgress = useMemo(() => Math.min(100, Math.round((profileData.reputation / 1500) * 100)), []);

  const toggleTag = (tag) => {
    setNewPost((previous) => ({
      ...previous,
      tags: previous.tags.includes(tag) ? previous.tags.filter((item) => item !== tag) : [...previous.tags, tag],
    }));
  };

  const publishPost = () => {
    if (!newPost.text.trim()) return;
    setPosts((previous) => [
      {
        id: Date.now(),
        author: profileData.name,
        time: 'agora',
        text: newPost.text.trim(),
        species: newPost.species ? [newPost.species] : ['Não informado'],
        tags: newPost.tags,
        likes: 0,
        comments: [],
        saved: false,
      },
      ...previous,
    ]);
    setNewPost({ text: '', species: '', tags: [] });
  };

  const submitQuestion = () => {
    if (!question.title.trim()) return;
    // Simulação de envio para fase inicial
    setQuestion((previous) => ({ ...previous, title: '' }));
  };

  return (
    <Page title="Dashboard: Comunidade">
      <Container maxWidth="xl">
        <Typography variant="h4" gutterBottom>
          Comunidade Hortelan AgTech Ltda
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Perfil público, publicações, perguntas e respostas, reputação e moderação comunitária.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Stack spacing={2} alignItems="center" textAlign="center">
                  <Avatar sx={{ width: 88, height: 88 }}>A</Avatar>
                  <Box>
                    <Typography variant="h6">{profileData.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profileData.handle}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{profileData.bio}</Typography>
                  <Chip label={profileData.level} color="primary" />
                  <Box width="100%">
                    <Typography variant="caption">Reputação: {profileData.reputation} pts</Typography>
                    <LinearProgress variant="determinate" value={reputationProgress} sx={{ mt: 1 }} />
                  </Box>
                  <Typography variant="caption">Hortas públicas visíveis: {profileData.publicGardens}</Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" mb={1}>
                  Badges e conquistas
                </Typography>
                <Stack spacing={1}>
                  {profileData.achievements.map((badge) => (
                    <Chip key={badge} icon={<Iconify icon="eva:award-fill" />} label={badge} variant="outlined" />
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="subtitle1" mb={1}>
                  Ranking comunidade
                </Typography>
                <List dense>
                  {['Ana Oliveira - 1280 pts', 'Carlos Mendes - 1175 pts', 'Bruna Silva - 980 pts'].map((line) => (
                    <ListItem key={line} disablePadding>
                      <ListItemText primary={line} />
                    </ListItem>
                  ))}
                </List>
                <Typography variant="caption" color="text.secondary">
                  Atualização semanal e mensal.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" mb={1}>
                  12.2 Publicações
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Criar post com texto"
                  value={newPost.text}
                  onChange={(event) => setNewPost((previous) => ({ ...previous, text: event.target.value }))}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} mt={1.5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Marcar espécie"
                    placeholder="Ex.: Alface"
                    value={newPost.species}
                    onChange={(event) => setNewPost((previous) => ({ ...previous, species: event.target.value }))}
                  />
                  <Button variant="outlined" startIcon={<Iconify icon="eva:camera-fill" />} disabled>
                    Upload foto/vídeo (futuro)
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} mt={1.5} flexWrap="wrap" useFlexGap>
                  {['Problema', 'Solução', 'Automação', 'Receita compartilhada'].map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      clickable
                      color={newPost.tags.includes(tag) ? 'primary' : 'default'}
                      onClick={() => toggleTag(tag)}
                    />
                  ))}
                </Stack>
                <Button sx={{ mt: 2 }} variant="contained" onClick={publishPost}>
                  Publicar
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" mb={1}>
                  12.5 Feed da comunidade
                </Typography>
                <Tabs
                  value={feedType}
                  onChange={(_, value) => setFeedType(value)}
                  variant="scrollable"
                  allowScrollButtonsMobile
                >
                  {interestFeeds.map((feed) => (
                    <Tab key={feed} label={feed} />
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            <Stack spacing={2} mb={3}>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={(id) =>
                    setPosts((previous) =>
                      previous.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
                    )
                  }
                  onSave={(id) =>
                    setPosts((previous) =>
                      previous.map((item) => (item.id === id ? { ...item, saved: !item.saved } : item))
                    )
                  }
                  onAddComment={(id, text) =>
                    setPosts((previous) =>
                      previous.map((item) =>
                        item.id === id
                          ? {
                              ...item,
                              comments: [...item.comments, { id: Date.now(), user: profileData.name, text, replies: [] }],
                            }
                          : item
                      )
                    )
                  }
                />
              ))}
            </Stack>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" mb={1}>
                  12.4 Perguntas e respostas
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <TextField
                    fullWidth
                    label="Publicar dúvida"
                    value={question.title}
                    onChange={(event) => setQuestion((previous) => ({ ...previous, title: event.target.value }))}
                  />
                  <TextField
                    select
                    sx={{ minWidth: 180 }}
                    label="Tópico"
                    value={question.topic}
                    onChange={(event) => setQuestion((previous) => ({ ...previous, topic: event.target.value }))}
                  >
                    {qaTopics.map((topic) => (
                      <MenuItem key={topic} value={topic}>
                        {topic}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button variant="contained" onClick={submitQuestion}>
                    Publicar
                  </Button>
                </Stack>
                <Typography variant="body2" color="text.secondary" mt={1.5}>
                  Comunidade responde e você pode marcar a melhor resposta.
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="subtitle1" mb={1.5}>
                  12.7 Moderação
                </Typography>
                <List dense>
                  {moderationItems.map((item) => (
                    <ListItem key={item.id}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.light' }}>
                          <Iconify icon="eva:alert-triangle-fill" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={item.reason} secondary={item.status} />
                      <Button size="small" variant="outlined" color="warning">
                        Denunciar conteúdo
                      </Button>
                    </ListItem>
                  ))}
                </List>
                <Typography variant="caption" color="text.secondary">
                  Fluxo com remoção/ocultação de posts e banimento/suspensão de conta comunitária.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
