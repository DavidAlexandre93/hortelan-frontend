import Iconify from '../../components/Iconify';
import { dashboardNavigation, dashboardRoutes } from '../../routing/routeManifest';

const icon = (name) => <Iconify icon={name} width={21} height={21} />;

const ICONS = {
  '/dashboard/app': 'eva:activity-fill',
  '/dashboard/alertas': 'eva:bell-fill',
  '/dashboard/relatorios': 'eva:bar-chart-2-fill',
  '/dashboard/products': 'eva:book-open-fill',
  '/dashboard/hortelan-360': 'eva:layers-fill',
  '/dashboard/blog': 'eva:message-square-fill',
  '/dashboard/admin': 'eva:people-fill',
  '/dashboard/integracoes': 'eva:link-2-fill',
  '/dashboard/status': 'eva:activity-outline',
  '/dashboard/security': 'eva:shield-fill',
  '/dashboard/profile': 'eva:person-fill',
};

const navConfig = dashboardNavigation.map(({ title, paths }) => ({
  title,
  group: true,
  children: paths
    .map((path) => dashboardRoutes.find((route) => route.canonicalPath === path))
    .filter((route) => route && ICONS[route.canonicalPath])
    .map((route) => ({
      title: route.title,
      path: route.canonicalPath,
      icon: icon(ICONS[route.canonicalPath]),
    })),
}));
export default navConfig;
