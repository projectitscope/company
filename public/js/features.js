// IT SCOPE — Interactive Features Engine
// Calculadora de ROI, Carrossel de Depoimentos, FAQ Accordion, Modal de Contato

document.addEventListener('DOMContentLoaded', function() {

  // ===================================================================
  // 1. CALCULADORA DE ROI — Sliders + Cálculos em Tempo Real
  // ===================================================================
  const sliderServers = document.getElementById('roi-servers');
  const sliderCost = document.getElementById('roi-cost');
  const sliderProcesses = document.getElementById('roi-processes');
  const valServers = document.getElementById('roi-servers-val');
  const valCost = document.getElementById('roi-cost-val');
  const valProcesses = document.getElementById('roi-processes-val');
  const resultSavings = document.getElementById('roi-savings');
  const resultHours = document.getElementById('roi-hours');

  function updateROI() {
    if (!sliderServers || !sliderCost || !sliderProcesses) return;

    const servers = parseInt(sliderServers.value);
    const cost = parseInt(sliderCost.value);
    const processes = parseInt(sliderProcesses.value);

    // Display current slider values
    if (valServers) valServers.textContent = servers;
    if (valCost) valCost.textContent = 'R$ ' + cost.toLocaleString('pt-BR');
    if (valProcesses) valProcesses.textContent = processes;

    // Calculations (illustrative estimates)
    const monthlySavings = Math.round(servers * cost * 0.35);
    const hoursPerMonth = Math.round(processes * 2 * 0.7 * 4); // 4 semanas

    if (resultSavings) {
      resultSavings.textContent = 'R$ ' + monthlySavings.toLocaleString('pt-BR');
    }
    if (resultHours) {
      resultHours.textContent = hoursPerMonth + 'h';
    }
  }

  if (sliderServers) {
    sliderServers.addEventListener('input', function() {
      updateROI();
      if (typeof gtag === 'function') {
        gtag('event', 'roi_calculator_interact', {
          'event_category': 'Engagement',
          'event_label': 'slider_servers'
        });
      }
    });
  }
  if (sliderCost) {
    sliderCost.addEventListener('input', function() {
      updateROI();
      if (typeof gtag === 'function') {
        gtag('event', 'roi_calculator_interact', {
          'event_category': 'Engagement',
          'event_label': 'slider_cost'
        });
      }
    });
  }
  if (sliderProcesses) {
    sliderProcesses.addEventListener('input', function() {
      updateROI();
      if (typeof gtag === 'function') {
        gtag('event', 'roi_calculator_interact', {
          'event_category': 'Engagement',
          'event_label': 'slider_processes'
        });
      }
    });
  }

  // Initialize on load
  updateROI();

  // ===================================================================
  // 2. CARROSSEL DE DEPOIMENTOS — Navegação entre cards
  // ===================================================================
  const track = document.querySelector('.testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dotsContainer = document.querySelector('.testimonials-dots');
  let currentSlide = 0;
  const totalSlides = cards.length;

  function goToSlide(index) {
    if (!track || totalSlides === 0) return;
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;
    track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
    updateDots();
  }

  function updateDots() {
    if (!dotsContainer) return;
    var dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      goToSlide(currentSlide - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      goToSlide(currentSlide + 1);
    });
  }
  if (dotsContainer) {
    dotsContainer.addEventListener('click', function(e) {
      if (e.target.classList.contains('dot')) {
        var index = parseInt(e.target.dataset.index);
        goToSlide(index);
      }
    });
  }

  // Auto-play every 6 seconds
  if (totalSlides > 0) {
    setInterval(function() {
      goToSlide(currentSlide + 1);
    }, 6000);
  }

  updateDots();

  // ===================================================================
  // 3. FAQ ACCORDION — Expandir / Recolher
  // ===================================================================
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function(item) {
    var question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function() {
        // Close other open items
        faqItems.forEach(function(other) {
          if (other !== item && other.classList.contains('active')) {
            other.classList.remove('active');
          }
        });
        // Toggle current
        item.classList.toggle('active');

        if (typeof gtag === 'function' && item.classList.contains('active')) {
          gtag('event', 'faq_expand', {
            'event_category': 'Engagement',
            'event_label': question.textContent.trim().substring(0, 50)
          });
        }
      });
    }
  });

  // ===================================================================
  // 4. MODAL DE CONTATO — Preenchimento Inteligente + Envio Formspree
  // ===================================================================
  var modalOverlay = document.getElementById('modal-overlay');
  var modalClose = document.getElementById('modal-close');
  var contactForm = document.getElementById('contact-form');
  var feedbackBox = document.getElementById('formspree-feedback');
  var messageInput = document.getElementById('contact-message');
  var interestSelect = document.getElementById('contact-interest');

  function openModal(contextMessage, defaultInterest) {
    if (modalOverlay) {
      if (contextMessage && messageInput) {
        messageInput.value = contextMessage;
      }
      if (defaultInterest && interestSelect) {
        interestSelect.value = defaultInterest;
      }
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      if (typeof gtag === 'function') {
        gtag('event', 'modal_open_orcamento', {
          'event_category': 'Lead',
          'event_label': defaultInterest || 'Geral'
        });
      }
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
      if (feedbackBox) {
        feedbackBox.style.display = 'none';
        feedbackBox.className = 'formspree-feedback';
      }
    }
  }

  // Ouvintes para todos os botões de CTA da página
  document.querySelectorAll('[data-open-modal], .floating-cta, .btn-hero-primary, .btn-hero-secondary, .btn-roi-cta, .btn-nav-cta, .btn-why-cta, .btn-prefooter-cta').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();

      // Se o clique veio da calculadora de ROI, insere o contexto simulado
      if (btn.id === 'btn-roi-cta' || btn.classList.contains('btn-roi-cta')) {
        const servers = sliderServers ? sliderServers.value : '10';
        const cost = valCost ? valCost.textContent : 'R$ 2.000';
        const processes = sliderProcesses ? sliderProcesses.value : '20';
        const savings = resultSavings ? resultSavings.textContent : 'R$ 7.000';

        const roiContext = `Olá Vítor, realizei uma simulação na calculadora da IT SCOPE:\n- Servidores Locais: ${servers}\n- Custo Mensal por Servidor: ${cost}\n- Processos Manuais/Semana: ${processes}\n- Estimativa de Economia: ${savings}/mês.\n\nGostaria de agendar uma análise técnica personalizada para minha empresa.`;
        openModal(roiContext, 'Multi-Cloud (AWS / Azure / GCP / Oracle)');
      } else {
        const area = btn.getAttribute('data-interest') || 'Consultoria Estratégica';
        openModal('', area);
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Fechar no ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Envio do formulário via Formspree (AJAX com fallback para mailto)
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalBtnText = submitBtn ? submitBtn.textContent : 'Enviar Solicitação →';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando solicitação...';
      }

      var formData = new FormData(contactForm);
      var formEndpoint = contactForm.getAttribute('action') || 'https://formspree.io/f/mvoegpyw'; // URL padrão Formspree da IT SCOPE

      fetch(formEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      }).then(function(response) {
        if (response.ok) {
          if (feedbackBox) {
            feedbackBox.className = 'formspree-feedback success';
            feedbackBox.textContent = '✓ Solicitação enviada com sucesso! Vítor Cypriano entrará em contato em até 24 horas.';
            feedbackBox.style.display = 'block';
          }
          contactForm.reset();

          if (typeof gtag === 'function') {
            gtag('event', 'form_submit_orcamento', {
              'event_category': 'Lead',
              'event_label': document.getElementById('contact-interest')?.value || 'Sucesso'
            });
          }

          setTimeout(function() {
            closeModal();
          }, 3500);
        } else {
          throw new Error('Falha no envio');
        }
      }).catch(function(err) {
        // Fallback gracioso para Mailto em caso de ausência de conexão ou falha no endpoint
        var name = document.getElementById('contact-name')?.value || '';
        var email = document.getElementById('contact-email')?.value || '';
        var phone = document.getElementById('contact-phone')?.value || '';
        var company = document.getElementById('contact-company')?.value || '';
        var interest = document.getElementById('contact-interest')?.value || '';
        var message = document.getElementById('contact-message')?.value || '';

        var subject = encodeURIComponent('Solicitação de Orçamento — ' + company);
        var body = encodeURIComponent(
          'Nome: ' + name + '\n' +
          'E-mail: ' + email + '\n' +
          'Telefone: ' + phone + '\n' +
          'Empresa: ' + company + '\n' +
          'Área de Interesse: ' + interest + '\n\n' +
          'Mensagem:\n' + message
        );

        window.location.href = 'mailto:vitor.cypriano@itscope.com.br?subject=' + subject + '&body=' + body;

        if (feedbackBox) {
          feedbackBox.className = 'formspree-feedback success';
          feedbackBox.textContent = '✓ Redirecionando para envio de e-mail...';
          feedbackBox.style.display = 'block';
        }
      }).finally(function() {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      });
    });
  }

});
