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
    `https://suvinil.myvtex.com/api/catalog_system/pub/products/search?fq=productClusterIds:${placeholder.content[0].productCluster}`,
    {
      headers: {
        Cookie:
          'VtexRCMacIdv7=8a307450-5f5d-11ea-9119-eb26c77e2292; VtexFingerPrint=5be9972e15dbce0e5c8588355659120a; vtex_segment=eyJjYW1wYWlnbnMiOm51bGwsImNoYW5uZWwiOiIxIiwicHJpY2VUYWJsZXMiOm51bGwsInJlZ2lvbklkIjpudWxsLCJ1dG1fY2FtcGFpZ24iOm51bGwsInV0bV9zb3VyY2UiOm51bGwsInV0bWlfY2FtcGFpZ24iOm51bGwsImN1cnJlbmN5Q29kZSI6IkJSTCIsImN1cnJlbmN5U3ltYm9sIjoiUiQiLCJjb3VudHJ5Q29kZSI6IkJSQSIsImN1bHR1cmVJbmZvIjoicHQtQlIiLCJhZG1pbl9jdWx0dXJlSW5mbyI6InB0LUJSIn0; _ga=GA1.2.2135174057.1584128763; _hjid=6cb18cca-096c-4270-b765-343b93edc173; intercom-id-bs8us8hw=53edc9fb-1b13-4d4c-803e-956d358d5752; intercom-session-bs8us8hw=; janus_sid=b114b683-4a42-4dcf-92b5-c90d6a3761c7; ISSMB=ScreenMedia=0&UserAcceptMobile=False; i18next=pt-BR; _gcl_au=1.1.1039015228.1584457387; _gid=GA1.2.317335427.1584457387; checkout.vtex.com=__ofid=8c5b6000fe134739b12af838403c8610; .ASPXAUTH=418BFFD01D70C418250C2408A0C5238BE24AA0FB0E7E5A80AEDBBF0AD4D9540B28A971AC4363D4D2BFCEC26D294B50C85D73C5AC1485F370245771ACD19DCDAD2F272C787A94945BE921DA801C4E82FFEB577751531AAD34B202D0E960701BF6053DF4927E51C82D6A9A5DEC94CE70E78F9566B77BF1068E29372EB0F31EAD3AB52B32DC2460F1DC3BEF086E7AA872CB72F09DF2E9C0EEEF0A9EB660E478C7B9F3AEDBAB; SGTP=UGUIDReturn=True; VtexIdclientAutCookie=eyJhbGciOiJFUzI1NiIsImtpZCI6IjUwQjZDMTI4RUQyOTI3OTMzMjg2QTlCNUEzMjExODY1NTI1OTJCNDYiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJnYWJyaWVsLmF6ZXZlZG9AZW5leHQuY29tLmJyIiwiYWNjb3VudCI6Il9fdnRleF9hZG1pbiIsInNjb3BlIjoic3V2aW5pbDphZG1pbiIsImF1dGhvcml6YWJsZXMiOlsidnJuOmlhbTpfX3Z0ZXhfYWRtaW46dXNlcnMvZ2FicmllbC5hemV2ZWRvQGVuZXh0LmNvbS5iciJdLCJleHAiOjE1ODQ2NDU3ODIsIm9BdXRoVXNlckluZm8iOjE0Nzc3NTQ4LCJvQXV0aFVzZXJJbmZvTGlzdCI6WzE0Nzc3NTQ4XSwidXNlcklkIjoiMDFlZjdmOWMtZjJkYS00YWY3LWJjMGItNWU0MDA4YjU5YzNjIiwiaWF0IjoxNTg0NTU5MzgyLCJpc3MiOiJ0b2tlbi1lbWl0dGVyIiwianRpIjoiMWE5ZTlhMTItOWVjOS00NWRmLThjNDUtZThiNjYzYzhkYzI4In0.SFbkW_g3aydJ96N5auIMfYStQR6yt2Ltr2rZ-gZhN_a8CJl65umoUPPClGUbrgaC5JzsQZw2Se1KCWpWx7fdtA; vtex_session=eyJhbGciOiJFUzI1NiIsImtpZCI6IkYzNTdFRDYwRjZCQUIwNUJEN0JGRTdFNjQyRUEyQUMxRkU0MjlERTciLCJ0eXAiOiJqd3QifQ.eyJhY2NvdW50LmlkIjoiY2I0NzdlN2EtMmRkZC00ZTBkLWE5MzQtNWQzNzllMTNiN2JiIiwiaWQiOiIxODU3ZDk3Ni1hMmE3LTQwYjctYjMyMi03NjZiNzJjNWI5MmUiLCJ2ZXJzaW9uIjo1LCJzdWIiOiJzZXNzaW9uIiwiYWNjb3VudCI6InNlc3Npb24iLCJleHAiOjE1ODUyNTA1ODQsImlhdCI6MTU4NDU1OTM4NCwiaXNzIjoidG9rZW4tZW1pdHRlciIsImp0aSI6ImZmNmIwOWE1LTAzMGEtNDQwMS05MWI2LTgyNTQ3Mjc0N2U1YiJ9.InwQtNl0o_BzsOMlHFo39h6KRJuuvXoN23fxOHwPaxGKN8xmkfqR3gNMBciCUPJmCopCu7EW1cosnsPC2Q3QDg; VTEXSC=sc=1; IPI=UsuarioGUID=01ef7f9c-f2da-4af7-bc0b-5e4008b59c3c; nav_id=8e73ba1c-6633-4956-8ccc-d8e44c54b7f2; _hjIncludedInSample=1; AWSELB=6F97954918AF7EE2B27FE7653D7E35926A6DA74EE281BD478E9FD8DBCDB54B3C759FBB5676735F712D79EB2B650A64D14C92E3F94FC1AC52B9121E0E790D9CD75D40F7A74A; VtexIdclientAutCookie=eyJhbGciOiJFUzI1NiIsImtpZCI6IjUwQjZDMTI4RUQyOTI3OTMzMjg2QTlCNUEzMjExODY1NTI1OTJCNDYiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJnYWJyaWVsLmF6ZXZlZG9AZW5leHQuY29tLmJyIiwiYWNjb3VudCI6Il9fdnRleF9hZG1pbiIsInNjb3BlIjoic3V2aW5pbDphZG1pbiIsImF1dGhvcml6YWJsZXMiOlsidnJuOmlhbTpfX3Z0ZXhfYWRtaW46dXNlcnMvZ2FicmllbC5hemV2ZWRvQGVuZXh0LmNvbS5iciJdLCJleHAiOjE1ODQ2NDU3ODIsIm9BdXRoVXNlckluZm8iOjE0Nzc3NTQ4LCJvQXV0aFVzZXJJbmZvTGlzdCI6WzE0Nzc3NTQ4XSwidXNlcklkIjoiMDFlZjdmOWMtZjJkYS00YWY3LWJjMGItNWU0MDA4YjU5YzNjIiwiaWF0IjoxNTg0NTU5MzgyLCJpc3MiOiJ0b2tlbi1lbWl0dGVyIiwianRpIjoiMWE5ZTlhMTItOWVjOS00NWRmLThjNDUtZThiNjYzYzhkYzI4In0.SFbkW_g3aydJ96N5auIMfYStQR6yt2Ltr2rZ-gZhN_a8CJl65umoUPPClGUbrgaC5JzsQZw2Se1KCWpWx7fdtA'
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
