
export default function PendingActivationPage() {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white border border-gray-100 rounded-3xl shadow-sm p-10 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-4xl">
              ⏳
            </div>
          </div>
  
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">
              École en attente d’activation
            </h1>
  
            <p className="text-gray-500 leading-relaxed">
              Votre établissement a bien été enregistré.
              <br />
              L’activation du compte est actuellement en cours de vérification.
            </p>
          </div>
  
          <div className="bg-gray-50 border rounded-2xl p-5 text-left space-y-3">
            <div className="flex items-start gap-3">
              <div className="text-green-600 mt-0.5">✓</div>
              <p className="text-sm text-gray-700">
                Inscription de l’école enregistrée
              </p>
            </div>
  
            <div className="flex items-start gap-3">
              <div className="text-green-600 mt-0.5">✓</div>
              <p className="text-sm text-gray-700">
                Compte administrateur créé
              </p>
            </div>
  
            <div className="flex items-start gap-3">
              <div className="text-amber-500 mt-0.5">●</div>
              <p className="text-sm text-gray-700">
                Validation et activation en attente
              </p>
            </div>
          </div>
  
          <div className="text-sm text-gray-500">
            Vous recevrez une confirmation dès que votre école sera activée.
          </div>
  
          
        </div>
      </div>
    );
  }
  