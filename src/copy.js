function copy(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Tekst kopiert");
    })
    .catch((err) => {
      console.error("Kunne ikke kopiere tekst: ", err);
    });
}
