
// Ambil data user dari sessionStorage
const user = JSON.parse(sessionStorage.getItem('user'));
let currentUsername; 
    
if (user && user.username) {
    // Tampilkan username di elemen dengan id usernameDisplay
    document.getElementById("usernameDisplay").textContent = `Welcome, ${user.username}`;
    currentUsername = user.username;
} else {
    // Jika tidak ada data user, arahkan kembali ke halaman login
    window.location.href = 'login_regis.html';
};

// Fungsi untuk mengambil tugas dari storage
function getTasksFromStorage(username) {
    // Cek apakah sudah ada data tugas yang disimpan untuk pengguna ini
    const storedTasks = localStorage.getItem(username + '_tasks');
    
    if (storedTasks) {
        // Jika ada, parse data JSON menjadi array tugas
        return JSON.parse(storedTasks);
    } else {
        // Jika belum ada, kembalikan array kosong
        return [];
    }
};

function saveTasksToStorage(username, tasks) {
    localStorage.setItem(username + '_tasks', JSON.stringify(tasks));
};


 // Fungsi untuk logout dan hapus data user dari sessionStorage
 function logout() {
    sessionStorage.removeItem('user');
    window.location.href = 'login_regis.html';
};

// JavaScript yang menangani tab buttons
const tabs = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
     
// Set the initial active tab and content
tabs[0].classList.add('active-tab');
tabContents[0].style.display = 'block'; // Show Task List content

// Add click event for each tab button
tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove active-tab from all buttons and hide all contents
        tabs.forEach(t => {
            t.classList.remove('active-tab');
        });

        tabContents.forEach(content => {
            content.style.display = 'none';
        });

        // Add active-tab to the clicked button and show related content
        this.classList.add('active-tab');
        const contentId = this.getAttribute('data-tab') + 'Content';
        document.getElementById(contentId).style.display = 'block';
    });
});


// Array to store tasks
// const tasks = [
//     { name: 'Sample Task', deadline: '15/10/2024', status: 'Assigned', workingTime: '1d 2h 30m', description: 'This is a sample task' },
//     { name: 'Another Task', deadline: '20/10/2024', status: 'In Progress', workingTime: '2d 1h', description: 'This is another task' },
//     { name: 'Makan siang', deadline: '14/10/2024', status: 'Unassigned', workingTime: '2d 1h', description: 'This is another task' }
// ];

// Array untuk menyimpan tugas
let tasks = getTasksFromStorage(currentUsername); // Ambil tugas dari storage jika ada


// Fungsi untuk menghapus tugas dari tabel dan array tasks
function deleteTask(button) {
    // Ambil nama tugas dari baris yang ingin dihapus
    const taskName = button.parentElement.parentElement.querySelector('span').textContent;

    // Hapus tugas dari array tasks
    const taskIndex = tasks.findIndex(task => task.name === taskName);
    if (taskIndex > -1) {
        tasks.splice(taskIndex, 1); // Hapus tugas dari array
    }

    // Hapus row dari tabel
    const row = button.parentElement.parentElement;
    row.remove();

    // Simpan tugas ke localStorage
    saveTasksToStorage(currentUsername, tasks);
};

