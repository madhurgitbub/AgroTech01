// ===== AgroTECH AI Krishi Assistant & Chatbot Engine =====

let chatLanguage = "Hindi";

function toggleChatbot() {
  const chatbotWindow = document.getElementById("chatbotWindow");
  if (chatbotWindow) {
    chatbotWindow.classList.toggle("active");
    if (chatbotWindow.classList.contains("active")) {
      const input = document.getElementById("chatbotInput");
      if (input) input.focus();
    }
  }
}

function setChatLanguage(language, button) {
  chatLanguage = language;
  document.querySelectorAll(".chat-lang-btn").forEach(btn => btn.classList.remove("active"));
  if (button) button.classList.add("active");

  const input = document.getElementById("chatbotInput");
  if (input) {
    input.placeholder = (language === "Hindi") ? "खेती या उपकरण के बारे में पूछें..." : "Ask about farming, crops, tractors...";
  }
}

function handleChatKeyPress(event) {
  if (event.key === "Enter") {
    sendChatMessage();
  }
}

function sendSuggestion(button) {
  const message = button.innerText.replace(/^[🌱🌦️🌿🚜💰🐛]\s*/, '').trim();
  askBotQuestion(message);
}

function askBotQuestion(questionText) {
  const chatbotWindow = document.getElementById("chatbotWindow");
  if (chatbotWindow && !chatbotWindow.classList.contains("active")) {
    chatbotWindow.classList.add("active");
  }
  const input = document.getElementById("chatbotInput");
  if (input) {
    input.value = questionText;
  }
  sendChatMessage();
}

