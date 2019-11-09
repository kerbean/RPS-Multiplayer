$(document).ready(() => {
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

    function onSignIn(googleUser) {
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    }



});