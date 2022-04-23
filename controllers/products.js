const Product = require('../models/product')


exports.getAddProduct =  (req, res, next) => {
    res.render('add-firmware', {
      pageTitle: 'Add Product',
      pathh: '/admin/add-firmware',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      isAuthanticated : req.isLoggedIn
    });
  };

exports.postAddProduct = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let product = new Product(
    {
      projectName: req.body.projectName,
      version: req.body.version,
      details: req.body.details,
      byteArray: req.files.sampleFile.data
    }
  )
  product.save()
  .then(()=>{
    res.redirect('/');
  })
  .catch(err=>console.log(err))
    
};

exports.getProducts =  (req, res, next) => {
    console.log(req.session)
    console.log(req.session.isLoggedIn)
    Product.find().then(firmwares => {
      res.render('main', {
        firmwares: firmwares,
        pageTitle: 'Firmware Update Page',
        pathh: '/',
        activeShop: true,
        isAuthanticated : req.session.isLoggedIn
      });
    })
    
};

exports.getProduct =  (req, res, next) => {
  Product.findById(req.params.firmwareId).then(
    firmware=>{
      firmware.byteArray = new Uint8Array(firmware.byteArray.buffer)
        var jsArray = Array.from(firmware.byteArray)
        res.render('firmware-detail', {
          firmware: firmware,
          firmwareContent : JSON.stringify(jsArray),
          pageTitle: 'Firmware Detail Page',
          pathh: '/',
          isAuthanticated : req.session.isLoggedIn
        });
    }
  )
};

exports.pageNotFound = (req, res, next) => {
    res.status(404).render('404', { 
      pageTitle: 'Page Not Found' ,
      isAuthanticated : req.isLoggedIn
  });
};

