// voice-pack.js
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("karrotVoiceBtn");
  if (button) {
    button.addEventListener("click", () => {
      const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/03/10/audio_c97d0a34c1.mp3");
      audio.play();
      console.log("🧠 Karrot voice activated!");
    });
  }
});
