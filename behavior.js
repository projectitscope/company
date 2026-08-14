<script>
  let lastScrollTop = 0;
  const header = document.getElementById("main-header");

  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
      // Scroll para baixo
      header.style.top = "0px"; // Mostra o header
    } else {
      // Scroll para cima
      header.style.top = "0"; // Mostra o header
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Evita valor negativo
  });
</script>
