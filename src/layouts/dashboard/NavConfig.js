import Iconify from '../../components/Iconify';

const icon = (name) => <Iconify icon={name} width={21} height={21} />;

const navConfig = [
  { title: 'Monitoramento', path: '/dashboard/app', icon: icon('eva:activity-fill') },
  { title: 'Alertas', path: '/dashboard/alertas', icon: icon('eva:bell-fill') },
  { title: 'Relatorios', path: '/dashboard/relatorios', icon: icon('eva:bar-chart-2-fill') },
  { title: 'Especies', path: '/dashboard/products', icon: icon('eva:book-open-fill') },
  { title: 'Hortelan 360', path: '/dashboard/hortelan-360', icon: icon('eva:layers-fill') },
  { title: 'Integracoes', path: '/dashboard/integracoes', icon: icon('eva:link-2-fill') },
  { title: 'Comunidade', path: '/dashboard/blog', icon: icon('eva:message-square-fill') },
  { title: 'Administracao', path: '/dashboard/admin', icon: icon('eva:people-fill') },
  { title: 'Status', path: '/dashboard/status', icon: icon('eva:activity-outline') },
  { title: 'Seguranca', path: '/dashboard/security', icon: icon('eva:shield-fill') },
  { title: 'Perfil', path: '/dashboard/profile', icon: icon('eva:person-fill') },
];

export default navConfig;
