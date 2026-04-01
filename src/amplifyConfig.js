import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'your-region_xxxxxxxxx', // e.g. us-east-1_abcd123
      userPoolClientId: 'your-app-client-id' 
    }
  }
});