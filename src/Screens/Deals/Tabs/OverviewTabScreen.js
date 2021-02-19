import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image, Alert} from 'react-native';
import { scale } from '../../../Services/ResponsiveScreen';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import * as css from "../../../Assets/Styles";
import NumberFormat from 'react-number-format';
import Moment from 'moment';
import {observable} from 'mobx';
import autobind from 'autobind-decorator'
import {observer, inject} from 'mobx-react';

const screenStyles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  title_txt: {
    fontSize: scale(25),
    marginTop: 15,
    marginHorizontal: 15,
    fontWeight: 'bold',
    color: css.colors.theme,
    fontFamily: css.Fonts.openSans,
  },
  head_txt: {
    marginTop: 10,
    marginHorizontal: 15,
    fontSize: scale(14),
    fontWeight: 'bold',
    fontFamily: css.Fonts.openSans,
    color: css.colors.theme,
  },
  sub_txt: {
    marginHorizontal: 15,
    marginBottom: 10,
    fontSize: scale(16),
    fontFamily: css.Fonts.openSans,
    color: css.colors.theme,
  },
  event_icon: {
    marginHorizontal: 10,
    height: scale(30),
    width: scale(40),
    tintColor: css.colors.theme,
  },
  phone_icon: {
    height: scale(30),
    width: scale(40),
    tintColor: css.colors.theme,
  },
  loc_icon: {
    height: scale(20),
    width: scale(20),
    tintColor: css.colors.blue,
  },
  loc_txt: {
    fontSize: scale(20),
    fontFamily: css.Fonts.openSans,
    color: css.colors.blue,
  },
  head_review_txt: {
    fontSize: scale(14),
    fontFamily: css.Fonts.openSans,
    color: css.colors.theme,
  },
  mark_review_txt: {
    fontSize: scale(16),
    fontFamily: css.Fonts.openSans,
    color: css.colors.grey,
  },
  phone_txt: {
    fontSize: scale(18),
    fontFamily: css.Fonts.openSans,
    color: css.colors.blue,
  },
  page_view_txt: {
    marginTop: 20,
    fontSize: scale(18),
    fontFamily: css.Fonts.openSans,
    color: css.colors.theme,
  },
  add_photo_txt: {
    marginTop: 20,
    fontSize: scale(18),
    fontWeight: 'bold',
    fontFamily: css.Fonts.openSans,
    color: css.colors.blue,
  },
  container_row: {
    flex: 1,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 3,
    shadowRadius: 3,
    shadowColor: css.colors.gray,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
  },
  row_image_container: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  row_image: {
    height: 180,
    width: 300,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  add_image_container: {
    borderRadius: 10,
  },
  add_row_image: {
    height: 100,
    width: 100,
    borderRadius: 10,
  },
  close_icon: {
    height: scale(30),
    width: scale(40),
    tintColor: css.colors.theme,
  },
});

