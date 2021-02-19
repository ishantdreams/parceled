//import * as React from 'react';
import React, {Component} from 'react';
import {Text, View, Dimensions} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import PropertyTab from './PropertyTabScreen';
import SalesTab from './SalesTabScreen';
import OwnerTab from './OwnerTabScreen';
import PendingTab from './PendingTabScreen';
import ParceledProTab from './ParceledProTabScreen';
import * as css from '../../../Assets/Styles';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import {observer, inject} from 'mobx-react';

const initialLayout = {width: Dimensions.get('window').width};

@inject('termSheetStore', 'parcelStore', 'userStore', 'iapStore')
@observer
export default class TabScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      trialExpired: false,
      routes: [
        {key: 'Property', title: 'Property'},
        {key: 'Sales', title: 'History'},
        {key: 'Owner', title: 'Owner'},
      ],
    };
  }

  render() {
    const renderScene = ({route}) => {
      if (route.key == 'Property') {
        return <PropertyTab {...this.props} />;
      } else if (route.key == 'Sales') {
        return <SalesTab {...this.props} />;
      } else if (route.key == 'Owner') {
        return <OwnerTab {...this.props} />;
      } else {
        return <PropertyTab {...this.props} />;
      }
    };

    /*
    const renderScene = ({route}) => {
      if(route.key == 'Property'){
        return <PropertyTab {...this.props} />;
      }else if(route.key == 'Sales' && (!this.props.isLoggedIn && this.props.userStore.hasTrialExpired() && !this.props.userStore.isProSubsciptionEnabled)){
        return <ParceledProTab {...this.props} />;
      }else if(route.key == 'Owner' && (!this.props.isLoggedIn && this.props.userStore.hasTrialExpired() && !this.props.userStore.isProSubsciptionEnabled)){
        return <PendingTab {...this.props} />;
      }else if(route.key == 'Sales' && (this.props.isLoggedIn || !this.props.userStore.hasTrialExpired() || this.props.userStore.isProSubsciptionEnabled)){
        return <SalesTab {...this.props} />;
      }else if(route.key == 'Owner' && (this.props.isLoggedIn || !this.props.userStore.hasTrialExpired() || this.props.userStore.isProSubsciptionEnabled)){
        return <OwnerTab {...this.props} />;
      }else{
        return <PropertyTab {...this.props} />;
      }
    }
    */

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
