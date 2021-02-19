import {Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {observable, action, computed} from 'mobx';
import autobind from 'autobind-decorator';
import ImageResizer from 'react-native-image-resizer';
import axios from "axios";
const PLACEHOLDER = 'https://raw.githubusercontent.com/feathersjs/feathers-chat/master/public/placeholder.png';
const API_URL = 'https://app.termsheet.com';
//const API_URL = "http://pv.ts.com:4003";

//const API_URL = 'https://wwws.realtyclub.com';

@autobind
export default class TermSheetStore {
  @observable isAuthenticated = false;
  @observable isConnecting = false;
  @observable user = null;
  @observable messages = [];
  @observable hasMoreMessages = false;
  @observable skip = 0;
  @observable authToken = '';
  @observable accountId = null;
  @observable version = '1.0.0';
  @observable account = null;


  constructor(){
    this._loadAuthToken();
    this._loadAccountId();
  }

  _loadAuthToken = async () => {
    const authToken = await AsyncStorage.getItem('authToken');

    if(authToken){
      this.isAuthenticated = true;
      this.authToken = authToken;
    }
  }

  _loadAccountId = async () => {
    const accountId = await AsyncStorage.getItem('accountId');

    if(accountId){
      this.accountId = accountId;
      this.loadAccount(this.accountId);
    }
  }

  _removeAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
  };

  _setAccountId = async(accountId) => {
    await AsyncStorage.setItem('accountId', accountId);
    this.accountId = accountId;
  }

  setAccountId(accountId){
    this._setAccountId(accountId);
  }

  connect(){
    this.isConnecting = true;

    this.app.io.on('connect', () => {
      this.isConnecting = false;

      this.authenticate().then(() => {
        console.log("authenticated");
      }).catch(error => {
        consoe.log("error");
      });
    });
  }

  login(email, password) {
    const payload = {
      strategy: 'local',
      email,
      password
    };
    return this.authenticate(payload);
  }

  authenticate(options) {
    console.log("authenticate")
    options = options ? options : undefined;
    return this._authenticate(options).then(response => {
      console.log(response)
      this.user = response.user;
      this.authToken = response.auth_token
      this.isAuthenticated = true;
      return Promise.resolve([this.user, this.authToken]);
    }).catch(error => {
      console.log('authenticated failed', error.message);
      console.log(error);
      return Promise.reject(error);
    });
  }

  _authenticate(payload) {
    return axios
    .post(`${API_URL}/api/authenticate`, payload)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.data; // response.data = {auth_token: [...], user: { avatar_url: [...], email: [...], full_name: [...]}}
      } else {
        // TODO: handle 401
        throw new Error("authentication error , login failed");
      }
    }).catch(e => Promise.reject(e));
  }

  logout() {
    //this.app.logout();
    this.skip = 0;
    this.messages = [];
    this.user = null;
    this.isAuthenticated = false;
    this._removeAuthToken();
    return Promise.resolve();
  }

  promptForLogout(){
    Alert.alert('Sign Out', 'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel', onPress: () => {
        }, style: 'cancel'
        },
        {text: 'Yes', onPress: this.logout, style: 'destructive'},
      ]
    );
  }

  loadMe(){
    return axios
    .get(`${API_URL}/api/v2/users/me`, { headers: { Authorization: this.authToken, 'Content-Type': 'application/json' } })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        this.user = response.data;
        return response.data;
      } else {
        throw new Error("error");
      }
    }).catch(e => Promise.reject(e));
  }

  getAccount(){
    if(!this.accountId){
      this.loadAccounts().then((data) => {
        let accounts = data.accounts;
        if(accounts.length > 0){
          let account = accounts[0];
          this.setAccountId(account.id.toString());
        }
      });
    }
    return this.accountId;
  }

  loadProjects(first, skip, queryString = null){
    let filter = '';
    if(queryString){
      filter = `{
        projects(filter:{titleCont: "%${queryString}%"}, first: ${first}, skip: ${skip}) {
          id
          title
          address_string
          featured_image_url
          project_stage {
            id
            name
          }
          investment_type {
            id
            name
          }
          project_type {
            id
            name
          }
          property_type {
            id
            name
          }
        }
      }`
    }else{
      filter = `{
        projects(first: ${first}, skip: ${skip}) {
          id
          title
          address_string
          featured_image_url
          project_stage {
            id
            name
          }
          investment_type {
            id
            name
          }
          project_type {
            id
            name
          }
          property_type {
            id
            name
          }
        }
      }`
    }
    return axios
    .post(`${API_URL}/api/v2/graphql?account_id=${this.accountId}`, {query: filter}, { headers: { Authorization: this.authToken, 'Content-Type': 'application/json' } })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.data.data;
      } else {
        throw new Error("error");
      }
    }).catch(e => {
      console.log(e)
      Promise.reject(e)
    });
  }

  loadProject(id){
    return axios
    .get(`${API_URL}/api/v2/projects/${id}?account_id=${this.accountId}`, { headers: { Authorization: this.authToken, 'Content-Type': 'application/json' } })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error("error");
      }
    }).catch(e => Promise.reject(e));
  }

  loadComments(projectId){
    return axios
    .get(`${API_URL}/api/v2/comments?commentable_id=${projectId}&commentable_type=Project&account_id=${this.accountId}`, { headers: { Authorization: this.authToken, 'Content-Type': 'application/json' } })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error("error");
      }
    }).catch(e => Promise.reject(e));
  }

  loadAccounts(){
    return axios
    .get(`${API_URL}/api/v2/accounts`, { headers: { Authorization: this.authToken, 'Content-Type': 'application/json' } })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error("error");
      }
    }).catch(e => Promise.reject(e));
  }

  loadAccount(accountId){
    return axios
    .get(`${API_URL}/api/v2/accounts/${accountId}`, { headers: { Authorization: this.authToken, 'Content-Type': 'application/json' } })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        this.account = response.data.account;
        return this.account;
      } else {
        throw new Error("error");
      }
    }).catch(e => Promise.reject(e));
  }

  saveComment(comment){
    return axios
    .post(`${API_URL}/api/v2/comments?account_id=${this.accountId}`, {comment: comment}, {
      headers: { Authorization: this.authToken, 'Content-Type': 'application/json' },
    })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error("error");
      }
    }).catch(e => Promise.reject(e));
  }

  deleteImage(imageId){
    return axios
    .delete(`${API_URL}/api/v2/images/${imageId}?account_id=${this.accountId}`, { headers: { Authorization: this.authToken, 'Content-Type': 'application/json' } })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        this.investments = response.data;
        return response.data;
      } else {
        throw new Error("error");
      }
    }).catch(e => Promise.reject(e));
  }

  uploadPhotos(projectId, photos){
    if(photos && photos.length > 0){
      let photo = photos[0];
      return this.uploadPhoto(projectId, photo).then((data) => {
        this.uploadPhotos(projectId, photos.slice(1))
      });
    }
  }

  uploadPhoto(projectId, photo){
    let data = new FormData();

    return ImageResizer.createResizedImage(photo.path, 1000, 1000, 'JPEG', 100)
    .then(({uri, name}) => {
      data.append("image[attachment]", {
        uri: uri,
        type: 'image/jpeg',
        name: name || `temp_image.jpg`,
      })
      return axios
        .post(`${API_URL}/api/v2/images?account_id=${this.accountId}&project_id=${projectId}`, data, { headers: { Authorization: this.authToken } })
        .then(response => {
          if (response.status >= 200 && response.status < 300) {
            return response.data;
          } else {
            throw new Error("error");
          }
        }).catch(e => Promise.reject(e));
    })
    .catch(err => {
      console.log(err);
      return Alert.alert(
        'Unable to resize the photo',
        'Check the console for full the error message',
      );
    });

  }

}
