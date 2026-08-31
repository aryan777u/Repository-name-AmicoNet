// ======================================================
// SIGN UP
// ======================================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("message");

        try {

            const response = await fetch("/api/auth/signup", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });

            const result = await response.text();

            if (response.ok) {

                message.textContent =
                    "Account created successfully!";

                message.style.color =
                    "#31a24c";

                signupForm.reset();

            } else {

                message.textContent =
                    result;

                message.style.color =
                    "#ff4d4d";
            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Could not connect to server.";

            message.style.color =
                "#ff4d4d";
        }

    });

}


// ======================================================
// LOGIN
// ======================================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const username =
            document.getElementById("loginUsername").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("loginMessage");

        try {

            const response = await fetch("/api/auth/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const result =
                await response.text();

            if (response.ok) {

                message.textContent =
                    "Login successful!";

                message.style.color =
                    "#31a24c";

                localStorage.setItem(
                    "username",
                    username
                );

                setTimeout(function () {

                    window.location.href =
                        "/chat.html";

                }, 500);

            } else {

                message.textContent =
                    result;

                message.style.color =
                    "#ff4d4d";
            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Could not connect to server.";

            message.style.color =
                "#ff4d4d";
        }

    });

}


// ======================================================
// CHAT ELEMENTS
// ======================================================

const sendButton =
    document.getElementById("sendButton");

const messageInput =
    document.getElementById("messageInput");

const messagesContainer =
    document.getElementById("messages");

const chatList =
    document.getElementById("chatList");

const searchInput =
    document.getElementById("searchInput");

const chatName =
    document.getElementById("chatName");

const chatAvatar =
    document.getElementById("chatAvatar");

const onlineStatus =
    document.getElementById("onlineStatus");


// ======================================================
// CHAT SYSTEM
// ======================================================

