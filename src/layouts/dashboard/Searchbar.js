import { useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import { Button, ClickAwayListener, IconButton, Input, InputAdornment, Slide, Tooltip } from '@mui/material';
import Iconify from '../../components/Iconify';

const SearchLayer = styled('div')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  zIndex: 99,
  height: 68,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0, 2),
  backgroundColor: alpha(theme.palette.background.paper, 0.98),
  [theme.breakpoints.up('md')]: { padding: theme.spacing(0, 4) },
}));

export default function Searchbar() {
  const [open, setOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div>
        {!open && (
          <Tooltip title="Pesquisar">
            <IconButton onClick={() => setOpen(true)} aria-label="Pesquisar na plataforma">
              <Iconify icon="eva:search-fill" width={20} height={20} />
            </IconButton>
          </Tooltip>
        )}
        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <SearchLayer>
            <Input
              fullWidth
              disableUnderline
              placeholder="Pesquisar na plataforma"
              inputProps={{ 'aria-label': 'Pesquisar na plataforma' }}
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" width={20} />
                </InputAdornment>
              }
            />
            <Button variant="contained" onClick={() => setOpen(false)}>
              Pesquisar
            </Button>
          </SearchLayer>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}
