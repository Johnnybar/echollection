import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Alert
} from 'react-native';
import { connect } from 'react-redux'
import { gameChangeLevel } from '../actions/actions';

import {Button, ButtonGroup} from 'react-native-elements';
import {ExpoLinksView} from '@expo/samples';
import {WebBrowser} from 'expo';
import {MonoText} from '../components/StyledText';

const sounds = {
  bell: require('../assets/sounds/bell.mp3'),
  snare: require('../assets/sounds/snare.wav'),
  stab: require('../assets/sounds/stab.wav'),
  kick: require('../assets/sounds/kick.mp3'),
  hat: require('../assets/sounds/hat.mp3')
};
//only imported to make sure all sounds are available during runtime
const soundsArr = [require('../assets/sounds/bell.mp3'), require('../assets/sounds/snare.wav'), require('../assets/sounds/stab.wav'), require('../assets/sounds/kick.mp3'), require('../assets/sounds/hat.mp3')];

let playTimes = 0;
let playArr = [];
let answersArr = [];



class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Game'
  };

  constructor(props) {
    super(props);
    this.state = {
      bell: 1,
      snare: 1,
      kick: 1,
      hat: 1,
      stab: 1,

    }
  }

  _prepareSound = async () => {
    await Expo.Audio.setIsEnabledAsync(true);
    await Expo.Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      playThroughEarpieceAndroid: true,
      allowsRecordingIOS: false,
      interruptionModeIOS: Expo.Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      shouldDuckAndroid: false,
      interruptionModeAndroid: Expo.Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
    });
  }

//plays individual sounds
  _play = async (prop, selected) => {
    if (prop) {
      try {
        console.log('here');
        //lower opacity of current instrument and return it to regular after 100 milliseconds
        let key = this.state.current;
        playArr.push(key)
        this.setState(prevState => ({[key]: 0.3}))
        setTimeout(() => {
          this.setState({[key]: 1})
          playTimes++
        }, 50)
        const soundObject = new Expo.Audio.Sound()
        await soundObject.loadAsync(sounds[prop]);
        await soundObject.playAsync();
        //play a random sound every 800 milliseconds
        setTimeout(() => {
          this._randomPlay()
        }, this.props.speed)
      } catch (error) {
        console.log('>>>>>>>> ALARM PLAY', error);
      }
    }
  }

  //generate random instrument selection
  _getRandomIntInclusive = (obj) => {
    var result;
    var count = 0;
    for (var prop in obj)
      if (Math.random() < 1 / ++count)
        result = prop;
  return result;
  };

