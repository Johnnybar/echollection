import React from "react";
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
} from "react-native";
import { connect } from "react-redux";
import colors from "../assets/vars/colors";
import { gameChangeLevel } from "../actions/actions";
import { gameRestart } from "../actions/actions";
import { createIconSetFromFontello } from "react-native-vector-icons";
import fontelloConfig from "../config.json";
import {
  registerCustomIconType,
  Button,
  ButtonGroup
} from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
const CustomIcon = createIconSetFromFontello(fontelloConfig);
import { WebBrowser, Font } from "expo";
import { MonoText } from "../components/StyledText";
import Modules from "../modules/modules";

const sounds = {
  bell: require("../assets/sounds/bell.mp3"),
  crash: require("../assets/sounds/crash.wav"),
  kick: require("../assets/sounds/kick.mp3"),
  hat: require("../assets/sounds/hat.mp3")
};

//only imported to make sure all sounds are available during runtime
const soundsArr = [
  require("../assets/sounds/bell.mp3"),
  require("../assets/sounds/jingle.mp3"),
  require("../assets/sounds/snare.wav"),
  require("../assets/sounds/crash.wav"),
  require("../assets/sounds/kick.mp3"),
  require("../assets/sounds/hat.mp3")
];

let playTimes = 0;
let playArr = [];
let answersArr = [];

class LinksScreen extends React.Component {
  static navigationOptions = {
    title: "Game"
  };

  constructor(props) {
    super(props);
    this.state = {
      bell: 1,
      snare: 1,
      kick: 1,
      hat: 1,
      crash: 1,
      jingle: 1,
      expand: new Animated.Value(1),
      startScreenLogoOpacity: new Animated.Value(1),
      startScreenLogoLeftPosition: new Animated.Value(-10),
      mounted: false
    };
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
  };

  //runs on clicking play button or when last round successful
  _randomPlay = async prop => {
    //add new instrument when getting to level 5 and 8

    this.props.level > 8
      ? (sounds["jingle"] = require("../assets/sounds/jingle.mp3"))
      : delete sounds.jingle;
    this.props.level > 5
      ? (sounds["snare"] = require("../assets/sounds/snare.wav"))
      : delete sounds.snare;
    // When winning the game
    Animated.spring(
      // Animate over time
      this.state.expand, // The animated value to drive
      {
        toValue: 1, // Animate to
        friction: 10
      }
    ).start();
    try {
      //When round playing starts
      let chosen = Modules._getRandomIntInclusive(sounds);
      //choose current instrument
      this.setState(
        {
          current: chosen,
          currentlyPlaying: true,
          success: false
        },
        () => {
          if (playTimes < this.props.level) {
            //run play
            this._play(chosen, this.props.speed);
          } else {
            //When round playing ends
            this.setState({ currentlyPlaying: false });
            console.log(
              "this was played: ",
              playArr,
              "these are the current available sounds: ",
              sounds
            );
          }
        }
      );
    } catch (error) {
      console.log(">>>>>>>> ALARM PLAY", error);
    }
  };

  //plays individual sounds
  _play = async (prop, selected) => {
    if (this.props.level > 12) {
      this.setState({
        gameWon: true,
        playButtonOn: true,
        currentlyPlaying: false
      });
      // soundObject.unloadAsync();
      return;
    } else if (prop) {
      try {
        let key = this.state.current;
        playArr.push(key);
        //Blinking effect - lower opacity of current instrument and return it to regular after 100 milliseconds
        this.setState(prevState => ({ [key]: 0.3 }));
        setTimeout(() => {
          this.setState({ [key]: 1 });
          playTimes++;
        }, 100);
        if (this.props.muted !== true) {
          console.log("in if muted statement");
          const soundObject = new Expo.Audio.Sound();
          await soundObject.loadAsync(sounds[prop]);
          await soundObject.playAsync();
        }
        //play a random sound every ___ milliseconds
        setTimeout(() => {
          this._randomPlay();
        }, this.props.speed);
        //End of blinking effect
      } catch (error) {
        console.log(">>>>>>>> ALARM PLAY", error);
      }
    }
  };

