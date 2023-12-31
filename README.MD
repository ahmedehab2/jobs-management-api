# Express.js Application

This Express.js application provides user authentication and job management via RESTful APIs.

## Table of Contents

- [Introduction](#introduction)
- [Middleware](#middleware)
- [Routes](#routes)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)

## Introduction

The Job Application Management API simplifies the process of managing job applications. It offers a range of features to help users efficiently track, create, update, and delete job applications, enhancing their job search experience. This API is built on top of the Express.js framework and can be integrated into various applications or services.

## Middleware

### Rate Limiting

The application utilizes rate limiting to prevent abuse of the APIs. Requests are limited to a maximum of 100 requests every 15 minutes.

### Helmet

[Helmet](https://www.npmjs.com/package/helmet) helps secure the application by setting various HTTP headers. It enhances security by adding important security-related headers to HTTP responses.

### CORS

[CORS](https://www.npmjs.com/package/cors) is configured to enable Cross-Origin Resource Sharing, ensuring that the API can be accessed from different origins.

### Error Handling

Error handling middleware is implemented to gracefully handle errors and provide appropriate responses to clients.

## Routes

### Authentication

The `/api/v1/auth` route is responsible for user authentication. It includes routes for registration, login, and other authentication-related functionality.

### Job Management

The `/api/v1/jobs` route handles job management. It is protected by authentication middleware to ensure that only authorized users can access these endpoints.

## Installation

1. Clone the repository.
2. Install the required dependencies using `npm install`.
3. Set up a MongoDB database and configure the connection in your application.

## Usage

1. Start the application using `npm run dev`.
2. Access the API endpoints as described in the routes section above.

## Testing

1. The project uses jest for testing, with supertest for routes test.
2. Run Test using `npm run test`
