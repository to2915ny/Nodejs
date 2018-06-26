var url = "http://log.io"

function log(message){
  //Send an HTTP Request
  console.log(message);
}
module.exports.log = log;
module.exports.endPoint = url
