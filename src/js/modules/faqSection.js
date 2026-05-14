/**
 * faqSection.js – v2
 * Exporta buildFAQSection() para uso pelo homeOrchestrator.
 */

const FAQS = [
  { q: 'Fazem envios para todo Portugal continental e ilhas?',
    a: 'Sim! Enviamos para todo o Portugal continental, Madeira e Açores. Os prazos e custos de envio variam consoante o destino — consulta as condições de envio na página do carrinho.' },
  { q: 'Vendem peixes, plantas e invertebrados vivos?',
    a: 'Sim, trabalhamos com seres vivos! As encomendas de animais e plantas são cuidadosamente embaladas com materiais específicos para garantir a chegada em segurança. Em caso de problema na chegada, contacta-nos em até 2 horas com foto/vídeo.' },
  { q: 'Qual o prazo de entrega habitual?',
    a: 'Para equipamento e produtos secos, o prazo habitual é de 2 a 5 dias úteis. Para encomendas com seres vivos, os envios são feitos às terças e quartas-feiras para evitar atrasos no fim de semana.' },
  { q: 'Posso visitar a vossa loja física?',
    a: 'Claro! Temos loja física em Sintra onde podes ver os produtos ao vivo, pedir aconselhamento especializado e até trazer o teu aquário para diagnóstico. Consulta o nosso Google Maps para morada e horários.' },
  { q: 'Que marcas comercializam?',
    a: 'Trabalhamos com marcas de referência mundial como Tropica, ADA, JBL, Fluval, Oase, Dennerle, Eheim e Seachem, entre outras. Temos sempre stock renovado e acesso a encomenda especial.' },
  { q: 'Como escolher o filtro certo para o meu aquário?',
    a: 'Recomendamos um filtro capaz de filtrar pelo menos 4× o volume do aquário por hora. Por exemplo, para um aquário de 100L, procura um filtro com débito mínimo de 400 L/h. A nossa equipa pode ajudar-te a escolher a melhor solução — basta contactar-nos!' },
  { q: 'Devo usar CO₂ no meu aquário plantado?',
    a: 'Depende das plantas que pretendes manter. Para plantações simples (Anubias, Java Fern, Musgo), o CO₂ líquido ou fertilizantes são suficientes. Para aquascaping intensivo com plantas exigentes, um sistema de CO₂ gasoso faz toda a diferença.' },
  { q: 'Aceitam devoluções?',
    a: 'Sim, tens 14 dias para devolver produtos em bom estado, conforme a legislação europeia de comércio eletrónico. Para seres vivos, a política é diferente — lê com atenção as condições na página de Termos e Condições.' },
];

function buildFAQSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

export function buildFAQSection() {
  if (document.getElementById('aq-faq')) return null;

  buildFAQSchema();

  const section = document.createElement('section');
  section.id = 'aq-faq';

  const header = document.createElement('div');
  header.className = 'aq-section-header';
  header.innerHTML = `
    <span class="aq-section-tag">Dúvidas</span>
    <h2 class="aq-section-title">Perguntas <span class="aq-neon">Frequentes</span></h2>
    <p class="aq-section-sub">Tudo o que precisas de saber antes de comprar</p>
  `;
  section.appendChild(header);

  const list = document.createElement('div');
  list.className = 'aq-faq-list';

  FAQS.forEach(({ q, a }, i) => {
    const item = document.createElement('div');
    item.className = 'aq-faq-item';

    const btn = document.createElement('button');
    btn.className = 'aq-faq-q';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', `aq-faq-a-${i}`);
    btn.innerHTML = `
      <span>${q}</span>
      <svg class="aq-faq-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    const answer = document.createElement('div');
    answer.className = 'aq-faq-a';
    answer.id = `aq-faq-a-${i}`;
    const p = document.createElement('p');
    p.textContent = a;
    answer.appendChild(p);

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      list.querySelectorAll('.aq-faq-q[aria-expanded="true"]').forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.closest('.aq-faq-item').classList.remove('open');
        }
      });
      btn.setAttribute('aria-expanded', String(!isOpen));
      item.classList.toggle('open', !isOpen);
    });

    item.appendChild(btn);
    item.appendChild(answer);
    list.appendChild(item);
  });

  section.appendChild(list);
  return section;
}

// Mantido por compatibilidade
export function initFAQSection() {}
