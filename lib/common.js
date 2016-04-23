import * as Backendless from 'backendless';

export const BackendlessApp = {
  appId: 'DA58283E-DD7C-8163-FFB7-8566A31AD300',
  secretKey: '6323E9A0-3707-1179-FF1C-F1E3AB3FDD00',
  ver:'v1',
}

Backendless.initApp( BackendlessApp.appId, BackendlessApp.secretKey, BackendlessApp.ver );
//Backendless.enablePromises();