  _afterSuccessfulTurn = async () => {
    this.setState({ success: true }, () => {
      Animated.spring(
        // Animate over time
        this.state.expand, // The animated value to drive
        {
          toValue: 1.3, // Animate to
          friction: 1 // Make it take a while
        }
      ).start();
    });
    this.props.setLevel(this.props.level + 1, this.props.speed - 50);
    setTimeout(() => {
      answersArr = [];
      playTimes = 0;
      playArr = [];
      this._randomPlay();
    }, 2000);
  };

  _restartGame = async () => {
    try{
    this.setState({ gameWon: false }, () => {
      answersArr = [];
      playArr = [];
      this.props.setLevel(4, 800);

    });
  }
  catch (error) {

    console.log(error);
  }
  };

  _playerInput = async prop => {
    if (this.state.currentlyPlaying === true) {
      Alert.alert("Please wait");
    } else if (playArr.length === 0) {
      Alert.alert("Sounds can only be played after play was clicked");
    } else {
      // console.log(answersArr.length, playArr.length, playTimes);
      const soundObject = new Expo.Audio.Sound();
      await soundObject.loadAsync(sounds[prop]);
      await soundObject.playAsync();
      if (answersArr.length === playArr.length - 1) {
        if (answersArr.every((value, index) => value === playArr[index])) {
          this._afterSuccessfulTurn();
        } else {
          Alert.alert("Nope...Press play to try again");
          answersArr = [];
          playArr = [];
          this.props.setLevel(4, 800);
        }
      } else {
        answersArr.push(prop);
      }
    }
  };

  _onScreenView = () => {
        console.log('screen is in view');
    }

  async componentDidMount() {
    // if(this.props.reload){
    //   console.log('YYYYYEAH', this.props.reload);
    // }
    try {
      this._onScreenView()
      this.props.navigation.addListener('willFocus', this._onScreenView)
      await Font.loadAsync({
        instruments: require("../assets/fonts/instruments.ttf")
      });
      // await Animated.stagger(1000, [
      //   Animated.timing(this.state.startScreenLogoOpacity, {
      //     toValue: 0,
      //     duration: 2000,
      //     delay: 1000
      //   }),
      //   Animated.spring(this.state.startScreenLogoLeftPosition, {
      //     toValue: 20,
      //     friction: 0.3
      //   })
      // ]).start()

      await setTimeout(() => {
        this.setState({ mounted: true });
      }, 0); //need to change back to 3000 to display welcome

      await this._prepareSound();
      await this.props.setLevel(4, 800);
    } catch (error) {
      this.setState({ errorWhenMounting: true });
      console.log(error);
    }
  }

