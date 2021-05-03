import * as config from "./config/config";
import * as extraFuncion from "./functionsExtras";
import Twit from "twit";
import fs from "fs";

//Instancio Twit
var T = new Twit(config.configTweet);
//Verificamos las credenciales
T.get("account/verify_credentials", {
  include_entities: false,
  skip_status: true,
  include_email: false,
});

var dictionaryWord = fs
  .readFileSync("./src/diccionarioReply.txt", "utf8")
  .split("\n");

// Seteamos el stream y escuchamos todo lo referido a @botChaqueno
var stream = T.stream("statuses/filter", { track: "@botChaqueno" });
// Ahora estamos observando todos los eventos relacionados al stream y en caso que pase algo ejecutamos la función tweetEvent que creamos nosotros
stream.on("tweet", tweetEvent);

//Función tweetEvent, recibo el tweet
function tweetEvent(tweet: any) {
  var txt = tweet.text; //Obtengo el texto del tweet
  var users = tweet.entities.user_mentions; //Arreglo de menciones
  var arrayTweet = txt.split(" "); //Lo ubico en un array para manejarlo mejor
  var arrayForMentions = extraFuncion.userMentionArray(
    tweet.entities.user_mentions
  ); //Paso las menciones del tweet a un nuevo array
  var arrayNewTwet = extraFuncion.extraerArrayNewTweet(
    arrayTweet,
    arrayForMentions
  ); //Array con tweet menos las menciones
  var users_replyc = extraFuncion.extraerUserReply(
    arrayTweet,
    arrayForMentions
  ); // Cadena con los usuarios a contestar
  var OnePalabraTweet = extraFuncion.eliminarDiacriticos(arrayNewTwet[0]); //Obtengo la primer palabra del tweet y elimino acentos (puede ser @botChaqueno)
  var TwoPalabraTweet = extraFuncion.eliminarDiacriticos(arrayNewTwet[1]); //Obtengo la segunda palabra del tweet y elimino acentos (puede ser @botChaqueno)
  var OnePalabraTweetLower = OnePalabraTweet.toUpperCase(); //Normalizo a mayuscula la primer palabra
  var TwoPalabraTweetLower = TwoPalabraTweet.toUpperCase(); //Normalizo a mayuscula la segunda palabra

  var rtUsers = tweet.retweeted_status; //Controlo si tiene RT para no responder a ellos
  var name = tweet.user.screen_name; // Quién envió el Tweet?
  var nameID = tweet.id_str; // Obtenemos el tweet id
  var random = extraFuncion.getRandomArbitrary(0, dictionaryWord.length - 1); //Obtenemos un valor Random para buscar en el array
  //Condicional para saber que responde de acuerdo a si hay menciones o no en el tweet
  if (users.length == null) {
    var replyHabla = "@" + name + " " + dictionaryWord[random]; // Tweet para respuesta a HABLA
    var replyAprender = "@" + name + " " + "Nazi, dejame lo anoto. Tkm!"; // Tweet para respuesta a APRENDE
    var replyNoEntiendo =
      "@" +
      name +
      " " +
      "Tan dificil es escribir bien? 'HABLA' al principio y hablo 'APRENDE' al principio y aprendo lo que sigue de eso. ENTENDES O TE EXPLICO CON MANZANAS?"; //Respuesta a No entiendo
  } else {
    var replyNoEntiendo =
      "@" +
      name +
      " " +
      users_replyc +
      " " +
      "Tan dificil es escribir bien? 'HABLA' al principio y hablo 'APRENDE' al principio y aprendo lo que sigue de eso. ENTENDES O TE EXPLICO CON MANZANAS?"; //Respuesta a No entiendo
    var replyAprender =
      "@" + name + " " + users_replyc + " " + "Nazi, dejame lo anoto. Tkm!"; // Tweet para respuesta a APRENDE
    var replyHabla =
      "@" + name + " " + users_replyc + " " + dictionaryWord[random]; // Tweet para respuesta a HABLA
  }
  //Concidional para saber que tiene que hacer HABLAR APRENDER o NO ENTIENDE
  if (OnePalabraTweetLower == "HABLA" || TwoPalabraTweetLower == "HABLA") {
    if (rtUsers == null) {
      //Parametros para la respuesta
      var params = {
        status: replyHabla, //Resouesta
        in_reply_to_status_id: nameID, //A quien la dirijo
      };
      T.post("favorites/create", { id: nameID }); //Like a mencion
      //Tweet de respuesta
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
  } else {
    if (
      OnePalabraTweetLower == "APRENDE" ||
      TwoPalabraTweetLower == "APRENDE"
    ) {
      var appendWord = extraFuncion.union(arrayNewTwet); //Toma el texto del tweet y limpia APRENDE y/o @botChaqueno (en teoria)
      //Escribo en diccionario.txt la frase a aprender
      fs.appendFileSync("./src/diccionarioReply.txt", appendWord + "\n");

      T.post("favorites/create", { id: nameID }); //Like a mencion
      //Parametros para respuesta
      var paramsAprender = {
        status: replyAprender, //Respuesta
        in_reply_to_status_id: nameID, //A quien la dirijo
      };
      //Tweet de respuesta a aprender
      T.post(
        "statuses/update",
        paramsAprender,
        function (err: any, data: any, response: any) {
          if (err !== undefined) {
            console.log(err);
          } else {
            console.log("Tweet enviado: " + paramsAprender.status);
          }
        }
      );
    } else {
      //Tweet ¡No entiendo!
      //Tweet de confirmacion
      T.post("favorites/create", { id: nameID }); //Like a mencion
      //Parametros para respuesta
      var paramsNoEntiendo = {
        status: replyNoEntiendo, //Respuesta
        in_reply_to_status_id: nameID, //A quien la dirijo
      };
      //Tweet de respuesta a no entiendo
      T.post(
        "statuses/update",
        paramsNoEntiendo,
        function (err: any, data: any, response: any) {
          if (err !== undefined) {
            console.log(err);
          } else {
            console.log("Tweet enviado: " + paramsNoEntiendo.status);
          }
        }
      );
    }
  }
}

export { tweetEvent };
