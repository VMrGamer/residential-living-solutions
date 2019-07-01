'use strict';
ResidentialLivingSolutions.prototype.addMockEmployees = function() {
  var promises = [];

  for (var i = 0; i < 20; i++) {
    var name =
        this.getRandomItem(this.data.firstNames) +
        ' ' +
        this.getRandomItem(this.data.lastNames);
    var category = this.getRandomItem(this.data.categories);
    var city = this.getRandomItem(this.data.cities);
    var price = Math.floor(Math.random() * 4) + 1;
    var photoID = Math.floor(Math.random() * 22) + 1;
    var photo = 'https://firebasestorage.googleapis.com/v0/b/resident-living-solutions.appspot.com/o/' + category + '.png?alt=media';
    var numRatings = 0;
    var avgRating = 0;
    var numRequests = 0;

    var promise = this.addEmployee({
      name: name,
      category: category,
      price: price,
      city: city,
      numRatings: numRatings,
      avgRating: avgRating,
      numRequests: numRequests,
      photo: photo
    });

    if (!promise) {
      alert('addEmployee() is not implemented yet!');
      return Promise.reject();
    } else {
      promises.push(promise);
    }
  }

  return Promise.all(promises);
};

/**
 * Adds a set of mock Ratings.
 */
ResidentialLivingSolutions.prototype.addMockRatings = function(employeeID) {
  var ratingPromises = [];
  for (var r = 0; r < 5*Math.random(); r++) {
    var rating = this.data.ratings[
      parseInt(this.data.ratings.length*Math.random())
    ];
    rating.userName = 'Bot (Web)';
    rating.timestamp = new Date();
    rating.userId = firebase.auth().currentUser.uid;
    ratingPromises.push(this.addRating(employeeID, rating));
  }
  return Promise.all(ratingPromises);
};