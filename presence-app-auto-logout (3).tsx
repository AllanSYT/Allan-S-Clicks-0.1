<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application de Présence</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.16/dist/tailwind.min.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/js/all.min.js"></script>
</head>
<body class="bg-gray-100 flex justify-center items-center h-screen">
  <div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-md space-y-6">
    <div class="text-center">
      <h1 class="text-2xl font-bold">Application de Présence</h1>
    </div>

    <div class="flex justify-between items-center">
      <div class="text-center">
        <div id="clickCount" class="text-4xl font-bold">0</div>
        <div class="text-gray-500">Nombre total de clics</div>
        <div class="text-blue-500 text-sm">Le compteur est sauvegardé automatiquement</div>
      </div>

      <button id="clickButton" disabled class="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded flex items-center justify-center gap-2 w-full opacity-50 cursor-not-allowed">
        <i class="fas fa-lock"></i>
        Connectez-vous pour cliquer
      </button>
    </div>

    <div class="text-center">
      <button id="presenceButton" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 w-full">
        <i class="fas fa-user-check"></i>
        Je suis là !
      </button>
      <div id="presenceMessage" class="text-orange-500 text-sm mt-2 hidden">
        Cliquez sur "Je suis là !" pour débloquer
      </div>
      <div id="presenceConfirmation" class="bg-green-50 text-green-600 rounded-lg p-2 text-sm hidden">
        ✓ Vous êtes marqué comme présent
        <div class="text-xs text-gray-500 mt-1">
          Déconnexion automatique à la fermeture
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center gap-2 text-lg">
      <i class="fas fa-users text-blue-500"></i>
      <span id="onlineUsers">0 personne présente</span>
    </div>
  </div>

  <script>
    // Récupération des éléments HTML
    const clickCount = document.getElementById('clickCount');
    const clickButton = document.getElementById('clickButton');
    const presenceButton = document.getElementById('presenceButton');
    const presenceMessage = document.getElementById('presenceMessage');
    const presenceConfirmation = document.getElementById('presenceConfirmation');
    const onlineUsers = document.getElementById('onlineUsers');

    // Chargement des données depuis le localStorage
    let totalClicks = Number(localStorage.getItem('totalClicks') || 0);
    let isPresent = localStorage.getItem('userPresent') === 'true';
    let totalPresentUsers = Number(localStorage.getItem('totalPresentUsers') || 0);

    // Mise à jour de l'interface
    clickCount.textContent = totalClicks;
    if (isPresent) {
      presenceConfirmation.classList.remove('hidden');
      clickButton.disabled = false;
      clickButton.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
      presenceMessage.classList.remove('hidden');
    }
    onlineUsers.textContent = `${totalPresentUsers} personne${totalPresentUsers > 1 ? 's' : ''} présente${totalPresentUsers > 1 ? 's' : ''}`;

    // Gestion des clics sur le bouton
    clickButton.addEventListener('click', () => {
      totalClicks++;
      clickCount.textContent = totalClicks;
      localStorage.setItem('totalClicks', String(totalClicks));
    });

    // Gestion de la présence
    presenceButton.addEventListener('click', () => {
      isPresent = true;
      totalPresentUsers++;
      localStorage.setItem('userPresent', 'true');
      localStorage.setItem('totalPresentUsers', String(totalPresentUsers));
      presenceMessage.classList.add('hidden');
      presenceConfirmation.classList.remove('hidden');
      clickButton.disabled = false;
      clickButton.classList.remove('opacity-50', 'cursor-not-allowed');
      onlineUsers.textContent = `${totalPresentUsers} personne${totalPresentUsers > 1 ? 's' : ''} présente${totalPresentUsers > 1 ? 's' : ''}`;
    });

    // Déconnexion automatique à la fermeture
    window.addEventListener('beforeunload', () => {
      if (isPresent) {
        localStorage.setItem('userPresent', 'false');
        totalPresentUsers = Math.max(0, totalPresentUsers - 1);
        localStorage.setItem('totalPresentUsers', String(totalPresentUsers));
      }
    });
  </script>
</body>
</html>
