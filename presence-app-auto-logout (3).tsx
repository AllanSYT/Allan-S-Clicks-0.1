import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, Lock } from 'lucide-react';

const PresenceApp = () => {
  const [count, setCount] = useState(() => {
    return Number(localStorage.getItem('totalClicks') || 0);
  });
  const [isPresent, setIsPresent] = useState(false);
  const [presentUsers, setPresentUsers] = useState(0);

  useEffect(() => {
    localStorage.setItem('totalClicks', String(count));
  }, [count]);

  // Déconnexion automatique quand l'utilisateur quitte la page
  useEffect(() => {
    const handleUnload = () => {
      if (isPresent) {
        localStorage.setItem('userPresent', 'false');
        const newTotal = Math.max(0, Number(localStorage.getItem('totalPresentUsers')) - 1);
        localStorage.setItem('totalPresentUsers', String(newTotal));
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      handleUnload();
    };
  }, [isPresent]);

  useEffect(() => {
    const checkPresentUsers = () => {
      const totalPresent = Number(localStorage.getItem('totalPresentUsers') || 0);
      setPresentUsers(totalPresent);
    };

    checkPresentUsers();
    const interval = setInterval(checkPresentUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  const incrementer = () => {
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem('totalClicks', String(newCount));
  };

  const marquerPresence = () => {
    setIsPresent(true);
    const newTotal = presentUsers + 1;
    localStorage.setItem('totalPresentUsers', String(newTotal));
    localStorage.setItem('userPresent', 'true');
    setPresentUsers(newTotal);
  };

  useEffect(() => {
    const userWasPresent = localStorage.getItem('userPresent') === 'true';
    setIsPresent(userWasPresent);
  }, []);

  return (
    <div className="flex gap-4">
      {/* Compteur principal */}
      <Card className="w-80">
        <CardContent className="p-6 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="text-4xl font-bold">{count}</div>
            <div className="text-gray-500">Nombre total de clics</div>
            <div className="text-sm text-blue-500">
              Le compteur est sauvegardé automatiquement
            </div>
          </div>

          {!isPresent ? (
            <div className="w-full">
              <Button 
                disabled
                className="w-full opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Connectez-vous pour cliquer
              </Button>
              <div className="text-sm text-orange-500 mt-2 text-center">
                Cliquez sur "Je suis là !" pour débloquer
              </div>
            </div>
          ) : (
            <Button 
              onClick={incrementer}
              className="bg-blue-500 hover:bg-blue-600 w-full"
            >
              Cliquez-moi (+1)
            </Button>
          )}

          <div className="flex items-center gap-2 text-lg">
            <Users className="w-6 h-6 text-blue-500" />
            <span>{presentUsers} personne{presentUsers > 1 ? 's' : ''} présente{presentUsers > 1 ? 's' : ''}</span>
          </div>
        </CardContent>
      </Card>

      {/* Carte de présence */}
      <Card className="w-64">
        <CardContent className="p-6 flex flex-col items-center gap-4">
          <div className="text-lg font-medium text-center">
            Gestion de présence
          </div>
          
          {!isPresent ? (
            <Button 
              onClick={marquerPresence}
              className="w-full flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
            >
              <UserCheck className="w-5 h-5" />
              Je suis là !
            </Button>
          ) : (
            <div className="text-sm text-green-600 text-center p-2 bg-green-50 rounded-lg">
              ✓ Vous êtes marqué comme présent
              <div className="text-xs text-gray-500 mt-1">
                Déconnexion automatique à la fermeture
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PresenceApp;
