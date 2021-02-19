//import * as React from 'react';
import React, {Component} from 'react';
import {
  Text,
  View,
  Dimensions,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import OverViewTab from './OverviewTabScreen';
import FilesTab from './FilesTabScreen';
import CommentsTab from './CommentsTabScreen';
import * as css from "../../../Assets/Styles";
import {observable} from 'mobx';
import autobind from 'autobind-decorator'
import {observer, inject} from 'mobx-react';

const initialLayout = {width: Dimensions.get('window').width};

@inject('termSheetStore')
@observer
export default class TabViewExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {key: 'Overview', title: 'Overview'},
        {key: 'Files', title: 'Files'},
        {key: 'Comments', title: 'Comments'},
      ],
    };
  }

  render() {
    const renderScene = ({route}) => {
      switch (route.key){
        case 'Overview':
          return <OverViewTab {...this.props} onPressAddPhoto={() => this.props.onPressAddPhoto()}/>;
        case 'Files':
          return <FilesTab {...this.props} onOpenFileUrl={(url, fileName) => this.props.onOpenFileUrl(url, fileName)} />;
        default:
          return <CommentsTab {...this.props} />;
      }
    }

    const renderTabBar = props => (
      <TabBar
        {...props}
        indicatorStyle={{backgroundColor: css.colors.orange}}
        activeColor={css.colors.orange}
        inactiveColor={css.colors.theme}
        style={{backgroundColor: css.colors.lightbackground}}
        //renderLabel={renderLabel(props)}
      />
    );

    const renderLabel = props => {
      let index = 0;
      return ({route}) => {
        const focused = index === props.navigationState.index;
        index += 1;
        return (
          <View>
            <Text
              style={[
                focused
                  ? {fontSize: 16, color: css.colors.o, fontWeight: 'bold'}
                  : {fontSize: 16, fontWeight: 'normal'},
              ]}>
              {route.title}
            </Text>
          </View>
        );
      };
    };

    var index = this.state.index;
    var routes = this.state.routes;
    return (
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={val => {
          this.setState({index: val});
        }}
        initialLayout={initialLayout}
        activeColor={css.colors.orange}
        renderTabBar={renderTabBar}
        swipeEnabled={false}
      />
    );
  }
}
