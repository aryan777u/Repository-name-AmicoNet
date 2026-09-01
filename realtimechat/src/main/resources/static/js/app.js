// ======================================================
// AMICONET - COMPLETE APP.JS
// ======================================================


// ======================================================
// SIGN UP
// ======================================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");

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

                message.textContent = "Account created successfully!";
                message.style.color = "#31a24c";

                signupForm.reset();

            } else {

                message.textContent = result;
                message.style.color = "#ff4d4d";
            }

        } catch (error) {

            console.error(error);

            message.textContent = "Could not connect to server.";
            message.style.color = "#ff4d4d";
        }
    });
}


// ======================================================
// LOGIN
// ======================================================

const loginForm = document.getElementById("loginForm");

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

            const result = await response.text();

            if (response.ok) {

                message.textContent = "Login successful!";
                message.style.color = "#31a24c";

                localStorage.setItem("username", username);

                setTimeout(function () {
                    window.location.href = "/chat.html";
                }, 500);

            } else {

                message.textContent = result;
                message.style.color = "#ff4d4d";
            }

        } catch (error) {

            console.error(error);

            message.textContent = "Could not connect to server.";
            message.style.color = "#ff4d4d";
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

const addUserButton =
    document.getElementById("addUserButton");

const profilePhotoButton =
    document.getElementById("profilePhotoButton");

const profilePhotoInput =
    document.getElementById("profilePhotoInput");

const profilePhoto =
    document.getElementById("profilePhoto");


// ======================================================
// CHAT SYSTEM
// ======================================================

if (
    sendButton &&
    messageInput &&
    messagesContainer &&
    chatList
) {

    console.log("AmicoNet chat JavaScript loaded.");

    const currentUser =
        localStorage.getItem("username");

    if (!currentUser) {

        console.warn("No logged-in username found.");

    }

    let receiver = null;

    let users = [];

    const onlineUsers = new Set();

    let stompClient = null;


    // ==================================================
    // CONNECT WEBSOCKET
    // ==================================================

    function connectWebSocket() {

        console.log("Connecting to WebSocket...");

        try {

            stompClient = new StompJs.Client({

                webSocketFactory: function () {
                    return new SockJS("/ws");
                },

                reconnectDelay: 5000,

                debug: function (text) {
                    console.log("[STOMP]", text);
                }
            });


            // ==========================================
            // CONNECTED
            // ==========================================

            stompClient.onConnect = function (frame) {

                console.log("WebSocket connected.");

                // --------------------------------------
                // MESSAGES
                // --------------------------------------

                stompClient.subscribe(
                    "/topic/messages",
                    function (message) {

                        try {

                            const received =
                                JSON.parse(message.body);

                            if (!receiver) {
                                return;
                            }

                            const sameChat =
                                (
                                    received.sender === currentUser &&
                                    received.receiver === receiver
                                )
                                ||
                                (
                                    received.sender === receiver &&
                                    received.receiver === currentUser
                                );

                            if (sameChat) {

                                displayMessage(received);
                            }

                        } catch (error) {

                            console.error(
                                "Message parsing error:",
                                error
                            );
                        }
                    }
                );


                // --------------------------------------
                // PRESENCE
                // --------------------------------------

                stompClient.subscribe(
                    "/topic/presence",
                    function (message) {

                        try {

                            const presence =
                                JSON.parse(message.body);

                            if (
                                presence.status === "ONLINE"
                            ) {

                                onlineUsers.add(
                                    presence.username
                                );

                            } else if (
                                presence.status === "OFFLINE"
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


                sendPresence("ONLINE");
            };


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


            stompClient.onWebSocketClose =
                function () {

                    console.log(
                        "WebSocket disconnected."
                    );
                };


            stompClient.activate();

        } catch (error) {

            console.error(
                "WebSocket startup error:",
                error
            );
        }
    }


    // ==================================================
    // PRESENCE
    // ==================================================

    function sendPresence(status) {

        if (
            !stompClient ||
            !stompClient.connected ||
            !currentUser
        ) {
            return;
        }

        stompClient.publish({

            destination: "/app/presence",

            body: JSON.stringify({

                username: currentUser,

                status: status
            })
        });
    }


    // ==================================================
    // ONLINE STATUS
    // ==================================================

    function updateOnlineStatus() {

        if (!receiver) {

            onlineStatus.textContent =
                "● Offline";

            onlineStatus.classList.remove(
                "online"
            );

            return;
        }

        if (onlineUsers.has(receiver)) {

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


    // ==================================================
    // LOAD USERS
    // ==================================================

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


    // ==================================================
    // RENDER USERS
    // ==================================================

    function renderUsers(userList) {

        chatList.innerHTML = "";

        const visibleUsers =
            userList.filter(function (user) {

                return (
                    user.username &&
                    user.username !== currentUser
                );
            });


        if (visibleUsers.length === 0) {

            const empty =
                document.createElement("div");

            empty.style.padding = "25px";
            empty.style.color = "#aaa";
            empty.style.textAlign = "center";

            empty.textContent =
                "No other users found.";

            chatList.appendChild(empty);

            return;
        }


        visibleUsers.forEach(function (user) {

            const chatItem =
                document.createElement("div");

            chatItem.className =
                "chat-user";


            // ==========================================
            // AVATAR
            // ==========================================

            const avatar =
                document.createElement("div");

            avatar.className =
                "avatar";


            if (user.profilePhoto) {

                const image =
                    document.createElement("img");

                image.src =
                    user.profilePhoto;

                image.alt =
                    user.username;

                avatar.appendChild(image);

            } else {

                avatar.textContent =
                    user.username
                        .charAt(0)
                        .toUpperCase();
            }


            // ==========================================
            // USER INFO
            // ==========================================

            const chatInfo =
                document.createElement("div");

            chatInfo.className =
                "chat-info";


            const name =
                document.createElement("div");

            name.className =
                "chat-name";

            name.textContent =
                user.username;


            const status =
                document.createElement("div");

            status.className =
                "last-message";


            if (onlineUsers.has(user.username)) {

                status.textContent =
                    "● Online";

                status.classList.add(
                    "online"
                );

            } else {

                status.textContent =
                    "● Offline";
            }


            chatInfo.appendChild(name);

            chatInfo.appendChild(status);

            chatItem.appendChild(avatar);

            chatItem.appendChild(chatInfo);


            // ==========================================
            // CLICK USER
            // ==========================================

            chatItem.addEventListener(
                "click",
                function () {

                    selectUser(user);
                }
            );


            chatList.appendChild(chatItem);
        });
    }


    // ==================================================
    // ADD PERSON
    // ==================================================

    if (addUserButton) {

        addUserButton.addEventListener(
            "click",
            function () {

                const username =
                    prompt(
                        "Enter the username you want to chat with:"
                    );


                if (username === null) {
                    return;
                }


                const enteredUsername =
                    username.trim();


                if (!enteredUsername) {

                    alert(
                        "Please enter a username."
                    );

                    return;
                }


                if (
                    currentUser &&
                    enteredUsername.toLowerCase() ===
                    currentUser.toLowerCase()
                ) {

                    alert(
                        "You cannot add yourself."
                    );

                    return;
                }


                const user =
                    users.find(function (item) {

                        return (
                            item.username &&
                            item.username.toLowerCase() ===
                            enteredUsername.toLowerCase()
                        );
                    });


                if (!user) {

                    alert(
                        "User not found. Make sure the username is registered."
                    );

                    return;
                }


                selectUser(user);
            }
        );
    }


    // ==================================================
    // SELECT USER
    // ==================================================

    function selectUser(user) {

        if (!user || !user.username) {
            return;
        }

        receiver =
            user.username;


        chatName.textContent =
            user.username;


        chatAvatar.innerHTML = "";


        if (user.profilePhoto) {

            const image =
                document.createElement("img");

            image.src =
                user.profilePhoto;

            image.alt =
                user.username;

            image.style.width = "100%";
            image.style.height = "100%";
            image.style.objectFit = "cover";
            image.style.borderRadius = "50%";

            chatAvatar.appendChild(image);

        } else {

            chatAvatar.textContent =
                user.username
                    .charAt(0)
                    .toUpperCase();
        }


        updateOnlineStatus();


        messageInput.disabled =
            false;

        sendButton.disabled =
            false;


        messageInput.focus();


        loadMessages();
    }


    // ==================================================
    // LOAD CHAT HISTORY
    // ==================================================

    async function loadMessages() {

        if (!receiver) {
            return;
        }

        try {

            const url =
                "/api/messages?user1=" +
                encodeURIComponent(currentUser) +
                "&user2=" +
                encodeURIComponent(receiver);


            const response =
                await fetch(url);


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


            messages.forEach(function (message) {

                displayMessage(
                    message
                );
            });


            messagesContainer.scrollTop =
                messagesContainer.scrollHeight;

        } catch (error) {

            console.error(
                "Error loading messages:",
                error
            );
        }
    }


    // ==================================================
    // SEND MESSAGE
    // ==================================================

    function sendMessage() {

        const text =
            messageInput.value.trim();


        if (!text) {
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


        stompClient.publish({

            destination:
                "/app/chat",

            body:
                JSON.stringify(message)
        });


        messageInput.value =
            "";


        messageInput.focus();
    }


    // ==================================================
    // SEND BUTTON
    // ==================================================

    sendButton.addEventListener(
        "click",
        sendMessage
    );


    // ==================================================
    // ENTER TO SEND
    // ==================================================

    messageInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                sendMessage();
            }
        }
    );


    // ==================================================
    // DISPLAY MESSAGE
    // ==================================================

    function displayMessage(message) {

        if (!message) {
            return;
        }


        const messageElement =
            document.createElement("div");


        if (
            message.sender === currentUser
        ) {

            messageElement.className =
                "message sent";

        } else {

            messageElement.className =
                "message received";
        }


        const content =
            document.createElement("span");

        content.textContent =
            message.content || "";


        const time =
            document.createElement("span");


        let timeText =
            "Now";


        if (message.timestamp) {

            const date =
                new Date(
                    message.timestamp
                );


            if (!isNaN(date.getTime())) {

                timeText =
                    date.toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    );
            }
        }


        time.textContent =
            timeText;


        messageElement.innerHTML = "";

        messageElement.appendChild(
            content
        );

        messageElement.appendChild(
            time
        );


        messagesContainer.appendChild(
            messageElement
        );


        messagesContainer.scrollTop =
            messagesContainer.scrollHeight;
    }


    // ==================================================
    // SEARCH USERS
    // ==================================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                const searchText =
                    searchInput.value
                        .toLowerCase()
                        .trim();


                const filteredUsers =
                    users.filter(function (user) {

                        return (
                            user.username &&
                            user.username
                                .toLowerCase()
                                .includes(searchText)
                        );
                    });


                renderUsers(
                    filteredUsers
                );
            }
        );
    }


    // ==================================================
    // CLOSE PAGE
    // ==================================================

    window.addEventListener(
        "beforeunload",
        function () {

            sendPresence(
                "OFFLINE"
            );
        }
    );


    // ==================================================
    // START CHAT
    // ==================================================

    connectWebSocket();

    loadUsers();
}


// ======================================================
// PROFILE PHOTO
// ======================================================

if (
    profilePhotoButton &&
    profilePhotoInput &&
    profilePhoto
) {

    profilePhotoButton.addEventListener(
        "click",
        function () {

            profilePhotoInput.click();
        }
    );


    profilePhotoInput.addEventListener(
        "change",
        async function () {

            const file =
                profilePhotoInput.files[0];


            if (!file) {
                return;
            }


            if (
                !file.type.startsWith("image/")
            ) {

                alert(
                    "Please select an image."
                );

                profilePhotoInput.value =
                    "";

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

                profilePhotoButton.disabled =
                    true;


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

                    alert(
                        error ||
                        "Could not upload profile photo."
                    );

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

                console.error(
                    "Profile photo error:",
                    error
                );


                alert(
                    "Could not upload profile photo."
                );

            } finally {

                profilePhotoButton.disabled =
                    false;
            }
        }
    );
}