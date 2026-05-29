
export default function StaffDetailPage() {
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
            </div>
        </div>
    );
  }
  