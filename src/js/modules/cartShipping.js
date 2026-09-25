/**
 * O Shopkit é a fonte dos métodos, portes e totais.
 * Apenas esclarece o estado pendente; nunca substitui uma cotação nativa.
 */
export function initCartShipping() {
  // Aviso legado guardado no painel: não manter uma promessa de preço no tema.
  document.querySelectorAll('.store-notice-text').forEach(function (notice) {
    if (/^Portes grátis para encomendas superiores a 50 euros\*?$/i.test(notice.textContent.trim())) {
      notice.textContent = 'Consulta os portes e as condições de entrega no checkout.';
    }
  });

  if (!/^\/cart\/?$/.test(window.location.pathname)) return;
  if (document.body.hasAttribute('data-aq-portes-bound')) return;
  document.body.setAttribute('data-aq-portes-bound', '1');

  function clarifyPendingShipping() {
    document.querySelectorAll('.cart-receipt .total-shipping').forEach(function (ship) {
      if (ship.textContent.trim() === 'A calcular') {
        ship.textContent = 'Portes calculados no checkout após indicar a morada.';
      }
    });
  }

  clarifyPendingShipping();
  // O Shopkit pode substituir o resumo após uma atualização do carrinho.
  // A comparação exata torna o observador idempotente e preserva preços reais.
  new MutationObserver(clarifyPendingShipping).observe(document.body, {
    childList: true, subtree: true, characterData: true
  });
}
