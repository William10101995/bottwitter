//Extraigo usuarios a los cual contestar
function extraerUserReply(arrayTweett: any, arrayMen: any) {
  var users_reply = "";
  arrayTweett.forEach(function distribucion(index: any, item: any) {
    if (arrayMen.includes(index)) {
      if (item == 0) {
        users_reply = index;
      } else {
        users_reply = users_reply + " " + index;
      }
    }
  });
  return users_reply;
}
//Conformo un nuevo array con las palabras del tweet menos las menciones que hace referencia el hilo
function extraerArrayNewTweet(arrayTweett: any, arrayMen: any) {
  var arrayNewTweet: any = [];
  arrayTweett.forEach(function distribucion(index: any, item: any) {
    if (!arrayMen.includes(index)) {
      arrayNewTweet.push(index);
    }
  });
  return arrayNewTweet;
}
//Paso todas las menciones a un arreglo para luego comparar
function userMentionArray(tweetEntitiesUser_mentions: any) {
  var mention_user: any = [];
  var user_mentions = "";
  var user_name = "";
  tweetEntitiesUser_mentions.forEach(function addMention(
    index: any,
    item: any
  ) {
    if ("@" + index.screen_name != "@botChaqueno") {
      user_name = index.screen_name;
      user_mentions = "@" + user_name;
      mention_user.push(user_mentions);
    }
  });
  return mention_user;
}
//Funcion para obtener valor Random
function getRandomArbitrary(min: any, max: any) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
//Eliminar acentos
function eliminarDiacriticos(texto: any) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

//Cadena a agregar
function union(tweetText: any) {
  var tweetAppend = "";
  tweetText.forEach(function encadenar(index: any, item: any) {
    var indexNormal = eliminarDiacriticos(index).toUpperCase();
    if ((indexNormal == "APRENDE") == (index == "@botChaqueno")) {
      tweetAppend = tweetAppend + " " + index;
    }
  });
  return tweetAppend.trim();
}

export {
  extraerUserReply,
  extraerArrayNewTweet,
  userMentionArray,
  getRandomArbitrary,
  union,
  eliminarDiacriticos,
};
