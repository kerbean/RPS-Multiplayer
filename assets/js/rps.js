$(document).ready(function () {

    console.log("javascript working");

    openLogin();

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

    database.ref().on("value", function (snapshot) {
        console.log("testsnapshot");
    }, function errorMsg(error) {
        console.log(error);
    });

    var connectionsRef = database.ref("/connections");

    // '.info/connected' is a special location provided by Firebase that is updated every time
    // the client's connection state changes.
    // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
    var connectedRef = database.ref(".info/connected");

    // When the client's connection state changes...
    connectedRef.on("value", function (snap) {

        // If they are connected..
        if (snap.val()) {

            // Add user to the connections list.
            var con = connectionsRef.push(true);

            // Remove user from the connection list when they disconnect.
            con.onDisconnect().remove();
        }
    });

    // As httpOnly cookies are to be used, do not persist any state client side.
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

    // When the user signs in with email and password.
    firebase.auth().signInWithEmailAndPassword('user@example.com', 'password').then(user => {
        // Get the user's ID token as it is needed to exchange for a session cookie.
        return user.getIdToken().then(idToken => {
            // Session login endpoint is queried and the session cookie is set.
            // CSRF protection should be taken into account.
            // ...
            const csrfToken = getCookie('csrfToken')
            return postIdTokenToSessionLogin('/sessionLogin', idToken, csrfToken);
        });
    }).then(() => {
        // A page redirect would suffice as the persistence is set to NONE.
        return firebase.auth().signOut();
    }).then(() => {
        window.location.assign('/profile');
    });

    app.post('/sessionLogin', (req, res) => {
        // Get the ID token passed and the CSRF token.
        const idToken = req.body.idToken.toString();
        const csrfToken = req.body.csrfToken.toString();
        // Guard against CSRF attacks.
        if (csrfToken !== req.cookies.csrfToken) {
            res.status(401).send('UNAUTHORIZED REQUEST!');
            return;
        }
        // Set session expiration to 5 days.
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        // Create the session cookie. This will also verify the ID token in the process.
        // The session cookie will have the same claims as the ID token.
        // To only allow session cookie setting on recent sign-in, auth_time in ID token
        // can be checked to ensure user was recently signed in before creating a session cookie.
        admin.auth().createSessionCookie(idToken, { expiresIn })
            .then((sessionCookie) => {
                // Set cookie policy for session cookie.
                const options = { maxAge: expiresIn, httpOnly: true, secure: true };
                res.cookie('session', sessionCookie, options);
                res.end(JSON.stringify({ status: 'success' }));
            }, error => {
                res.status(401).send('UNAUTHORIZED REQUEST!');
            });
    });

    admin.auth().verifyIdToken(idToken)
        .then((decodedIdToken) => {
            // Only process if the user just signed in in the last 5 minutes.
            if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
                // Create session cookie and set it.
                return admin.auth().createSessionCookie(idToken, { expiresIn });
            }
            // A user that was not recently signed in is trying to set a session cookie.
            // To guard against ID token theft, require re-authentication.
            res.status(401).send('Recent sign in required!');
        });

    app.post('/sessionLogout', (req, res) => {
        res.clearCookie('session');
        res.redirect('/login');
    });



    openLogin();


    // var provider = new firebase.auth.GoogleAuthProvider();

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
        console.log("onSignIn");
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!isUserEqual(googleUser, firebaseUser)) {
                console.log("here2");
                // Build Firebase credential with the Google ID token.
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.getAuthResponse().id_token);
                // Sign in with credential from the Google user.

                var user = firebase.auth().currentUser;
                if (user) {
                    console.log("here1");
                    var name, email, photoUrl, uid, emailVerified;
                    if (user != null) {
                        name = user.displayName;
                        email = user.email;
                        photoUrl = user.photoURL;
                        emailVerified = user.emailVerified;
                        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                        // this value to authenticate with your backend server, if
                        // you have one. Use User.getToken() instead.
                        console.log("Google Name: " + name);
                        $(".welcome-note").append(name + "!");
                        showContainer();

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
    $(".continue").on("click", function () {
        closeForm();
    })


    function openLogin() {
        $("#myForm").css("display", "block");
    }

    function closeForm() {
        $("#myForm").css("display", "none");
        $(".container").css("display", "block");
    }

    function showContainer() {
        $(".container").css("display", "block");
    }


});