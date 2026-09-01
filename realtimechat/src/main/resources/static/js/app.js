/* ======================================================
   RESET
====================================================== */

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html,
body {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

body {
    font-family: Arial, Helvetica, sans-serif;
    background: #111;
    color: white;
}


/* ======================================================
   LOGIN / SIGNUP
====================================================== */

.auth-container {
    width: 100%;
    min-height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 20px;

    background: #f4f7fb;
}

.auth-box {
    width: 400px;
    max-width: 100%;

    padding: 40px;

    background: white;

    border-radius: 18px;

    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);

    text-align: center;
}

.auth-box h1 {
    font-size: 34px;
    color: #1683ff;
    margin-bottom: 10px;
}

.auth-box > p {
    color: #777;
    font-size: 16px;
    margin-bottom: 25px;
}

.auth-box form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.auth-box input {
    width: 100%;
    height: 52px;

    padding: 0 16px;

    border: 1px solid #d9e0e8;
    border-radius: 10px;

    outline: none;

    background: #f8fafc;
    color: #222;

    font-size: 16px;
}

.auth-box input:focus {
    border-color: #1683ff;

    background: white;

    box-shadow: 0 0 0 3px rgba(22, 131, 255, 0.1);
}

.auth-box button {
    width: 100%;
    height: 52px;

    border: none;
    border-radius: 10px;

    background: #1683ff;
    color: white;

    font-size: 17px;
    font-weight: bold;

    cursor: pointer;
}

.auth-box button:hover {
    background: #0d73e5;
}

#loginMessage,
#message {
    margin-top: 15px;
    margin-bottom: 5px;
    font-size: 14px;
}

.login-link {
    margin-top: 22px;
    color: #777;
    font-size: 15px;
}

.login-link a {
    color: #1683ff;
    font-weight: bold;
    text-decoration: none;
}


/* ======================================================
   CHAT APP
====================================================== */

.chat-app {
    width: 100%;
    height: 100vh;

    display: flex;

    background: #111;

    overflow: hidden;
}


/* ======================================================
   SIDEBAR
====================================================== */

.sidebar {
    width: 370px;
    min-width: 370px;
    height: 100vh;

    background: #202020;

    border-right: 1px solid #333;

    display: flex;
    flex-direction: column;

    overflow: hidden;
}


/* ======================================================
   SIDEBAR HEADER
====================================================== */

.sidebar-header {
    height: 90px;
    min-height: 90px;

    padding: 15px 20px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    border-bottom: 1px solid #333;
}

.sidebar-header h1 {
    color: #1683ff;
    font-size: 25px;
}


/* ======================================================
   PROFILE
====================================================== */

.profile-section {
    display: flex;
    align-items: center;
    justify-content: center;
}

.profile-photo {
    width: 52px;
    height: 52px;

    border-radius: 50%;

    object-fit: cover;

    border: 2px solid #444;
}

.profile-btn {
    width: 52px;
    height: 52px;

    border: none;
    border-radius: 50%;

    background: transparent;

    color: #1683ff;

    font-size: 28px;

    cursor: pointer;
}


/* ======================================================
   SEARCH
====================================================== */

.search-box {
    padding: 15px;
}

.search-box input {
    width: 100%;
    height: 48px;

    border: none;
    outline: none;

    border-radius: 25px;

    background: #3a3a3a;

    color: white;

    padding: 0 20px;

    font-size: 16px;
}

.search-box input::placeholder {
    color: #bbb;
}


/* ======================================================
   CHAT LIST
====================================================== */

.chat-list {
    flex: 1;

    overflow-y: auto;
    overflow-x: hidden;
}

#chatList {
    width: 100%;
}

#chatList > div {
    display: flex;
    align-items: center;

    width: 100%;
    min-height: 82px;

    padding: 12px 16px;

    cursor: pointer;

    border-bottom: 1px solid #303030;

    color: white;
}

#chatList > div:hover {
    background: #2b2b2b;
}


/* ======================================================
   AVATAR
====================================================== */

#chatList .avatar {
    width: 56px;
    height: 56px;

    min-width: 56px;

    border-radius: 50%;

    background: #3b82f6;

    color: white;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 22px;
    font-weight: bold;

    margin-right: 14px;

    overflow: hidden;
}

#chatList .avatar img {
    width: 100%;
    height: 100%;

    object-fit: cover;

    border-radius: 50%;
}


/* ======================================================
   USER INFO
====================================================== */

.chat-info {
    min-width: 0;

    display: flex;
    flex-direction: column;
}

