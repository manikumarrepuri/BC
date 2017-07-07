const mongoose      = require('mongoose');
var Tag           = mongoose.model('Tag');
const logger      = require("opserve-common").logger;

  var tagModule = {

  find: function() {

  },

  findById: function() {

  },

  create: function(req, res, callback) {
    logger.silly("Saving tags...::[tagModule.create]");
    var tag = new Tag();
    return tag.collection.insert(req.body, function(err, result){
      if (err) {
          logger.error('Error while saving tags::[tagModule.create]: '+err);
          return callback(err);
      } else {
          logger.silly('Tags were successfully stored::[tagModule.create]');
          res.send("success");
      }
    });
  },

  update: function() {

  },

};

module.exports = tagModule;
