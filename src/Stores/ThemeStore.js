import AsyncStorage from '@react-native-community/async-storage';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';

@autobind
export default class ThemeStore {
  @observable isDark = 'true';

  constructor() {
    this._checkAppTheme();
  }

  _checkAppTheme = async () => {
    const isDark = await AsyncStorage.getItem('isDark');
    console.log('inside check app them', JSON.parse(isDark));
    if (isDark !== undefined && isDark !== null) {
      console.log('inside if');
      this.isDark = await JSON.parse(isDark);
      console.log('inside if ---', JSON.parse(isDark));
      console.log('inside if -===--', this.isDark);
      return JSON.parse(isDark);
    } else {
      console.log('inside else');
      this.isDark = false;
      await AsyncStorage.setItem('isDark', JSON.stringify(false));
      return this.isDark;
    }
  };

  _setAppTheme = async themeInput => {
    this.isDark = themeInput;
    await AsyncStorage.setItem('isDark', JSON.stringify(themeInput));
  };
}
