# Serverless To-do List
This application will allow creating/removing/updating/fetching To-do items. Each To-do item can optionally have an attachment image. Each user only has access to To-do items that he/she has created.

## Prerequisites

* <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
* <a href="https://github.com" target="_blank">GitHub account</a>
* <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 12.xx 
* [Serverless](https://www.serverless.com/)
   
# Structure
## Backend
### Functions
The following functions are implemented:
* `Auth` - implement a custom authorizer for API Gateway that should be added to all other functions.

* `Get Todos` - return all TODOs for a current user. A user id can be extracted from a JWT token that is sent by the frontend
* `Create Todo` - create a new TODO for a current user.
* `Update Todo` - update a TODO item created by a current user

* `DeleteTodo` - delete a TODO item created by a current user.

* `Upload an image` - upload an image for the TODO

### Deployment
```bash
# Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
serverless login
# Configure serverless to use the AWS credentials to deploy the application
sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless

cd backend
serverless deploy --verbose --aws-profile serverless
```
# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

# How to run the application

## Backend

To deploy an application run the following commands:

```
sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
cd backend
npm install
sls deploy -v --aws-profile serverless
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/import-collection-3.png?raw=true "Image 3")


Right click on the imported collection to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true "Image 4")

Provide variables for the collection (similarly to how this was done in the course):

![Alt text](images/import-collection-5.png?raw=true "Image 5")