//runs on clicking play button
  _randomPlay = async (prop) => {
    try {
      let chosen = this._getRandomIntInclusive(sounds)
      //choose current instrument
      this.setState({
        current: chosen
      }, () => {
        if (playTimes < this.props.level) {
          //run play
          this._play(chosen, this.props.speed)
        }
      });
    } catch (error) {
      console.log('>>>>>>>> ALARM PLAY', error);
    }
  }

  _playerInput = async (prop) => {
    const soundObject = new Expo.Audio.Sound()
    await soundObject.loadAsync(sounds[prop]);
    await soundObject.playAsync();
    if (answersArr.length === playArr.length - 1) {
      if (answersArr.every((value, index) => value === playArr[index])) {
        Alert.alert('YES! Good job')
        answersArr = []
        playArr = []
      } else {
        Alert.alert('NO! Press play to try again')
        answersArr = []
        playArr = []
      }
    } else {
      answersArr.push(prop)
    }
  }

  componentDidMount() {
    console.log(this.state);
    this._prepareSound()
    this.props.setLevel(4, 600 )
  }

  render() {

    return (<View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.welcomeContainer}></View>
        <View style={styles.container}>
          <Text>Level here - {this.props.level}, Speed here - {this.props.speed}</Text>

          <Button title="Play" style={styles.playButton} onPress={() => {
              this._randomPlay();
              playTimes = 0;
              playArr = [];
            }} iconContainerStyle={{
              marginRight: 10
            }} titleStyle={{
              fontWeight: '700'
            }} buttonStyle={{
              backgroundColor: 'rgba(90, 154, 230, 1)',
              borderColor: 'transparent',
              borderWidth: 0,
              borderRadius: 30
            }} containerStyle={{
              width: 130
            }}/>
          <View style={styles.buttonsContainer}>
            <Button title="COWBELL" style={[
                styles.roundButton, {
                  opacity: this.state.bell
                }
              ]} onPress={() => {
                this._playerInput('bell')
              }} iconContainerStyle={{
                marginRight: 10
              }} titleStyle={{
                fontWeight: '700'
              }} buttonStyle={{
                backgroundColor: 'rgba(90, 154, 230, 1)',
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 30
              }} containerStyle={{
                width: 130
              }}/>
            <Button title="SNARE" style={[
                styles.roundButton, {
                  opacity: this.state.snare
                }
              ]} onPress={() => {
                this._playerInput('snare')
              }} iconContainerStyle={{
                marginLeft: 10
              }} titleStyle={{
                fontWeight: '700'
              }} buttonStyle={{
                backgroundColor: 'rgba(199, 43, 98, 1)',
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 30
              }} containerStyle={{
                width: 150
              }}/>
            <Button title="KICK" style={[
                styles.roundButton, {
                  opacity: this.state.kick
                }
              ]} onPress={() => {
                this._playerInput('kick')
              }} iconContainerStyle={{
                marginLeft: 10
              }} titleStyle={{
                fontWeight: '700'
              }} buttonStyle={{
                backgroundColor: 'rgba(50, 173, 62, 1)',
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 30
              }} containerStyle={{
                width: 150
              }}/>
            <Button title="HAT" style={[
                styles.roundButton, {
                  opacity: this.state.hat
                }
              ]} onPress={() => {
                this._playerInput('hat')
              }} iconContainerStyle={{
                marginLeft: 10
              }} titleStyle={{
                fontWeight: '700'
              }} buttonStyle={{
                backgroundColor: 'rgba(255, 140, 0, 1)',
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 30
              }} containerStyle={{
                width: 150
              }}/>
            <Button title="STAB" style={[
                styles.roundButton, {
                  opacity: this.state.stab
                }
              ]} onPress={() => {
                this._playerInput('stab')
              }} iconContainerStyle={{
                marginLeft: 10
              }} titleStyle={{
                fontWeight: '700'
              }} buttonStyle={{
                backgroundColor: 'rgba(234, 144, 244, 1)',
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 30
              }} containerStyle={{
                width: 150
              }}/>
          </View>
          <Button title="Medium Level" style={styles.playButton} onPress={() => {
            this.props.setLevel(6, 400);
            playTimes = 0;
            playArr = [];
          }} iconContainerStyle={{
            marginRight: 10
          }} titleStyle={{
            fontWeight: '700'
          }} buttonStyle={{
            backgroundColor: 'rgba(90, 154, 230, 1)',
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 30
          }} containerStyle={{
            width: 130
          }}/>
          <Button title="Hardest Level" style={styles.playButton} onPress={() => {
            this.props.setLevel(8, 200);
            playTimes = 0;
            playArr = [];
          }} iconContainerStyle={{
            marginRight: 10
          }} titleStyle={{
            fontWeight: '700'
          }} buttonStyle={{
            backgroundColor: 'rgba(90, 154, 230, 1)',
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 30
          }} containerStyle={{
            width: 130
          }}/>

        </View>

      </ScrollView>
    </View>);
  }
}

const mapStateToProps = (state) => {
  console.log('in mapStateToProps', state.level);
    return {
      level: state.level,
      speed: state.speed
    }

};

const mapDispatchToProps = (dispatch) => {
    return {
        setLevel: (level, speed) => dispatch(gameChangeLevel(level, speed))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LinksScreen)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

  contentContainer: {
    paddingTop: 30
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  playButton: {
    width: '100%',
    marginBottom: 30,
    marginTop: 30
  },
  roundButton: {
    margin: 10
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10
  }
});
