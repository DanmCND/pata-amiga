(function () {
  "use strict";

  var config = window.PATA_AMIGA_CONFIG || {};
  var PENDING = "A confirmar";

  /* ----------------------------------------------------------------------
     Menu móvel
     ---------------------------------------------------------------------- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-menu]");
  var desktopQuery = window.matchMedia("(min-width: 960px)");

  function setMenu(open, returnFocus) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
    if (!open && returnFocus) toggle.focus();
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      setMenu(open);
      if (open) {
        var firstLink = menu.querySelector("a");
        if (firstLink) firstLink.focus();
      }
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a") && !desktopQuery.matches) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false, true);
      }
    });

    document.addEventListener("click", function (event) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (!menu.contains(event.target) && !toggle.contains(event.target)) setMenu(false);
    });

    desktopQuery.addEventListener("change", function () { setMenu(false); });
  }

  /* ----------------------------------------------------------------------
     Cabeçalho com borda ao rolar
     ---------------------------------------------------------------------- */
  var header = document.querySelector("[data-header]");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------------------
     CTAs de agendamento: WhatsApp quando configurado, senão #contato
     ---------------------------------------------------------------------- */
  var whatsappNumber = String(config.whatsapp || "").replace(/\D/g, "");

  function whatsappUrl(service) {
    var message = config.whatsappMessage || "";
    if (service) message += " Tenho interesse em: " + service + ".";
    return "https://wa.me/" + whatsappNumber + (message ? "?text=" + encodeURIComponent(message) : "");
  }

  if (whatsappNumber) {
    document.querySelectorAll("[data-cta='agendar']").forEach(function (link) {
      link.href = whatsappUrl(link.getAttribute("data-service"));
      link.target = "_blank";
      link.rel = "noopener";
      if (!link.querySelector(".visually-hidden.new-tab")) {
        var hint = document.createElement("span");
        hint.className = "visually-hidden new-tab";
        hint.textContent = " (abre o WhatsApp em nova aba)";
        link.appendChild(hint);
      }
    });
    document.querySelectorAll("[data-cta-pending]").forEach(function (el) { el.hidden = true; });
  } else {
    // Sem canal confirmado, o CTA final não tem para onde levar: mantém o aviso visível.
    document.querySelectorAll("[data-cta-final]").forEach(function (el) { el.hidden = true; });
  }

  /* ----------------------------------------------------------------------
     Dados de contato vindos da configuração
     ---------------------------------------------------------------------- */
  function el(tag, text, attrs) {
    var node = document.createElement(tag);
    if (text) node.textContent = text;
    Object.keys(attrs || {}).forEach(function (key) { node.setAttribute(key, attrs[key]); });
    return node;
  }

  function pending(label) {
    return el("span", label || PENDING, { "class": "placeholder-text" });
  }

  function fill(selector, build) {
    document.querySelectorAll(selector).forEach(function (target) {
      var content = build();
      target.textContent = "";
      if (content) target.appendChild(content);
    });
  }

  function linkList(items) {
    if (!items.length) return null;
    var list = el("ul", null, { role: "list" });
    items.forEach(function (item) {
      var li = el("li");
      li.appendChild(item.href ? el("a", item.text, item.attrs || { href: item.href }) : document.createTextNode(item.text));
      list.appendChild(li);
    });
    return list;
  }

  var phoneItems = [];
  if (whatsappNumber) {
    phoneItems.push({ text: "WhatsApp" + (config.phoneDisplay ? ": " + config.phoneDisplay : ""), href: true, attrs: { href: whatsappUrl(), target: "_blank", rel: "noopener" } });
  } else if (config.phoneDisplay) {
    phoneItems.push({ text: config.phoneDisplay, href: true, attrs: { href: "tel:" + config.phoneDisplay.replace(/[^\d+]/g, "") } });
  }

  var socialItems = [];
  if (config.email) socialItems.push({ text: config.email, href: true, attrs: { href: "mailto:" + config.email } });
  if (config.instagram) {
    var handle = String(config.instagram).replace(/^@/, "");
    socialItems.push({ text: "@" + handle, href: true, attrs: { href: "https://www.instagram.com/" + encodeURIComponent(handle) + "/", target: "_blank", rel: "noopener" } });
  }

  var addressItems = [];
  if (config.address) {
    addressItems.push(config.mapsUrl
      ? { text: config.address, href: true, attrs: { href: config.mapsUrl, target: "_blank", rel: "noopener" } }
      : { text: config.address });
  }

  var hours = Array.isArray(config.hours) ? config.hours.filter(Boolean) : [];

  fill("[data-config='phone']", function () { return linkList(phoneItems) || pending(); });
  fill("[data-config='address']", function () { return linkList(addressItems) || pending(); });
  fill("[data-config='social']", function () { return linkList(socialItems) || pending(); });
  fill("[data-config='hours']", function () {
    return linkList(hours.map(function (h) { return { text: h }; })) || pending();
  });

  document.querySelectorAll("[data-config='hours-inline']").forEach(function (p) {
    if (!hours.length) return;
    p.textContent = hours.join(" · ");
    p.classList.remove("placeholder-text");
  });

  fill("[data-config='footer-phone']", function () {
    var list = linkList(phoneItems);
    return list ? list.firstChild.firstChild : pending("Telefone a confirmar");
  });
  fill("[data-config='footer-address']", function () {
    var list = linkList(addressItems);
    return list ? list.firstChild.firstChild : pending("Endereço a confirmar");
  });
  fill("[data-config='footer-social']", function () {
    if (!socialItems.length) return null;
    var frag = document.createDocumentFragment();
    socialItems.forEach(function (item, i) {
      if (i) frag.appendChild(document.createTextNode(" · "));
      frag.appendChild(el("a", item.text, item.attrs));
    });
    return frag;
  });
  document.querySelectorAll("[data-config='footer-social']").forEach(function (li) {
    li.hidden = !socialItems.length;
  });

  /* ----------------------------------------------------------------------
     Pegadas em "Como funciona": aparecem quando a seção entra na tela
     ---------------------------------------------------------------------- */
  var steps = document.querySelector("[data-steps]");
  if (steps) {
    if ("IntersectionObserver" in window) {
      var stepsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            steps.classList.add("is-walking");
            stepsObserver.disconnect();
          }
        });
      }, { threshold: 0.35 });
      stepsObserver.observe(steps);
    } else {
      steps.classList.add("is-walking");
    }
  }

  /* ----------------------------------------------------------------------
     Trilha de pegadas na margem, ligada à rolagem
     Um cão e um gato descem juntos pela margem direita; ao subir a página,
     as pegadas recuam. Com margem larga, duas trilhas lado a lado; com margem
     estreita (notebooks e tablets), uma trilha compacta alternando cão e gato.
     ---------------------------------------------------------------------- */
  var MIN_MARGIN = 28;      // px livres à direita do conteúdo para mostrar a trilha
  var WIDE_MARGIN = 110;    // a partir daqui, cão e gato andam lado a lado
  var REVEAL_AT = 0.62;     // pegadas aparecem até 62% da altura da janela
  var trailLayer = null;
  var trailPaws = [];
  var trailShown = 0;

  function docTop(node) {
    return node.getBoundingClientRect().top + window.scrollY;
  }

  function buildTrail() {
    if (trailLayer) trailLayer.remove();
    trailLayer = null;
    trailPaws = [];
    trailShown = 0;

    var reference = document.querySelector(".hero .container");
    var startNode = document.querySelector(".hero");
    var endNode = document.querySelector(".cta-card");
    if (!reference || !startNode || !endNode) return;

    var pageWidth = document.documentElement.clientWidth;
    var contentRight = reference.getBoundingClientRect().right - parseFloat(getComputedStyle(reference).paddingRight);
    var margin = pageWidth - contentRight;
    if (margin < MIN_MARGIN) return;

    var compact = margin < WIDE_MARGIN;
    var cx = contentRight + margin / 2;
    var amp = compact ? 0 : Math.min(22, margin / 2 - 34);
    var wave = 420;
    var startY = docTop(startNode) + 48;
    var endY = docTop(endNode) + 40;

    var darkZones = Array.prototype.map.call(document.querySelectorAll(".section-sage"), function (node) {
      var top = docTop(node);
      return [top, top + node.offsetHeight];
    });

    function pathX(y) { return cx + amp * Math.sin((y - startY) / wave); }
    function pathAngle(y) {
      var slope = (amp / wave) * Math.cos((y - startY) / wave);
      return 180 - Math.atan(slope) * 180 / Math.PI;
    }
    function isDark(y) {
      return darkZones.some(function (zone) { return y > zone[0] && y < zone[1]; });
    }

    var paws = [];
    function walk(kind, offset, stride, foot, firstY) {
      for (var y = firstY, i = 0; y < endY; y += stride, i++) {
        var side = i % 2 ? 1 : -1;
        var angle = pathAngle(y);
        var rad = (angle - 180) * Math.PI / 180;
        paws.push({
          kind: kind,
          y: y,
          x: pathX(y) + offset * Math.cos(rad) + side * foot * Math.cos(rad),
          r: angle + side * 6
        });
      }
    }
    if (compact) {
      walk("dog", 0, 96, 2, startY);
      walk("cat", 0, 96, 2, startY + 48);
    } else {
      walk("dog", -13, 74, 7, startY);
      walk("cat", 14, 66, 5, startY + 37);
    }
    paws.push({ kind: "heart", y: endY + 46, x: pathX(endY), r: 0 });
    paws.sort(function (a, b) { return a.y - b.y; });

    trailLayer = document.createElement("div");
    trailLayer.className = "paw-trail" + (compact ? " is-compact" : "");
    trailLayer.setAttribute("aria-hidden", "true");
    paws.forEach(function (paw) {
      var node = document.createElement("span");
      node.className = "paw" + (paw.kind === "cat" ? " paw-cat" : "") + (paw.kind === "heart" ? " paw-heart" : "") + (paw.kind !== "heart" && isDark(paw.y) ? " on-dark" : "");
      node.style.left = paw.x.toFixed(1) + "px";
      node.style.top = paw.y.toFixed(1) + "px";
      node.style.setProperty("--r", paw.r.toFixed(1) + "deg");
      trailLayer.appendChild(node);
      trailPaws.push({ y: paw.y, node: node });
    });
    document.body.appendChild(trailLayer);
    updateTrail();
  }

  function updateTrail() {
    if (!trailPaws.length) return;
    var limit = window.scrollY + window.innerHeight * REVEAL_AT;
    while (trailShown < trailPaws.length && trailPaws[trailShown].y < limit) {
      trailPaws[trailShown++].node.classList.add("is-on");
    }
    while (trailShown > 0 && trailPaws[trailShown - 1].y >= limit) {
      trailPaws[--trailShown].node.classList.remove("is-on");
    }
  }

  var trailFrame = 0;
  window.addEventListener("scroll", function () {
    if (trailFrame) return;
    trailFrame = window.requestAnimationFrame(function () {
      trailFrame = 0;
      updateTrail();
    });
  }, { passive: true });

  // Reconstrói quando o layout muda (resize, fontes carregadas, FAQ aberto/fechado)
  var trailTimer = 0;
  var lastLayout = "";
  function scheduleTrail() {
    window.clearTimeout(trailTimer);
    trailTimer = window.setTimeout(function () {
      var layout = document.documentElement.clientWidth + "x" + document.body.offsetHeight;
      if (layout === lastLayout) return;
      lastLayout = layout;
      buildTrail();
    }, 150);
  }
  if ("ResizeObserver" in window) {
    new ResizeObserver(scheduleTrail).observe(document.body);
  } else {
    window.addEventListener("resize", scheduleTrail);
  }
  window.addEventListener("load", scheduleTrail);
  scheduleTrail();

  /* ----------------------------------------------------------------------
     Ano no rodapé
     ---------------------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });
})();
