import AddPick from '@/screens/AddPick';
import BookDetail from '@/screens/BookDetail';
import BooksSelector from '@/screens/BooksSelector';
import Camera from '@/screens/Camera';
import CreateOrAddPick from '@/screens/CreateOrAddPick';
import EditAnnotation from '@/screens/EditAnnotation';
import EditMetadata from '@/screens/EditMetadata';
import EditTopics from '@/screens/EditTopics';
import Help from '@/screens/Help';
import Home from '@/screens/Home';
import KeywordDetails from '@/screens/KeywordDetails';
import Profile from '@/screens/Profile';
import Search from '@/screens/Search';
import Settings from '@/screens/Settings';
import SortPicks from '@/screens/SortPicks';
import RouteNames from './routeNames';

const homeRoute = {
  name: 'Home',
  component: Home,
};

const routes = [homeRoute];

export const stackRoutes = [
  {
    name: RouteNames.BookDetail,
    component: BookDetail,
  },
];

export const stackRoutesModal = [
  {
    name: RouteNames.Camera,
    component: Camera,
    options: {presentation: 'fullScreenModal'},
  },
  {
    name: RouteNames.SortPicks,
    component: SortPicks,
    options: {presentation: 'modal'},
  },
  {
    name: RouteNames.EditTopics,
    component: EditTopics,
    options: {presentation: 'modal'},
  },
  {
    name: RouteNames.EditMetadata,
    component: EditMetadata,
    options: {presentation: 'modal'},
  },
  {
    name: RouteNames.KeywordDetails,
    component: KeywordDetails,
    options: {presentation: 'transparentModal', animation: 'fade'},
  },
  {
    name: RouteNames.EditAnnotation,
    component: EditAnnotation,
    options: {presentation: 'modal'},
  },
  // {
  //   name: RouteNames.Paywall,
  //   component: Paywall,
  // },
  {
    name: RouteNames.Search,
    component: Search,
    options: {presentation: 'transparentModal', animation: 'fade'},
  },
];

export const pageModalRoutes = [
  {
    name: RouteNames.Profile,
    component: Profile,
  },
  {
    name: RouteNames.Settings,
    component: Settings,
  },
  {
    name: RouteNames.Help,
    component: Help,
  },
];

export const addPickRoutes = [
  {
    name: RouteNames.AddPick,
    component: AddPick,
  },
];

export const createOrAddPickRoutes = [
  {
    name: RouteNames.CreateOrAddPick,
    component: CreateOrAddPick,
  },
  {
    name: RouteNames.BooksSelector,
    component: BooksSelector,
  },
];

export const searchStackRoutes = [
  {
    name: RouteNames.Search,
    component: Search,
    options: {presentation: 'transparentModal', animation: 'fade'},
  },
];

export const drawerRoutes = [homeRoute];

export default routes;
