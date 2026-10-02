/*
 * Configuração central de contato da Pata Amiga.
 *
 * Preencha os campos abaixo com os dados CONFIRMADOS pela empresa.
 * Enquanto um campo estiver vazio, a página mostra "A confirmar" e os botões
 * de agendamento levam para a seção de contato (#contato) em vez de um link externo.
 */
window.PATA_AMIGA_CONFIG = {
  // WhatsApp somente com números, incluindo DDI e DDD. Ex.: "5511999999999"
  whatsapp: "",
  // Mensagem inicial enviada ao abrir o WhatsApp
  whatsappMessage: "Olá, Pata Amiga! Gostaria de agendar um atendimento para o meu pet.",

  // Telefone para exibição. Ex.: "(11) 99999-9999"
  phoneDisplay: "",
  // E-mail de contato. Ex.: "contato@pataamiga.com.br"
  email: "",
  // Perfil do Instagram sem o @. Ex.: "pataamiga"
  instagram: "",

  // Endereço completo. Ex.: "Rua Exemplo, 328 — Bairro, Cidade/UF"
  address: "",
  // Link do Google Maps para o endereço
  mapsUrl: "",

  // Horários de atendimento. Ex.: ["Segunda a sexta: 8h às 19h", "Sábado: 8h às 14h"]
  hours: []
};
