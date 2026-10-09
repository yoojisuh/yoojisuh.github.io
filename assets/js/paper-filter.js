// Topic filter for {{< paper-filter >}}: shows only papers whose tags match the chosen topic,
// and hides headings, lists, and dividers left empty by the filter.
(function () {
  var bar = document.querySelector(".paper-filter");
  if (!bar) return;
  var content = bar.closest(".post-content") || document.body;
  var papers = content.querySelectorAll("li.paper");
  var lists = content.querySelectorAll("ol.paper-list");
  var current = "";

  // Pin each paper's number so filtered lists keep the original numbering.
  lists.forEach(function (ol) {
    var items = ol.querySelectorAll(":scope > li");
    items.forEach(function (li, i) {
      li.value = ol.reversed ? items.length - i : i + 1;
    });
  });

  function apply(tag) {
    current = tag;

    papers.forEach(function (li) {
      var tags = (li.getAttribute("data-tags") || "").split(" ");
      li.hidden = tag !== "" && tags.indexOf(tag) === -1;
    });

    // Hide lists with nothing left, along with the subheading right above them.
    lists.forEach(function (ol) {
      var empty = !ol.querySelector("li.paper:not([hidden])");
      ol.hidden = empty;
      var heading = ol.previousElementSibling;
      if (heading && (heading.tagName === "H3" || heading.tagName === "H4")) heading.hidden = empty;
    });

    // Hide a main section (and the divider above it) when all of its paper lists are hidden.
    var section = null;
    var hasLists = false;
    var anyVisible = false;
    function close() {
      if (!section || !hasLists) return;
      section.hidden = !anyVisible;
      var divider = section.previousElementSibling;
      if (divider && divider.tagName === "HR") divider.hidden = !anyVisible;
    }
    Array.prototype.forEach.call(content.children, function (el) {
      if (el.tagName === "H2") {
        close();
        section = el;
        hasLists = false;
        anyVisible = false;
      } else if (el.matches("ol.paper-list")) {
        hasLists = true;
        if (!el.hidden) anyVisible = true;
      }
    });
    close();

    content.querySelectorAll(".paper-tag").forEach(function (b) {
      var active = (b.getAttribute("data-tag") || "") === tag;
      b.classList.toggle("is-active", active);
      if (b.closest(".paper-filter")) b.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  content.addEventListener("click", function (e) {
    var button = e.target.closest(".paper-tag");
    if (!button) return;
    var tag = button.getAttribute("data-tag") || "";
    apply(tag === current ? "" : tag);
    if (button.closest("li.paper")) bar.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  bar.hidden = false;
})();
