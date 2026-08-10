export function buildDemoUser(email) {
  return {
    id: 'demo-operator',
    email,
    name: 'Operacao demonstrativa',
    role: 'administrator',
    photoURL: '',
    bio: 'Ambiente demonstrativo da plataforma Hortelan.',
    preferences: {
      language: 'pt-BR',
      measurementUnit: 'metrico',
      timezone: 'America/Sao_Paulo',
    },
    notifications: {
      irrigationAlerts: true,
      pestAlerts: true,
      weatherAlerts: true,
      communityUpdates: false,
      marketing: false,
    },
    savedAddresses: [],
    cultivationLevel: 'intermediario',
    gardens: [],
  };
}
