# Integra Gestor Aventura

Protótipo de dashboard modular para unificar markup, estilos e scripts em um único fluxo antes do deploy no Firebase Hosting.

## Estrutura

```
public/
├── assets/
│   └── logo.svg
├── css/
│   └── style.css
├── index.html
└── js/
    ├── main.js
    └── modules/
        ├── schedule-table.js
        ├── settings.js
        └── status-cards.js
```

- **index.html**: Página principal com pontos de montagem (data-component) para componentes dinâmicos.
- **css/style.css**: Camada visual centralizada.
- **js/main.js**: Responsável por inicializar navegação e componentes.
- **js/modules/**: Scripts modulares para cada painel.

## Uso local

Basta abrir `public/index.html` no navegador. Os módulos ES6 funcionam diretamente sem bundler.

Para simular um ambiente semelhante ao Firebase Hosting, sirva o diretório `public` com qualquer servidor estático:

```bash
npx serve public
```

## Próximos passos para o Firebase

1. Instale a CLI: `npm install -g firebase-tools`
2. Execute `firebase login` e `firebase init hosting`
3. Use o diretório `public` como raiz do hosting.
4. Publique com `firebase deploy`.

Ajuste os datasets mockados nos módulos conforme conectar APIs/Firestore.
