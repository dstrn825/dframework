/*
 * dframework (https://framework.dstrn.xyz/)
 * Copyright 2021-2025 dstrn
 * Licensed under CC BY-NC-SA 4.0 (https://github.com/dstrn825/dframework/blob/main/LICENSE)
 */

const authRequest = require("../lib/authRequest");

const handler = async (event) => {
  try {
    authRequest(event);

    const body = JSON.parse(event.body);
    const result = doSomething(body);
   
    return { statusCode: 200, body: result };

  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

function doSomething(arg){
    return "something";
}

module.exports = { handler };