// Local Agricultural Knowledge Engine (Fallback when backend AI API is offline or unkeyed)
function getOfflineAgriAdvice(query, lang = "Hindi") {
  const q = query.toLowerCase();
  const isHi = (lang === "Hindi") || /[\u0900-\u097F]/.test(query) || q.includes('kisan') || q.includes('kheti');

  // 1. Wheat / Gehu
  if (q.includes("gehu") || q.includes("wheat") || q.includes("गेहूं")) {
    return isHi
      ? `🌾 **गेहूं की वैज्ञानिक खेती की सलाह:**\n\n• **बुवाई का समय:** 15 नवंबर से 25 नवंबर सबसे उपयुक्त है।\n• **उन्नत किस्में:** GW-322, Shriram 303, Lok-1, HI-8759 (तेजस)।\n• **बीज दर:** 100-125 किग्रा प्रति हेक्टेयर।\n• **उर्वरक मात्रा (प्रति हेक्टेयर):** 120 किग्रा नाइट्रोजन (N), 60 किग्रा फास्फोरस (P₂O₅), 40 किग्रा पोटाश (K₂O)।\n• **सिंचाई चक्र:** सीआरआई अवस्था (बुवाई के 20-25 दिन बाद) पहली सिंचाई अनिवार्य है।\n• 🚜 **उपकरण:** रोटावेटर एवं जीरो-टिल सीड-ड्रिल बुकिंग डैशबोर्ड पर उपलब्ध हैं।`
      : `🌾 **Wheat Cultivation Advisory:**\n\n• **Sowing Window:** Ideal between 15th to 25th November.\n• **Recommended HYV Varieties:** GW-322, Shriram 303, Lok-1, Tejas.\n• **Seed Rate:** 100-125 kg per hectare.\n• **NPK Requirement:** 120:60:40 kg/ha with basal DAP application.\n• **Critical Irrigation:** First watering at CRI stage (21-25 days post-sowing).\n• 🚜 *Rotavator & Seed-cum-fertilizer drills can be booked from the catalog!*`;
  }

  // 2. Tractor / Machinery / Rent
  if (q.includes("tractor") || q.includes("rent") || q.includes("ट्रैक्टर") || q.includes("किराया") || q.includes("मशीन")) {
    return isHi
      ? `🚜 **ट्रैक्टर एवं कृषि यंत्र बुकिंग की जानकारी:**\n\n1. हमारे पोर्टल पर 45HP-55HP के महिंद्रा, जॉन डियर व स्वराज ट्रैक्टर उपलब्ध हैं।\n2. **किराया दर:** ₹800 - ₹1200 प्रति एकड़ (डीजल व कुशल ऑपरेटर सहित)।\n3. **बुकिंग का तरीका:** होमपेज या 'Find Services' पर जाकर 'Request Service' बटन दबाएं।\n4. **कार्य पूर्ण होने पर:** काम खत्म होने पर डैशबोर्ड पर 'काम पूरा हुआ (Work Done)' की पुष्टि करें, तभी उपकरण प्रदाता पोर्टल पर पुनः उपलब्ध होगा।`
      : `🚜 **Machinery & Tractor Booking Guide:**\n\n1. Available models: Mahindra 575 DI, John Deere 5050D, Combine Harvesters.\n2. **Rates:** ₹800 to ₹1200 per acre (inclusive of operator).\n3. **How to book:** Click 'Request Service' on any machinery card in the catalog.\n4. **Work Completion:** Once the farmer confirms 'Work Done', the service is reactivated on the provider portal!`;
  }

  // 3. Fertilizer / Khad / Urea / DAP
  if (q.includes("fertilizer") || q.includes("urea") || q.includes("dap") || q.includes("खाद") || q.includes("यूरिया")) {
    return isHi
      ? `🌿 **उर्वरक एवं पोषण प्रबंधन सलाह:**\n\n• **बुवाई के समय (बेसल डोज):** 1 बैग DAP (50 किग्रा) + 25 किग्रा MOP (पोटाश) प्रति एकड़ दें।\n• **टॉप ड्रेसिंग (पहली व दूसरी सिंचाई पर):** 45 किग्रा यूरिया को 4 किग्रा जिंक सल्फेट के साथ मिलाकर दें।\n• **नैनो यूरिया:** कल्ले फूटते समय 4 मिली प्रति लीटर पानी में नैनो यूरिया का पर्णीय छिड़काव अत्यंत प्रभावी है।`
      : `🌿 **Fertilizer & Soil Nutrition Guide:**\n\n• **Basal Dressing:** Apply 1 bag DAP (50 kg) + 25 kg MOP (Potash) per acre at sowing.\n• **Top Dressing:** Apply 45 kg Urea split over 1st and 2nd irrigation.\n• **Micronutrients:** Spray Zinc Sulphate (21%) or IFFCO Nano Urea for accelerated tillering.`;
  }

  // 4. Pest / Keet / Disease
  if (q.includes("pest") || q.includes("keet") || q.includes("insect") || q.includes("कीट") || q.includes("रोग") || q.includes("बीमारी")) {
    return isHi
      ? `🐛 **कीट एवं रोग नियंत्रण उपाय:**\n\n• **तना छेदक व इल्ली (Stem Borer/Spodoptera):** कोराजन (Chlorantraniliprole 18.5% SC) 60 मिली प्रति एकड़ 150 लीटर पानी में छिड़कें।\n• **दीमक नियंत्रण:** बुवाई पूर्व क्लोरपायरीफॉस 20% EC से बीज उपचार करें।\n• **फफूंद रोग (Blight/Rust):** मैन्कोजेब 75% WP @ 2.5 ग्राम/लीटर पानी का छिड़काव करें।\n• ⚠️ *छिड़काव करते समय हवा की गति 15 किमी/घंटा से कम होनी चाहिए।*`
      : `🐛 **Integrated Pest & Disease Management:**\n\n• **Stem Borer / Caterpillars:** Spray Chlorantraniliprole (Coragen) @ 60 ml/acre in 150L water.\n• **Termite / Root Grub:** Seed treatment with Chlorpyrifos 20% EC prior to sowing.\n• **Fungal Blights / Rusts:** Apply Mancozeb 75 WP @ 2.5g/L water.\n• ⚠️ *Ensure wind speed is calm during chemical spraying.*`;
  }

  // 5. Weather / Mausam
  if (q.includes("weather") || q.includes("rain") || q.includes("मौसम") || q.includes("बारिश") || q.includes("पानी")) {
    return isHi
      ? `🌦️ **मौसम एवं कृषि कार्य दिशा-निर्देश:**\n\n• हमारे वेदर विजेट में आप अपने जिले का लाइव सैटेलाइट तापमान, आर्द्रता व वर्षा पूर्वानुमान देख सकते हैं।\n• यदि आगामी 24 घंटे में वर्षा की संभावना 40% से अधिक हो, तो यूरिया का भुरकाव व कीटनाशक छिड़काव रोक दें।\n• तेज धूप में सिंचाई हमेशा शाम 5 बजे के बाद करें।`
      : `🌦️ **Weather Action Advisory:**\n\n• Check the live Weather Card on the dashboard for real-time district forecast.\n• If rain probability exceeds 40%, postpone foliar spraying and top dressing.\n• Irrigate fields during cooler evening hours to maximize absorption.`;
  }

  // 6. Schemes / PM Kisan / Subsidy
  if (q.includes("yojana") || q.includes("subsidy") || q.includes("kisan") || q.includes("योजना") || q.includes("सब्सिडी")) {
    return isHi
      ? `💰 **सरकारी कृषि योजनाएं एवं सहायता:**\n\n• **पीएम किसान सम्मान निधि:** ₹6,000 प्रति वर्ष 3 किस्तों में। ई-केवाईसी (e-KYC) आवश्यक है।\n• **कृषि यंत्र अनुदान योजना:** ट्रैक्टर, रोटावेटर एवं सोलर पंप पर 40% से 50% तक सरकारी सब्सिडी मिलती है।\n• **पीएम फसल बीमा योजना (PMFBY):** रबी फसल पर मात्र 1.5% प्रीमियम पर पूर्ण प्राकृतिक आपदा सुरक्षा।\n• 📞 पूछताछ हेतु किसान हेल्पलाइन: **8127059442** पर संपर्क करें।`
      : `💰 **Government Schemes & Subsidies:**\n\n• **PM Kisan Samman Nidhi:** ₹6,000/year in 3 equal installments. Ensure Aadhaar e-KYC is active.\n• **Farm Mechanization Subsidy:** 40% to 50% subsidy on rotavators, seed drills & tractors via DBT portal.\n• **Pradhan Mantri Fasal Bima Yojana:** Crop insurance at 1.5% nominal premium for Rabi crops.\n• 📞 Kisan Support Line: **8127059442**.`;
  }

  // Default intelligent response
  return isHi
    ? `🌱 **नमस्ते किसान साथी!** मैं एग्रोटेक का कृषि सहायक हूँ।\n\nआप मुझसे पूछ सकते हैं:\n• **गेहूं, चना, सरसों या धान** की उन्नत बुवाई व खाद की मात्रा\n• **कीट एवं फफूंद** से फसल बचाने के उपाय\n• **ट्रैक्टर व रोटावेटर** किराए पर लेने की जानकारी\n• **सरकारी कृषि योजनाएं** व मंडी भाव\n\nबताएं, आज आपकी फसल या खेत में किस कार्य हेतु सहायता चाहिए?`
    : `🌱 **Hello Farmer Friend!** I am your AgroTECH AI Assistant.\n\nAsk me about:\n• **Best seasonal crop varieties** and fertilizer schedules\n• **Pest, weed and disease management** tips\n• **Tractor & harvester rental booking** workflows\n• **Government agricultural subsidies & advisories**\n\nHow can I assist your farm today?`;
}

