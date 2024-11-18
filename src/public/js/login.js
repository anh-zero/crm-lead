//submit the login
function handleLoginBtn() {
    $("#button_login").on("click", function (event) {
        event.preventDefault();
        let email = $("#email").val();
        let password = $("#password-input").val();

        $.ajax({
            url: `${window.location.origin}/login`,
            method: "POST",
            data: { email: email, password: password },
            success: function (data) {
                window.location.href = "/";
            },
            error: function (err) {
                alert("Nhập sai tên đăng nhập hoặc mật khẩu. Vui lòng nhập lại!");
            }
        })
    });
}
$(document).ready(function () {
    handleLoginBtn();
});
//toogle password or note
const passwordInput = document.getElementById('password-input');
const togglePassword = document.getElementById('toggle-password');

togglePassword.addEventListener('click', function () {
    // Toggle the type attribute
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Toggle the icon
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});