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
  crash: require('../assets/sounds/crash.wav'),
  kick: require('../assets/sounds/kick.mp3'),
  hat: require('../assets/sounds/hat.mp3')
};

//only imported to make sure all sounds are available during runtime
const soundsArr = [require('../assets/sounds/bell.mp3'), require('../assets/sounds/jingle.mp3'), require('../assets/sounds/snare.wav'), require('../assets/sounds/crash.wav'), require('../assets/sounds/kick.mp3'), require('../assets/sounds/hat.mp3')];

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
      crash: 1,
      jingle: 1
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


  //generate random instrument selection
  _getRandomIntInclusive = (obj) => {
    var result;
    var count = 0;
    for (var prop in obj)
      if (Math.random() < 1 / ++count)
        result = prop;
  return result;
  };

//runs on clicking play button or when last round successful
  _randomPlay = async (prop) => {
  //add new instrument when getting to level 5 and 8

    this.props.level > 8 ? sounds['jingle'] = require('../assets/sounds/jingle.mp3') : delete sounds.jingle;
    this.props.level > 5 ? sounds['snare'] =  require('../assets/sounds/snare.wav') : delete sounds.snare;
    // When winning the game

    try {
      //When round playing starts
      let chosen = this._getRandomIntInclusive(sounds)
      //choose current instrument
      this.setState({
        current: chosen,
        currentlyPlaying: true,
         success: false,
      }, () => {
        if (playTimes < this.props.level) {
          //run play
          this._play(chosen, this.props.speed)
        }
        else{
          //When round playing ends
          this.setState({currentlyPlaying: false})
          console.log('this was played: ',playArr, 'these are the current available sounds: ', sounds);
        }

      });
    } catch (error) {
      console.log('>>>>>>>> ALARM PLAY', error);
    }
  }

  //plays individual sounds
    _play = async (prop, selected) => {
      if(this.props.level > 12){
        this.setState({gameWon: true, playButtonOn: true, currentlyPlaying: false})
        // soundObject.unloadAsync();
        return
      }
      else if (prop) {
        try {
          let key = this.state.current;
          playArr.push(key)
          //Blinking effect - lower opacity of current instrument and return it to regular after 100 milliseconds
          this.setState(prevState => ({[key]: 0.3}))
          setTimeout(() => {
            this.setState({[key]: 1})
            playTimes++
          }, 200)
           const soundObject = new Expo.Audio.Sound()
          await soundObject.loadAsync(sounds[prop]);
          await soundObject.playAsync();
          //play a random sound every ___ milliseconds
          setTimeout(() => {
            this._randomPlay()
          }, this.props.speed)
          //End of blinking effect
        } catch (error) {
          console.log('>>>>>>>> ALARM PLAY', error);
        }
      }
    }

    _afterSuccessfulTurn = async()=>{
      this.setState({success: true})
      this.props.setLevel(this.props.level+1, this.props.speed-50);
      setTimeout(()=>{
      answersArr = []
      playTimes = 0;
      playArr = [];
      this._randomPlay();
    }, 2000)
    }
    _restartGame =async() =>{
      this.setState({gameWon: false}, ()=>{
      answersArr = []
      playArr = []
      this.props.setLevel(4, 800)})

    }

  _playerInput = async (prop) => {
    if(this.state.currentlyPlaying === true){
      Alert.alert('Please wait')
    }
    else if (playArr.length === 0){
      Alert.alert('Sounds can only be played after play was clicked')
    }
    else {
    // console.log(answersArr.length, playArr.length, playTimes);
    const soundObject = new Expo.Audio.Sound()
    await soundObject.loadAsync(sounds[prop]);
    await soundObject.playAsync();
    if (answersArr.length === playArr.length - 1) {

      if (answersArr.every((value, index) => value === playArr[index])) {
        this._afterSuccessfulTurn()

      } else {
        Alert.alert('Nope...Press play to try again')
        answersArr = []
        playArr = []
        this.props.setLevel(4, 800)
      }
    } else {
      answersArr.push(prop)
    }
  }
  }

  componentDidMount() {
    this._prepareSound()
    this.props.setLevel(4, 800)
  }

  render() {
    return (<View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {this.state.gameWon === true && <View><Text style={styles.success}>YOU WON THE GAME, CONGRATS!</Text>
      <Button title='Start Again' onPress={()=>{this._restartGame()}}></Button></View>}
        {this.state.gameWon !== true && <View style={styles.container}>
          <View style={styles.progressContainer}><Text style={styles.progressIndicator}>Current Level: {this.props.level - 3} {"\n"} Current Speed: {this.props.speed/1000} Seconds</Text></View>
          {this.state.success === true && this.props.level<12  && <Text style={styles.success}>GREAT JOB, HERE COMES THE NEXT ONE</Text>}

          <Button title="next"
            textStyle={{ fontSize: 10, fontWeight: '400'}}
            buttonStyle={{
              height: 30,
              width: 30,
              borderRadius: 10,
              padding: 0
            }}
            onPress={() => {
              this._afterSuccessfulTurn()
            }}/>
          <View style={styles.buttonsContainer}>
            <Button title="KICK"
              raised
            rounded
            onPress={() => {
             this._playerInput('kick')
           }}
              textStyle={{ fontSize: 11, fontWeight: '800'}}
                buttonStyle={{
                backgroundColor: 'rgba(50, 173, 62, 1)',
                height: 94,
                width: 94,
                borderRadius: 47,
                opacity: this.state.kick
              }}/>
            <Button title="COWBELL"
              raised
              rounded
               onPress={() => {
                this._playerInput('bell')
              }}
              textStyle={{ fontSize: 11, fontWeight: '800'}}
               buttonStyle={{
                backgroundColor: 'rgba(163, 77, 11, 1)',
                height: 94,
                width: 94,
                borderRadius: 47,

                opacity: this.state.bell
              }} />
            {this.props.level > 5 && <Button title="SNARE"
              raised
              rounded
               onPress={() => {
                this._playerInput('snare')
              }} textStyle={{ fontSize: 11, fontWeight: '800'}}
               buttonStyle={{
                backgroundColor: 'rgba(199, 43, 98, 1)',
                height: 94,
                width: 94,
                borderRadius: 47,
                opacity: this.state.snare
              }}/>}

            </View>
            <Animated.View style={styles.buttonsContainer}>

            {/*PLAY BUTTON*/}

              <Button title="Play"
                raised
                rounded
                onPress={() => {
                  if(this.state.currentlyPlaying !== true){
                this._randomPlay();
                playTimes = 0;
                playArr = [];
              }}}
              textStyle={[styles.playButtonText, this.state.currentlyPlaying === true ? styles.playButtonOff : styles.playButtonOn]}
              buttonStyle={[styles.playButtonBg, this.state.currentlyPlaying === true ? styles.playButtonOff : styles.playButtonOn]}/>
            </Animated.View>
              <View style={styles.buttonsContainer}>

            <Button title="HAT"
              raised
              rounded
              onPress={() => {
                this._playerInput('hat')
              }}
                textStyle={{ fontSize: 11, fontWeight: '800'}}
               buttonStyle={{
                backgroundColor: 'rgba(255, 140, 0, 1)',
                height: 94,
                width: 94,
                borderRadius: 47,
                opacity: this.state.hat
              }} />
            <Button title="CRASH"
              raised
              rounded
               onPress={() => {
                this._playerInput('crash')
              }}
                textStyle={{ fontSize: 11, fontWeight: '800'}}
               buttonStyle={{
                backgroundColor: 'rgba(234, 144, 244, 1)',
                height: 94,
                width: 94,
                borderRadius: 47,
                opacity: this.state.crash
              }}
              />
              {this.props.level > 8 &&

                <Button title="JINGLE"
                  raised
                  rounded
                  onPress={() => {
                    this._playerInput('jingle')
                  }}
                  textStyle={{ fontSize: 11, fontWeight: '800'}}
                  buttonStyle={{
                    backgroundColor: 'rgba(55, 204, 201, 1)',
                    height: 94,
                    width: 94,
                    borderRadius: 47,
                    opacity: this.state.jingle

                  }} />
                }
              </View>



        </View>}

      </ScrollView>
    </View>);
  }
}

const mapStateToProps = (state) => {
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
    backgroundColor: '#fff',
    display: 'flex'

  },
  progressContainer:{
    backgroundColor: 'black'
  },
  progressIndicator:{
    textAlign: 'center',
    padding: 10,
    color: '#ffffff',
    lineHeight: 30
  },
  success:{
    backgroundColor: 'green',
    color: 'white',
    fontSize: 30,
    justifyContent: 'center',
    textAlign: 'center'
  },
  contentContainer: {
    paddingTop: 0,

  },
  playButtonBg:{
    backgroundColor: 'rgba(94, 154, 230, 1)',
    height: 110,
    width: 110,
    borderRadius: 55,
  },
  playButtonText:{
    fontSize: 17, fontWeight: '800'
  },
  playButtonOn: {
opacity: 1,
  },
  playButtonOff: {
opacity: 0.2,
  },

  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 15
  },
  roundButton: {

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
