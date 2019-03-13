'use strict';
function ResidentialLivingSolutions() {
  this.filters = {
    city: '',
    price: '',
    category: '',
    sort: 'Rating'
  };

  this.dialogs = {};

  firebase.firestore().settings({ timestampsInSnapshots: true });

  var that = this;
  firebase.auth().signInAnonymously().then(function() {
    that.initTemplates();
    that.initRouter();
    that.initReviewDialog();
    that.initFilterDialog();
  }).catch(function(err) {
    console.log(err);
  });
}

/**
 * Initializes the router for the ResidentialLivingSolutions app.
 */
ResidentialLivingSolutions.prototype.initRouter = function() {
  this.router = new Navigo();

  var that = this;
  this.router
    .on({
      '/': function() {
        that.updateQuery(that.filters);
      }
    })
    .on({
      '/setup': function() {
        that.viewSetup();
      }
    })
    .on({
      '/employees/*': function() {
        var path = that.getCleanPath(document.location.pathname);
        var id = path.split('/')[2];
        that.viewEmployee(id);
      }
    })
    .resolve();

  firebase
    .firestore()
    .collection('employees')
    .limit(1)
    .onSnapshot(function(snapshot) {
      if (snapshot.empty) {
        that.router.navigate('/setup');
      }
    });
};

ResidentialLivingSolutions.prototype.getCleanPath = function(dirtyPath) {
  if (dirtyPath.startsWith('/index.html')) {
    return dirtyPath.split('/').slice(1).join('/');
  } else {
    return dirtyPath;
  }
};

ResidentialLivingSolutions.prototype.getFirebaseConfig = function() {
  return firebase.app().options;
};

ResidentialLivingSolutions.prototype.getRandomItem = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

ResidentialLivingSolutions.prototype.data = {
  words: [
    'Sneha',
    'Priyanka',
    'Aditi',
    'Anjali',
    'Sherya',
    'Kavita',
    'Tanya',
    'Kriti',
    'Raj',
    'Aditya',
    'Rahul',
    'Rakesh',
    'Dhruv',
    'Yash',
    'Rajesh',
    'Rohit',
    'Ankur',
    'Kumar',
    'Mahesh',
  ],
  firstNames: [
    'Sneha',
    'Priyanka',
    'Aditi',
    'Anjali',
    'Sherya',
    'Kavita',
    'Tanya',
    'Kriti',
    'Raj',
    'Aditya',
    'Rahul',
    'Rakesh',
    'Dhruv',
    'Yash',
    'Rajesh',
    'Rohit',
    'Ankur',
    'Kumar',
    'Mahesh',
  ],
  lastNames: [
    'Acharya',
    'Agrawal',
    'Khatri',
    'Ahuja',
    'Anand',
    'Patel',
    'Reddy',
    'Bakshi',
    'Anthony',
    'Arya',
    'Balakrishnan',
    'Banerjee',
    'Bhatt',
    'Basu',
    'Verma',
    'Bedi',
    'Dalal',
    'Datta',
    'Dewan',
  ],
  cities: [
    'Gotri',
    'Tarsali',
    'Gorwa',
    'Waghodia',
    'Vasna',
    'Akota',
    'Sama',
    'Alkapuri',
    'Maneja',
    'Harni Road',
    'Kalali',
    'Sevasi',
    'Nizampura',
    'Manjalpur',
    'Karelibaug',
    'Pratapgunj',
    'Fategunj',
    'Subhanpura',
    'Mandvi',
    'Makarpura',
    'Ranoli',
    'Vadsar',
    'Atladara',
    'Chhani',
    'Halol',
    'Sayajigunj',
    'Laxmipura',
    'Tandalja',
    'Padra',
    'Bhayli',
    'Umeta',
    'Warasiya',
    'Vishwamitri',
    'Nagarwada',
    'Diwalipura',
    'Soma Talav',
    'Dabhoi',
    'Dumad',
    'Lalbaug',
    'OP Road',
    'Fatehpura',
    'Jatelpur',
    'Navapura',
    'Karjan',
    'Muj Mahuda',
    'Undera',
    'Panchvati'
  ],
  categories: [
    'Security',
    'House Cleaning',
    'Cook',
    'Gardening',
    'Medical'
  ],
  ratings: [
    {
      rating: 1,
      text: 'Would never call this one again!'
    },
    {
      rating: 2,
      text: 'Not my kind of person.'
    },
    {
      rating: 3,
      text: 'Exactly okay :/'
    },
    {
      rating: 4,
      text: 'Actually pretty good, would recommend!'
    },
    {
      rating: 5,
      text: 'This is my favorite employee. Literally.'
    }
  ]
};

window.onload = function() {
  window.app = new ResidentialLivingSolutions();
};

// Signs-in Friendly Chat.
function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

// Signs-out of Friendly Chat.
function signOut() {
  // Sign out of Firebase.
  firebase.auth().signOut();
}

// Initiate firebase auth.
function initFirebaseAuth() {
  // Listen to auth state changes.
  firebase.auth().onAuthStateChanged(authStateObserver);
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

// Saves the messaging device token to the datastore.
function saveMessagingDeviceToken() {
  firebase.messaging().getToken().then(function(currentToken) {
    if (currentToken) {
      console.log('Got FCM device token:', currentToken);
      // Saving the Device Token to the datastore.
      firebase.firestore().collection('fcmTokens').doc(currentToken)
          .set({uid: firebase.auth().currentUser.uid});
    } else {
      // Need to request permissions to show notifications.
      requestNotificationsPermissions();
    }
  }).catch(function(error){
    console.error('Unable to get messaging token.', error);
  });
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  if (user) { // User is signed in!
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    // Set the user's profile pic and name.
    userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
    userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    userNameElement.removeAttribute('hidden');
    userPicElement.removeAttribute('hidden');
    signOutButtonElement.removeAttribute('hidden');

    // Hide sign-in button.
    signInButtonElement.setAttribute('hidden', 'true');

    // We save the Firebase Messaging Device token and enable notifications.
    saveMessagingDeviceToken();
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    userNameElement.setAttribute('hidden', 'true');
    userPicElement.setAttribute('hidden', 'true');
    signOutButtonElement.setAttribute('hidden', 'true');

    // Show sign-in button.
    signInButtonElement.removeAttribute('hidden');
  }
}

// Returns true if user is signed-in. Otherwise false and displays a message.
function checkSignedInWithMessage() {
  // Return true if the user is signed in Firebase
  if (isUserSignedIn()) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
  return false;
}

// Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
}

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
}

// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
}

// Checks that Firebase has been imported.
checkSetup();

// Shortcuts to DOM Elements.
var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
var signInButtonElement = document.getElementById('sign-in');
var signOutButtonElement = document.getElementById('sign-out');
var signInSnackbarElement = document.getElementById('must-signin-snackbar');

// initialize Firebase
initFirebaseAuth();

// Remove the warning about timstamps change. 
var firestore = firebase.firestore();
var settings = {timestampsInSnapshots: true};
firestore.settings(settings);

signOutButtonElement.addEventListener('click', signOut);
signInButtonElement.addEventListener('click', signIn);

// We load currently existing chat messages and listen to new ones.
loadMessages();