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
  facebookRedirectUrl: 'https://dev.relovely.com/account/facebook',
  facebooLinkRedirectUrl: 'https://dev.relovely.com/account/facebook?type=link',
  instagramLinkRedirectUrl: 'https://dev.relovely.com/account/instagram',
  instagramAuthUrl: `https://api.instagram.com/oauth/authorize?scope=user_profile&response_type=code`,
  instagramClientId: '600076470775068',
  instagramSignupRedirectUrl: 'https://dev.relovely.com/account/instagram',
  cloudinaryApiKey: '398779565118789',
  cloudinaryCloudName: 'relovely',
  cloudinaryImageUploadPreset: 'images',
  cloudinaryVideoUploadPreset: 'videos',
  cloudinaryUploadUrl: 'https://api.cloudinary.com/v1_1/relovely',
  stripePublishableKey: 'pk_live_xbVCEJi1UZHkF5Dlwo87kIEx00nirGQprR',
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
