function _0x4349(_0x2ee744,_0x1f3464){const _0x56632f=_0x5663();return _0x4349=function(_0x43490a,_0xc1bbed){_0x43490a=_0x43490a-0x83;let _0x1d3c00=_0x56632f[_0x43490a];return _0x1d3c00;},_0x4349(_0x2ee744,_0x1f3464);}const _0x459fa8=_0x4349;(function(_0x7fe063,_0x5d22db){const _0xdbe33a=_0x4349,_0xe373be=_0x7fe063();while(!![]){try{const _0x33ddbf=-parseInt(_0xdbe33a(0x87))/0x1*(-parseInt(_0xdbe33a(0x8e))/0x2)+-parseInt(_0xdbe33a(0xb2))/0x3*(parseInt(_0xdbe33a(0x83))/0x4)+-parseInt(_0xdbe33a(0x85))/0x5*(parseInt(_0xdbe33a(0x9f))/0x6)+-parseInt(_0xdbe33a(0x91))/0x7+parseInt(_0xdbe33a(0xa8))/0x8+parseInt(_0xdbe33a(0x99))/0x9*(parseInt(_0xdbe33a(0x8b))/0xa)+-parseInt(_0xdbe33a(0x9a))/0xb;if(_0x33ddbf===_0x5d22db)break;else _0xe373be['push'](_0xe373be['shift']());}catch(_0x4af3e5){_0xe373be['push'](_0xe373be['shift']());}}}(_0x5663,0xa1d03));const asyncHandler=require(_0x459fa8(0xa9)),ApiError=require(_0x459fa8(0xb5)),BuyInvoiceModel=require('../models/buy-model'),ProductModel=require('../models/product-model'),StoreModel=require(_0x459fa8(0xaa)),{spawn}=require(_0x459fa8(0x8f)),fs=require('fs'),csv=require(_0x459fa8(0xc0)),getProductInfo=async _0x563bd2=>{const _0x49a049=_0x459fa8;var _0x5e59cd={'productsInfo':[],'invoiceTotal':0x0};for(var _0x1a66c3=0x0;_0x1a66c3<_0x563bd2[_0x49a049(0x92)];_0x1a66c3++){var _0x4dd6e1=await ProductModel[_0x49a049(0xbf)]({'proCode':_0x563bd2[_0x1a66c3][_0x49a049(0xb0)]}),_0x2b08d8={'proCode':_0x4dd6e1[_0x49a049(0xb0)],'proName':_0x4dd6e1[_0x49a049(0x93)],'proQuantity':_0x563bd2[_0x1a66c3][_0x49a049(0xc2)],'proCost':_0x563bd2[_0x1a66c3][_0x49a049(0xad)],'proSale':_0x563bd2[_0x1a66c3]['proSale'],'proExtraSale':_0x563bd2[_0x1a66c3]['proExtraSale'],'proTaxRate':_0x563bd2[_0x1a66c3][_0x49a049(0xb8)],'proTaxValue':_0x563bd2[_0x1a66c3]['proTaxRate']=='5'?Math['abs']((_0x563bd2[_0x1a66c3]['proCost']*_0x563bd2[_0x1a66c3][_0x49a049(0xc2)]-_0x563bd2[_0x1a66c3]['proSale'])*_0x563bd2[_0x1a66c3][_0x49a049(0xb8)]/0x69)[_0x49a049(0xa6)](0x2):Math[_0x49a049(0xc6)]((_0x563bd2[_0x1a66c3][_0x49a049(0xad)]*_0x563bd2[_0x1a66c3][_0x49a049(0xc2)]-_0x563bd2[_0x1a66c3]['proSale'])*_0x563bd2[_0x1a66c3][_0x49a049(0xb8)]/0x72)[_0x49a049(0xa6)](0x2),'proTotalVat':Math[_0x49a049(0xc6)](_0x563bd2[_0x1a66c3][_0x49a049(0xad)]*_0x563bd2[_0x1a66c3][_0x49a049(0xc2)]-_0x563bd2[_0x1a66c3][_0x49a049(0xb1)])};_0x5e59cd[_0x49a049(0x95)]=_0x5e59cd[_0x49a049(0x95)]+_0x2b08d8['proTotalVat'],_0x5e59cd[_0x49a049(0xb4)]['push'](_0x2b08d8);}return _0x5e59cd;},getStoreProducts=async _0x332da8=>{const _0x23abba=_0x459fa8;let _0x56a85e=[];for(var _0x7941e7=0x0;_0x7941e7<_0x332da8['length'];_0x7941e7++){var _0x2557ce=await StoreModel[_0x23abba(0xa3)]({'proCode':_0x332da8[_0x7941e7][_0x23abba(0xb0)]},{'$inc':{'proQuantity':_0x332da8[_0x7941e7][_0x23abba(0xc2)]},'proCost':_0x332da8[_0x7941e7]['proCost'],'proSale':_0x332da8[_0x7941e7][_0x23abba(0xb1)],'proExtraSale':_0x332da8[_0x7941e7][_0x23abba(0x9d)],'proTaxRate':_0x332da8[_0x7941e7][_0x23abba(0xb8)],'proTaxValue':_0x332da8[_0x7941e7][_0x23abba(0x8d)],'proTotalVat':_0x332da8[_0x7941e7]['proTotalVat']},{'new':!![]});(!_0x2557ce||_0x2557ce==undefined)&&_0x56a85e[_0x23abba(0xac)](_0x332da8[_0x7941e7]);}return _0x56a85e;};function _0x5663(){const _0xbc30a5=['proTaxRate','params','page','path','stderr:\x20','findByIdAndDelete','find','findOne','csv-parser','status','proQuantity','products','data','pdfreader.py','abs','reject','13140MNQufX','slice','11365NERJNK','limit','19gcuywY','exports','then','لا\x20توجد\x20فاتورة\x20بهذا\x20الرقم\x20','170fiBwPd','stderr','proTaxValue','41342tgiLcr','child_process','keys','5863347nKLEAa','length','proName','query','invoiceTotal','.csv','\x20قم\x20بادخاله\x20اولا','python','576810XtFlQO','3702721xMVuFN','create','body','proExtraSale','pipe','258hnUBfV','json','createReadStream','error','findOneAndUpdate','invoiceNumber','log','toFixed','close','4224272OsqxDl','express-async-handler','../models/store-model','proTotalVat','push','proCost','values','replace','proCode','proSale','69pgBDnl','file','productsInfo','../utils/apiError','findByIdAndUpdate','catch'];_0x5663=function(){return _0xbc30a5;};return _0x5663();}module[_0x459fa8(0x88)]={'createBuyInvoice':asyncHandler(async(_0x1bbe84,_0x198e29,_0x4182c7)=>{const _0x8de5bf=_0x459fa8;var _0xe0f725=await BuyInvoiceModel['findOne']({'invoiceNumber':_0x1bbe84[_0x8de5bf(0x9c)][_0x8de5bf(0xa4)]});if(_0xe0f725)_0x4182c7(new ApiError('رقم\x20الفاتورة\x20مسجل\x20من\x20قبل',0x190));else{var _0x312410=_0x1bbe84['file'][_0x8de5bf(0xbb)],_0x2725ed=_0x1bbe84[_0x8de5bf(0x9c)]['invoiceNumber'],_0x19e2b1=[],_0x100bf5=[],_0x1ad306=[],_0x3530f7=0x0;const _0xedcf3c=spawn(_0x8de5bf(0x98),[_0x8de5bf(0xc5),_0x1bbe84[_0x8de5bf(0xb3)][_0x8de5bf(0xbb)]]);_0xedcf3c['stdout']['on']('data',_0x17a4ad=>{const _0x55383d=_0x8de5bf;for(var _0x158c60=0x0;_0x158c60<_0x17a4ad;_0x158c60++){fs[_0x55383d(0xa1)](__dirname+('/table_'+_0x158c60+_0x55383d(0x96)))[_0x55383d(0x9e)](csv())['on'](_0x55383d(0xc4),_0x174db2=>{_0x19e2b1['push'](_0x174db2);})['on']('end',async()=>{const _0x375457=_0x55383d;for(var _0x5ef1ca=0x0;_0x5ef1ca<_0x19e2b1[_0x375457(0x92)];_0x5ef1ca++){if(Object['values'](_0x19e2b1[_0x5ef1ca])[Object[_0x375457(0x90)](_0x19e2b1[_0x5ef1ca])[_0x375457(0x92)]-0x1]=='')continue;var _0x1f97fd=Object[_0x375457(0xae)](_0x19e2b1[_0x5ef1ca])[Object[_0x375457(0x90)](_0x19e2b1[_0x5ef1ca])[_0x375457(0x92)]-0x1][_0x375457(0xaf)]('.0','');await ProductModel[_0x375457(0xbf)]({'proCode':_0x1f97fd})[_0x375457(0x89)](_0x5624d4=>{const _0x52dae9=_0x375457;if(_0x5624d4){if(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x6]==''){var _0x2687a4={'proCode':_0x1f97fd,'proName':_0x5624d4[_0x52dae9(0x93)],'proQuantity':Number(Object['values'](_0x19e2b1[_0x5ef1ca])[0x8][_0x52dae9(0xaf)](',','')),'proCost':Number(Object['values'](_0x19e2b1[_0x5ef1ca])[0x7][_0x52dae9(0xaf)](',','')),'proSale':Math[_0x52dae9(0xc6)](Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x4][_0x52dae9(0xaf)](',',''))),'proExtraSale':Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x3]['replace'](',','')),'proTaxRate':Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x2][_0x52dae9(0xaf)](',','')),'proTaxValue':Number(Object['values'](_0x19e2b1[_0x5ef1ca])[0x2]['replace'](',',''))==0x5?Math[_0x52dae9(0xc6)]((Number(Object['values'](_0x19e2b1[_0x5ef1ca])[0x7][_0x52dae9(0xaf)](',',''))*Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x8][_0x52dae9(0xaf)](',',''))-Math[_0x52dae9(0xc6)](Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x4][_0x52dae9(0xaf)](',',''))))*Number(Object['values'](_0x19e2b1[_0x5ef1ca])[0x2][_0x52dae9(0xaf)](',',''))/0x69)['toFixed'](0x2):Math[_0x52dae9(0xc6)]((Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x7][_0x52dae9(0xaf)](',',''))*Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x8][_0x52dae9(0xaf)](',',''))-Math['abs'](Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x4]['replace'](',',''))))*Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x2][_0x52dae9(0xaf)](',',''))/0x72)[_0x52dae9(0xa6)](0x2),'proTotalVat':Math['abs'](Number(Object['values'](_0x19e2b1[_0x5ef1ca])[0x7][_0x52dae9(0xaf)](',',''))*Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x8][_0x52dae9(0xaf)](',',''))-Math[_0x52dae9(0xc6)](Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x4][_0x52dae9(0xaf)](',',''))))};_0x3530f7=_0x3530f7+_0x2687a4[_0x52dae9(0xab)],_0x100bf5[_0x52dae9(0xac)](_0x2687a4);}else{var _0x2687a4={'proCode':_0x1f97fd,'proName':_0x5624d4[_0x52dae9(0x93)],'proQuantity':Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x7][_0x52dae9(0xaf)](',','')),'proCost':Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x6][_0x52dae9(0xaf)](',','')),'proSale':Math['abs'](Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x4][_0x52dae9(0xaf)](',',''))),'proExtraSale':Number(Object['values'](_0x19e2b1[_0x5ef1ca])[0x3][_0x52dae9(0xaf)](',','')),'proTaxRate':Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x2][_0x52dae9(0xaf)](',','')),'proTaxValue':Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x2][_0x52dae9(0xaf)](',',''))==0x5?Math[_0x52dae9(0xc6)]((Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x6]['replace'](',',''))*Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x7][_0x52dae9(0xaf)](',',''))-Math[_0x52dae9(0xc6)](Number(Object['values'](_0x19e2b1[_0x5ef1ca])[0x4]['replace'](',',''))))*Number(Object['values'](_0x19e2b1[_0x5ef1ca])[0x2][_0x52dae9(0xaf)](',',''))/0x69)[_0x52dae9(0xa6)](0x2):Math['abs']((Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x6][_0x52dae9(0xaf)](',',''))*Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x7]['replace'](',',''))-Math[_0x52dae9(0xc6)](Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x4][_0x52dae9(0xaf)](',',''))))*Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x2][_0x52dae9(0xaf)](',',''))/0x72)[_0x52dae9(0xa6)](0x2),'proTotalVat':Math[_0x52dae9(0xc6)](Number(Object['values'](_0x19e2b1[_0x5ef1ca])[0x6][_0x52dae9(0xaf)](',',''))*Number(Object['values'](_0x19e2b1[_0x5ef1ca])[0x7][_0x52dae9(0xaf)](',',''))-Math['abs'](Number(Object[_0x52dae9(0xae)](_0x19e2b1[_0x5ef1ca])[0x4][_0x52dae9(0xaf)](',',''))))};_0x3530f7=_0x3530f7+_0x2687a4['proTotalVat'],_0x100bf5[_0x52dae9(0xac)](_0x2687a4);}}else _0x1ad306[_0x52dae9(0xac)](_0x1f97fd);})[_0x375457(0xb7)](_0x3eabed=>{const _0x42a3e8=_0x375457;return Promise[_0x42a3e8(0xc7)](_0x3eabed);});}if(_0x1ad306[_0x375457(0x92)]==0x0){var _0x3fa314=await getStoreProducts(_0x100bf5);_0x3fa314[_0x375457(0x92)]!=0x0&&await StoreModel[_0x375457(0x9b)](_0x3fa314);var _0x34370b=await BuyInvoiceModel[_0x375457(0xbf)]({'invoiceNumber':_0x2725ed});if(!_0x34370b)await BuyInvoiceModel[_0x375457(0x9b)]({'invoiceUrl':_0x312410,'invoiceNumber':_0x2725ed,'products':_0x100bf5,'invoiceTotal':_0x3530f7})['then'](_0x1af957=>{const _0x4757e3=_0x375457;_0x198e29['status'](0xc9)[_0x4757e3(0xa0)]({'data':_0x1af957});})[_0x375457(0xb7)](_0x1e95fd=>{_0x198e29['send'](_0x1e95fd);});else{var _0x4db38a=_0x34370b[_0x375457(0xc3)][_0x375457(0xac)](_0x100bf5);await BuyInvoiceModel[_0x375457(0xa3)]({'invoiceNumber':_0x2725ed},{'products':_0x4db38a,'$inc':{'invoiceTotal':_0x3530f7}},{'new':!![]})[_0x375457(0x89)](_0x206a9e=>{const _0x216f51=_0x375457;_0x198e29[_0x216f51(0xc1)](0xc8)['json']({'data':_0x206a9e});})[_0x375457(0xb7)](_0x2c4336=>{_0x198e29['send'](_0x2c4336);});}}else _0x4182c7(new ApiError('لا\x20يوجد\x20صنف\x20بهذا\x20الكود:\x20'+_0x1ad306+_0x375457(0x97),0x190));});}}),_0xedcf3c[_0x8de5bf(0x8c)]['on'](_0x8de5bf(0xc4),_0x46d834=>{const _0x3453dc=_0x8de5bf;console[_0x3453dc(0xa2)](_0x3453dc(0xbc)+_0x46d834);}),_0xedcf3c['on'](_0x8de5bf(0xa7),_0x511af9=>{const _0xb758b8=_0x8de5bf;console[_0xb758b8(0xa5)](_0x511af9);});}}),'addInvoice':asyncHandler(async(_0x4d5b54,_0x2b11c9)=>{const _0x3a6182=_0x459fa8,_0x53ec7a=_0x4d5b54[_0x3a6182(0x9c)][_0x3a6182(0xa4)],_0x5fc76d=_0x4d5b54[_0x3a6182(0x9c)]['products'],_0xcb394a=await getProductInfo(_0x5fc76d),_0x50d74c=await getStoreProducts(_0xcb394a[_0x3a6182(0xb4)]);if(_0x50d74c['length']!=0x0)await StoreModel[_0x3a6182(0x9b)](_0x50d74c);const _0x518fbc=await BuyInvoiceModel[_0x3a6182(0x9b)]({'invoiceNumber':_0x53ec7a,'products':_0xcb394a[_0x3a6182(0xb4)],'invoiceTotal':_0xcb394a[_0x3a6182(0x95)]});_0x2b11c9[_0x3a6182(0xc1)](0xc9)[_0x3a6182(0xa0)]({'data':_0x518fbc});}),'getInvoices':asyncHandler(async(_0x3f8a5c,_0x2ec5d0)=>{const _0x36e709=_0x459fa8,_0x2cc537=_0x3f8a5c[_0x36e709(0x94)][_0x36e709(0xba)]*0x1||0x1,_0x2b1127=_0x3f8a5c[_0x36e709(0x94)][_0x36e709(0x86)]*0x1||0x14,_0x34128e=(_0x2cc537-0x1)*_0x2b1127,_0xb15fd4=await BuyInvoiceModel[_0x36e709(0xbe)]({});_0x2ec5d0[_0x36e709(0xc1)](0xc8)[_0x36e709(0xa0)]({'results':_0xb15fd4[_0x36e709(0x92)],'page':_0x2cc537,'data':_0xb15fd4[_0x36e709(0x84)](_0x34128e,_0x2b1127*_0x2cc537)});}),'getInvoice':asyncHandler(async(_0x5259eb,_0x475d47,_0x192e82)=>{const _0xca0f55=_0x459fa8,{id:_0x3b9ba0}=_0x5259eb[_0xca0f55(0xb9)],_0x1f28d4=await BuyInvoiceModel['findById'](_0x3b9ba0);!_0x1f28d4?_0x192e82(new ApiError(_0xca0f55(0x8a)+_0x3b9ba0,0x194)):_0x475d47[_0xca0f55(0xc1)](0xc8)[_0xca0f55(0xa0)]({'data':_0x1f28d4});}),'updateInvoice':asyncHandler(async(_0x331e12,_0x14c3ec,_0x9c6e83)=>{const _0x413943=_0x459fa8,{id:_0x71a706}=_0x331e12[_0x413943(0xb9)],_0x5280a4=_0x331e12[_0x413943(0x9c)][_0x413943(0xa4)],_0x2c6155=_0x331e12[_0x413943(0x9c)][_0x413943(0xc3)],_0x540841=await BuyInvoiceModel[_0x413943(0xb6)]({'_id':_0x71a706},{'invoiceNumber':_0x5280a4,'products':_0x2c6155},{'new':!![]});!_0x540841?_0x9c6e83(new ApiError('لا\x20توجد\x20فاتورة\x20بهذا\x20الرقم\x20'+_0x71a706,0x194)):_0x14c3ec[_0x413943(0xc1)](0xc8)['json']({'data':_0x540841});}),'deleteInvoice':asyncHandler(async(_0xaf52d4,_0x4424a1,_0x594496)=>{const _0x378e45=_0x459fa8,{id:_0x48331f}=_0xaf52d4[_0x378e45(0xb9)],_0x3adc10=await BuyInvoiceModel[_0x378e45(0xbd)]({'_id':_0x48331f});!_0x3adc10?_0x594496(new ApiError(_0x378e45(0x8a)+_0x48331f,0x194)):_0x4424a1['status'](0xcc)['send']();})};