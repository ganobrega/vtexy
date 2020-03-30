const Velocity = require('velocityjs');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
const pPipe = require('p-pipe');
const axios = require('axios');
const JSONC = require('jsonc');

// Pipeline
// 1. Receive placeholder
// 2. Find shelv template in dist/shelves respected to placeholder and read them
// 3. Search the product cluster respected to placeholder
// 4. Transform each product in search response to a ShelfObject
// 5. For each ProductShelfObject parse it with Velocity Engine and the Template of Step 2
// 6. Mount each product in a <li></li> and the wrapper HTML.

const prepareArgs = ({ placeholder, request }) => {
  console.log(request);
  return {
    placeholder,
    request
  };
};

const consol = args => {
  // console.log(args);
  return args;
};

const findTemplate = async ({ placeholder, ...args }) => {
  // console.log(placeholder.layout);

  let shelvConfig = JSONC.parse(
    await fs.readFileSync(path.join(process.env.VTEX_DATA, 'shelves', placeholder.layout + '.jsonc'), 'utf8')
  );

  let template = await fs.readFileSync(
    path.join(process.env.VTEX_CONTENT, 'shelves', placeholder.layout + '.vm'),
    'utf8'
  );

  let shelv = {
    ...shelvConfig,
    template
  };

  return {
    ...args,
    shelv,
    placeholder
  };
};

const searchProductCluster = async ({ placeholder, request, ...args }) => {
  let response = await axios.get(
    `https://${process.env.VTEX_ACCOUNT}.vtexcommercestable.com.br/api/catalog_system/pub/products/search?fq=productClusterIds:${placeholder.content[0].productCluster}`,
    {
      headers: {
        Cookie: process.env.VTEX_TOKENID
      }
    }
  );

  return {
    placeholder,
    request,
    products: response.data,
    ...args
  };
};

const transformToShelfObject = async ({ products, ...args }) => {
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

        return sku.images.map(image => image.imageTag.replace('#width#', width).replace('#height#', height)).join('');
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

  return {
    ...args,
    products
  };
};

const parseVelocity = async ({ products, shelv, ...args }) => {
  let shelfs = products.map(product => Velocity.render(shelv.template, { product }, {}));

  return {
    ...args,
    // products, // Remove products json from pipeline
    shelfs,
    shelv
  };
};

const mountWrapper = async ({ shelv, placeholder, shelfs, ...args }) => {
  return `
        <div class="${shelv.cssClass} n12colunas">
            <h2>${placeholder.name}</h2>
            ${shelfs.map(shelf => ` <li layout="${shelv.id}"> ${shelf} </li> `).join('')}
        </div>
    `;
};

module.exports = async args => {
  console.log(args);

  const pipeline = pPipe(
    prepareArgs,
    // findTemplate,
    // searchProductCluster,
    // transformToShelfObject,
    // parseVelocity,
    // mountWrapper,
    consol
  );

  return await pipeline(args);
};
