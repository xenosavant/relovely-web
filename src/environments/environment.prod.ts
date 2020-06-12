const packageJson = require('../../package.json');

export const environment = {
  appName: 'Relovely',
  envName: 'PROD',
  production: true,
  test: false,
  i18nPrefix: '/relovely',
  apiUrl: 'https://api.relovely.com',
  facebookAuthUrl: 'https://www.facebook.com/v6.0/dialog/oauth',
  facebookClientId: '498359121110237',
  facebookRedirectUrl: 'https://dev.relovely.com/account/facebook',
  facebooLinkRedirectUrl: 'https://dev.relovely.com/account/facebook?type=link',
  instagramAuthUrl: `https://api.instagram.com/oauth/authorize`,
  instagramLinkRedirectUrl: 'https://dev.relovely.com/account/instagram',
  instagramClientId: '600076470775068',
  instagramSignupRedirectUrl: 'https://dev.relovely.com/account/instagram',
  cloudinaryApiKey: '398779565118789',
  cloudinaryCloudName: 'relovely',
  cloudinaryUploadPreset: 'ml_default',
  cloudinaryUploadUrl: 'https://api.cloudinary.com/v1_1/relovely',
  stripePublishableKey: 'pk_test_t9a6DNSxt1hqrd6kzctGFgHI00JZoXOBuP',
  versions: {
    app: packageJson.version,
    angular: packageJson.dependencies['@angular/core'],
    ngrx: packageJson.dependencies['@ngrx/store'],
    material: packageJson.dependencies['@angular/material'],
    bootstrap: packageJson.dependencies.bootstrap,
    rxjs: packageJson.dependencies.rxjs,
    fontAwesome:
      packageJson.dependencies['@fortawesome/fontawesome-free-webfonts'],
    angularCli: packageJson.devDependencies['@angular/cli'],
    typescript: packageJson.devDependencies['typescript'],
    cypress: packageJson.devDependencies['cypress']
  }
};
