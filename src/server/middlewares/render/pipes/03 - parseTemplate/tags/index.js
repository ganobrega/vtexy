const vtexContentPlaceholder = require('./vtex-content-placeholder');

const tags = {
  // Sugar
  'vtex:contentPlaceholder': vtexContentPlaceholder,
  'vtex:template': vtexContentPlaceholder,
  'vtex:metaTags': () => {},

  // CMC
  'vtex.cmc:userProfile': () => {},
  'vtex.cmc:breadCrumb': () => {},
  'vtex.cmc:fullTextSearchBox': () => {},
  'vtex.cmc:welcomeMessage': () => {},
  'vtex.cmc:canonicalPage': () => {},
  'vtex.cmc:departmentLinks': () => {},
  'vtex.cmc:departmentNavigator': () => {},
  'vtex.cmc:searchTitle': () => {},
  'vtex.cmc:productQuickView': () => {},
  'vtex.cmc:ProductQueryStringReferenceShelf': () => {},
  'vtex.cmc:ProductGifts': () => {},
  'vtex.cmc:productPageTitle': () => {},
  'vtex.cmc:productName': () => {},
  'vtex.cmc:brandName': () => {},
  'vtex.cmc:ProductImage': () => {},
  'vtex.cmc:productReference': () => {},
  'vtex.cmc:StockKeepingUnitPriceHistory': () => {},
  'vtex.cmc:skuReference': () => {},
  'vtex.cmc:skuPrice': () => {},
  'vtex.cmc:stockKeepingUnitSelection': () => {},
  'vtex.cmc:skuRichSelection': () => {},
  'vtex.cmc:skuSelection': () => {},
  'vtex.cmc:OtherPaymentMethod': () => {},
  'vtex.cmc:Delivery': () => {},
  'vtex.cmc:shippingValue': () => {},
  'vtex.cmc:stockKeepingUnitRewardValue': () => {},
  'vtex.cmc:BuyTogether': () => {},
  'vtex.cmc:ProductDescription': () => {},
  'vtex.cmc:productDescriptionShort': () => {},
  'vtex.cmc:productSpecification': () => {},
  'vtex.cmc:StockKeepingUnitAttributes': () => {},
  'vtex.cmc:stockKeepingUnitMeasures': () => {},
  'vtex.cmc:ProductTag': () => {},
  'vtex.cmc:PageSearch': () => {},
  'vtex.cmc:BuyButton': () => {},
  'vtex.cmc:BuyInPage': () => {},
  'vtex.cmc:stockKeepingUnitAmountAndUnitSelection': () => {},
  'vtex.cmc:evaluationRate': () => {},
  'vtex.cmc:UserReview': () => {},
  'vtex.cmc:giftListInsertSku': () => {},
  'vtex.cmc:GiftListFormV2': () => {},
  'vtex.cmc:HightLight': () => {},
  'vtex.cmc:discountHightLight': () => {},
  'vtex.cmc:sellerDescription': () => {},
  'vtex.cmc:SellerOptions': () => {},
  'vtex.cmc:SalesChannelDropList': () => {},
  'vtex.cmc:facebookLike': () => {},
  'vtex.cmc:productRichSnippets': () => {},
  'vtex.cmc:advancedSearchFilter': () => {},
  'vtex.cmc:singleDepartmentNavigator': () => {},
  'vtex.cmc:searchNavigator': () => {},
  'vtex.cmc:searchResult': () => {},
  'vtex.cmc:miniCart': () => {},
  'vtex.cmc:AmountItemsInCart': () => {},
  'vtex.cmc:orderList': () => {},
  'vtex.cmc:accountUserProfile': () => {},
  'vtex.cmc:accountAddress': () => {},
  'vtex.cmc:sellerInfo': () => {}
};

module.exports = async ({ layout, cookie, tree }, resolve) => {
  tree.match({ tag: 'vtex:contentPlaceholder' }, node => {
    // await tags()
    return node;
  });
};
