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
  Alert,
  SectionList
} from 'react-native';
import {Button, ButtonGroup} from 'react-native-elements';
import { connect } from 'react-redux'
import { gameChangeLevel } from '../actions/actions';
import { gameSetSound } from '../actions/actions';

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };
  constructor(props) {
    super(props);
    this.state = {
      muted: false
    };
  }

  render() {


    return (
      <ScrollView>
        <Button style={styles.sectionContentContainer} title={this.state.muted === false ? "mute sound" : "turn sound on"} onPress={ () => {

           this.setState(prevState => ({
       muted: !prevState.muted
     }), ()=>{
       this.props.setSound(this.state.muted)
     // Expo.Audio.setIsEnabledAsync(this.state.muted)
     // console.log(this.state, 'now here');
   })
        }}></Button>
        <Button style={styles.sectionContentContainer} title="Choose Easy Level" onPress={() => {
          this.props.setLevel(4, 800);
          playTimes = 0;
          playArr = [];
        }}></Button>


      <Button style={styles.sectionContentContainer} title="Medium Level" onPress={() => {
        this.props.setLevel(6, 600);
        playTimes = 0;
        playArr = [];
      }}></Button>
      <Button style={styles.sectionContentContainer} title="Hard Level" onPress={() => {
        this.props.setLevel(8, 400);
        playTimes = 0;
        playArr = [];
      }}></Button>
      </ScrollView>
    );
  }


}

const ListHeader = () => {
  const { manifest } = Constants;

  return (
    <View style={styles.titleContainer}>
      <View style={styles.titleIconContainer}>
        <AppIconPreview iconUrl={manifest.iconUrl} />
      </View>

      <View style={styles.titleTextContainer}>
        <Text style={styles.nameText} numberOfLines={1}>
          {manifest.name}
        </Text>

        <Text style={styles.slugText} numberOfLines={1}>
          {manifest.slug}
        </Text>

        <Text style={styles.descriptionText}>
          {manifest.description}
        </Text>
      </View>
    </View>
  );
};

const SectionHeader = ({ title }) => {
  return (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeaderText}>
        {title}
      </Text>
    </View>
  );
};

const SectionContent = props => {
  return (
    <View style={styles.sectionContentContainer}>
      {props.children}
    </View>
  );
};

const AppIconPreview = ({ iconUrl }) => {
  if (!iconUrl) {
    iconUrl =
      'https://s3.amazonaws.com/exp-brand-assets/ExponentEmptyManifest_192.png';
  }

  return (
    <Image
      source={{ uri: iconUrl }}
      style={{ width: 64, height: 64 }}
      resizeMode="cover"
    />
  );
};

const Color = ({ value }) => {
  if (!value) {
    return <View />;
  } else {
    return (
      <View style={styles.colorContainer}>
        <View style={[styles.colorPreview, { backgroundColor: value }]} />
        <View style={styles.colorTextContainer}>
          <Text style={styles.sectionContentText}>
            {value}
          </Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
  },
  titleIconContainer: {
    marginRight: 15,
    paddingTop: 2,
  },
  sectionHeaderContainer: {
    backgroundColor: '#fbfbfb',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ededed',
  },
  sectionHeaderText: {
    fontSize: 14,
  },
  sectionContentContainer: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 15,
  },
  sectionContentText: {
    color: '#808080',
    fontSize: 14,
  },
  nameText: {
    fontWeight: '600',
    fontSize: 18,
  },
  slugText: {
    color: '#a39f9f',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  descriptionText: {
    fontSize: 14,
    marginTop: 6,
    color: '#4d4d4d',
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorPreview: {
    width: 17,
    height: 17,
    borderRadius: 2,
    marginRight: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  colorTextContainer: {
    flex: 1,
  },
});



const mapStateToProps = (state) => {
    return {
      level: state.level,
      speed: state.speed,
      muted: state.muted
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLevel: (level, speed) => dispatch(gameChangeLevel(level, speed)),
        setSound: (muted) => dispatch(gameSetSound(muted))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)
