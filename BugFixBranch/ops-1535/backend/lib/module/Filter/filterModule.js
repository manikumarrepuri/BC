"use strict";


const mongoose      = require('mongoose');
const async         = require('async');
const lodash        = require('lodash');
const common        = require("opserve-common");
const logger        = common.logger;
const mongoEscape   = common.utilities.mongoEscape;
const Filter        = mongoose.model('Filter');

class FilterModule {

    find(req, res, callback) {
        logger.silly("Find filter(s)::[filterModule.find]");
        var query = [
            {
                userName: req.query.query.conditions.userName
            },
            {
                isShared: req.query.query.conditions.isShared
            }];
        Filter.find({ $or: query }).lean().exec(function (err, result) {
            var filterResult = { filters: [] };
            //Error
            if (err) {
                return res.status(500).send({ error: err });
            }
            //Success
            filterResult.filters = result;
            res.send(mongoEscape.unescapeInvalidMongoCharacters(filterResult));
        });
    }

    findById(req, res, callback) {
        logger.silly("Find filter by Id::[filterModule.findById]");
    }

    create(req, res) {
        logger.silly("Saving filter(s)::[filterModule.create]");
        //created and updated dates
        if (!req.body.createdAt) {
            req.body.createdAt = Date.now();
        }
        if (!req.body.updatedAt) {
            req.body.updatedAt = Date.now();
        }
        if (lodash.isUndefined(req.body._id)) {
            req.body._id = new mongoose.Types.ObjectId();
        }
        // Replace invalid chars which mongo doesnt allow with valid chars
        var json = mongoEscape.escapeInvalidMongoCharacters(req.body);
        Filter.findOneAndUpdate(
            { "_id": json._id }, // query
            json, // replacement
            { new: true, upsert: true }, // options
            function (err, result) {
                if (err) {
                    logger.warn("Error while saving filters::[filterModule.create]", +err);
                    res.status(500).send({ error: err });
                } else {
                    logger.info("Filter is successfully saved::[filterModule.create]");
                    res.send(mongoEscape.unescapeInvalidMongoCharacters(result._doc));
                }
            });
    }

    update(req, res) {
        logger.silly("UNIMPLEMENTED::[filterModule.update]");
    }

    delete(req, res) {
        logger.silly("UNIMPLEMENTED::[filterModule.delete]");
    }

};

module.exports = new FilterModule();
