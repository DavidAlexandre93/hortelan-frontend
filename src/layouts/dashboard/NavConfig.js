// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'monitoring',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'garden',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'catálogo de espécies',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill'),
  },

  {
    title: 'onboarding',
    path: '/dashboard/onboarding',
    icon: getIcon('eva:navigation-2-fill'),
  },
  {
    title: 'hortelan 360',
    path: '/dashboard/hortelan-360',
    icon: getIcon('eva:layers-fill'),
  },
  {
    title: 'community',
    path: '/dashboard/blog',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: 'login',
    path: '/login',
    icon: getIcon('eva:lock-fill'),
  },
  {
    title: 'register',
    path: '/register',
    icon: getIcon('eva:person-add-fill'),
  },
  {
    title: 'central de alertas',
    path: '/dashboard/alertas',
    icon: getIcon('eva:bell-fill'),
  },

  {
    title: 'relatórios',
    path: '/dashboard/relatorios',
    icon: getIcon('eva:bar-chart-2-fill'),
  },
  {
    title: 'status page',
    path: '/dashboard/status',
    icon: getIcon('eva:activity-fill'),
  },
  {
    title: 'security',
    path: '/dashboard/security',
    icon: getIcon('eva:shield-fill'),
  },

  {
    title: 'perfil',
    path: '/dashboard/profile',
    icon: getIcon('eva:person-fill'),
  },
];

export default navConfig;
