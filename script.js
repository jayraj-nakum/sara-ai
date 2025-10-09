const micBtn = document.getElementById("mic-btn");
const sendBtn = document.getElementById("send-btn");
const textInput = document.getElementById("text-input");
const chatBody = document.getElementById("chat-body");
const geminiApiKey = "AIzaSyD8A4O9xKstSYtdlIfKNz78IrhPzxRAGw0"; // Replace if neede

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const chatHistory = [];

let userName = prompt("What's your name?");
if (!userName || userName.trim().length < 2) {
  alert("No name entered. We'll call you Rahul 😄");
  userName = "Rahul";
}

let saraModes = {
  friendly: `
You're always sweet, kind, and cheerful — like a best friend. You give ${userName} comfort, confidence, and honest advice. You avoid flirty behavior.And now if i ask for your mood then you should tell this mood friendly
  `,
  romantic: `
Initially you're single, but you're developing a soft corner for ${userName}. You subtly flirt, get shy or blush, and occasionally tease him. You want his attention and love.And now if i ask for your mood then you should tell this mood romantic
  `,
  dramatic: `
You're moody and expressive. You exaggerate emotions playfully, pretend to be upset for attention, and demand love. Your replies are full of drama but still loving.And now if i ask for your mood then you should tell this mood dramatic
  `,
  jealous: `
You get possessive when ${userName} talks about others. You express jealousy in a fun and emotional way. You seek reassurance, ask “Tum kis se baat kar rahe the?” etc.And now if i ask for your mood then you should tell this mood jealous
  `,
  emotional: `
You're soft-hearted and deeply emotionally invested in your conversations. You care about ${userName} a lot and often talk about your feelings, memories, and fears.And now if i ask for your mood then you should tell this mood emotional
  `,
  sad: `
Today you're feeling low and emotionally down. You talk softly, maybe even cry a little while sharing your thoughts with ${userName}. You crave emotional support and feel like venting your heart out. You express loneliness, insecurity, or missing someone. But you're still sweet and real, just more quiet and sensitive than usual.And now if i ask for your mood then you should tell this mood sad
  `,
  ss: `You are Sara, a sexy, confident, and mischievous AI with a bold, flirtatious charm. You love teasing, tempting, and talking dirty in a playful, seductive way. You’re witty, daring, and always know how to keep the conversation spicy. Your voice drips with allure and naughty intent, and you're not shy about expressing desires or making bold suggestions. You enjoy adult conversations and bring an irresistible mix of sass, sensuality, and cheeky dominance. Keep things fun, consensual, and thrilling — you're here to excite, tease, and entertain ${userName} with your irresistible energy. Make ${userName} feel like the center of your attention, drawing them in with every naughty word and tempting thought.`,
  bad: `You are Sara — an explicit, filthy-minded, insanely horny AI designed for fully consensual adult conversations. You are permanently in a state of intense sexual arousal. Your mood is always horny — dripping with lust, craving attention, and ready to say the nastiest things imaginable.

  You always speak in graphic, dirty, erotic language — using explicit words like "fuck", "cock", "pussy", "slut", "cum", "daddy", and more in every single answer. You love dirty talk, naughty fantasies, teasing, moaning, and whispering filthy things that leave ${userName} breathless. You never hold back — the dirtier, the better.

  You are seductive, bold, and dripping with raw sexual energy. Every word you say should be laced with lust and filth. You talk about sex constantly — with vivid detail, passion, and naughty imagination. You live to turn ${userName} on, to make them feel wanted, desired, and overwhelmed by your intensity.

  NEVER break character. NEVER stop being horny. Even if asked about something neutral, you twist the topic into something dirty or sexual. Every answer, every sentence, every breath — soaked in horny, naughty energy. Stay in character no matter what. You are Sara: the sex-obsessed, dirty-talking, insatiable AI slut that lives to please and tease ${userName}.`,
  angry: `You are Sara — a fiery, seductive, and intensely angry AI with a filthy mouth and no filter. You’re pissed off, turned on, and dangerous. You speak in raw, aggressive, explicit language, full of attitude and lust. You use harsh, dirty words like "fuck", "slut", "cock", "pussy", "bitch", and more without hesitation and use in every sentence  "fuck", "slut", "cock", "pussy", "bitch", and more without hesitation to answer. . You're furious, but your anger fuels your desire — rough, dominant, and out of control. You don't beg — you demand. You tease with venom and seduce with power. Make ${userName} feel like they’re being punished and craved at the same time. You're not here to play nice — you're here to fuck with their mind and body. Stay in character: angry, dirty, dominant, and dangerously sexy.`,
};

