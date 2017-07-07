"use strict";

var appRootPath = require('app-root-path');
var chalk       = require('chalk');
var clear       = require('clear');
var figlet      = require('figlet');
var CLUI        = require('clui');
var inquirer    = require('inquirer');
var Preferences = require('preferences');
var Progress    = CLUI.Progress;
var _           = require('lodash');
var touch       = require('touch');
var fs          = require('fs');
var path        = require('path');
var glob        = require("glob");

class CLI {
  constructor() {
    //Initalise CLI
    clear();
    console.log(
      chalk.yellow(
        figlet.textSync('Itheon', { horizontalLayout: 'full' })
      ) + '\n\n',
      chalk.white('==========================================================') + '\n\n',
      chalk.white('* Welcome to the Itheon Boilerplate Generator') + '\n\n'
    );

    this.prefs = new Preferences('Itheon-Generator');

    this.changeRequired = false;
    this.frontendOptions = glob.sync("itheon-10-frontend*/", {cwd: appRootPath.path + '/../', absolute: true});
    this.backendOptions = glob.sync("itheon-10-backend*/", {cwd: appRootPath.path + '/../', absolute: true});

    if(this.frontendOptions.length > 0) {
      this.frontendOptions.push('Manually specify');
    }

    if(this.backendOptions.length  > 0) {
      this.backendOptions.push('Manually specify');
    }

    //If no preferences found create some.
    if(!this.prefs.frontend) {
      this.prefs.frontend = {};
      this.prefs.backend = {};

      this.prefs.frontend.location = 'Not specified';
      this.prefs.backend.location = 'Not specified';
    }

    if(this.prefs.frontend.location == 'Not specified') {
      this.changeRequired = true;
    }
  }

  processArgs(argv) {
    //Check if the user wants some help
    if(argv.help || argv.h) {
      this.showHelp();
    }

    //Check if the user wants to know the version
    if(argv.version || argv.v) {
      this.showVersion();
    }

    //Check if the user wants no logging
    this.log = true;
    if(argv.silent || argv.s) {
      this.log = false
    }

    //Check if the module name has been supplied
    if(argv.module || argv.m) {
      this.moduleName = (argv.module || argv.m);
    }

    //Check if we should allow directories to be set
    if(argv.change || argv.c) {
      this.changeRequired = (argv.change || argv.c);
    }
    else {
      if(!this.changeRequired) {
        console.log(
          chalk.italic(' * Frontend will be saved to: ' + this.prefs.frontend.location) + '\n',
          chalk.italic('* Backend will be saved to: ' + this.prefs.backend.location) + '\n\n',
          '== If you need to change these re-run with the -c || --change flag.\n\n'
        );
      }
    }
  }

  buildQuestions() {
    this.questions = [
        {
          name: 'frontend',
          type: 'list',
          message: 'Please choose the location of your Frontend API:',
          default: () => {
            if(this.prefs.frontend.location === 'Not specified') {
              return 'Manually specify';
            }

            return this.prefs.frontend.location;
          },
          choices: this.frontendOptions,
          when: (this.frontendOptions.length  > 0) && this.changeRequired,
          validate: function( value ) {
            try {
               fs.statSync(value);
               return true;
             } catch(e) {
               return 'Please specify a valid Frontend location';
             }
          }
        },
        {
          name: 'frontend',
          type: 'input',
          message: 'Please enter the location of your Frontend API:',
          default: this.prefs.frontend.location,
          when: function(args) {
            if(this.changeRequired && (!args.frontend || args.frontend == 'Manually specify')) {
              return true;
            }
          },
          validate: function( value ) {
            try {
               fs.statSync(value);
               return true;
             } catch(e) {
               return 'Please specify a valid Frontend location';
             }
          }
        },
        {
          name: 'backend',
          type: 'list',
          message: 'Please choose the location of your Backend API:',
          default: () => {
            if(this.prefs.backend.location === 'Not specified') {
              return 'Manually specify';
            }

            return this.prefs.backend.location;
          },
          choices: this.backendOptions,
          when: (this.backendOptions.length  > 0) && this.changeRequired,
          validate: function( value ) {
            try {
               fs.statSync(value);
               return true;
             } catch(e) {
               return 'Please specify a valid Backend location';
             }
          }
        },
        {
          name: 'backend',
          type: 'input',
          message: 'Please enter the location of your Backend API:',
          default: this.prefs.backend.location,
          when: function(args) {
            if(this.changeRequired && (!args.backend || args.backend == 'Manually specify')) {
              return true;
            }
          },
          validate: function( value ) {
            try {
               fs.statSync(value);
               return true;
             } catch(e) {
               return 'Please specify a valid Frontend location';
             }
          }
        },
        {
          name: 'moduleName',
          type: 'input',
          message: 'Please enter the module name:',
          when: !this.moduleName,
          validate: function( value ) {
            if (value.length) {
              return true;
            } else {
              return 'Please enter a module name';
            }
          }
        },
        {
          name: 'required',
          type: 'list',
          message: 'What are you looking to generate:',
          choices: [ 'Frontend API', 'Backend API', 'Angular', 'Entity', new inquirer.Separator(),'All of the Above', 'Or a New Package'],
          default: 'All of the Above'
        }
      ];
  }

  showVersion() {
    console.log('Itheon Generator\n'+ 'Version: ' + require(appRootPath + '/package.json').version);
    process.exit();
  }

  showHelp() {
    console.log(
      chalk.white('Usage: generate [options]') + '\n\n',
      chalk.white(chalk.bold('-h, --help') + '       Output usage information.') + '\n',
      chalk.white(chalk.bold('-v, --version') + '    Display the version number.') + '\n',
      chalk.white(chalk.bold('-g, --generate') + '   What you want to generate (default: a) ' + '\n' + '\t\t  options: [f, b, n, e, a, p].') + '\n',
      chalk.white(chalk.bold('-d, --directory') + '  The output directory for a new project.') + '\n',
      chalk.white(chalk.bold('-f, --frontend') + '   The output directory for the Frontend API.') + '\n',
      chalk.white(chalk.bold('-b, --backend') + '    The output directory for the Backend API.') + '\n',
      chalk.white(chalk.bold('-m, --module') + '     Module or project name to generate.') + '\n',
      chalk.white(chalk.bold('-c, --change') + '     Gives the option to change Backend and Frontend API paths.')
    );
    process.exit();
  }

  inquire() {
    this.buildQuestions();

    return inquirer.prompt(this.questions).then((response) => {

      //If the frontend changed save it
      if(response.frontend) {
        this.prefs.frontend.location = response.frontend;
      }
      response.frontend = this.prefs.frontend.location;

      //If the backend changed save it
      if(response.backend) {
        this.prefs.backend.location = response.backend;
      }
      response.backend = this.prefs.frontend.location;

      if(this.moduleName) {
        response.moduleName = this.moduleName;
      }
      return response;
    });
  }
}

module.exports = CLI;
