var child = require('child_process');
const { resolve } = require('path');

async function waitForChild() {

}

function addLine(lineStr, outputElement) {
  outputElement.pushLine(lineStr);
  outputElement.scrollTo(outputElement.getLines().length-1);
  outputElement.render();
}

async function spawnChild(action, outputElement) {

//  console.log("Action:  " + JSON.stringify(action));

  const command = action.command;
  const args = action.args;
  const options = {
        "cwd":  "/Users/franck.franck/MongoDB/Repos/realm-js",
        "shell":    true,
        "stdio":    "pipe"
  };

  // console.log("Command:  " + command);
  // console.log("args:  " + args);

  // let command = "npm";
  // let args = ["run", "build"];
  // let options = {
  //     "cwd":  "/Users/franck.franck/MongoDB/Repos/realm-js",
  //     "shell":    true,
  // };
  //     "stdio":    "pipe"

  addLine("{#000088-bg}{bold}" + action.name + "{/}", outputElement)

  let cmd = child.spawn(command, args, options);

  cmd.stdout.on('data', (data) => {
    const dataStr = data.toString("utf8");
 //   console.log("'" + JSON.stringify(dataStr) + "'");

    const dataLines = dataStr.split("\n");
//    console.log("Output lines: ");
    for (let line of dataLines) {
//       console.log(" > " + line);
       addLine(line, outputElement);
    }
//    console.log(outputElement.getScroll());
//    console.log(`Received chunk ${data}`);
  });

  return new Promise( (resolve, reject) => {
//     child.on('close', resolve)
    cmd.on('close', (code) => {
      // let hhh = cmd.stdout.read();
      // console.log(hhh);
//      console.log(`child process close all stdio with code ${code}`);
      if (code == 0) {
        addLine("{#000088-bg}{bold}Success (close): " + code + "{/}", outputElement);
        resolve(code);
      } else {
        addLine("{#000088-bg}{bold}Failed:  (close) " + code + "{/}", outputElement);
        reject(code);
      }
    });
    
//     cmd.on('exit', (code) => {
// //      console.log(`child process exited with code ${code}`);
//       if (code == 0) {
//         addLine("{#000088-bg}{bold}Success{/}", outputElement);
//         resolve(code);
//       } else {
//         addLine("{#000088-bg}{bold}Failed:  " + code + "{/}", outputElement);
//         outputElement.render();
//         reject(code);
//       }
//     });
  });
}

module.exports =  {
  spawnChild: spawnChild
};