// Fungsi untuk menampilkan tugas
function displayTasksList(taskList) {
    const tableBody = document.querySelector('#taskListBody');
    tableBody.innerHTML = ''; // Kosongkan tabel sebelum menampilkan tugas baru

    taskList.forEach(task => {
        // Menentukan warna berdasarkan status
        let statusColor;
        if (task.status === "Assigned") {
            statusColor = "bg-pink-500"; // Pink
        } else if (task.status === "In Progress") {
            statusColor = "bg-sky-500"; // Biru Langit
        } else {
            statusColor = "bg-gray-300"; // Abu-abu
        }
        const row = `
            <tr class="border-t border-t-[#E9DFCE]">
                <td class="h-[72px] px-4 py-2 text-[#1C160C] text-sm font-normal leading-normal flex items-center">
                    <span>${task.name}</span>
                </td>
                <td class="h-[72px] px-4 py-2 text-[#A18249] text-sm font-normal leading-normal">${task.deadline}</td>
                <td class="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-3 ${statusColor} text-white text-sm font-medium leading-normal w-full">
                    <span class="truncate">${task.status}</span>
                </button>
            </td>
                <td class="h-[72px] px-4 py-2 text-[#A18249] text-sm font-normal leading-normal">${task.workingTime}</td>
                <td>
                    <button class="btn btn-info" onclick="showTaskInfo('${task.name}', '${task.status}', '${task.deadline}', '${task.description}')">Info</button>
                    <button class="btn btn-danger" onclick="deleteTask(this)">Delete</button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
};

console.log(taskDeadline)
// Tampilkan semua tugas saat pertama kali dimuat
displayTasksList(tasks);


// Mencari tugas berdasarkan input
function searchTasksList() {
    const keyword = document.getElementById('keywordInput').value.toLowerCase();
    
    if (keyword === '') {
        // Jika input kosong, tampilkan semua tugas
        displayTasksList(tasks);
    } else {
        const filteredTasks = tasks.filter(task => 
            task.name.toLowerCase().includes(keyword) || 
            task.description.toLowerCase().includes(keyword)
        );
        displayTasksList(filteredTasks);
    }
}

// Event Listener untuk tombol pencarian
document.getElementById('button-addon2').addEventListener('click', searchTasksList);

// Menggunakan enter untuk mencari tugas
document.getElementById('keywordInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchTasksList();
    }
});



// Bagian mengambil inputan user
document.getElementById('saveTaskBtn').addEventListener('click', function() {
    const taskName = document.getElementById('taskName').value;
    const taskDeadline = new Date(document.getElementById('taskDeadline').value);
     
    const taskStatus = document.getElementById('taskStatus').value;
    const taskDescription = document.getElementById('taskDescription').value;

    const currentTime = new Date();
    const timeDiff = taskDeadline - currentTime; // Waktu tersisa dalam milidetik
    const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const workingTime = `${daysLeft}d ${hoursLeft}h ${minutesLeft}m`;

    // Menentukan warna berdasarkan status
    let statusColor;
    if (taskStatus === "Assigned") {
        statusColor = "bg-pink-500"; // Pink
    } else if (taskStatus === "In Progress") {
        statusColor = "bg-sky-500"; // Biru Langit
    } else {
        statusColor = "bg-gray-300"; // Abu-abu
    }

    // Create a task object
    const task = {
        name: taskName,
        deadline: taskDeadline.toLocaleDateString(),
        status: taskStatus,
        workingTime: workingTime,
        description: taskDescription
    };

    // Add task to the tasks array
    tasks.push(task);

   

    // Menambahkan baris baru ke tabel
    const tableBody = document.querySelector('#taskListBody');
    const newRow = `
        <tr class="border-t border-t-[#E9DFCE]">
            <td class="h-[72px] px-4 py-2 text-[#1C160C] text-sm font-normal leading-normal flex items-center">
                <span>${taskName}</span>
            </td>
            <td class="h-[72px] px-4 py-2 text-[#A18249] text-sm font-normal leading-normal">${taskDeadline.toLocaleDateString()}</td>
            <td class="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-3 ${statusColor} text-white text-sm font-medium leading-normal w-full">
                    <span class="truncate">${taskStatus}</span>
                </button>
            </td>
            <td class="h-[72px] px-4 py-2 text-[#A18249] text-sm font-normal leading-normal">${workingTime}</td>
            <td>
                <button class="btn btn-info" onclick="showTaskInfo('${taskName}', '${taskStatus}', '${taskDeadline.toLocaleDateString()}', '${taskDescription}')">Info</button>
                <button class="btn btn-danger" onclick="deleteTask(this)">Delete</button>
            </td>
        </tr>
    `;
    // Sisipkan baris baru di baris pertama
    tableBody.insertAdjacentHTML('afterbegin', newRow);

    // Simpan tugas ke localStorage
    saveTasksToStorage(currentUsername, tasks);

    performanceTasks();

    
    // Menutup modal
    $('#taskModal').modal('hide');
    document.getElementById('taskForm').reset();
});



// Fungsi untuk mengedit tugas yang ada
function editTask(taskName) {
    const task = tasks.find(t => t.name === taskName); // Mencari tugas berdasarkan nama
    if (task) {
        // Mengisi form dengan data tugas yang ada
        document.getElementById('editTaskName').value = task.name;
        document.getElementById('editTaskDeadline').value = task.deadline;
        document.getElementById('editTaskStatus').value = task.status;
        document.getElementById('editTaskDescription').value = task.description;

        // Simpan nama tugas yang sedang diedit di atribut data modal
        document.getElementById('editTaskModal').dataset.taskName = taskName;

        // Tampilkan modal edit
        const editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
        editTaskModal.show();
    }
}

// Fungsi untuk menyimpan perubahan tugas
function saveEditTask() {
    const taskName = document.getElementById('editTaskModal').dataset.taskName; // Nama tugas yang sedang diedit
    const updatedTask = {
        name: document.getElementById('editTaskName').value,
        deadline: new Date(document.getElementById('editTaskDeadline').value).toLocaleDateString(),
        status: document.getElementById('editTaskStatus').value,
        description: document.getElementById('editTaskDescription').value
    };

    // Mencari index tugas yang akan diperbarui
    const taskIndex = tasks.findIndex(t => t.name === taskName);
    if (taskIndex !== -1) {
        // Memperbarui tugas di array
        tasks[taskIndex] = updatedTask;

        // Memperbarui tampilan tabel
        updateTaskTable();

        // Simpan tugas ke localStorage
        saveTasksToStorage(currentUsername, tasks);

        // Tutup modal
        const editTaskModal = bootstrap.Modal.getInstance(document.getElementById('editTaskModal'));
        editTaskModal.hide();
    }
}

// Fungsi untuk memperbarui tampilan tabel
function updateTaskTable() {
    const tableBody = document.querySelector('#taskListBody');
    tableBody.innerHTML = ''; // Kosongkan tabel sebelum mengisi ulang

    tasks.forEach(task => {
        const currentTime = new Date();
        const taskDeadline = new Date(task.deadline);
        const timeDiff = taskDeadline - currentTime;
        const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const workingTime = `${daysLeft}d ${hoursLeft}h ${minutesLeft}m`;

        // Menentukan warna berdasarkan status
        let statusColor;
        if (task.status === "Assigned") {
            statusColor = "bg-pink-500"; // Pink
        } else if (task.status === "In Progress") {
            statusColor = "bg-sky-500"; // Biru Langit
        } else {
            statusColor = "bg-gray-300"; // Abu-abu
        }

        // Menambahkan baris baru ke tabel
        const newRow = `
            <tr class="border-t border-t-[#E9DFCE]">
                <td class="h-[72px] px-4 py-2 text-[#1C160C] text-sm font-normal leading-normal flex items-center">
                    <span>${task.name}</span>
                </td>
                <td class="h-[72px] px-4 py-2 text-[#A18249] text-sm font-normal leading-normal">${task.deadline}</td>
                <td class="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                    <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-3 ${statusColor} text-white text-sm font-medium leading-normal w-full">
                        <span class="truncate">${task.status}</span>
                    </button>
                </td>
                <td class="h-[72px] px-4 py-2 text-[#A18249] text-sm font-normal leading-normal">${workingTime}</td>
                <td>
                    <button class="btn btn-info" onclick="editTask('${task.name}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteTask(this)">Delete</button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', newRow);
    });
}

