const _0x4e99ef=_0x4ec4;(function(_0x3034f3,_0x1fae7b){const _0x14abdc=_0x4ec4,_0x1b5e60=_0x3034f3();while(!![]){try{const _0x1a54f9=-parseInt(_0x14abdc(0x106))/0x1+parseInt(_0x14abdc(0x114))/0x2+-parseInt(_0x14abdc(0x109))/0x3+parseInt(_0x14abdc(0x10a))/0x4+parseInt(_0x14abdc(0x108))/0x5*(-parseInt(_0x14abdc(0x107))/0x6)+-parseInt(_0x14abdc(0x116))/0x7+parseInt(_0x14abdc(0x103))/0x8*(parseInt(_0x14abdc(0x110))/0x9);if(_0x1a54f9===_0x1fae7b)break;else _0x1b5e60['push'](_0x1b5e60['shift']());}catch(_0x1259fa){_0x1b5e60['push'](_0x1b5e60['shift']());}}}(_0xdfb0,0xc171d));function _0x4ec4(_0x5b6491,_0x28395e){const _0xdfb066=_0xdfb0();return _0x4ec4=function(_0x4ec471,_0x19d4d6){_0x4ec471=_0x4ec471-0x103;let _0xee8353=_0xdfb066[_0x4ec471];return _0xee8353;},_0x4ec4(_0x5b6491,_0x28395e);}function _0xdfb0(){const _0x2a2db4=['/addInvoice','single','post','../controllers/sale-controller','8tOiTjf','delete','express','244537vkGdgZ','6YIfdgm','5623275uYRkYz','4420692XVbCib','3845344siGyBb','Router','/getInvoice/:id','diskStorage','multer','./server/uploads','28837422cfKfdM','/getInvoices','/deleteInvoice/:id','../controllers/auth-controller','954446hVXsRl','originalname','7053284CsukrX','exports','put','get'];_0xdfb0=function(){return _0x2a2db4;};return _0xdfb0();}const express=require(_0x4e99ef(0x105)),multer=require(_0x4e99ef(0x10e)),storage=multer[_0x4e99ef(0x10d)]({'destination':(_0x52fb5a,_0x1a282,_0x14014c)=>{const _0x1a23a6=_0x4e99ef;_0x14014c(null,_0x1a23a6(0x10f));},'filename':(_0x212e9b,_0x542a48,_0x1c287a)=>{const _0x1d9415=_0x4e99ef;_0x1c287a(null,_0x542a48[_0x1d9415(0x115)]);}}),upload=multer({'storage':storage}),{checkToken}=require(_0x4e99ef(0x113)),{addInvoiceValidator,getInvoiceValidator,updateInvoiceValidator,deleteInvoiceValidator}=require('../utils/validations/sale-validator'),{createSaleInvoice,addInvoice,getInvoices,getInvoice,updateInvoice,deleteInvoice}=require(_0x4e99ef(0x11d)),router=express[_0x4e99ef(0x10b)]();router['post']('/saveInvoice',upload[_0x4e99ef(0x11b)]('invoiceFile'),createSaleInvoice),router[_0x4e99ef(0x11c)](_0x4e99ef(0x11a),checkToken,addInvoiceValidator,addInvoice),router[_0x4e99ef(0x119)](_0x4e99ef(0x111),checkToken,getInvoices),router[_0x4e99ef(0x119)](_0x4e99ef(0x10c),checkToken,getInvoiceValidator,getInvoice),router[_0x4e99ef(0x118)]('/updateProduct/:id',checkToken,updateInvoiceValidator,updateInvoice),router[_0x4e99ef(0x104)](_0x4e99ef(0x112),checkToken,deleteInvoiceValidator,deleteInvoice),module[_0x4e99ef(0x117)]=router;