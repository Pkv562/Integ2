const form = document.getElementById("userForm");
const submitButton = document.getElementById("submitBtn");
const postResponse = document.getElementById("postResponse");
const searchButton = document.getElementById("searchBtn");
const resultID = document.getElementById("userID");
const resultUsername = document.getElementById("userName");
const resultCode = document.getElementById("userCode");
const resultMessage = document.getElementById("searchMessage");
const deleteButton = document.getElementById("deleteBtn");

const updateForm = document.getElementById("updateForm");
const updateButton = document.getElementById("updateBtn");
const updateResponse = document.getElementById("updateResponse");

const searchAllButton = document.getElementById("searchAllBtn");

searchAllButton.addEventListener("click", async () => {
    try {
        const res = await fetch("https://fordemo-ot4j.onrender.com/users/", {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        });
        const result = await res.json();
        resultMessage.textContent = result.message;
    } catch (error) {
        resultMessage.textContent = error.message;
    }
})

updateForm.addEventListener("submit", async (e) => {
    const updateQuery = document.getElementById("updateInput").value;
    const newUsername = document.getElementById("updateUsername").value;
    const newPassword = document.getElementById("updatePassword").value;

    try {
        e.preventDefault();
        const res = await fetch(`https://fordemo-ot4j.onrender.com/users/${updateQuery}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: newUsername, password: newPassword})
        });
        const result = await res.json();
        updateResponse.textContent = `User Updated: ${result.message}`;
    } catch (error) {
        updateResponse.textContent = `Failed to Update User: ${error.message}`;
    }
})

deleteButton.addEventListener("click", async () => {
    const query = document.getElementById("searchInput").value;
    try {
        const res = await fetch(`https://fordemo-ot4j.onrender.com/users/${query}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"}
    });
        const result = await res.json();
        resultMessage.textContent = `User Deleted: ${result.message}`;
    } catch (error) {
        resultMessage.textContent = `Failed to Delete User: ${error.message}`;
    }
})

searchButton.addEventListener("click", async () => {
    const query = document.getElementById("searchInput").value;
    try {
        const res = await fetch(`https://fordemo-ot4j.onrender.com/users/${query}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        });
        const result = await res.json();
        resultID.textContent = `ID: ${result.id}`;
        resultUsername.textContent = `Username1: ${result.username}`;
        resultCode.textContent = `Code: ${result.code}`;
        resultMessage.textContent = `Message: ${result.message}`;
    }
    catch (error) {
        resultMessage.textContent = `User Not Found: ${error.message}`;
    }
})

form.addEventListener("submit", async(e) => {
    try {
        e.preventDefault();
        
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const res = await fetch("https://fordemo-ot4j.onrender.com/users/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify({username, password})
        });
        const result = await res.json();
        postResponse.textContent = `${result.message} (ID: ${result.id}) (Code: ${result.code})`;
    } catch (error) {
        postResponse.textContent = `Failed to Create User: ${error.message}`;
    }
})
