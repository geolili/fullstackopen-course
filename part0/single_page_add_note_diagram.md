sequenceDiagram
    participant browser
    participant server

    Note right of browser: User writes a note and clicks Save

    browser->>server: POST /exampleapp/new_note_spa
    activate server
    Note left of server: Server saves the note
    server-->>browser: 200 OK (JSON response)
    deactivate server

    Note right of browser: JavaScript updates the notes list without reloading the page