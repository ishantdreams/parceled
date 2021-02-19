import TermSheetStore from './TermSheetStore';
import ParcelStore from './ParcelStore';
import AnalyticsStore from './AnalyticsStore';
import UserStore from './UserStore';
import IapStore from './IapStore';
import ThemeStore from './ThemeStore';

export default {
  termSheetStore: new TermSheetStore(),
  parcelStore: new ParcelStore(),
  analyticsStore: new AnalyticsStore(),
  userStore: new UserStore(),
  iapStore: new IapStore(),
  themeStore: new ThemeStore(),
  // place for other stores...
};
