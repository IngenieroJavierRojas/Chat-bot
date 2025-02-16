const { addKeyword, EVENTS } = require("@builderbot/bot");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const {
  generatePrompt,
  resetTimeout,
} = require("../helpers/auxFunctionAsistant");
const { sendPdf } = require("../helpers/FunctionSendData");

require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const MODEL_CONFIG = {
  temperature: 1,
  maxOutputTokens: 1800,
  model: "gemini-1.5-flash",
};

const flowAngela = addKeyword(EVENTS.ACTION).addAction(
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow, endFlow, state, provider }) => {
    const nombre = state.get("nombre");

    resetTimeout(endFlow);

    async function run() {
      try {
        const model = await genAI.getGenerativeModel(MODEL_CONFIG);
        const history = (await state.get("history")) ?? [];

        history.push({ role: "user", content: ctx.body });

        const prompt = generatePrompt(ctx.body, nombre, history);
        const result = await model.generateContent(prompt);
        const text = await result.response.text();
        history.push({ role: "bot", content: text });

        await state.update({ history });

     

        await flowDynamic(` ${text}`);

        await sendPdf(provider, ctx, text);
        
        return gotoFlow(flowAngela);
      } catch (err) {
        console.error("Error generating content:", err);
      }
    }

    await run();
  }
);

module.exports = {
  flowAngela,
};