@inject('termSheetStore')
@observer
export default class OverViewTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
        name:'25 N Womack St',
        images: [],
    };
  }

  componentDidMount(){
    this.setState({
      images: this.props.images
    })
  }

  _deleteImage(image, index){
    Alert.alert('Delete Image', 'Are you sure you want to delete this image?',
      [
        {
          text: 'No', onPress: () => {
          }, style: 'cancel'
        },
        {text: 'Yes', onPress: () => {
          this.props.termSheetStore.deleteImage(image.id).then((data) => {
            let images = this.state.images;
            images.splice(index, 1);
            this.setState({
              images: images,
            })
          })
        }, style: 'destructive'},
      ]
    );
  }

  _renderAddresses(deal){
    if(deal){
      let properties = deal.properties;
      return properties.map((property, idx) => {
        return (
          <Text style={screenStyles.sub_txt}>
            {property.address.address_string}
          </Text>
        );
      })
    }else{
      return (<Text></Text>)
    }
  }

  _renderAppointments(appointments){
    return appointments.map((appointment, idx) => {
      return (
        <View style={{flexDirection: 'row', marginVertical: 20}}>
          <Image
            style={screenStyles.event_icon}
            source={require('../../../Assets/Images/ic_event.png')}
            resizeMode="contain"
            tintColor={css.colors.orange}
          />
          <View>
            <Text style={screenStyles.head_review_txt}>{appointment.title}</Text>
            <Text style={screenStyles.mark_review_txt}>{Moment(appointment.start_date).format('MMMM Do YYYY, h:mm:ss a')}</Text>
          </View>
        </View>
      )
    })
  }

  _renderTransactionParties(contactAssociations){
    return contactAssociations.map((ca, ids) => {
      return (
        <View style={{marginVertical: 20, marginHorizontal: 15}}>
          <Text style={screenStyles.head_review_txt}>{ca.contact.name}</Text>
          <Text style={screenStyles.mark_review_txt}>{ca.category_name}</Text>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Image
              style={screenStyles.phone_icon}
              source={require('../../../Assets/Images/ic_phone.png')}
              resizeMode="contain"
              tintColor={css.colors.blue}
            />
            <Text style={screenStyles.phone_txt}>{ca.phone}</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Image
              style={screenStyles.phone_icon}
              source={require('../../../Assets/Images/ic_phone.png')}
              resizeMode="contain"
              tintColor={css.colors.blue}
            />
          <Text style={screenStyles.phone_txt}>{ca.email}</Text>
          </View>
        </View>
      )
    })
  }

  render() {
    const {project} = this.props;

    const CustomLocationRow = ({id, image, location, desscription}) => (
      <TouchableOpacity activeOpacity={0.7} style={screenStyles.container_row}>
        <View style={screenStyles.row_image_container}>
          <Image
            style={screenStyles.row_image}
            source={require('../../../Assets/Images/location_pic.png')}
            resizeMode="cover"
          />
        </View>

        <Text style={screenStyles.head_txt}>Location</Text>
        <View
          style={{flexDirection: 'row', marginStart: 10, alignItems: 'center'}}>
          <Image
            style={screenStyles.loc_icon}
            source={require('../../../Assets/Images/ic_location.png')}
            resizeMode="contain"
            tintColor={css.colors.blue}
          />
          <Text style={screenStyles.loc_txt}>Franklin, NC 287456</Text>
        </View>

        <Text style={screenStyles.head_txt}>Summary</Text>
        <Text style={screenStyles.sub_txt}>No desscription</Text>
      </TouchableOpacity>
    );

    return (
      <View style={[screenStyles.scene, {backgroundColor: css.colors.white}]}>
        <Text style={screenStyles.title_txt}>Deal Information</Text>

        <Text style={screenStyles.head_txt}>Name of Deal</Text>
        <Text style={screenStyles.sub_txt}>{project.title}</Text>

        <Text style={screenStyles.head_txt}>Status</Text>
        <Text style={screenStyles.sub_txt}>{project.project_stage ? project.project_stage.name : '---'}</Text>

        <Text style={screenStyles.head_txt}>Market Status</Text>
        <Text style={screenStyles.sub_txt}>{project.market_status ? project.market_status.name : '---'}</Text>

        <Text style={screenStyles.head_txt}>Deal Type</Text>
        <Text style={screenStyles.sub_txt}>{project.project_type ? project.project_type.name : '---'}</Text>

        <Text style={screenStyles.head_txt}>Investment Type</Text>
        <Text style={screenStyles.sub_txt}>{project.investment_type ? project.investment_type.name : '---'}</Text>

        <Text style={screenStyles.head_txt}>Assigned To</Text>
        <Text style={screenStyles.sub_txt}>{project.assigned_user ? project.assigned_user.full_name : '---'}</Text>

        <Text style={screenStyles.head_txt}>Team</Text>
        <Text style={screenStyles.sub_txt}>{project.team ? project.team.name : '---'}</Text>

        <Text style={screenStyles.head_txt}>Created By</Text>
        <Text style={screenStyles.sub_txt}>{project.created_by ? project.created_by.full_name : '---'}</Text>

        <Text style={screenStyles.head_txt}>Created At</Text>
        <Text style={screenStyles.sub_txt}>{Moment(project.created_at).format('MMMM Do YYYY, h:mm:ss a')}</Text>

        <Text style={screenStyles.head_txt}>Updated At</Text>
        <Text style={screenStyles.sub_txt}>{Moment(project.updated_at).format('MMMM Do YYYY, h:mm:ss a')}</Text>

        <Text style={screenStyles.title_txt}>Key Dates</Text>
        {this._renderAppointments(project.appointments)}

        <Text style={screenStyles.title_txt}>Transaction Parties</Text>
        {this._renderTransactionParties(project.contact_associations)}


        <Text style={screenStyles.title_txt}>Financial Summary</Text>

        <Text style={screenStyles.head_txt}>Guidance Price</Text>
        <Text style={screenStyles.sub_txt}><NumberFormat value={project.broker_guidance_price} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <Text>{value}</Text>} /></Text>

        <Text style={screenStyles.head_txt}>Guidance NOI</Text>
        <Text style={screenStyles.sub_txt}><NumberFormat value={project.going_in_noi} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <Text>{value}</Text>} /></Text>

        <Text style={screenStyles.head_txt}>Guidance Cap Rate%</Text>
        <Text style={screenStyles.sub_txt}><NumberFormat value={project.going_in_cap_rate} displayType={'text'} thousandSeparator={true} suffix={'%'} renderText={value => <Text>{value}</Text>} /></Text>

        <Text style={screenStyles.head_txt}>Guidance/Unit</Text>
        <Text style={screenStyles.sub_txt}><NumberFormat value={project.guidance_price_per_unit} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <Text>{value}</Text>} /></Text>

        <Text style={screenStyles.head_txt}>Guidance PSF</Text>
        <Text style={screenStyles.sub_txt}><NumberFormat value={project.guidance_price_per_sq_ft} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <Text>{value}</Text>} /></Text>

        <Text style={screenStyles.head_txt}>Bid Price</Text>
        <Text style={screenStyles.sub_txt}><NumberFormat value={project.bid_price} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <Text>{value}</Text>} /></Text>

        <Text style={screenStyles.head_txt}>Bid NOI</Text>
        <Text style={screenStyles.sub_txt}><NumberFormat value={project.noi} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <Text>{value}</Text>} /></Text>

        <Text style={screenStyles.head_txt}>Bid Cap Rate%</Text>
        <Text style={screenStyles.sub_txt}><NumberFormat value={project.bid_cap_rate} displayType={'text'} thousandSeparator={true} suffix={'%'} renderText={value => <Text>{value}</Text>} /></Text>

        <Text style={screenStyles.head_txt}>Bid/Unit</Text>
        <Text style={screenStyles.sub_txt}><NumberFormat value={project.price_per_unit} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <Text>{value}</Text>} /></Text>

        <Text style={screenStyles.head_txt}>Bid PSF</Text>
        <Text style={screenStyles.sub_txt}><NumberFormat value={project.price_per_sq_ft} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <Text>{value}</Text>} /></Text>

        <View style={{flexDirection: 'row', marginEnd: 20}}>
          <Text style={[screenStyles.title_txt, {flex: 1}]}>Asset Details</Text>
        </View>

        <Text style={screenStyles.head_txt}>Address</Text>
        {this._renderAddresses(project.deal)}

        <Text style={screenStyles.head_txt}>Property Type</Text>
        <Text style={screenStyles.sub_txt}>{project.property_type ? project.property_type.name : '---'}</Text>

        {/*
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          data={[1, 2, 5]}
          renderItem={({item}) => <CustomLocationRow id={item.id} />}
        />*/}

        <View style={{flexDirection: 'row', marginEnd: 20}}>
          <Text style={[screenStyles.title_txt, {flex: 1}]}>Photos</Text>
          <Text style={screenStyles.add_photo_txt} onPress={ ()=> this.props.onPressAddPhoto() }>Add Photos</Text>
        </View>

        <FlatList
          horizontal
          marginVertical={20}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          keyExtractor={(item,index) => index.toString()}
          data={this.state.images}
          renderItem={({item, index}) => (
            <TouchableOpacity activeOpacity={0.7} style={screenStyles.container_row}>
              <View style={screenStyles.add_image_container}>
                <Image
                  style={screenStyles.add_row_image}
                  source={{uri: item.path || item.list_image_url}}
                  resizeMode="cover"
                />
              </View>
              <TouchableOpacity
                style={{position: 'absolute', marginTop: -10, marginStart: 75}}
                onPress={()=>this._deleteImage(item, index)}
              >
                <Image
                  style={screenStyles.close_icon}
                  source={require('../../../Assets/Images/ic_cancel.png')}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}
