const { addKeyword, EVENTS } = require("@builderbot/bot");
const { createFlowNoAutorized } = require("../helpers/auxFunction");
const Usuario = require("../models/usuario");
const { flowAngela } = require("../structure/AngelaChatConfig");

class FlowData {
  constructor() {
    this.flowData();
  }

  flowData() {
    return addKeyword(EVENTS.ACTION).addAnswer(
      [
        "En cumplimiento de la Ley 1581 de 2012 relacionada con el tratamiento de datos personales, ¿Autoriza a la Cámara de Comercio de Cartago a mantener la información suministrada en esta comunicación en nuestras bases de datos. \n",
        "1. Autorizo \n 2. No autorizo \n",
        "¡Para que ganemos tiempo juntos, escribe sólo el número de la opción que deseas realizar!",
      ],
      {
        capture: true,
      },
      async (ctx, { fallBack, gotoFlow, state }) => {
        
        console.log(ctx);

        if (ctx.body !== "1" && ctx.body !== "2") {
          await flowDynamic(
            "La opción ingresada no es válida, por favor verifica e intenta de nuevo"
          );
          return fallBack();
        }
        if (ctx.body === "1") {
          console.log(ctx.body);
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
  }
}
module.exports = new FlowData()