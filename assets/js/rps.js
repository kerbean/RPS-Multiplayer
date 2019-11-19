$(document).ready(function () {

    var username = "";
    var playerNo = 0;
    var totalScore = 0;
    var result = "";
    var cbox = [];

    var chosen = "";
    var enemychosen = "";

    console.log("javascript working 1.0");

    // openLogin();
    // connects();

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
    var connectionsRef = database.ref("/connections");
    var connectedRef = database.ref(".info/connected");

    openLogin();
    // connects();

    function resetTurn() {
        chosen = "";
        enemychosen = "";
    }

    function initPlayer() {
        database.ref("/player1").once('value').then(function (snapshot) {
            console.log("f:initPlayer - Player1: snapshot" + snapshot.val());
            if (!snapshot.val()) {
                console.log("SETTING PLAYER 1");
                database.ref("/player1").set({
                    uname: username,
                    turn: "none",
                    score: 0
                });
                playerNo = 1;
            }
            else {
                database.ref("/player2").once('value').then(function (snapshot) {
                    console.log("f:initPlayer - Player2: snapshot" + snapshot.val());
                    if (!snapshot.val()) {
                        console.log("SETTING PLAYER 2");
                        database.ref("/player2").set({
                            uname: username,
                            turn: "none",
                            score: 0
                        });
                        playerNo = 2;
                    }
                    // else {
                    //     //showMax();
                    //     //closeContainer();
                    // }
                });
            }

            console.log("Player Number: " + playerNo);
            connects();
            // checkConnected();
        });


        // if (player1) {
        //     console.log("PLAYER1 TRUE");
        // } else {
        //     console.log("PLAYER1 FALSE");
        // }

    }

    database.ref("/player1").on("value", function (snap) {
        if (playerNo != 1) {
            // let oturn = JSON.stringify(snap.val().turn);
            let oturn = snap.val().turn;
            console.log("Enemy's Turn = " + oturn);
            // if (oturn != "rock")
            $(".enemy-chosen").text("Enemy chose " + oturn);
            compareTurns();
        }
    });
    database.ref("/player2").on("value", function (snap) {
        if (playerNo != 2) {
            // let oturn = JSON.stringify(snap.val().turn);
            let oturn = snap.val().turn;
            console.log("Enemy's Turn = " + oturn);
            $(".enemy-chosen").text("Enemy chose " + oturn);
            compareTurns();
        }
    });

    database.ref("/chat").on("value", function (snap) {
        let par1 = $("<p>");
        $("#chabox").empty();
        cbox = Object.values(snap.val());
        console.log("Cbox -->" + cbox);
        for (x in cbox) {
            let par = $("<p>")
            console.log("cbox[x] =  [" + x + "]" + cbox[x]);
            // let par = $("p");
            par.text(cbox[x]);
            par1.append(par);
        }
        $("#chabox").append(par1);
    })


    database.ref().on("value", function (snapshot) {
        console.log("testsnapshot");
    }, function errorMsg(error) {
        console.log(error);
    });



    // // As httpOnly cookies are to be used, do not persist any state client side.
    // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

    // // When the user signs in with email and password.
    // firebase.auth().signInWithEmailAndPassword('user@example.com', 'password').then(user => {
    //     // Get the user's ID token as it is needed to exchange for a session cookie.
    //     return user.getIdToken().then(idToken => {
    //         // Session login endpoint is queried and the session cookie is set.
    //         // CSRF protection should be taken into account.
    //         // ...
    //         const csrfToken = getCookie('csrfToken')
    //         return postIdTokenToSessionLogin('/sessionLogin', idToken, csrfToken);
    //     });
    // }).then(() => {
    //     // A page redirect would suffice as the persistence is set to NONE.
    //     return firebase.auth().signOut();
    // }).then(() => {
    //     window.location.assign('/profile');
    // });

    // app.post('/sessionLogin', (req, res) => {
    //     // Get the ID token passed and the CSRF token.
    //     const idToken = req.body.idToken.toString();
    //     const csrfToken = req.body.csrfToken.toString();
    //     // Guard against CSRF attacks.
    //     if (csrfToken !== req.cookies.csrfToken) {
    //         res.status(401).send('UNAUTHORIZED REQUEST!');
    //         return;
    //     }
    //     // Set session expiration to 5 days.
    //     const expiresIn = 60 * 60 * 24 * 5 * 1000;
    //     // Create the session cookie. This will also verify the ID token in the process.
    //     // The session cookie will have the same claims as the ID token.
    //     // To only allow session cookie setting on recent sign-in, auth_time in ID token
    //     // can be checked to ensure user was recently signed in before creating a session cookie.
    //     admin.auth().createSessionCookie(idToken, { expiresIn })
    //         .then((sessionCookie) => {
    //             // Set cookie policy for session cookie.
    //             const options = { maxAge: expiresIn, httpOnly: true, secure: true };
    //             res.cookie('session', sessionCookie, options);
    //             res.end(JSON.stringify({ status: 'success' }));
    //         }, error => {
    //             res.status(401).send('UNAUTHORIZED REQUEST!');
    //         });
    // });

    // admin.auth().verifyIdToken(idToken)
    //     .then((decodedIdToken) => {
    //         // Only process if the user just signed in in the last 5 minutes.
    //         if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
    //             // Create session cookie and set it.
    //             return admin.auth().createSessionCookie(idToken, { expiresIn });
    //         }
    //         // A user that was not recently signed in is trying to set a session cookie.
    //         // To guard against ID token theft, require re-authentication.
    //         res.status(401).send('Recent sign in required!');
    //     });

    // app.post('/sessionLogout', (req, res) => {
    //     res.clearCookie('session');
    //     res.redirect('/login');
    // });



    //openLogin();


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
                var name, email, photoUrl, uid, emailVerified;
                if (user) {
                    console.log("here1");
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

    // $("#continue").on("click", function () {
    //     closeForm();
    //     username = $("#user-name").val();
    // })

    $("#login").on("click", function () {
        closeForm();
        //showContainer();
        username = $("#user-name").val();
        console.log("username length: " + username.length);
        $(".welcome-note").text("Welcome, " + username + "!!");
        initPlayer();
    })


    function openLogin() {
        $("#myForm").css("display", "block");
    }

    function closeForm() {
        console.log("f:closeForm() - START");
        $("#myForm").css("display", "none");
        $(".container").css("display", "block");
    }

    function showWaiting() {
        console.log("f:showWaiting() - START");
        $("#waitplayer").css("display", "block");
    }

    function closeWaiting() {
        console.log("f:closeWaiting() - START");
        $("#waitplayer").css("display", "none");
    }

    function showMax() {
        console.log("f:showMax() - START");
        $("#maxplayer").css("display", "block");
    }

    function closeMax() {
        console.log("f:closeMax() - START");
        $("#maxplayer").css("display", "none");
    }

    function showDC() {
        console.log("f:showDC() - START");
        $("#dcplayer").css("display", "block");
    }

    function closeDC() {
        console.log("f:closeDC() - START");
        $("#dcplayer").css("display", "none");
    }

    function closeContainer() {
        console.log("f:closeContainer() - START");
        $(".container").css("display", "none");
    }

    function showContainer() {
        console.log("f:showContainer() - START");
        $(".container").css("display", "block");
    }

    function closeAll() {
        console.log("f:closeAll() - START");
        closeDC();
        closeForm();
        closeMax();
        closeWaiting();
    }

    // var connectionsRef = database.ref("/connections");

    // // '.info/connected' is a special location provided by Firebase that is updated every time
    // // the client's connection state changes.
    // // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
    // var connectedRef = database.ref(".info/connected");

    // When the client's connection state changes...
    function connects() {
        connectionsRef.on("value", function (snapshot) {
            // Display the viewer count in the html.
            // The number of online users is the number of children in the connections list.
            if (snapshot.numChildren() < 2 && username.length < 2) {
                //closeForm();
                closeContainer();
                showWaiting();
                $(".users-connected").text("Users Connected : 1");
            }
            else if (snapshot.numChildren() == 2 && username.length > 1) {
                closeAll();
                showContainer();
                $(".users-connected").text("Users Connected : 2");
            }
            else if (snapshot.numChildren() > 2) {
                closeContainer();
                closeForm();
                showWaiting();
            }

        });
        connectedRef.on("value", function (snap) {

            // If they are connected..
            if (snap.val()) {

                // Add user to the connections list.
                var con = connectionsRef.push(true);
                // checkConnected();

                // Remove user from the connection list when they disconnect.
                // if (con.onDisconnect()) {
                //     alert("EXITTTT");
                // }

                con.onDisconnect().remove()

                // if (con.onDisconnect()) {
                //     console.log("PlayerNo NO: " + playerNo);
                //     if (playerNo == 1) {
                //         database.ref("/player1").remove();
                //     } else if (playerNo == 2) {
                //         database.ref("/player2").remove();
                //     }
                //     con.onDisconnect().remove()
                // }

                // if (playerNo == 1) {
                //     database.ref("/player1").onDisconnect().remove();
                // } else if (playerNo == 2) {
                //     database.ref("/player2").onDisconnect().remove();
                // }
            }
        });
    }

    // }
    // window.onbeforeunload = confirmExit();
    // function confirmExit() {
    //     var exit = confirm("You have attempted to leave this page. Are you sure?");
    //     if (exit) {
    //         if (playerNo == 1) {
    //             // database.ref("/player1").onDisconnect().remove();
    //             database.ref("/player1").remove();
    //         } else if (playerNo == 2) {
    //             // database.ref("/player2").onDisconnect().remove();
    //             database.ref("/player2").remove();
    //         }
    //     }
    // }

    // When first loaded or when the connections list changes...
    // function checkConnected() {
    //     connectionsRef.on("value", function (snapshot) {
    //         // Display the viewer count in the html.
    //         // The number of online users is the number of children in the connections list.
    //         if (snapshot.numChildren() < 2 && username.length < 2) {
    //             //closeForm();
    //             closeContainer();
    //             showWaiting();
    //             $(".users-connected").text("Users Connected : 1");
    //         }
    //         else if (snapshot.numChildren() == 2 && username.length > 1) {
    //             closeAll();
    //             showContainer();
    //             $(".users-connected").text("Users Connected : 2");
    //         }
    //         else if (snapshot.numChildren() > 2) {
    //             closeContainer();
    //             closeForm();
    //             showWaiting();
    //         }

    //     });
    // }

    $("#rock").on("click", function () {
        getEnemyTurnOnce("rock");

    });
    $("#paper").on("click", function () {
        getEnemyTurnOnce("paper");

    });
    $("#scissors").on("click", function () {
        getEnemyTurnOnce("scissors");

    });

    function compareTurns() {
        console.log("f:compareTurns() - START");
        if (chosen == "rock") {
            if (enemychosen == "rock") {
                result = "TIE";
                showResult(result);
            }
            else if (enemychosen == "paper") {
                result = "YOU LOSE";
                showResult(result);
            }
            else if (enemychosen == "scissors") {
                result = "YOU WIN!";
                showResult(result);
            }
        }
        if (chosen == "paper") {
            if (enemychosen == "paper") {
                result = "TIE";
                showResult(result);
            }
            else if (enemychosen == "scissors") {
                result = "YOU LOSE";
                showResult(result);
            }
            else if (enemychosen == "rock") {
                result = "YOU WIN!";
                showResult(result);
            }
        }
        if (chosen == "scissors") {
            if (enemychosen == "scissors") {
                result = "TIE";
                showResult(result);
            }
            else if (enemychosen == "rock") {
                result = "YOU LOSE";
                showResult(result);
            }
            else if (enemychosen == "paper") {
                result = "YOU WIN!";
                showResult(result);
            }
        }

    }
    function showResult(result) {
        console.log("f:showResult() - START");
        $(".turn-result").text(result);
    }

    function getEnemyTurnOnce(chturn) {
        if (playerNo == 2) {
            database.ref("/player1").once('value').then(function (snapshot) {
                enemychosen = snapshot.val().turn;
                if (chturn == "rock") {
                    choseRock();
                } else if (chturn == "paper") {
                    chosePaper();
                } else if (chturn == "scissors") {
                    choseScissors();
                }
            });
        }
        if (playerNo == 1) {
            database.ref("/player2").once('value').then(function (snapshot) {
                enemychosen = snapshot.val().turn;
                if (chturn == "rock") {
                    choseRock();
                } else if (chturn == "paper") {
                    chosePaper();
                } else if (chturn == "scissors") {
                    choseScissors();
                }
            });
        }
        // if (chturn == "rock") {
        //     choseRock();
        // } else if (chturn == "paper") {
        //     chosePaper();
        // } else if (chturn == "scissors") {
        //     choseScissors();
        // }
    }

    function chosePaper() {
        console.log("b:paper - YOU CHOSE PAPER!!");
        $(".chosen").text("You chose PAPER!!");
        $("#paper").attr('disabled', 'disabled');
        $("#scissors").attr('disabled', 'disabled');
        $("#rock").attr('disabled', 'disabled');
        chosen = "paper";
        database.ref("/player" + playerNo).set({
            uname: username,
            turn: chosen,
            score: totalScore
        });
        $(".enemy-chosen").text("Enemy chose " + enemychosen);
        compareTurns();
    }
    function choseRock() {
        console.log("b:rock - YOU CHOSE ROCK!!");
        $(".chosen").text("You chose ROCK!!");
        $("#paper").attr('disabled', 'disabled');
        $("#scissors").attr('disabled', 'disabled');
        $("#rock").attr('disabled', 'disabled');
        chosen = "rock";
        database.ref("/player" + playerNo).set({
            uname: username,
            turn: chosen,
            score: totalScore
        });
        $(".enemy-chosen").text("Enemy chose " + enemychosen);
        compareTurns();
    }
    function choseScissors() {
        console.log("b:scissors - YOU CHOSE SCISSORS!!");
        $(".chosen").text("You chose SCISSORS!!");
        $("#paper").attr('disabled', 'disabled');
        $("#scissors").attr('disabled', 'disabled');
        $("#rock").attr('disabled', 'disabled');
        chosen = "scissors";
        database.ref("/player" + playerNo).set({
            uname: username,
            turn: chosen,
            score: totalScore
        });
        $(".enemy-chosen").text("Enemy chose " + enemychosen);
        compareTurns();
    }

    $(".send").on("click", function () {
        $("#chabox").empty();
        let messageBox = $("#chat-mes").val();
        cbox.push(username + " : " + messageBox);
        database.ref().set({
            chat: cbox
        });
        let par1 = $("<p>");
        for (x in cbox) {
            let par = $("<p>")
            console.log("cbox[x] =  [" + x + "]" + cbox[x]);
            // let par = $("p");
            par.text(cbox[x]);
            par1.append(par);
        }
        //$("#chabox").append(par1);
    })

});