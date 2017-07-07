"use strict";

var appRootPath = require('app-root-path');
var argv        = require('minimist')(process.argv.slice(2));
var CLI         = require(appRootPath + "\\lib\\cli\\cliService");
var cli         = new CLI();
var _           = require('itheon-utility').underscore;
var GeneratorService = require(appRootPath + "\\lib\\generator\\generatorService");

class Itheon {
  constructor() {

    //Process commandline arguments
    cli.processArgs(argv);
    //Ask user some tricky questions
    cli.inquire().then((response) => {
      let result;

      response.moduleName = _.humanize(response.moduleName);
      response.module = _.camelize(response.moduleName, true);
      response.Module = _.camelize(response.moduleName);
      response.baseDir = appRootPath.path + '/../';

      var generatorService = new GeneratorService(response);
      switch(response.required) {
        case 'Frontend API':
          result = generatorService.generateFrontend();
          break;
        case 'Backend API':
          result = generatorService.generateBackend();
          break;
        case 'Angular':
          result = generatorService.generateAngular();
          break;
        case 'Entity':
          result = generatorService.generateEntity();
          break;
        case 'All of the Above':
          result = generatorService.generateAll();
          response.required = 'Frontend, Backend, Angular and entity';
          break;
        case 'Or a New Package':
          var outputPath = response.baseDir + _.dasherize("itheon " + response.moduleName);
          if(!response.log) {
            console.log('Creating new package in to ' + outputPath);
          }

          result = generatorService.generateModule(outputPath);
          response.required = 'a new Package';
          break;
      }
      console.log('Successfully generated ' + response.required);
      return result;
      process.exit();
    });
  }
}

module.exports = Itheon;
