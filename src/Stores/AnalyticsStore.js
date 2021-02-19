import {Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {observable, action, computed} from 'mobx';
import autobind from 'autobind-decorator'
import axios from "axios";
//const API_URL = "http://pv.ts.com:4003";
import analytics from '@segment/analytics-react-native';

@autobind
export default class AnalyticsStore {
  constructor(){
    //this._loadAuthToken();
    this._loadAnalytics();
    //this._initFilters()
  }

  _loadAnalytics(){
    analytics.setup('kK09XCVStw6cG2L0anCPbierpagBd2VH', {
      // Record screen views automatically!
      recordScreenViews: true,
      // Record certain application events automatically!
      trackAppLifecycleEvents: true
    })
  }

  track(event, options = {}){
    analytics.track(event, options)
  }

  identify(userId, options = {}){
    analytics.identify(userId, options)
  }

  screen(screenName, options = {}){
    analytics.screen(screenName, options)
  }
}
