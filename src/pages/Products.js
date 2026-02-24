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

const sortMap = {
  preco: (a, b) => a.preco - b.preco,
  popularidade: (a, b) => b.popularidade - a.popularidade,
  avaliacao: (a, b) => b.avaliacao - a.avaliacao,
};

export default function ProductsMarketplace() {
  const rootRef = useRef(null);
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
      const chips = selector('.gsap-category-chip');
      const storyCards = selector('.gsap-story-card');

      const animateIn = (element, delay, offset = 24) => {
        if (!element) return;
        element.animate(
          [
            { opacity: 0, transform: `translateY(${offset}px)` },
            { opacity: 1, transform: 'translateY(0px)' },
          ],
          { duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', delay, fill: 'forwards' }
        );
      };

      animateIn(heroTitle, 0, 34);
      animateIn(heroSubtitle, 140, 24);
      animateIn(heroBanner, 260, 22);
      chips.forEach((chip, index) => animateIn(chip, 310 + index * 35, 12));

      const storyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            storyCards.forEach((card, index) => animateIn(card, index * 120, 32));
          });
        },
        { threshold: 0.22 }
      );

      const storySection = selector('.gsap-story-section')[0];
      if (storySection) storyObserver.observe(storySection);

      const onScroll = () => {
        if (!heroBanner || !root) return;
        const rect = root.getBoundingClientRect();
        const rawProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + 280)));
        heroBanner.style.transform = `translate3d(0, ${-rawProgress * 26}px, 0)`;
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      return () => {
        window.removeEventListener('scroll', onScroll);
        storyObserver.disconnect();
      };
    },
    { scope: rootRef }
  );

  return (
    <Page title="Marketplace Hortelan Agtech Ltda">
      <Container ref={rootRef}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography className="gsap-hero-title" variant="h4">
            Catálogo de produtos Hortelan Agtech Ltda
          </Typography>
          <Typography className="gsap-hero-subtitle" color="text.secondary">
            Explore sementes, substratos, fertilizantes, sensores, kits, irrigação e ferramentas com filtros avançados.
          </Typography>
        </Stack>

        <Box className="gsap-hero-banner-wrapper" sx={{ mb: 3, overflow: 'hidden' }}>
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

        <Paper sx={{ p: 2, mb: 3 }}>
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
                    <Paper key={product.id} variant="outlined" sx={{ p: 1.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                        <Box>
                          <Typography variant="subtitle2">{product.nome}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product.categoria} • {product.marca}
                          </Typography>
                          <Typography variant="body2">R$ {product.preco.toFixed(2)}</Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Button size="small" onClick={() => setSelectedProductId(product.id)}>
                            Detalhes
                          </Button>
                          <Button size="small" variant="contained" onClick={() => addToCart(product.id)}>
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

        <Grid container spacing={3} sx={{ mt: 1 }}>
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
                <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
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
                <Button fullWidth variant="contained" sx={{ mt: 2 }}>
                  Confirmar pedido
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1, mb: 4 }}>
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
