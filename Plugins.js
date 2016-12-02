var json = require("jsonfile");

class Plugins {

  constructor(modules) {
    this.modulesArr = [];
    for (module in modules)
      this.modulesArr.indexOf(modules[module].type) != 0 ? this.modulesArr.push(modules[module].type) : 1;
  }

  getCss() {
    this.css = [];
    let cssfiles;
    let cssfile;

    for (module in this.modulesArr)
      if (this.modulesArr[module] != "div" && this.modulesArr[module] != "layout")
        for (cssfile in cssfiles = json.readFileSync(`views/plugins/${this.modulesArr[module]}/plugin.json`)["dependancies"]["css"]) {
            this.css.indexOf(`./plugins/${this.modulesArr[module]}/${cssfiles[cssfile]}`) != 0 ? this.css.push(`./plugins/${this.modulesArr[module]}/${cssfiles[cssfile]}`) : 1;
        }


    return this.css;
  }

  getJs() {
    this.js = [];
    let jsfile;
    let jsfiles;

    for (module in this.modulesArr)
      if (this.modulesArr[module] != "div" && this.modulesArr[module] != "layout")
        for (jsfile in jsfiles = json.readFileSync(`views/plugins/${this.modulesArr[module]}/plugin.json`)["dependancies"]["js"])
          this.js.indexOf(`./plugins/${this.modulesArr[module]}/${jsfiles[jsfile]}`) != 0 ? this.js.push(`./plugins/${this.modulesArr[module]}/${jsfiles[jsfile]}`) : 1;

    return this.js;
  }
}

exports.Plugins = Plugins;
