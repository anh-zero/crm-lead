// Hàm hiển thị ảnh người dùng đã chọn
function loadFile(event) {
    const profileImage = document.getElementById('profileImage');
    const deleteBtn = document.getElementById('deleteBtn');

    profileImage.src = URL.createObjectURL(event.target.files[0]);
    deleteBtn.style.display = 'block'; // Hiển thị nút "Xóa" khi có ảnh
}

// Hàm xóa ảnh và ẩn nút "Xóa"
function deleteImage() {
    const profileImage = document.getElementById('profileImage');
    const fileInput = document.getElementById('fileInput');
    const deleteBtn = document.getElementById('deleteBtn');

    profileImage.src = ""; // Đặt ảnh về mặc định
    fileInput.value = ""; // Xóa giá trị của input file
    deleteBtn.style.display = 'none'; // Ẩn nút "Xóa"
}
// Cấu hình CKeditor cho notes
CKEDITOR.replace('editor');
// hides the notifications area in CKEditor, a WYSIWYG text editor.
document.addEventListener('DOMContentLoaded', function () {
    if (typeof CKEDITOR !== 'undefined') {
        // Find the instance of CKEditor and set the configuration
        for (var instance in CKEDITOR.instances) {
            if (CKEDITOR.instances.hasOwnProperty(instance)) {
                CKEDITOR.instances[instance].config.versionCheck = false;
            }
        }
    }
});

// Cập nhật chức năng collapsible
document.querySelectorAll('.section-title').forEach(function (title) {
    title.addEventListener('click', function () {
        this.classList.toggle('active');
        var content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
});
// Add this to your existing script section
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all section-content elements as collapsed
    document.querySelectorAll('.section-content').forEach(function (content) {
        content.style.maxHeight = null;
    });

    // Update toggle icons to show collapsed state
    document.querySelectorAll('.toggle-icon').forEach(function (icon) {
        icon.textContent = '▲';
    });
});

// Display selected file name
const fileInput = document.getElementById('attachments');
const fileNameDisplay = document.getElementById('file-name-display');

fileInput.addEventListener('change', function () {
    // Remove this line to keep existing files displayed
    // fileNameDisplay.innerHTML = '';

    if (this.files && this.files.length > 0) {
        // Loop through all selected files
        for (let i = 0; i < this.files.length; i++) {
            const file = this.files[i];
            const listItem = document.createElement('li');
            listItem.textContent = file.name;
            fileNameDisplay.appendChild(listItem);
        }
    }
});


const sidebar = document.querySelector('.sidebar');
const toggle_menu = document.querySelector('.toggle_menu');
const content = document.querySelector('.content__main');
const content6 = document.querySelector('.content__main-list-shortcut');
const content1 = document.querySelector('.one');
const content2 = document.querySelector('.two');
const content3 = document.querySelector('.three');
const content4 = document.querySelector('.four');
const content5 = document.querySelector('.five');


toggle_menu.onclick = function () {
    sidebar.classList.toggle('hide');
    content.classList.toggle('expand');
    content1.classList.toggle('expand');
    content2.classList.toggle('expand');
    content3.classList.toggle('expand');
    content4.classList.toggle('expand');
    content5.classList.toggle('expand');
    content6.classList.toggle('expand');
}