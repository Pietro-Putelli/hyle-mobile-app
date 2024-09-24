import ProfileIcon from '@/assets/icons/ProfileIcon.svg';
import SettingsIcon from '@/assets/icons/SettingsIcon.svg';
import HelpIcon from '@/assets/icons/HelpIcon.svg';
import SmallAddIcon from '@/assets/icons/SmallAddIcon.svg';
import RouteNames from './routeNames';

export const DrawerMenuItemKeys = {
  Account: 'account',
  Settings: 'settings',
  NewPick: 'new',
  Help: 'help',
};

export default [
  // {
  //   title: 'Profile',
  //   icon: ProfileIcon,
  //   key: DrawerMenuItemKeys.Account,
  //   route: RouteNames.Profile,
  // },
  {
    title: 'settings',
    icon: SettingsIcon,
    key: DrawerMenuItemKeys.Settings,
    route: RouteNames.Settings,
  },
  {
    title: 'newPick',
    icon: SmallAddIcon,
    key: DrawerMenuItemKeys.NewPick,
    route: RouteNames.AddPickStack,
  },
  {
    title: 'help',
    icon: HelpIcon,
    key: DrawerMenuItemKeys.Help,
    route: RouteNames.Help,
  },
];
