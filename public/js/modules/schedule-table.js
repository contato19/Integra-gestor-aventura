const SCHEDULE = [
  {
    cliente: 'Ana Souza',
    atividade: 'Rafting nível 3',
    data: '12/07/2024',
    status: 'confirmado',
  },
  {
    cliente: 'Expedição Noronha',
    atividade: 'Mergulho livre',
    data: '14/07/2024',
    status: 'pendente',
  },
  {
    cliente: 'Trilha Roots',
    atividade: 'Caminhada noturna',
    data: '16/07/2024',
    status: 'confirmado',
  },
];

export function mountScheduleTable() {
  const container = document.querySelector('[data-component="schedule-table"]');
  if (!container) return;

  const table = document.createElement('table');
  table.className = 'table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Cliente</th>
        <th>Atividade</th>
        <th>Data</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${SCHEDULE.map(
        (item) => `
          <tr>
            <td>${item.cliente}</td>
            <td>${item.atividade}</td>
            <td>${item.data}</td>
            <td><span class="badge" data-status="${item.status}">${item.status}</span></td>
          </tr>
        `,
      ).join('')}
    </tbody>
  `;

  container.replaceChildren(table);
}
