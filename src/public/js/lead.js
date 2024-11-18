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


// function addTagToSelectedLeads() {
//     const ids = getSelectedLeadIds();
//     if (ids) {
//         const tagName = prompt('Nhập tên thẻ muốn thêm:');
//         if (tagName && tagName.trim() !== '') {
//             // Send a POST request to add the tag to selected leads
//             fetch('/add-tag-to-leads', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     // Include CSRF token if needed
//                 },
//                 body: JSON.stringify({ ids: ids, tag_name: tagName.trim() })
//             })
//                 .then(response => {
//                     if (response.ok) {
//                         alert('Thêm thẻ thành công.');
//                         // Optionally, refresh the page or update the UI
//                         location.reload();
//                     } else {
//                         alert('Đã xảy ra lỗi khi thêm thẻ.');
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error:', error);
//                     alert('Đã xảy ra lỗi khi thêm thẻ.');
//                 });
//         } else {
//             alert('Tên thẻ không được để trống.');
//         }
//     }
// }

function addTagToSelectedLeads() {
    const ids = getSelectedLeadIds();
    if (ids) {
        const modalHtml = `
            <div id="tagModal" class="modal">
                <div class="modal-content">
                    <h3>Thêm thẻ</h3>
                    <div class="tag-input-container">
                        <input type="text" id="tagInput" placeholder="Nhập tên thẻ" autocomplete="off">
                        <div id="tagSuggestions" class="tag-suggestions"></div>
                    </div>
                    <div class="modal-buttons">
                        <button onclick="submitTag()">Thêm</button>
                        <button onclick="closeTagModal()">Hủy</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const tagInput = document.getElementById('tagInput');
        const tagSuggestions = document.getElementById('tagSuggestions');

        // Fetch existing tags
        fetch('/get-tags')
            .then(response => response.json())
            .then(tags => {
                // Show all tags when clicking the input field
                tagInput.addEventListener('focus', function () {
                    tagSuggestions.innerHTML = tags
                        .map(tag => `<div class="tag-suggestion" onclick="selectTag('${tag}')">${tag}</div>`)
                        .join('');
                    tagSuggestions.style.display = 'block';
                });

                // Filter tags while typing
                tagInput.addEventListener('input', function () {
                    const value = this.value.toLowerCase();
                    const filteredTags = tags.filter(tag =>
                        tag.toLowerCase().includes(value)
                    );

                    tagSuggestions.innerHTML = filteredTags
                        .map(tag => `<div class="tag-suggestion" onclick="selectTag('${tag}')">${tag}</div>`)
                        .join('');

                    tagSuggestions.style.display = filteredTags.length > 0 ? 'block' : 'none';
                });

                // Hide suggestions when clicking outside
                document.addEventListener('click', function (e) {
                    if (!tagInput.contains(e.target) && !tagSuggestions.contains(e.target)) {
                        tagSuggestions.style.display = 'none';
                    }
                });
            });
    }
}

function selectTag(tag) {
    document.getElementById('tagInput').value = tag;
    document.getElementById('tagSuggestions').style.display = 'none';
}

function submitTag() {
    const tagName = document.getElementById('tagInput').value;
    if (tagName && tagName.trim() !== '') {
        const ids = getSelectedLeadIds();
        fetch('/add-tag-to-leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids: ids, tag_name: tagName.trim() })
        })
            .then(response => {
                if (response.ok) {
                    alert('Thêm thẻ thành công.');
                    location.reload();
                } else {
                    alert('Đã xảy ra lỗi khi thêm thẻ.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Đã xảy ra lỗi khi thêm thẻ.');
            });
        closeTagModal();
    }
}

function closeTagModal() {
    const modal = document.getElementById('tagModal');
    if (modal) {
        modal.remove();
    }
}

function toggleTagColumn() {
    const tagColumns = document.getElementsByClassName('tag-column');
    const link = document.querySelector('.sidebar__title-link a');

    Array.from(tagColumns).forEach(column => {
        if (column.style.display === 'none') {
            column.style.display = '';
            link.textContent = 'Ẩn nhãn';
        } else {
            column.style.display = 'none';
            link.textContent = 'Hiện nhãn';
        }
    });
}
document.addEventListener('DOMContentLoaded', function () {
    const relativeTimeElements = document.querySelectorAll('.relative-time');

    relativeTimeElements.forEach(function (element) {
        const updatedAt = element.getAttribute('data-updated-at');
        const updatedDate = new Date(updatedAt);
        const now = new Date();
        const diff = now - updatedDate;

        let timeString = '';

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

        if (years > 0) {
            timeString = `${years} năm trước`;
        } else if (months > 0) {
            timeString = `${months} tháng trước`;
        } else if (weeks > 0) {
            timeString = `${weeks} tuần trước`;
        } else if (days > 0) {
            timeString = `${days} ngày trước`;
        } else if (hours > 0) {
            timeString = `${hours} giờ trước`;
        } else if (minutes > 0) {
            timeString = `${minutes} phút trước`;
        } else {
            timeString = `Vừa xong`;
        }

        element.textContent = timeString;
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const refreshButton = document.getElementById('refreshButton');

    refreshButton.addEventListener('click', function () {
        // Show loading spinner on the button
        refreshButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        refreshButton.disabled = true;

        // Reload the current page
        window.location.reload();
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