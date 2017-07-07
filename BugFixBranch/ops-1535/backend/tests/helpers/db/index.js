
"use strict";

class Query
{
  constructor(tableName)
  {
    this.query = "r.table(\"" + tableName + "\")";
  }

  run()
  {
    return this;
  }

  map(mapArray)
  {
    this.query += ".map({\n";
    var index, value, i = 0;
    for (index in mapArray) {
      i++;
      value = mapArray[index];
      if (value instanceof Row) {
        value = value.toString();
      }
      if (i == 1) {
        this.query += "  " + index + " : " + value;
      } else {
        this.query += ",\n  " + index + " : " + value;
      }

    }
    this.query += "\n});\n";
    return this;
  }

  outerJoin(joinedTable, joinFunction)
  {
    this.query += ".outerJoin(" + "\n" +
      "  " + joinedTable.toString() + ",\n" +
      "  " + joinFunction.toString() + "\n" +
      ")\n";

    return this;
  }

  zip()
  {
    this.query += ".zip()\n";
    return this;
  }

  eq(value)
  {

  }

  row(side)
  {
    return "r.row(" + side + ")";
  }

  filter(filterFunction)
  {
    this.query += ".filter(\n" +
      "  " + filterFunction.toString() + "\n" +
      ");\n";

    return this;
  }

  toString()
  {
    return this.query;
  }
}

class ConnectionMock
{
  table (tableName)
  {
    this.query = new Query(tableName);
    return this.query;
  }

  // row(fieldName)
  // {

  // }
}

module.exports = ConnectionMock;
