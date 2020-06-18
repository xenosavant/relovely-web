const packageJson = require('../../package.json');

export const environment = {
  appName: 'Relovely',
  envName: 'PROD',
  production: true,
  test: false,
  i18nPrefix: '/relovely',
  apiUrl: '/api',
  facebookAuthUrl: 'https://www.facebook.com/v6.0/dialog/oauth',
  facebookClientId: '498359121110237',
  facebookRedirectUrl: 'https://www.relovely.com/account/facebook',
  facebooLinkRedirectUrl: 'https://www.relovely.com/account/facebook?type=link',
  instagramAuthUrl: `https://api.instagram.com/oauth/authorize?scope=user_profile&response_type=code`,
  instagramLinkRedirectUrl: 'https://www.relovely.com/account/instagram',
  instagramClientId: '600076470775068',
  instagramSignupRedirectUrl: 'https://www.relovely.com/account/instagram',
  cloudinaryApiKey: '398779565118789',
  cloudinaryCloudName: 'relovely',
  cloudinaryImageUploadPreset: 'images',
  cloudinaryVideoUploadPreset: 'videos',
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
