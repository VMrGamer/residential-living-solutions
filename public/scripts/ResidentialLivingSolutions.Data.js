'use strict';

ResidentialLivingSolutions.prototype.addEmployee = function(data) {
	var collection = firebase.firestore().collection('employees');
  	return collection.add(data);
};

ResidentialLivingSolutions.prototype.getAllEmployees = function(renderer) {
  	var query = firebase.firestore()
      	.collection('employees')
      	.orderBy('avgRating', 'desc')
      	.limit(50);
  	this.getDocumentsInQuery(query, renderer);
};

ResidentialLivingSolutions.prototype.getDocumentsInQuery = function(query, renderer) {
 	query.onSnapshot(function(snapshot) {
    	if (!snapshot.size) return renderer.empty(); // Display "There is nothing".
    		snapshot.docChanges().forEach(function(change) {
      	if (change.type === 'removed') {
			renderer.remove(change.doc);
		} else {
        	renderer.display(change.doc);
		}
    	});
  	});
};

ResidentialLivingSolutions.prototype.getEmployee = function(id) {
  	return firebase.firestore().collection('employees').doc(id).get();
};

ResidentialLivingSolutions.prototype.getFilteredEmployees = function(filters, renderer) {
 	var query = firebase.firestore().collection('employees');
  	if (filters.category !== 'Any') {
    	query = query.where('category', '==', filters.category);
  	}
  	if (filters.city !== 'Any') {
		query = query.where('city', '==', filters.city);
	}
  	if (filters.price !== 'Any') {
    	query = query.where('price', '==', filters.price.length);
  	}
	if (filters.sort === 'Rating') {
		query = query.orderBy('avgRating', 'desc');
	} else if (filters.sort === 'Reviews') {
		query = query.orderBy('numRatings', 'desc');
	}
  	this.getDocumentsInQuery(query, renderer);
};

ResidentialLivingSolutions.prototype.addRating = function(employeeID, rating) {
  	var collection = firebase.firestore().collection('employees');
  	var document = collection.doc(employeeID);
  	var newRatingDocument = document.collection('ratings').doc();
  	return firebase.firestore().runTransaction(function(transaction) {
    	return transaction.get(document).then(function(doc) {
      		var data = doc.data();
      		var newAverage =
          		(data.numRatings * data.avgRating + rating.rating) /
          		(data.numRatings + 1);
      		transaction.update(document, {
        		numRatings: data.numRatings + 1,
        		avgRating: newAverage
      		});
      	return transaction.set(newRatingDocument, rating);
    	});
  	});
};

ResidentialLivingSolutions.prototype.addRequest = function(employeeID, request) {
	var collection = firebase.firestore().collection('employees');
	var document = collection.doc(employeeID);
	var newRequestDocument = document.collection('requests').doc();
	return firebase.firestore().runTransaction(function(transaction) {
	  return transaction.get(document).then(function(doc) {
		return transaction.set(newRequestDocument, request);
	  });
	});
};