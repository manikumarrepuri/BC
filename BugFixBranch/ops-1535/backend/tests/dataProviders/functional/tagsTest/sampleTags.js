
"use strict";

let tag1 = {
  id: "136d944d-e93b-4550-afbd-1be675f4abdc",
  name: "Unix",
  description: "Unix os based devices",
  color: "#234454",
  status: 1,
  createdAt: "1984-08-10T22:53:58.000Z",
  updatedAt: "1985-09-05T13:26:27.000Z"
};

let tag2 = {
  id: "2ee2be19-0747-4279-97cc-05cef9122cf3",
  name: "Windows",
  description: "Windows os based devices",
  color: "#333444",
  status: 1,
  createdAt: "2016-03-29T09:27:58.000Z",
  updatedAt: "2016-05-17T09:46:27.000Z"
};

let tag3 = {
  id: "d7eea274-11ac-4a44-afb9-bdacc0f47cc5",
  name: "OS400",
  description: "OS400 devices",
  color: "#555666",
  status: 1,
  createdAt: "2016-08-11T10:43:58.000Z",
  updatedAt: "2016-09-02T13:31:27.000Z"
};

let tag4 = {
  id: "32a2a262-2188-41dc-a4a2-353e92315e69",
  name: "MySQL",
  description: "VMs with MySQL",
  color: "#999333",
  status: 1,
  createdAt: "2016-06-22T10:43:58.000Z",
  updatedAt: "2016-08-09T13:31:27.000Z"
};

let tag5 = {
  id: "ad88df2f-7aa6-4ee4-9e63-8b566298dd1a",
  name: "Redis",
  description: "VMs with Redis",
  color: "#000111",
  status: 1,
  createdAt: "2016-08-22T12:54:58.000Z",
  updatedAt: "2016-09-08T15:00:27.000Z"
};

module.exports = {
  "tag1": tag1,
  "tag2": tag2,
  "tag3": tag3,
  "tag4": tag4,
  "tag5": tag5,
  "default": [
    tag1,
    tag2,
    tag3,
    tag4,
    tag5
  ],
  "orderByNameAsc": [
    tag4,
    tag3,
    tag5,
    tag1,
    tag2
  ],
  "orderByDescriptionDesc": [
    tag2,
    tag5,
    tag4,
    tag1,
    tag3
  ],
  "limitedAndOrderedAsc": [
    tag4,
    tag3,
    tag5
  ],
  "limitedAndOrderedDesc": [
    tag2,
    tag1,
    tag5
  ],
  "partial1": [
    {
      id: tag3.id,
      name: tag3.name,
      description: tag3.description
    }
  ],
  "partial2": [
    {
      color: tag4.color,
      status: tag4.status,
      createdAt: tag4.createdAt,
      updatedAt: tag4.updatedAt
    }
  ],
  "aliased": [
    {
      tagName: tag3.name,
      tagColor: tag3.color
    }
  ],

  // ---------------------------------
  // ----- GETTING SINGLE RECORD -----
  // ---------------------------------

  singleById: tag4
};
