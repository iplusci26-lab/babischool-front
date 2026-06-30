"use client";

export default function MessageBubble({

  message,

  currentUser

}: any) {

  console.log(message.sender);
  console.log(currentUser);
  console.log("mine :", message.sender === currentUser);

  const mine =
    message.sender ===
    currentUser;

  return (

    
    <div
      className={`flex ${
        mine
          ? "justify-end"
          : "justify-start"
      }`}
    >
      
      

      <div
        className={`max-w-md px-4 py-3 rounded-3xl ${
          mine
            ? "bg-indigo-600 text-white"
            : "bg-white border"
        }`}
      >
        <div className="text-xs font-semibold text-indigo-600 mb-1">

          {message.sender_name}

          </div>
        <p>

          {message.body}

        </p>
        
        {message.attachment && (

        <a
          href={message.attachment}
          target="_blank"
          className="block mt-2 text-sm underline"
        >

          📎 Pièce jointe

        </a>

        )}

        <div
          className={`text-xs mt-2 ${
            mine
              ? "text-indigo-100"
              : "text-gray-400"
          }`}
        >

          {new Date(
            message.created_at
          ).toLocaleTimeString(
            "fr-FR",
              {
                hour: "2-digit",
                minute: "2-digit"
              }
          )}
        
        </div>
        

      </div>

    </div>
  );
}