const { parse } = require('velocityjs');

const parseCollection = async ({ content, object, cookie }) => {
  const shelv = global.VTEXY.runtime.data.shelves.find(
    x => x.path.indexOf(object.layout + '.jsonc') > 0
  );

  const template = global.VTEXY.runtime.content.shelves.find(
    x => x.name == object.layout + '.vm'
  ).content;

  try {
    let { data: products } = await api.get(
      `https://${global.VTEXY.account}.vtexcommercestable.com.br/api/catalog_system/pub/products/search?fq=productClusterIds:${content.productCluster}`,
      {
        headers: {
          Cookie: cookie
        }
      }
    );

    products = products.map(product => {
      let sku = product.items[0];

      return {
        // Product and SKU
        Id: product.productId,
        productVariantId: sku.itemId,
        Name: sku.name,
        Uri: product.link,
        HtmlEscapedName: escape(sku.name),
        EscapedName: escape(sku.name),
        DescriptionShort: product.metaTagDescription,
        GetImageTag(a, b) {
          //  ProductImageShowcaseLittle (Size: 65×65) = 1;
          //  MainProductImage (Size: 250×250)= 2;
          //  ThumbProductImage (Size: 45×45)= 3;
          //  ZoomProductImage (Size: 344×344)= 10;
          //  File = 11;
          //  ProductManual = 12.
          //  ProductImageShowcaseMedium (Size: 90×90) = 29;
          //  ProductImageShowcaseLarge (Size: 130×130)= 30;

          let width = 0;
          let height = 0;

          if (arguments.length === 1) {
            switch (a) {
              default:
              case 1:
                width = height = 65;
                break;

              case 2:
                width = height = 250;
                break;

              case 3:
                width = height = 45;
                break;

              case 10:
                width = height = 344;
                break;

              case 11:
                width = height = 'auto';
                break;

              case 12:
                width = height = 'auto';
                break;

              case 29:
                width = height = 90;
                break;

              case 30:
                width = height = 130;
                break;
            }
          } else {
            width = a;
            height = b;
          }

          return sku.images
            .map(image =>
              image.imageTag
                .replace('#width#', width)
                .replace('#height#', height)
                .replace('src="~', 'src="')
            )
            .join('');
        },
        ProductField(idField) {},

        // Price
        ListPrice: sku.sellers[0].ListPrice,
        BestPrice: sku.sellers[0].Price,
        HasBestPrice: '',
        NumbersOfInstallment: 0, //sku.sellers[0].Installments.length
        InstallmentValue: 0, //sku.sellers[0].Installments[0].Value
        MaxNumbersOfInstallment: 0,
        MaxInstallmentValue: 0,
        BestPricePlusTax: 0,
        ListPriceMinusBestPrice: 0,
        ListPriceMinusBestPriceInPercent: 0,

        // Departament and Category
        DepartmentName: '',
        DepartmentLink: '',
        CategoryName: '',
        CategoryLink: '',

        // Brand
        BrandName: product.brand,
        Brand: slugify(product.brand),
        BrandLink: '',

        // Buy button
        BottomBuyAllSku: '',
        BottomBuy: '',
        ButtonBuyModal(p1, p2) {},

        AmountInCart: 0,

        // Other
        EvaluationRate: '',
        HightLight: Object.values(product.clusterHighlights),
        DiscountHightLight: '',
        IsInStock: sku.sellers.some(x => x.AvailableQuantity > 0),
        Tax: '',
        QuickView: '',
        Compare: '',
        BestRewardValue: '',
        PercentBougthAndBought: '', // Who bought also bought: /api/catalog_system/pub/products/crossselling/whoboughtalsobought/{{productId}}
        PercentBoughtAlso: '', // Who saw also bought: /api/catalog_system/pub/products/crossselling/whosawalsobought/{{productId}}
        PercentViewedAlso: '', // Who saw also saw: /api/catalog_system/pub/products/crossselling/whosawalsosaw/{{productId}}
        InsertSku: ''
      };
    });

    let shelfs = products.map(product =>
      Velocity.render(template, { product }, {})
    );

    return `
          <div class="${shelv.cssClass} n12colunas">
              <h2>${content.name}</h2>
              ${shelfs
                .map(shelf => ` <li layout="${shelv.id}"> ${shelf} </li> `)
                .join('')}
          </div>
      `;
  } catch (error) {
    console.error(error);
  }
};

module.exports = async ({ layout, cookie, tree }, resolve) => {
  // List placeholders id in html template
  let placeholders = [];
  tree.match({ tag: 'vtex:contentPlaceholder' }, node => {
    placeholders.push(node.attrs.id);
    return node;
  });

  // Find properties in layout according to id
  await Promise.all(
    placeholders.map(async id => {
      let placeholder = layout.settings[id];

      let html = await Promise.all(
        placeholder.map(
          async object =>
            await Promise.all(
              object.content.map(async content => {
                switch (object.type) {
                  case 'banner':
                    return `<div class="box-banner"><a><img width="${content.width}" height="${content.height}" id="" alt="${content.name}" src="${content.file}" /></a></div>`;

                  case 'html':
                    return content.html;

                  case 'collection':
                    // return await parseCollection({ content, object, cookie });
                    return '';

                  case 'bannerhtml':
                    return '';

                  default:
                    break;
                }
              })
            )
        )
      );

      html = html.flat().join('');

      // console.log(html);

      tree.match({ tag: 'vtex:contentPlaceholder', attrs: { id } }, node => {
        if (placeholder) {
          node = posthtmlParser(html);
        } else {
          node.content = [];
          node.tag = false;
        }
        return node;
      });
    })
  ).then(() => {
    tree.match({ tag: 'head' }, node => {
      node.content.push(
        `\n<!-- CommerceContext.Current.VirtualFolder.Name: ${layout.virtualFolder} -->\n`
      );
      return node;
    });

    resolve(tree);
  });
};
