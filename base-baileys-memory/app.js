const { createBot, createProvider, createFlow } = require("@builderbot/bot");
const { BaileysProvider } = require("@builderbot/provider-baileys");
const { adapterDB } = require("./database/config");
const {
  createFlowNotadeVoz,
  createFlowNoConection,
  createFlowDocument,
  createMedia,
} = require("./helpers/auxFunction");
const { flowAngela } = require("./structure/AngelaChatConfig");
const DBConnection = require("./database/configData");
const { createFlowData, createFlowPrincipal } = require("./flow/flowsByBot");

require("dotenv").config();

class ChatBot {
  //Inicialmente creamos el constructor, el cual cuando se haga el llamado a una instancia de la clase ChatBot que lleve el () se ejecutará
  constructor() {
    this.PORT = process.env.PORT ?? 3000;
    this.PhoneNumber = process.env.PHONE_NUMBER;
    this.horaActual = new Date().getHours();
    this.init();
    //el metodo async init() se ejecutará cuando se haga el llamado a una instancia de la clase ChatBot
  }

  async init() {
    if (this.horaActual < 8 || this.horaActual > 19) {
      const flowNoConection = createFlowNoConection();
      await this.startBot([flowNoConection]);
    } else {
      const flowPrincipal = createFlowPrincipal();
      const data = createFlowData
      const flowNotadeVoz = createFlowNotadeVoz();
      await this.startBot([flowPrincipal,flowNotadeVoz,  data, flowAngela, createFlowDocument(), createMedia()]);
    }
  }

  async startBot(flows) {
    const adapterFlow = createFlow(flows);
    const adapterProvider = createProvider(BaileysProvider, {
      usePairingCode: true,
      phoneNumber: this.PhoneNumber,

    });
    
    adapterProvider.buildHTTPServer(3000);

    const { httpServer } = await createBot({
      flow: adapterFlow,
      provider: adapterProvider,
      database: adapterDB,
    });

    httpServer(+this.PORT);
    
    DBConnection();
  }
}

new ChatBot();