// Event listener untuk tombol "Save Changes" di modal edit
document.getElementById('saveEditTaskBtn').addEventListener('click', saveEditTask);

// Fungsi untuk membuka modal informasi tugas dengan detail
function showTaskInfo(taskName, taskStatus, taskDeadline, taskDescription) {
    // Isi modal informasi tugas
    document.getElementById('infoTaskName').textContent = taskName;
    document.getElementById('infoTaskStatus').textContent = taskStatus;
    document.getElementById('infoTaskDueDate').textContent = taskDeadline;
    document.getElementById('infoTaskDescription').textContent = taskDescription || "No comments";

    // Tampilkan modal informasi tugas
    $('#infoTugasModal').modal('show');
}

// Mengubah ke format YYYY-MM-DD
function convertToISODate(dateString) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
}

// Menampilkan tugas
function performanceTasks() {
    const pastIncompleteList = document.getElementById("past-incomplete-tasks-list");
    const pastCompleteList = document.getElementById("past-complete-tasks-list");
    const upcomingTasksList = document.getElementById("upcoming-tasks-list");

    const today = new Date().toISOString().split('T')[0];

    // Reset isi daftar tugas setiap kali dipanggil
    pastIncompleteList.innerHTML = '';
    pastCompleteList.innerHTML = '';
    upcomingTasksList.innerHTML = '';

    tasks.forEach(task => {
        const taskDeadline = convertToISODate(task.deadline); // Konversi tanggal
        let statusColor;
        if (task.status === "Assigned") {
            statusColor = "bg-pink-500"; // Pink
        } else if (task.status === "In Progress") {
            statusColor = "bg-sky-500"; // Biru Langit
        } else {
            statusColor = "bg-gray-300"; // Abu-abu
        }

        const row = `
            <tr class="border-t border-t-[#E9DFCE]">
                <td class="h-[72px] px-4 py-2 text-[#1C160C] text-sm font-normal leading-normal flex items-center">
                    <span>${task.name}</span>
                </td>
                <td class="h-[72px] px-4 py-2 text-[#A18249] text-sm font-normal leading-normal">${task.deadline}</td>
                <td class="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-3 ${statusColor} text-white text-sm font-medium leading-normal w-full">
                    <span class="truncate">${task.status}</span>
                </button>
            </td>
                <td class="h-[72px] px-4 py-2 text-[#A18249] text-sm font-normal leading-normal">${task.workingTime}</td>
                <td>
                    <button class="btn btn-info" onclick="showTaskInfo('${task.name}', '${task.status}', '${task.deadline}', '${task.description}')">Info</button>
                    <button class="btn btn-danger" onclick="deleteTask(this)">Delete</button>
                </td>
            </tr>
        `;

        // Kategori tugas berdasarkan deadline dan status
        if (task.status === 'In Progress' || task.deadline >= today) {
            // Tugas yang sedang dikerjakan atau masih dalam jangka waktu
            upcomingTasksList.insertAdjacentHTML('afterbegin', row);
        } else if (task.status === 'Assigned' && task.deadline < today) {
            // Tugas yang sudah diberikan dan melewati tenggat waktu (selesai)
            pastCompleteList.insertAdjacentHTML('afterbegin', row);
        } else if (task.deadline < today && task.status == 'Unassigned') {
            // Tugas yang belum selesai tapi melewati tenggat waktu
            pastIncompleteList.insertAdjacentHTML('afterbegin', row);
        }
        
    });
};


