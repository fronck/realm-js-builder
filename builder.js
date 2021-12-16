var blessed = require('blessed');
const fs = require("fs");
const path = require("path");
const { exit, config, nextTick } = require('process');
const { outputBox } = require('./mainScreen');
const main = require("./mainScreen");
const exec = require("./exec");

  
main.screen.title = 'Realm-JS Unified Builder';

// Quit on Escape, q, or Control-C.
main.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});
  
function renderProjectInfo(projectNo) {
    let project = buildConfigs[projectNo];
    main.infoBox.setLabel("Project:  " + project.name);

    main.infoBox.setContent(project.description ? project.description : "(no description given)");

    if (!project.actions) {
        main.actionsList.clearItems();
        main.actionsList.setContent("(no actions given)");
    } else {
        main.actionsList.clearItems();
//        let actionList = [];
        for (let action of project.actions) {
            main.actionsList.addItem(action.name);
        }
//        main.actionsList.setContent(actionList.join("\n"));
    }

    if (!project.dependencies) {
        main.dependencyList.setContent("(no actions given)");
    } else {
        main.dependencyList.setContent("");
        let dependencyList = [];
        for (let dependency of project.dependencies) {
            dependencyList.push(dependency);
        }
        main.dependencyList.setContent(dependencyList.join("\n"));
    }

    main.screen.render();
}

main.projectsBox.key(["down", "up"], function(ch, key) {
//    console.log("Down pressed  " + key.name);
    let currIdx = main.projectsBox.selected;
    if (key.name == "down") {
        if (currIdx < main.projectsBox.items.length - 1) {
            main.projectsBox.select(currIdx + 1);
        }
    } else {
        if (currIdx > 0) {
            main.projectsBox.select(currIdx - 1);
        }
    }

    renderProjectInfo(main.projectsBox.selected);
} );

main.projectsBox.on('select', function(selected) {
    console.log("Selected:  " + JSON.stringify(selected));
    main.infoBox.content = "Selected:  " + JSON.stringify(buildConfigs[selected]);

    screen.render();
});

main.projectsBox.key(['tab'], function(ch, key) {
    //console.log("TAB!");
    main.actionsList.select(0);
    main.actionsList.focus();
    main.screen.render();
});
    


var buildConfigs = [];

// Append our box to the screen.

// Render the screen.
//screen.render();

async function bleh() {
//    const buildConfigs = getBuildConfigurations('../realm-js', {}, []);
    const buildConfigs = await getBuildConfigurations('.', {}, []);
} 

async function parseBuildConfig(configFile) {
    const rawData = fs.readFileSync(configFile, 'utf8'); //, (err, jsonString) => {
        // if (err) {
        //     console.log("File read failed:", err);
        //     return {name: "Failure!"};
        // }

//        console.log("Reading file:  " + configFile);
        let jsonData = JSON.parse(rawData);

        let projectsData = [];
        for (let project of jsonData.projects) {
            console.log("Found project: " + project.name);
            projectsData.push(project);
        }

        return projectsData;
//    });
}

async function getBuildConfigurations(dirPath, loadBox, buildConfigFiles) {
    buildConfigFiles = buildConfigFiles || [];

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
                    buildConfigFiles = buildConfigFiles.concat(await getBuildConfigurations(dirPath + "/" + file, buildConfigFiles));
                } else {
                    if (file == 'buildConfig.json') {
                        buildConfigFiles.push(path.join(__dirname, dirPath, "/", file));
                        let projectConfigs = await parseBuildConfig(path.join(__dirname, dirPath, "/", file));
                        
                        buildConfigs.splice(buildConfigs.length, 0, ...projectConfigs);
                    }
                }
//            });
        }
    } catch(error) {
        console.log('Error:  ' + error);
    }
    
    return buildConfigFiles
}

function updateLoadingStatus() {
    let numComfigs = buildConfigs.length;
    main.loadingBox.setText("hejhejkkkk " + numComfigs);
    main.screen.render();
    let waitForRender = setTimeout(() => {
        
    }, 100);
//    clearTimeout(waitForRender);
}

async function go() {

    let infoRefresher = setInterval(() => {
        updateLoadingStatus();
    }, 300);

    main.loadingBox.setIndex(100);
    main.loadingBox.load('Finding build configurations');

    main.screen.render();
    await bleh().then((res) => {
    
        console.log("I'm done");

        for (let project of buildConfigs) {
            main.projectsBox.addItem(project.name);
        }
        main.loadingBox.stop();
        main.projectsBox.focus();

        renderProjectInfo(main.projectsBox.selected);

        main.screen.render();
    });
    // clearTimeout(waitForRender);
    // clearInterval(infoRefresher);
}

async function startJob(jobInfo) {
    await exec.spawnChild(jobInfo, main.outputBox);
}


main.actionsList.on('select', async function(selected) {
//    console.log("selected: '" + main.projectsBox.selected + "'");
    let actions = buildConfigs[main.projectsBox.selected].actions;
//    console.log("Data:  " + JSON.stringify(actions[main.actionsList.selected].name));
//    console.log("Length:  " + actions.keys());
    outputBox.setLabel("Output  [" + actions[main.actionsList.selected].name  + "]")
//    console.log(main.outputBox);
    main.screen.render();
    await startJob(actions[main.actionsList.selected]);
});


go();
