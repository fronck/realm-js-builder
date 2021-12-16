var blessed = require('blessed');

var screen = blessed.screen();

var projectsBox = blessed.list({
    top: 'top',
    left: 'left',
    width: '30%',
    height: '50%',
//    content: 'Hello {bold}world{/bold}!',
    label: "Projects",
    tags: true,
    scrollable: true,
//    keys: true,
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      bg: 'magenta',
      border: {
        fg: '#f0f0f0'
      },
      focus: {
        border: {
            fg: 'white',
        type: 'bg',
            ch: '*',
            bold: true,
            underline: true,
            shadow: true
        }
      }
    }
});

var infoBox = blessed.box({
    label: "Information",
    top: 'top',
    left: '30%',
    width: '70%',
    height: '20%',
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

var buildStepsBox = blessed.list({
    label: "Build Steps",
    top: '20%',
    left: '30%',
    width: '70%',
    height: '20%',
    interactive: true,
    keys: true,
    scrollable: true,
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        border: {
            fg: 'green',
            bg: 'black'
        },
        focus: {
            border: {
                fg: 'red'
            }
        },
        selected: {
            bg: 'red'
        }
    }
});

var depsBox = blessed.box({
    label: "Dependencies",
    top: '40%',
    left: '30%',
    width: '70%',
    height: '20%',
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

var outputBox = blessed.text({
    label: "Output",
    top: '60%',
    left: '0%',
    width: '100%',
    height: '20%',
    scrollable: true,
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        border: {
            fg: 'yellow',
            bg: 'black'
        }
    }
});


var loadingBox = blessed.loading({
    label: "Initializing...",
//    parent: screen,
    left: 'center',
    top: 'center',
    width: '30%',
    height: '10%',
    visible: false,
    border: {
        type: 'line'
    },
    style: {
        border: {
            fg: 'green',
            bg: 'black'
        }
    }
})

screen.append(projectsBox);
screen.append(infoBox);
screen.append(buildStepsBox);
screen.append(depsBox);
screen.append(outputBox);
screen.append(loadingBox);

module.exports = {
    screen: screen, 
    projectsBox: projectsBox, 
    infoBox: infoBox, 
    loadingBox: loadingBox,
    outputBox: outputBox,
    dependencyList: depsBox,
    actionsList: buildStepsBox
};
