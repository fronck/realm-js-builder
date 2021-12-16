var blessed = require('blessed');
const fs = require("fs");
const path = require("path");
const { exit, config, nextTick } = require('process');

var screen = blessed.screen();
  
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
      hover: {
        bg: 'green'
      }
    }
});
  
projectsBox.key(["down", "up"], function(ch, key) {
//    console.log("Down pressed  " + key.name);
    let currIdx = projectsBox.selected;
    if (key.name == "down") {
        if (currIdx < projectsBox.items.length - 1) {
            projectsBox.select(currIdx + 1);
        }
    } else {
        if (currIdx > 0) {
            projectsBox.select(currIdx - 1);
        }

    }
} );

projectsBox.focus();
screen.render();


projectsBox.setItems(['no. 1', 'no.2', 'no.3']);
screen.append(projectsBox);
screen.render();