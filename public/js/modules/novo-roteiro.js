const SERVICE_TYPES = [
  'Alimentação',
  'Transporte',
  'Hospedagem',
  'Guias',
];

const SERVICO_OPCOES = [
  'Transporte rodoviário',
  'Transporte base',
  'Almoço',
  'Hospedagem',
  'Guiamento',
];

const HOSPEDAGEM_TIPOS = [
  'Camping natural',
  'Sítio',
  'Pousada',
  'Hotel',
  'Hostel',
  'Receptivo familiar',
];

const HOSPEDAGEM_FACILIDADES = [
  'Banho quente',
  'Roupa de cama',
  'Ar condicionado',
  'Ventilador',
  'TV',
  'Wi-Fi',
  'Piscina',
];

const ALUGUEL_ITENS = [
  'Mochila cargueira',
  'Bastões de caminhada',
  'Barraca',
  'Saco de dormir',
];

function formatCurrency(value) {
  const number = Number(value) || 0;
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function mountNovoRoteiro() {
  const panel = document.querySelector('#novo-roteiro');
  if (!panel) return;

  const sidebar = panel.querySelector('.novo-roteiro__sidebar');
  const toggle = panel.querySelector('.novo-roteiro__toggle');

  toggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('is-open');
  });

  const tabs = Array.from(panel.querySelectorAll('.novo-roteiro__tab'));
  const tabPanels = Array.from(panel.querySelectorAll('.novo-roteiro__panel'));

  function activateTab(name) {
    tabs.forEach((tab) => {
      tab.classList.toggle('is-active', tab.dataset.tab === name);
    });
    tabPanels.forEach((tabPanel) => {
      tabPanel.classList.toggle('is-active', tabPanel.id === `tab-${name}`);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  });

  const cloneOptions = Array.from(panel.querySelectorAll('.novo-roteiro__clone-opt'));
  cloneOptions.forEach((opt) => {
    opt.addEventListener('change', () => {
      if (opt.value === 'tudo' && opt.checked) {
        cloneOptions.forEach((item) => {
          if (item !== opt) item.checked = false;
        });
      } else if (opt.value !== 'tudo' && opt.checked) {
        const all = cloneOptions.find((item) => item.value === 'tudo');
        if (all) all.checked = false;
      }
    });
  });

  const cloneApply = panel.querySelector('#novoRoteiroCloneApply');
  cloneApply?.addEventListener('click', () => {
    const select = panel.querySelector('#novoRoteiroClone');
    const nameField = panel.querySelector('#novoRoteiroNome');
    if (!(select instanceof HTMLSelectElement) || !(nameField instanceof HTMLInputElement)) {
      return;
    }
    if (!select.value) {
      nameField.focus();
      return;
    }
    nameField.value = `${select.value} (clonado)`;
  });

  const percursoBtn = panel.querySelector('#togglePercursoDetalhe');
  const percursoDetalhe = panel.querySelector('#percursoDetalhe');
  percursoBtn?.addEventListener('click', () => {
    percursoDetalhe?.classList.toggle('is-hidden');
  });

  const addLocalidade = panel.querySelector('#addLocalidade');
  const localidadeExtras = panel.querySelector('#localidadeExtras');
  let localidadeCount = 0;

  addLocalidade?.addEventListener('click', () => {
    if (!(localidadeExtras instanceof HTMLElement)) return;
    const max = Number(localidadeExtras.dataset.max) || 6;
    if (localidadeCount >= max - 1) {
      return;
    }
    localidadeCount += 1;
    const wrapper = document.createElement('div');
    wrapper.className = 'novo-roteiro__inline novo-roteiro__inline--wrap';
    wrapper.innerHTML = `
      <input type="text" placeholder="Localidade adicional" />
      <button type="button" class="secondary" aria-label="Remover localidade">–</button>
    `;
    const removeBtn = wrapper.querySelector('button');
    removeBtn?.addEventListener('click', () => {
      wrapper.remove();
      localidadeCount = Math.max(localidadeCount - 1, 0);
    });
    localidadeExtras.appendChild(wrapper);
  });

  const abrangenciaRadios = Array.from(panel.querySelectorAll('input[name="abrangencia"]'));
  const abrangenciaUf = panel.querySelector('#abrangenciaUf');
  const abrangenciaPais = panel.querySelector('#abrangenciaPais');
  abrangenciaRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (!(radio instanceof HTMLInputElement)) return;
      const isBrasil = radio.value === 'brasil' && radio.checked;
      abrangenciaUf?.classList.toggle('is-hidden', !isBrasil);
      abrangenciaPais?.classList.toggle('is-hidden', isBrasil);
    });
  });

  const eventoProlongado = panel.querySelector('#eventoProlongado');
  const campoDataFinal = panel.querySelector('#campoDataFinal');
  eventoProlongado?.addEventListener('change', () => {
    if (!(eventoProlongado instanceof HTMLInputElement)) return;
    campoDataFinal?.classList.toggle('is-hidden', !eventoProlongado.checked);
  });

  const dataInicial = panel.querySelector('#dataInicial');
  const aplicarBtn = panel.querySelector('#aplicarRoteiro');
  function syncAplicarState() {
    if (dataInicial instanceof HTMLInputElement && aplicarBtn instanceof HTMLButtonElement) {
      aplicarBtn.disabled = dataInicial.value.trim().length === 0;
    }
  }
  dataInicial?.addEventListener('input', syncAplicarState);
  syncAplicarState();

  const atrObsToggle = panel.querySelector('#atrObsToggle');
  const atrObsText = panel.querySelector('#atrObsText');
  atrObsToggle?.addEventListener('change', () => {
    if (!(atrObsToggle instanceof HTMLInputElement)) return;
    atrObsText?.classList.toggle('is-hidden', !atrObsToggle.checked);
  });

  // Serviços inclusos
  const servicosContainer = panel.querySelector('#servicosContainer');
  const addItemServico = panel.querySelector('#addItemServico');
  const paxMinimoInput = panel.querySelector('#servicoPaxMinimo');
  const precoSugerido = panel.querySelector('#servicoPrecoSugerido');
  let servicoItemId = 0;

  function recalcServicos() {
    if (!(precoSugerido instanceof HTMLElement)) return;
    const pax = paxMinimoInput instanceof HTMLInputElement && Number(paxMinimoInput.value) > 0
      ? Number(paxMinimoInput.value)
      : 1;
    let total = 0;
    servicosContainer?.querySelectorAll('.novo-roteiro__servico-grid').forEach((grid) => {
      const valorInput = grid.querySelector('[data-servico="valor"]');
      const tipoSelect = grid.querySelector('[data-servico="tipo"]');
      if (valorInput instanceof HTMLInputElement && tipoSelect instanceof HTMLSelectElement) {
        const valor = Number(valorInput.value) || 0;
        const tipo = tipoSelect.value;
        if (tipo === 'por_pessoa') {
          total += valor;
        } else {
          total += valor / pax;
        }
      }
    });
    precoSugerido.textContent = formatCurrency(total);
  }

  function createServicoLinha(item) {
    const grid = document.createElement('div');
    grid.className = 'novo-roteiro__servico-grid';
    grid.innerHTML = `
      <label class="novo-roteiro__field">
        <span>Serviço</span>
        <select data-servico="nome">
          ${SERVICO_OPCOES.map((opcao) => `<option>${opcao}</option>`).join('')}
        </select>
      </label>
      <label class="novo-roteiro__field">
        <span>Prestador (opcional)</span>
        <input type="text" placeholder="Nome do prestador" />
      </label>
      <label class="novo-roteiro__field">
        <span>Especificação</span>
        <textarea rows="2" placeholder="Detalhes do serviço"></textarea>
      </label>
      <label class="novo-roteiro__field">
        <span>Valor (R$)</span>
        <input type="number" min="0" step="0.01" data-servico="valor" />
      </label>
      <label class="novo-roteiro__field">
        <span>Cálculo</span>
        <select data-servico="tipo">
          <option value="total">Total</option>
          <option value="por_pessoa">Por pessoa</option>
        </select>
      </label>
      <label class="novo-roteiro__field is-hidden" data-servico="cortesia-wrap">
        <span>Cortesia</span>
        <select data-servico="cortesia">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </label>
      <button type="button" class="secondary" data-servico="remover">Remover</button>
    `;

    const tipoSelect = grid.querySelector('[data-servico="tipo"]');
    const cortesiaWrap = grid.querySelector('[data-servico="cortesia-wrap"]');
    tipoSelect?.addEventListener('change', () => {
      if (!(tipoSelect instanceof HTMLSelectElement) || !(cortesiaWrap instanceof HTMLElement)) return;
      const isPerPerson = tipoSelect.value === 'por_pessoa';
      cortesiaWrap.classList.toggle('is-hidden', !isPerPerson);
    });

    grid.querySelectorAll('input, select').forEach((control) => {
      control.addEventListener('input', recalcServicos);
      control.addEventListener('change', recalcServicos);
    });

    const removeBtn = grid.querySelector('[data-servico="remover"]');
    removeBtn?.addEventListener('click', () => {
      grid.remove();
      if (!item.querySelector('.novo-roteiro__servico-grid')) {
        item.remove();
      }
      recalcServicos();
    });

    return grid;
  }

  function createServicoItem() {
    const item = document.createElement('div');
    const id = servicoItemId += 1;
    item.className = 'novo-roteiro__servico-item';
    item.innerHTML = `
      <div class="novo-roteiro__servico-header">
        <label class="novo-roteiro__field">
          <span>Item</span>
          <select>
            <option value="">Selecione</option>
            ${SERVICE_TYPES.map((nome) => `<option>${nome}</option>`).join('')}
          </select>
        </label>
        <button type="button" class="secondary" data-servico="add">+ Serviço</button>
        <button type="button" class="secondary" data-servico="remove-item">– Item</button>
      </div>
      <div class="novo-roteiro__servico-linhas" data-servico-id="${id}"></div>
    `;

    const linhas = item.querySelector('.novo-roteiro__servico-linhas');
    const addBtn = item.querySelector('[data-servico="add"]');
    const removeItemBtn = item.querySelector('[data-servico="remove-item"]');

    addBtn?.addEventListener('click', () => {
      if (!linhas) return;
      linhas.appendChild(createServicoLinha(item));
      recalcServicos();
    });

    removeItemBtn?.addEventListener('click', () => {
      item.remove();
      recalcServicos();
    });

    linhas?.appendChild(createServicoLinha(item));
    return item;
  }

  addItemServico?.addEventListener('click', () => {
    servicosContainer?.appendChild(createServicoItem());
    recalcServicos();
  });

  paxMinimoInput?.addEventListener('change', recalcServicos);

  // Atrativos
  const atrativosContainer = panel.querySelector('#atrativosContainer');
  const addAtrativoBtn = panel.querySelector('#addAtrativo');
  let atrativoCount = 0;
  const ATRATIVO_MAX = 10;

  function updateAtrativoIndices() {
    atrativosContainer?.querySelectorAll('.novo-roteiro__atrativo').forEach((element, index) => {
      const label = element.querySelector('[data-atrativo="label"]');
      if (label) label.textContent = `Atrativo ${index + 1}`;
    });
    atrativoCount = atrativosContainer?.querySelectorAll('.novo-roteiro__atrativo').length || 0;
  }

  function createAtrativo() {
    if (atrativoCount >= ATRATIVO_MAX) {
      return null;
    }
    const wrapper = document.createElement('div');
    wrapper.className = 'novo-roteiro__atrativo';
    wrapper.innerHTML = `
      <label class="novo-roteiro__field">
        <span data-atrativo="label">Atrativo ${atrativoCount + 1}</span>
        <input type="text" placeholder="Nome do atrativo" />
      </label>
      <div class="novo-roteiro__atrativo-controls">
        <button type="button" class="secondary" data-atrativo="descricao">Descrição</button>
        <button type="button" class="secondary" data-atrativo="remover">–</button>
      </div>
      <textarea class="is-hidden" rows="3" placeholder="Descreva o atrativo..."></textarea>
    `;

    const toggle = wrapper.querySelector('[data-atrativo="descricao"]');
    const remover = wrapper.querySelector('[data-atrativo="remover"]');
    const textarea = wrapper.querySelector('textarea');

    toggle?.addEventListener('click', () => {
      textarea?.classList.toggle('is-hidden');
      if (toggle instanceof HTMLButtonElement) {
        toggle.textContent = textarea?.classList.contains('is-hidden') ? 'Descrição' : 'Ocultar descrição';
      }
    });

    remover?.addEventListener('click', () => {
      wrapper.remove();
      updateAtrativoIndices();
    });

    return wrapper;
  }

  addAtrativoBtn?.addEventListener('click', () => {
    const atrativo = createAtrativo();
    if (!atrativo) return;
    atrativosContainer?.appendChild(atrativo);
    updateAtrativoIndices();
  });

  // Hospedagem
  const hospedagemContainer = panel.querySelector('#hospedagensContainer');
  const addHospedagemBtn = panel.querySelector('#addHospedagem');

  function createHospedagem() {
    const bloco = document.createElement('div');
    bloco.className = 'novo-roteiro__hospedagem-bloco';
    bloco.innerHTML = `
      <div class="novo-roteiro__hospedagem-grid">
        <label class="novo-roteiro__field">
          <span>Tipo</span>
          <select>
            ${HOSPEDAGEM_TIPOS.map((tipo) => `<option>${tipo}</option>`).join('')}
          </select>
        </label>
        <label class="novo-roteiro__field">
          <span>Descrição</span>
          <textarea rows="2" placeholder="Descreva a hospedagem"></textarea>
        </label>
      </div>
      <div class="novo-roteiro__field">
        <span>Facilidades</span>
        <div class="novo-roteiro__checkboxes">
          ${HOSPEDAGEM_FACILIDADES.map((item) => `
            <label><input type="checkbox" value="${item}"> ${item}</label>
          `).join('')}
        </div>
      </div>
      <button type="button" class="secondary" data-hospedagem="remover">Remover</button>
    `;

    const remover = bloco.querySelector('[data-hospedagem="remover"]');
    remover?.addEventListener('click', () => bloco.remove());

    return bloco;
  }

  addHospedagemBtn?.addEventListener('click', () => {
    hospedagemContainer?.appendChild(createHospedagem());
  });

  // Aluguel
  const aluguelContainer = panel.querySelector('#aluguelContainer');
  const addAluguelBtn = panel.querySelector('#addItemAluguel');
  let aluguelCount = 0;

  function updateAluguelNumeros() {
    aluguelContainer?.querySelectorAll('.novo-roteiro__aluguel-item').forEach((item, index) => {
      const badge = item.querySelector('[data-aluguel="numero"]');
      if (badge) badge.textContent = String(index + 1);
    });
    aluguelCount = aluguelContainer?.querySelectorAll('.novo-roteiro__aluguel-item').length || 0;
  }

  function createAluguelItem() {
    const bloco = document.createElement('div');
    bloco.className = 'novo-roteiro__aluguel-item';
    bloco.innerHTML = `
      <div class="novo-roteiro__aluguel-header">
        <button type="button" class="secondary" data-aluguel="remover">–</button>
        <span class="novo-roteiro__aluguel-number" data-aluguel="numero">${aluguelCount + 1}</span>
        <label class="novo-roteiro__field">
          <span>Item de aluguel</span>
          <input type="text" list="aluguelSugestoes" placeholder="Nome do item" />
        </label>
      </div>
      <div class="novo-roteiro__grid">
        <label class="novo-roteiro__field">
          <span>Descrição</span>
          <textarea rows="2"></textarea>
        </label>
        <label class="novo-roteiro__field">
          <span>Inserir imagem</span>
          <input type="file" accept="image/*" />
        </label>
      </div>
    `;

    const remover = bloco.querySelector('[data-aluguel="remover"]');
    remover?.addEventListener('click', () => {
      bloco.remove();
      updateAluguelNumeros();
    });

    return bloco;
  }

  addAluguelBtn?.addEventListener('click', () => {
    aluguelContainer?.appendChild(createAluguelItem());
    updateAluguelNumeros();
  });

  if (!panel.querySelector('#aluguelSugestoes')) {
    const dataList = document.createElement('datalist');
    dataList.id = 'aluguelSugestoes';
    dataList.innerHTML = ALUGUEL_ITENS.map((item) => `<option value="${item}"></option>`).join('');
    panel.appendChild(dataList);
  }

  // Botões de ação
  const salvarBtn = panel.querySelector('#salvarRascunho');
  const cancelarBtn = panel.querySelector('#cancelarRoteiro');

  salvarBtn?.addEventListener('click', () => {
    const data = collectFormData(panel);
    localStorage.setItem('novoRoteiroDraft', JSON.stringify(data));
  });

  cancelarBtn?.addEventListener('click', () => {
    resetForm(panel);
    updateAtrativoIndices();
    updateAluguelNumeros();
    recalcServicos();
    syncAplicarState();
    const extras = panel.querySelector('#localidadeExtras');
    if (extras) extras.innerHTML = '';
    localidadeCount = 0;
    addItemServico?.dispatchEvent(new Event('click'));
    addAtrativoBtn?.dispatchEvent(new Event('click'));
    addHospedagemBtn?.dispatchEvent(new Event('click'));
    addAluguelBtn?.dispatchEvent(new Event('click'));
  });

  const aplicar = panel.querySelector('#aplicarRoteiro');
  aplicar?.addEventListener('click', () => {
    const data = collectFormData(panel);
    console.table(data);
  });

  // Estado inicial
  addItemServico?.dispatchEvent(new Event('click'));
  addAtrativoBtn?.dispatchEvent(new Event('click'));
  addHospedagemBtn?.dispatchEvent(new Event('click'));
  addAluguelBtn?.dispatchEvent(new Event('click'));
}

function collectFormData(root) {
  const nome = root.querySelector('#novoRoteiroNome');
  const dataInicial = root.querySelector('#dataInicial');
  const dataFinal = root.querySelector('#dataFinal');
  return {
    nome: nome instanceof HTMLInputElement ? nome.value : '',
    dataInicial: dataInicial instanceof HTMLInputElement ? dataInicial.value : '',
    dataFinal: dataFinal instanceof HTMLInputElement ? dataFinal.value : '',
  };
}

function resetForm(root) {
  root.querySelectorAll('input, select, textarea').forEach((field) => {
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      if (field.type === 'checkbox' || field.type === 'radio') {
        field.checked = field.defaultChecked;
      } else if (field.type === 'file') {
        field.value = '';
      } else {
        field.value = field.defaultValue;
      }
    } else if (field instanceof HTMLSelectElement) {
      field.selectedIndex = 0;
    }
  });

  root.querySelectorAll('#servicosContainer, #atrativosContainer, #hospedagensContainer, #aluguelContainer').forEach((container) => {
    container.innerHTML = '';
  });
}
