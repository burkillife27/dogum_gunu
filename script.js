// HTML Elemanlarını Seçiyoruz
const startBtn = document.getElementById('startBtn');
const flame = document.getElementById('flame');
const message = document.getElementById('message');
const title = document.getElementById('title');

startBtn.addEventListener('click', async () => {
  try {
    // 1. Kullanıcıdan mikrofon erişim izni isteniyor
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    startBtn.innerText = "Şimdi mikrofona güçlüce üfle! 🌬️";
    startBtn.disabled = true; // Butonu pasif yapıyoruz
    
    // 2. Web Audio API Kurulumu
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    
    microphone.connect(analyser);
    analyser.fftSize = 256;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    // 3. Ses Şiddetini Sürekli Dinleyen Fonksiyon
    function checkBlow() {
      analyser.getByteFrequencyData(dataArray);
      
      // Frekans verilerinin ortalamasını alarak ses seviyesini hesaplıyoruz
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      let average = sum / dataArray.length;

      // Eşik Değeri: Mikrofona üflendiğinde ortalama ses yükselir (40 üzeri genelde üflemeyi yakalar)
      if (average > 50) {
        blowOutCandle();
        // Mum söndükten sonra mikrofon yayınını kapatıyoruz
        stream.getTracks().forEach(track => track.stop());
      } else {
        // Mum sönene kadar dinlemeye devam et
        requestAnimationFrame(checkBlow);
      }
    }

    checkBlow();

  } catch (err) {
    alert("Mikrofon izni alınamadı. Lütfen tarayıcı ayarlarından mikrofon iznini kontrol et!");
    console.error("Mikrofon Hatası:", err);
  }
});

// 4. Mum Söndüğünde Çalışacak Fonksiyon
function blowOutCandle() {
  flame.classList.add('off'); // Alev animasyonunu kapatır
  title.innerText = "İyi ki Doğdun! ✨";
  startBtn.style.display = 'none'; // Butonu gizler
  message.classList.remove('hidden');
  message.classList.add('show'); // Doğum günü mesajını gösterir
}