(() => {

  /*
   * Navbar Dropdown Toggles
   */

  const toggleDropdown = (clickEvent: Event) => {
    (clickEvent.currentTarget as HTMLAnchorElement).closest(".navbar-item").classList.toggle("is-active");
  };

  const navbarDropdownToggleElements = document.querySelectorAll(".navbar-item.has-dropdown > .navbar-link");

  for (const toggleElement of navbarDropdownToggleElements) {
    toggleElement.addEventListener("click", toggleDropdown);
  }

  /*
  * Navbar Toggle
  */

  const navbarBurgerElement = document.querySelector(".navbar-burger");
  const navbarMenuElement = document.querySelector(".navbar-menu");

  navbarBurgerElement.addEventListener("click", () => {
    navbarMenuElement.classList.toggle("is-active");

    navbarBurgerElement.classList.toggle("is-active");
    navbarBurgerElement.setAttribute(
      "aria-expanded",
      navbarBurgerElement.classList.contains("is-active") ? "true" : "false");
  });
})();
