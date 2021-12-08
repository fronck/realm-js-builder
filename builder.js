var blessed = require('blessed');
const fs = require("fs");
const path = require("path");
const { exit, config, nextTick } = require('process');

var screen = blessed.screen({
    smartCSR: true
});
  
screen.title = 'Realm-JS Unified Builder';

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});
  
var projectsBox = blessed.list({
    top: 'top',
    left: 'left',
    width: '50%',
    height: '50%',
//    content: 'Hello {bold}world{/bold}!',
    label: "Projects",
    tags: true,
    scrollable: true,
    keys: true,
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      bg: 'magenta',
      border: {
        fg: '#f0f0f0'
      },
      hover: {
        bg: 'green'
      }
    }
});
  

var infoBox = blessed.box({
    label: "Information",
    top: '50%',
    left: 'left',
    width: '50%',
    height: '50%',
    border: {
        type: 'line'
    },
    style: {
        border: {
            fg: 'green',
            bg: 'black'
        }
    }
});

// var loadingBox = blessed.loading({
//     label: "Initializing...",
//     parent: screen,
//     left: 'center',
//     top: 'center',
//     width: '30%',
//     height: '10%',
//     visible: false,
//     border: {
//         type: 'line'
//     },
//     style: {
//         border: {
//             fg: 'green',
//             bg: 'black'
//         }
//     }
// })

var buildConfigs = [];

// Append our box to the screen.
screen.append(projectsBox);
screen.append(infoBox);
//screen.append(loadingBox);

// Render the screen.
screen.render();

async function bleh() {
//    loadingBox.setIndex(100);
    // loadingBox.load('Finding build configurations');
    // loadingBox.setFront();
    // await new Promise(resolve => setTimeout(resolve, 2000));
    // loadingBox.setText('Finding hemlock');
    const buildConfigs = await getBuildConfigurations('../realm-js', {}, []);
//    console.log(buildConfigs);
//    await new Promise(resolve => setTimeout(resolve, 2000));
//    loadingBox.stop();
    projectsBox.focus();
} 

async function parseBuildConfig(configFile) {
    const jsonData = fs.readFileSync(configFile, 'utf8'); //, (err, jsonString) => {
        // if (err) {
        //     console.log("File read failed:", err);
        //     return {name: "Failure!"};
        // }

        return JSON.parse(jsonData);
//    });
}

async function getBuildConfigurations(dirPath, loadBox, buildConfigurations) {
    buildConfigurations = buildConfigurations || [];

//    console.log("Searching dirPath " + dirPath + "   [" + buildConfigurations.length + "]");

//    loadingBox.setText(buildConfigurations.length + " found  [" + dirPath + "]");
    files = fs.readdirSync(dirPath);
  
    var currfile;

    try {
        for (const file of files) {
            currfile = file;
            //        const stat = fs.statSync(dirPath + "/" + file);
            const stat = fs.lstatSync(dirPath + "/" + file); // await fs.lstat(dirPath + "/" + file); //, async (err, stat) => {
                if (stat.isSymbolicLink()) {
                    // skip symlinks for now..
                    continue;
                }
                if (stat.isDirectory()) {
                    buildConfigurations = buildConfigurations.concat(await getBuildConfigurations(dirPath + "/" + file, buildConfigurations));
                } else {
                    if (file == 'package.json') {
                        buildConfigurations.push(path.join(__dirname, dirPath, "/", file));
                        let config2 = await parseBuildConfig(path.join(__dirname, dirPath, "/", file));
                        
                        buildConfigs.push(config2);
                        //            projectsBox.addItem(path.join(__dirname, dirPath, "/", file));
                        if (config2.name) {
                            setTimeout(() => {
                            projectsBox.addItem(config2.name);
                            // loadingBox.setText('Found ') + buildConfigurations.length;
                            // loadingBox.render();
                            }, 100);
                        }
                    }
                }
//            });
        }
    } catch(error) {
        console.log('err');
    }
    
    return buildConfigurations
}

async function go() {
    setTimeout(() => {
        bleh();
//        loadingBox.stop();
    }, 3000);
}

go();
