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
     Ano no rodapé
     ---------------------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });
})();
