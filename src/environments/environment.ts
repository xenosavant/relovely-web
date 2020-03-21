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
  apiUrl: '/api',,
  facebookAuthUrl: 'https://www.facebook.com/v6.0/dialog/oauth',
  facebookClientId: '498359121110237',
  facebookSignupRedirectUrl: 'https://192.34.56.220/account/facebook?type=signup',
  facebookSigninRedirectUrl: 'https://192.34.56.220/account/facebook?type=signin',
  facebooLinkRedirectUrl: 'https://192.34.56.220/account/facebook?type=link',
  instagramAuthUrl: `https://api.instagram.com/oauth/authorize?scope=user_profile,user_media&response_type=code`,
  instagramClientId: '600076470775068',
  instagramSigninRedirectUrl: 'https://192.34.56.220/account/instagram?type=signin',
  instagramLinkRedirectUrl: 'https://192.34.56.220/account/instagram?type=link',
  cloudinaryCloudName: 'relovely',
  cloudinaryUploadPreset: 'ml_default',
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
