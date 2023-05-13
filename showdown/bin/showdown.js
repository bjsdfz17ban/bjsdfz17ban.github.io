#!/usr/bin/env node
var showdown,version,fs=require("fs"),path=require("path"),Command=require("commander").Command,program=new Command,path1=path.resolve(__dirname+"/../dist/showdown.js"),path2=path.resolve(__dirname+"/../../.build/showdown.js");function Messenger(o,t,e){"use strict";t=!!t||!!e,e=!!e,this._print="stdout"===(o=o||"stderr")?console.log:console.error,this.errorExit=function(o){e||(console.error("ERROR: "+o.message),console.error("Run 'showdown <command> -h' for help")),process.exit(1)},this.okExit=function(){e||(this._print("\n"),this._print("DONE!")),process.exit(0)},this.printMsg=function(o){t||e||!o||this._print(o)},this.printError=function(o){e||console.error(o)}}function showShowdownOptions(){"use strict";var o,t=showdown.getDefaultOptions(!1);for(o in console.log("\nshowdown makehtml config options:"),t)t.hasOwnProperty(o)&&console.log("  "+o+":","[default="+t[o].defaultValue+"]",t[o].describe);console.log('\n\nExample: showdown makehtml -c openLinksInNewWindow ghMentions ghMentionsLink="https://google.com"')}function parseShowdownOptions(o,t){"use strict";var e=t;if(o)for(var n=0;n<o.length;++n){var r=o[n],i=o[n],s=!0;/=/.test(r)&&(i=r.split("=")[0],s=r.split("=")[1]),e[i]=s}return e}function readFromStdIn(o){"use strict";o=o||"utf8";try{return fs.readFileSync(process.stdin.fd,o).toString()}catch(o){throw new Error("Could not read from stdin, reason: "+o.message)}}function readFromFile(t,o){"use strict";try{return fs.readFileSync(t,o)}catch(o){throw new Error("Could not read from file "+t+", reason: "+o.message)}}function writeToStdOut(o){"use strict";if(!process.stdout.write(o))throw new Error("Could not write to StdOut")}function writeToFile(o,t,e){"use strict";e=e?fs.appendFileSync:fs.writeFileSync;try{e(t,o)}catch(o){throw new Error("Could not write to file "+t+", readon: "+o.message)}}function makehtmlCommand(t,o){"use strict";if(t.configHelp)showShowdownOptions();else{var e,n,r,i=!!o.parent._optionValues.quiet,o=!!o.parent._optionValues.mute,s=t.input&&""!==t.input&&!0!==t.input?"file":"stdin",a=t.output&&""!==t.output&&!0!==t.output?"file":"stdout",d=new Messenger("file"==a?"stdout":"stderr",i,o),i=showdown.getDefaultOptions(!0);if(t.flavor){if(d.printMsg("Enabling flavor "+t.flavor+"..."),!(i=showdown.getFlavorOptions(t.flavor)))return void d.errorExit(new Error("Flavor "+t.flavor+" is not recognised"));d.printMsg("OK!")}for(n in t.config=parseShowdownOptions(t.config,i),t.config)t.config.hasOwnProperty(n)&&!0===t.config[n]&&d.printMsg("Enabling option "+n);d.printMsg("\nInitializing converter...");try{r=new showdown.Converter(t.config)}catch(o){return void d.errorExit(o)}if(d.printMsg("OK!"),t.extensions){d.printMsg("\nLoading extensions...");for(var p=0;p<t.extensions.length;++p)try{d.printMsg(t.extensions[p]);var u=require(t.extensions[p]);r.addExtension(u,t.extensions[p]),d.printMsg(t.extensions[p]+" loaded...")}catch(o){d.printError("ERROR: Could not load extension "+t.extensions[p]+". Reason:"),d.errorExit(o)}}if(d.printMsg("..."),d.printMsg("Reading data from "+s+"..."),"stdin"==s)try{e=readFromStdIn(t.encoding)}catch(o){return void d.errorExit(o)}else try{e=readFromFile(t.input,t.encoding)}catch(o){return void d.errorExit(o)}if(d.printMsg("Parsing markdown..."),o=r.makeHtml(e),d.printMsg("Writing data to "+a+"..."),"stdout"==a)try{writeToStdOut(o)}catch(o){return void d.errorExit(o)}else try{writeToFile(o,t.output,t.append)}catch(o){return void d.errorExit(o)}d.okExit()}}version=fs.existsSync(path1)?(showdown=require(path1),require(path.resolve(__dirname+"/../package.json")).version):fs.existsSync(path2)?(showdown=require(path2),require(path.resolve(__dirname+"/../../package.json")).version):(showdown=require("../../dist/showdown"),require("../../package.json")),program.name("showdown").description("CLI to Showdownjs markdown parser v"+version).version(version).usage("<command> [options]").option("-q, --quiet","Quiet mode. Only print errors").option("-m, --mute","Mute mode. Does not print anything"),program.command("makehtml").description("Converts markdown into html").addHelpText("after","\n\nExamples:").addHelpText("after","  showdown makehtml -i                     Reads from stdin and outputs to stdout").addHelpText("after","  showdown makehtml -i foo.md -o bar.html  Reads 'foo.md' and writes to 'bar.html'").addHelpText("after",'  showdown makehtml -i --flavor="github"   Parses stdin using GFM style').addHelpText("after","\nNote for windows users:").addHelpText("after","When reading from stdin, use option -u to set the proper encoding or run `chcp 65001` prior to calling showdown cli to set the command line to utf-8").option("-i, --input [file]","Input source. Usually a md file. If omitted or empty, reads from stdin. Windows users see note below.",!0).option("-o, --output [file]","Output target. Usually a html file. If omitted or empty, writes to stdout",!0).option("-u, --encoding <encoding>","Sets the input encoding","utf8").option("-y, --output-encoding <encoding>","Sets the output encoding","utf8").option("-a, --append","Append data to output instead of overwriting. Ignored if writing to stdout",!1).option("-e, --extensions <extensions...>","Load the specified extensions. Should be valid paths to node compatible extensions").option("-p, --flavor <flavor>","Run with a predetermined flavor of options. Default is vanilla","vanilla").option("-c, --config <config...>","Enables showdown makehtml parser config options. Overrides flavor").option("--config-help","Shows configuration options for showdown parser").action(makehtmlCommand),program.parse();