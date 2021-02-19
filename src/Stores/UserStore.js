import {Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {observable, action, computed} from 'mobx';
import autobind from 'autobind-decorator'
import axios from "axios";
import Intercom from 'react-native-intercom';

//const API_URL = "http://pv.ts.com:4003";
import analytics from '@segment/analytics-react-native';
import DeviceInfo from 'react-native-device-info';
const API_URL = 'https://parceled.termsheet.com';
const SERVER_AUTH_TOKEN = '50ED635ABAB395CAFA86';

@autobind
export default class UserStore {
  @observable isRegistered = false;
  @observable parceledUser = null;
  @observable installationDate = null;
  @observable trialDays = 14;
  @observable isProSubsciptionEnabled = false;
  @observable userSettings = {};
  @observable pdfReport = null;


  constructor(){
    this._loadAuth();
    this._loadUserSettings();
    this._loadPdfReport();
    //this._loadInstallationDate();
    //this._initFilters()
  }

  _loadInstallationDate = async () => {
    if(this.parceledUser){
      this.installationDate = new Date(this.parceledUser.created_at);
    }else{
      const val = await AsyncStorage.getItem('installationDate');
      if(val){
        this.installationDate = new Date(parseInt(val));
      }else{
        this.installationDate = new Date();
        await AsyncStorage.setItem('installationDate', this.installationDate.getTime().toString());
      }
    }
  }

  _loadAuth = async () => {
    const parceledUser = await AsyncStorage.getItem('parceledUserAuth');
    if(parceledUser){
      this.isRegistered = true;
      this.parceledUser = JSON.parse(parceledUser);
      this.loadParcledUser();
    }else{
      this.registerParceledUser(this.getDeviceId())
    }
    //register Parceled User with Intercom
    /*if(this.parceledUser && this.parceledUser.token){
      Intercom.registerIdentifiedUser({ userId: this.parceledUser.token, tag: 'mobile' });
    }*/
  }

  getDeviceId = () => {
    //Getting the Unique Id from here
    var id = DeviceInfo.getUniqueId();
    return id
  };

  _loadUserSettings = async () => {
    const userSettings = await AsyncStorage.getItem('userSettings');
    if(userSettings){
      this.userSettings = JSON.parse(userSettings)
    }else{
      this.userSettings = {
        mapType: 'mapbox://styles/mapbox/streets-v11'
      }
      this.persistUserSettings();
    }
  }

  _loadPdfReport = async () => {
    const pdfReport = await AsyncStorage.getItem('pdfReport');
    if(pdfReport){
      this.pdfReport = pdfReport
    }
  }

  persistSavedPdfReport = async (apn) => {
    await AsyncStorage.setItem('pdfReport', apn);
    this.pdfReport = apn;
  }

  async isUserRegistered(){
    try {
      if(!this.isRegistered && !this.parceledUser){
        const parceledUser = await AsyncStorage.getItem('parceledUserAuth');
        if(parceledUser){
          this.isRegistered = true;
          this.parceledUser = JSON.parse(parceledUser);
          this.loadParcledUser()
        }
        return this.isRegistered;
      }else{
        return this.isRegistered;
      }
    }catch(error){
      console.log(error.message);
      return false;
    }
  }

  persistUserSettings = async () => {
    await AsyncStorage.setItem('userSettings', JSON.stringify(this.userSettings));
  }

  persistParceledUser = async (data) => {
    await AsyncStorage.setItem('parceledUserAuth', JSON.stringify(data));
  }

  hasTrialExpired(){
    let today = new Date();
    let diff = today - this.installationDate;
    diff = diff / (1000 * 3600 * 24);
    let days = Math.round(diff);
    if(days > this.trialDays){
      return true;
    }else{
      return false;
    }
  }

  hasSubscriptionEnabled(productSku){
		if(this.parceledUser && this.parceledUser.is_subscription_active && this.parceledUser.product_sku){
      //for now just return whether active or not in case we have multiple subscriptions
      return this.parceledUser.is_subscription_active
			if(this.parceledUser.product_sku == productSku){
        return true;
      }else{
        return false;
      }
		}else{
			return false;
		}
	}

  subscribeEmailToParceled(email){
    return axios
    .post(`${API_URL}/api/v2/mobile/parceled_users`, {email: email}, { headers: { Authorization: SERVER_AUTH_TOKEN, 'Content-Type': 'application/json' } })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.data; // response.data = {auth_token: [...], user: { avatar_url: [...], email: [...], full_name: [...]}}
      } else {
        // TODO: handle 401
        throw new Error("authentication error , login failed");
      }
    }).catch(e => {
      console.log(e)
      //Promise.reject(e)
    });
  }

  registerParceledUser(deviceId, deviceToken = ''){
    return axios
    .post(`${API_URL}/api/v2/mobile/parceled_users`, {device_id: deviceId, device_token: deviceToken}, { headers: { Authorization: SERVER_AUTH_TOKEN, 'Content-Type': 'application/json' } })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        this.parceledUser = response.data;
        this.persistParceledUser(this.parceledUser)
        this._loadInstallationDate();
        return response.data;
      } else {
        // TODO: handle 401
        throw new Error("authentication error , login failed");
      }
    }).catch(e => {
      console.log(e)
      //Promise.reject(e)
    });
  }

  verifyEmailWithParceled(email, code){
    return axios
    .post(`${API_URL}/api/v2/mobile/parceled_users/verify`, {email: email, verification_code: code}, { headers: { Authorization: SERVER_AUTH_TOKEN, 'Content-Type': 'application/json' } })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.data; // response.data = {auth_token: [...], user: { avatar_url: [...], email: [...], full_name: [...]}}
      } else {
        // TODO: handle 401
        throw new Error("authentication error , login failed");
      }
    }).catch(e => {
      console.log(e)
      //Promise.reject(e)
    });
  }

  loadParcledUser(){
    return axios
    .get(`${API_URL}/api/v2/mobile/parceled_users/${this.parceledUser.token}`, { headers: { Authorization: SERVER_AUTH_TOKEN, 'Content-Type': 'application/json' } })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {

        this.parceledUser = response.data;
        this.persistParceledUser(this.parceledUser)
        if(this.hasSubscriptionEnabled('com.termsheet.com.parceled.pro')){
          this.isProSubsciptionEnabled = true;
        }
        this._loadInstallationDate();
        return response.data; // response.data = {auth_token: [...], user: { avatar_url: [...], email: [...], full_name: [...]}}
      } else {
        // TODO: handle 401
        throw new Error("authentication error , login failed");
      }
    }).catch(e => {
      console.log(e)
      //Promise.reject(e)
    });
  }
}
