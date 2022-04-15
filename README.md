## ParagraphApp Backend

## Install Server
Run `npm install` for install app packages .

Run `npm start` to run app.

## Config Project 

Create a file and name it: `.env`

and copy these lines:

```javascript
PORT=3000
secret=yourSecretKey
cookieName=yourCookieName
local_mongodb=mongodb://localhost:27017/Paragraph_DB
mongo_DB_NAME=Paragraph_DB
NODE_ENV=testing
```

## Generate Data

make sure you register as a user by calling:
`http://localhost:3000/api/users/register`

and get the `token` from the response to pass it as Bearer Token in request headers

after that you can generate dummy list of paragraphs by calling: (need jwt token)
`http://localhost:3000/api/dummy/add-paragraphs`