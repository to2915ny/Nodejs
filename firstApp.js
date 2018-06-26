
function sayHello(name){
  console.log("Hello "+ name);
}

//sayHello("Kevin");

//for module


/*var record = require("./logger");
record.log("This is the module")
*/

//for path

const line = require("path");

var file = line.parse(__filename);

console.log(file);
