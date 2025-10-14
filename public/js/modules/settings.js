const SETTINGS = [
  {
    title: 'Sincronização',
    description: 'Integrar automaticamente com planilhas do Google e CRM.',
    action: {
      label: 'Configurar',
      handler: () => alert('Abrir modal de integrações...'),
    },
  },
  {
    title: 'Equipe',
    description: 'Gerenciar guias, instrutores e permissões na plataforma.',
    action: {
      label: 'Gerenciar',
      handler: () => alert('Abrir lista de colaboradores...'),
    },
  },
  {
    title: 'Planos e pagamentos',
    description: 'Atualizar plano, checar faturas e configurar meios de pagamento.',
    action: {
      label: 'Ver planos',
      handler: () => alert('Direcionar para upgrade...'),
    },
  },
  {
    title: 'Firebase Hosting',
    description: 'Verifique o firebase.json e execute "firebase deploy" para publicar.',
    action: {
      label: 'Ver tutorial',
      handler: () => window.open('https://firebase.google.com/docs/hosting', '_blank'),
    },
  },
];

export function mountSettings() {
  const container = document.querySelector('[data-component="settings"]');
  if (!container) return;

  container.innerHTML = SETTINGS.map(
    (item) => `
      <article class="settings-card">
        <header>
          <h3>${item.title}</h3>
        </header>
        <p>${item.description}</p>
        <button class="secondary" data-action="${item.title}">${item.action.label}</button>
      </article>
    `,
  ).join('');

  container.querySelectorAll('button[data-action]').forEach((button) => {
    const config = SETTINGS.find((item) => item.action.label === button.textContent);
    if (!config) return;
    button.addEventListener('click', config.action.handler);
  });
}
