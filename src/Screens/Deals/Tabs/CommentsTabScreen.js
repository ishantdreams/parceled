import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Button,
  ScrollView,
  Platform
} from 'react-native';
import { scale } from '../../../Services/ResponsiveScreen';
import * as css from "../../../Assets/Styles";
import { FlatList } from 'react-native-gesture-handler';
import Moment from 'moment';
import TimeAgo from 'react-native-timeago';

const screenStyles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  container_row: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: css.colors.white,
    borderBottomColor: css.colors.blacklight,
    borderBottomWidth: 1,
    paddingLeft:0,
    paddingTop: 15,
    paddingBottom: 15,
  },
  container_row_text: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
    alignContent: 'center',
  },
  title_row: {
    fontSize: scale(17),
    color: css.colors.theme,
    fontWeight:'bold',
    fontFamily:css.Fonts.openSans
  },
  title_base: {
    fontSize: scale(15),
    marginStart: 15,
    color: css.colors.grey,
  },
  desc_row: {
    fontSize: scale(16),
    color: css.colors.theme,
  },
  photoView: {
    height: scale(60),
    width: scale(60),
    borderRadius: scale(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title_image: {
    fontSize: scale(25),
    color: css.colors.white,
  },
  bottom_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 40,
    flex: 0,
    paddingBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    height: 40,
    borderBottomColor: '#F2F2F2',
    borderBottomWidth: 1,
    paddingLeft: 15,
  },
  app_icon: {
    height: scale(40),
    width: scale(40),
  },
});

export default class CommentsTab extends Component {

  _commentBody = '';

  constructor(props) {
    super(props);
    this.state = {
      listData: [
        {key: 0, name: 'Roger Smith',datBy:'Jan 25, 2020', msg:'Who do you think will look into it'},
        {key: 1, name: 'Victor Lodge',datBy:'a month ago', msg:'what is the area of the business'},
        {key: 2, name: 'Victoria Maria',datBy:'a month ago' , msg:'Loking for full size kitchen and drawing room'},
      ],
      comments: []
    };
  }

  componentDidMount() {
    this._loadComments();
  }

  _loadComments(){
    this.props.termSheetStore.loadComments(this.props.project.id).then((data) => {
      this.setState({
        comments: data.comments
      })
    });
  }

  _changeCommentText(text){
    this._commentBody = text;
  }

  _saveComment(){
    let comment = {
      body: this._commentBody,
      commentable_id: this.props.project.id,
      commentable_type: "Project",
    }
    console.log(comment)
    this.props.termSheetStore.saveComment(comment).then((data) => {
      this._loadComments();
    });
  }

  render() {
    const renderItem = data => (
      <TouchableOpacity activeOpacity={1} style={screenStyles.container_row}>
        <View style={screenStyles.photoView}>
          <Image
            style={screenStyles.app_icon}
            source={{uri: data.item.user.avatar_url}}
          />
        </View>

        <View style={screenStyles.container_row_text}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={screenStyles.title_row}>{data.item.user_name}</Text>
            <Text style={screenStyles.title_base}><TimeAgo time={data.item.created_at} /></Text>
          </View>
          <Text style={screenStyles.desc_row}>{data.item.body}</Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <KeyboardAvoidingView
        behavior={Platform.Os == "ios" ? "padding" : "height"}
        style={css.baseStyles.container}
      >
        <TextInput
            style={screenStyles.input}
            onChangeText={text => this.setState({ message: text })}
            underlineColorAndroid='transparent'
            placeholder="Comment..."
            returnKeyType="send"
            onSubmitEditing={this._saveComment.bind(this)}
            onChangeText={this._changeCommentText.bind(this)}
          />
        <ScrollView>
          <View style={[screenStyles.flex, {backgroundColor: css.colors.white}]}>
            <FlatList
              showsVerticalScrollIndicator={false}
              bounces={false}
              data={this.state.comments}
              renderItem={renderItem}/>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