.chat-name {
    color: white;

    font-size: 17px;
    font-weight: bold;

    margin-bottom: 5px;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.last-message {
    color: #aaa;
    font-size: 14px;
}

.last-message.online {
    color: #22c55e;
}


/* ======================================================
   ADD PERSON
====================================================== */

.add-user-btn {
    margin: 15px;

    height: 52px;
    min-height: 52px;

    border: none;

    border-radius: 10px;

    background: #3a3a3a;

    color: white;

    font-size: 17px;

    cursor: pointer;
}

.add-user-btn:hover {
    background: #4a4a4a;
}


/* ======================================================
   CHAT AREA
====================================================== */

.chat-area {
    flex: 1;

    min-width: 0;

    height: 100vh;

    display: flex;
    flex-direction: column;

    background: #111;

    overflow: hidden;
}


/* ======================================================
   CHAT HEADER
====================================================== */

.chat-header {
    height: 92px;
    min-height: 92px;

    padding: 14px 22px;

    display: flex;
    align-items: center;

    background: #202020;

    border-bottom: 1px solid #333;
}


/* ======================================================
   CHAT AVATAR
====================================================== */

.chat-avatar-container {
    width: 64px;
    height: 64px;

    min-width: 64px;

    border-radius: 50%;

    overflow: hidden;

    margin-right: 16px;
}

.chat-avatar-container .avatar {
    width: 64px;
    height: 64px;

    border-radius: 50%;

    background: #3b82f6;

    color: white;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 25px;
    font-weight: bold;
}

.chat-profile-photo {
    width: 64px;
    height: 64px;

    border-radius: 50%;

    object-fit: cover;
}


/* ======================================================
   CHAT HEADER INFO
====================================================== */

.chat-header-info {
    min-width: 0;

    display: flex;
    flex-direction: column;

    gap: 4px;
}

.chat-header-info h2 {
    margin: 0;

    font-size: 24px;

    color: white;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.online-status {
    font-size: 15px;
    color: #888;
}

.online-status.online {
    color: #22c55e;
}


/* ======================================================
   MESSAGES
====================================================== */

.messages {
    flex: 1;

    min-height: 0;

    padding: 30px;

    overflow-y: auto;
    overflow-x: hidden;

    display: flex;
    flex-direction: column;

    gap: 12px;
}


/* ======================================================
   MESSAGE
====================================================== */

.message {
    max-width: 70%;

    padding: 12px 18px;

    border-radius: 20px;

    font-size: 17px;

    line-height: 1.4;

    word-break: break-word;
}

.message.received {
    align-self: flex-start;

    background: #3b3b3b;

    color: white;

    border-bottom-left-radius: 5px;
}

.message.sent {
    align-self: flex-end;

    background: #1683ff;

    color: white;

    border-bottom-right-radius: 5px;
}

.message span {
    font-size: 11px;

    opacity: 0.7;

    margin-left: 6px;
}


/* ======================================================
   MESSAGE INPUT
====================================================== */

.message-input {
    min-height: 90px;

    padding: 18px 22px;

    display: flex;
    align-items: center;

    gap: 14px;

    background: #202020;

    border-top: 1px solid #333;
}

.message-input input {
    flex: 1;

    min-width: 0;

    height: 58px;

    border: none;

    outline: none;

    border-radius: 30px;

    background: #3a3a3a;

    color: white;

    padding: 0 22px;

    font-size: 18px;
}

.message-input input::placeholder {
    color: #bbb;
}

.message-input button {
    width: 58px;
    height: 58px;

    min-width: 58px;

    border: none;

    border-radius: 50%;

    background: #1683ff;

    color: white;

    font-size: 25px;

    cursor: pointer;
}

.message-input button:disabled {
    opacity: 0.5;

    cursor: not-allowed;
}


/* ======================================================
   SCROLLBAR
====================================================== */

::-webkit-scrollbar {
    width: 7px;
}

::-webkit-scrollbar-track {
    background: #171717;
}

::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 10px;
}


/* ======================================================
   MOBILE
====================================================== */

@media (max-width: 700px) {

    html,
    body {
        width: 100%;
        height: 100%;
    }

    .chat-app {
        width: 100vw;
        height: 100dvh;

        display: block;

        overflow: hidden;
    }

    /* Hide sidebar when chat is being viewed */
    .sidebar {
        width: 100%;
        min-width: 0;

        height: 100dvh;

        border-right: none;
    }

    .sidebar-header {
        height: 75px;
        min-height: 75px;

        padding: 12px 16px;
    }

    .sidebar-header h1 {
        font-size: 22px;
    }

    .profile-photo,
    .profile-btn {
        width: 45px;
        height: 45px;
    }

    .search-box {
        padding: 10px 12px;
    }

    .search-box input {
        height: 45px;
        font-size: 15px;
    }

    #chatList > div {
        min-height: 70px;
        padding: 10px 14px;
    }

    #chatList .avatar {
        width: 48px;
        height: 48px;
        min-width: 48px;

        margin-right: 12px;
    }

    .chat-name {
        font-size: 16px;
    }

    .last-message {
        font-size: 13px;
    }

    .add-user-btn {
        margin: 10px 12px;

        height: 48px;
        min-height: 48px;

        font-size: 16px;
    }

    /*
       CHAT AREA
       On mobile it fills the screen.
    */

    .chat-area {
        width: 100vw;
        height: 100dvh;

        min-width: 0;
    }

    .chat-header {
        height: 70px;
        min-height: 70px;

        padding: 10px 14px;
    }

    .chat-avatar-container {
        width: 48px;
        height: 48px;

        min-width: 48px;

        margin-right: 12px;
    }

    .chat-avatar-container .avatar {
        width: 48px;
        height: 48px;

        font-size: 20px;
    }

    .chat-profile-photo {
        width: 48px;
        height: 48px;
    }

    .chat-header-info h2 {
        font-size: 18px;
    }

    .online-status {
        font-size: 13px;
    }

    .messages {
        padding: 15px 12px;

        gap: 9px;
    }

    .message {
        max-width: 85%;

        padding: 10px 14px;

        font-size: 15px;
    }

    .message-input {
        min-height: 70px;

        padding: 10px 12px;

        gap: 8px;
    }

    .message-input input {
        height: 48px;

        padding: 0 16px;

        font-size: 16px;
    }

    .message-input button {
        width: 48px;
        height: 48px;

        min-width: 48px;

        font-size: 21px;
    }
}


/* ======================================================
   VERY SMALL PHONES
====================================================== */

@media (max-width: 400px) {

    .auth-container {
        padding: 12px;
    }

    .auth-box {
        padding: 28px 20px;

        border-radius: 14px;
    }

    .auth-box h1 {
        font-size: 30px;
    }

    .auth-box input,
    .auth-box button {
        height: 48px;
    }

    .chat-header-info h2 {
        font-size: 17px;
    }

    .message {
        max-width: 90%;
    }
}