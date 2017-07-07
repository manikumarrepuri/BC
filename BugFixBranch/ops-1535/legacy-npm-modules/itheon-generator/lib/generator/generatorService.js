"use strict";

var appRootPath   = require('app-root-path');
var fs            = require('fs');
var path          = require('path');
var chalk         = require('chalk');
var _             = require('itheon-utility').underscore;
var bluebird      = require('bluebird');
var recursive     = require('recursive-readdir');
var Handlebars    = require("handlebars");

class Generator {

  constructor(options) {
    this.options = options;
    this.templatePath = path.join(appRootPath.path, 'lib', 'templates');
  }

  generateAll() {
    return bluebird.all([
      new Promise((resolve, reject) => {
        return this.generateAngular();
      }),
      new Promise((resolve, reject) => {
        return this.generateEntity();
      }),
      new Promise((resolve, reject) => {
        return this.generateBackend();
      }),
      new Promise((resolve, reject) => {
        return this.generateFrontend();
      })
    ]).then(function(result) {
      console.log(result);
    }).catch((e) => {
      console.log(e);
    });
  }

  generateAngular() {
    var outputPath = path.join(this.options.frontend, "public", "js");
    if(!this.options.log) {
      console.log('Generating Angular files to ' + outputPath);
    }

    return this.parseTemplates('angular').then((templates) => {
      for(var filename in templates) {
        let currentContent, newController, newControllers, controllers, routeStart, routesStart, routesEnd, routesSection, newRoutesSection, routes, newRoute, spacing;
        let firstFile = true;
        let newFile = outputPath + filename.replace(path.join(this.templatePath, 'angular'), '');
        let file = filename.replace(/^.*[\\\/]/, '');

        switch(file) {
          case 'app.js':
            currentContent = fs.readFileSync(newFile, 'utf8');
            newController = templates[filename].replace('\n', '');

            //Check if the controller is already in the list
            newControllers = currentContent.match(/(\/\/)?['"](.*?)Controller['"],/gm);
            if(newControllers.indexOf(newController) != -1) {
              //If so then skip this.
              continue;
            }

            //If not then push the new controller to the array and sort it
            newControllers.push(newController);
            newControllers.sort();

            //Grab the current controller list.
            controllers = currentContent.match(/\s*?(\/\/)?['"](.*?)Controller['"],[\r\n]*/gm);
            //Grab the padding
            spacing = "\n" + controllers[1].match(/^\s*/);

            //Add extra spacing
            newControllers[0] = "\n" + spacing + newControllers[0];
            newControllers[newControllers.length-1] += "\n\n";

            //Update the file contents and save
            this.writeFile(newFile, currentContent.replace(controllers.join(''), newControllers.join(spacing)));
            break;
          case 'appRoutes.js':
            currentContent = fs.readFileSync(newFile, 'utf8');

            //Grab the routes portion of the file
            routesStart = currentContent.indexOf("//-- Start Custom Angular Routes --//");
            routesEnd = currentContent.indexOf("//-- End Custom Angular Routes --//");
            routesSection = currentContent.substr(routesStart, routesEnd);
            newRoutesSection = '';

            //Workout where we should be inserting it and sort them
            spacing = routesSection.match(/(\s*)\.when/)[1];
            routes = routesSection.match(/\.when\(['"](.*?)['"],/g);
            newRoute = templates[filename].match(/\.when\(['"](.*?)['"],/g)[0];

            if(routes.indexOf(newRoute) != -1) {
              //If so then skip this.
              continue;
            }

            routes.push(newRoute);
            routes.sort();

            //Rebuild the routes
            for(var route in routes) {
              routeStart = routesSection.indexOf(routes[route]);
              if(routeStart != -1) {
                newRoutesSection += spacing + routesSection.substr(routeStart, routesSection.indexOf('})', routeStart)-(routeStart-2)) + "\n";
                continue;
              }

              newRoutesSection += spacing + templates[filename].replace(/\n/g, spacing);
            }

            //Add the otherwise bit to the bottom
            routeStart = currentContent.indexOf('.otherwise({');
            spacing = routes[0].match(/\s*/g);
            newRoutesSection += spacing[0] + currentContent.substr(routeStart, currentContent.indexOf('})', routeStart)-(routeStart-2)) + '\n';
            newRoutesSection = "//-- Start Custom Angular Routes --//" + newRoutesSection + "\n//-- End Custom Angular Routes --//\n\n"

            this.writeFile(newFile, currentContent.replace(routesSection, newRoutesSection));
            break;
          case 'index.html':
            var changed=false;
            var newContent = templates[filename];
            newFile = newFile.replace(path.sep + "js" + path.sep, path.sep);
            var content = fs.readFileSync(newFile, 'utf8');

            //Grab all the pipelines from the file
            var pipelines = newContent.match(/<!--(.*?)\/\/-->\s*/g);
            routesStart = newContent.indexOf(pipeline);

            //Loop through and grab the new stuff and place it in the file
            for(var pipeline in pipelines) {
              let start = newContent.indexOf(pipelines[pipeline])+pipelines[pipeline].length;
              let output = newContent.substr(start, newContent.indexOf("\n", start)-start);

              if(content.indexOf(output) != -1) {
                //If so then skip this.
                continue;
              }

              let replace = content.indexOf(pipelines[pipeline])+pipelines[pipeline].length;
              content = [content.slice(0, replace), output, content.slice(replace)].join('');
              changed=true;
            }

            if(changed) {
              this.writeFile(newFile, content);
            }
            break;
          default:
            //Components go in a sub-directory
            let checkPath = path.sep + "components" + path.sep;
            if(newFile.indexOf(checkPath) != -1) {
              newFile = newFile.replace(checkPath, checkPath + this.options.module + path.sep);
            }

            if(firstFile) {
              firstFile = false;
              //If the folder exists already stop here
              if (!fs.existsSync(path.dirname(newFile))){
                return;
              }
            }

            this.writeFile(newFile, templates[filename]);
            break;
        }
      }
    });
  }

  generateModule(dir) {
    return this.parseTemplates('module').then((templates) => {
      for(var filename in templates) {
        let newFile = path.join(dir, 'lib', 'module', this.options.Module) + filename.replace(path.join(this.templatePath, 'module'), '');

        let checkPath = path.join("gateway", "module");
        if(newFile.indexOf(checkPath) != -1) {
          newFile = newFile.replace(checkPath, path.join("gateway", this.options.Module));
        }

        this.writeFile(newFile, templates[filename]);
      }
    });
  }

  generateRoutes(type) {
    var content = this.parseTemplate(this.templatePath + path.sep + 'routes' + type + '.js');
    let outputPath = path.join(this.options[type.toLowerCase()], 'app') + path.sep;
    let newFile = outputPath + "routes.js";
    var currentContent = fs.readFileSync(outputPath + 'routes.js', 'utf8');

    let start = currentContent.indexOf('// ---------------------------------- API URLS ----------------------------------')+166;
    content = [currentContent.slice(0, start), "\n\n" + content, currentContent.slice(start)].join('');
    this.writeFile(newFile, content);
  }

  generateBackend() {
    if(!this.options.log) {
      console.log('Generating Backend files to ' + this.options.backend);
    }

    this.generateModule(this.options.backend);
    this.generateRoutes('Backend');
  }

  generateEntity() {
    var outputPath = path.join(this.options.baseDir, _.dasherize('itheon module ' + this.options.module + ' entity'));
    if(!this.options.log) {
      console.log('Generating Entity into ' + outputPath);
    }

    this.parseTemplates('entity').then((templates) => {
      for(var filename in templates) {
        let newFile = outputPath + filename.replace(path.join(this.templatePath, 'entity'), '');

        let checkPath = path.sep + "module";
        if(newFile.indexOf(checkPath) != -1) {
          newFile = newFile.replace(checkPath, path.sep + this.options.module);
        }

        this.writeFile(newFile, templates[filename]);
      }
    });
  }

  generateFrontend() {
    if(!this.options.log) {
      console.log('Generating Frontend files to ' + this.options.frontend);
    }

    return bluebird.all([
      new Promise((resolve, reject) => {
        return this.generateModule(this.options.frontend)
      }),
      new Promise((resolve, reject) => {
        return this.generateRoutes('Frontend')
      })
    ]).then(function(result) {
      console.log(result);
    }).catch((e) => {
      console.log(e);
    });
  }

  parseTemplate(filename) {
    let template = Handlebars.compile(fs.readFileSync(filename, "utf8"));
    return template(this.options);
  }

  parseTemplates(dir) {
    return new Promise((resolve, reject) => {
      recursive(path.join(this.templatePath, dir), (err, files) => {
        let templates = [];
        files.forEach((filename) => {
          templates[filename] = this.parseTemplate(filename);
        });

        resolve(templates);
      });
    });
  }

  writeFile(filename, content) {
    try {
      if (!fs.existsSync(path.dirname(filename))){
        var mkdirp = require('mkdirp');

        mkdirp(path.dirname(filename), (err) => {
          if (err) {
            console.error(err);
            return false;
          }
          fs.writeFileSync(filename, content, 'utf8');
        });
        return true;
      }

      fs.writeFileSync(filename, content, 'utf8');
      return true;
    }
    catch(e) {
      console.log('error', e);
      return false;
    }
  }
}

module.exports = Generator;