async function sendChatMessage() {
  const input = document.getElementById("chatbotInput");
  const message = input.value.trim();
  if (!message) return;

  // Add user message
  addMessage(message, "user");
  input.value = "";

  const typingId = showTypingIndicator();

  try {
    let reply = null;

    // 1. Attempt call to FastAPI backend
    try {
      const apiBase = (typeof getApiBase === 'function') ? getApiBase() : 'http://127.0.0.1:8000/api';
      const response = await fetch(`${apiBase}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message, language: chatLanguage }),
        signal: AbortSignal.timeout(4000)
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.reply) {
          reply = data.reply;
        }
      }
    } catch (_) {}

    removeTypingIndicator(typingId);

    // 2. Use intelligent local agricultural knowledge engine if server offline
    if (!reply) {
      reply = getOfflineAgriAdvice(message, chatLanguage);
    }

    addMessage(reply, "bot");

  } catch (error) {
    removeTypingIndicator(typingId);
    const fallback = getOfflineAgriAdvice(message, chatLanguage);
    addMessage(fallback, "bot");
  }
}

function addMessage(message, sender) {
  const messagesContainer = document.getElementById("chatbotMessages");
  if (!messagesContainer) return;

  const messageDiv = document.createElement("div");
  messageDiv.className = `chat-message ${sender}-message`;

  if (sender === "bot") {
    messageDiv.innerHTML = `
      <div class="message-avatar">🌾🤖</div>
      <div class="message-content">${formatMessage(message)}</div>
    `;
  } else {
    messageDiv.innerHTML = `
      <div class="message-content">${escapeHTML(message)}</div>
    `;
  }

  messagesContainer.appendChild(messageDiv);
  scrollChatToBottom();
}

function showTypingIndicator() {
  const id = "typing-" + Date.now();
  const messagesContainer = document.getElementById("chatbotMessages");
  if (!messagesContainer) return id;

  const typingDiv = document.createElement("div");
  typingDiv.id = id;
  typingDiv.className = "chat-message bot-message";
  typingDiv.innerHTML = `
    <div class="message-avatar">🌾🤖</div>
    <div class="message-content">
      <div class="chat-typing">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;

  messagesContainer.appendChild(typingDiv);
  scrollChatToBottom();
  return id;
}

function removeTypingIndicator(id) {
  const element = document.getElementById(id);
  if (element) element.remove();
}

function scrollChatToBottom() {
  const messagesContainer = document.getElementById("chatbotMessages");
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatMessage(text) {
  let formatted = escapeHTML(text);
  formatted = formatted.replace(/^### (.*$)/gim, "<h4>$1</h4>");
  formatted = formatted.replace(/^## (.*$)/gim, "<h3>$1</h3>");
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/^- (.*$)/gim, "• $1");
  formatted = formatted.replace(/\n/g, "<br>");
  return formatted;
}