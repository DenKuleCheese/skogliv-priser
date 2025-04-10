let alleProdukter = {};
// Cache for ikoner: key: true (finnes) eller false (404)
let iconCache = {};

function hentData() {
  const urlParams = new URLSearchParams(window.location.search);

  fetch(`src/produkter.json`)
    .then((response) => response.json())
    .then((data) => {
      alleProdukter = data;
      visData(data); // Viser alle produkter første gang
    })
    .catch(() => {
      document.getElementById("loading").textContent = "Feil ved lasting av data";
    });
}

function visData(data) {
  const tbody = document.getElementById("tabelBody");
  tbody.innerHTML = "";

  data.forEach((produkt) => {
    const rad = document.createElement("tr");

    // Produktnavn med ikon
    const navnCelle = document.createElement("td");
    const wrapper = document.createElement("div");
    wrapper.style.display = "inline-flex";
    wrapper.style.alignItems = "center";

    const itemKey = produkt.key.toLowerCase();

    // Sjekk cache før vi lager img-element
    if (iconCache[itemKey] !== false) {
      const ikon = document.createElement("img");
      ikon.src = `https://mc.nerothe.com/img/1.21.4/minecraft_${itemKey}.png`;
      ikon.alt = "Ikon";
      ikon.style.width = "20px";
      ikon.style.marginRight = "5px";

      // Oppdater cache-status
      ikon.onload = function () {
        iconCache[itemKey] = true;
      };
      ikon.onerror = function () {
        iconCache[itemKey] = false;
        ikon.style.display = "none";
      };

      wrapper.appendChild(ikon);
    }

    wrapper.appendChild(document.createTextNode(produkt.name));
    navnCelle.appendChild(wrapper);
    rad.appendChild(navnCelle);

    // Priser for 1., 2. og 3. plass
    for (let i = 0; i < 3; i++) {
      const celle = document.createElement("td");

      if (produkt.Butikker[i]) {
        const butikk = produkt.Butikker[i];
        const stackSize = produkt["Stack-size"];
        let prisHTML = `<div class="butikk">${butikk.butikk}</div>`;

        if (stackSize) {
          const totalPris = (butikk.pris * (stackSize / butikk.mengde)).toFixed(2);
          prisHTML += `
            <div class="pris-total">${totalPris} kr</div>
            <div class="pris-per">${butikk.pris.toFixed(2)} per ${butikk.mengde}</div>`;
        } else {
          prisHTML += `
            <div class="pris-per enkelt">${butikk.pris.toFixed(2)} per ${butikk.mengde}</div>`;
        }
        celle.innerHTML = prisHTML;
      } else {
        celle.innerHTML = '<div class="ingen-data">Ingen data</div>';
      }
      rad.appendChild(celle);
    }

    tbody.appendChild(rad);
  });

  document.getElementById("loading").style.display = "none";
  document.getElementById("prisTabel").style.display = "table";
}

function filtrerProdukter() {
  const sokTekst = document.getElementById("sokefelt").value.toLowerCase();
  const filtrert = alleProdukter.filter((produkt) => produkt.name.toLowerCase().includes(sokTekst));
  visData(filtrert);
}

document.addEventListener("DOMContentLoaded", () => {
  hentData();
  document.getElementById("sokefelt").addEventListener("input", filtrerProdukter);
  document.getElementById("oppdaterPriser").addEventListener("click", () => {
    document.getElementById("loading").style.display = "block";
    document.getElementById("prisTabel").style.display = "none";
    hentData();
  });
});
