const URL ="http://localhost:5000/api/chatbot";

export async function Chat(){
    try{
        const response = await fetch(URL+'/chat-with-me',{
            method: 'POST'
        });
        if (response.ok) {
            const aiResponse = await response.json();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
    }catch(error){
        throw new Error(`Erreur lors de la requête : ${error.message}`)
    }
}

export default Chat;