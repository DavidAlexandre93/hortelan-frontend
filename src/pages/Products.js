import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaidIcon from '@mui/icons-material/Paid';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import Page from '../components/Page';
import HortelanPromoBanner from '../components/HortelanPromoBanner';
import useGSAP from '../hooks/useGSAP';
import productCatalog, { categories } from '../data/productCatalog';
import { motion, useScroll, useTransform } from '../lib/motionReact';
import GSAPTypingText from '../components/GSAPTypingText';

const sortMap = {
  preco: (a, b) => a.preco - b.preco,
  popularidade: (a, b) => b.popularidade - a.popularidade,
  avaliacao: (a, b) => b.avaliacao - a.avaliacao,
};

export default function ProductsMarketplace() {
  const rootRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const bannerY = useTransform(scrollYProgress, [0, 1], [0, -26]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState(500);
  const [brand, setBrand] = useState('');
  const [compatibility, setCompatibility] = useState('');
  const [cultivo, setCultivo] = useState('');
  const [sortBy, setSortBy] = useState('popularidade');
  const [selectedProductId, setSelectedProductId] = useState(productCatalog[0].id);
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [cep, setCep] = useState('');
  const [checkout, setCheckout] = useState({ endereco: '', entrega: 'padrão', pagamento: 'pix' });

  const uniqueBrands = useMemo(() => [...new Set(productCatalog.map((item) => item.marca))], []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    return productCatalog
      .filter((product) => {
        const matchesQuery =
          !normalizedQuery ||
          product.nome.toLowerCase().includes(normalizedQuery) ||
          product.categoria.toLowerCase().includes(normalizedQuery);
        const matchesCategory = !selectedCategory || product.categoria === selectedCategory;
        const matchesPrice = product.preco <= maxPrice;
        const matchesBrand = !brand || product.marca === brand;
        const matchesCompatibility = !compatibility || product.compatibilidade.includes(compatibility);
        const matchesCultivo = !cultivo || product.tipoCultivo.includes(cultivo);

        return matchesQuery && matchesCategory && matchesPrice && matchesBrand && matchesCompatibility && matchesCultivo;
      })
      .sort(sortMap[sortBy]);
  }, [query, selectedCategory, maxPrice, brand, compatibility, cultivo, sortBy]);

  const selectedProduct = useMemo(
    () => productCatalog.find((product) => product.id === selectedProductId) || filteredProducts[0],
    [selectedProductId, filteredProducts]
  );

  const cartItemsDetailed = useMemo(
    () =>
      cart.map((entry) => {
        const product = productCatalog.find((item) => item.id === entry.id);
        return { ...entry, product, subtotal: (product?.preco || 0) * entry.quantidade };
      }),
    [cart]
  );

  const subtotal = cartItemsDetailed.reduce((acc, item) => acc + item.subtotal, 0);
  const desconto = coupon.toLowerCase() === 'hortelan10' ? subtotal * 0.1 : 0;
  const frete = subtotal > 0 ? (cep.length >= 8 ? 18.9 : 24.9) : 0;
  const total = subtotal - desconto + frete;

  const addToCart = (productId) => {
    setCart((prev) => {
      const exists = prev.find((entry) => entry.id === productId);
      if (exists) {
        return prev.map((entry) => (entry.id === productId ? { ...entry, quantidade: entry.quantidade + 1 } : entry));
      }
      return [...prev, { id: productId, quantidade: 1 }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((entry) => entry.id !== productId));
      return;
    }

    setCart((prev) => prev.map((entry) => (entry.id === productId ? { ...entry, quantidade: quantity } : entry)));
  };

  const recommendations = [
    'Insumos sugeridos a partir de alertas de deficiência nutricional detectados na sua estufa.',
    'Produtos compatíveis com alface e rúcula no seu cultivo principal (vaso indoor).',
    'Kit recomendado para o seu perfil: automação leve + irrigação por gotejo.',
  ];

  const orders = [
    { id: 'PED-1024', status: 'Em transporte', rastreio: 'BR123456789', itens: 'Kit de Cultivo Iniciante' },
    { id: 'PED-1013', status: 'Entregue', rastreio: 'BR987654321', itens: 'Substrato + Fertilizante Foliar' },
  ];

  useGSAP(
    ({ selector, root }) => {
      const heroTitle = selector('.gsap-hero-title')[0];
      const heroSubtitle = selector('.gsap-hero-subtitle')[0];
      const heroBanner = selector('.gsap-hero-banner')[0];
      const heroWrapper = selector('.gsap-hero-banner-wrapper')[0];
      const chips = selector('.gsap-category-chip');
      const storyCards = selector('.gsap-story-card');
      const storyRows = selector('.gsap-product-row');
      const glowButtons = selector('.gsap-glow-button');
      const kineticOrbs = selector('.gsap-float-orb');
      const revealSections = selector('.gsap-reveal-section');
      const cleanupCallbacks = [];
      const animations = [];

      const animateIn = (element, delay, offset = 24, duration = 700) => {
        if (!element) return;
        animations.push(
          element.animate(
            [
              { opacity: 0, transform: `translateY(${offset}px)` },
              { opacity: 1, transform: 'translateY(0px)' },
            ],
            { duration, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', delay, fill: 'forwards' }
          )
        );
      };

      const addMagneticHover = (element, strength = 8) => {
        if (!element) return;
        const onMove = (event) => {
          const rect = element.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width - 0.5) * strength;
          const y = ((event.clientY - rect.top) / rect.height - 0.5) * strength;
          element.style.transform = `translate(${x}px, ${y}px)`;
        };

        const onLeave = () => {
          element.style.transform = 'translate(0px, 0px)';
        };

        element.addEventListener('pointermove', onMove);
        element.addEventListener('pointerleave', onLeave);
        cleanupCallbacks.push(() => {
          element.removeEventListener('pointermove', onMove);
          element.removeEventListener('pointerleave', onLeave);
          element.style.transform = '';
        });
      };

      animateIn(heroTitle, 0, 34);
      animateIn(heroSubtitle, 140, 24);
      animateIn(heroBanner, 260, 22);
      chips.forEach((chip, index) => {
        animateIn(chip, 310 + index * 35, 12);
        addMagneticHover(chip, 6);
      });
      storyCards.forEach((card, index) => animateIn(card, 520 + index * 120, 32, 800));

      kineticOrbs.forEach((orb, index) => {
        animations.push(
          orb.animate(
            [
              { transform: 'translate3d(0px, 0px, 0px) scale(1)', opacity: 0.3 },
              { transform: `translate3d(${index % 2 === 0 ? 16 : -16}px, -20px, 0px) scale(1.16)`, opacity: 0.65 },
              { transform: 'translate3d(0px, 0px, 0px) scale(1)', opacity: 0.3 },
            ],
            { duration: 2800 + index * 700, easing: 'ease-in-out', iterations: Infinity }
          )
        );
      });

      glowButtons.forEach((button, index) => {
        animations.push(
          button.animate(
            [
              { boxShadow: '0 0 0 rgba(34, 197, 94, 0)', transform: 'translateY(0px)' },
              { boxShadow: '0 12px 28px rgba(34, 197, 94, 0.35)', transform: 'translateY(-1px)' },
              { boxShadow: '0 0 0 rgba(34, 197, 94, 0)', transform: 'translateY(0px)' },
            ],
            { duration: 2100 + index * 220, easing: 'ease-in-out', iterations: Infinity }
          )
        );
      });

      storyRows.forEach((row) => addMagneticHover(row, 12));

      if (heroWrapper) {
        const onHeroMove = (event) => {
          const rect = heroWrapper.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
          const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
          heroWrapper.style.transform = `perspective(1400px) rotateX(${-y}deg) rotateY(${x}deg)`;
        };

        const onHeroLeave = () => {
          heroWrapper.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg)';
        };

        heroWrapper.addEventListener('pointermove', onHeroMove);
        heroWrapper.addEventListener('pointerleave', onHeroLeave);
        cleanupCallbacks.push(() => {
          heroWrapper.removeEventListener('pointermove', onHeroMove);
          heroWrapper.removeEventListener('pointerleave', onHeroLeave);
          heroWrapper.style.transform = '';
        });
      }

      const observer =
        typeof IntersectionObserver !== 'undefined'
          ? new IntersectionObserver(
              (entries) => {
                entries.forEach((entry) => {
                  if (!entry.isIntersecting) return;
                  animations.push(
                    entry.target.animate(
                      [
                        { opacity: 0, transform: 'translateY(24px) scale(0.98)' },
                        { opacity: 1, transform: 'translateY(0px) scale(1)' },
                      ],
                      { duration: 700, fill: 'forwards', easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
                    )
                  );
                  observer.unobserve(entry.target);
                });
              },
              { threshold: 0.22 }
            )
          : null;

      revealSections.forEach((section) => {
        if (!observer) return;
        section.style.opacity = '0';
        observer.observe(section);
      });

      return () => {
        cleanupCallbacks.forEach((cleanup) => cleanup());
        animations.forEach((animation) => animation.cancel());
        if (observer) observer.disconnect();
        if (!root) return;
      };
    },
    { scope: rootRef }
  );

  return (
    <Page title="Marketplace Hortelan Agtech Ltda">
      <Container ref={rootRef} sx={{ position: 'relative', overflow: 'hidden' }}>
        <Box className="gsap-float-orb" sx={{ position: 'absolute', top: 120, right: -24, width: 120, height: 120, borderRadius: '50%', bgcolor: 'success.light', filter: 'blur(18px)', opacity: 0.28, pointerEvents: 'none' }} />
        <Box className="gsap-float-orb" sx={{ position: 'absolute', top: 340, left: -34, width: 140, height: 140, borderRadius: '50%', bgcolor: 'primary.light', filter: 'blur(22px)', opacity: 0.24, pointerEvents: 'none' }} />
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography className="gsap-hero-title" variant="h4">
            <GSAPTypingText
              texts={[
                'Catálogo de produtos Hortelan Agtech Ltda',
                'Marketplace inteligente para sua operação agrícola',
                'Compre insumos e automação com curadoria Hortelan',
              ]}
            />
          </Typography>
          <Typography className="gsap-hero-subtitle" color="text.secondary">
            <GSAPTypingText
              texts={[
                'Explore sementes, substratos, fertilizantes e sensores com filtros avançados.',
                'Descubra kits de irrigação e ferramentas validadas para estufa, indoor e hidroponia.',
              ]}
              speed={30}
              eraseSpeed={18}
              holdDuration={1200}
              startDelay={200}
            />
          </Typography>
        </Stack>

        <Box
          component={motion.div}
          className="gsap-hero-banner-wrapper"
          sx={{ mb: 3, overflow: 'hidden' }}
          style={{ y: bannerY }}
        >
          <HortelanPromoBanner className="gsap-hero-banner" />
        </Box>

        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
          {categories.map((category) => (
            <Chip
              key={category}
              className="gsap-category-chip"
              label={category}
              clickable
              color={selectedCategory === category ? 'primary' : 'default'}
              onClick={() => setSelectedCategory((prev) => (prev === category ? '' : category))}
            />
          ))}
        </Stack>

        <Paper className="gsap-reveal-section" sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Busca por nome/categoria"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                type="number"
                label="Preço máximo"
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value || 0))}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Marca</InputLabel>
                <Select value={brand} label="Marca" onChange={(event) => setBrand(event.target.value)}>
                  <MenuItem value="">Todas</MenuItem>
                  {uniqueBrands.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Compatibilidade</InputLabel>
                <Select
                  value={compatibility}
                  label="Compatibilidade"
                  onChange={(event) => setCompatibility(event.target.value)}
                >
                  <MenuItem value="">Todas</MenuItem>
                  <MenuItem value="Hidroponia">Hidroponia</MenuItem>
                  <MenuItem value="Vaso">Vaso</MenuItem>
                  <MenuItem value="Indoor">Indoor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Tipo de cultivo</InputLabel>
                <Select value={cultivo} label="Tipo de cultivo" onChange={(event) => setCultivo(event.target.value)}>
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="hidroponia">Hidroponia</MenuItem>
                  <MenuItem value="vaso">Vaso</MenuItem>
                  <MenuItem value="indoor">Indoor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Ordenação</InputLabel>
                <Select value={sortBy} label="Ordenação" onChange={(event) => setSortBy(event.target.value)}>
                  <MenuItem value="preco">Preço</MenuItem>
                  <MenuItem value="popularidade">Popularidade</MenuItem>
                  <MenuItem value="avaliacao">Avaliação</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Grid className="gsap-story-section" container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card className="gsap-story-card">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Produtos ({filteredProducts.length})
                </Typography>
                <Stack spacing={1.5}>
                  {filteredProducts.map((product) => (
                    <Paper key={product.id} className="gsap-product-row" variant="outlined" sx={{ p: 1.5, transition: 'transform 220ms ease' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                        <Box>
                          <Typography variant="subtitle2">{product.nome}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product.categoria} • {product.marca}
                          </Typography>
                          <Typography variant="body2">R$ {product.preco.toFixed(2)}</Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Button size="small" className="gsap-glow-button" onClick={() => setSelectedProductId(product.id)}>
                            Detalhes
                          </Button>
                          <Button size="small" variant="contained" className="gsap-glow-button" onClick={() => addToCart(product.id)}>
                            Adicionar
                          </Button>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            {selectedProduct && (
              <Card className="gsap-story-card">
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Página de produto
                  </Typography>
                  <Typography variant="h5">{selectedProduct.nome}</Typography>
                  <Stack direction="row" spacing={1} sx={{ my: 2 }}>
                    {selectedProduct.fotos.map((foto) => (
                      <Avatar key={foto} src={foto} variant="rounded" sx={{ width: 88, height: 88 }} />
                    ))}
                  </Stack>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {selectedProduct.descricaoTecnica}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
                    Compatibilidade Hortelan Agtech Ltda: {selectedProduct.compatibilidadeHortelan}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                    <Chip icon={<Inventory2Icon />} label={`Estoque: ${selectedProduct.estoque}`} />
                    <Chip label={selectedProduct.previsaoReposicao} />
                    <Chip label={`Avaliação: ${selectedProduct.avaliacao}`} color="warning" />
                  </Stack>

                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2">Avaliações e comentários</Typography>
                  <List dense>
                    {selectedProduct.comentarios.map((item) => (
                      <ListItem key={`${selectedProduct.id}-${item.autor}`}>
                        <ListItemText primary={`${item.autor} (${item.nota}/5)`} secondary={item.texto} />
                      </ListItem>
                    ))}
                  </List>

                  <Typography variant="subtitle2">Produtos relacionados</Typography>
                  <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
                    {selectedProduct.relacionados.map((relatedId) => {
                      const related = productCatalog.find((item) => item.id === relatedId);
                      return (
                        <Chip
                          key={relatedId}
                          label={related?.nome || relatedId}
                          onClick={() => setSelectedProductId(relatedId)}
                          clickable
                        />
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        <Grid className="gsap-reveal-section" container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <ShoppingCartCheckoutIcon />
                  <Typography variant="h6">Carrinho</Typography>
                </Stack>
                <Stack spacing={1.5}>
                  {cartItemsDetailed.map((item) => (
                    <Paper key={item.id} variant="outlined" sx={{ p: 1.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2">{item.product?.nome}</Typography>
                        <Button color="error" size="small" onClick={() => updateQuantity(item.id, 0)}>
                          Remover
                        </Button>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                        <TextField
                          type="number"
                          size="small"
                          label="Qtd"
                          value={item.quantidade}
                          onChange={(event) => updateQuantity(item.id, Number(event.target.value || 1))}
                          sx={{ width: 90 }}
                        />
                        <Typography variant="body2">Subtotal: R$ {item.subtotal.toFixed(2)}</Typography>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>

                <TextField
                  fullWidth
                  label="Cupom"
                  placeholder="Use HORTELAN10"
                  value={coupon}
                  onChange={(event) => setCoupon(event.target.value)}
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  label="Simular frete (CEP)"
                  value={cep}
                  onChange={(event) => setCep(event.target.value)}
                  sx={{ mt: 2 }}
                />
                <Button fullWidth className="gsap-glow-button" variant="outlined" sx={{ mt: 2 }}>
                  Salvar carrinho
                </Button>

                <Stack spacing={0.5} sx={{ mt: 2 }}>
                  <Typography variant="body2">Subtotal: R$ {subtotal.toFixed(2)}</Typography>
                  <Typography variant="body2">Desconto: R$ {desconto.toFixed(2)}</Typography>
                  <Typography variant="body2">Frete: R$ {frete.toFixed(2)}</Typography>
                  <Typography variant="subtitle1">Total: R$ {total.toFixed(2)}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Checkout
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Endereço de entrega"
                      value={checkout.endereco}
                      onChange={(event) => setCheckout((prev) => ({ ...prev, endereco: event.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Método de entrega</InputLabel>
                      <Select
                        value={checkout.entrega}
                        label="Método de entrega"
                        onChange={(event) => setCheckout((prev) => ({ ...prev, entrega: event.target.value }))}
                      >
                        <MenuItem value="padrão">Padrão</MenuItem>
                        <MenuItem value="expresso">Expresso</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Meio de pagamento</InputLabel>
                      <Select
                        value={checkout.pagamento}
                        label="Meio de pagamento"
                        onChange={(event) => setCheckout((prev) => ({ ...prev, pagamento: event.target.value }))}
                      >
                        <MenuItem value="pix">Pix</MenuItem>
                        <MenuItem value="cartão">Cartão</MenuItem>
                        <MenuItem value="boleto">Boleto</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Alert icon={<PaidIcon />} severity="info" sx={{ mt: 2 }}>
                  Resumo do pedido: {cartItemsDetailed.length} itens, total de R$ {total.toFixed(2)}.
                </Alert>
                <Button fullWidth className="gsap-glow-button" variant="contained" sx={{ mt: 2 }}>
                  Confirmar pedido
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid className="gsap-reveal-section" container spacing={3} sx={{ mt: 1, mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Área do cliente (pedidos)
                </Typography>
                {orders.map((order) => (
                  <Paper key={order.id} variant="outlined" sx={{ p: 1.5, mb: 1.5 }}>
                    <Typography variant="subtitle2">{order.id}</Typography>
                    <Typography variant="body2">Itens: {order.itens}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                      <LocalShippingIcon fontSize="small" />
                      <Typography variant="body2">Status: {order.status}</Typography>
                    </Stack>
                    <Typography variant="body2">Rastreamento: {order.rastreio}</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Button size="small" variant="outlined">
                        Recompra rápida
                      </Button>
                      <Button size="small">Solicitar suporte/troca</Button>
                    </Stack>
                  </Paper>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Recomendações contextuais
                </Typography>
                <List>
                  {recommendations.map((recommendation) => (
                    <ListItem key={recommendation}>
                      <ListItemAvatar>
                        <Avatar>✓</Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={recommendation} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
