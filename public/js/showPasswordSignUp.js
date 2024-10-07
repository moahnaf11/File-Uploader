const password = document.querySelector('[data-id="password"]');
const confirmPassword = document.querySelector('[data-id="confirm"]');

const passwordSvg = password.nextElementSibling;
const confirmSvg = confirmPassword.nextElementSibling;

passwordSvg.addEventListener("click", (e) => {
  const inputType = password.getAttribute("type");
  if (inputType === "password") {
    password.setAttribute("type", "text");
  } else {
    password.setAttribute("type", "password");
  }
});

confirmSvg.addEventListener("click", (e) => {
  const inputType = confirmPassword.getAttribute("type");
  if (inputType === "password") {
    confirmPassword.setAttribute("type", "text");
  } else {
    confirmPassword.setAttribute("type", "password");
  }
});