if (
    sendButton &&
    messageInput &&
    messagesContainer &&
    chatList
) {

    console.log("Chat JavaScript loaded!");

    // ==================================================
    // CURRENT USER
    // ==================================================

    const currentUser =
        localStorage.getItem("username") ||
        "anonymous";

    console.log(
        "Current user:",
        currentUser
    );


    // ==================================================
    // SELECTED RECEIVER
    // ==================================================

    let receiver = null;


    // ==================================================
    // USERS
    // ==================================================

    let users = [];


    // ==================================================
    // ONLINE USERS
    // ==================================================

    const onlineUsers =
        new Set();


    // ==================================================
    // STOMP CLIENT
    // ==================================================

    let stompClient = null;


    // ==================================================
    // CONNECT WEBSOCKET
    // ==================================================

    function connectWebSocket() {

        console.log(
            "Connecting to WebSocket..."
        );


        stompClient =
            new StompJs.Client({

                // --------------------------------------
                // SOCKJS CONNECTION
                // --------------------------------------

                webSocketFactory: function () {

                    return new SockJS("/ws");

                },


                // --------------------------------------
                // DEBUG
                // --------------------------------------

                debug: function (str) {

                    console.log(
                        "[STOMP]",
                        str
                    );

                },


                // --------------------------------------
                // RECONNECT
                // --------------------------------------

                reconnectDelay: 5000

            });


        // ==================================================
        // WHEN CONNECTED
        // ==================================================

        stompClient.onConnect = function (frame) {

            console.log(
                "WebSocket connected!",
                frame
            );


            // ==================================================
            // MESSAGE SUBSCRIPTION
            // ==================================================

            stompClient.subscribe(
                "/topic/messages",
                function (message) {

                    try {

                        const receivedMessage =
                            JSON.parse(
                                message.body
                            );


                        console.log(
                            "Received message:",
                            receivedMessage
                        );


                        if (!receiver) {
                            return;
                        }


                        const belongsToCurrentChat =

                            (
                                receivedMessage.sender ===
                                currentUser &&

                                receivedMessage.receiver ===
                                receiver
                            )

                            ||

                            (
                                receivedMessage.sender ===
                                receiver &&

                                receivedMessage.receiver ===
                                currentUser
                            );


                        if (
                            belongsToCurrentChat
                        ) {

                            displayMessage(
                                receivedMessage
                            );

                        }

                    } catch (error) {

                        console.error(
                            "Message parsing error:",
                            error
                        );

                    }

                }
            );


            // ==================================================
            // PRESENCE SUBSCRIPTION
            // ==================================================

            stompClient.subscribe(
                "/topic/presence",
                function (message) {

                    try {

                        const presence =
                            JSON.parse(
                                message.body
                            );


                        console.log(
                            "Presence:",
                            presence
                        );


                        if (
                            presence.status ===
                            "ONLINE"
                        ) {

                            onlineUsers.add(
                                presence.username
                            );

                        }


                        else if (
                            presence.status ===
                            "OFFLINE"
                        ) {

                            onlineUsers.delete(
                                presence.username
                            );

                        }


                        updateOnlineStatus();

                        renderUsers(users);

                    } catch (error) {

                        console.error(
                            "Presence error:",
                            error
                        );

                    }

                }
            );


            // ==================================================
            // TELL SERVER WE ARE ONLINE
            // ==================================================

            sendPresence("ONLINE");

        };


        // ==================================================
        // WEBSOCKET ERROR
        // ==================================================

        stompClient.onStompError =
            function (frame) {

                console.error(
                    "STOMP error:",
                    frame
                );

            };


        stompClient.onWebSocketError =
            function (error) {

                console.error(
                    "WebSocket error:",
                    error
                );

            };


        // ==================================================
        // WEBSOCKET CLOSED
        // ==================================================

        stompClient.onWebSocketClose =
            function () {

                console.log(
                    "WebSocket disconnected."
                );

            };


        // ==================================================
        // ACTIVATE CLIENT
        // ==================================================

        stompClient.activate();

    }


    // ======================================================
    // SEND PRESENCE
    // ======================================================

    function sendPresence(status) {

        if (
            !stompClient ||
            !stompClient.connected
        ) {

            console.log(
                "Cannot send presence - WebSocket not connected."
            );

            return;
        }


        stompClient.publish({

            destination:
                "/app/presence",

            body:
                JSON.stringify({

                    username:
                        currentUser,

                    status:
                        status

                })

        });

    }


    // ======================================================
    // UPDATE ONLINE STATUS
    // ======================================================

    function updateOnlineStatus() {

        if (!receiver) {

            onlineStatus.textContent =
                "● Offline";

            onlineStatus.classList.remove(
                "online"
            );

            return;
        }


        if (
            onlineUsers.has(receiver)
        ) {

            onlineStatus.textContent =
                "● Online";

            onlineStatus.classList.add(
                "online"
            );

        } else {

            onlineStatus.textContent =
                "● Offline";

            onlineStatus.classList.remove(
                "online"
            );

        }

    }


    // ======================================================
    // LOAD USERS
    // ======================================================

    async function loadUsers() {

        try {

            const response =
                await fetch("/api/users");


            if (!response.ok) {

                console.error(
                    "Could not load users:",
                    response.status
                );

                return;
            }


            users =
                await response.json();


            console.log(
                "Users loaded:",
                users
            );


            renderUsers(users);

        } catch (error) {

            console.error(
                "Error loading users:",
                error
            );

        }

    }


    // ======================================================
    // RENDER USERS
    // ======================================================

    function renderUsers(userList) {

        chatList.innerHTML = "";


        userList.forEach(function (user) {

            if (
                user.username ===
                currentUser
            ) {

                return;
            }


            const chatItem =
                document.createElement("div");

            chatItem.classList.add(
                "chat-item"
            );


            // ==================================================
            // AVATAR
            // ==================================================

            const avatar =
                document.createElement("div");

            avatar.classList.add(
                "avatar"
            );


            if (user.profilePhoto) {

                const image =
                    document.createElement("img");

                image.src =
                    user.profilePhoto;

                image.alt =
                    user.username;

                image.style.width =
                    "100%";

                image.style.height =
                    "100%";

                image.style.objectFit =
                    "cover";

                image.style.borderRadius =
                    "50%";

                avatar.appendChild(
                    image
                );

            } else {

                avatar.textContent =
                    user.username
                        .charAt(0)
                        .toUpperCase();

            }


            // ==================================================
            // USER INFO
            // ==================================================

            const chatInfo =
                document.createElement("div");

            chatInfo.classList.add(
                "chat-info"
            );


            const chatUsername =
                document.createElement("div");

            chatUsername.classList.add(
                "chat-name"
            );

            chatUsername.textContent =
                user.username;


            const lastMessage =
                document.createElement("div");

            lastMessage.classList.add(
                "last-message"
            );


            if (
                onlineUsers.has(
                    user.username
                )
            ) {

                lastMessage.textContent =
                    "● Online";

                lastMessage.classList.add(
                    "online"
                );

            } else {

                lastMessage.textContent =
                    "● Offline";

                lastMessage.classList.remove(
                    "online"
                );

            }


            chatInfo.appendChild(
                chatUsername
            );

            chatInfo.appendChild(
                lastMessage
            );


            chatItem.appendChild(
                avatar
            );

            chatItem.appendChild(
                chatInfo
            );


            // ==================================================
            // CLICK USER
            // ==================================================

            chatItem.addEventListener(
                "click",
                function () {

                    selectUser(user);

                }
            );


            chatList.appendChild(
                chatItem
            );

        });

    }


    // ======================================================
    // SELECT USER
    // ======================================================

    function selectUser(user) {

        receiver =
            user.username;


        console.log(
            "Selected receiver:",
            receiver
        );


        chatName.textContent =
            user.username;


        // ==================================================
        // AVATAR
        // ==================================================

        chatAvatar.innerHTML = "";


        if (user.profilePhoto) {

            const image =
                document.createElement("img");

            image.src =
                user.profilePhoto;

            image.alt =
                user.username;

            image.style.width =
                "100%";

            image.style.height =
                "100%";

            image.style.objectFit =
                "cover";

            image.style.borderRadius =
                "50%";

            chatAvatar.appendChild(
                image
            );

        } else {

            chatAvatar.textContent =
                user.username
                    .charAt(0)
                    .toUpperCase();

        }


        // ==================================================
        // UPDATE STATUS
        // ==================================================

        updateOnlineStatus();


        // ==================================================
        // ENABLE MESSAGE INPUT
        // ==================================================

        messageInput.disabled =
            false;

        sendButton.disabled =
            false;


        messageInput.focus();


        // ==================================================
        // LOAD OLD MESSAGES
        // ==================================================

        loadMessages();

    }


    // ======================================================
    // LOAD MESSAGES
    // ======================================================

    async function loadMessages() {

        if (!receiver) {
            return;
        }


        try {

            const response =
                await fetch(
                    "/api/messages?user1=" +
                    encodeURIComponent(
                        currentUser
                    ) +
                    "&user2=" +
                    encodeURIComponent(
                        receiver
                    )
                );


            if (!response.ok) {

                console.error(
                    "Could not load messages:",
                    response.status
                );

                return;
            }


            const messages =
                await response.json();


            messagesContainer.innerHTML =
                "";


            messages.forEach(
                function (message) {

                    displayMessage(
                        message
                    );

                }
            );


            messagesContainer.scrollTop =
                messagesContainer.scrollHeight;

        } catch (error) {

            console.error(
                "Error loading messages:",
                error
            );

        }

    }


    // ======================================================
    // SEND BUTTON
    // ======================================================

    sendButton.addEventListener(
        "click",
        sendMessage
    );


    // ======================================================
    // ENTER TO SEND
    // ======================================================

    messageInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    // ======================================================
    // SEND MESSAGE
    // ======================================================

    function sendMessage() {

        const text =
            messageInput.value.trim();


        if (text === "") {
            return;
        }


        if (!receiver) {

            alert(
                "Please select a person first."
            );

            return;
        }


        if (
            !stompClient ||
            !stompClient.connected
        ) {

            alert(
                "Chat server is not connected yet."
            );

            console.error(
                "STOMP is not connected."
            );

            return;
        }


        const message = {

            sender:
                currentUser,

            receiver:
                receiver,

            content:
                text

        };


        console.log(
            "Sending message:",
            message
        );


        // ==================================================
        // STOMP V7 SEND
        // ==================================================

        stompClient.publish({

            destination:
                "/app/chat",

            body:
                JSON.stringify(
                    message
                )

        });


        messageInput.value =
            "";

    }


    // ======================================================
    // DISPLAY MESSAGE
    // ======================================================

    function displayMessage(message) {

        const messageElement =
            document.createElement("div");


        if (
            message.sender ===
            currentUser
        ) {

            messageElement.classList.add(
                "message",
                "sent"
            );

        } else {

            messageElement.classList.add(
                "message",
                "received"
            );

        }


        const time =
            message.timestamp

                ? new Date(
                    message.timestamp
                ).toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                )

                : "Now";


        messageElement.innerHTML =
            escapeHtml(
                message.content
            ) +
            " <span>" +
            time +
            "</span>";


        messagesContainer.appendChild(
            messageElement
        );


        messagesContainer.scrollTop =
            messagesContainer.scrollHeight;

    }


    // ======================================================
    // SEARCH USERS
    // ======================================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                const searchText =
                    searchInput.value
                        .toLowerCase()
                        .trim();


                const filteredUsers =
                    users.filter(
                        function (user) {

                            return user.username
                                .toLowerCase()
                                .includes(
                                    searchText
                                );

                        }
                    );


                renderUsers(
                    filteredUsers
                );

            }
        );

    }


    // ======================================================
    // SECURITY
    // ======================================================

    function escapeHtml(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text;

        return div.innerHTML;

    }


    // ======================================================
    // PAGE CLOSE
    // ======================================================

    window.addEventListener(
        "beforeunload",
        function () {

            sendPresence(
                "OFFLINE"
            );

        }
    );


    // ======================================================
    // START CHAT
    // ======================================================

    connectWebSocket();

    loadUsers();

}


