import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Linking,
} from 'react-native';
import { scale } from '../../../Services/ResponsiveScreen';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import * as css from "../../../Assets/Styles";
import {SwipeListView} from 'react-native-swipe-list-view';
import Moment from 'moment';

const screenStyles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  files_head: {
    fontSize: scale(22),
    fontWeight: 'bold',
    color: css.colors.theme,
    fontFamily: css.Fonts.openSans,
  },
  upload_icon: {
    height: scale(30),
    width: scale(30),
  },
  list_style: {
    borderTopColor: css.colors.blacklight,
    borderTopWidth: 1,
  },
  doc_icon: {
    marginTop: 5,
    height: scale(25),
    width: scale(30),
  },
  delete_icon: {
    alignSelf: 'center',
    height: scale(30),
    width: scale(30),
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    backgroundColor: css.colors.white,
    borderBottomColor: css.colors.blacklight,
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  rowBack: {
    backgroundColor: '#DDD',
    flex: 1,
  },
  backRightBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: 80,
    bottom: 0,
    top: 0,
    right: 0,
    backgroundColor: 'red',
  },
  name_txt: {
    fontSize: scale(14),
    color: '#333333',
  },
  date_txt: {
    fontSize: scale(13),
    color: '#828282',
    marginTop: 5,
  },
  size_txt: {
    fontSize: scale(13),
    color: '#828282',
    marginTop: 1,
  },
});

export default class FilesTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [
        {
          key: 0,
          name: 'Size Form Teaser.pdf',
          datBy: 'Jan 25, 2020 by Roger Smith',
          size: '196.52 KB',
        },
        {
          key: 1,
          name: 'Size Form Teaser.pdf',
          datBy: 'Jan 25, 2020 by Roger Smith',
          size: '196.52 KB',
        },
        {
          key: 2,
          name: 'Size Form Teaser.pdf',
          datBy: 'Jan 25, 2020 by Roger Smith',
          size: '196.52 KB',
        },
      ],
    };
  }

  _displayFileSize(size) {
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  }

  _openFileUrl(url, fileName){
    this.props.onOpenFileUrl(url, fileName)
  }

  render() {
    const {project} = this.props;

    const renderItem = data => (
      <TouchableOpacity
        activeOpacity={1}
        style={screenStyles.rowFront}
        underlayColor={'#AAA'}
        onPress={ ()=>{this._openFileUrl(data.item.document_url, data.item.name)}}
      >
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            marginVertical: 15,
          }}>
          <Image
            style={screenStyles.doc_icon}
            source={require('../../../Assets/Images/ic_doc.png')}
            resizeMode="contain"
          />
          <View style={{marginHorizontal: 20}}>
            <Text style={screenStyles.name_txt}>{data.item.name}</Text>
            <Text style={screenStyles.date_txt}>{Moment(data.item.created_at).format('MMMM Do YYYY')}</Text>
            <Text style={screenStyles.size_txt}>{this._displayFileSize(data.item.file_size)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );

    const renderHiddenItem = data => (
      <View style={screenStyles.rowBack}>
        <TouchableOpacity style={[screenStyles.backRightBtn]}>
          <View>
            <Image
              style={screenStyles.delete_icon}
              source={require('../../../Assets/Images/ic_delete.png')}
              resizeMode="contain"
            />
            <Text style={screenStyles.backTextWhite}>Delete</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
    return (
      <View style={[screenStyles.scene, {backgroundColor: css.colors.white}]}>
        <View style={{flexDirection: 'row', margin: 20, alignItems: 'center'}}>
          <Text style={[screenStyles.files_head, {flex: 1}]}>All Files</Text>
          <TouchableOpacity>
            <Image
              style={screenStyles.upload_icon}
              source={require('../../../Assets/Images/ic_uplaod.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <SwipeListView
          style={screenStyles.list_style}
          showsVerticalScrollIndicator={false}
          bounces={false}
          stopLeftSwipe={1}
          rightOpenValue={-80}
          data={project.root_folder_resource ? project.root_folder_resource.file_resources : []}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          previewFirstRow={false}
        />
      </View>
    );
  }
}
