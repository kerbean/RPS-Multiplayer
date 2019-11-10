$(document).ready(function () {

    console.log("javascript working");

    var firebaseConfig = {
        apiKey: "AIzaSyDZwxwL_PbIzAz1I4m3U1SfapOKxL2mI0Y",
        authDomain: "pomodoro-algo.firebaseapp.com",
        databaseURL: "https://pomodoro-algo.firebaseio.com",
        projectId: "pomodoro-algo",
        storageBucket: "pomodoro-algo.appspot.com",
        messagingSenderId: "477687585906",
        appId: "1:477687585906:web:e14fba8f2153d6d3eeb6eb"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    database = firebase.database();

    openLogin();


    var provider = new firebase.auth.GoogleAuthProvider();

    // firebase.auth().signInWithPopup(provider).then(function (result) {
    //     // This gives you a Google Access Token. You can use it to access the Google API.
    //     var token = result.credential.accessToken;
    //     // The signed-in user info.
    //     var user = result.user;
    //     // ...
    // }).catch(function (error) {
    //     // Handle Errors here.
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     // The email of the user's account used.
    //     var email = error.email;
    //     // The firebase.auth.AuthCredential type that was used.
    //     var credential = error.credential;
    //     // ...
    // });

    // function onSignIn(googleUser) {
    //     var profile = googleUser.getBasicProfile();
    //     console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //     console.log('Name: ' + profile.getName());
    //     console.log('Image URL: ' + profile.getImageUrl());
    //     console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    // }

    function onSignIn(googleUser) {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!isUserEqual(googleUser, firebaseUser)) {
                // Build Firebase credential with the Google ID token.
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.getAuthResponse().id_token);
                // Sign in with credential from the Google user.

                var user = firebase.auth().currentUser;
                if (user) {
                    var name, email, photoUrl, uid, emailVerified;
                    if (user != null) {
                        name = user.displayName;
                        email = user.email;
                        photoUrl = user.photoURL;
                        emailVerified = user.emailVerified;
                        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                        // this value to authenticate with your backend server, if
                        // you have one. Use User.getToken() instead.

                    }
                } else {
                    console.log("NO USER IS SIGNED-IN!");
                }

                firebase.auth().signInWithCredential(credential).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // ...
                });
            } else {
                console.log('User already signed-in Firebase.');
            }

        });
    }

    function isUserEqual(googleUser, firebaseUser) {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    }


    // $(".open-button").on("click", function () {
    //     $("#myForm").css("display", "block");
    // });
    function openLogin() {
        $("#myForm").css("display", "block");
    }

    function closeForm() {
        $("#myForm").css("display", "none");
    }

    function showContainer() {
        $(".container").css("display", "block");
    }


});