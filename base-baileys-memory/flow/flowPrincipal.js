const { EVENTS, addKeyword } = require("@builderbot/bot");
const { flowAngela } = require("../structure/AngelaChatConfig");
const { validateTel } = require("../helpers/auxFunction");


class flowInitials {
  constructor() {
    this.validacion = /^\d{6,10}$/;
    this.flowInitial
  }

  flowInitial() {
    return addKeyword(EVENTS.WELCOME)
      .addAction(async (ctx, { flowDynamic, blacklist, gotoFlow, state }) => {
        const dataFrom = { muted: true };
        if (dataFrom.muted) {
          blacklist.add("573214052795");
        }
        if (ctx.from) {
          const dataUser = await validateTel(ctx.from);
          if (dataUser) {
            await state.update({
              nombre: dataUser.nombre,
              cedula: dataUser.cedula,
              telefono: dataUser.telefono,
              status: true,
            });
            await flowDynamic(
              `Hola, nos alegra tenerte nuevamente por acá ${dataUser.nombre} \n\n *Recuerda que al continuar con nuestro chat estás aceptando nuestra politica de tratamiento de datos personales.* \n`
            );
            return gotoFlow(flowAngela);
          }
        }
      })
      .addAnswer(
        [
          "Para poder ayudarte mejor, necesitamos conocerte un poquito más. Por favor, compártenos la siguiente información: \n",

          "👉 Nombre completo \n",
          "👉 Cédula (sin puntos, por favor) \n",

          "Te daré un ejemplo de como debe ir el mensaje: \n *josesito perez* \n *2154565654*",
        ],
        {
          capture: true,
        },
        async (ctx, { flowDynamic, state, fallBack, gotoFlow }) => {
          const dataRecibida = ctx.body.split("\n");

          let bandera = true;
          let nombre = dataRecibida[0];
          let cedula = dataRecibida[1];
          if (bandera) {
            console.log(ctx);
            console.log(dataRecibida);

            await state.update({
              nombre,
              cedula,
              telefono: ctx.from,
              status: true,
            });
          }

          if (!this.validacion.test(cedula) || nombre.length < 3) {
            await flowDynamic(
              `El número de cédula ingresado y/o el nombre no es válido, por favor verifica e intenta de nuevo`
            );
            return fallBack();
          } else {
        
            await flowDynamic(`Encantada de conocerte *${nombre}*`);
            return gotoFlow();
            // return gotoFlow(createFlowData);
          }
        }
      );
  }
}

module.exports =  flowInitials