import Twit from "twit";
import fs from "fs";
import * as config from "./config/config";
import * as extraFuncion from "./functionsExtras";

var T = new Twit(config.configTweet);

T.get("account/verify_credentials", {
  include_entities: false,
  skip_status: true,
  include_email: false,
});

var dictionaryTweet = fs
.readFileSync("./diccionarioTweet.txt", "utf8")
.split("\n");
var random = extraFuncion.getRandomArbitrary(0, dictionaryTweet.length - 1); //Obtenemos un valor Random para buscar en el array
var mensaje : any  = dictionaryTweet[random];
function tweetPost(mensaje: any) {
  var params = {
    status: mensaje,
  };
  T.post(
    "statuses/update",
    params,
    function (err: any, data: any, response: any) {
      if (err !== undefined) {
        console.log(err);
      } else {
        console.log("Tweet enviado: " + params.status);
      }
    }
  );
}

tweetPost(mensaje)

export { tweetPost };
