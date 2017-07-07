var mongoose = require('mongoose');
var Tag = mongoose.model('Tag');

  var tagMongoDbGateway = {

  get: function() {
    
  },

  save: function(tagsData) {
    console.log("Saving tags...");
    var tag = new Tag();
    return tag.collection.insert(tagsData, function(err, result){
      if (err) {
          console.log('Error while saving tags: '+err); 
          return err;  
      } else {
          console.info('Tags were successfully stored.');
          return;
      }
    });
  },

};

module.exports = tagMongoDbGateway;