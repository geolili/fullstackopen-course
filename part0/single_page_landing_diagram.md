sequenceDiagram
    participant browser
    participant server

    Note right of browser: User opens SPA page

    browser->>server: GET /exampleapp/spa
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET /exampleapp/spa.js
    server-->>browser: JavaScript file

    Note right of browser: Browser executes JavaScript

    browser->>server: GET /exampleapp/data.json
    activate server
    server-->>browser: Notes JSON (200 or 304)
    deactivate server

    Note right of browser: Notes are rendered