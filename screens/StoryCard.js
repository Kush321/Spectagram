import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    Image,
    Dimensions,
    TouchableOpacity
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from "firebase";

let customFonts = {
    "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class StoryCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            light_theme: true,
            story_id: this.props.story.key,
            story_data: this.props.story.value,
            is_liked: false,
            likes: this.props.story.value.likes
        };
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFontsAsync();
        this.fetchUser();
    }

    likeAction = () => {
        if (this.state.is_liked) {
            firebase.database()
                .ref('posts')
                .child(this.state.story_id)
                .child('likes')
                .set(firebase.database.ServerValue.increment(-1))
            this.setState({
                likes: this.state.likes - 1,
                is_liked: false
            })
        }
        else {
            firebase.database()
                .ref('posts')
                .child(this.state.story_id)
                .child('likes')
                .set(firebase.database.ServerValue.increment(1))
            this.setState({
                likes: this.state.likes + 1,
                is_liked: true
            })
        }
    };

    fetchUser = () => {
        let theme;
        firebase
            .database()
            .ref("/users/" + firebase.auth().currentUser.uid)
            .on("value", snapshot => {
                theme = snapshot.val().current_theme;
                this.setState({ light_theme: theme === "light" });
            });
    };


    render() {
        let post = this.state.story_data;
        if (!this.state.fontsLoaded) {
            return <AppLoading />;
        } else {
            return (
                <TouchableOpacity
                    style={styles.container}
                    onPress={() =>
                        this.props.navigation.navigate("StoryScreen", {
                            post: post
                        })
                    }
                >
                    <View style={this.state.light_theme ? styles.cardContainerLight : styles.cardContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={this.state.light_theme ? styles.storyTitleTextLight : styles.storyTitleText}>
                                {post.name}
                            </Text>
                        </View>
                        <Image
                            source={require("../assets/image_1.jpg")}
                            style={styles.storyImage} />
                        <View style={styles.captionContainer}>
                            <Text style={this.state.light_theme ? styles.descriptionTextLight : styles.descriptionText}>
                                {post.caption}
                            </Text>
                        </View>
                        <View style={styles.actionContainer}>
                        <TouchableOpacity
                style={
                  this.state.is_liked
                    ? styles.likeButtonLiked
                    : styles.likeButtonDisliked
                }
                onPress={() => this.likeAction()}
              >
                <Ionicons
                  name={"heart"}
                  size={RFValue(30)}
                  color={this.state.light_theme ? "black" : "white"}
                />

                <Text
                  style={
                    this.state.light_theme
                      ? styles.likeTextLight
                      : styles.likeText
                  }
                >
                  {this.state.likes}
                </Text>
              </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cardContainer: {
        margin: RFValue(13),
        backgroundColor: "#2f345d",
        borderRadius: RFValue(20)
    },
    cardContainerLight: {
        margin: RFValue(13),
        backgroundColor: "white",
        borderRadius: RFValue(20),
        borderColor: 'black',
        borderWidth: RFValue(3)
    },
    storyImage: {
        resizeMode: "contain",
        width: RFValue(Dimensions.get('window').width - RFValue(100)),
        alignSelf: "center",
        height: RFValue(200),
    },
    titleContainer: {
        paddingLeft: RFValue(20),
        justifyContent: "center",
        marginTop: RFValue(30)
    },
    captionContainer: {
        paddingLeft: RFValue(20),
        justifyContent: "center",
    },
    storyTitleText: {
        fontSize: RFValue(25),
        fontFamily: "Bubblegum-Sans",
        color: "white"
    },
    storyTitleTextLight: {
        fontSize: RFValue(25),
        fontFamily: "Bubblegum-Sans",
        color: "black"
    },
    storyAuthorText: {
        fontSize: RFValue(18),
        fontFamily: "Bubblegum-Sans",
        color: "white"
    },
    storyAuthorTextLight: {
        fontSize: RFValue(18),
        fontFamily: "Bubblegum-Sans",
        color: "black"
    },
    descriptionText: {
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(16),
        color: "white",
        marginTop: RFValue(5)
    },
    descriptionTextLight: {
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(16),
        color: "black",
        marginTop: RFValue(5)
    },
    actionContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: RFValue(10)
    },
    likeButton: {
        width: RFValue(160),
        height: RFValue(40),
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#eb3948",
        borderRadius: RFValue(30)
    },
    likeButton: {
        width: RFValue(160),
        height: RFValue(40),
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: RFValue(30)
    },
    likeText: {
        color: "white",
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(25),
        marginLeft: RFValue(5)
    },
    likeTextLight: {
        color: "black",
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(25),
        marginLeft: RFValue(5)
    },
    likeButtonLiked: {
        width: RFValue(160),
        height: RFValue(40),
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#eb3948",
        borderRadius: RFValue(30)
      },
      likeButtonDisliked: {
        width: RFValue(160),
        height: RFValue(40),
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        borderColor: "#eb3948",
        borderWidth: 2,
        borderRadius: RFValue(30)
      },
      likeText: {
        color: "white",
        fontFamily: "Bubblegum-Sans",
        fontSize: 25,
        marginLeft: 25,
        marginTop: 6
      },
      likeTextLight: {
        fontFamily: "Bubblegum-Sans",
        fontSize: 25,
        marginLeft: 25,
        marginTop: 6
      }
});