// Tampilkan tugas pada awalnya
performanceTasks();
console.log(tasks)

function generateTaskSummary(tasks) {
    const totalTasks = tasks.length;
    const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
    const assignedTasks = tasks.filter(task => task.status === 'Assigned').length;
    const unassignedTasks = tasks.filter(task => task.status === 'Unassigned').length;

    return `Total tasks: ${totalTasks} | In Progress: ${inProgressTasks} | Assigned: ${assignedTasks} | Unassigned: ${unassignedTasks}`;
};

// Fungsi untuk menampilkan summary dari task
function updateTaskSummary() {
    const summaryText = generateTaskSummary(tasks);
    document.getElementById('taskSummary').textContent = summaryText;
}

// Event listener untuk elemen dengan ID 'cekPerformance'
document.getElementById('cekPerformance').addEventListener('click', function() {
    // Setiap kali tombol atau elemen ini di-klik, panggil fungsi updateTaskSummary
    updateTaskSummary();
});
// Event listener untuk elemen dengan ID 'takss'
document.getElementById('takss').addEventListener('click', function() {
    // Setiap kali tombol atau elemen ini di-klik, panggil fungsi updateTaskSummary
    displayTasksList(tasks);
});

function convertDateFormat(dateString) {
    const parts = dateString.split('/');
    // parts[0] = day, parts[1] = month, parts[2] = year
    return new Date(parts[2], parts[1] - 1, parts[0]); // Month is 0-indexed in Date
}

function filterTasks() {
    const status = document.getElementById('filter-status').value;
    const year = document.getElementById('filter-year').value;
    const month = document.getElementById('filter-month').value;
    const week = document.getElementById('filter-week').value;

    const filteredTasks = tasks.filter(task => {
        const taskDate = convertDateFormat(task.deadline);
        const taskYear = taskDate.getFullYear();
        const taskMonthIndex = String(taskDate.getMonth() + 1).padStart(2, '0'); // Bulan dalam angka
        const filterMonthIndex = getMonthIndex(month); // Konversi nama bulan input ke angka
        const taskWeekNumberInMonth = getWeekNumberInMonth(taskDate);

        return (
            (!status || task.status === status) &&
            (!year || taskYear === parseInt(year)) &&
            (!month || taskMonthIndex === filterMonthIndex) && // Bandingkan bulan dalam angka
            (!week || taskWeekNumberInMonth === parseInt(week))
        );
    });

    displayTasksList(filteredTasks);
}

function getMonthIndex(monthName) {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return String(months.indexOf(monthName) + 1).padStart(2, '0'); // Tambahkan leading zero jika perlu
}

function getWeekNumberInMonth(date) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayWeekday = firstDayOfMonth.getDay(); // Hari pertama bulan ini (0 = Minggu, 1 = Senin, ...)
    const dayOfMonth = date.getDate(); // Hari ke-n pada bulan ini

    // Menghitung minggu dalam bulan, tambahkan offset jika minggu tidak dimulai dari hari Minggu
    return Math.ceil((dayOfMonth + firstDayWeekday) / 7);
}

// Event Listener for filter
document.getElementById('filter-status').addEventListener('change', filterTasks);
document.getElementById('filter-year').addEventListener('input', filterTasks);
document.getElementById('filter-month').addEventListener('input', filterTasks);
document.getElementById('filter-week').addEventListener('input', filterTasks);


// Event Listener untuk tombol reset
document.getElementById('reset-filters').addEventListener('click', resetFilters);

// Fungsi untuk mereset filter
function resetFilters() {
    document.getElementById('filter-status').value = ''; // Reset dropdown status
    document.getElementById('filter-year').value = ''; // Reset input tahun
    document.getElementById('filter-month').value = ''; // Reset input bulan
    document.getElementById('filter-week').value = ''; // Reset input minggu

    // Tampilkan kembali semua tugas
    displayTasksList(tasks);
}
