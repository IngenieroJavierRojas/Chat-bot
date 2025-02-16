const pdfGuide = [
  "MANUAL",
  "manual",
  "Manual",
  "guia",
  "Guia",
  "Guía",
  "guía",
  "pdf",
  "PDF",
  "Pdf",
];

const partnertText = [
  "afiliarte",
  "asociarte",
  "Asociarte",
  "Afiliarte",
  "afiliación",
];
async function sendPdf(provider, ctx, text) {
  const verificadorPalabras = pdfGuide.some((palabra) =>
    text.includes(palabra)
  );
  if (verificadorPalabras) {
    return await provider.sendFile(
      ctx.key.remoteJid,
      "C:\\Users\\Javier Rojas\\Documents\\ChatBot\\Paso-A-paso-renovacion.pdf"
    );
  } else {
    return false;
  }
}

async function sendImageWithPartner(provider, ctx, text, flowDynamic) {
  const verifyContent = partnertText.some((letter) => text.includes(letter));
  if (verifyContent) {
    await flowDynamic(
      "Acá te anexo una imágen de referencia con mayor información. Si tienes alguna otra duda, no dudes en preguntar. "
    );
    return await provider.sendFile(
      ctx.key.remoteJid,
      "https://www.camaracartago.org/wp-content/uploads/2024/03/2024-01-101572-AAA.jpg"
    );
  }
}

async function sendMediaWithTramits () {

}



module.exports = {
  sendPdf,
  sendImageWithPartner
};