// ======================================================
// PROFILE PHOTO
// ======================================================

const profilePhotoButton =
    document.getElementById(
        "profilePhotoButton"
    );

const profilePhotoInput =
    document.getElementById(
        "profilePhotoInput"
    );

const profilePhoto =
    document.getElementById(
        "profilePhoto"
    );


if (
    profilePhotoButton &&
    profilePhotoInput &&
    profilePhoto
) {


    // ==================================================
    // OPEN FILE PICKER
    // ==================================================

    profilePhotoButton.addEventListener(
        "click",
        function () {

            profilePhotoInput.click();

        }
    );


    // ==================================================
    // UPLOAD PHOTO
    // ==================================================

    profilePhotoInput.addEventListener(
        "change",
        async function () {

            const file =
                profilePhotoInput.files[0];


            if (!file) {
                return;
            }


            // ==================================================
            // CHECK FILE TYPE
            // ==================================================

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Please select an image."
                );

                return;
            }


            const username =
                localStorage.getItem(
                    "username"
                );


            if (!username) {

                alert(
                    "Please login first."
                );

                return;
            }


            // ==================================================
            // FORM DATA
            // ==================================================

            const formData =
                new FormData();


            formData.append(
                "username",
                username
            );

            formData.append(
                "file",
                file
            );


            try {

                const response =
                    await fetch(
                        "/api/users/profile-photo",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                if (!response.ok) {

                    const error =
                        await response.text();

                    alert(error);

                    return;
                }


                const imageData =
                    await response.text();


                profilePhoto.src =
                    imageData;

                profilePhoto.style.display =
                    "block";


                profilePhotoButton.style.display =
                    "none";


                alert(
                    "Profile photo updated!"
                );


                location.reload();


            } catch (error) {

                console.error(error);

                alert(
                    "Could not upload profile photo."
                );

            }

        }
    );

}