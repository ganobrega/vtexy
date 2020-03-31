const layoutSchema = require('../models/Layout');

const layout = {
  name: 'Home',
  lid: 'xxxxxxxx-b2a1-4249-8b58-70d9e61d4d0b',
  active: true,
  default: true,
  legacy: false,
  bodyClass: 'is--home',
  template: 'Home',
  settings: {
    Banner: [
      {
        name: 'Banner 1',
        type: 'banner',
        content: [
          {
            name: 'Banner 1',
            active: true,
            width: 1760,
            height: 771,
            type: 'image',
            url: '#',
            file: '/arquivos/Banner-Futebol.jpg'
          }
        ]
      }
    ],

    Titulo: [
      {
        name: 'Título',
        type: 'html',
        layout: 'prateleira',
        content: [
          {
            name: 'Título',
            active: true,
            html: '<div>Olá</div>'
          }
        ]
      }
    ],

    Vitrine: [
      {
        name: 'Vitrine',
        type: 'collection',
        layout: 'prateleira',
        items: '3',
        columns: '3',
        random: true,
        paged: true,
        showUnavailable: true,
        content: [
          {
            name: 'Bolsa',
            active: true,
            partner: '',
            campaign: '',
            category: '',
            brand: '',
            source: '',
            keyword: '',
            period: '',
            productCluster: 140,
            queryString: ''
          }
        ]
      }
    ]
  }
};

(async () => {
  let result = await layoutSchema.validate(layout);
  console.log(result.settings);
})();
