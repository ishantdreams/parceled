import {Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {observable, action, computed} from 'mobx';
import autobind from 'autobind-decorator'
import axios from "axios";
import LayerModel from '../Models/Layer';

const API_URL = 'https://parceled.termsheet.com';
//const API_URL = "http://pv.ts.com:4003";
const SERVER_AUTH_TOKEN = '50ED635ABAB395CAFA86';

@autobind
export default class ParcelStore {
  @observable layers = [];
  @observable selectedLayers = [];
  @observable parcelFilters = [];

  @observable parcelData = null;
  @observable oppZoneGeoJson = {}
  @observable recentlyViewedParcels = []
  @observable savedParcels = []

  @observable cherreToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJHcmFwaFFMIFRva2VuIiwibmFtZSI6IiIsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJ0ZXJtc2hlZXQiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidGVybXNoZWV0IiwieC1oYXN1cmEtdXNlci1pZCI6InRlcm1zaGVldCIsIngtaGFzdXJhLW9yZy1pZCI6InRlcm1zaGVldCJ9fQ.EYaIaisJ2UkuHVGCLNN8XkF4lgkqQUH1FGdnYBF51RE"

  constructor(){
    //this._loadAuthToken();
    this._setupLayers();
    this._loadHistory();
    //this._initFilters()
  }

  _setupLayers(){
    this.layers.push(new LayerModel({
      id: '1',
      name: 'Opportunity Zones',
      description: 'View Opportunity Zones',
      url: 'https://s3.amazonaws.com/termsheet-data-lake/pvw/oppzone_scores_geo.json',
      type: 'fill'
    }));
    this.layers.push(new LayerModel({
      id: '2',
      name: 'Demographics',
      description: 'View trending neighborhoods and growing areas',
      url: 'https://www.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
      type: 'heatmap'
    }));
    this.layers.push(new LayerModel({
      id: '3',
      name: 'Pre-foreclosed properties',
      description: 'Find properties that are currently in the pre-foreclosure state.',
      url: 'https://s3.amazonaws.com/termsheet-data-lake/pvw/oppzone_scores_geo.json',
      type: 'circle'
    }));
    this.layers.push(new LayerModel({
      id: '4',
      name: 'Listings',
      description: 'View properties that are on the market',
      url: 'https://app.termsheet.com/api/v2/mobile/deals',
      type: 'symbol'
    }));
  }

  _loadHistory = async () => {
    try {
      const recentlyViewedParcels = await AsyncStorage.getItem('recentlyViewedParcels1');
      if(recentlyViewedParcels){
        this.recentlyViewedParcels = JSON.parse(recentlyViewedParcels);
      }

      const savedParcels = await AsyncStorage.getItem('savedParcels3');
      if(savedParcels){
        this.savedParcels = JSON.parse(savedParcels);
      }
    } catch (e) {
      /* do nothing */
    }
  }

  addToRecentlyViewed(parcel){
    if(parcel){
      let foundItems = this.recentlyViewedParcels.filter(viewed => (viewed.taxId === parcel.taxId))
      if(foundItems.length == 0){
        this.recentlyViewedParcels.unshift(parcel)
        this._addToRecentlyViewed()
      }
    }
  }

  _addToRecentlyViewed = async () => {
    await AsyncStorage.setItem('recentlyViewedParcels1', JSON.stringify(this.recentlyViewedParcels));
  }

  addToSavedParcels(parcel){
    if(parcel){
      let foundItems = this.savedParcels.filter(viewed => (viewed.id === parcel.id))
      if(foundItems.length == 0){
        this.savedParcels.unshift(parcel)
        this._addToSavedParcels()
      }else if(foundItems.length > 0){

        let index = this.savedParcels.indexOf(parcel)
        let obj = this.savedParcels.find((o, i) => {
            if (o.id === parcel.id) {
                this.savedParcels[i] = parcel;
                return true; // stop searching
            }
        });
        this._addToSavedParcels();
      }
    }
  }

  removeFromSavedParcels(parcel){
    if(parcel){
      let filteredItems = this.savedParcels.filter(viewed => (viewed.id != parcel.id))
      this.savedParcels = filteredItems;
      this._addToSavedParcels()
    }
  }

  isInWatchlist(parcel){
    if(parcel){
      let filteredItems = this.savedParcels.filter(viewed => (viewed.id == parcel.id))

      if(filteredItems.length > 0){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  _addToSavedParcels = async () => {
    await AsyncStorage.setItem('savedParcels3',  JSON.stringify(this.savedParcels));
  }

  toggleSelectedLayer(layer){
    let foundLayers = this.selectedLayers.filter(selected => (selected.id === layer.id))
    if(foundLayers.length == 0){
      this.selectedLayers.unshift(layer)
    }else{
      for (var i in this.selectedLayers) {
        if (this.selectedLayers[i].id === layer.id) {
          this.selectedLayers.splice(i, 1);
        }
      }
    }
  }

  isLayerSelected(layer){
    let foundLayers = this.selectedLayers.filter(selected => (selected.id === layer.id))
    return (foundLayers.length > 0)
  }

  loadLovelandTiles(apiToken){
    return axios
    .get(`https://tiles.makeloveland.com/api/v1/parcels?format=mvt&token=${apiToken}`)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error("error");
      }
    }).catch(e => Promise.reject(e));
  }

  loadLovelandParcel(apiToken, path){
    return axios
    .get(`https://landgrid.com/api/v1/parcel.json?token=${apiToken}&path=${path}`)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error("error");
      }
    }).catch(e => Promise.reject(e));
  }

  getReportUrl(apn, userToken=''){
    return `${API_URL}/api/v2/mobile/parcels/report?apn=${apn}&user_token=${userToken}&auth_token=${SERVER_AUTH_TOKEN}`
  }

  saveFavoriteToServer(apn, favorite, user_token = ''){
    return axios
    .post(`${API_URL}/api/v2/mobile/parcels`, {user_token: user_token, apn: apn, on_watchlist: favorite}, { headers: { Authorization: SERVER_AUTH_TOKEN, 'Content-Type': 'application/json' } })
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

  loadCherreParcel(latitude, longitude, userToken = '', apn = ''){
    return axios
    .get(`${API_URL}/api/v2/mobile/parcels?latitude=${latitude}&longitude=${longitude}&user_token=${userToken}&apn=${apn}`, { headers: { Authorization: SERVER_AUTH_TOKEN, 'Content-Type': 'application/json' } })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.data.data; // response.data = {auth_token: [...], user: { avatar_url: [...], email: [...], full_name: [...]}}
      } else {
        // TODO: handle 401
        throw new Error("authentication error , login failed");
      }
    }).catch(e => {
      console.log(e)
      //Promise.reject(e)
    });
  }

  loadCherreParcel2(latitude, longitude){
    let filter = `{
      tax_assessor_point(
        args: { latitude: ${latitude}, longitude: ${longitude}}
      ) {
        one_line_address
        assessor_parcel_number_raw
        map_page
        situs_county
        latitude
        longitude
        tax_rate
        fips_code
        census_fips_code
        assessed_value_total
        the_value_land
        market_value_total
        year_built
        gross_sq_ft
        units_count
        tax_bill_amount
        last_sale_date
        last_sale_amount
        zone_code
        prior_sale_amount
        prior_sale_date
        deed_last_sale_date
        deed_last_sale_price
        building_sq_ft
        gross_sq_ft
        lot_size_acre
        assessed_value_land
        the_value_land
        mailing_address
        property_group_type
        map_page
        house_number
        city
        state
        zip
        is_owner_occupied
        street_direction
        street_name
        street_suffix
        tax_assessor_owner {
          owner_name
          owner_type
        }
        recorder {
          recorded_date
          document_amount
          title_company_name

          recorder_grantor {
            grantor_name
          }
          recorder_grantee {
            grantee_name
          }

          recorder_mortgage {
            amount
            term
            term_type_code
            term_due_date
            has_interest_only_period
            has_pre_payment_penalty
            lender_name
            interest_rate
          }
        }
      }
    }`
    return axios
    .post(`https://graphql.cherre.com/graphql`, {query: filter}, { headers: { Authorization: `Bearer ${this.cherreToken}` } })
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

  lookupParcel(payload){
    return axios
    .get(`${API_URL}/api/v2/mobile/properties/lookup`, { headers: { Authorization: this.authToken }, params: payload })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error("error");
      }
    }).catch(e => Promise.reject(e));
  }
}
