# my-rest-api proj
Hello, my name is Dikla and this is my node.js project- 'my rest api'.
this project is a Server-side development for a web application that includes a website management system that allows business users
publish content, edit and delete it.
I have made an API addresses instructions tables on POSTMAN, for Users and Cards, on the links below:
- Users--> https://documenter.getpostman.com/view/28260254/2sA2r6WPJF#ea0a28d8-67d4-482c-bde4-908a58f1942f
- Cards--> https://documenter.getpostman.com/view/28260254/2sA2r81PUn#intro

the technologies I used for this project are:
- node j.s
- mongoDB
- express.js

### packages included on this project:

- bcryptjs: A new user's password is encrypted before saving it to the mongoDB database with
this directory, and during the login process make sure that the password sent by the client matches the password
stored in the database. 

- joi: used in order to perform validation on objects received from a client
and if the object does not pass the validation, you must send a reply with an appropriate status and a message
corresponding error.

- jsonwebtoken: used in order to create an encrypted token that will contain information
about the user trying to connect. 

- morgan: used to create a logger for the application. The logger will printin the console all the requests that are sent to the server and it will detail each request at what time it was sent, The method of sending the request, what URL it was sent to, the status of the response, and how long it took to provide
answer

- cors: used to enable sending HTTP requests from authorized addressesonly 

- chalk: used in order to color the prints in the console with a color that matches the content the printing 

- mongoose: used to create models of Users and Cards, with The appropriate keys on the server side so that the object that will be saved in the database with the right data. 

- cross-env: simplifies the process of setting environment variables in a cross-platform manner, making it easier to work with different environments during development and deployment.

- dotenv: simplifies the process of managing environment variables in Node.js applications by allowing to store them in a separate file ( .env) and load them into process.env with minimal configuration. This makes it easier to manage configuration settings across different environments and keeps sensitive information out of the codebase.

- lodash: simplify JavaScript development by providing a wide range of functions for common programming tasks.

this project also contains:

- in http requests, the response's returned to the surfer with the data he requested according to his permissions.
to an extent that the user does not have permissions or that a request was sent by a client with missing or incorrect data
return a reply to the surfer with the appropriate status and the appropriate error message.

- reciving json in the body of HTTP requests are enabled requests that are not intercepted by the application are routed to the public folder (inside static folder) on the server, and only if the file not found in it sending a 404 error message to the surfer with the appropriate caption

### env's:
it also includes env.development.example (using: npm run dev) and env.production.example (using: npm run start), in order to use this backend server on two optional environments (local and atlas cloud).

### endpoints:
the routes files, by controllers files, contains several endpoints, which defined the actions that can be used on the backend server's app.

### initial data:
three instances of business cards and three instances of users (regular user, business and admin) are created.

### logger:
the logger file operates on all requests with a status code of 400 or higher and creates for each one in the logs folder
a file whose name will be the date of that day (unless this file already exists), and in it will be recorded:
the request date, the code status, and the error message

### blocking user:
user who tried to log in three times in a row, using the same email but with an incorrect password, is blocked for 24 hours.

