const STATUS_DATA = [
  {
    title: 'Reservas ativas',
    value: 42,
    delta: '+12% vs. semana anterior',
  },
  {
    title: 'Equipes em campo',
    value: 6,
    delta: '100% da capacidade',
  },
  {
    title: 'Feedbacks pendentes',
    value: 9,
    delta: '-3 desde ontem',
  },
];

export function mountStatusCards() {
  const container = document.querySelector('[data-component="status-cards"]');
  const template = document.getElementById('status-card-template');
  if (!container || !template) return;

  const fragment = document.createDocumentFragment();

  STATUS_DATA.forEach((item) => {
    const node = template.content.cloneNode(true);
    node.querySelector('.status-card__title').textContent = item.title;
    node.querySelector('.status-card__value').textContent = item.value;
    node.querySelector('.status-card__delta').textContent = item.delta;
    fragment.appendChild(node);
  });

  container.innerHTML = '';
  container.appendChild(fragment);
}
