function initGoogleAPI() {
    gapi.load("client:auth2", () => {
        gapi.client.init({
            apiKey: "AIzaSyA0-h9Bfol9AC3wDj8OVnrhknCUo6kw5rA",
            clientId: "467536029401-ketft634b0ftghitf084uou2mmo472pd.apps.googleusercontent.com",
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
            scope: "https://www.googleapis.com/auth/drive.file"
        }).then(() => {
            console.log("Google API initialized");
        }).catch(error => {
            console.error("Error initializing Google API:", error);
        });
    });
}
function signIn() {
    gapi.auth2.getAuthInstance().signIn().then(() => {
        console.log("Signed in successfully");
    }).catch(error => {
        console.error("Error signing in:", error);
    });
}

function signOut() {
    gapi.auth2.getAuthInstance().signOut().then(() => {
        console.log("Signed out successfully");
    }).catch(error => {
        console.error("Error signing out:", error);
    });
}

function saveToGoogleDrive(fileName, jsonData) {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });

    const metadata = {
        name: fileName,
        mimeType: "application/json"
    };

    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    form.append("file", blob);

    fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: new Headers({
            "Authorization": `Bearer ${gapi.auth.getToken().access_token}`
        }),
        body: form
    }).then(response => response.json())
    .then(data => {
        console.log("File saved successfully:", data);
    }).catch(error => {
        console.error("Error saving file:", error);
    });
}

function loadFromGoogleDrive(fileId, callback) {
    gapi.client.drive.files.get({
        fileId: fileId,
        alt: "media"
    }).then(response => {
        const data = JSON.parse(response.body);
        console.log("File loaded successfully:", data);
        callback(data);
    }).catch(error => {
        console.error("Error loading file:", error);
    });
}

document.getElementById("drive-save-button").addEventListener("click", () => {
    const data = loadData("actionData"); // ローカルストレージからデータを取得
    saveToGoogleDrive("actionData.json", data); // Google Driveに保存
});

document.getElementById("drive-load-button").addEventListener("click", () => {
    const fileId = "YOUR_FILE_ID"; // Google DriveのファイルIDを指定
    loadFromGoogleDrive(fileId, (data) => {
        saveData("actionData", data); // ローカルストレージに保存
        console.log("Data loaded and saved to local storage");
    });
});

document.getElementById("drive-sign-in-button").addEventListener("click", signIn);
document.getElementById("drive-sign-out-button").addEventListener("click", signOut);
