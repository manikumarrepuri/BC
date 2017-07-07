var mongoose      = require('mongoose');
const logger      = require("opserve-common").logger;
var User          = mongoose.model('User');

  var userModule = {

  find: function(req, res, callback) {
    //Process based on condition passed
    // 1 : Use for login
    // 2 : fetch all the users
    // 3 : fetch By Name
    switch (req.query.query.conditions.whatToFetch) {
        case "1":
                User.findOne({ 'username': req.query.query.conditions.username}, function(err, user){
                    if(err){
                        logger.warn("Error while getting the user...::[userModule.find.case1]", +err);
                        return callback(err);
                    }
                    // No action required if an user exists, just send the user details as a response.
                    if (user) {
                        res.send(user);
                    } else {
                        // if there is no user, create the user "admin"
                        // Check the username is admin or not
                        if(req.query.query.conditions.username == "admin"){
                            var newUser = new User();
                            newUser.username = "admin";
                            newUser.password = "838d019062163e3c3e92a5d1bc3fc994de300ca9";
                            newUser.email = "admin@bluechip.co.uk";
                            // save the user
                            newUser.save(function(err) {
                                if (err){
                                    logger.warn("Error while creating the user...::[userModule.find.case1]", +err);
                                    return callback(err);
                                }
                                res.send(newUser);
                            });
                        }
                        else{
                            logger.info("User not found...::[userModule.find.case1]");
                            res.send(user);
                        }
                    }
                });
            break;
        case "2":
                User.find().lean().exec(function(err, users) {
                    if (err) return callback(err);
                    res.send(users);
                });
            break;
        case "3":
                //Send the user details for the given user name
                User.find({ 'username': req.query.query.conditions.username}).lean().exec(function(err, users) {
                    if (err) return callback(err);
                    res.send(users);
                });
            break;
        default:
        //Do nothing just send res.send(null)
            res.send(null)
            break;
    }

  },

  findById: function(req, res, callback) {
    var id = req.params.id;
    User.findById(id, function(err, user){
		if(err){
			return callback(err);
		}
		return callback(null, user);
	});
  },

  create: function(req, res, done) {
    // find a user in mongo with provided username
    User.findOne({ 'username' :  req.user.username }, function(err, user) {
        // In case of any error, return using the done method
        if (err){
            logger.warn("Error while creating the user...::[userModule.create]", +err);
            return done(err);
        }
        // already exists
        if (user) {
            logger.info('User already exists with username::[userModule.create]: '+username);
            return done(null, false);
        } else {
            // if there is no user, create the user
            var newUser = new User();

            // set the user's local credentials
            newUser.username = req.user.username;
            newUser.password = req.user.password;
            newUser.email = req.user.email;
            //newUser.role = req.body.role;

            // save the user
            newUser.save(function(err) {
                if (err){
                    logger.warn("Error while saving the user...::[userModule.create]", +err);
                    throw err;
                }
                logger.info('Registration succesful');
                return done(null, newUser);
            });
        }
    });
  },

  update: function(req, res) {

  },

};
// var isValidPassword = function(user, password){
//     return bCrypt.compareSync(password, user.password);
// };

module.exports = userModule;
