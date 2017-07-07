
"use strict";

class BaseGateway
{
  /**
   * Cutom contractor allows to inject instance of data provider
   *
   * @param object dataProvider Gateway's data provider(i.e. rethinkDbDataProvider)
   */
  constructor(dataProvider)
  {
    this.dataProvider = dataProvider;
  }

  /**
   * Setter for data provider instance
   *
   * @param object dataProvider Gateway's data provider(i.e. rethinkDbDataProvider)
   * @return self this Fluent interface
   */
  setDataProvider(dataProvider)
  {
    this.dataProvider = dataProvider;
    return this;
  }

  /**
   * Getter for data provider instance
   *
   * @return object dataProvider Gateway's data provider(i.e. rethinkDbDataProvider)
   */
  getDataProvider()
  {
    return this.dataProvider;
  }
}

module.exports = BaseGateway;
