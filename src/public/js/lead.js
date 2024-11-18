function getSelectedLeadId() {
    const checkboxes = document.querySelectorAll('input[name="row-check"]:checked');
    if (checkboxes.length === 1) {
        return checkboxes[0].value;
    } else if (checkboxes.length === 0) {
        alert('Vui lòng chọn một khách hàng để thực hiện hành động.');
        return null;
    } else {
        alert('Chỉ chọn một khách hàng tại một thời điểm.');
        return null;
    }
}

function getSelectedLeadIds() {
    const checkboxes = document.querySelectorAll('input[name="row-check"]:checked');
    const ids = Array.from(checkboxes).map(cb => cb.value);
    if (ids.length === 0) {
        alert('Vui lòng chọn ít nhất một khách hàng để thực hiện hành động.');
        return null;
    }
    return ids;
}

function editSelectedLead() {
    const leadId = getSelectedLeadId();
    if (leadId) {
        window.location.href = '/edit-lead/' + leadId;
    }
}

function deleteSelectedLeads() {
    const ids = getSelectedLeadIds();
    if (ids) {
        if (confirm('Bạn có chắc muốn xóa các khách hàng đã chọn?')) {
            // Send a POST request to delete the selected leads
            fetch('/delete-leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include CSRF token if needed
                },
                body: JSON.stringify({ ids: ids })
            })
                .then(response => {
                    if (response.ok) {
                        // Optionally, refresh the page or remove deleted rows from the UI
                        location.reload();
                    } else {
                        alert('Đã xảy ra lỗi khi xóa khách hàng.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Đã xảy ra lỗi khi xóa khách hàng.');
                });
        }
    }
}

$(function () {
    // Khi checkbox "#check_all" được click
    $("#check_all").on("click", function () {
        const isChecked = this.checked; // Kiểm tra trạng thái của "#check_all"
        $(".abcd[name='row-check']").prop("checked", isChecked); // Chọn/bỏ chọn tất cả checkbox với class "abcd"
        $(".taochiu").prop("checked", isChecked); // Đồng bộ chọn/bỏ chọn checkbox "taochiu"
    });

    // Khi bất kỳ checkbox nào có class "abcd" được click
    $(".abcd[name='row-check']").on("change", function () {
        const allChecked = $(".abcd[name='row-check']").length === $(".abcd[name='row-check']:checked").length;

        // Cập nhật trạng thái của "#check_all" dựa trên trạng thái của các checkbox ".abcd"
        $("#check_all").prop("checked", allChecked);

        // Cập nhật trạng thái của "taochiu" nếu có ít nhất một checkbox ".abcd" được chọn
        const isAnyChecked = $(".abcd[name='row-check']:checked").length > 0;
        $(".taochiu").prop("checked", isAnyChecked);
    });
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