(() => {
  const data = window.NOTES_CONTENT;
  const main = document.getElementById('main-content');
  const nav = document.getElementById('section-nav');
  const search = document.getElementById('search');

  document.title = `${data.site.documentTitle} — ${data.site.pageTitle}`;
  document.getElementById('brand-name').textContent = data.site.brand;
  document.getElementById('status-label').textContent = data.site.statusLabel;

  const escapeHtml = value => value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const termPattern = new RegExp(
    `(${data.accentTerms
      .slice()
      .sort((a, b) => b.length - a.length)
      .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|')})`,
    'gi'
  );

  function accentPlainText(text) {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map(part => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return `<strong class="text-accent">${escapeHtml(part.slice(2, -2))}</strong>`;
      }
      return escapeHtml(part).replace(termPattern, '<span class="text-accent">$1</span>');
    }).join('');
  }

  function renderRichText(text) {
    const mathPattern = /\\\((.+?)\\\)/g;
    let html = '';
    let cursor = 0;
    for (const match of text.matchAll(mathPattern)) {
      html += accentPlainText(text.slice(cursor, match.index));
      html += `<span class="math-inline">\\(${match[1]}\\)</span>`;
      cursor = match.index + match[0].length;
    }
    html += accentPlainText(text.slice(cursor));
    return html;
  }

  function blockHtml(block) {
    if (block.type === 'paragraph') return `<p>${renderRichText(block.text)}</p>`;
    if (block.type === 'quote') return `<blockquote class="quote"><p>${renderRichText(block.text)}</p></blockquote>`;
    if (block.type === 'list') return `<ul>${block.items.map(item => `<li>${renderRichText(item)}</li>`).join('')}</ul>`;
    if (block.type === 'equation') {
      const important = block.important ? ' equation--important' : '';
      return `<div class="equation${important}">\\[${block.latex}\\]</div>`;
    }
    return '';
  }

  function render(sections = data.sections) {
    nav.innerHTML = sections.map(section =>
      `<a href="#${section.id}" data-section="${section.id}">${renderRichText(section.title)}</a>`
    ).join('');

    main.innerHTML = `
      <h1 class="document__title">${escapeHtml(data.site.pageTitle)}</h1>
      <div class="document__eyebrow">${escapeHtml(data.site.eyebrow)}</div>
      ${sections.length ? sections.map(section => `
        <section id="${section.id}" class="section">
          <h2>${renderRichText(section.title)}</h2>
          ${section.blocks.map(blockHtml).join('')}
        </section>
      `).join('') : '<div class="empty-state">No matching sections.</div>'}
    `;

    if (window.MathJax?.typesetPromise) {
      MathJax.typesetClear?.([main]);
      MathJax.typesetPromise([main]);
    }
    activateScrollSpy();
  }

  let observer;
  function activateScrollSpy() {
    observer?.disconnect();
    const links = [...nav.querySelectorAll('a')];
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach(link => link.classList.toggle('is-active', link.dataset.section === entry.target.id));
      }
    }, { rootMargin: '-25% 0px -65% 0px', threshold: 0.01 });
    main.querySelectorAll('.section').forEach(section => observer.observe(section));
  }

  search.addEventListener('input', event => {
    const query = event.target.value.toLowerCase().trim();
    const filtered = query
      ? data.sections.filter(section =>
          section.title.toLowerCase().includes(query) ||
          section.blocks.some(block => JSON.stringify(block).toLowerCase().includes(query))
        )
      : data.sections;
    render(filtered);
  });

  render();
})();