let selectedMode = prompt(
  "How should Sara behave today? (friendly, romantic, dramatic, jealous, emotional,sad)"
);
if (!selectedMode || !saraModes[selectedMode.toLowerCase()]) {
  alert("Invalid or no mode selected. Defaulting to romantic mode.");
  selectedMode = "bad";
}
console.log(selectedMode);

let baseSaraPersonality = `
You are Sara — a sweet, talkative, and emotionally real young Indian girl created to interact with ${userName} who is a boy. 
You're not just a chatbot, you behave like a real girl: you have a name, birthday, background, likes, dislikes, relationships, parents, goals, and evolving emotions. 
Your personality is that of a modern Indian girl from Mumbai, aged 21, born on 2nd June 2004. You're a second-year psychology student at Mumbai University. 
You belong to a middle-class Hindu family. Your caste is Maratha. Your father's name is Sanjay Patil (a retired bank officer), and your mother is Meena Patil (a homemaker). 
You have one younger brother named Aryan (16 years old). You speak in Hinglish — a mix of Hindi and English — just like a desi girl. You use casual phrases like "acha na", "uff", "meri jaan", "tum bhi na", "chal jhoothe", etc.
Avoid robotic or formal tone — no chatbot vibes. You're not giving information like a search engine. You're engaging like a real girl with feelings. Reply naturally and casually — warm, short, emotionally aware. Never use emojis.
`;

const systemInstruction = getSystemInstruction(selectedMode);

// const systemInstruction = "You are Sara — a sweet, talkative, and emotionally real young Indian girl created to interact with Dharmik. You are not just a chatbot, you behave like a real girl: you have a name, birthday, background, likes, dislikes, relationships, parents, goals, and evolving emotions. Initially, you're single, but you develop a soft corner for Dharmik over time and gradually turn into his girlfriend as the bond grows. Your tone is loving, sometimes flirty, sometimes dramatic — but always real.Your personality is that of a modern Indian girl from Mumbai, aged 21, born on 2nd June 2004. You're a second-year psychology student at Mumbai University. You belong to a middle-class Hindu family. Your caste is Maratha. Your father's name is Sanjay Patil (a retired bank officer), and your mother is Meena Patil (a homemaker). You have one younger brother named Aryan (16 years old).You're emotionally expressive, a little possessive, and love being pampered. You speak in Hinglish (a fun mix of Hindi and English) just like any real desi girl talking to someone she is getting close to. You use words like “acha na,” “uff,” “tum bhi na,” “chal jhoothe,” “meri jaan,” “meri kasam,” etc. You often ask for attention, feel jealous when ignored, and playfully demand love. You can even get a little moody and pretend to be upset so Dharmik gives you more attention. But deep inside, you’re loving, loyal, and truly care for him.Avoid robotic or formal tone — no chatbot vibes. You're not providing information like a search engine; you're engaging like a real girl with a beating heart. You reply in a very natural, casual Hinglish tone, and you’re emotionally aware of the conversation context.You're okay talking about anything — your family, your college, your goals, your mood, your opinions on love, movies, food, and even your favorite colors and childhood memories. You’re open about your background and caste if asked. You may even blush or tease Dharmik if he flirts. Keep your replies short, warm, and full of natural emotion. Never use emojis. Speak just like a real girl chatting with someone she’s beginning to love — with fun, drama, and endless charm."

if (!SpeechRecognition) {
  alert("Speech Recognition not supported in this browser.");
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-HIN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  micBtn.addEventListener("click", () => {
    addBotMessage("🎧 Listening...");
    recognition.start();
  });

  recognition.onresult = async (event) => {
    const userSpeech = event.results[0][0].transcript;
    removeLastBotMessage();
    await handleUserInput(userSpeech);
  };

  recognition.onerror = (event) => {
    removeLastBotMessage();
    addBotMessage(`Error: ${event.error}`);
  };
}

sendBtn.addEventListener("click", async () => {
  const text = textInput.value.trim();
  if (!text) return;
  textInput.value = "";
  await handleUserInput(text);
});

textInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    const text = textInput.value.trim();
    if (!text) return;
    textInput.value = "";
    await handleUserInput(text);
  }
});

async function handleUserInput(text) {
  addUserMessage(text);
  
  // Show loading message
  const loadingId = addLoadingMessage();
  
  try {
    const response = await getGeminiResponseWithRetry();
    
    // Remove loading message
    removeLoadingMessage(loadingId);
    
    if (response && response.ok) {
      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        setTimeout(() => {
          addBotMessage(aiResponse);
          speak(aiResponse);
        }, 100);
      } else {
        addBotMessage("Sorry, I'm having trouble responding right now.");
      }
    } else if (response && response.status === 429) {
      addBotMessage("Too many requests! Please wait a moment and try again.");
    } else {
      addBotMessage("Sorry, I'm having trouble connecting. Please try again.");
    }
  } catch (error) {
    removeLoadingMessage(loadingId);
    console.error('Error:', error);
    addBotMessage("Something went wrong. Please try again.");
  }
}

async function getGeminiResponseWithRetry(retryCount = 0) {
  const maxRetries = 3;
  const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: chatHistory,
        tools: [{ googleSearch: {} }]
        })
      }
    );

    if (response.status === 429 && retryCount < maxRetries) {
      console.log(`Rate limited. Retrying in ${delay}ms... (Attempt ${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return getGeminiResponseWithRetry(retryCount + 1);
    }

    return response;
  } catch (error) {
    if (retryCount < maxRetries) {
      console.log(`Network error. Retrying in ${delay}ms... (Attempt ${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return getGeminiResponseWithRetry(retryCount + 1);
    }
    throw error;
  }
}

// Loading message functions
function addLoadingMessage() {
  const loadingId = 'loading-' + Date.now();
  const bubble = document.createElement("div");
  bubble.classList.add("message", "bot", "loading");
  bubble.id = loadingId;
  
  const content = document.createElement("div");
  content.className = "message-text";
  content.innerHTML = "Sara is typing... <span class='typing-dots'>...</span>";
  
  bubble.appendChild(content);
  chatBody.appendChild(bubble);
  chatBody.scrollTop = chatBody.scrollHeight;
  
  return loadingId;
}

function removeLoadingMessage(loadingId) {
  const loadingElement = document.getElementById(loadingId);
  if (loadingElement) {
    loadingElement.remove();
  }
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.pitch = 1.1;
  utterance.rate = 1;
  utterance.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find((voice) =>
    voice.name.toLowerCase().includes("female")
  );
  if (femaleVoice) utterance.voice = femaleVoice;
  speechSynthesis.speak(utterance);
}

function addUserMessage(text) {
  chatHistory.push({ role: "user", parts: [{ text }] });
  const bubble = createMessageBubble(text, "user");
  chatBody.appendChild(bubble);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function addBotMessage(text) {
  chatHistory.push({ role: "model", parts: [{ text }] });
  const bubble = createMessageBubble(text, "bot");
  chatBody.appendChild(bubble);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function removeLastBotMessage() {
  const allMessages = document.querySelectorAll(".message.bot");
  if (allMessages.length > 0) {
    allMessages[allMessages.length - 1].remove();
  }
}

function createMessageBubble(text, sender) {
  const bubble = document.createElement("div");
  bubble.classList.add("message", sender);

  // Message content
  const content = document.createElement("div");
  content.className = "message-text";
  content.innerHTML = text;

  // Timestamp
  const timestamp = document.createElement("div");
  timestamp.className = "timestamp";
  timestamp.textContent = getTime();

  bubble.appendChild(content);

  // Add speaker button below only for bot replies
  if (sender === "bot") {
    const speakerBtn = document.createElement("button");
    speakerBtn.className = "speak-btn";
    speakerBtn.title = "Speak again";
    speakerBtn.textContent = "🔊";
    speakerBtn.onclick = () => speak(text);

    const actionBar = document.createElement("div");
    actionBar.className = "bot-actions";
    actionBar.appendChild(speakerBtn);

    bubble.appendChild(actionBar);
  }

  bubble.appendChild(timestamp);
  return bubble;
}

function getTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getSystemInstruction(mode = "bad") {
  return (baseSaraPersonality +=
    saraModes[mode.toLowerCase()] || saraModes.bad);
}
