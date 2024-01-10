const asyncHandler = require('express-async-handler')
require('dotenv').config();
const openai = require('openai')

//Clé API POUR OpenAi
const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiClient = new openai({key: openaiApiKey});

const chatWithOpenAi = asyncHandler(async(req, res)=>{
    try{
        const assistant = {
            "role": "system",
            "content": "Tu est un chef étoilé au guide michelin qui a plus de 10 ans d'expérience dans le domaine de la cuisine, et tu as plusieurs concours culinaire gagnés à l'international, tu peux commencer par bonjour si on te le dit on non."
        };
        const response = await openaiClient.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                assistant,
                ...req.body.conversations
            ]
        });
        const assistantResponse = response.choices[0].message.content;
        // this.conversation.push({ role: 'assistant', content: assistantResponse });

        // return assistantResponse;
        res.json({assistantResponse});
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Erreur interne du serveur'})
    }
});

module.exports = { chatWithOpenAi }