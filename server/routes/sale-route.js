function _0x1ff6(_0x1fc3b2,_0x534e35){const _0x5f720f=_0x5f72();return _0x1ff6=function(_0x1ff6f7,_0x1480b4){_0x1ff6f7=_0x1ff6f7-0x195;let _0x536e87=_0x5f720f[_0x1ff6f7];return _0x536e87;},_0x1ff6(_0x1fc3b2,_0x534e35);}const _0x5b98f0=_0x1ff6;function _0x5f72(){const _0x11ddc0=['1648ynEztB','/updateProduct/:id','get','invoiceFile','189PzqJlH','38942563vZFiYV','1177539hqQcIN','1974TwCOmo','77KbnhmL','/saveInvoice','498156WWFsVD','single','672070nZcMdt','8tfTkXW','delete','diskStorage','put','11226056BXYaBa','multer','../utils/validations/sale-validator','./server/uploads','/getInvoices','post','../controllers/auth-controller','/addInvoice','express','/getSingleInvoiceReport','5341770JjWRlt'];_0x5f72=function(){return _0x11ddc0;};return _0x5f72();}(function(_0x5caf19,_0x2f32a8){const _0xf9edf6=_0x1ff6,_0x4f876d=_0x5caf19();while(!![]){try{const _0x94688b=parseInt(_0xf9edf6(0x1a2))/0x1*(parseInt(_0xf9edf6(0x1a9))/0x2)+-parseInt(_0xf9edf6(0x1a8))/0x3*(-parseInt(_0xf9edf6(0x1af))/0x4)+parseInt(_0xf9edf6(0x1a1))/0x5+parseInt(_0xf9edf6(0x1ac))/0x6*(parseInt(_0xf9edf6(0x1aa))/0x7)+parseInt(_0xf9edf6(0x197))/0x8+parseInt(_0xf9edf6(0x1a6))/0x9*(-parseInt(_0xf9edf6(0x1ae))/0xa)+-parseInt(_0xf9edf6(0x1a7))/0xb;if(_0x94688b===_0x2f32a8)break;else _0x4f876d['push'](_0x4f876d['shift']());}catch(_0x5ab1cd){_0x4f876d['push'](_0x4f876d['shift']());}}}(_0x5f72,0xce477));const express=require(_0x5b98f0(0x19f)),multer=require(_0x5b98f0(0x198)),storage=multer[_0x5b98f0(0x195)]({'destination':(_0x22caaf,_0x4cc4ad,_0x4a63b3)=>{const _0x44b164=_0x5b98f0;_0x4a63b3(null,_0x44b164(0x19a));},'filename':(_0x5c2ae5,_0x26d30e,_0x2c5939)=>{_0x2c5939(null,_0x26d30e['originalname']);}}),upload=multer({'storage':storage}),{checkToken}=require(_0x5b98f0(0x19d)),{addInvoiceValidator,getInvoiceValidator,updateInvoiceValidator,deleteInvoiceValidator}=require(_0x5b98f0(0x199)),{createSaleInvoice,addInvoice,getInvoices,getInvoice,updateInvoice,deleteInvoice,getReport,getSingleReport}=require('../controllers/sale-controller'),router=express['Router']();router['post'](_0x5b98f0(0x1ab),upload[_0x5b98f0(0x1ad)](_0x5b98f0(0x1a5)),createSaleInvoice),router[_0x5b98f0(0x19c)](_0x5b98f0(0x19e),checkToken,addInvoiceValidator,addInvoice),router['get'](_0x5b98f0(0x19b),checkToken,getInvoices),router[_0x5b98f0(0x1a4)]('/getInvoice/:id',checkToken,getInvoiceValidator,getInvoice),router[_0x5b98f0(0x196)](_0x5b98f0(0x1a3),checkToken,updateInvoiceValidator,updateInvoice),router[_0x5b98f0(0x1b0)]('/deleteInvoice/:id',checkToken,deleteInvoiceValidator,deleteInvoice),router['post']('/getInvoicesReport',checkToken,getReport),router[_0x5b98f0(0x19c)](_0x5b98f0(0x1a0),checkToken,getSingleReport),module['exports']=router;