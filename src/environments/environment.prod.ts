const packageJson = require('../../package.json');

export const environment = {
  appName: 'Relovely',
  envName: 'PROD',
  production: true,
  test: false,
  i18nPrefix: '/relovely',
  apiUrl: 'https://159.203.68.161',
  instagramAuthUrl: `https://api.instagram.com/oauth/authorize?scope=user_profile,user_media&response_type=code`,
  instagramAccessTokenUrl: 'https://api.instagram.com/oauth/access_token',
  instagramGraphUrl: 'https://graph.instagram.com',
  instagramClientId: '600076470775068',
  instagramSignupRedirectUrl: 'https://192.34.56.220/account/instagram?signup=true',
  instagramSigninRedirectUrl: 'https://192.34.56.220/account/instagram',
  cloudinaryCloudName: 'relovely',
  cloudinaryUploadPreset: 'edd6ppmi',
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
