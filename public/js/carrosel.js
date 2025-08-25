// O addeventlistener garante que o script só será executado depois do carregamento completo do DOM que é a estrutura HTML da página
document.addEventListener('DOMContentLoaded', function () {
    const scrollers = document.querySelectorAll('.scroller');

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        adicionarAnimacaoCarrosel(scrollers);
    }

    function adicionarAnimacaoCarrosel(scrollers) {
        scrollers.forEach((scroller) => {
            scroller.setAttribute('data-animate', 'true');

            const scrollerInner = scroller.querySelector('.scroller_inner');
            // Evita duplicar infinitamente
            if (!scrollerInner.dataset.duplicated) {
                const scrollerContent = Array.from(scrollerInner.children);
                scrollerContent.forEach(item => {
                    const duplicatedItem = item.cloneNode(true);
                    duplicatedItem.setAttribute('aria-hidden', 'true');
                    scrollerInner.appendChild(duplicatedItem);
                });
                scrollerInner.dataset.duplicated = "true";
            }
        });
    }
});