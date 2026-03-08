import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack, Paper, TextField } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
//
import navConfig from './NavConfig';
import useAuth from '../../auth/useAuth';

// ----------------------------------------------------------------------

const BOT_GREETING = 'Olá! Eu sou o Hortelan Bot 🤖. Posso ajudar com monitoramento, irrigação, sensores e operações da plataforma.';

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');
  const { user } = useAuth();
  const mobileDrawerWidth = { xs: '86vw', sm: 320 };
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([{ role: 'bot', content: BOT_GREETING }]);

  const hortelanReply = useMemo(
    () => (question) => {
      const normalized = question.toLowerCase();

      if (normalized.includes('irrig')) {
        return 'Para irrigação, acesse Monitoramento > Irrigação e valide umidade do solo + agenda automática antes de confirmar os ciclos.';
      }

      if (normalized.includes('sensor') || normalized.includes('dispositivo')) {
        return 'No painel de dispositivos, confira firmware, conexão e bateria. Se quiser, posso te guiar no checklist de diagnóstico.';
      }

      if (normalized.includes('relatório') || normalized.includes('relatorio')) {
        return 'Você pode gerar relatórios em Dashboard > Relatórios para acompanhar consumo, eventos críticos e desempenho por período.';
      }

      return 'Entendi! Posso te ajudar com irrigação, alertas, sensores, relatórios e onboarding da plataforma Hortelan. Me conte seu objetivo.';
    },
    []
  );

  const handleSendMessage = () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: trimmedPrompt },
      { role: 'bot', content: hortelanReply(trimmedPrompt) },
    ]);
    setPrompt('');
  };

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo sx={{ width: 80, height: 80 }} />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar src={user?.photoURL || ''} alt={user?.name || 'Usuário'} />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {user?.name || 'Usuário'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user?.role || '-'}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection navConfig={navConfig} />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
          <Box
            component="img"
            src="/static/illustrations/illustration_avatar.png"
            sx={{ width: 100, position: 'absolute', top: -50 }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography gutterBottom variant="h6">
              Precisa de ajuda com a sua operação?
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Converse direto com o nosso chat bot de IA especializado na plataforma Hortelan.
            </Typography>
          </Box>

          <Paper
            variant="outlined"
            sx={(theme) => ({
              width: 1,
              p: 1.5,
              borderRadius: 3,
              borderColor: alpha(theme.palette.primary.main, 0.25),
              background: `linear-gradient(165deg, ${alpha(theme.palette.primary.light, 0.18)} 0%, ${theme.palette.background.paper} 35%, ${alpha(theme.palette.success.light, 0.12)} 100%)`,
              boxShadow: `0 14px 36px ${alpha(theme.palette.grey[900], 0.16)}`,
            })}
          >
            <Stack spacing={1.4}>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    sx={(theme) => ({
                      width: 28,
                      height: 28,
                      bgcolor: alpha(theme.palette.primary.main, 0.16),
                      color: 'primary.main',
                    })}
                  >
                    <SmartToyIcon fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2">Hortelan Bot</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>
                      Assistente inteligente da operação
                    </Typography>
                  </Box>
                </Stack>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', boxShadow: '0 0 0 4px rgba(34,197,94,0.18)' }} />
              </Stack>

              <Stack
                spacing={0.9}
                sx={(theme) => ({
                  maxHeight: 200,
                  overflowY: 'auto',
                  px: 0.5,
                  py: 0.25,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.neutral || theme.palette.grey[500], 0.18),
                })}
              >
                {messages.map((message, index) => (
                  <Box
                    key={`${message.role}-${index}`}
                    sx={(theme) => ({
                      alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                      bgcolor:
                        message.role === 'user'
                          ? `linear-gradient(130deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                          : alpha(theme.palette.background.paper, 0.94),
                      color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                      px: 1.15,
                      py: 0.9,
                      borderRadius: 2,
                      borderTopRightRadius: message.role === 'user' ? 0.5 : 2,
                      borderTopLeftRadius: message.role === 'user' ? 2 : 0.5,
                      maxWidth: '92%',
                      boxShadow:
                        message.role === 'user'
                          ? `0 8px 16px ${alpha(theme.palette.primary.dark, 0.35)}`
                          : `0 4px 14px ${alpha(theme.palette.grey[700], 0.1)}`,
                    })}
                  >
                    <Typography variant="caption" sx={{ display: 'block', whiteSpace: 'pre-wrap', lineHeight: 1.45 }}>
                      {message.content}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <TextField
                size="small"
                placeholder="Ex.: Como configuro alertas de irrigação?"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSendMessage();
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.8,
                    bgcolor: 'background.paper',
                  },
                }}
              />

              <Button
                onClick={handleSendMessage}
                variant="contained"
                fullWidth
                sx={{
                  py: 1,
                  borderRadius: 1.8,
                  boxShadow: (theme) => `0 12px 20px ${alpha(theme.palette.primary.dark, 0.35)}`,
                  textTransform: 'none',
                  fontWeight: 700,
                }}
              >
                Enviar para o Chat Bot
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: mobileDrawerWidth, maxWidth: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
