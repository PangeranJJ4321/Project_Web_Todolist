import { User } from 'user.js';

// Fungsi untuk mengambil data pengguna dari localStorage
function getUsersFromStorage() {
    const usersData = localStorage.getItem('users');
    return usersData ? JSON.parse(usersData) : [];
}

// Fungsi untuk menyimpan data pengguna ke localStorage
function saveUsersToStorage(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Fungsi untuk menampilkan pesan kesalahan
function showErrorMessage(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'block';
    errorMessage.textContent = message;
}

// Fungsi untuk menghilangkan pesan kesalahan
function hideErrorMessage() {
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'none';
}

// Fungsi untuk validasi login
function validateLogin(inputUsername, inputPassword, user) {
    return user.username === inputUsername && user.password === inputPassword;
}

// Login form submission
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    hideErrorMessage(); // Menghilangkan pesan kesalahan sebelum validasi

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value; 

    let users = getUsersFromStorage();

    const foundUser = users.find(user => validateLogin(username, password, user));

    if (foundUser) {
        // Simpan user ke sessionStorage
        sessionStorage.setItem('user', JSON.stringify(foundUser));
        window.location.href = 'home.html';
    } else {
        showErrorMessage("Invalid username or password!");
    }
});


// Register form submission
document.getElementById('registerForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    hideErrorMessage(); // Menghilangkan pesan kesalahan sebelum validasi

    const username = document.getElementById('registerUsername').value; // Ganti ID dengan 'registerUsername'
    const password = document.getElementById('registerPassword').value; // Ganti ID dengan 'registerPassword'

    let users = getUsersFromStorage();

    const userExists = users.find(user => user.username === username);
    if (userExists) {
        showErrorMessage("Username already exists!");
    } else if (username === "" || password === "") {
        showErrorMessage("Username and password cannot be empty!");
    } else {
        // Tambahkan user baru ke array
        const newUser = new User(username, password);
        users.push(newUser);

        // Simpan user baru ke localStorage
        saveUsersToStorage(users);

        alert("Registration successful! Please log in.");
    }
});

