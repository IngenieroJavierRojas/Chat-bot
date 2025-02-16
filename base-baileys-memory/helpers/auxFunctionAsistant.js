const path = require("path");
const fs = require("fs");
const PathFlow = path.join(__dirname, "../chat", "BasesCamara.txt");
const propmtConsulta = fs.readFileSync(PathFlow, "utf8");

let timeoutId;
const TIMEOUT_DURATION = 100000;

function resetTimeout(endFlow) {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    endFlow(
      "Lo siento, no he recibido respuesta. Daré por finalizado el chat. No dudes en contactarnos nuevamente"
    );
  }, TIMEOUT_DURATION);
}

function generatePrompt(userMessage, nombre, history) {
  return `${userMessage}\n\nInformación adicional:\n${propmtConsulta} \n\n nombre de la persona:${nombre} \n\nHistorial del chat\n${history
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n")}`;
}

module.exports = {
  resetTimeout,
  generatePrompt,
};
