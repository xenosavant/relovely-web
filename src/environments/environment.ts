// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const packageJson = require('../../package.json');

export const environment = {
  appName: 'Relovely',
  envName: 'DEV',
  production: false,
  test: false,
  i18nPrefix: '',
  apiUrl: '/api',
  facebookAuthUrl: 'https://www.facebook.com/v6.0/dialog/oauth',
  facebookClientId: '498359121110237',
  facebookSignupRedirectUrl: 'https://dev.relovely.com/account/facebook?type=signup',
  facebookSigninRedirectUrl: 'https://dev.relovely.com/account/facebook?type=signin',
  facebooLinkRedirectUrl: 'https://dev.relovely.com/account/facebook?type=link',
  instagramAuthUrl: `https://api.instagram.com/oauth/authorize?scope=user_profile,user_media&response_type=code`,
  instagramClientId: '600076470775068',
  instagramSignupRedirectUrl: 'https://dev.relovely.com/account/instagram?type=signin',
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
    fontAwesome: packageJson.dependencies['@fortawesome/fontawesome-free'],
    angularCli: packageJson.devDependencies['@angular/cli'],
    typescript: packageJson.devDependencies['typescript'],
    cypress: packageJson.devDependencies['cypress']
  }
};
