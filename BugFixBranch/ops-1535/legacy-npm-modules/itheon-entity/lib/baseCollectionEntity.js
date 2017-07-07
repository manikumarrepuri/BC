
"use strict";

var appRootPath       = require("app-root-path");
var EntityError       = require("./entityError");
var BaseEntity        = require("./baseEntity");
var _                 = require("itheon-utility").underscore;
var logger            = require("itheon-logger");

/**
 * BaseCollectionEntity is a container for multiple entities that encapsulates all
 * collection related activities like counting etc.
 */
class BaseCollectionEntity
{
  /**
   * Constructor creates an array of entities used.
   */
  constructor(entities, collectionEntityClass)
  {
    //Make sure that the constructor is extended
    if (this.constructor === BaseCollectionEntity) {
      throw new EntityError(
        "BaseCollectionEntity used incorrectly. You need to extend default constructor!"
      );
    }

    var collectionClassName = this.constructor.name;

    this.collectionEntity = collectionEntityClass;
    if (!this.collectionEntity) {
      //Set entity to the req
      this.collectionEntity = require(
        "itheon-module-" +
        _.dasherize(collectionClassName.replace("CollectionEntity", "")).toLowerCase() +
        "-entity"
        )[collectionClassName.replace("Collection", "")];
    }

    this.strict = true;

    entities = entities ? entities : [];
    this.inflate(entities);
  }

  inflate(entities)
  {
    //Check the data provided is what we expect.
    if (!_.isArray(entities) && !_.isObject(entities)) {
      throw new EntityError(
        "BaseCollectionEntity used incorrectly. You need to pass an array of entities",
        {entities: entities}
      );
    }

    //if entities are an object we need to convert to an array.
    if(_.isObject(entities) && !_.isArray(entities)) {
      entities = _.values(entities);
    }

    //Set defaults
    this.entities = {};
    this.properties = {};
    this.properties.totalCount = 0;

    //Process entities
    var that = this;
    entities.forEach(function(entity) {
      that.addEntity(entity);
    });

    return this;
  }

  getBasePath()
  {
    if (typeof basePath == "undefined") {
      this.basePath = appRootPath;
    }
    return this.basePath;
  }

  static setBasePath(basePath)
  {
   this.basePath = basePath;
  }

  /**
   * Method tells you if the nested entities will allow any number of fields
   *
   * @return boolean
   */
  getAllowAnyField()
  {
    return !this.strict;
  }

  /**
   * Method updates whether or not the nested enities will allow any number of fields
   *
   * @param boolean allow set whether to allow anything
   * @return self Fluent interface
   */
  setAllowAnyField(allow)
  {
    this.strict = !allow;
    return this;
  }

  /**
   * Method adds entity to collection
   *
   * @param BaseEntity entity Entity to be added to collection
   * @return self this Collection entity - fluent interface
   */
  addEntity(entity)
  {
    //If it's not already an entity make it so!
    if (!(entity instanceof BaseEntity) && !_.isObject(entity)) {
      throw new EntityError(
        "BaseCollectionEntity - addEntity used incorrectly. You need to pass an entity or object"
      );
    }

    if (!(entity instanceof BaseEntity)) {
      var entityData = entity;
      var CollectionEntity = this.collectionEntity;
      entity = new CollectionEntity();
      entity.setAllowAnyField(this.getAllowAnyField());
      entity.inflate(entityData);
    }

    if (!entity.id) {
      entity.id = this.getTotalCount() + 1;
    }

    this.entities[entity.id] = entity;

    //Increase the Total Entity Count
    this.properties.totalCount++;
    return this;
  }

  updateEntity(entity)
  {
    if (!entity.id || !this.entities[entity.id]) {
      throw new EntityError(
        "BaseCollectionEntity - updateEntity. Entity not found."
      );
    }

    //If it's not already an entity make it so!
    if (!(entity instanceof BaseEntity)) {
      var CollectionEntity = this.collectionEntity;
      var newEntity = new CollectionEntity();
      newEntity.setAllowAnyField(this.getAllowAnyField());
      newEntity.inflate(entity);
    }

    this.entities[entity.id] = newEntity;
    return this;
  }

  deleteEntity(id)
  {
    if (!id || !this.entities[id]) {
      throw new EntityError(
        "BaseCollectionEntity - deleteEntity. Entity not found."
      );
    }

    delete this.entities[id];
    this.properties.totalCount--;
    return this;
  }

  getTotalCount()
  {
    return this.properties.totalCount;
  }

  setTotalCount(totalCount)
  {
    this.properties.totalCount = totalCount;
    return this;
  }

  export()
  {
    var exportData = {};
    var that = this;

    Object.keys(this.entities).forEach(function(key) {
      exportData[key] = that.entities[key].export();
    });

    return exportData;
  }
}

module.exports = BaseCollectionEntity;
