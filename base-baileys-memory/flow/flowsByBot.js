const { addKeyword, EVENTS } = require("@builderbot/bot");
const Usuario = require("../models/usuario");
const { flowAngela } = require("../structure/AngelaChatConfig");
const {
  createFlowNoAutorized,
  validateTel,
} = require("../helpers/auxFunction");
require("dotenv").config();

let nombre = null;
let cedula = null;
const validacion = /^\d{6,10}$/;

function createFlowPrincipal() {
  return addKeyword(EVENTS.WELCOME)
    .addAction(
      async (ctx, { flowDynamic, blacklist, gotoFlow, state, provider }) => {
        //Primeramente, creamos un objeto llamado dataFrom, el cual contiene un atributo llamado muted, el cual se inicializa en true
        const dataFrom = { muted: true };
        if (dataFrom.muted) {
          /*
        Cuando el atributo dataFrom.muted es true, se añade el numero de telefono a la lista negra, para que el bot se apague de esa manera 
        */
        }
        //La siguiente es una validad cuando la persona recien escribe, detectamos si hay un cuerpo de mensaje

        /*
        despues de haber ingresado, creamos una constante la cual ejecutará una funcion que valida el numero de telefono, si éste ya se encuentra registrado dentro de la base de datos
      */
        if (ctx.from) {
          const dataUser = await validateTel(ctx.from);
          /**
           * Cuando confirmamos que el dataUser es true, es decir, que el numero si se encuentra dentro de la DB, ejecutamos una actualización del state que pasaremos a Nexo
           * Dentro del cual viene el nombre, la cedula , telefono y el status en true en cuanto si la persona está interactuando con el bot en este momento
           *
           */
          if (dataUser) {
            await state.update({
              nombre: dataUser.nombre,
              cedula: dataUser.cedula,
              telefono: dataUser.telefono,
              status: true,
            });
            await flowDynamic(
              `Hola, nos alegra tenerte nuevamente por acá ${dataUser.nombre} \n\n *Recuerda que al continuar con nuestro chat estás aceptando nuestra politica de tratamiento de datos personales.* \n\n  ¿En qué puedo ayudarte hoy?`
            );
            // await provider.sendAudio(
            //   ctx.key.remoteJid,
            //   "C:\\Users\\Javier Rojas\\Documents\\ChatBot\\menu.mp3"
            // );

            return gotoFlow(flowAngela);
          }
          /**
           * En caso de no estar registrado el número, el chat pasa al siguiente paso el cual es solicitar los datos a la persona para el registro dentro de la misma DB
           */
        }
      }
    )
    .addAnswer(
      [
        "Para poder ayudarte mejor, necesitamos conocerte un poquito más. Por favor, compártenos la siguiente información: \n",

        "👉 Nombre completo \n",
        "👉 Cédula (sin puntos, por favor) \n",

        "Te daré un ejemplo de como debe ir el mensaje: \n *Maria Herrera* \n *2154565654*",
      ],
      {
        capture: true,
      },
      async (ctx, { flowDynamic, state, fallBack, gotoFlow }) => {
        const dataRecibida = ctx.body.split("\n");

        nombre = dataRecibida[0];
        cedula = dataRecibida[1];

        await state.update({
          nombre: nombre,
          cedula: cedula,
          telefono: ctx.from,
          status: true,
        });

        if (!validacion.test(cedula) || nombre.length < 3) {
          await flowDynamic(
            `El número de cédula ingresado y/o el nombre no es válido, por favor verifica e intenta de nuevo`
          );
          return fallBack();
        } else {
          await flowDynamic(`Encantado de conocerte *${nombre}*`);
          return gotoFlow(createFlowData);
        }
      }
    );
}

const createFlowData = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "En cumplimiento de la Ley 1581 de 2012 relacionada con el tratamiento de datos personales, ¿Autoriza a la Cámara de Comercio de Cartago a mantener la información suministrada en esta comunicación en nuestras bases de datos. \n",
    "1. Autorizo \n 2. No autorizo \n",
    "¡Para que ganemos tiempo juntos, escribe sólo el número de la opción que deseas realizar!",
  ],
  { capture: true },
  async (ctx, { fallBack, gotoFlow, state, provider, flowDynamic }) => {
    if (!ctx.body === "1" || !ctx.body === "2") {
      return fallBack();
    }

    if (ctx.body === "1") {
      const nombre = state.get("nombre");
      const cedula = state.get("cedula");
      const telefono = state.get("telefono");
      const estado = state.get("state");
      try {
        const user = await new Usuario({
          nombre,
          cedula,
          telefono,
          estado,
        }).save();

        console.log(user);
      } catch (error) {
        console.error("Error al crear el usuario:", error);
      }
      await flowDynamic(
        "Gracias por autorizar el tratamiento de tus datos personales. Dime ¿En qué te puedo ayudar hoy? \n"
      );  
      // await provider.sendAudio(ctx.key.remoteJid, 'C:\\Users\\Javier Rojas\\Documents\\ChatBot\\menu.mp3')


      return gotoFlow(flowAngela);
    } else if (ctx.body === "2") {
      return createFlowNoAutorized();
    } else {
      await flowDynamic(
        "La opción ingresada no es válida, por favor verifica e intenta de nuevo"
      );
      return fallBack();
    }
  }
);

module.exports = {
  createFlowPrincipal,
  createFlowData,
};
