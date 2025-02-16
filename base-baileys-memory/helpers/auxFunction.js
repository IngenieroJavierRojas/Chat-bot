const path = require("path");
const Usuario = require("../models/usuario");
const { addKeyword, EVENTS } = require("@builderbot/bot");
const { HfInference } = require("@huggingface/inference");
const fs = require("fs");
const { ElevenLabsClient } = require("elevenlabs");
const { v4: uuid } = require("uuid");

require("dotenv").config();

function createFlowNoAutorized() {
  return addKeyword("2").addAnswer(
    "Te agradecemos por comunicarte con la Cámara de Comercio de Cartago. En caso de necesitar nuestro servicios no dudes en escribirnos. \n"
  );
}
function createFlowNotadeVoz() {
  return addKeyword(EVENTS.VOICE_NOTE).addAnswer(
    "Hola, soy Nexo. Estoy interpretando tu nota de voz para brindarte una respuesta y asesoria adecuada. \n",
    null,
    async (ctx, { provider }) => {
      // try {
      //   // await provider.sendAudio('573104081375@s.whatsapp.net', 'C:\\Users\\Javier Rojas\\Downloads\\prueba3.mp3')
      //   const outputDir = "C:\\Users\\Javier Rojas\\Documents\\ChatBot\\base-baileys-memory\\audio\\flat"; //Ruta donde se va a guardar el archivo de audio
      //   const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

      //   const env = await hf.textToSpeech({
      //     model: "facebook/mms-tts-spa", //Referencio el modulo para el idioma español y que pueda interpretar texto a audio
      //     inputs:
      //       "Hola, soy Nexo. \n Me alegra tenerte por acá. Te invito a que continúes usando nuestro chat escribiendo: \n hola", //Texto que se va a convertir en audio
      //   });

      //   // Referencio una ruta que registré previamente, y en su terminación agrego el modelo mp3 para ser guardado como archivo de audio
      //   const audioPath = `${outputDir}\\output.mp3`;

      //   //Sobre escribo el archivo audioPath con el contenido de env.arrayBuffer(), el cual lo pasa a un tipo audio/flat que es el que se necesita para enviarlo por whatsapp
      //   fs.writeFileSync(audioPath, Buffer.from(await env.arrayBuffer()));

      //   //En el sendAudio, se reciben 2 argumentos, uno es el numero de la persona el cual referenciamos con el ctx key, con el cual accedemos con referencia a whatsapp web de dicha persona.
      //   //el segundo argumento es el audio que debe ser si o si un archivo mp3 el cual es similar a lo manejado por notas de voz de whatsapp
      //   await provider.sendAudio(ctx.key.remoteJid, audioPath);
      // } catch (error) {
      //   console.log(error);
      // }
      console.log(ctx.key.remoteJid);
      await provider.sendAudio(
        "573214052795@s.whatsapp.net",
        "C:\\Users\\Javier Rojas\\Documents\\ChatBot\\menu.mp3"
      );
    }
  );
}
function createFlowNoConection() {
  return addKeyword(EVENTS.WELCOME).addAnswer([
    "*Upsss! Al parecer nos escribiste fuera de nuestro horario de atención.* \n",
    "Para poderte ayudarte, recuerda que estamos activos de *lunes a viernes, en jornada continua de 8:00 am a 4:00 pm.* \n",
    "¡Gracias por confiar en la Cámara de Comercio de Cartago! \n",
  ]);
}
function createMedia() {
  return addKeyword(EVENTS.MEDIA).addAnswer(
    "Lo siento, aún no estoy entrenado para recibir imágenes. Te agradecería si me envías un mensaje de texto. \n",
    null,
    async (ctx, { provider }) => {
      await provider.sendImage(
        ctx.key.remoteJid,
        "https://i.pinimg.com/originals/0d/a5/c1/0da5c191106369c03467060ffede009b.png"
      );
      /*
      Importante, para poder enviar imagenes a otro numero, utilizo el ctx.key.remoteJid, el cual es el numero de la persona que envio el mensaje seguido del @s.whatsapp.net
      */
    }
  );
}
function createFlowDocument() {
  return addKeyword(EVENTS.DOCUMENT).addAnswer(
    "Lo siento, no puedo leer documentos en este momento.",
    null,
    async (ctx, { provider }) => {
      await provider.sendMessage(
        "573214052795",
        "Esto es un ensayo",
        { sendSeen: true },
        { sendDelivery: true }
      ); //El metodo sendSeen y delivery, son para que el mensaje sea marcado como visto y entregado respectivamente

      await provider.saveFile(ctx, { path: ".." }); //El metodo saveFile, guarda el archivo en la ruta que se le indique, cuando se pone la ruta como ".." se guarda en la carpeta raiz del proyecto

      console.log(ctx);
    }
  );
}

async function validateTel(telefono) {
  const user = await Usuario.findOne({ telefono });
  if (user) {
    return user;
  }
  return false;
}

module.exports = {
  createFlowNoAutorized,
  createFlowNotadeVoz,
  createFlowNoConection,
  validateTel,
  createFlowDocument,
  createMedia,
};
