export function injectMenuIcons() {
  const menuLinks = document.querySelectorAll('.menu-link, .nav-link, .header-menu a, #header a');
  
  if (!menuLinks.length) return;

  // Mapa de palavras-chave para ícones do RemixIcon
  const iconMap = {
    'equipamento': 'ri-settings-4-line',
    'alimentação': 'ri-restaurant-line',
    'hardscape': 'ri-landscape-line',
    'plantas': 'ri-plant-line',
    'peixes': 'ri-anchor-line', // RemixIcon não tem peixe perfeito, âncora/água serve
    'invertebrados': 'ri-bug-line',
    'outros': 'ri-archive-line',
    'condicionadores': 'ri-flask-line',
    'aquascaping': 'ri-quill-pen-line'
  };

  menuLinks.forEach(link => {
    // Evitar injetar ícones em links de sistema (como ícone de carrinho ou login)
    if (link.querySelector('i') || link.children.length > 0) return;

    const text = link.textContent.toLowerCase().trim();
    
    // Procura por correspondência no mapa
    for (const [key, iconClass] of Object.entries(iconMap)) {
      if (text.includes(key)) {
        // Cria o ícone
        const icon = document.createElement('i');
        icon.className = `${iconClass} menu-dynamic-icon`;
        icon.style.marginRight = '8px';
        icon.style.color = '#08EEBC';
        icon.style.fontSize = '1.1rem';
        icon.style.verticalAlign = 'middle';
        
        // Inserir antes do texto
        link.prepend(icon);
        break; // Aplica só o primeiro que encontrar
      }
    }
  });
}
