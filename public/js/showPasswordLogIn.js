const password = document.querySelector('[data-id="password"]');
const passwordSvg = password.nextElementSibling;

passwordSvg.addEventListener("click", (e) => {
  const inputType = password.getAttribute("type");
  if (inputType === "password") {
    password.setAttribute("type", "text");
  } else {
    password.setAttribute("type", "password");
  }
});
