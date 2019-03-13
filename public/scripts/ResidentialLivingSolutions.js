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
    'One Hour',
    'One Day',
    'One Month',
    'One Year',
    'Hourly',
    'Daily',
    'Monthly',
    'Yearly'
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
