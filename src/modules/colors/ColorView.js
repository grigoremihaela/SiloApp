import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ListView,
  Image,
  Button,
  ScrollView
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {};

const color = () => Math.floor(255 * Math.random());

/**
 * Sample view to demonstrate StackNavigator
 * @TODO remove this module in a live application.
 */
class ColorView extends Component {
  static displayName = 'ColorView';

  static navigationOptions = {
    title: 'Temp',
    tabBarIcon: (props) => (
        <Icon name='color-lens' size={24} color={props.tintColor} />
      ),
    // TODO: move this into global config?
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#39babd'
    }
  }

  static propTypes = {
    navigate: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      temperatures: {},
      background: `rgba(${color()},${color()},${color()}, 1)`
    };
  }

  open = () => {
    this.props.navigate({routeName: 'InfiniteColorStack'});
  };

  componentDidMount() {
    return fetch('https://pi-temp-api.herokuapp.com/get/temperature')
      .then((response) => response.json())
      .then((responseJson) => {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson),
        }, function() {
          // do something with new state
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const buttonText = 'Open in Stack Navigator';
    const { params } = this.props.navigation.state;

    if (this.state.isLoading) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <ScrollView>
      {/* 
        <View style={[styles.container, {backgroundColor: this.state.background}]}>
      */}
      <View style={styles.container}>
        <Text style={styles.welcome}> Temperatures </Text>
        <Image
          style={styles.image}
          source={require('../../../images/silo1.png')}
          resizeMode="stretch"
        />

        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => 
            <Text style={styles.welcome}>
              {Math.round(rowData.temp)}°C, 
              pin {rowData.pin}/{rowData.numberSensor},
              date {new Date(rowData.created_at).toLocaleDateString()}
            </Text>
          }
        />
       {/*
        <Button 
          color='#ee7f06' 
          title={buttonText} 
          onPress={this.open}/>
        */}
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //flexDirection: 'column',
    //alignItems: 'center'
  },
  welcome: {
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
    margin: 5,
    padding: 5
  }
});

export default ColorView;