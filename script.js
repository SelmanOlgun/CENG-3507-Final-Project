document.addEventListener("DOMContentLoaded", () => {
  const sidebarLinks = document.querySelectorAll(".sidebar ul li a");
  const moduleFrame = document.getElementById("moduleFrame");

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const moduleName = link.getAttribute("data-module");

      moduleFrame.src = `modules/${moduleName}/index.html`;

      sidebarLinks.forEach((link) => link.classList.remove("active"));
      link.classList.add("active");
    });
  });
});
