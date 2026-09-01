// ======================================================
// AMICONET - APP.JS
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    // ==================================================
    // ELEMENTS
    // ==================================================

    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");

    const chatList = document.getElementById("chatList");
    const searchInput = document.getElementById("searchInput");
    const addUserButton = document.getElementById("addUserButton");

    const sendButton = document.getElementById("sendButton");
    const messageInput = document.getElementById("messageInput");
    const messagesContainer = document.getElementById("messages");

    const chatName = document.getElementById("chatName");
    const chatAvatar = document.getElementById("chatAvatar");
    const onlineStatus = document.getElementById("onlineStatus");

    const profilePhotoButton =
        document.getElementById("profilePhotoButton");

    const profilePhotoInput =
        document.getElementById("profilePhotoInput");

    const profilePhoto =
        document.getElementById("profilePhoto");


    // ==================================================
    // SIGN UP
    // ==================================================

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

                const response =
                    await fetch("/api/auth/signup", {
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


                const result =
                    await response.text();


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


    // ==================================================
    // LOGIN
    // ==================================================

    if (loginForm) {

        loginForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const username =
                document.getElementById("loginUsername")
                    .value
                    .trim();

            const password =
                document.getElementById("loginPassword")
                    .value;

            const message =
                document.getElementById("loginMessage");


            try {

                const response =
                    await fetch("/api/auth/login", {
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


    // ==================================================
    // CHAT PAGE CHECK
    // ==================================================

    if (
        !chatList ||
        !messageInput ||
        !sendButton ||
        !messagesContainer
    ) {
        return;
    }


    // ==================================================
    // CURRENT USER
    // ==================================================

    const currentUser =
        localStorage.getItem("username");


    if (!currentUser) {

        console.log(
            "No logged-in user."
        );

        window.location.href =
            "/index.html";

        return;
    }


    console.log(
        "AmicoNet logged in as:",
        currentUser
    );


    // ==================================================
    // VARIABLES
    // ==================================================

    let users = [];

    let receiver = null;

    let stompClient = null;

    const onlineUsers =
        new Set();


    // ==================================================
    // LOAD USERS
    // ==================================================

    async function loadUsers() {

        try {

            const response =
                await fetch("/api/users");


            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status
                );
            }


            users =
                await response.json();


            console.log(
                "Users loaded:",
                users
            );


            renderUsers(users);


            // Show own profile picture
            const me =
                users.find(function (user) {

                    return user.username ===
                        currentUser;

                });


            if (
                me &&
                me.profilePhoto &&
                profilePhoto
            ) {

                profilePhoto.src =
                    me.profilePhoto;

                profilePhoto.style.display =
                    "block";

                if (profilePhotoButton) {

                    profilePhotoButton.style.display =
                        "none";
                }
            }


        } catch (error) {

            console.error(
                "Could not load users:",
                error
            );


            chatList.innerHTML =
                "<div style='padding:20px;color:#ff6666'>" +
                "Could not load users." +
                "</div>";
        }
    }


    // ==================================================
    // RENDER USERS
    // ==================================================

    function renderUsers(userList) {

        chatList.innerHTML = "";


        const otherUsers =
            userList.filter(function (user) {

                return user.username !==
                    currentUser;

            });


        if (otherUsers.length === 0) {

            chatList.innerHTML =
                "<div style='padding:20px;color:#aaa'>" +
                "No other users found." +
                "</div>";

            return;
        }


        otherUsers.forEach(function (user) {

            const chatItem =
                document.createElement("div");

            chatItem.className =
                "chat-user";


            // ==================================================
            // AVATAR
            // ==================================================

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

                image.style.width =
                    "100%";

                image.style.height =
                    "100%";

                image.style.objectFit =
                    "cover";

                image.style.borderRadius =
                    "50%";

                avatar.appendChild(image);

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


            if (
                onlineUsers.has(
                    user.username
                )
            ) {

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


            // ==================================================
            // CLICK USER
            // ==================================================

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
            async function () {

                const entered =
                    prompt(
                        "Enter username:"
                    );


                if (!entered) {
                    return;
                }


                const username =
                    entered.trim();


                if (!username) {
                    return;
                }


                if (
                    username.toLowerCase() ===
                    currentUser.toLowerCase()
                ) {

                    alert(
                        "You cannot add yourself."
                    );

                    return;
                }


                try {

                    const response =
                        await fetch(
                            "/api/users"
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Could not load users."
                        );
                    }


                    const allUsers =
                        await response.json();


                    const foundUser =
                        allUsers.find(
                            function (user) {

                                return user.username
                                    .toLowerCase() ===
                                    username.toLowerCase();

                            }
                        );


                    if (!foundUser) {

                        alert(
                            "Username not found."
                        );

                        return;
                    }


                    const exists =
                        users.some(
                            function (user) {

                                return user.username ===
                                    foundUser.username;

                            }
                        );


                    if (!exists) {

                        users.push(
                            foundUser
                        );

                        renderUsers(
                            users
                        );
                    }


                    selectUser(
                        foundUser
                    );


                } catch (error) {

                    console.error(
                        error
                    );

                    alert(
                        "Could not find user."
                    );
                }
            }
        );
    }


    // ==================================================
    // SELECT USER
    // ==================================================

    function selectUser(user) {

        receiver =
            user.username;


        chatName.textContent =
            user.username;


        chatAvatar.innerHTML =
            "";


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


        updateOnlineStatus();


        messageInput.disabled =
            false;

        sendButton.disabled =
            false;


        messagesContainer.innerHTML =
            "";


        loadMessages();


        messageInput.focus();
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


        if (
            onlineUsers.has(
                receiver
            )
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


    // ==================================================
    // LOAD OLD MESSAGES
    // ==================================================

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
                    "Messages request failed:",
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
                "Select a person first."
            );

            return;
        }


        if (
            !stompClient ||
            !stompClient.connected
        ) {

            alert(
                "Chat server is not connected."
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
                JSON.stringify(
                    message
                )
        });


        messageInput.value =
            "";

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

        const element =
            document.createElement("div");


        if (
            message.sender ===
            currentUser
        ) {

            element.className =
                "message sent";

        } else {

            element.className =
                "message received";
        }


        const content =
            document.createElement("span");


        content.textContent =
            message.content;


        const time =
            document.createElement("span");


        time.style.fontSize =
            "11px";

        time.style.opacity =
            "0.7";

        time.style.marginLeft =
            "6px";


        if (message.timestamp) {

            time.textContent =
                new Date(
                    message.timestamp
                ).toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

        } else {

            time.textContent =
                "Now";
        }


        element.appendChild(
            content
        );

        element.appendChild(
            time
        );


        messagesContainer.appendChild(
            element
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
                        .trim()
                        .toLowerCase();


                const filtered =
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
                    filtered
                );
            }
        );
    }


    // ==================================================
    // CONNECT WEBSOCKET
    // ==================================================

    function connectWebSocket() {

        console.log(
            "Connecting to WebSocket..."
        );


        stompClient =
            new StompJs.Client({

                webSocketFactory:
                    function () {

                        return new SockJS(
                            "/ws"
                        );
                    },


                reconnectDelay:
                    5000,


                debug:
                    function (message) {

                        console.log(
                            "[STOMP]",
                            message
                        );
                    }
            });


        // ==================================================
        // CONNECTED
        // ==================================================

        stompClient.onConnect =
            function () {

                console.log(
                    "WebSocket connected!"
                );


                // ==================================================
                // MESSAGE SUBSCRIPTION
                // ==================================================

                stompClient.subscribe(
                    "/topic/messages",
                    function (message) {

                        try {

                            const data =
                                JSON.parse(
                                    message.body
                                );


                            if (!receiver) {
                                return;
                            }


                            const belongs =
                                (
                                    data.sender ===
                                        currentUser &&
                                    data.receiver ===
                                        receiver
                                ) ||
                                (
                                    data.sender ===
                                        receiver &&
                                    data.receiver ===
                                        currentUser
                                );


                            if (belongs) {

                                displayMessage(
                                    data
                                );
                            }


                        } catch (error) {

                            console.error(
                                "Message error:",
                                error
                            );
                        }
                    }
                );


                // ==================================================
                // PRESENCE
                // ==================================================

                stompClient.subscribe(
                    "/topic/presence",
                    function (message) {

                        try {

                            const presence =
                                JSON.parse(
                                    message.body
                                );


                            if (
                                presence.status ===
                                "ONLINE"
                            ) {

                                onlineUsers.add(
                                    presence.username
                                );

                            } else {

                                onlineUsers.delete(
                                    presence.username
                                );
                            }


                            updateOnlineStatus();

                            renderUsers(
                                users
                            );


                        } catch (error) {

                            console.error(
                                "Presence error:",
                                error
                            );
                        }
                    }
                );


                sendPresence(
                    "ONLINE"
                );
            };


        // ==================================================
        // STOMP ERROR
        // ==================================================

        stompClient.onStompError =
            function (frame) {

                console.error(
                    "STOMP error:",
                    frame
                );
            };


        // ==================================================
        // WEBSOCKET ERROR
        // ==================================================

        stompClient.onWebSocketError =
            function (error) {

                console.error(
                    "WebSocket error:",
                    error
                );
            };


        // ==================================================
        // WEBSOCKET CLOSE
        // ==================================================

        stompClient.onWebSocketClose =
            function () {

                console.log(
                    "WebSocket disconnected."
                );
            };


        stompClient.activate();
    }


    // ==================================================
    // PRESENCE
    // ==================================================

    function sendPresence(status) {

        if (
            !stompClient ||
            !stompClient.connected
        ) {
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


    // ==================================================
    // PROFILE PHOTO
    // ==================================================

    if (
        profilePhotoButton &&
        profilePhotoInput &&
        profilePhoto
    ) {

        // ----------------------------------------------
        // OPEN FILE PICKER
        // ----------------------------------------------

        profilePhotoButton.addEventListener(
            "click",
            function () {

                console.log(
                    "Profile photo button clicked"
                );

                profilePhotoInput.click();
            }
        );


        // ----------------------------------------------
        // IMAGE SELECTED
        // ----------------------------------------------

        profilePhotoInput.addEventListener(
            "change",
            async function () {

                const file =
                    profilePhotoInput.files[0];


                if (!file) {
                    return;
                }


                console.log(
                    "Selected image:",
                    file.name
                );


                // ------------------------------------------
                // CHECK FILE TYPE
                // ------------------------------------------

                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    alert(
                        "Please select an image."
                    );

                    profilePhotoInput.value =
                        "";

                    return;
                }


                // ------------------------------------------
                // CHECK SIZE
                // ------------------------------------------

                if (
                    file.size >
                    5 * 1024 * 1024
                ) {

                    alert(
                        "Image must be smaller than 5 MB."
                    );

                    profilePhotoInput.value =
                        "";

                    return;
                }


                // ------------------------------------------
                // FORM DATA
                // ------------------------------------------

                const formData =
                    new FormData();


                formData.append(
                    "username",
                    currentUser
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


                    const result =
                        await response.text();


                    console.log(
                        "Profile upload response:",
                        response.status,
                        result
                    );


                    if (!response.ok) {

                        alert(
                            "Upload failed: " +
                            result
                        );

                        return;
                    }


                    // --------------------------------------
                    // SHOW PHOTO
                    // --------------------------------------

                    profilePhoto.src =
                        result;


                    profilePhoto.style.display =
                        "block";


                    profilePhotoButton.style.display =
                        "none";


                    alert(
                        "Profile picture updated!"
                    );


                    // Reload users
                    await loadUsers();


                } catch (error) {

                    console.error(
                        "Profile upload error:",
                        error
                    );


                    alert(
                        "Could not upload profile picture."
                    );


                } finally {

                    profilePhotoButton.disabled =
                        false;

                    profilePhotoInput.value =
                        "";
                }
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
    // START APP
    // ==================================================

    console.log(
        "Starting AmicoNet..."
    );


    loadUsers();

    connectWebSocket();

});