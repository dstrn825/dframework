/*
 * dframework (https://framework.dstrn.xyz/)
 * Copyright 2021-2025 dstrn
 * Licensed under CC BY-NC-SA 4.0 (https://github.com/dstrn825/dframework/blob/main/LICENSE)
 */

function authRequest(event){
    if(!event) throw new Error("Invalid request");

    const target = {
        host: ["localhost:8888"] // add more hosts
    };

    const headers = event.headers;
    const host = headers["host"];
    const forwardedHost = headers["x-forwarded-host"];

    if(!(target.host.includes(host) || target.host.includes(forwardedHost))) throw new Error("Invalid request");
}

function sanitize(element) {
    const escapeHtml = (str) => {
      return str.replace(/[&<>"'/]/g, (match) => {
        const escapeChars = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
          '/': '&#47;',
        };
        return escapeChars[match];
      });
    };
  
    const removeEventHandlers = (str) => {
      return str.replace(/\s*(on\w+)=["'][^"']*["']/gi, (match) => {
        return '';
      }).replace(/javascript\s*:\s*/gi, '');
    };

    const sanitizeString = (str) => {
      let sanitizedString = escapeHtml(str);
      sanitizedString = removeEventHandlers(sanitizedString);

      return sanitizedString;
    };
  
    if (typeof element === 'string') {
      return sanitizeString(element);
    }
  
    if (Array.isArray(element)) {
      return element.map(item => sanitize(item));
    }
  
    if (typeof element === 'object' && element !== null) {
      const sanitizedObject = {};
      for (const key in element) {
        if (Object.hasOwnProperty.call(element, key)) {
          sanitizedObject[key] = sanitize(element[key]);
        }
      }
      return sanitizedObject;
    }

    return element;
  }

/*
 * add more utility functions here
 */

module.exports = { authRequest, sanitize };