  componentDidUpdate() {
    if (this.props.restart === true) {
      this.props.gameRestart(false);
      this._randomPlay();
      playTimes = 0;
      playArr = [];
      answersArr = [];
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {/*In case of error*/}
        {this.state.errorWhenMounting && (
          <View>
            <Text>Sorry, an error has occurred</Text>
          </View>
        )}

        {/*If not loaded yet*/}
        {this.state.mounted === false && (
          <Animated.View
            style={{
              ...styles.contentContainer,
              top: 200,
              left: this.state.startScreenLogoLeftPosition,
              opacity: this.state.startScreenLogoOpacity
            }}
          >
            <Button
              title="Welcome!"
              textStyle={styles.playButtonText}
              titleStyle={{ fontWeight: "700" }}
              buttonStyle={{
                backgroundColor: "rgba(92, 99,216, 1)",
                height: 150,
                width: 150,
                borderRadius: 75,
                borderColor: "transparent",
                borderWidth: 0
              }}
              containerStyle={{ marginTop: 20 }}
            />
          </Animated.View>
        )}

        {/*After game loaded*/}
        {this.state.mounted === true && (
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
          >
            {/*After winning the game*/}
            {this.state.gameWon === true && (
              <View>
                <Text style={styles.success}>YOU WON THE GAME, CONGRATS!</Text>
                <Button
                  title="Start Again"
                  onPress={() => {
                    this._restartGame();
                  }}
                />
              </View>
            )}

            {/*When still playing*/}
            {this.state.gameWon !== true && (
              <View style={styles.container}>
                <View style={styles.progressContainer}>
                  <Text style={styles.progressIndicator}>
                    Current Level: {this.props.level - 3}
                  </Text>
                </View>

                {/*After a successful round*/}
                {this.state.success === true && this.props.level < 12 && (
                  <Text style={styles.success}>
                    GREAT JOB, HERE COMES THE NEXT ONE
                  </Text>
                )}
                <Button
                  title="next"
                  textStyle={{ fontSize: 10, fontWeight: "400" }}
                  buttonStyle={{
                    height: 23,
                    width: 23,
                    borderRadius: 2,
                    padding: 0
                  }}
                  onPress={() => {
                    this._afterSuccessfulTurn();
                  }}
                />
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={styles.instrumentContainer}
                    onPress={() => {
                      this._playerInput("kick");
                    }}
                  >
                    <CustomIcon
                      name="kickdrum"
                      size={60+8}
                      title="KICK"
                      raised
                      rounded
                      style={{
                        opacity: this.state.kick,
                        color: colors.first
                        // height: 94,
                        // width: 94,
                        // borderRadius: 47
                      }}
                      textStyle={{ fontSize: 11, fontWeight: "800" }}
                      // buttonStyle={{
                      //   backgroundColor: "rgba(50, 173, 62, 1)",
                      //   height: 94,
                      //   width: 94,
                      //   borderRadius: 47
                      // }}
                    />
                    <Text style={styles.instrumentText}>KICKDRUM</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.instrumentContainer}
                    onPress={() => {
                      this._playerInput("bell");
                    }}
                  >
                    <CustomIcon
                      name="cowbell"
                      size={80+8}
                      title="COWBELL"
                      raised
                      rounded
                      style={{ opacity: this.state.bell, color: colors.second }}
                      textStyle={{ fontSize: 11, fontWeight: "800" }}
                      // buttonStyle={{
                      //   backgroundColor: "rgba(163, 77, 11, 1)",
                      //   height: 94,
                      //   width: 94,
                      //   borderRadius: 47,
                      //
                      // }}
                    />
                    <Text style={styles.instrumentText}>COWBELL</Text>
                  </TouchableOpacity>
                  {this.props.level > 5 && (
                    <TouchableOpacity
                      style={styles.instrumentContainer}
                      onPress={() => {
                        this._playerInput("snare");
                      }}
                    >
                      <CustomIcon
                        name="snare"
                        size={70+8}
                        title="SNARE"
                        raised
                        rounded
                        style={{
                          opacity: this.state.snare,
                          color: colors.third
                        }}
                        textStyle={{ fontSize: 11, fontWeight: "800" }}
                        // buttonStyle={{
                        //   backgroundColor: "rgba(199, 43, 98, 1)",
                        //   height: 94,
                        //   width: 94,
                        //   borderRadius: 47,
                        //
                        // }}
                      />
                      <Text style={styles.instrumentText}>SNARE</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Animated.View
                  style={{
                    ...styles.buttonsContainer,
                    transform: [{ scale: this.state.expand }]
                  }}
                >
                  {/*PLAY BUTTON*/}

                  <Button
                    title="Play"
                    
                    rounded
                    onPress={() => {
                      if (this.state.currentlyPlaying !== true) {
                        // console.log(this.props, 'in button play');
                        this._randomPlay();
                        playTimes = 0;
                        playArr = [];
                        answersArr = [];
                      }
                    }}
                    textStyle={[
                      styles.playButtonText,
                      this.state.currentlyPlaying === true
                        ? styles.playButtonOff
                        : styles.playButtonOn
                    ]}
                    buttonStyle={[
                      styles.playButtonBg,
                      this.state.currentlyPlaying === true
                        ? styles.playButtonOff
                        : styles.playButtonOn
                    ]}
                  />
                </Animated.View>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={styles.instrumentContainer}
                    onPress={() => {
                      this._playerInput("hat");
                    }}
                  >
                    <CustomIcon
                      name="hat"
                      size={75+8}
                      title="HAT"
                      raised
                      rounded
                      style={{ opacity: this.state.hat, color: colors.fourth }}
                      textStyle={{ fontSize: 11, fontWeight: "800" }}
                      // buttonStyle={{
                      //   backgroundColor: "rgba(255, 140, 0, 1)",
                      //   height: 94,
                      //   width: 94,
                      //   borderRadius: 47,
                      //
                      // }}
                    />
                    <Text style={styles.instrumentText}>HAT</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.instrumentContainer}
                    onPress={() => {
                      this._playerInput("crash");
                    }}
                  >
                    <CustomIcon
                      name="crash"
                      size={70+8}
                      title="CRASH"
                      raised
                      rounded
                      style={{ opacity: this.state.crash, color: colors.fifth }}
                      textStyle={{ fontSize: 11, fontWeight: "800" }}
                      // buttonStyle={{
                      //   backgroundColor: "rgba(234, 144, 244, 1)",
                      //   height: 94,
                      //   width: 94,
                      //   borderRadius: 47,
                      // }}
                    />
                    <Text style={styles.instrumentText}>CRASH</Text>
                  </TouchableOpacity>
                  {this.props.level > 8 && (
                    <TouchableOpacity
                      style={styles.instrumentContainer}
                      onPress={() => {
                        this._playerInput("jingle");
                      }}
                    >
                      <CustomIcon
                        name="jingle"
                        size={65+8}
                        title="JINGLE"
                        raised
                        rounded
                        style={{
                          opacity: this.state.jingle,
                          color: colors.sixth
                        }}
                        textStyle={{ fontSize: 11, fontWeight: "800" }}
                        // buttonStyle={{
                        //   backgroundColor: "rgba(55, 204, 201, 1)",
                        //   height: 94,
                        //   width: 94,
                        //   borderRadius: 47,
                        // }}
                      />
                      <Text style={styles.instrumentText}>JINGLE</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    level: state.level,
    speed: state.speed,
    muted: state.muted,
    restart: state.restart
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLevel: (level, speed) => dispatch(gameChangeLevel(level, speed)),
    gameRestart: restart => dispatch(gameRestart(restart))
  };
};
const marginTop = Platform.OS === 'ios' ? 25 : 3
const marginBottom = Platform.OS === 'ios' ? 25 : 3
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LinksScreen);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    display: "flex",

  },
  progressContainer: {
    backgroundColor: "#f3f3f3",
        borderRadius: 25,
        color: "black",
        margin: 10,
  },
  progressIndicator: {
    textAlign: "center",
    padding: 5,


  },
  success: {
    backgroundColor: "green",
    color: "white",
    fontSize: 30,
    justifyContent: "center",
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 0,
    alignItems: "center"
  },
  playButtonBg: {
    backgroundColor: "rgba(94, 154, 230, 1)",
    height: 110,
    width: 110,
    borderRadius: 55
  },
  playButtonText: {
    fontSize: 17,
    fontWeight: "800"
  },
  playButtonOn: {
    opacity: 1
  },
  playButtonOff: {
    opacity: 0.2
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: marginTop,
    marginBottom: marginBottom
  },
  roundButton: {},
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  instrumentContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
    marginRight: 15
  },
  instrumentText: {
    position: "absolute",
    textAlign: "center",
    fontSize: 10,
    textShadowColor: "white",
    textShadowOffset: { width: 1, height: 0 },
    textShadowRadius: 10,
    color: "black",
    overflow: "hidden",
    backgroundColor: "white",
    opacity: 0.9,
    borderRadius: 10,
    borderWidth: 1,
    padding: 3,
    borderColor: "black"
  }
})
