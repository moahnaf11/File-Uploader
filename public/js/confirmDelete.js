// delete folder
const deleteFolder = document.querySelectorAll('[data-id="delfolder"]');

deleteFolder.forEach((a) => {
  a.addEventListener("click", (e) => {
    const isConfirm = confirm(
      "Warning this action can not be undone. Deleting a folder will delete all its contents. Do you want to proceed?"
    );
    if (!isConfirm) {
      e.preventDefault();
    }
  });
});

// delete file
const deleteFile = document.querySelectorAll('[data-id="delfile"]');

deleteFile.forEach((a) => {
  a.addEventListener("click", (e) => {
    const isConfirm = confirm(
      "Warning this action can not be undone. Do you want to proceed?"
    );
    if (!isConfirm) {
      e.preventDefault();
    }
  });
});
