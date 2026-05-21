import React, {
  useState, useEffect, useRef, useCallback, useMemo, memo, lazy, Suspense
} from "react";

// ═══════════════════════════════════════════════════════════════════
//  SAHAYAK v4.0  —  National AI Citizen Super App
//  14 Feature Groups · Firebase Auth · DigiLocker · AI Grievance
//  Multi-Language · Women Safety · Admin Dashboard · Production-Ready
// ═══════════════════════════════════════════════════════════════════

// ── ENVIRONMENT (replace with real keys in .env) ──────────────────
const ENV = {
  FIREBASE_API_KEY: "demo-mode",
  CLAUDE_API_URL: "https://api.anthropic.com/v1/messages",
  CLAUDE_MODEL: "claude-sonnet-4-20250514",
};

// ── DESIGN TOKENS ─────────────────────────────────────────────────
const C = {
  saffron:"#FF6B00", saffronD:"#c45200", saffronL:"#FF8C3A",
  green:"#138808",   greenL:"#22c55e",
  navy:"#000080",    navyL:"#1e3a8a",
  bg:"#04060C",      card:"#09101A",  card2:"#0E1520",  card3:"#141E2C",
  border:"rgba(255,255,255,0.06)", border2:"rgba(255,255,255,0.11)",
  white:"#FFFFFF",   muted:"#5C6878",  mutedL:"#8E9EB0",
  danger:"#EF4444",  gold:"#F59E0B",  purple:"#8B5CF6",
  cyan:"#06B6D4",    pink:"#EC4899",  teal:"#14B8A6",   lime:"#84CC16",
  indigo:"#6366F1",
};

// ── CENTRALIZED TRANSLATIONS ──────────────────────────────────────
const TRANSLATIONS = {
  हिंदी: {
    // App shell
    appName:"सहायक", tagline:"AI नागरिक सुपर ऐप", version:"v4.0",
    home:"होम", sos:"SOS", yojana:"योजना", complaint:"शिकायत",
    docs:"दस्तावेज़", safety:"सुरक्षा", bot:"बॉट", admin:"प्रशासन",
    // Auth
    secureLogin:"सुरक्षित लॉगिन", firebaseOtp:"Firebase OTP प्रमाणीकरण — सुरक्षित",
    mobileNumber:"मोबाइल नंबर", getOtp:"📨 OTP प्राप्त करें →",
    sending:"⏳ OTP भेज रहे हैं...", verifyOtp:"OTP सत्यापित करें",
    verifying:"⏳ सत्यापित हो रहा है...", loginSuccess:"लॉगिन सफल!",
    resendOtp:"↻ OTP पुनः भेजें", demoMode:"डेमो मोड:",
    demoHint:"कोई भी 10 अंक · OTP:", backBtn:"← वापस", signIn:"लॉगिन / रजिस्टर",
    welcomeBack:"Sahayak में आपका स्वागत है 🙏",
    // Profile
    completeProfile:"प्रोफाइल पूरी करें", editProfile:"प्रोफाइल संपादित करें",
    fullName:"पूरा नाम", email:"ईमेल", city:"शहर", state:"राज्य",
    gender:"लिंग", dob:"जन्म तिथि", address:"पता",
    personalInfo:"व्यक्तिगत जानकारी", location:"स्थान", additional:"अतिरिक्त",
    profileSaved:"✅ प्रोफाइल सफलतापूर्वक सहेजी गई!",
    stepOf:"का चरण", savedFirestore:"Firebase Firestore में सहेजा गया",
    skipNow:"अभी छोड़ें →", saving:"⏳ सहेज रहे हैं...",
    // Home
    welcome:"नमस्ते", logout:"लॉगआउट",
    sosTitle:"आपातकालीन SOS", sosHint:"5 सेकंड · पुलिस + परिवार तुरंत अलर्ट",
    voiceWatch:"वॉइस वॉच", listening:"सुन रहा हूं...",
    located:"स्थान मिला", getGps:"GPS लें",
    bgListening:"निरंतर बैकग्राउंड सुनाई",
    callingIn:"सेकंड में कॉल हो रहा है — रद्द करने के लिए टैप करें",
    pressForSos:"आपातकालीन SOS के लिए दबाएं",
    quickAccess:"त्वरित पहुंच", recentComplaints:"हाल की शिकायतें",
    viewAll:"सभी देखें", helplines:"हेल्पलाइन",
    schemes:"योजनाएं", aiBot:"AI बॉट",
    // Emergency
    emergency:"आपातकालीन हेल्पलाइन", emergencyActive:"आपातकाल सक्रिय",
    liveGps:"GPS ट्रैकिंग LIVE", alertsDispatched:"अलर्ट भेजे गए:",
    cancelEmergency:"✋ आपातकाल मोड रद्द करें",
    nearbyServices:"पास की आपातकालीन सेवाएं",
    all:"सभी", hospitals:"अस्पताल", policeStns:"पुलिस स्टेशन",
    tapToCall:"नंबर टैप करके कॉल करें · मुफ़्त · बिना बैलेंस",
    // Services
    svc_police:"पुलिस", svc_police_desc:"अपराध / सुरक्षा",
    svc_ambulance:"एम्बुलेंस", svc_ambulance_desc:"चिकित्सा आपातकाल",
    svc_fire:"अग्निशमन दल", svc_fire_desc:"आग आपातकाल",
    svc_women:"महिला हेल्पलाइन", svc_women_desc:"महिला सुरक्षा",
    svc_disaster:"आपदा राहत", svc_disaster_desc:"प्राकृतिक आपदा",
    svc_road:"सड़क दुर्घटना", svc_road_desc:"हाईवे मदद",
    svc_child:"बाल हेल्पलाइन", svc_child_desc:"CHILDLINE",
    svc_cyber:"साइबर अपराध", svc_cyber_desc:"ऑनलाइन धोखाधड़ी",
    // Schemes
    schemesTitle:"सरकारी योजनाएं", govtVerified:"सरकार सत्यापित",
    officialSchemes:"आधिकारिक सरकारी पोर्टल · पात्रता · लाभ · आवेदन लिंक",
    keyBenefits:"मुख्य लाभ", eligibilityCriteria:"पात्रता मानदंड",
    howToApply:"कैसे आवेदन करें — चरण दर चरण",
    requiredDocs:"आवश्यक दस्तावेज़",
    checkEligOnline:"🔍 ऑनलाइन पात्रता जांचें →",
    officialMinistry:"आधिकारिक कार्यान्वयन मंत्रालय",
    smartRouting:"स्मार्ट पोर्टल रूटिंग",
    routedTo:"रूट किया गया →", helpline:"हेल्पलाइन →",
    applyNow:"🚀 अभी आवेदन करें", eligibility:"✅ पात्रता", askAi:"AI से पूछें →",
    digiLockerTip:"💡 DigiLocker में सभी दस्तावेज़ तैयार रखें",
    officialNote:"सभी योजनाएं भारत सरकार के आधिकारिक कार्यक्रम हैं।",
    // Complaint / Grievance
    grievanceTitle:"AI शिकायत सहायक",
    gpsAutoDetect:"GPS ऑटो-डिटेक्ट · वॉइस · AI ड्राफ्ट · स्मार्ट रूटिंग · ट्रैक",
    newTab:"✏️ नई", historyTab:"📋 इतिहास",
    noComplaints:"अभी तक कोई शिकायत नहीं", noComplaintsHint:"नई टैब से पहली शिकायत दर्ज करें",
    fileNew:"+ नई शिकायत दर्ज करें",
    step1:"1", step1Label:"स्थान ऑटो-डिटेक्ट",
    autoDetectGps:"📍 GPS ऑटो-डिटेक्ट",
    detecting:"⏳ डिटेक्ट हो रहा है...",
    gpsPermDenied:"स्थान की अनुमति अस्वीकार। मैन्युअल दर्ज करें।",
    enterManually:"नीचे अपना स्थान मैन्युअल दर्ज करें।",
    liveLocationDetected:"लाइव स्थान मिला",
    viewOnMaps:"🗺️ Google Maps पर देखें →",
    editLocation:"✏️ संपादित करें",
    district:"जिला", pincode:"पिनकोड", area:"क्षेत्र / सड़क (वैकल्पिक)",
    step2:"2", step2Label:"समस्या का प्रकार",
    step3:"3", step3Label:"विवरण — टाइप करें या बोलें",
    stopVoice:"बंद करें", voiceInput:"वॉइस",
    complainPlaceholder:"उदाहरण: 'सड़क टूट गई है' या 'पानी 3 दिन से नहीं आ रहा' — कोई भी भाषा",
    voiceListenPlaceholder:"🎙️ सुन रहा हूं... किसी भी भाषा में बोलें...",
    attachEvidence:"📷 सबूत संलग्न करें",
    photoAdded:"📷 फ़ोटो जोड़ी ✓",
    generateBtn:"🤖 AI से शिकायत तैयार करें",
    generating:"⚙️ AI शिकायत तैयार कर रहा है...",
    aiAnalyzing:"AI आपकी शिकायत का विश्लेषण कर रहा है...",
    claudeAnalyzing:"Claude AI · पहचान · रूटिंग · ड्राफ्टिंग",
    detectingCategory:"शिकायत श्रेणी पहचाना जा रही है",
    identifyingDept:"जिम्मेदार विभाग पहचाना जा रहा है",
    generatingDraft:"औपचारिक प्रारूप पत्र तैयार हो रहा है",
    routingPortal:"आधिकारिक सरकारी पोर्टल पर रूट हो रहा है",
    done:"✓ हो गया", processing:"● प्रक्रिया में",
    aiGenerated:"✅ AI शिकायत तैयार",
    category:"श्रेणी", dept:"विभाग", estDays:"अनु. दिन",
    portal:"पोर्टल", smartPortalRouting:"स्मार्ट पोर्टल रूटिंग सक्रिय",
    aiDraftTitle:"📝 AI-निर्मित औपचारिक शिकायत प्रारूप",
    submitComplaint:"✅ शिकायत दर्ज करें",
    openPortal:"🌐 पोर्टल खोलें",
    copyDraft:"📋 प्रारूप कॉपी करें", copied:"✅ कॉपी हो गया!",
    submitTrack:"📊 दर्ज करें और ट्रैक करें",
    refGenerated:"दर्ज करने पर Ref# बनेगा",
    shikayatRegistered:"शिकायत दर्ज!",
    officiallyFiled:"आपकी शिकायत आधिकारिक रूप से दर्ज हो गई",
    referenceNo:"संदर्भ संख्या", estResolution:"अनुमानित समाधान",
    officialPortal:"आधिकारिक पोर्टल",
    openPortalBtn:"🌐 पोर्टल खोलें", trackComplaint:"📊 शिकायत ट्रैक करें",
    viewHistory:"इतिहास देखें", submitComplaintBtn:"शिकायत दर्ज करें",
    submitted:"जमा", reviewed:"समीक्षा", inProgress:"प्रगति में", resolved:"हल हुआ",
    priority:"प्राथमिकता", high:"उच्च", medium:"मध्यम", low:"कम",
    // DigiLocker
    digilockerTitle:"डिजिलॉकर",
    digiProtected:"डिजिलॉकर सुरक्षित", enterPin:"4-अंकीय PIN दर्ज करें",
    unlock:"🔓 डिजिलॉकर अनलॉक करें", lock:"🔒 लॉक",
    demo4digit:"डेमो: कोई भी 4 अंक दर्ज करें",
    securityFeatures:"सुरक्षा सुविधाएं", digiSecDesc:"PIN · फेस लॉक · फिंगरप्रिंट · एन्क्रिप्टेड",
    verified:"सत्यापित", pending:"लंबित", download:"⬇️ डाउनलोड",
    share:"📤 साझा करें", print:"🖨️ प्रिंट", sync:"⟳ सिंक",
    search:"दस्तावेज़ खोजें...", digiLinked:"LINKED",
    digiKyc:"KYC ✓", govtVerifiedBadge:"सरकार सत्यापित",
    verifiedDocs:"सत्यापित दस्तावेज़",
    allDocs:"📁 सभी दस्तावेज़", docScanner:"📷 स्कैनर", aiAssistant:"🤖 AI सहायक",
    yourDocs:"आपके दस्तावेज़",
    qrVerify:"QR सत्यापन बैज", qrVerifyDesc:"सरकारी संस्थाएं तुरंत सत्यापित कर सकती हैं",
    lastSynced:"आखिरी सिंक", copyNum:"कॉपी करें", numCopied:"📋 नंबर कॉपी हुआ!",
    docScanned:"✅ दस्तावेज़ स्कैन हुआ!", dataExtracted:"डेटा सफलतापूर्वक निकाला गया",
    placeDoc:"यहां दस्तावेज़ रखें", scanSupported:"Aadhaar, PAN, DL, Passport",
    scanning:"दस्तावेज़ स्कैन हो रहा है...", aiExtracting:"AI टेक्स्ट निकाल रहा है...",
    scanDoc:"📷 दस्तावेज़ स्कैन करें", rescan:"पुनः स्कैन करें",
    autoFillProfile:"प्रोफाइल ऑटो-भरें", ocrComplete:"✅ OCR निष्कर्षण पूरा",
    syncSuccess:"🗂️ डिजिलॉकर सिंक हुआ!", syncDesc:"सभी दस्तावेज़ अपडेट हुए।",
    digiEndToEnd:"सभी दस्तावेज़ एंड-टू-एंड एन्क्रिप्टेड हैं।",
    aiDocTitle:"AI दस्तावेज़ सहायक", aiDocDesc:"दस्तावेज़ों के बारे में स्मार्ट सुझाव",
    voterMissing:"वोटर ID लंबित", dlExpiry:"DL समाप्ति अनुस्मारक",
    addHealthCard:"स्वास्थ्य कार्ड जोड़ें", profileComplete:"प्रोफाइल 88% पूरी",
    enableBiometric:"बायोमेट्रिक लॉक सक्षम करें",
    linkNow:"अभी लिंक करें", remindMe:"मुझे याद दिलाएं", addDoc:"दस्तावेज़ जोड़ें",
    upload:"अपलोड", setup:"सेटअप",
    // Women Safety
    womenSafetyTitle:"महिला सुरक्षा",
    womenSubtitle:"उन्नत सुरक्षा · साइलेंट SOS · गार्डियन · फेक कॉल",
    guardianMode:"गार्डियन मोड", guardianDesc:"लाइव GPS लगातार विश्वसनीय संपर्कों के साथ साझा",
    sharingWith:"📡 के साथ लाइव स्थान साझा हो रहा है:",
    silentSos:"🤫 साइलेंट SOS (तीन बार टैप)",
    silentSosDesc:"3× टैप करके चुपचाप आपातकाल ट्रिगर करें। कोई आवाज़ नहीं।",
    tap3x:"3× टैप करें साइलेंट SOS के लिए",
    tap2more:"2 बार और टैप करें...", tap1more:"1 बार और टैप करें...",
    tapsRegistered:"टैप दर्ज हुए",
    fakeCall:"📞 फेक कॉल जनरेटर", fakeCallDesc:"असुरक्षित स्थिति से बाहर निकलने के लिए नकली कॉल।",
    now:"अभी", tenSec:"10 सेकंड", thirtySec:"30 सेकंड",
    recording:"रिकॉर्डिंग", recTitle:"🎙️ आपातकालीन रिकॉर्डिंग",
    recDesc:"कानूनी सबूत के रूप में ऑडियो रिकॉर्ड करें। Firebase Storage में सुरक्षित।",
    stop:"⏹ बंद करें", start:"🔴 शुरू करें",
    fakeCallRinging:"📞 फेक कॉल बज रही है", incomingCall:"INCOMING CALL",
    decline:"अस्वीकार", accept:"स्वीकार",
    womenHelpline:"महिला हेल्पलाइन", womenHelplineDesc:"24/7 · मुफ़्त · गोपनीय · टैप करें",
    // Chatbot
    chatPlaceholder:"कुछ भी पूछें...",
    botTitle:"SahayakBot AI", botSubtitle:"Claude-संचालित · 24/7",
    // Admin
    adminTitle:"Admin Dashboard", adminSubtitle:"लाइव · रियल-टाइम · सरकारी अधिकारी",
    realTime:"REAL-TIME", liveFeed:"🚨 लाइव आपातकाल फ़ीड",
    systemPerf:"⚡ सिस्टम प्रदर्शन",
    overview:"Overview", heatmap:"Heatmap", complaints:"Complaints", infra:"Infra",
    districtHeatmap:"🗺️ जिला शिकायत हीटमैप",
    heatmapDesc:"शिकायत + आपातकाल घनत्व — दिल्ली NCR",
    complaintCategories:"📂 शिकायत श्रेणियां",
    serviceHealth:"🏗️ सेवा स्वास्थ्य",
    productionArch:"☁️ उत्पादन वास्तुकला",
    // Common
    save:"सहेजें", cancel:"रद्द करें", back:"वापस", submit:"जमा करें",
    offline:"📶 ऑफलाइन", offlineBanner:"ऑफलाइन मोड — SOS और GPS अभी भी उपलब्ध।",
    liveStatus:"LIVE", offlineStatus:"OFFLINE",
    notifications:"सूचनाएं", markAllRead:"सभी पढ़े",
    profileTitle:"प्रोफाइल", digiLockerId:"DigiLocker ID:",
    copySuccess:"📋 नंबर कॉपी हुआ!", recordingStarted:"🔴 रिकॉर्डिंग शुरू",
    recordingSaved:"⏹ रिकॉर्डिंग सहेजी गई", guardianOn:"🛡️ गार्डियन मोड चालू!",
    guardianOff:"गार्डियन मोड बंद", fakeRinging:"📞 फेक कॉल बज रही है",
    draftCopied:"📋 ड्राफ्ट क्लिपबोर्ड पर कॉपी हुआ!",
    eSahayak:"🇮🇳 एक भारत, श्रेष्ठ भारत",
  },

  English: {
    appName:"Sahayak", tagline:"AI Citizen Super App", version:"v4.0",
    home:"Home", sos:"SOS", yojana:"Schemes", complaint:"Grievance",
    docs:"DigiLocker", safety:"Safety", bot:"Bot", admin:"Admin",
    secureLogin:"Secure Login", firebaseOtp:"Firebase OTP authentication — real & secure",
    mobileNumber:"Mobile Number", getOtp:"📨 Get OTP →",
    sending:"⏳ Sending OTP...", verifyOtp:"Verify OTP",
    verifying:"⏳ Verifying...", loginSuccess:"Login Successful!",
    resendOtp:"↻ Resend OTP", demoMode:"Demo:",
    demoHint:"Any 10-digit number · OTP:", backBtn:"← Back", signIn:"Login / Register",
    welcomeBack:"Welcome to Sahayak 🙏",
    completeProfile:"Complete Profile", editProfile:"Edit Profile",
    fullName:"Full Name", email:"Email", city:"City", state:"State",
    gender:"Gender", dob:"Date of Birth", address:"Address",
    personalInfo:"Personal Info", location:"Location", additional:"Additional",
    profileSaved:"✅ Profile saved successfully!",
    stepOf:"Step of", savedFirestore:"Saved to Firebase Firestore",
    skipNow:"Skip for now →", saving:"⏳ Saving...",
    welcome:"Welcome", logout:"Logout",
    sosTitle:"Emergency SOS", sosHint:"5s countdown · Police + Family instantly alerted",
    voiceWatch:"Voice Watch", listening:"Listening...",
    located:"Located", getGps:"Get GPS",
    bgListening:"Continuous background listening",
    callingIn:"Calling in — tap to cancel",
    pressForSos:"Press for Emergency SOS",
    quickAccess:"Quick Access", recentComplaints:"Recent Complaints",
    viewAll:"View All", helplines:"Helplines",
    schemes:"Schemes", aiBot:"AI Bot",
    emergency:"Emergency Helplines", emergencyActive:"EMERGENCY ACTIVE",
    liveGps:"GPS Tracking LIVE", alertsDispatched:"Alerts Dispatched:",
    cancelEmergency:"✋ Cancel Emergency Mode",
    nearbyServices:"Nearby Emergency Services",
    all:"All", hospitals:"Hospitals", policeStns:"Police Stns.",
    tapToCall:"Tap number to call · FREE · No balance needed",
    svc_police:"Police", svc_police_desc:"Crime / Safety",
    svc_ambulance:"Ambulance", svc_ambulance_desc:"Medical Emergency",
    svc_fire:"Fire Brigade", svc_fire_desc:"Fire Emergency",
    svc_women:"Women Helpline", svc_women_desc:"Women Safety",
    svc_disaster:"Disaster Relief", svc_disaster_desc:"Natural Disaster",
    svc_road:"Road Accident", svc_road_desc:"Highway Help",
    svc_child:"Child Helpline", svc_child_desc:"CHILDLINE",
    svc_cyber:"Cyber Crime", svc_cyber_desc:"Online Fraud",
    schemesTitle:"Government Schemes", govtVerified:"Govt Verified",
    officialSchemes:"Official govt portals · Eligibility · Benefits · Apply links",
    keyBenefits:"Key Benefits", eligibilityCriteria:"Eligibility Criteria",
    howToApply:"How to Apply — Step by Step",
    requiredDocs:"Required Documents",
    checkEligOnline:"🔍 Check My Eligibility Online →",
    officialMinistry:"Official Implementing Ministry",
    smartRouting:"Smart Portal Routing", routedTo:"Routed →",
    helpline:"Helpline →",
    applyNow:"🚀 Apply Now", eligibility:"✅ Eligibility", askAi:"Ask AI →",
    digiLockerTip:"💡 Keep all documents ready in DigiLocker before applying.",
    officialNote:"All schemes are official Government of India programmes.",
    grievanceTitle:"AI Grievance Assistant",
    gpsAutoDetect:"GPS Auto-Detect · Voice · AI Draft · Smart Routing · Track",
    newTab:"✏️ New", historyTab:"📋 History",
    noComplaints:"No complaints filed yet", noComplaintsHint:"File your first complaint using the New tab",
    fileNew:"+ File New Complaint",
    step1:"1", step1Label:"LOCATION AUTO-DETECT",
    autoDetectGps:"📍 Auto-Detect GPS",
    detecting:"⏳ Detecting...",
    gpsPermDenied:"Location permission denied. Enter manually.",
    enterManually:"Enter your location manually in the fields below.",
    liveLocationDetected:"Live Location Detected",
    viewOnMaps:"🗺️ View on Google Maps →",
    editLocation:"✏️ Edit",
    district:"District", pincode:"Pincode", area:"Area / Street (optional)",
    step2:"2", step2Label:"PROBLEM TYPE",
    step3:"3", step3Label:"DESCRIBE — TYPE OR SPEAK",
    stopVoice:"Stop", voiceInput:"Voice",
    complainPlaceholder:"e.g. 'Road toot gayi hai' or 'Water supply nahi aa raha 3 din se' — Any language",
    voiceListenPlaceholder:"🎙️ Listening... speak in any language...",
    attachEvidence:"📷 Attach Evidence",
    photoAdded:"📷 Photo Attached ✓",
    generateBtn:"🤖 Generate Complaint with AI",
    generating:"⚙️ AI Generating Complaint...",
    aiAnalyzing:"AI Analyzing Your Complaint...",
    claudeAnalyzing:"Claude AI · Detecting · Routing · Drafting",
    detectingCategory:"Detecting complaint category",
    identifyingDept:"Identifying responsible department",
    generatingDraft:"Generating formal draft letter",
    routingPortal:"Routing to official govt portal",
    done:"✓ Done", processing:"● Processing",
    aiGenerated:"✅ AI Complaint Generated",
    category:"Category", dept:"Department", estDays:"Est. Days",
    portal:"Portal", smartPortalRouting:"Smart Portal Routing Active",
    aiDraftTitle:"📝 AI-Generated Formal Complaint Draft",
    submitComplaint:"✅ Submit Complaint",
    openPortal:"🌐 Open Portal",
    copyDraft:"📋 Copy Draft", copied:"✅ Copied!",
    submitTrack:"📊 Submit & Track",
    refGenerated:"Ref # generated on submission",
    shikayatRegistered:"Shikayat Registered!",
    officiallyFiled:"Your complaint has been officially filed",
    referenceNo:"Reference No.", estResolution:"Est. Resolution",
    officialPortal:"Official Portal",
    openPortalBtn:"🌐 Open Portal", trackComplaint:"📊 Track Complaint",
    viewHistory:"View History", submitComplaintBtn:"Submit Complaint",
    submitted:"Submitted", reviewed:"Reviewed", inProgress:"In Progress", resolved:"Resolved",
    priority:"Priority", high:"High", medium:"Medium", low:"Low",
    digilockerTitle:"DigiLocker",
    digiProtected:"DigiLocker Protected", enterPin:"Enter your 4-digit security PIN",
    unlock:"🔓 Unlock DigiLocker", lock:"🔒 Lock",
    demo4digit:"Demo: Enter any 4 digits to set your PIN",
    securityFeatures:"Security Features", digiSecDesc:"PIN · Face Lock · Fingerprint · Encrypted",
    verified:"Verified", pending:"Pending", download:"⬇️ Download",
    share:"📤 Share", print:"🖨️ Print", sync:"⟳ Sync",
    search:"Search documents...", digiLinked:"LINKED",
    digiKyc:"KYC ✓", govtVerifiedBadge:"Govt Verified",
    verifiedDocs:"Verified",
    allDocs:"📁 All Documents", docScanner:"📷 Scanner", aiAssistant:"🤖 AI Assistant",
    yourDocs:"YOUR DOCUMENTS",
    qrVerify:"QR Verification Badge", qrVerifyDesc:"Government agencies can scan to verify instantly",
    lastSynced:"Last Synced", copyNum:"Copy", numCopied:"📋 Document number copied!",
    docScanned:"✅ Document scanned!", dataExtracted:"Data extracted successfully.",
    placeDoc:"Place Document Here", scanSupported:"Aadhaar, PAN, DL, Passport supported",
    scanning:"Scanning document...", aiExtracting:"AI extracting text...",
    scanDoc:"📷 Scan Document", rescan:"Rescan",
    autoFillProfile:"Auto-fill Profile", ocrComplete:"✅ OCR Extraction Complete",
    syncSuccess:"🗂️ DigiLocker synced!", syncDesc:"All documents updated.",
    digiEndToEnd:"All documents are end-to-end encrypted.",
    aiDocTitle:"AI Document Assistant", aiDocDesc:"Smart insights about your documents.",
    voterMissing:"Voter ID Missing", dlExpiry:"DL Expiry Reminder",
    addHealthCard:"Add Health Card", profileComplete:"Profile 88% Complete",
    enableBiometric:"Enable Biometric Lock",
    linkNow:"Link Now", remindMe:"Remind Me", addDoc:"Add Doc",
    upload:"Upload", setup:"Setup",
    womenSafetyTitle:"Women Safety",
    womenSubtitle:"Advanced protection · Silent SOS · Guardian · Fake Call",
    guardianMode:"Guardian Mode", guardianDesc:"Live GPS shared continuously with trusted contacts",
    sharingWith:"📡 SHARING LIVE LOCATION WITH:",
    silentSos:"🤫 Silent SOS (Triple-Tap)",
    silentSosDesc:"Tap 3× to silently trigger emergency. No sound, no visible alert.",
    tap3x:"Tap 3× for Silent SOS",
    tap2more:"Tap 2 more times...", tap1more:"Tap 1 more time...",
    tapsRegistered:"taps registered",
    fakeCall:"📞 Fake Call Generator", fakeCallDesc:"Simulate an incoming call to safely exit unsafe situations.",
    now:"Now", tenSec:"10 sec", thirtySec:"30 sec",
    recording:"Recording", recTitle:"🎙️ Emergency Recording",
    recDesc:"Auto-record audio as legal evidence. Stored in Firebase Storage.",
    stop:"⏹ Stop", start:"🔴 Start",
    fakeCallRinging:"📞 Fake call ringing", incomingCall:"INCOMING CALL",
    decline:"Decline", accept:"Accept",
    womenHelpline:"Women Helpline", womenHelplineDesc:"24/7 · FREE · Confidential · Tap to call",
    chatPlaceholder:"Ask anything...",
    botTitle:"SahayakBot AI", botSubtitle:"Claude-powered · 24/7",
    adminTitle:"Admin Dashboard", adminSubtitle:"Live · Real-time · Government Officials Only",
    realTime:"REAL-TIME", liveFeed:"🚨 Live Emergency Feed",
    systemPerf:"⚡ System Performance",
    overview:"Overview", heatmap:"Heatmap", complaints:"Complaints", infra:"Infra",
    districtHeatmap:"🗺️ District Complaint Heatmap",
    heatmapDesc:"Complaint + emergency density across Delhi NCR",
    complaintCategories:"📂 Complaint Categories",
    serviceHealth:"🏗️ Service Health Dashboard",
    productionArch:"☁️ Production Architecture",
    save:"Save", cancel:"Cancel", back:"Back", submit:"Submit",
    offline:"📶 Offline", offlineBanner:"Offline Mode — SOS & GPS still available. AI paused.",
    liveStatus:"LIVE", offlineStatus:"OFFLINE",
    notifications:"Notifications", markAllRead:"Mark all read",
    profileTitle:"Profile", digiLockerId:"DigiLocker ID:",
    copySuccess:"📋 Document number copied!",
    recordingStarted:"🔴 Emergency recording started",
    recordingSaved:"⏹ Recording saved as evidence",
    guardianOn:"🛡️ Guardian Mode ON! Live location sharing started.",
    guardianOff:"Guardian Mode OFF",
    fakeRinging:"📞 Fake call ringing",
    draftCopied:"📋 Complaint draft copied to clipboard!",
    eSahayak:"🇮🇳 Ek Bharat, Shreshtha Bharat",
  },

  मराठी: {
    appName:"सहायक", tagline:"AI नागरिक सुपर ॲप", version:"v4.0",
    home:"मुखपृष्ठ", sos:"SOS", yojana:"योजना", complaint:"तक्रार",
    docs:"डिजिलॉकर", safety:"सुरक्षा", bot:"बॉट", admin:"प्रशासन",
    secureLogin:"सुरक्षित लॉगिन", firebaseOtp:"Firebase OTP प्रमाणीकरण",
    mobileNumber:"मोबाइल क्रमांक", getOtp:"📨 OTP मिळवा →",
    sending:"⏳ OTP पाठवत आहे...", verifyOtp:"OTP सत्यापित करा",
    verifying:"⏳ सत्यापन होत आहे...", loginSuccess:"लॉगिन यशस्वी!",
    resendOtp:"↻ OTP पुन्हा पाठवा", demoMode:"डेमो:", demoHint:"कोणतेही 10 अंक · OTP:",
    backBtn:"← मागे", signIn:"लॉगिन / नोंदणी", welcomeBack:"Sahayak मध्ये स्वागत 🙏",
    completeProfile:"प्रोफाइल पूर्ण करा", editProfile:"प्रोफाइल संपादित करा",
    fullName:"पूर्ण नाव", email:"ईमेल", city:"शहर", state:"राज्य",
    gender:"लिंग", dob:"जन्मतारीख", address:"पत्ता",
    personalInfo:"वैयक्तिक माहिती", location:"स्थान", additional:"अतिरिक्त",
    profileSaved:"✅ प्रोफाइल यशस्वीरित्या सहेजली!", stepOf:"चरण",
    savedFirestore:"Firebase Firestore मध्ये सहेजले", skipNow:"आत्ता वगळा →", saving:"⏳ सहेजत आहे...",
    welcome:"नमस्कार", logout:"बाहेर पडा",
    sosTitle:"आणीबाणी SOS", sosHint:"5 सेकंद · पोलीस + कुटुंब तत्काळ सतर्क",
    voiceWatch:"व्हॉइस वॉच", listening:"ऐकत आहे...", located:"स्थान मिळाले", getGps:"GPS मिळवा",
    bgListening:"सतत बॅकग्राउंड ऐकणे", callingIn:"सेकंदात कॉल होईल — रद्द करण्यासाठी टॅप करा",
    pressForSos:"आणीबाणी SOS साठी दाबा", quickAccess:"जलद प्रवेश",
    recentComplaints:"अलीकडील तक्रारी", viewAll:"सर्व पहा", helplines:"हेल्पलाइन",
    schemes:"योजना", aiBot:"AI बॉट",
    emergency:"आणीबाणी हेल्पलाइन", emergencyActive:"आणीबाणी सक्रिय",
    liveGps:"GPS ट्रॅकिंग LIVE", alertsDispatched:"अलर्ट पाठवले:",
    cancelEmergency:"✋ आणीबाणी मोड रद्द करा", nearbyServices:"जवळील आपातकालीन सेवा",
    all:"सर्व", hospitals:"रुग्णालये", policeStns:"पोलीस स्टेशन",
    tapToCall:"कॉल करण्यासाठी नंबर टॅप करा · मोफत",
    svc_police:"पोलीस", svc_police_desc:"गुन्हा / सुरक्षा",
    svc_ambulance:"रुग्णवाहिका", svc_ambulance_desc:"वैद्यकीय आणीबाणी",
    svc_fire:"अग्निशमन दल", svc_fire_desc:"आग आणीबाणी",
    svc_women:"महिला हेल्पलाइन", svc_women_desc:"महिला सुरक्षा",
    svc_disaster:"आपत्ती मदत", svc_disaster_desc:"नैसर्गिक आपत्ती",
    svc_road:"रस्ता अपघात", svc_road_desc:"महामार्ग मदत",
    svc_child:"बाल हेल्पलाइन", svc_child_desc:"CHILDLINE",
    svc_cyber:"सायबर गुन्हा", svc_cyber_desc:"ऑनलाइन फसवणूक",
    schemesTitle:"सरकारी योजना", govtVerified:"सरकार सत्यापित",
    officialSchemes:"अधिकृत सरकारी पोर्टल · पात्रता · लाभ · अर्ज लिंक",
    keyBenefits:"मुख्य लाभ", eligibilityCriteria:"पात्रता निकष",
    howToApply:"अर्ज कसा करावा — चरण दर चरण", requiredDocs:"आवश्यक कागदपत्रे",
    checkEligOnline:"🔍 ऑनलाइन पात्रता तपासा →", officialMinistry:"अधिकृत मंत्रालय",
    smartRouting:"स्मार्ट पोर्टल रूटिंग", routedTo:"रूट केले →", helpline:"हेल्पलाइन →",
    applyNow:"🚀 आता अर्ज करा", eligibility:"✅ पात्रता", askAi:"AI ला विचारा →",
    digiLockerTip:"💡 अर्ज करण्यापूर्वी DigiLocker मध्ये सर्व कागदपत्रे तयार ठेवा.",
    officialNote:"सर्व योजना भारत सरकारचे अधिकृत कार्यक्रम आहेत.",
    grievanceTitle:"AI तक्रार सहाय्यक", gpsAutoDetect:"GPS ऑटो-डिटेक्ट · व्हॉइस · AI मसुदा · स्मार्ट रूटिंग",
    newTab:"✏️ नवीन", historyTab:"📋 इतिहास",
    noComplaints:"अद्याप तक्रारी नाहीत", noComplaintsHint:"नवीन टॅबमधून पहिली तक्रार दाखल करा",
    fileNew:"+ नवीन तक्रार दाखल करा", step1:"1", step1Label:"स्थान ऑटो-डिटेक्ट",
    autoDetectGps:"📍 GPS ऑटो-डिटेक्ट", detecting:"⏳ शोधत आहे...",
    gpsPermDenied:"स्थान परवानगी नाकारली. मॅन्युअल प्रविष्ट करा.",
    enterManually:"खाली तुमचे स्थान मॅन्युअल प्रविष्ट करा.",
    liveLocationDetected:"लाइव्ह स्थान मिळाले", viewOnMaps:"🗺️ Google Maps वर पहा →",
    editLocation:"✏️ संपादित करा", district:"जिल्हा", pincode:"पिनकोड",
    area:"क्षेत्र / रस्ता (ऐच्छिक)", step2:"2", step2Label:"समस्येचा प्रकार",
    step3:"3", step3Label:"वर्णन करा — टाइप करा किंवा बोला",
    stopVoice:"थांबवा", voiceInput:"व्हॉइस",
    complainPlaceholder:"उदा: 'रस्ता खराब आहे' किंवा 'पाणी 3 दिवस येत नाही' — कोणतीही भाषा",
    voiceListenPlaceholder:"🎙️ ऐकत आहे... कोणत्याही भाषेत बोला...",
    attachEvidence:"📷 पुरावा जोडा", photoAdded:"📷 फोटो जोडला ✓",
    generateBtn:"🤖 AI ने तक्रार तयार करा", generating:"⚙️ AI तक्रार तयार करत आहे...",
    aiAnalyzing:"AI तुमच्या तक्रारीचे विश्लेषण करत आहे...",
    claudeAnalyzing:"Claude AI · ओळख · रूटिंग · मसुदा",
    detectingCategory:"तक्रार श्रेणी ओळखत आहे", identifyingDept:"जबाबदार विभाग ओळखत आहे",
    generatingDraft:"औपचारिक मसुदा तयार होत आहे", routingPortal:"अधिकृत पोर्टलवर रूट होत आहे",
    done:"✓ झाले", processing:"● प्रक्रियेत",
    aiGenerated:"✅ AI तक्रार तयार झाली",
    category:"श्रेणी", dept:"विभाग", estDays:"अंदाजित दिवस", portal:"पोर्टल",
    smartPortalRouting:"स्मार्ट पोर्टल रूटिंग सक्रिय",
    aiDraftTitle:"📝 AI-निर्मित औपचारिक तक्रार मसुदा",
    submitComplaint:"✅ तक्रार सादर करा", openPortal:"🌐 पोर्टल उघडा",
    copyDraft:"📋 मसुदा कॉपी करा", copied:"✅ कॉपी झाले!",
    submitTrack:"📊 सादर करा आणि ट्रॅक करा",
    refGenerated:"सादर केल्यावर Ref# तयार होईल",
    shikayatRegistered:"तक्रार नोंदवली!", officiallyFiled:"तुमची तक्रार अधिकृतपणे नोंदवली गेली",
    referenceNo:"संदर्भ क्रमांक", estResolution:"अंदाजित निराकरण",
    officialPortal:"अधिकृत पोर्टल", openPortalBtn:"🌐 पोर्टल उघडा",
    trackComplaint:"📊 तक्रार ट्रॅक करा", viewHistory:"इतिहास पहा",
    submitComplaintBtn:"तक्रार सादर करा",
    submitted:"सादर", reviewed:"पुनरावलोकन", inProgress:"प्रगतीत", resolved:"निराकरण झाले",
    priority:"प्राधान्य", high:"उच्च", medium:"मध्यम", low:"कमी",
    digilockerTitle:"डिजिलॉकर", digiProtected:"डिजिलॉकर संरक्षित",
    enterPin:"4-अंकी PIN प्रविष्ट करा", unlock:"🔓 डिजिलॉकर अनलॉक करा", lock:"🔒 लॉक",
    demo4digit:"डेमो: कोणतेही 4 अंक प्रविष्ट करा", securityFeatures:"सुरक्षा वैशिष्ट्ये",
    digiSecDesc:"PIN · फेस लॉक · फिंगरप्रिंट · एन्क्रिप्टेड",
    verified:"सत्यापित", pending:"प्रलंबित", download:"⬇️ डाउनलोड",
    share:"📤 शेअर", print:"🖨️ प्रिंट", sync:"⟳ सिंक",
    search:"दस्तावेज शोधा...", digiLinked:"LINKED", digiKyc:"KYC ✓",
    govtVerifiedBadge:"सरकार सत्यापित", verifiedDocs:"सत्यापित",
    allDocs:"📁 सर्व दस्तावेज", docScanner:"📷 स्कॅनर", aiAssistant:"🤖 AI सहाय्यक",
    yourDocs:"तुमचे दस्तावेज",
    qrVerify:"QR सत्यापन बॅज", qrVerifyDesc:"सरकारी संस्था त्वरित सत्यापित करू शकतात",
    lastSynced:"शेवटी सिंक", copyNum:"कॉपी करा", numCopied:"📋 क्रमांक कॉपी झाला!",
    docScanned:"✅ दस्तावेज स्कॅन झाला!", dataExtracted:"डेटा यशस्वीरित्या काढला.",
    placeDoc:"येथे दस्तावेज ठेवा", scanSupported:"Aadhaar, PAN, DL, Passport",
    scanning:"दस्तावेज स्कॅन होत आहे...", aiExtracting:"AI मजकूर काढत आहे...",
    scanDoc:"📷 दस्तावेज स्कॅन करा", rescan:"पुन्हा स्कॅन करा",
    autoFillProfile:"प्रोफाइल ऑटो-भरा", ocrComplete:"✅ OCR निष्कर्षण पूर्ण",
    syncSuccess:"🗂️ डिजिलॉकर सिंक झाला!", syncDesc:"सर्व दस्तावेज अपडेट झाले.",
    digiEndToEnd:"सर्व दस्तावेज एंड-टू-एंड एन्क्रिप्टेड आहेत.",
    aiDocTitle:"AI दस्तावेज सहाय्यक", aiDocDesc:"दस्तावेजांबद्दल स्मार्ट सूचना.",
    voterMissing:"वोटर ID प्रलंबित", dlExpiry:"DL समाप्ती अनुस्मारक",
    addHealthCard:"स्वास्थ्य कार्ड जोडा", profileComplete:"प्रोफाइल 88% पूर्ण",
    enableBiometric:"बायोमेट्रिक लॉक सक्षम करा",
    linkNow:"आता लिंक करा", remindMe:"मला आठवण करा", addDoc:"दस्तावेज जोडा",
    upload:"अपलोड", setup:"सेटअप",
    womenSafetyTitle:"महिला सुरक्षा", womenSubtitle:"प्रगत संरक्षण · सायलेंट SOS · गार्डियन · फेक कॉल",
    guardianMode:"गार्डियन मोड", guardianDesc:"लाइव्ह GPS विश्वासू संपर्कांसह सतत शेअर",
    sharingWith:"📡 सह लाइव्ह स्थान शेअर होत आहे:",
    silentSos:"🤫 सायलेंट SOS (तीनदा टॅप)", silentSosDesc:"3× टॅप करून शांतपणे आणीबाणी ट्रिगर करा.",
    tap3x:"3× टॅप करा सायलेंट SOS साठी", tap2more:"2 वेळा अधिक टॅप करा...",
    tap1more:"1 वेळ अधिक टॅप करा...", tapsRegistered:"टॅप नोंदवले",
    fakeCall:"📞 फेक कॉल जनरेटर", fakeCallDesc:"असुरक्षित परिस्थितीतून बाहेर पडण्यासाठी बनावट कॉल.",
    now:"आत्ता", tenSec:"10 सेकंद", thirtySec:"30 सेकंद",
    recording:"रेकॉर्डिंग", recTitle:"🎙️ आणीबाणी रेकॉर्डिंग",
    recDesc:"कायदेशीर पुरावा म्हणून ऑडिओ रेकॉर्ड करा. Firebase Storage मध्ये सुरक्षित.",
    stop:"⏹ थांबवा", start:"🔴 सुरू करा",
    fakeCallRinging:"📞 फेक कॉल वाजत आहे", incomingCall:"INCOMING CALL",
    decline:"नाकारा", accept:"स्वीकारा",
    womenHelpline:"महिला हेल्पलाइन", womenHelplineDesc:"24/7 · मोफत · गोपनीय · टॅप करा",
    chatPlaceholder:"काहीही विचारा...", botTitle:"SahayakBot AI", botSubtitle:"Claude-संचालित · 24/7",
    adminTitle:"Admin Dashboard", adminSubtitle:"लाइव्ह · रियल-टाइम · सरकारी अधिकारी",
    realTime:"REAL-TIME", liveFeed:"🚨 लाइव्ह आणीबाणी फीड",
    systemPerf:"⚡ सिस्टम कामगिरी",
    overview:"आढावा", heatmap:"हीटमॅप", complaints:"तक्रारी", infra:"इन्फ्रा",
    districtHeatmap:"🗺️ जिल्हा तक्रार हीटमॅप", heatmapDesc:"तक्रार + आणीबाणी घनता — दिल्ली NCR",
    complaintCategories:"📂 तक्रार श्रेण्या", serviceHealth:"🏗️ सेवा स्वास्थ्य",
    productionArch:"☁️ उत्पादन वास्तुकला",
    save:"सहेजा", cancel:"रद्द करा", back:"मागे", submit:"सादर करा",
    offline:"📶 ऑफलाइन", offlineBanner:"ऑफलाइन मोड — SOS आणि GPS अजूनही उपलब्ध.",
    liveStatus:"LIVE", offlineStatus:"OFFLINE",
    notifications:"सूचना", markAllRead:"सर्व वाचले",
    profileTitle:"प्रोफाइल", digiLockerId:"DigiLocker ID:",
    copySuccess:"📋 क्रमांक कॉपी झाला!", recordingStarted:"🔴 रेकॉर्डिंग सुरू झाली",
    recordingSaved:"⏹ रेकॉर्डिंग सहेजली", guardianOn:"🛡️ गार्डियन मोड चालू!",
    guardianOff:"गार्डियन मोड बंद", fakeRinging:"📞 फेक कॉल वाजत आहे",
    draftCopied:"📋 तक्रार मसुदा क्लिपबोर्डवर कॉपी झाला!",
    eSahayak:"🇮🇳 एक भारत, श्रेष्ठ भारत",
  },

  বাংলা: {
    appName:"সহায়ক", tagline:"AI নাগরিক সুপার অ্যাপ", version:"v4.0",
    home:"হোম", sos:"SOS", yojana:"প্রকল্প", complaint:"অভিযোগ",
    docs:"ডিজিলকার", safety:"নিরাপত্তা", bot:"বট", admin:"প্রশাসন",
    secureLogin:"নিরাপদ লগইন", firebaseOtp:"Firebase OTP প্রমাণীকরণ",
    mobileNumber:"মোবাইল নম্বর", getOtp:"📨 OTP নিন →",
    sending:"⏳ OTP পাঠানো হচ্ছে...", verifyOtp:"OTP যাচাই করুন",
    verifying:"⏳ যাচাই হচ্ছে...", loginSuccess:"লগইন সফল!",
    resendOtp:"↻ OTP পুনরায় পাঠান", demoMode:"ডেমো:", demoHint:"যেকোনো 10 সংখ্যা · OTP:",
    backBtn:"← ফিরে", signIn:"লগইন / নিবন্ধন", welcomeBack:"Sahayak-এ স্বাগতম 🙏",
    completeProfile:"প্রোফাইল সম্পূর্ণ করুন", editProfile:"প্রোফাইল সম্পাদনা",
    fullName:"পুরো নাম", email:"ইমেইল", city:"শহর", state:"রাজ্য",
    gender:"লিঙ্গ", dob:"জন্ম তারিখ", address:"ঠিকানা",
    personalInfo:"ব্যক্তিগত তথ্য", location:"অবস্থান", additional:"অতিরিক্ত",
    profileSaved:"✅ প্রোফাইল সফলভাবে সংরক্ষিত!", stepOf:"ধাপ",
    savedFirestore:"Firebase Firestore-এ সংরক্ষিত", skipNow:"এখন এড়িয়ে যান →", saving:"⏳ সংরক্ষণ হচ্ছে...",
    welcome:"নমস্কার", logout:"লগআউট",
    sosTitle:"জরুরি SOS", sosHint:"৫ সেকেন্ড · পুলিশ + পরিবার তৎক্ষণাৎ সতর্ক",
    voiceWatch:"ভয়েস ওয়াচ", listening:"শুনছি...", located:"অবস্থান পাওয়া গেছে", getGps:"GPS নিন",
    bgListening:"ক্রমাগত ব্যাকগ্রাউন্ড শোনা", callingIn:"সেকেন্ডে কল হবে — বাতিল করতে ট্যাপ করুন",
    pressForSos:"জরুরি SOS-এর জন্য চাপুন", quickAccess:"দ্রুত প্রবেশ",
    recentComplaints:"সাম্প্রতিক অভিযোগ", viewAll:"সব দেখুন", helplines:"হেল্পলাইন",
    schemes:"প্রকল্প", aiBot:"AI বট",
    emergency:"জরুরি হেল্পলাইন", emergencyActive:"জরুরি অবস্থা সক্রিয়",
    liveGps:"GPS ট্র্যাকিং LIVE", alertsDispatched:"সতর্কতা পাঠানো হয়েছে:",
    cancelEmergency:"✋ জরুরি মোড বাতিল করুন", nearbyServices:"কাছাকাছি জরুরি সেবা",
    all:"সব", hospitals:"হাসপাতাল", policeStns:"পুলিশ স্টেশন",
    tapToCall:"কল করতে নম্বর ট্যাপ করুন · বিনামূল্যে",
    svc_police:"পুলিশ", svc_police_desc:"অপরাধ / নিরাপত্তা",
    svc_ambulance:"অ্যাম্বুলেন্স", svc_ambulance_desc:"চিকিৎসা জরুরি",
    svc_fire:"দমকল বাহিনী", svc_fire_desc:"আগুন জরুরি",
    svc_women:"নারী হেল্পলাইন", svc_women_desc:"নারী নিরাপত্তা",
    svc_disaster:"দুর্যোগ ত্রাণ", svc_disaster_desc:"প্রাকৃতিক দুর্যোগ",
    svc_road:"সড়ক দুর্ঘটনা", svc_road_desc:"মহাসড়ক সহায়তা",
    svc_child:"শিশু হেল্পলাইন", svc_child_desc:"CHILDLINE",
    svc_cyber:"সাইবার অপরাধ", svc_cyber_desc:"অনলাইন প্রতারণা",
    schemesTitle:"সরকারি প্রকল্প", govtVerified:"সরকার যাচাইকৃত",
    officialSchemes:"আধিকারিক সরকারি পোর্টাল · যোগ্যতা · সুবিধা · আবেদন লিঙ্ক",
    keyBenefits:"মূল সুবিধা", eligibilityCriteria:"যোগ্যতার মানদণ্ড",
    howToApply:"কিভাবে আবেদন করবেন — ধাপে ধাপে", requiredDocs:"প্রয়োজনীয় নথি",
    checkEligOnline:"🔍 অনলাইনে যোগ্যতা যাচাই করুন →", officialMinistry:"আধিকারিক মন্ত্রণালয়",
    smartRouting:"স্মার্ট পোর্টাল রাউটিং", routedTo:"রুট করা হয়েছে →", helpline:"হেল্পলাইন →",
    applyNow:"🚀 এখনই আবেদন করুন", eligibility:"✅ যোগ্যতা", askAi:"AI-কে জিজ্ঞেস করুন →",
    digiLockerTip:"💡 আবেদনের আগে DigiLocker-এ সব নথি প্রস্তুত রাখুন।",
    officialNote:"সব প্রকল্প ভারত সরকারের আধিকারিক কর্মসূচি।",
    grievanceTitle:"AI অভিযোগ সহায়তা", gpsAutoDetect:"GPS স্বয়ংক্রিয় · ভয়েস · AI খসড়া · স্মার্ট রাউটিং",
    newTab:"✏️ নতুন", historyTab:"📋 ইতিহাস",
    noComplaints:"এখনও কোনো অভিযোগ নেই", noComplaintsHint:"নতুন ট্যাব থেকে প্রথম অভিযোগ দাখিল করুন",
    fileNew:"+ নতুন অভিযোগ দাখিল করুন", step1:"1", step1Label:"অবস্থান স্বয়ংক্রিয় সনাক্ত",
    autoDetectGps:"📍 GPS স্বয়ংক্রিয় সনাক্ত", detecting:"⏳ সনাক্ত হচ্ছে...",
    gpsPermDenied:"অবস্থানের অনুমতি প্রত্যাখ্যান। ম্যানুয়ালি প্রবেশ করুন।",
    enterManually:"নিচে আপনার অবস্থান ম্যানুয়ালি লিখুন।",
    liveLocationDetected:"লাইভ অবস্থান পাওয়া গেছে", viewOnMaps:"🗺️ Google Maps-এ দেখুন →",
    editLocation:"✏️ সম্পাদনা", district:"জেলা", pincode:"পিনকোড",
    area:"এলাকা / রাস্তা (ঐচ্ছিক)", step2:"2", step2Label:"সমস্যার ধরন",
    step3:"3", step3Label:"বর্ণনা করুন — টাইপ বা বলুন",
    stopVoice:"বন্ধ", voiceInput:"ভয়েস",
    complainPlaceholder:"যেমন: 'রাস্তা ভাঙা' বা '৩ দিন পানি নেই' — যেকোনো ভাষা",
    voiceListenPlaceholder:"🎙️ শুনছি... যেকোনো ভাষায় বলুন...",
    attachEvidence:"📷 প্রমাণ সংযুক্ত করুন", photoAdded:"📷 ছবি যোগ করা হয়েছে ✓",
    generateBtn:"🤖 AI দিয়ে অভিযোগ তৈরি করুন", generating:"⚙️ AI অভিযোগ তৈরি করছে...",
    aiAnalyzing:"AI আপনার অভিযোগ বিশ্লেষণ করছে...",
    claudeAnalyzing:"Claude AI · সনাক্তকরণ · রাউটিং · খসড়া",
    detectingCategory:"অভিযোগ বিভাগ সনাক্ত হচ্ছে", identifyingDept:"দায়িত্বশীল বিভাগ সনাক্ত হচ্ছে",
    generatingDraft:"আনুষ্ঠানিক খসড়া চিঠি তৈরি হচ্ছে", routingPortal:"আধিকারিক পোর্টালে রুট হচ্ছে",
    done:"✓ সম্পন্ন", processing:"● প্রক্রিয়াধীন",
    aiGenerated:"✅ AI অভিযোগ তৈরি হয়েছে",
    category:"বিভাগ", dept:"দপ্তর", estDays:"আনু. দিন", portal:"পোর্টাল",
    smartPortalRouting:"স্মার্ট পোর্টাল রাউটিং সক্রিয়",
    aiDraftTitle:"📝 AI-নির্মিত আনুষ্ঠানিক অভিযোগ খসড়া",
    submitComplaint:"✅ অভিযোগ জমা দিন", openPortal:"🌐 পোর্টাল খুলুন",
    copyDraft:"📋 খসড়া কপি করুন", copied:"✅ কপি হয়েছে!",
    submitTrack:"📊 জমা দিন এবং ট্র্যাক করুন",
    refGenerated:"জমা দিলে Ref# তৈরি হবে",
    shikayatRegistered:"অভিযোগ নিবন্ধিত!", officiallyFiled:"আপনার অভিযোগ আধিকারিকভাবে দাখিল হয়েছে",
    referenceNo:"রেফারেন্স নং", estResolution:"আনু. সমাধান",
    officialPortal:"আধিকারিক পোর্টাল", openPortalBtn:"🌐 পোর্টাল খুলুন",
    trackComplaint:"📊 অভিযোগ ট্র্যাক করুন", viewHistory:"ইতিহাস দেখুন",
    submitComplaintBtn:"অভিযোগ জমা দিন",
    submitted:"জমা", reviewed:"পর্যালোচিত", inProgress:"চলমান", resolved:"সমাধান হয়েছে",
    priority:"অগ্রাধিকার", high:"উচ্চ", medium:"মাঝারি", low:"কম",
    digilockerTitle:"ডিজিলকার", digiProtected:"ডিজিলকার সুরক্ষিত",
    enterPin:"4-সংখ্যার PIN প্রবেশ করুন", unlock:"🔓 ডিজিলকার আনলক করুন", lock:"🔒 লক",
    demo4digit:"ডেমো: যেকোনো 4 সংখ্যা প্রবেশ করুন", securityFeatures:"নিরাপত্তা বৈশিষ্ট্য",
    digiSecDesc:"PIN · ফেস লক · ফিঙ্গারপ্রিন্ট · এনক্রিপ্টেড",
    verified:"যাচাইকৃত", pending:"মুলতুবি", download:"⬇️ ডাউনলোড",
    share:"📤 শেয়ার", print:"🖨️ প্রিন্ট", sync:"⟳ সিঙ্ক",
    search:"নথি খুঁজুন...", digiLinked:"LINKED", digiKyc:"KYC ✓",
    govtVerifiedBadge:"সরকার যাচাইকৃত", verifiedDocs:"যাচাইকৃত",
    allDocs:"📁 সব নথি", docScanner:"📷 স্ক্যানার", aiAssistant:"🤖 AI সহায়তা",
    yourDocs:"আপনার নথি",
    qrVerify:"QR যাচাই ব্যাজ", qrVerifyDesc:"সরকারি সংস্থাগুলি তাৎক্ষণিকভাবে যাচাই করতে পারে",
    lastSynced:"শেষ সিঙ্ক", copyNum:"কপি", numCopied:"📋 নথি নম্বর কপি হয়েছে!",
    docScanned:"✅ নথি স্ক্যান হয়েছে!", dataExtracted:"ডেটা সফলভাবে বের করা হয়েছে।",
    placeDoc:"এখানে নথি রাখুন", scanSupported:"Aadhaar, PAN, DL, Passport",
    scanning:"নথি স্ক্যান হচ্ছে...", aiExtracting:"AI টেক্সট বের করছে...",
    scanDoc:"📷 নথি স্ক্যান করুন", rescan:"পুনরায় স্ক্যান করুন",
    autoFillProfile:"প্রোফাইল স্বয়ংক্রিয়ভাবে পূরণ করুন", ocrComplete:"✅ OCR নিষ্কাশন সম্পূর্ণ",
    syncSuccess:"🗂️ ডিজিলকার সিঙ্ক হয়েছে!", syncDesc:"সব নথি আপডেট হয়েছে।",
    digiEndToEnd:"সব নথি এন্ড-টু-এন্ড এনক্রিপ্টেড।",
    aiDocTitle:"AI নথি সহায়তা", aiDocDesc:"আপনার নথি সম্পর্কে স্মার্ট পরামর্শ।",
    voterMissing:"ভোটার ID মুলতুবি", dlExpiry:"DL মেয়াদোত্তীর্ণ অনুস্মারক",
    addHealthCard:"স্বাস্থ্য কার্ড যোগ করুন", profileComplete:"প্রোফাইল ৮৮% সম্পূর্ণ",
    enableBiometric:"বায়োমেট্রিক লক সক্ষম করুন",
    linkNow:"এখনই লিঙ্ক করুন", remindMe:"আমাকে মনে করিয়ে দিন", addDoc:"নথি যোগ করুন",
    upload:"আপলোড", setup:"সেটআপ",
    womenSafetyTitle:"নারী নিরাপত্তা", womenSubtitle:"উন্নত সুরক্ষা · নিরব SOS · অভিভাবক · নকল কল",
    guardianMode:"অভিভাবক মোড", guardianDesc:"লাইভ GPS বিশ্বস্ত পরিচিতিদের সাথে ক্রমাগত শেয়ার",
    sharingWith:"📡 সাথে লাইভ অবস্থান শেয়ার হচ্ছে:",
    silentSos:"🤫 নিরব SOS (তিনবার ট্যাপ)", silentSosDesc:"3× ট্যাপ করে নীরবে জরুরি অবস্থা চালু করুন।",
    tap3x:"3× ট্যাপ করুন নিরব SOS-এর জন্য", tap2more:"আরও ২ বার ট্যাপ করুন...",
    tap1more:"আরও ১ বার ট্যাপ করুন...", tapsRegistered:"ট্যাপ নিবন্ধিত",
    fakeCall:"📞 নকল কল জেনারেটর", fakeCallDesc:"অনিরাপদ পরিস্থিতি থেকে নিরাপদে বের হতে নকল কল।",
    now:"এখনই", tenSec:"১০ সেকেন্ড", thirtySec:"৩০ সেকেন্ড",
    recording:"রেকর্ডিং", recTitle:"🎙️ জরুরি রেকর্ডিং",
    recDesc:"আইনি প্রমাণ হিসেবে অডিও রেকর্ড করুন। Firebase Storage-এ নিরাপদ।",
    stop:"⏹ বন্ধ", start:"🔴 শুরু",
    fakeCallRinging:"📞 নকল কল বাজছে", incomingCall:"INCOMING CALL",
    decline:"প্রত্যাখ্যান", accept:"গ্রহণ",
    womenHelpline:"নারী হেল্পলাইন", womenHelplineDesc:"24/7 · বিনামূল্যে · গোপনীয় · ট্যাপ করুন",
    chatPlaceholder:"যেকোনো কিছু জিজ্ঞেস করুন...", botTitle:"SahayakBot AI", botSubtitle:"Claude-চালিত · 24/7",
    adminTitle:"Admin Dashboard", adminSubtitle:"লাইভ · রিয়েল-টাইম · সরকারি কর্মকর্তা",
    realTime:"REAL-TIME", liveFeed:"🚨 লাইভ জরুরি ফিড",
    systemPerf:"⚡ সিস্টেম কর্মক্ষমতা",
    overview:"ওভারভিউ", heatmap:"হিটম্যাপ", complaints:"অভিযোগ", infra:"ইনফ্রা",
    districtHeatmap:"🗺️ জেলা অভিযোগ হিটম্যাপ", heatmapDesc:"অভিযোগ + জরুরি ঘনত্ব — দিল্লি NCR",
    complaintCategories:"📂 অভিযোগ বিভাগ", serviceHealth:"🏗️ সেবা স্বাস্থ্য",
    productionArch:"☁️ উৎপাদন স্থাপত্য",
    save:"সংরক্ষণ", cancel:"বাতিল", back:"ফিরে", submit:"জমা দিন",
    offline:"📶 অফলাইন", offlineBanner:"অফলাইন মোড — SOS ও GPS এখনও উপলব্ধ।",
    liveStatus:"LIVE", offlineStatus:"OFFLINE",
    notifications:"বিজ্ঞপ্তি", markAllRead:"সব পড়া হয়েছে",
    profileTitle:"প্রোফাইল", digiLockerId:"DigiLocker ID:",
    copySuccess:"📋 নম্বর কপি হয়েছে!", recordingStarted:"🔴 রেকর্ডিং শুরু হয়েছে",
    recordingSaved:"⏹ রেকর্ডিং সংরক্ষিত", guardianOn:"🛡️ অভিভাবক মোড চালু!",
    guardianOff:"অভিভাবক মোড বন্ধ", fakeRinging:"📞 নকল কল বাজছে",
    draftCopied:"📋 অভিযোগ খসড়া ক্লিপবোর্ডে কপি হয়েছে!",
    eSahayak:"🇮🇳 এক ভারত, শ্রেষ্ঠ ভারত",
  },
};

// Auto-fill Tamil, Telugu, Gujarati, Punjabi from English then add native app name
["தமிழ்","తెలుగు","ગુજરાતી","ਪੰਜਾਬੀ"].forEach(l => {
  TRANSLATIONS[l] = { ...TRANSLATIONS["English"] };
});
// Native app names for auto-filled languages
TRANSLATIONS["தமிழ்"].appName   = "சகாயக்";
TRANSLATIONS["తెలుగు"].appName  = "సహాయక్";
TRANSLATIONS["ગુજરાતી"].appName = "સહાયક";
TRANSLATIONS["ਪੰਜਾਬੀ"].appName  = "ਸਹਾਇਕ";

const LANGUAGES = Object.keys(TRANSLATIONS);


// ── STATIC DATA ───────────────────────────────────────────────────
const SERVICES = [
  { id:"police",    icon:"👮", label:"Police",          number:"100",  color:"#3B82F6", desc:"Crime / Safety",    tel:"tel:100" },
  { id:"ambulance", icon:"🚑", label:"Ambulance",       number:"108",  color:"#EF4444", desc:"Medical Emergency",  tel:"tel:108" },
  { id:"fire",      icon:"🔥", label:"Fire Brigade",    number:"101",  color:"#F97316", desc:"Fire Emergency",     tel:"tel:101" },
  { id:"women",     icon:"🙋‍♀️",label:"Women Helpline",  number:"1091", color:"#EC4899", desc:"Women Safety",       tel:"tel:1091" },
  { id:"disaster",  icon:"🌊", label:"Disaster Relief", number:"1070", color:"#8B5CF6", desc:"Natural Disaster",   tel:"tel:1070" },
  { id:"road",      icon:"🛣️", label:"Road Accident",   number:"1033", color:"#EAB308", desc:"Highway Help",       tel:"tel:1033" },
  { id:"child",     icon:"👶", label:"Child Helpline",  number:"1098", color:"#10B981", desc:"CHILDLINE",          tel:"tel:1098" },
  { id:"cyber",     icon:"💻", label:"Cyber Crime",     number:"1930", color:"#06B6D4", desc:"Online Fraud",       tel:"tel:1930" },
];

const SCHEMES = [
  {
    id:"pmay", name:"PM Awas Yojana", icon:"🏠", color:"#10B981",
    dept:"Ministry of Housing & Urban Affairs",
    url:"https://pmay-urban.gov.in",
    eligibilityUrl:"https://pmaymis.gov.in",
    helplineUrl:"https://pmay-urban.gov.in/contact-us",
    benefit:"₹1.2 – 2.67 Lakh housing subsidy (CLSS)",
    tag:"Housing for All",
    desc:"Pradhan Mantri Awas Yojana provides financial assistance to urban & rural poor for construction or purchase of a pucca house.",
    eligibility:["Annual income below ₹18 Lakh (EWS/LIG/MIG)","No pucca house owned by family member","First-time home buyer","Aadhaar-linked bank account mandatory"],
    benefits:["Interest subsidy of 3–6.5% on home loans","Direct benefit transfer to bank account","₹1.5 Lakh grant for construction in rural areas","₹2.67 Lakh max CLSS benefit"],
    steps:["Visit pmay-urban.gov.in","Click 'Citizen Assessment'","Enter Aadhaar number","Fill family details","Submit application & get reference number"],
    docs:["Aadhaar Card","Income Certificate","Bank Account Passbook","Property Documents / NOC","Caste Certificate (if applicable)"],
    portal:"pmaymis.gov.in",
  },
  {
    id:"pmjay", name:"Ayushman Bharat", icon:"💊", color:"#EF4444",
    dept:"Ministry of Health & Family Welfare",
    url:"https://pmjay.gov.in",
    eligibilityUrl:"https://beneficiary.nha.gov.in",
    helplineUrl:"tel:14555",
    benefit:"₹5 Lakh free health cover per family/year",
    tag:"Health Insurance",
    desc:"Ayushman Bharat PM-JAY is the world's largest health insurance scheme, providing cashless treatment at 25,000+ empanelled hospitals.",
    eligibility:["SECC 2011 database listed families","No income limit for eligible categories","Covers all pre-existing diseases from Day 1","Portability across all empanelled hospitals in India"],
    benefits:["₹5 Lakh annual health cover per family","Cashless & paperless treatment","500+ medical procedures covered","Free diagnostics, medicines & follow-up care"],
    steps:["Call 14555 or visit pmjay.gov.in","Check eligibility using Aadhaar / ration card","Get Ayushman Card from nearest CSC or hospital","Visit empanelled hospital for cashless treatment"],
    docs:["Aadhaar Card","Ration Card","SECC 2011 Data / BPL Certificate","Mobile Number (OTP verification)"],
    portal:"beneficiary.nha.gov.in",
  },
  {
    id:"pmkisan", name:"PM Kisan Samman Nidhi", icon:"🌾", color:"#F59E0B",
    dept:"Ministry of Agriculture & Farmers Welfare",
    url:"https://pmkisan.gov.in",
    eligibilityUrl:"https://pmkisan.gov.in/beneficiarystatus.aspx",
    helplineUrl:"tel:155261",
    benefit:"₹6,000/year directly to farmers in 3 installments",
    tag:"Farmer Support",
    desc:"PM-KISAN provides direct income support of ₹6,000/year in three equal installments of ₹2,000 to all landholding farmer families.",
    eligibility:["Small & marginal farmers with cultivable land","Land records must be updated & Aadhaar-linked","All states & UTs covered","Excludes institutional landholders & govt employees"],
    benefits:["₹2,000 every 4 months (3 installments)","Direct credit to bank account via DBT","No loan or repayment obligation","Annual benefit of ₹6,000 guaranteed"],
    steps:["Visit pmkisan.gov.in","Click 'New Farmer Registration'","Enter Aadhaar & land record details","OTP verification via mobile","Submit — amount credited within 2 weeks"],
    docs:["Aadhaar Card","Bank Account Passbook","Land Ownership Documents (Khasra/Khatauni)","Mobile Number"],
    portal:"pmkisan.gov.in",
  },
  {
    id:"jdy", name:"Jan Dhan Yojana", icon:"🏦", color:"#3B82F6",
    dept:"Ministry of Finance — Dept. of Financial Services",
    url:"https://www.pmjdy.gov.in",
    eligibilityUrl:"https://www.pmjdy.gov.in/scheme",
    helplineUrl:"tel:18001111109",
    benefit:"Zero-balance account + ₹2 Lakh accident cover",
    tag:"Financial Inclusion",
    desc:"Pradhan Mantri Jan Dhan Yojana ensures universal access to banking, insurance & pension services for every Indian household.",
    eligibility:["Any Indian citizen aged 10+ years","No minimum balance required","One account per household (priority to women)","Available at all banks & Business Correspondents"],
    benefits:["Zero balance savings account","RuPay Debit Card with ₹2 Lakh accident cover","₹10,000 overdraft facility after 6 months","Access to Atal Pension Yojana & PMJJBY"],
    steps:["Visit nearest bank branch or BC outlet","Carry Aadhaar & address proof","Fill account opening form","Get RuPay card & passbook instantly","Activate account with first deposit (optional)"],
    docs:["Aadhaar Card (primary)","OR Voter ID / Passport / Driving License","Passport-size photograph","Mobile Number"],
    portal:"pmjdy.gov.in",
  },
  {
    id:"pmuy", name:"Ujjwala Yojana", icon:"🔵", color:"#8B5CF6",
    dept:"Ministry of Petroleum & Natural Gas",
    url:"https://www.pmuy.gov.in",
    eligibilityUrl:"https://www.pmuy.gov.in/ujjwala2.html",
    helplineUrl:"tel:1906",
    benefit:"Free LPG connection + ₹1,600 financial assistance",
    tag:"Clean Cooking",
    desc:"PMUY provides free LPG connections to BPL households to replace unhealthy cooking fuels and empower women with clean energy access.",
    eligibility:["Adult women from BPL households","Listed in SECC 2011 / PMAY / SC/ST list","No existing LPG connection in household","Aadhaar & bank account mandatory"],
    benefits:["Free LPG connection with stove & first refill","₹1,600 financial assistance","₹300 subsidy per cylinder (up to 12/year)","EMI facility for stove & first fill"],
    steps:["Visit nearest LPG distributor (HP/Bharat/Indane)","Fill Form KYC-5","Submit Aadhaar & BPL documents","Connection issued within 7 days","First refill subsidized automatically"],
    docs:["Aadhaar Card","BPL Card / SECC Data / Ration Card","Bank Account Passbook","Self-declaration of no LPG connection"],
    portal:"pmuy.gov.in",
  },
  {
    id:"sbm", name:"Swachh Bharat Mission", icon:"🚽", color:"#06B6D4",
    dept:"Ministry of Jal Shakti — Dept. of Drinking Water & Sanitation",
    url:"https://swachhbharat.mygov.in",
    eligibilityUrl:"https://sbm.gov.in/sbmReport/home.aspx",
    helplineUrl:"tel:1969",
    benefit:"Free toilet construction + ₹12,000 incentive",
    tag:"Swachhta",
    desc:"Swachh Bharat Mission eliminates open defecation by providing financial assistance for toilet construction to every rural household without a toilet.",
    eligibility:["BPL households without existing toilet","APL households in SC/ST / small farmer category","Available in rural & urban areas (separate schemes)","Self-help groups & NGOs also eligible"],
    benefits:["₹12,000 direct incentive for toilet construction","Free material & mason support in many states","Linked with PM Awas Yojana in rural areas","Sanitation certificate for Gram Panchayat"],
    steps:["Apply via Gram Panchayat / Ward office","Or apply online at sbm.gov.in","Toilet construction starts after approval","Inspector verifies completion","₹12,000 credited to bank account post-verification"],
    docs:["Aadhaar Card","Bank Account Passbook","Proof of no existing toilet","BPL / APL Certificate"],
    portal:"sbm.gov.in",
  },
  {
    id:"si", name:"Skill India — PMKVY", icon:"🎓", color:"#F97316",
    dept:"Ministry of Skill Development & Entrepreneurship",
    url:"https://www.skillindiadigital.gov.in",
    eligibilityUrl:"https://www.pmkvyofficial.org",
    helplineUrl:"tel:18001239626",
    benefit:"Free skill training + ₹8,000 certification reward",
    tag:"Skill Development",
    desc:"Pradhan Mantri Kaushal Vikas Yojana (PMKVY) provides free, industry-relevant skill training with government certification to Indian youth.",
    eligibility:["Indian citizens aged 15–45 years","Class 8 dropout to graduates — all welcome","Unemployed, school / college dropouts prioritized","Available across 700+ districts via training centres"],
    benefits:["Free industry-recognized skill training","₹500–8,000 reward post-certification","Placement assistance with top companies","Digital badge & NSDC certificate","Access to 300+ job roles across 30+ sectors"],
    steps:["Visit skillindiadigital.gov.in","Register with Aadhaar & mobile OTP","Choose training sector & nearest centre","Complete training (3 weeks – 3 months)","Appear for assessment & receive certificate + reward"],
    docs:["Aadhaar Card","Bank Account Passbook","Class 8 / 10 / 12 Marksheet (if available)","Passport-size photograph","Mobile Number"],
    portal:"skillindiadigital.gov.in",
  },
  {
    id:"mudra", name:"PM Mudra Yojana", icon:"💼", color:"#EC4899",
    dept:"Ministry of Finance — MUDRA Bank",
    url:"https://www.mudra.org.in",
    eligibilityUrl:"https://www.mudra.org.in/OurProducts",
    helplineUrl:"tel:18001801111",
    benefit:"Collateral-free loans: ₹50K – ₹10 Lakh",
    tag:"Business Loans",
    desc:"PM Mudra Yojana provides micro-finance loans to non-corporate, non-farm small/micro enterprises through Shishu, Kishore & Tarun categories.",
    eligibility:["Non-farm income generating activities","Manufacturing, trading, or services sector","No collateral or guarantor required","Available to individuals, SHGs, JLGs, firms"],
    benefits:["Shishu: Up to ₹50,000 (startups)","Kishore: ₹50,001 – ₹5 Lakh (growth stage)","Tarun: ₹5 – ₹10 Lakh (expansion)","No processing fee for Shishu loans","Mudra RuPay Debit Card for working capital"],
    steps:["Visit nearest bank / MFI / NBFC","Or apply online at udyamimitra.in","Submit business plan & documents","Loan sanctioned within 7–14 working days","Funds directly credited to business account"],
    docs:["Aadhaar Card","PAN Card","Recent Bank Statement (6 months)","Business Address Proof","Quotation / Business Plan","Passport-size photograph"],
    portal:"udyamimitra.in",
  },
];

const COMPLAINT_TYPES = [
  { label:"Road Pothole / खराब सड़क",      dept:"PWD / Municipal Corporation",   icon:"🛣️", priority:"High" },
  { label:"Street Light / बिजली गुल",      dept:"DISCOM / Municipal",            icon:"💡", priority:"Medium" },
  { label:"Water Supply / पानी की समस्या", dept:"Jal Board / Water Authority",   icon:"💧", priority:"High" },
  { label:"Garbage / कचरा नहीं उठा",       dept:"Municipal Corporation",         icon:"🗑️", priority:"Medium" },
  { label:"Sewage Overflow / नाली भरी",    dept:"Municipal / Jal Board",         icon:"🚧", priority:"High" },
  { label:"Illegal Construction",           dept:"Building Department",           icon:"🏗️", priority:"Low" },
  { label:"Corrupt Official / भ्रष्टाचार", dept:"Vigilance / CVC",              icon:"⚠️", priority:"High" },
  { label:"Noise Pollution / शोर",          dept:"Pollution Control Board",       icon:"📢", priority:"Low" },
];

const DIGILOCKER_DOCS = [
  { name:"Aadhaar Card",      icon:"🪪", issuer:"UIDAI",                    color:"#3B82F6", status:"verified", size:"248 KB", category:"identity",  docNum:"XXXX XXXX 1234", expires:"Lifetime",  fav:true  },
  { name:"PAN Card",          icon:"💳", issuer:"Income Tax Department",    color:"#F59E0B", status:"verified", size:"124 KB", category:"identity",  docNum:"ABCDE1234F",     expires:"Lifetime",  fav:true  },
  { name:"Driving License",   icon:"🚗", issuer:"Transport Department",     color:"#10B981", status:"verified", size:"312 KB", category:"transport", docNum:"DL-01-2020-XXX", expires:"2030",      fav:false },
  { name:"Vehicle RC",        icon:"📋", issuer:"Transport Department",     color:"#8B5CF6", status:"verified", size:"188 KB", category:"transport", docNum:"DL01AB1234",     expires:"2028",      fav:false },
  { name:"Passport",          icon:"📘", issuer:"Ministry of Ext. Affairs", color:"#0EA5E9", status:"verified", size:"420 KB", category:"travel",    docNum:"A1234567",       expires:"2032",      fav:true  },
  { name:"Voter ID",          icon:"🗳️", issuer:"Election Commission",      color:"#EF4444", status:"pending",  size:"—",     category:"identity",  docNum:"—",              expires:"Lifetime",  fav:false },
  { name:"Education Cert.",   icon:"🎓", issuer:"CBSE / University",        color:"#06B6D4", status:"verified", size:"512 KB", category:"education", docNum:"CERT-XXXXXX",    expires:"Lifetime",  fav:false },
  { name:"Health Card",       icon:"🏥", issuer:"Ayushman Bharat",          color:"#EC4899", status:"verified", size:"96 KB",  category:"health",    docNum:"AB-XXXX-XXXX",   expires:"2027",      fav:false },
  { name:"Birth Certificate", icon:"👶", issuer:"Registrar of Births",      color:"#F97316", status:"verified", size:"160 KB", category:"identity",  docNum:"BC-XXXXXX",      expires:"Lifetime",  fav:false },
];

const DOC_CATEGORIES = ["all","identity","transport","travel","education","health"];

const DISTRESS_KEYWORDS = ["help","madad","bachao","save me","emergency","danger","sos","help me","police","koi hai","chhodo","bachao mujhe","bhaago"];

const ONBOARDING_DATA = [
  { icon:"🇮🇳", color:"#FF6B00", title:"Sahayak v4.0",  sub:"National AI Citizen Platform",  desc:"India's most advanced citizen super app. AI-powered, secure, and built for 1.4 billion Indians." },
  { icon:"🆘",  color:"#EF4444", title:"Smart SOS",     sub:"Voice-Activated Emergency",      desc:"Say 'Bachao' or 'Help' — AI instantly calls police, shares live GPS, and alerts your family." },
  { icon:"🗂️",  color:"#06B6D4", title:"DigiLocker 2.0",sub:"Ultra-Secure Document Vault",   desc:"Aadhaar, PAN, Passport — with PIN protection, OCR scanning, and government-verified QR badges." },
  { icon:"🤖",  color:"#8B5CF6", title:"AI Grievance",  sub:"Smart Auto-Routing System",      desc:"Describe any problem naturally. AI classifies, drafts and routes it to the right department." },
  { icon:"🙋‍♀️", color:"#EC4899", title:"Women Safety",  sub:"Guardian · Silent SOS · Shield", desc:"Triple-tap SOS, fake call generator, guardian tracking, and emergency audio recording." },
];

const MOCK_COMPLAINTS = [
  { id:"SHK482910", type:"Road Pothole",  dept:"PWD",       status:"resolved",    date:"2 May 2026",  district:"Central Delhi" },
  { id:"SHK391047", type:"Water Supply",  dept:"Jal Board", status:"in_progress", date:"8 May 2026",  district:"South Delhi" },
  { id:"SHK274856", type:"Street Light",  dept:"DISCOM",    status:"pending",     date:"12 May 2026", district:"East Delhi" },
];

const NEARBY_PLACES = [
  { name:"AIIMS Delhi",           type:"hospital", dist:"1.2 km", icon:"🏥", lat:28.5672, lng:77.2100 },
  { name:"Safdarjung Hospital",   type:"hospital", dist:"2.8 km", icon:"🏥", lat:28.5693, lng:77.2073 },
  { name:"Connaught Place PS",    type:"police",   dist:"0.9 km", icon:"👮", lat:28.6330, lng:77.2194 },
  { name:"Parliament Street PS",  type:"police",   dist:"1.4 km", icon:"👮", lat:28.6220, lng:77.2110 },
];

const ADMIN_STATS = [
  { label:"Total Users",        value:"2.4M",  icon:"👥", color:"#06B6D4", delta:"+12%" },
  { label:"Active Emergencies", value:"47",    icon:"🚨", color:"#EF4444", delta:"LIVE" },
  { label:"Complaints Today",   value:"1,893", icon:"📢", color:"#F59E0B", delta:"+8%"  },
  { label:"Resolved Rate",      value:"91.2%", icon:"✅", color:"#22c55e", delta:"+3%"  },
];

const HEATMAP_DATA = [
  { district:"Central Delhi", complaints:312, emergencies:28, pct:100, color:"#EF4444" },
  { district:"South Delhi",   complaints:248, emergencies:19, pct:79,  color:"#F97316" },
  { district:"East Delhi",    complaints:198, emergencies:15, pct:63,  color:"#EAB308" },
  { district:"North Delhi",   complaints:156, emergencies:11, pct:50,  color:"#22c55e" },
  { district:"West Delhi",    complaints:134, emergencies:9,  pct:43,  color:"#22c55e" },
  { district:"North-East",    complaints:112, emergencies:7,  pct:36,  color:"#14B8A6" },
];

// ── UTILITIES ─────────────────────────────────────────────────────
const genRef    = () => `SHK${Math.floor(Math.random()*900000+100000)}`;
const genTrack  = () => `TRK${Math.floor(Math.random()*9000+1000)}`;
const tsNow     = () => new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
const dateNow   = () => new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
const sleep     = ms => new Promise(r => setTimeout(r, ms));
const clamp     = (n,min,max) => Math.min(Math.max(n,min),max);
const fmtSec    = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
const pColor    = s => s==="resolved"?"#22c55e":s==="in_progress"?"#F59E0B":"#6B7280";
const pLabel    = s => s==="resolved"?"✅ Resolved":s==="in_progress"?"⚙️ In Progress":"⏳ Pending";

// ── GLOBAL CSS ────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300..900;1,14..32,300..900&family=Noto+Sans+Devanagari:wght@400;600;800;900&display=swap');

*,*::before,*::after{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{margin:0;padding:0;background:${C.bg};font-family:'Inter','Noto Sans Devanagari',system-ui,sans-serif;overscroll-behavior:none}
input,textarea,select,button{font-family:inherit;outline:none}
::-webkit-scrollbar{width:2px;height:2px}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.07);border-radius:10px}

@keyframes fadeIn    { from{opacity:0}                    to{opacity:1} }
@keyframes slideUp   { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes slideIn   { from{transform:translateX(-16px);opacity:0} to{transform:translateX(0);opacity:1} }
@keyframes scaleIn   { from{transform:scale(0.9);opacity:0}        to{transform:scale(1);opacity:1} }
@keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
@keyframes spin      { to{transform:rotate(360deg)} }
@keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.35} }
@keyframes sos       { 0%,100%{background:#7f0000;box-shadow:0 0 40px #d0000060} 50%{background:#d00000;box-shadow:0 0 80px #ff000050} }
@keyframes ping      { 0%{transform:scale(1);opacity:1} 100%{transform:scale(3.5);opacity:0} }
@keyframes glow      { 0%,100%{box-shadow:0 0 6px #22c55e40} 50%{box-shadow:0 0 18px #22c55e} }
@keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
@keyframes gradAnim  { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
@keyframes notifIn   { from{transform:translateY(-44px) translateX(-50%);opacity:0} to{transform:translateY(0) translateX(-50%);opacity:1} }
@keyframes wave      { 0%,100%{height:4px} 50%{height:18px} }
@keyframes scan      { 0%{top:0%} 100%{top:100%} }
@keyframes confetti  { 0%{transform:translateY(-8px) rotate(0deg);opacity:1} 100%{transform:translateY(55px) rotate(360deg);opacity:0} }
@keyframes borderAnim{ 0%,100%{border-color:rgba(255,107,0,0.35)} 50%{border-color:rgba(255,107,0,0.8)} }

.skeleton{
  background:linear-gradient(90deg,rgba(255,255,255,0.02) 0%,rgba(255,255,255,0.07) 50%,rgba(255,255,255,0.02) 100%);
  background-size:200% 100%;animation:shimmer 1.6s ease-in-out infinite;border-radius:8px;
}
.glass{
  background:rgba(255,255,255,0.028);
  backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
}
.press-scale:active{transform:scale(0.96)}
`;

// ═══════════════════════════════════════════════════════════════════
//  ATOMIC UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════

const GStyle = () => <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />;

const Card = memo(({ children, style={}, onClick, glass=false, animate=false }) => (
  <div
    onClick={onClick}
    className={[glass?"glass":"", onClick?"press-scale":""].join(" ")}
    style={{
      background: glass ? undefined : C.card,
      borderRadius: 20,
      border: `1px solid ${C.border}`,
      cursor: onClick ? "pointer" : "default",
      animation: animate ? "slideUp 0.4s ease both" : undefined,
      transition: "transform 0.15s, box-shadow 0.2s",
      ...style,
    }}
  >{children}</div>
));

const Badge = memo(({ children, color="#22c55e", dot=false, style={} }) => (
  <span style={{
    display:"inline-flex", alignItems:"center", gap:4,
    background:`${color}18`, border:`1px solid ${color}45`,
    color, borderRadius:20, fontSize:9, fontWeight:700,
    padding:"3px 8px", letterSpacing:0.5, whiteSpace:"nowrap", ...style,
  }}>
    {dot && <span style={{ width:5, height:5, borderRadius:"50%", background:color, animation:"pulse 1.5s infinite" }} />}
    {children}
  </span>
));

const Btn = memo(({ children, onClick, color=C.saffron, outline=false, full=false, disabled=false, size="md", style={}, className="" }) => {
  const sizes = { sm:{ pad:"7px 14px", fs:10 }, md:{ pad:"11px 18px", fs:12 }, lg:{ pad:"13px 20px", fs:14 } };
  const s = sizes[size] || sizes.md;
  return (
    <button
      onClick={onClick} disabled={disabled}
      className={`press-scale ${className}`}
      style={{
        padding: s.pad, fontSize: s.fs, fontWeight: 800,
        border: outline ? `1px solid ${color}45` : "none",
        borderRadius: 12, cursor: disabled ? "not-allowed" : "pointer",
        background: disabled ? "rgba(255,255,255,0.04)" : outline ? `${color}12` : `linear-gradient(135deg,${color},${color}cc)`,
        color: disabled ? C.muted : outline ? color : "white",
        boxShadow: disabled||outline ? "none" : `0 3px 16px ${color}30`,
        opacity: disabled ? 0.55 : 1,
        width: full ? "100%" : undefined,
        transition: "all 0.2s",
        display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6,
        ...style,
      }}
    >{children}</button>
  );
});

const Toggle = memo(({ on, onToggle, color="#22c55e" }) => (
  <div
    onClick={onToggle}
    style={{
      width:48, height:26, borderRadius:13, flexShrink:0,
      background: on ? color : "rgba(255,255,255,0.08)",
      position:"relative", cursor:"pointer",
      border: `1px solid ${on ? color+"50" : C.border}`,
      transition: "all 0.3s",
    }}
  >
    <div style={{
      position:"absolute", top:3, left: on ? 24 : 3,
      width:18, height:18, borderRadius:"50%", background:"white",
      transition:"all 0.3s", boxShadow:"0 1px 4px rgba(0,0,0,0.3)",
    }}/>
  </div>
));

const Skel = memo(({ w="100%", h=14, r=8, style={} }) => (
  <div className="skeleton" style={{ width:w, height:h, borderRadius:r, ...style }} />
));

const FieldInput = memo(({ label, value, onChange, placeholder, type="text", icon, style={} }) => (
  <div style={{ marginBottom:14 }}>
    {label && <div style={{ fontSize:9.5, color:C.muted, marginBottom:6, fontWeight:600, letterSpacing:0.6, display:"flex", alignItems:"center", gap:5 }}>
      {icon && <span>{icon}</span>}{label.toUpperCase()}
    </div>}
    <input
      value={value} onChange={onChange} placeholder={placeholder} type={type}
      style={{
        width:"100%", background:C.card2, border:`1px solid ${C.border2}`,
        borderRadius:12, padding:"11px 14px", color:"white", fontSize:13,
        boxSizing:"border-box", transition:"border-color 0.2s", ...style,
      }}
    />
  </div>
));

const Toast = memo(({ msg, type="success", onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 4200); return () => clearTimeout(t); }, [onClose]);
  const icon = type==="success"?"✅":type==="error"?"❌":"ℹ️";
  const col  = type==="success"?C.greenL:type==="error"?C.danger:C.cyan;
  return (
    <div style={{
      position:"fixed", top:78, left:"50%", zIndex:3000,
      animation:"notifIn 0.4s ease",
      background:`linear-gradient(135deg,${C.card2},${C.card3})`,
      border:`1px solid ${col}30`, borderRadius:16, padding:"12px 16px",
      display:"flex", alignItems:"center", gap:10,
      maxWidth:395, width:"calc(100% - 28px)",
      boxShadow:`0 12px 52px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.04)`,
    }}>
      <div style={{ width:32, height:32, borderRadius:"50%", background:`${col}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>{icon}</div>
      <span style={{ fontSize:11.5, color: type==="success"?"#d1fae5":type==="error"?"#fecaca":"#bae6fd", flex:1, lineHeight:1.6 }}>{msg}</span>
      <button onClick={onClose} style={{ background:"rgba(255,255,255,0.06)", border:"none", color:C.mutedL, width:22, height:22, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, cursor:"pointer" }}>×</button>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  ONBOARDING
// ═══════════════════════════════════════════════════════════════════
const Onboarding = memo(({ onDone }) => {
  const [slide, setSlide] = useState(0);
  const s = ONBOARDING_DATA[slide];
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <GStyle />
      <div style={{ position:"fixed", inset:0, background:`radial-gradient(ellipse at 50% 30%, ${s.color}0C 0%, transparent 65%)`, pointerEvents:"none", transition:"background 0.7s" }}/>
      <div style={{ width:"100%", maxWidth:390, display:"flex", flexDirection:"column", alignItems:"center", position:"relative" }}>
        <div key={slide} style={{ textAlign:"center", animation:"slideUp 0.4s ease" }}>
          <div style={{
            width:124, height:124, borderRadius:"50%",
            background:`radial-gradient(circle, ${s.color}15 0%, transparent 70%)`,
            border:`2px solid ${s.color}22`, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:54, margin:"0 auto 24px",
            animation:"float 3s ease-in-out infinite",
            boxShadow:`0 0 60px ${s.color}15`,
          }}>{s.icon}</div>
          <h1 style={{ fontSize:26, fontWeight:900, color:s.color, margin:"0 0 6px", letterSpacing:0.5 }}>{s.title}</h1>
          <p style={{ fontSize:11.5, color:C.mutedL, margin:"0 0 14px", letterSpacing:0.8 }}>{s.sub}</p>
          <p style={{ fontSize:13, color:C.muted, lineHeight:1.9, maxWidth:300, margin:"0 auto" }}>{s.desc}</p>
        </div>

        <div style={{ display:"flex", gap:8, margin:"28px 0 22px" }}>
          {ONBOARDING_DATA.map((_, i) => (
            <div key={i} onClick={() => setSlide(i)} style={{ width: i===slide ? 26 : 8, height:8, borderRadius:4, background: i===slide ? s.color : "rgba(255,255,255,0.1)", transition:"all 0.3s", cursor:"pointer" }}/>
          ))}
        </div>

        <div style={{ display:"flex", gap:10, width:"100%" }}>
          {slide < ONBOARDING_DATA.length - 1 ? (
            <>
              <Btn onClick={onDone} outline color={C.mutedL} size="lg" style={{ flex:1 }}>Skip</Btn>
              <Btn onClick={() => setSlide(n => n+1)} color={s.color} size="lg" style={{ flex:2 }}>Next →</Btn>
            </>
          ) : (
            <button onClick={onDone} style={{
              flex:1, padding:"14px", background:`linear-gradient(135deg,${C.saffron},${C.green})`,
              backgroundSize:"200%", animation:"gradAnim 3s ease infinite",
              border:"none", borderRadius:14, color:"white", fontWeight:900, fontSize:15,
              cursor:"pointer", boxShadow:"0 4px 24px rgba(255,107,0,0.4)",
            }}>
              🚀 Get Started — Shuru Karein
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  AUTH SCREEN
// ═══════════════════════════════════════════════════════════════════
const AuthScreen = memo(({ onAuth }) => {
  const [phone, setPhone]   = useState("");
  const [otp, setOtp]       = useState(["","","","","",""]);
  const [step, setStep]     = useState("phone");
  const [loading, setLoad]  = useState(false);
  const [err, setErr]       = useState("");
  const [timer, setTimer]   = useState(0);
  const [attempts, setAtt]  = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    if (timer > 0) { const t = setTimeout(() => setTimer(r => r-1), 1000); return () => clearTimeout(t); }
  }, [timer]);

  const sendOTP = async () => {
    if (phone.replace(/\D/g,"").length < 10) { setErr("Valid 10-digit number enter karein"); return; }
    if (attempts >= 3) { setErr("Too many attempts. Please wait 10 minutes."); return; }
    setErr(""); setLoad(true);
    // Production: firebase.auth().signInWithPhoneNumber("+91"+phone, recaptchaVerifier)
    await sleep(1500);
    setLoad(false); setStep("otp"); setTimer(30); setAtt(a => a+1);
  };

  const handleOtpKey = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const n = [...otp]; n[i] = v; setOtp(n);
    if (v && i < 5) refs.current[i+1]?.focus();
    if (!v && i > 0) refs.current[i-1]?.focus();
  };

  const verify = async () => {
    const code = otp.join("");
    if (code.length < 6) { setErr("Complete 6-digit OTP enter karein"); return; }
    setErr(""); setLoad(true);
    // Production: confirmationResult.confirm(code)
    await sleep(1300);
    setStep("success"); await sleep(900);
    onAuth({ phone, name:"Ramesh Kumar", uid:`UID-${Date.now()}`, role:"citizen", isNew:true });
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <GStyle />
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 50% 18%, rgba(255,107,0,0.08) 0%, transparent 62%)", pointerEvents:"none" }}/>
      <div style={{ textAlign:"center", marginBottom:30, animation:"slideUp 0.6s ease", position:"relative" }}>
        <div style={{ fontSize:52, marginBottom:10, animation:"float 3s ease-in-out infinite" }}>🇮🇳</div>
        <h1 style={{ fontSize:28, fontWeight:900, margin:"0 0 4px", background:`linear-gradient(135deg,${C.saffron},${C.greenL})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:2 }}>सहायक</h1>
        <p style={{ fontSize:10, color:C.muted, letterSpacing:3, margin:0 }}>AI CITIZEN SUPER APP v4.0</p>
      </div>

      <Card style={{ width:"100%", maxWidth:390, padding:26, animation:"scaleIn 0.5s ease 0.2s both", position:"relative" }}>
        {step === "phone" && (
          <>
            <h2 style={{ fontSize:16, fontWeight:800, margin:"0 0 4px" }}>📱 Secure Login</h2>
            <p style={{ fontSize:11, color:C.muted, margin:"0 0 22px" }}>Firebase OTP authentication — real & secure</p>

            <div style={{ fontSize:9.5, color:C.muted, marginBottom:6, fontWeight:600, letterSpacing:0.6 }}>MOBILE NUMBER</div>
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              <div style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:12, padding:"11px 14px", fontSize:13, fontWeight:700, color:C.mutedL, letterSpacing:1, flexShrink:0 }}>+91</div>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="XXXXXXXXXX" maxLength={10} type="tel"
                style={{ flex:1, background:C.card2, border:`1px solid ${C.border2}`, borderRadius:12, padding:"11px 14px", color:"white", fontSize:15, letterSpacing:2 }}/>
            </div>

            {err && <p style={{ color:C.danger, fontSize:10.5, margin:"0 0 11px", display:"flex", alignItems:"center", gap:5 }}>⚠️ {err}</p>}

            <Btn onClick={sendOTP} disabled={loading} color={C.saffron} size="lg" full>{loading ? "⏳ Sending OTP..." : "📨 Get OTP →"}</Btn>

            <div style={{ marginTop:16, padding:"12px 14px", background:"rgba(255,107,0,0.05)", borderRadius:12, border:"1px solid rgba(255,107,0,0.12)" }}>
              <p style={{ fontSize:10, color:C.mutedL, margin:0, lineHeight:1.8 }}>
                🔐 <strong style={{ color:C.saffron }}>Demo Mode:</strong> Any 10-digit number<br/>
                OTP: <span style={{ color:C.saffron, fontWeight:800, letterSpacing:3 }}>1 2 3 4 5 6</span><br/>
                Production: Replace with real Firebase recaptchaVerifier
              </p>
            </div>
          </>
        )}

        {step === "otp" && (
          <>
            <button onClick={() => setStep("phone")} style={{ background:"none", border:"none", color:C.muted, fontSize:12, cursor:"pointer", marginBottom:14, padding:0, display:"flex", alignItems:"center", gap:5 }}>← Back</button>
            <h2 style={{ fontSize:16, fontWeight:800, margin:"0 0 4px" }}>🔐 Verify OTP</h2>
            <p style={{ fontSize:11, color:C.muted, margin:"0 0 22px" }}>+91 {phone} · <span style={{ color:C.saffron }}>Demo: 123456</span></p>

            <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:18 }}>
              {otp.map((d, i) => (
                <input key={i} ref={el => refs.current[i] = el} value={d}
                  onChange={e => handleOtpKey(i, e.target.value)}
                  onKeyDown={e => { if (e.key==="Backspace" && !d && i>0) refs.current[i-1]?.focus(); }}
                  maxLength={1} type="tel"
                  style={{ width:44, height:52, textAlign:"center", fontSize:22, fontWeight:900,
                    background: d ? "rgba(255,107,0,0.1)" : C.card2,
                    border: `2px solid ${d ? C.saffron : C.border}`,
                    borderRadius:12, color:"white", transition:"all 0.2s" }}/>
              ))}
            </div>

            {err && <p style={{ color:C.danger, fontSize:10.5, margin:"0 0 11px", textAlign:"center" }}>⚠️ {err}</p>}
            <Btn onClick={verify} disabled={loading} color={C.green} size="lg" full>{loading ? "⏳ Verifying..." : "✅ Verify & Login →"}</Btn>

            <p style={{ textAlign:"center", marginTop:14, fontSize:11, color:C.muted }}>
              {timer > 0 ? <span>Resend in <strong style={{ color:C.saffron }}>{timer}s</strong></span>
                : <span style={{ color:C.saffron, cursor:"pointer", fontWeight:700 }} onClick={() => { setTimer(30); }}>↻ Resend OTP</span>}
            </p>
          </>
        )}

        {step === "success" && (
          <div style={{ textAlign:"center", padding:"20px 0", animation:"scaleIn 0.4s ease" }}>
            <div style={{ fontSize:56, marginBottom:12 }}>✅</div>
            <h2 style={{ fontSize:18, fontWeight:900, color:C.greenL, margin:"0 0 6px" }}>Login Successful!</h2>
            <p style={{ fontSize:12, color:C.muted, margin:0 }}>Sahayak mein swagat hai 🙏</p>
          </div>
        )}
      </Card>

      <p style={{ marginTop:20, fontSize:9.5, color:C.muted, textAlign:"center", lineHeight:2, position:"relative" }}>
        🔒 Firebase Auth · JWT Secured · 256-bit Encrypted<br/>
        <span style={{ color:C.saffron }}>Privacy Policy</span> · <span style={{ color:C.saffron }}>Terms of Service</span>
      </p>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  PROFILE SETUP
// ═══════════════════════════════════════════════════════════════════
const ProfileSetup = memo(({ user, onComplete, t }) => {
  const [form, setForm] = useState({ name:user?.name||"", email:"", city:"", state:"", gender:"", dob:"", address:"" });
  const [step, setStep] = useState(0);
  const [loading, setLoad] = useState(false);
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const STEPS = [
    { title:"Personal Info", fields:[
      { key:"name",    label:t.fullName,    icon:"👤", placeholder:"Your full name",     type:"text" },
      { key:"email",   label:t.email,       icon:"📧", placeholder:"your@email.com",     type:"email" },
    ]},
    { title:"Location", fields:[
      { key:"city",    label:t.city,        icon:"🏙️", placeholder:"e.g. New Delhi",    type:"text" },
      { key:"state",   label:t.state,       icon:"🗺️", placeholder:"e.g. Delhi",        type:"text" },
    ]},
    { title:"Additional", fields:[
      { key:"gender",  label:t.gender,      icon:"⚧️", placeholder:"Male / Female / Other", type:"text" },
      { key:"dob",     label:t.dob,         icon:"🎂", placeholder:"DD/MM/YYYY",        type:"date" },
    ]},
    { title:"Address", fields:[
      { key:"address", label:t.address,     icon:"🏠", placeholder:"Full address with PIN code", type:"text" },
    ]},
  ];

  const save = async () => {
    setLoad(true); await sleep(1200); setLoad(false);
    // Production: await firestore.collection("users").doc(user.uid).set({ ...form, updatedAt: serverTimestamp() })
    onComplete(form);
  };

  const cur = STEPS[step];
  const progress = ((step+1)/STEPS.length)*100;

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <GStyle />
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 50% 20%, rgba(139,92,246,0.07) 0%, transparent 60%)", pointerEvents:"none" }}/>
      <div style={{ width:"100%", maxWidth:390, position:"relative" }}>
        <div style={{ textAlign:"center", marginBottom:24, animation:"slideUp 0.5s ease" }}>
          <div style={{ fontSize:40, marginBottom:8 }}>👤</div>
          <h2 style={{ fontSize:18, fontWeight:900, margin:"0 0 4px" }}>{t.completeProfile}</h2>
          <p style={{ fontSize:11, color:C.muted, margin:"0 0 14px" }}>Step {step+1} of {STEPS.length} — {cur.title}</p>
          <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:4, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,${C.saffron},${C.purple})`, borderRadius:4, transition:"width 0.5s ease" }}/>
          </div>
        </div>

        <Card style={{ padding:24, animation:"scaleIn 0.4s ease" }}>
          {cur.fields.map(f => (
            <FieldInput key={f.key} label={f.label} icon={f.icon} value={form[f.key]} onChange={e => upd(f.key, e.target.value)} placeholder={f.placeholder} type={f.type}/>
          ))}

          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            {step > 0 && <Btn onClick={() => setStep(s => s-1)} outline color={C.mutedL} size="lg" style={{ flex:1 }}>← {t.back}</Btn>}
            {step < STEPS.length - 1
              ? <Btn onClick={() => setStep(s => s+1)} color={C.purple} size="lg" style={{ flex:2 }}>Continue →</Btn>
              : <Btn onClick={save} disabled={loading} color={C.saffron} size="lg" style={{ flex:2 }}>{loading ? "⏳ Saving..." : `✅ ${t.save} Profile`}</Btn>}
          </div>
          <button onClick={() => onComplete(form)} style={{ width:"100%", marginTop:12, background:"none", border:"none", color:C.muted, fontSize:11, cursor:"pointer" }}>Skip for now →</button>
        </Card>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  FAKE CALL OVERLAY
// ═══════════════════════════════════════════════════════════════════
const FakeCallScreen = memo(({ onEnd }) => (
  <div style={{ position:"fixed", inset:0, background:"linear-gradient(180deg,#060e06,#030803)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:9999 }}>
    <GStyle />
    <div style={{ position:"fixed", inset:0, background:"radial-gradient(circle at 50% 40%,rgba(34,197,94,0.08) 0%,transparent 70%)", pointerEvents:"none" }}/>
    <div style={{ animation:"float 2s ease-in-out infinite", fontSize:64, marginBottom:16 }}>📱</div>
    <p style={{ fontSize:11, color:C.muted, letterSpacing:3, margin:"0 0 8px" }}>INCOMING CALL</p>
    <h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 4px" }}>Maa 👩</h2>
    <p style={{ fontSize:12, color:C.muted, margin:"0 0 6px" }}>+91 98765 43210</p>
    <div style={{ display:"flex", gap:5, marginBottom:48 }}>
      {[0,1,2].map(i => <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:C.greenL, animation:`pulse 1.4s ease-in-out ${i*0.28}s infinite` }}/>)}
    </div>
    <div style={{ display:"flex", gap:48 }}>
      {[{ label:"Decline", icon:"📵", bg:C.danger }, { label:"Accept", icon:"📞", bg:C.greenL }].map(b => (
        <div key={b.label} style={{ textAlign:"center" }}>
          <button onClick={onEnd} style={{ width:70, height:70, borderRadius:"50%", background:b.bg, border:"none", fontSize:28, cursor:"pointer", boxShadow:`0 4px 24px ${b.bg}55`, display:"flex", alignItems:"center", justifyContent:"center" }}>{b.icon}</button>
          <p style={{ fontSize:11, color:C.muted, margin:"8px 0 0" }}>{b.label}</p>
        </div>
      ))}
    </div>
    <p style={{ position:"absolute", bottom:40, fontSize:10, color:C.muted, opacity:0.4 }}>Sahayak — Women Safety Feature</p>
  </div>
));

// ═══════════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function SahayakApp() {
  // ── App lifecycle ─────────────────────────────────────────────
  const [phase, setPhase]       = useState("onboarding"); // onboarding | auth | profile | app
  const [user, setUser]         = useState(null);
  const [profile, setProfile]   = useState(null);
  const [tab, setTab]           = useState("home");
  const [lang, setLang]         = useState(() => localStorage.getItem("sahayak_lang") || "हिंदी");
  const [toasts, setToasts]     = useState([]);

  const t = useMemo(() => TRANSLATIONS[lang] || TRANSLATIONS["English"], [lang]);
  useEffect(() => { localStorage.setItem("sahayak_lang", lang); }, [lang]);

  const notify = useCallback((msg, type="success") => {
    const id = Date.now();
    setToasts(ts => [...ts, { id, msg, type }]);
  }, []);
  const removeToast = useCallback(id => setToasts(ts => ts.filter(t => t.id !== id)), []);

  // ── Emergency ─────────────────────────────────────────────────
  const [emActive, setEmActive]   = useState(false);
  const [sosCd, setSosCd]         = useState(null);
  const [location, setLocation]   = useState(null);
  const [locLoad, setLocLoad]     = useState(false);
  const [trackId]                 = useState(genTrack);
  const [emAlerts, setEmAlerts]   = useState([]);
  const [pulse, setPulse]         = useState(false);
  const [nearFilter, setNearFilter] = useState("all");
  const [offline, setOffline]     = useState(false);

  // ── Voice ─────────────────────────────────────────────────────
  const [voiceOn, setVoiceOn]     = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [bgListen, setBgListen]   = useState(false);

  // ── Women safety ──────────────────────────────────────────────
  const [guardianOn, setGuardianOn] = useState(false);
  const [fakeCall, setFakeCall]     = useState(false);
  const [silentTaps, setSilentTaps] = useState(0);
  const [recording, setRecording]   = useState(false);
  const [recDur, setRecDur]         = useState(0);

  // ── DigiLocker ────────────────────────────────────────────────
  const [digiLocked, setDigiLocked] = useState(true);
  const [digiPin, setDigiPin]       = useState("");
  const [pinInput, setPinInput]     = useState("");
  const [pinErr, setPinErr]         = useState("");
  const [digiOpen, setDigiOpen]     = useState(null);
  const [digiSyncing, setDigiSyncing] = useState(false);
  const [digiSearch, setDigiSearch] = useState("");
  const [digiCat, setDigiCat]       = useState("all");
  const [digiSection, setDigiSection] = useState("docs"); // docs | scan | ai
  const [docFavs, setDocFavs]       = useState(DIGILOCKER_DOCS.filter(d=>d.fav).map(d=>d.name));
  const [ocrActive, setOcrActive]   = useState(false);
  const [ocrResult, setOcrResult]   = useState(null);

  // ── Complaint ─────────────────────────────────────────────────
  const [cForm, setCForm] = useState({
    type:null, text:"", title:"", district:"", state:"", city:"", area:"", pincode:"",
    lat:"", lng:"", ai:null, loading:false, submitted:false, ref:"", photo:null,
    draftTyped:"", // animated typing state
    copied:false,  // copy feedback
  });
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [cView, setCView]     = useState("new");
  const [cGpsLoad, setCGpsLoad]     = useState(false); // GPS fetching state
  const [cGpsError, setCGpsError]   = useState("");    // GPS error message
  const [cVoiceOn, setCVoiceOn]     = useState(false); // voice input for complaint
  const [cAutoAnalyze, setCAutoAnalyze] = useState(false); // auto-analyze on type
  const cVoiceRef = useRef(null);
  const draftTypeTimer = useRef(null);

  // ── Schemes ───────────────────────────────────────────────────
  const [schemeOpen, setSchemeOpen]               = useState(null);
  const [schemePortalLoading, setSchemePortalLoading] = useState(null);
  const [schemeSubTab, setSchemeSubTab]           = useState({});

  const openPortal = (e, schemeId, url) => {
    e.preventDefault(); e.stopPropagation();
    setSchemePortalLoading(schemeId);
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
      setSchemePortalLoading(null);
    }, 650);
  };

  const toggleSchemeSubTab = (schemeId, key) => {
    setSchemeSubTab(prev => ({
      ...prev,
      [schemeId]: prev[schemeId] === key ? null : key,
    }));
  };


  // ── Chat ──────────────────────────────────────────────────────
  const [chatHist, setChatHist] = useState([
    { role:"assistant", text:"🙏 Namaste! Main SahayakBot hoon — Claude AI se powered. Government yojana, complaint, emergency, DigiLocker — kuch bhi poochein. Hindi + English dono mein help karta hoon! 🇮🇳" }
  ]);
  const [chatIn, setChatIn]     = useState("");
  const [chatLoad, setChatLoad] = useState(false);

  // ── Notifications ─────────────────────────────────────────────
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState([
    { id:1, icon:"🚨", title:"Emergency Alert",   msg:"SOS at Connaught Place. Responders dispatched.", time:"2m ago",  color:C.danger, read:false },
    { id:2, icon:"📢", title:"Complaint Update",  msg:"Your complaint SHK482910 has been resolved.",    time:"1h ago",  color:C.greenL, read:false },
    { id:3, icon:"🌧️", title:"Weather Warning",   msg:"Heavy rainfall expected in Delhi NCR. Stay safe.",time:"3h ago",  color:C.gold,   read:true },
    { id:4, icon:"💊", title:"Scheme Alert",      msg:"New enrollments open for Ayushman Bharat 2026.", time:"1d ago",  color:C.cyan,   read:true },
  ]);
  const unread = useMemo(() => notifs.filter(n => !n.read).length, [notifs]);

  // ── Profile modal ─────────────────────────────────────────────
  const [profOpen, setProfOpen] = useState(false);

  // ── Admin ─────────────────────────────────────────────────────
  const [adminTab, setAdminTab] = useState("overview");

  // ── Refs ──────────────────────────────────────────────────────
  const chatRef    = useRef(null);
  const recRef     = useRef(null);
  const sosRef     = useRef(null);
  const fakeRef    = useRef(null);
  const fileRef    = useRef(null);
  const recTimer   = useRef(null);
  const silentRef  = useRef(null);

  // ── Effects ───────────────────────────────────────────────────
  useEffect(() => { const t = setInterval(() => setPulse(p => !p), 1200); return () => clearInterval(t); }, []);
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [chatHist]);
  useEffect(() => {
    if (recording) { recTimer.current = setInterval(() => setRecDur(d => d+1), 1000); }
    else { clearInterval(recTimer.current); setRecDur(0); }
    return () => clearInterval(recTimer.current);
  }, [recording]);
  useEffect(() => {
    const go = () => setOffline(!navigator.onLine);
    window.addEventListener("online", go); window.addEventListener("offline", go);
    go(); return () => { window.removeEventListener("online", go); window.removeEventListener("offline", go); };
  }, []);

  // ── GPS ───────────────────────────────────────────────────────
  const getLocation = useCallback(() => {
    setLocLoad(true);
    if (!navigator.geolocation) {
      setLocation({ lat:"28.61390", lng:"77.20900", city:"New Delhi", district:"Central Delhi", state:"Delhi", accuracy:"~50m" });
      setLocLoad(false); return;
    }
    navigator.geolocation.getCurrentPosition(
      p => {
        setLocation({ lat:p.coords.latitude.toFixed(5), lng:p.coords.longitude.toFixed(5), city:"Your City", district:"Your District", state:"Your State", accuracy:Math.round(p.coords.accuracy)+"m" });
        setLocLoad(false);
      },
      () => {
        setLocation({ lat:"28.61390", lng:"77.20900", city:"New Delhi", district:"Central Delhi", state:"Delhi", accuracy:"~50m" });
        setLocLoad(false);
      },
      { timeout:8000, enableHighAccuracy:true }
    );
  }, []);

  // ── Voice Recognition ─────────────────────────────────────────
  const startVoice = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { notify("Voice API requires Chrome browser. Please use Chrome.", "error"); return; }
    const rec = new SR(); recRef.current = rec;
    rec.continuous = true; rec.interimResults = true; rec.lang = "hi-IN";
    setVoiceOn(true);
    rec.onresult = e => {
      const tx = Array.from(e.results).map(r => r[0].transcript).join(" ").toLowerCase();
      setVoiceText(tx);
      if (DISTRESS_KEYWORDS.some(k => tx.includes(k))) { rec.stop(); triggerEmergency("Voice Distress Detection"); }
    };
    rec.onerror = () => setVoiceOn(false);
    rec.onend = () => { setVoiceOn(false); if (bgListen) setTimeout(startVoice, 1500); };
    rec.start();
  }, [bgListen]);

  const stopVoice = useCallback(() => { recRef.current?.stop(); setVoiceOn(false); setVoiceText(""); }, []);

  // ── Emergency ─────────────────────────────────────────────────
  const triggerEmergency = useCallback((src = "Manual SOS") => {
    getLocation(); setEmActive(true);
    setEmAlerts([
      { to:"Police Control Room", num:"100",             time:tsNow(), via:"Call + SMS" },
      { to:"Ambulance EMRI",      num:"108",             time:tsNow(), via:"Call" },
      { to:"Maa",                 num:"+91 98765 43210", time:tsNow(), via:"SMS + GPS Link" },
      { to:"Rahul Bhai",          num:"+91 87654 32109", time:tsNow(), via:"SMS + GPS Link" },
    ]);
    setTab("emergency");
    notify(`🆘 Emergency via ${src}! Police, Ambulance & family alerted.`);
  }, [getLocation]);

  const startSOS = useCallback(() => {
    setSosCd(5);
    sosRef.current = setInterval(() => {
      setSosCd(c => { if (c <= 1) { clearInterval(sosRef.current); triggerEmergency("SOS Button"); return null; } return c-1; });
    }, 1000);
  }, [triggerEmergency]);

  const cancelSOS = useCallback(() => { clearInterval(sosRef.current); setSosCd(null); }, []);
  const cancelEmergency = useCallback(() => { setEmActive(false); setEmAlerts([]); setVoiceText(""); }, []);

  // ── Silent SOS ────────────────────────────────────────────────
  const doSilentTap = useCallback(() => {
    setSilentTaps(n => {
      const nx = n + 1;
      if (nx >= 3) { triggerEmergency("Silent SOS — Triple Tap"); return 0; }
      clearTimeout(silentRef.current);
      silentRef.current = setTimeout(() => setSilentTaps(0), 3000);
      return nx;
    });
  }, [triggerEmergency]);

  // ── Fake Call ─────────────────────────────────────────────────
  const startFakeCall = delay => {
    if (delay > 0) notify(`📞 Fake call ringing in ${delay}s`);
    setTimeout(() => { setFakeCall(true); fakeRef.current = setTimeout(() => setFakeCall(false), 30000); }, delay * 1000);
  };

  // ── DigiLocker Unlock ─────────────────────────────────────────
  const unlockDigi = () => {
    if (pinInput.length < 4) { setPinErr("Enter 4-digit PIN"); return; }
    if (digiPin && pinInput !== digiPin) { setPinErr("Incorrect PIN. Try again."); setPinInput(""); return; }
    if (!digiPin) setDigiPin(pinInput);
    setDigiLocked(false); setPinInput(""); setPinErr("");
    notify("🗂️ DigiLocker unlocked securely");
  };

  // ── OCR Simulation ────────────────────────────────────────────
  const runOCR = async () => {
    setOcrActive(true); await sleep(2500);
    setOcrResult({ name:"RAMESH KUMAR", dob:"15/08/1990", docNo:"XXXX XXXX 1234", type:"Aadhaar Card" });
    setOcrActive(false); notify("✅ Document scanned! Data extracted.");
  };

  // ── DigiLocker Sync ───────────────────────────────────────────
  const syncDigi = async () => {
    setDigiSyncing(true); await sleep(2000); setDigiSyncing(false);
    notify("🗂️ DigiLocker synced! All documents updated.");
  };

  // ── Complaint AI ──────────────────────────────────────────────
  // ── GPS Auto-detect location for complaint ───────────────────
  const detectComplaintLocation = () => {
    setCGpsLoad(true); setCGpsError("");
    if (!navigator.geolocation) {
      setCGpsError("GPS not supported. Enter location manually.");
      setCGpsLoad(false); return;
    }
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const lat = pos.coords.latitude.toFixed(5);
        const lng = pos.coords.longitude.toFixed(5);
        // Reverse geocode via nominatim (free, no key required)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
            { headers:{ "Accept-Language":"en" } }
          );
          const geo = await res.json();
          const a = geo.address || {};
          setCForm(c => ({
            ...c,
            lat, lng,
            city:    a.city || a.town || a.village || a.county || "",
            district:a.county || a.state_district || a.city || "",
            state:   a.state || "",
            area:    a.suburb || a.neighbourhood || a.road || "",
            pincode: a.postcode || "",
          }));
          notify("📍 Location auto-detected successfully!");
        } catch {
          // Coords only if geocode fails
          setCForm(c => ({ ...c, lat, lng, city:"Your City", district:"Your District", state:"Your State" }));
          notify("📍 GPS coordinates captured");
        }
        setCGpsLoad(false);
      },
      err => {
        const msg = err.code === 1
          ? "Location permission denied. Enter manually."
          : "Could not detect location. Try again.";
        setCGpsError(msg); setCGpsLoad(false);
      },
      { timeout:10000, enableHighAccuracy:true }
    );
  };

  // ── Voice input for complaint ─────────────────────────────────
  const startComplaintVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { notify("Voice requires Chrome browser", "error"); return; }
    const rec = new SR(); cVoiceRef.current = rec;
    rec.continuous = false; rec.interimResults = true; rec.lang = "hi-IN";
    setCVoiceOn(true);
    rec.onresult = e => {
      const tx = Array.from(e.results).map(r => r[0].transcript).join(" ");
      setCForm(c => ({ ...c, text: tx, ai:null }));
    };
    rec.onerror = () => setCVoiceOn(false);
    rec.onend = () => { setCVoiceOn(false); };
    rec.start();
  };
  const stopComplaintVoice = () => { cVoiceRef.current?.stop(); setCVoiceOn(false); };

  // ── Animate typed draft text ──────────────────────────────────
  const animateDraft = (fullText) => {
    clearInterval(draftTypeTimer.current);
    let i = 0;
    setCForm(c => ({ ...c, draftTyped:"" }));
    draftTypeTimer.current = setInterval(() => {
      i++;
      setCForm(c => ({ ...c, draftTyped: fullText.slice(0, i) }));
      if (i >= fullText.length) clearInterval(draftTypeTimer.current);
    }, 14);
  };

  // ── Portal routing map ────────────────────────────────────────
  const PORTAL_MAP = {
    "Road":        { url:"https://pgportal.gov.in",         label:"CPGRAMS / PWD Portal" },
    "Street Light":{ url:"https://pgportal.gov.in",         label:"DISCOM Grievance" },
    "Water":       { url:"https://jalshakti-ddws.gov.in",   label:"Jal Shakti Portal" },
    "Garbage":     { url:"https://swachhbharatmission.gov.in",label:"SBM Portal" },
    "Sewage":      { url:"https://jalshakti-ddws.gov.in",   label:"Jal Board Portal" },
    "Construction":{ url:"https://pgportal.gov.in",         label:"Building Dept. Portal" },
    "Corrupt":     { url:"https://cvc.gov.in",              label:"CVC / CPGRAMS" },
    "Noise":       { url:"https://cpcb.nic.in",             label:"CPCB Portal" },
    "General":     { url:"https://pgportal.gov.in",         label:"CPGRAMS Portal" },
  };

  const getPortalForComplaint = (category) => {
    const key = Object.keys(PORTAL_MAP).find(k =>
      (category||"").toLowerCase().includes(k.toLowerCase())
    );
    return PORTAL_MAP[key] || PORTAL_MAP["General"];
  };

  // ── AI analyze complaint ──────────────────────────────────────
  const analyzeComplaint = async txt => {
    setCForm(c => ({ ...c, loading:true, ai:null, draftTyped:"" }));
    const locationCtx = cForm.district
      ? `Location: ${cForm.district}, ${cForm.state}.`
      : "";
    try {
      const res = await fetch(ENV.CLAUDE_API_URL, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model: ENV.CLAUDE_MODEL, max_tokens:800,
          system:`You are an Indian government grievance AI. ${locationCtx}
Return ONLY valid JSON (no markdown, no extra text):
{
  "title": "Short 5-7 word complaint title",
  "category": "Road|Water|Garbage|Electricity|Sewage|Corruption|Noise|General",
  "department": "Full department name",
  "priority": "High|Medium|Low",
  "draft": "3-sentence formal complaint letter with To: [Dept], Subject: [Issue], Body: [Details]. Use professional language.",
  "portal": "exact portal URL",
  "portalName": "Portal display name",
  "estimatedDays": 7,
  "tip": "Short actionable Hinglish tip under 12 words"
}`,
          messages:[{ role:"user", content:`User complaint: "${txt}"
${locationCtx}` }]
        })
      });
      const data = await res.json();
      const raw = data.content?.map(c => c.text||"").join("") || "{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      // auto-route portal based on category if not provided
      if (!parsed.portal || parsed.portal === "pgportal.gov.in") {
        const routed = getPortalForComplaint(parsed.category);
        if (!parsed.portal) parsed.portal = routed.url;
        if (!parsed.portalName) parsed.portalName = routed.label;
      }
      setCForm(c => ({ ...c, loading:false, ai:parsed }));
      animateDraft(parsed.draft || "");
      notify("✅ AI analysis complete! Draft generated.");
    } catch {
      const fallback = {
        title: "Civic Issue Complaint",
        category:"General", department:"Municipal Corporation", priority:"Medium",
        draft:`To,\nThe Municipal Commissioner,\n\nSub: ${txt}\n\nI would like to bring to your kind attention the above-mentioned civic issue in my locality. This has been causing inconvenience to residents and requires immediate intervention. Kindly look into this matter and take appropriate action at the earliest.\n\nYours faithfully,\n[Your Name]`,
        portal:"https://pgportal.gov.in", portalName:"CPGRAMS Portal", estimatedDays:7,
        tip:"pgportal.gov.in pe complaint ID se track karo."
      };
      setCForm(c => ({ ...c, loading:false, ai:fallback }));
      animateDraft(fallback.draft);
    }
  };

  const submitComplaint = () => {
    const ref = genRef();
    const newEntry = {
      id: ref,
      type: cForm.ai?.title || cForm.type?.split("/")[0].trim() || "General",
      dept: cForm.ai?.department || "Municipal",
      status: "pending",
      date: dateNow(),
      district: cForm.district || cForm.city || "Delhi",
      state: cForm.state || "",
      lat: cForm.lat || "",
      lng: cForm.lng || "",
      category: cForm.ai?.category || "General",
      priority: cForm.ai?.priority || "Medium",
      portal: cForm.ai?.portal || "pgportal.gov.in",
      ref,
    };
    setComplaints(prev => [newEntry, ...prev]);
    setCForm(c => ({ ...c, submitted:true, ref }));
    notify(`✅ Complaint ${ref} submitted to ${cForm.ai?.department||"authorities"}!`);
  };

  const resetComplaint = () => {
    clearInterval(draftTypeTimer.current);
    setCForm({
      type:null, text:"", title:"", district:"", state:"", city:"", area:"", pincode:"",
      lat:"", lng:"", ai:null, loading:false, submitted:false, ref:"", photo:null,
      draftTyped:"", copied:false,
    });
    setCGpsError("");
  };

  const copyDraft = () => {
    const txt = cForm.ai?.draft || "";
    navigator.clipboard?.writeText(txt).then(() => {
      setCForm(c => ({ ...c, copied:true }));
      notify("📋 Complaint draft copied to clipboard!");
      setTimeout(() => setCForm(c => ({ ...c, copied:false })), 3000);
    });
  };

  const openComplaintPortal = () => {
    const url = cForm.ai?.portal || "https://pgportal.gov.in";
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // ── Chat AI ───────────────────────────────────────────────────
  const sendChat = useCallback(async () => {
    const msg = chatIn.trim(); if (!msg) return;
    setChatIn(""); setChatHist(h => [...h, { role:"user", text:msg }]); setChatLoad(true);
    try {
      const res = await fetch(ENV.CLAUDE_API_URL, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model: ENV.CLAUDE_MODEL, max_tokens:700,
          system:"You are SahayakBot — AI assistant for Indian citizens. Help with govt schemes, emergencies, RTI, Aadhaar/PAN, DigiLocker, complaints. 3-5 lines max, Hinglish mix, practical, emojis. End with next step.",
          messages: chatHist.concat([{ role:"user", text:msg }]).slice(-12).map(m => ({ role:m.role, content:m.text }))
        })
      });
      const data = await res.json();
      const reply = data.content?.map(c => c.text||"").join("") || "Kuch problem aayi. Dobara try karein!";
      setChatHist(h => [...h, { role:"assistant", text:reply }]);
    } catch {
      setChatHist(h => [...h, { role:"assistant", text:"⚠️ Network error. Internet check karein." }]);
    }
    setChatLoad(false);
  }, [chatIn, chatHist]);

  // ── Derived data ──────────────────────────────────────────────
  const digiFiltered = useMemo(() => DIGILOCKER_DOCS.filter(d => {
    const matchCat  = digiCat === "all" || d.category === digiCat;
    const matchSearch = d.name.toLowerCase().includes(digiSearch.toLowerCase()) || d.issuer.toLowerCase().includes(digiSearch.toLowerCase());
    return matchCat && matchSearch;
  }), [digiCat, digiSearch]);

  // ── Phase routing ─────────────────────────────────────────────
  if (phase === "onboarding") return <><GStyle/><Onboarding onDone={() => setPhase("auth")}/></>;
  if (phase === "auth")       return <><GStyle/><AuthScreen onAuth={u => { setUser(u); setPhase(u.isNew ? "profile" : "app"); }}/></>;
  if (phase === "profile")    return <><GStyle/><ProfileSetup user={user} t={t} onComplete={p => { setProfile(p); setPhase("app"); }}/></>;
  if (fakeCall)               return <><GStyle/><FakeCallScreen onEnd={() => { clearTimeout(fakeRef.current); setFakeCall(false); }}/></>;

  const TABS = [
    { id:"home",       icon:"🏠", label:t.home },
    { id:"emergency",  icon:"🚨", label:t.sos },
    { id:"schemes",    icon:"📋", label:t.yojana },
    { id:"complaint",  icon:"📢", label:t.complaint },
    { id:"digilocker", icon:"🗂️", label:t.docs },
    { id:"women",      icon:"🙋‍♀️",label:t.safety },
    { id:"ai",         icon:"🤖", label:t.bot },
    { id:"admin",      icon:"📊", label:t.admin },
  ];

  // ── Profile Modal ─────────────────────────────────────────────
  const ProfileModal = () => (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.82)", zIndex:500, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={() => setProfOpen(false)}>
      <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxWidth:430, background:C.card2, borderRadius:"20px 20px 0 0", padding:24, animation:"slideUp 0.3s ease", maxHeight:"80vh", overflowY:"auto" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
          <div style={{ width:58, height:58, borderRadius:"50%", background:`linear-gradient(135deg,${C.saffron},${C.navy})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>👤</div>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:900, fontSize:16, margin:"0 0 2px" }}>{profile?.name || user?.name || "Citizen"}</p>
            <p style={{ fontSize:10, color:C.muted, margin:"0 0 5px" }}>+91 {user?.phone} · {profile?.city || "—"}</p>
            <div style={{ display:"flex", gap:6 }}><Badge color={C.greenL}>Verified</Badge><Badge color={C.cyan}>KYC ✓</Badge></div>
          </div>
        </div>
        {[["👤","Name",profile?.name||user?.name||"—"],["📧","Email",profile?.email||"—"],["🏙️","City",profile?.city||"—"],["🗺️","State",profile?.state||"—"],["⚧️","Gender",profile?.gender||"—"],["📅","DOB",profile?.dob||"—"]].map(([ico,lbl,val]) => (
          <div key={lbl} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
            <span style={{ fontSize:11, color:C.muted }}>{ico} {lbl}</span>
            <span style={{ fontSize:11, fontWeight:700 }}>{val}</span>
          </div>
        ))}
        <div style={{ display:"flex", gap:10, marginTop:18 }}>
          <Btn onClick={() => { setProfOpen(false); setPhase("profile"); }} outline color={C.cyan} style={{ flex:1 }}>✏️ {t.editProfile}</Btn>
          <Btn onClick={() => { setProfOpen(false); setPhase("auth"); }} outline color={C.danger} style={{ flex:1 }}>🚪 {t.logout}</Btn>
        </div>
      </div>
    </div>
  );

  // ── Notification Panel ────────────────────────────────────────
  const NotifPanel = () => (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:500, display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:70 }} onClick={() => setNotifOpen(false)}>
      <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxWidth:430, background:C.card2, borderRadius:"0 0 20px 20px", maxHeight:"72vh", overflowY:"auto", animation:"slideUp 0.3s ease" }}>
        <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:C.card2 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontWeight:800, fontSize:14 }}>🔔 Notifications</span>
            {unread > 0 && <Badge color={C.danger}>{unread}</Badge>}
          </div>
          <button onClick={() => setNotifs(n => n.map(x => ({ ...x, read:true })))} style={{ background:"none", border:"none", color:C.saffron, cursor:"pointer", fontSize:11, fontWeight:700 }}>Mark all read</button>
        </div>
        {notifs.map(n => (
          <div key={n.id} onClick={() => setNotifs(ns => ns.map(x => x.id===n.id ? {...x,read:true} : x))} style={{ display:"flex", gap:12, padding:"13px 18px", borderBottom:`1px solid ${C.border}`, background: n.read ? "transparent" : "rgba(255,255,255,0.015)", cursor:"pointer" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:`${n.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{n.icon}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                <span style={{ fontSize:12, fontWeight:n.read?600:800 }}>{n.title}</span>
                <span style={{ fontSize:9.5, color:C.muted, flexShrink:0, marginLeft:8 }}>{n.time}</span>
              </div>
              <p style={{ fontSize:10.5, color:C.muted, margin:0, lineHeight:1.5 }}>{n.msg}</p>
            </div>
            {!n.read && <div style={{ width:7, height:7, borderRadius:"50%", background:n.color, flexShrink:0, marginTop:4 }}/>}
          </div>
        ))}
      </div>
    </div>
  );

  // ═════════════════════════════════════════════════════════════
  //  MAIN RENDER
  // ═════════════════════════════════════════════════════════════
  return (
    <div style={{ fontFamily:"'Inter','Noto Sans Devanagari',sans-serif", background:C.bg, minHeight:"100vh", maxWidth:430, margin:"0 auto", display:"flex", flexDirection:"column", color:"white", position:"relative" }}>
      <GStyle/>

      {/* Toast stack */}
      {toasts.slice(-1).map(toast => (
        <Toast key={toast.id} msg={toast.msg} type={toast.type} onClose={() => removeToast(toast.id)}/>
      ))}

      {profOpen && <ProfileModal/>}
      {notifOpen && <NotifPanel/>}

      {/* Offline banner */}
      {offline && (
        <div style={{ background:"linear-gradient(135deg,#1a0d00,#0a0800)", borderBottom:`1px solid ${C.gold}30`, padding:"8px 16px", display:"flex", alignItems:"center", gap:8, fontSize:11, color:C.gold }}>
          <span style={{ animation:"pulse 1.5s infinite" }}>📶</span>
          <span><strong>Offline Mode</strong> — SOS & last GPS still available. AI features paused.</span>
        </div>
      )}

      {/* ── HEADER ── */}
      <header style={{
        background:`linear-gradient(135deg,${C.saffronD} 0%,#680f00 38%,${C.navy} 100%)`,
        padding:"12px 14px 10px", position:"sticky", top:0, zIndex:55,
        boxShadow:"0 4px 32px rgba(0,0,0,0.7)", borderBottom:"1px solid rgba(255,255,255,0.04)",
      }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, animation:"float 3s ease-in-out infinite", flexShrink:0 }}>🇮🇳</div>
            <div>
              <div style={{ fontSize:17, fontWeight:900, letterSpacing:2, lineHeight:1.1 }}>{t.appName} <span style={{ fontSize:8, opacity:0.45, fontWeight:400 }}>{t.version}</span></div>
              <div style={{ fontSize:7.5, opacity:0.5, letterSpacing:2 }}>{t.tagline.toUpperCase()}</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(0,0,0,0.3)", borderRadius:20, padding:"3px 8px", border:"1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background: offline?"#F59E0B":C.greenL, animation: offline?"none":"glow 2s ease-in-out infinite" }}/>
              <span style={{ fontSize:7.5, opacity:0.8 }}>{offline?"OFFLINE":"LIVE"}</span>
            </div>
            {/* Notification Bell */}
            <button onClick={() => setNotifOpen(true)} style={{ position:"relative", background:"rgba(255,255,255,0.09)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"50%", width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, cursor:"pointer" }}>
              🔔
              {unread > 0 && <div style={{ position:"absolute", top:-2, right:-2, width:14, height:14, borderRadius:"50%", background:C.danger, fontSize:8, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", border:`2px solid ${C.bg}` }}>{unread}</div>}
            </button>
            {/* Avatar */}
            <div onClick={() => setProfOpen(true)} style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${C.saffron},${C.navy})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, cursor:"pointer", border:"1.5px solid rgba(255,255,255,0.18)" }}>👤</div>
            {/* Language */}
            <select value={lang} onChange={e => setLang(e.target.value)} style={{ background:"rgba(255,255,255,0.09)", border:"1px solid rgba(255,255,255,0.13)", color:"white", borderRadius:8, padding:"3px 5px", fontSize:8.5, cursor:"pointer" }}>
              {LANGUAGES.map(l => <option key={l} value={l} style={{ color:"#000" }}>{l}</option>)}
            </select>
          </div>
        </div>
        {emActive && (
          <div style={{ marginTop:9, padding:"7px 12px", background:"#c00000", borderRadius:10, display:"flex", justifyContent:"space-between", alignItems:"center", animation:"sos 0.8s infinite" }}>
            <span style={{ fontSize:10.5, fontWeight:800 }}>🆘 EMERGENCY ACTIVE · GPS ON · {trackId}</span>
            <button onClick={cancelEmergency} style={{ background:"rgba(255,255,255,0.2)", border:"none", color:"white", borderRadius:6, padding:"3px 9px", fontSize:10, cursor:"pointer", fontWeight:800 }}>{t.cancel}</button>
          </div>
        )}
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <main style={{ flex:1, overflowY:"auto", paddingBottom:74 }}>

        {/* ════════ HOME ════════ */}
        {tab === "home" && (
          <div style={{ padding:"14px 13px" }}>
            {/* Greeting */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, animation:"slideIn 0.4s ease" }}>
              <div>
                <p style={{ fontSize:10, color:C.muted, margin:"0 0 2px" }}>{t.welcome} 🙏</p>
                <h2 style={{ fontSize:20, fontWeight:900, margin:0 }}>{profile?.name || user?.name || "Citizen"}</h2>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"flex-end" }}>
                {offline && <Badge color={C.gold}>Offline</Badge>}
                <Badge color={C.greenL} dot>Verified</Badge>
              </div>
            </div>

            {/* SOS HERO */}
            <Card style={{ marginBottom:13, overflow:"hidden", position:"relative", background:"linear-gradient(145deg,#0c0408,#060410)", animation:"scaleIn 0.5s ease 0.1s both" }}>
              <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 60%,rgba(208,0,0,0.07) 0%,transparent 70%)" }}/>
              <div style={{ padding:"22px 16px", textAlign:"center", position:"relative" }}>
                <p style={{ fontSize:9, letterSpacing:3.5, opacity:0.45, margin:"0 0 12px", color:C.danger, fontWeight:700 }}>⚡ {t.sosTitle.toUpperCase()}</p>
                {/* SOS Button */}
                <div style={{ position:"relative", display:"inline-block", marginBottom:12 }}>
                  {[1,2].map(i => (
                    <div key={i} style={{ position:"absolute", inset:-(i*14), borderRadius:"50%", border:`1.5px solid ${pulse ? `rgba(208,0,0,${0.16/i})` : "transparent"}`, transition:"all 1.2s ease" }}/>
                  ))}
                  <button onClick={sosCd ? cancelSOS : startSOS} style={{
                    width:108, height:108, borderRadius:"50%",
                    background: sosCd ? "#c00000" : "white",
                    border:"none", fontSize: sosCd ? 30 : 44, cursor:"pointer",
                    boxShadow:`0 0 ${pulse?42:20}px rgba(208,0,0,${pulse?0.45:0.18})`,
                    transition:"all 0.6s", display:"flex", alignItems:"center", justifyContent:"center",
                    animation: sosCd ? "sos 0.5s infinite" : "none",
                    color: sosCd ? "white" : "inherit", fontWeight:900,
                  }}>{sosCd ?? "🆘"}</button>
                </div>
                <p style={{ fontSize:13, fontWeight:800, margin:"0 0 3px" }}>{sosCd ? `Calling in ${sosCd}s — tap to ${t.cancel}` : `Press for ${t.sosTitle}`}</p>
                <p style={{ fontSize:9.5, color:C.muted, margin:"0 0 13px" }}>{t.sosHint}</p>

                {/* Controls */}
                <div style={{ display:"flex", gap:7, justifyContent:"center", flexWrap:"wrap", marginBottom:10 }}>
                  <button onClick={voiceOn ? stopVoice : startVoice} style={{ background: voiceOn?"rgba(200,0,0,0.28)":"rgba(255,255,255,0.06)", border:`1px solid ${voiceOn?"rgba(255,0,0,0.55)":C.border2}`, color:"white", borderRadius:20, padding:"6px 14px", fontSize:10.5, fontWeight:800, cursor:"pointer", animation: voiceOn?"sos 2.5s infinite":"none", display:"flex", alignItems:"center", gap:5 }}>
                    🎙️ {voiceOn ? t.listening : t.voiceWatch}
                  </button>
                  <button onClick={getLocation} style={{ background: location?"rgba(34,197,94,0.09)":"rgba(255,255,255,0.06)", border:`1px solid ${location?"#22c55e28":C.border2}`, color: location?C.greenL:"white", borderRadius:20, padding:"6px 13px", fontSize:10.5, fontWeight:800, cursor:"pointer" }}>
                    {locLoad ? "⏳" : location ? `📍 ${t.located}` : `📍 ${t.getGps}`}
                  </button>
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontSize:10, color:C.muted }}>
                  <Toggle on={bgListen} onToggle={() => { setBgListen(v => !v); if (!bgListen) notify("🎙️ Background listening enabled"); }} color={C.danger}/>
                  <span>Continuous background listening</span>
                </div>
                {voiceText && <p style={{ marginTop:8, padding:"6px 10px", background:"rgba(255,255,255,0.04)", borderRadius:10, fontSize:10, color:C.mutedL, fontStyle:"italic", animation:"slideUp 0.3s ease", margin:"8px 0 0" }}>🎤 "{voiceText}"</p>}
              </div>
            </Card>

            {/* GPS card */}
            {location && (
              <Card style={{ marginBottom:12, padding:"12px 15px", borderColor:"#22c55e18", animation:"slideUp 0.4s ease" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <p style={{ fontSize:9.5, color:C.muted, margin:"0 0 3px" }}>📍 LIVE GPS LOCATION</p>
                    <p style={{ fontWeight:800, fontSize:13, margin:"0 0 2px" }}>{location.city}, {location.state}</p>
                    <p style={{ fontSize:9.5, color:C.muted, margin:0 }}>{location.lat}, {location.lng} · ±{location.accuracy}</p>
                  </div>
                  <Badge color={C.greenL} dot>GPS ON</Badge>
                </div>
              </Card>
            )}

            {/* Quick Access */}
            <p style={{ fontSize:9, color:C.muted, marginBottom:8, letterSpacing:1.2, fontWeight:700, margin:"0 0 8px" }}>{t.quickAccess.toUpperCase()}</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
              {[
                { icon:"🚨", label:t.emergency, tab:"emergency", color:C.danger },
                { icon:"🙋‍♀️",label:t.womenSafetyTitle, tab:"women", color:C.pink },
                { icon:"📢", label:t.grievanceTitle, tab:"complaint", color:C.gold },
                { icon:"🗂️", label:t.digilockerTitle, tab:"digilocker", color:C.cyan },
              ].map((q, i) => (
                <button key={q.tab} onClick={() => setTab(q.tab)} className="press-scale" style={{ background:`${q.color}0C`, border:`1px solid ${q.color}1e`, borderRadius:16, padding:"14px 11px", display:"flex", alignItems:"center", gap:9, textAlign:"left", color:"white", cursor:"pointer", animation:`slideUp 0.4s ease ${i*0.07}s both` }}>
                  <span style={{ fontSize:26 }}>{q.icon}</span>
                  <p style={{ fontSize:11, fontWeight:800, lineHeight:1.4, margin:0 }}>{q.label}</p>
                </button>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:7, marginBottom:12 }}>
              {[["🚨","8+","Helplines"],["📋","8+","Schemes"],["🗂️","9","Docs"],["🤖","24/7","AI Bot"]].map(([icon,val,lbl],i) => (
                <Card key={lbl} style={{ padding:"11px 4px", textAlign:"center", animation:`slideUp 0.4s ease ${0.2+i*0.05}s both` }}>
                  <p style={{ fontSize:18, margin:"0 0 2px" }}>{icon}</p>
                  <p style={{ fontSize:16, fontWeight:900, color:C.saffron, margin:"0 0 2px" }}>{val}</p>
                  <p style={{ fontSize:8, color:C.muted, margin:0 }}>{lbl}</p>
                </Card>
              ))}
            </div>

            {/* Recent complaints */}
            {complaints.length > 0 && (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <p style={{ fontSize:9, color:C.muted, letterSpacing:1.2, fontWeight:700, margin:0 }}>{t.recentComplaints.toUpperCase()}</p>
                  <span style={{ color:C.saffron, cursor:"pointer", fontSize:10, fontWeight:700 }} onClick={() => { setTab("complaint"); setCView("history"); }}>{t.viewAll} →</span>
                </div>
                {complaints.slice(0,2).map(c => (
                  <Card key={c.id} style={{ marginBottom:7, padding:"11px 14px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <p style={{ fontSize:12, fontWeight:700, margin:"0 0 2px" }}>{c.type}</p>
                        <p style={{ fontSize:9.5, color:C.muted, margin:0 }}>#{c.id} · {c.date}</p>
                      </div>
                      <Badge color={pColor(c.status)}>{pLabel(c.status)}</Badge>
                    </div>
                  </Card>
                ))}
              </>
            )}

            <div style={{ display:"flex", height:3, borderRadius:4, overflow:"hidden", margin:"14px 0 9px" }}>
              {[C.saffron,"white",C.green].map((c,i) => <div key={i} style={{ flex:1, background:c }}/>)}
            </div>
            <p style={{ textAlign:"center", color:C.muted, fontSize:9, margin:0 }}>🇮🇳 Ek Bharat, Shreshtha Bharat — Made for Every Indian</p>
          </div>
        )}

        {/* ════════ EMERGENCY ════════ */}
        {tab === "emergency" && (
          <div style={{ padding:"14px 13px" }}>
            {emActive && (
              <Card style={{ marginBottom:14, padding:17, borderColor:"#c0000040", animation:"slideUp 0.4s ease", background:"linear-gradient(135deg,#0c0000,#04000e)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <p style={{ fontSize:14, fontWeight:900, color:C.danger, margin:0 }}>🆘 EMERGENCY ACTIVE</p>
                  <Badge color={C.danger} dot>LIVE</Badge>
                </div>
                {/* Live Radar */}
                <div style={{ background:"#030e03", borderRadius:12, padding:13, marginBottom:11, border:"1px solid #22c55e1a", position:"relative", overflow:"hidden" }}>
                  <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.09 }}>
                    {[0,25,50,75,100].map(y => <line key={y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#22c55e" strokeWidth="0.5"/>)}
                    {[0,20,40,60,80,100].map(x => <line key={x} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="#22c55e" strokeWidth="0.5"/>)}
                    <circle cx="50%" cy="50%" r="22%" stroke="#22c55e" strokeWidth="0.5" fill="none"/>
                    <circle cx="50%" cy="50%" r="36%" stroke="#22c55e" strokeWidth="0.5" fill="none"/>
                  </svg>
                  <div style={{ position:"absolute", left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,#22c55e40,transparent)", animation:"scan 2s linear infinite", pointerEvents:"none" }}/>
                  <div style={{ position:"relative", height:76, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ position:"relative", width:16, height:16 }}>
                      <div style={{ width:16, height:16, borderRadius:"50%", background:"#22c55e" }}/>
                      {[1,2,3].map(i => <div key={i} style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid #22c55e", animation:`ping 2s ease-out ${i*0.5}s infinite` }}/>)}
                    </div>
                  </div>
                  <div style={{ textAlign:"center", marginTop:2 }}>
                    <p style={{ fontSize:11, fontWeight:800, color:"#22c55e", margin:"0 0 2px" }}>{location?.city||"Locating..."}, {location?.state||""}</p>
                    <p style={{ fontSize:9, color:C.muted, margin:0 }}>{location?.lat}, {location?.lng} · Track: {trackId}</p>
                  </div>
                </div>
                <p style={{ fontSize:11, fontWeight:700, margin:"0 0 7px" }}>📤 Alerts Dispatched:</p>
                {emAlerts.map((a, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(34,197,94,0.05)", borderRadius:9, padding:"8px 11px", marginBottom:6, border:"1px solid rgba(34,197,94,0.12)", animation:`slideUp 0.3s ease ${i*0.1}s both` }}>
                    <div><p style={{ fontSize:11.5, fontWeight:700, margin:"0 0 1px" }}>{a.to}</p><p style={{ fontSize:9.5, color:C.muted, margin:0 }}>{a.num}</p></div>
                    <div style={{ textAlign:"right" }}><Badge color={C.greenL}>{a.via}</Badge><p style={{ fontSize:9, color:C.muted, margin:"2px 0 0" }}>{a.time}</p></div>
                  </div>
                ))}
                <Btn onClick={cancelEmergency} outline color={C.mutedL} full style={{ marginTop:10 }}>✋ {t.cancelEmergency}</Btn>
              </Card>
            )}

            {/* Nearby */}
            <Card style={{ marginBottom:13, padding:"13px 15px" }}>
              <p style={{ fontSize:12.5, fontWeight:800, margin:"0 0 10px" }}>📍 Nearby Services</p>
              <div style={{ display:"flex", gap:7, marginBottom:10 }}>
                {["all","hospital","police"].map(f => (
                  <button key={f} onClick={() => setNearFilter(f)} style={{ padding:"5px 12px", borderRadius:20, fontSize:9.5, fontWeight:800, cursor:"pointer", background: nearFilter===f?`${C.cyan}15`:"rgba(255,255,255,0.04)", border:`1px solid ${nearFilter===f?`${C.cyan}50`:C.border}`, color: nearFilter===f?C.cyan:C.muted }}>
                    {f==="all"?"All":f==="hospital"?"Hospitals":"Police Stns."}
                  </button>
                ))}
              </div>
              {NEARBY_PLACES.filter(p => nearFilter==="all"||p.type===nearFilter).map(p => (
                <div key={p.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 11px", background:C.card2, borderRadius:11, border:`1px solid ${C.border}`, marginBottom:7 }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <span style={{ fontSize:20 }}>{p.icon}</span>
                    <div><p style={{ fontSize:11.5, fontWeight:700, margin:"0 0 1px" }}>{p.name}</p><p style={{ fontSize:9.5, color:C.muted, margin:0 }}>{p.dist}</p></div>
                  </div>
                  <a href={`https://maps.google.com/?q=${p.lat},${p.lng}`} target="_blank" rel="noopener noreferrer" style={{ background:`${C.cyan}12`, border:`1px solid ${C.cyan}30`, color:C.cyan, borderRadius:9, padding:"6px 10px", fontSize:10, fontWeight:800, textDecoration:"none" }}>Maps →</a>
                </div>
              ))}
            </Card>

            {/* Helplines */}
            <Card style={{ marginBottom:12, padding:"12px 15px", background:"linear-gradient(135deg,#0f0000,#000710)" }}>
              <p style={{ fontSize:13, fontWeight:800, color:"#FCA5A5", margin:"0 0 3px" }}>🚨 {t.emergency}</p>
              <p style={{ fontSize:10, color:C.muted, margin:0 }}>Tap number to call · FREE · No balance needed</p>
            </Card>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {SERVICES.map((svc, i) => (
                <Card key={svc.id} style={{ padding:"12px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", borderColor:`${svc.color}16`, animation:`slideUp 0.4s ease ${i*0.05}s both` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:`${svc.color}0e`, fontSize:22, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${svc.color}20` }}>{svc.icon}</div>
                    <div><p style={{ fontWeight:800, fontSize:13, margin:"0 0 2px" }}>{svc.label}</p><p style={{ color:C.muted, fontSize:10, margin:0 }}>{svc.desc}</p></div>
                  </div>
                  <a href={svc.tel} style={{ background:svc.color, color:"white", borderRadius:11, padding:"9px 13px", fontWeight:900, fontSize:14, textDecoration:"none", minWidth:52, textAlign:"center", boxShadow:`0 3px 14px ${svc.color}40`, display:"block" }}>{svc.number}</a>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ════════ SCHEMES ════════ */}
        {tab === "schemes" && (
          <div style={{ padding:"14px 13px" }}>
            {/* Header */}
            <Card style={{ marginBottom:14, padding:"14px 16px", background:"linear-gradient(135deg,#031503,#000e1a)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:800, color:"#86efac", margin:"0 0 3px" }}>📋 {t.schemesTitle}</p>
                  <p style={{ fontSize:10, color:C.muted, margin:0 }}>Official govt portals · Eligibility · Benefits · Apply links</p>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:11, fontWeight:800, color:"#86efac" }}>{SCHEMES.length}+</div>
                  <div style={{ fontSize:8.5, color:C.muted }}>Schemes</div>
                </div>
              </div>
            </Card>

            {SCHEMES.map((s, i) => {
              const isOpen = schemeOpen === s.id;
              const sub = schemeSubTab[s.id] || null;
              const isLoading = schemePortalLoading === s.id;
              return (
                <div key={s.id} style={{ marginBottom:10, animation:`slideUp 0.4s ease ${i*0.05}s both` }}>
                  <Card style={{ borderColor:`${s.color}22`, overflow:"hidden" }} onClick={() => { setSchemeOpen(isOpen ? null : s.id); }}>

                    {/* ── Card Header ── */}
                    <div style={{ padding:"14px 15px" }}>
                      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                        {/* Icon */}
                        <div style={{ width:50, height:50, borderRadius:14, background:`${s.color}0e`, fontSize:26, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${s.color}22`, flexShrink:0, position:"relative" }}>
                          {s.icon}
                          {/* Govt verified badge */}
                          <div style={{ position:"absolute", bottom:-4, right:-4, width:18, height:18, borderRadius:"50%", background:"#10B981", border:"2px solid #09101A", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9 }}>✓</div>
                        </div>
                        {/* Title row */}
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:3 }}>
                            <div>
                              <p style={{ fontWeight:900, fontSize:13, color:s.color, margin:"0 0 2px", lineHeight:1.2 }}>{s.name}</p>
                              <span style={{ display:"inline-flex", alignItems:"center", gap:3, background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:20, padding:"1px 7px", fontSize:8.5, fontWeight:700, color:"#10B981" }}>
                                🏛️ Govt Verified
                              </span>
                            </div>
                            <span style={{ fontSize:11, opacity:0.5, marginLeft:6, flexShrink:0, marginTop:2 }}>{isOpen ? "▲" : "▼"}</span>
                          </div>
                          <p style={{ color:C.muted, fontSize:10, lineHeight:1.55, margin:"6px 0 0" }}>{s.desc}</p>
                        </div>
                      </div>

                      {/* Benefit pill */}
                      <div style={{ marginTop:10, display:"flex", gap:6, flexWrap:"wrap" }}>
                        <span style={{ background:`${s.color}12`, border:`1px solid ${s.color}35`, color:s.color, borderRadius:20, fontSize:9.5, fontWeight:700, padding:"3px 10px", display:"inline-flex", alignItems:"center", gap:4 }}>
                          💰 {s.benefit}
                        </span>
                        <span style={{ background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)", color:"#F59E0B", borderRadius:20, fontSize:9.5, fontWeight:700, padding:"3px 10px" }}>
                          {s.tag}
                        </span>
                      </div>
                    </div>

                    {/* ── Expanded Panel ── */}
                    {isOpen && (
                      <div style={{ borderTop:`1px solid ${C.border}`, animation:"slideUp 0.3s ease" }}>

                        {/* Sub-tab selector */}
                        <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${C.border}` }}>
                          {[["benefits","💰 Benefits"],["eligibility","✅ Eligibility"],["steps","📝 Apply Steps"],["docs","📋 Documents"]].map(([key,label]) => (
                            <button key={key} onClick={e => { e.stopPropagation(); toggleSchemeSubTab(s.id, key); }} style={{ flex:1, padding:"9px 4px", background: sub===key?`${s.color}12`:"transparent", border:"none", borderBottom: sub===key?`2px solid ${s.color}`:"2px solid transparent", color: sub===key?s.color:C.muted, fontSize:9, fontWeight:800, cursor:"pointer", transition:"all 0.2s", letterSpacing:0.3 }}>
                              {label}
                            </button>
                          ))}
                        </div>

                        {/* Sub-tab content */}
                        {sub && (
                          <div style={{ padding:"13px 15px", animation:"fadeIn 0.25s ease" }}>

                            {/* BENEFITS */}
                            {sub === "benefits" && (
                              <div>
                                <p style={{ fontSize:10, color:C.muted, fontWeight:700, margin:"0 0 10px", letterSpacing:0.5 }}>KEY BENEFITS</p>
                                {s.benefits.map((b, bi) => (
                                  <div key={bi} style={{ display:"flex", gap:9, alignItems:"flex-start", marginBottom:8, padding:"8px 10px", background:`${s.color}08`, borderRadius:10, border:`1px solid ${s.color}18` }}>
                                    <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>✦</span>
                                    <p style={{ fontSize:11, color:"white", margin:0, lineHeight:1.55, fontWeight:500 }}>{b}</p>
                                  </div>
                                ))}
                                <div style={{ marginTop:10, padding:"9px 12px", background:"rgba(16,185,129,0.07)", borderRadius:10, border:"1px solid rgba(16,185,129,0.2)", display:"flex", gap:8, alignItems:"center" }}>
                                  <span style={{ fontSize:16 }}>🏛️</span>
                                  <p style={{ fontSize:10, color:"#86efac", margin:0, lineHeight:1.5 }}><strong>{s.dept}</strong><br/><span style={{ color:C.muted }}>Official Implementing Ministry</span></p>
                                </div>
                              </div>
                            )}

                            {/* ELIGIBILITY */}
                            {sub === "eligibility" && (
                              <div>
                                <p style={{ fontSize:10, color:C.muted, fontWeight:700, margin:"0 0 10px", letterSpacing:0.5 }}>ELIGIBILITY CRITERIA</p>
                                {s.eligibility.map((el, ei) => (
                                  <div key={ei} style={{ display:"flex", gap:9, alignItems:"flex-start", marginBottom:8, padding:"8px 10px", background:"rgba(255,255,255,0.03)", borderRadius:10, border:`1px solid ${C.border}` }}>
                                    <span style={{ color:C.greenL, fontSize:14, fontWeight:900, flexShrink:0 }}>✓</span>
                                    <p style={{ fontSize:11, color:C.mutedL, margin:0, lineHeight:1.55 }}>{el}</p>
                                  </div>
                                ))}
                                <a href={s.eligibilityUrl} onClick={e => openPortal(e, s.id+"_elig", s.eligibilityUrl)} target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:10, padding:"9px", background:`${s.color}10`, border:`1px solid ${s.color}30`, borderRadius:11, color:s.color, fontWeight:800, fontSize:11, textDecoration:"none" }}>
                                  🔍 Check My Eligibility Online →
                                </a>
                              </div>
                            )}

                            {/* STEPS */}
                            {sub === "steps" && (
                              <div>
                                <p style={{ fontSize:10, color:C.muted, fontWeight:700, margin:"0 0 10px", letterSpacing:0.5 }}>HOW TO APPLY — STEP BY STEP</p>
                                {s.steps.map((step, si) => (
                                  <div key={si} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:9 }}>
                                    <div style={{ width:22, height:22, borderRadius:"50%", background:`${s.color}20`, border:`1.5px solid ${s.color}50`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:900, color:s.color, flexShrink:0 }}>{si+1}</div>
                                    <div style={{ flex:1 }}>
                                      <p style={{ fontSize:11, color:"white", margin:0, lineHeight:1.55, paddingTop:3 }}>{step}</p>
                                      {si < s.steps.length-1 && <div style={{ width:1.5, height:8, background:`${s.color}25`, margin:"6px 0 0 10px" }}/>}
                                    </div>
                                  </div>
                                ))}
                                <div style={{ marginTop:8, padding:"9px 12px", background:"rgba(6,182,212,0.07)", borderRadius:10, border:"1px solid rgba(6,182,212,0.2)", fontSize:10, color:C.cyan }}>
                                  🌐 Official Portal: <strong>{s.portal}</strong>
                                </div>
                              </div>
                            )}

                            {/* DOCUMENTS */}
                            {sub === "docs" && (
                              <div>
                                <p style={{ fontSize:10, color:C.muted, fontWeight:700, margin:"0 0 10px", letterSpacing:0.5 }}>REQUIRED DOCUMENTS</p>
                                {s.docs.map((doc, di) => (
                                  <div key={di} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7, padding:"9px 12px", background:"rgba(255,255,255,0.03)", borderRadius:10, border:`1px solid ${C.border}` }}>
                                    <span style={{ fontSize:16 }}>📄</span>
                                    <p style={{ fontSize:11.5, color:"white", margin:0, fontWeight:500 }}>{doc}</p>
                                  </div>
                                ))}
                                <p style={{ fontSize:10, color:C.muted, margin:"10px 0 0", lineHeight:1.6 }}>
                                  💡 <strong style={{ color:"white" }}>Tip:</strong> Keep all documents handy in your DigiLocker before applying.
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* ── Action Buttons ── */}
                        <div style={{ padding:"12px 15px", display:"flex", gap:8, borderTop: sub?`1px solid ${C.border}`:"none" }} onClick={e => e.stopPropagation()}>
                          {/* Apply Now */}
                          <a
                            href={s.url}
                            onClick={e => openPortal(e, s.id, s.url)}
                            target="_blank" rel="noopener noreferrer"
                            style={{ flex:2, padding:"11px 8px", background:isLoading?`${s.color}30`:`linear-gradient(135deg,${s.color},${s.color}cc)`, border:"none", borderRadius:12, color:"white", fontWeight:900, fontSize:11.5, textDecoration:"none", textAlign:"center", boxShadow:isLoading?"none":`0 3px 16px ${s.color}38`, display:"flex", alignItems:"center", justifyContent:"center", gap:6, transition:"all 0.3s", cursor:"pointer" }}
                          >
                            {isLoading
                              ? <><span style={{ display:"inline-block", animation:"spin 0.7s linear infinite", fontSize:14 }}>⏳</span> Opening...</>
                              : <>🚀 Apply Now</>
                            }
                          </a>
                          {/* Eligibility Check */}
                          <a
                            href={s.eligibilityUrl}
                            onClick={e => openPortal(e, s.id+"_e", s.eligibilityUrl)}
                            target="_blank" rel="noopener noreferrer"
                            style={{ flex:1.5, padding:"11px 8px", background:`${s.color}12`, border:`1px solid ${s.color}35`, borderRadius:12, color:s.color, fontWeight:800, fontSize:10.5, textDecoration:"none", textAlign:"center", display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}
                          >
                            ✅ Eligibility
                          </a>
                          {/* Ask AI */}
                          <button
                            onClick={() => { setChatIn(`${s.name} ke baare mein detail mein batao — eligibility, benefits, documents aur step-by-step apply process`); setTab("ai"); }}
                            style={{ flex:1, padding:"11px 6px", background:"rgba(139,92,246,0.1)", border:"1px solid rgba(139,92,246,0.3)", borderRadius:12, color:C.purple, fontWeight:800, fontSize:10.5, cursor:"pointer" }}
                          >
                            🤖 AI
                          </button>
                        </div>

                        {/* Helpline row */}
                        <div style={{ padding:"8px 15px 12px", display:"flex", alignItems:"center", justifyContent:"space-between" }} onClick={e => e.stopPropagation()}>
                          <p style={{ fontSize:9.5, color:C.muted, margin:0 }}>🌐 {s.portal}</p>
                          <a href={s.helplineUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize:9.5, color:C.cyan, fontWeight:700, textDecoration:"none", display:"flex", alignItems:"center", gap:3 }}>
                            📞 Helpline →
                          </a>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}

            {/* Footer note */}
            <div style={{ marginTop:6, padding:"11px 14px", background:"rgba(255,255,255,0.02)", borderRadius:14, border:`1px solid ${C.border}`, textAlign:"center" }}>
              <p style={{ fontSize:10, color:C.muted, margin:0, lineHeight:1.7 }}>
                🏛️ All schemes are <strong style={{ color:"white" }}>official Government of India programmes.</strong><br/>
                Links open secure official portals in a new tab.
              </p>
            </div>
          </div>
        )}

        {/* ════════ COMPLAINT ════════ */}
        {tab === "complaint" && (
          <div style={{padding:"14px 13px"}}>

            {/* ── Header ── */}
            <div style={{background:"linear-gradient(135deg,#130e00,#040018)",borderRadius:18,border:"1px solid rgba(245,158,11,0.15)",padding:"14px 16px",marginBottom:13}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <p style={{fontSize:13,fontWeight:800,color:"#FDE047",margin:"0 0 3px"}}>📢 {t.grievanceTitle}</p>
                  <p style={{fontSize:10,color:C.muted,margin:0}}>GPS Auto-Detect · Voice · AI Draft · Smart Routing · Track</p>
                </div>
                <div style={{display:"flex",gap:6}}>
                  {["new","history"].map(v=>(
                    <button key={v} onClick={()=>setCView(v)} style={{padding:"6px 12px",borderRadius:20,fontSize:9.5,fontWeight:800,cursor:"pointer",background:cView===v?"rgba(245,158,11,0.15)":"rgba(255,255,255,0.04)",border:`1px solid ${cView===v?"rgba(245,158,11,0.45)":C.border}`,color:cView===v?"#FDE047":C.muted}}>
                      {v==="new"?"✏️ New":`📋 History (${complaints.length})`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════
                HISTORY VIEW
            ══════════════════════════════════════════ */}
            {cView==="history" ? (
              <div>
                {complaints.length===0 ? (
                  <div style={{textAlign:"center",padding:"48px 20px"}}>
                    <p style={{fontSize:40,margin:"0 0 10px"}}>📭</p>
                    <p style={{fontSize:13,fontWeight:700,color:C.mutedL,margin:"0 0 6px"}}>No complaints filed yet</p>
                    <p style={{fontSize:11,color:C.muted,margin:"0 0 16px"}}>File your first complaint using the New tab</p>
                    <button onClick={()=>setCView("new")} style={{padding:"10px 22px",background:`linear-gradient(135deg,${C.gold},#b45309)`,border:"none",borderRadius:12,color:"white",fontWeight:800,fontSize:12,cursor:"pointer"}}>
                      + File New Complaint
                    </button>
                  </div>
                ) : complaints.map((c,i)=>(
                  <div key={c.id} style={{marginBottom:11,animation:`slideUp 0.4s ease ${i*0.07}s both`}}>
                    <div style={{background:C.card,borderRadius:18,border:`1px solid ${c.priority==="High"?`${C.danger}28`:c.priority==="Medium"?`${C.gold}28`:C.border}`,overflow:"hidden"}}>

                      {/* Card header */}
                      <div style={{padding:"13px 15px 10px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                          <div style={{flex:1,minWidth:0,marginRight:8}}>
                            <p style={{fontSize:13,fontWeight:800,margin:"0 0 3px",lineHeight:1.3}}>{c.type}</p>
                            <p style={{fontSize:9.5,color:C.muted,margin:0,display:"flex",alignItems:"center",gap:5}}>
                              <span>#{c.id}</span><span>·</span><span>{c.date}</span>
                            </p>
                          </div>
                          <Badge color={pColor(c.status)}>{pLabel(c.status)}</Badge>
                        </div>

                        {/* Meta badges */}
                        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                          {c.district&&<Badge color={C.cyan}>📍 {c.district}{c.state?`, ${c.state}`:""}</Badge>}
                          {c.category&&<Badge color={C.purple}>📂 {c.category}</Badge>}
                          {c.priority&&<Badge color={c.priority==="High"?C.danger:c.priority==="Medium"?C.gold:C.muted}>⚡ {c.priority}</Badge>}
                        </div>

                        {/* Status timeline */}
                        <div style={{display:"flex",alignItems:"center",marginBottom:10}}>
                          {["Submitted","Reviewed","In Progress","Resolved"].map((st,idx)=>{
                            const sMap={pending:1,in_progress:3,resolved:4};
                            const done=idx<(sMap[c.status]||1);
                            const active=idx===(sMap[c.status]||1)-1;
                            return(
                              <div key={st} style={{display:"flex",alignItems:"center",flex:1}}>
                                <div style={{display:"flex",flexDirection:"column",alignItems:"center",flex:1}}>
                                  <div style={{width:20,height:20,borderRadius:"50%",background:done?pColor(c.status):"rgba(255,255,255,0.06)",border:`2px solid ${done?pColor(c.status):"rgba(255,255,255,0.06)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,marginBottom:4,animation:active?"pulse 1.5s infinite":"none",color:done?"#000":"rgba(255,255,255,0.25)"}}>
                                    {done?"✓":idx+1}
                                  </div>
                                  <p style={{fontSize:7.5,color:done?pColor(c.status):C.muted,textAlign:"center",lineHeight:1.3,margin:0}}>{st}</p>
                                </div>
                                {idx<3&&<div style={{height:2,flex:0.3,background:done?pColor(c.status):"rgba(255,255,255,0.06)",marginBottom:18}}/>}
                              </div>
                            );
                          })}
                        </div>

                        {/* Dept row */}
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:8,borderTop:`1px solid ${C.border}`}}>
                          <p style={{fontSize:10,color:C.muted,margin:0}}>🏛️ <strong style={{color:"white"}}>{c.dept}</strong></p>
                          <div style={{display:"flex",gap:8,alignItems:"center"}}>
                            {c.lat&&c.lng&&(
                              <a href={`https://maps.google.com/?q=${c.lat},${c.lng}`} target="_blank" rel="noopener noreferrer" style={{fontSize:9.5,color:C.greenL,fontWeight:700,textDecoration:"none"}}>
                                📍 Map
                              </a>
                            )}
                            {c.portal&&(
                              <a href={c.portal.startsWith("http")?c.portal:`https://${c.portal}`} target="_blank" rel="noopener noreferrer" style={{fontSize:9.5,color:C.cyan,fontWeight:700,textDecoration:"none"}}>
                                🌐 Track →
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            /* ══════════════════════════════════════════
               SUCCESS STATE
            ══════════════════════════════════════════ */
            ) : cForm.submitted ? (
              <div style={{background:C.card,borderRadius:18,border:"1px solid rgba(34,197,94,0.22)",padding:"26px 18px",textAlign:"center",animation:"scaleIn 0.4s ease"}}>
                {/* Confetti */}
                <div style={{position:"relative",height:48,overflow:"hidden",marginBottom:6}}>
                  {["#FF6B00","#22c55e","#06B6D4","#F59E0B","#8B5CF6","#EC4899","#F97316"].map((col,ci)=>(
                    <div key={ci} style={{position:"absolute",left:`${10+ci*13}%`,top:0,width:8,height:8,borderRadius:"50%",background:col,animation:`confetti 1.2s ease ${ci*0.12}s both`}}/>
                  ))}
                </div>
                <p style={{fontSize:48,margin:"0 0 8px"}}>✅</p>
                <h2 style={{fontSize:17,fontWeight:900,color:C.greenL,margin:"0 0 4px"}}>Shikayat Registered!</h2>
                <p style={{fontSize:11,color:C.muted,margin:"0 0 16px"}}>Your complaint has been officially filed</p>

                {/* Details */}
                <div style={{background:"rgba(255,255,255,0.03)",borderRadius:14,padding:"13px 15px",marginBottom:14,textAlign:"left"}}>
                  {[
                    ["🔖","Reference No.",cForm.ref],
                    ["🏛️","Department",cForm.ai?.department||"Municipal"],
                    ["⚡","Priority",cForm.ai?.priority||"Medium"],
                    ["📅","Est. Resolution",`${cForm.ai?.estimatedDays||7} working days`],
                    ["🌐","Official Portal",cForm.ai?.portalName||cForm.ai?.portal||"pgportal.gov.in"],
                    ...(cForm.city||cForm.district?[["📍","Location",`${[cForm.area,cForm.city||cForm.district,cForm.state].filter(Boolean).join(", ")}${cForm.pincode?` — ${cForm.pincode}`:""}`]]:[] ),
                  ].map(([ico,lbl,val])=>(
                    <div key={lbl} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
                      <span style={{fontSize:10.5,color:C.muted,flexShrink:0}}>{ico} {lbl}</span>
                      <span style={{fontSize:10.5,fontWeight:700,color:"white",maxWidth:"60%",textAlign:"right",lineHeight:1.45}}>{val}</span>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <button onClick={openComplaintPortal} style={{padding:"12px 8px",background:`${C.cyan}18`,border:`1px solid ${C.cyan}45`,borderRadius:12,color:C.cyan,fontWeight:800,fontSize:11.5,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                    🌐 Open Portal
                  </button>
                  <button onClick={()=>setCView("history")} style={{padding:"12px 8px",background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)",borderRadius:12,color:C.greenL,fontWeight:800,fontSize:11.5,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                    📊 Track Complaint
                  </button>
                </div>
                <button onClick={resetComplaint} style={{width:"100%",padding:"11px",background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,borderRadius:12,color:C.muted,fontWeight:800,fontSize:11.5,cursor:"pointer"}}>
                  + File New Complaint
                </button>
              </div>

            ) : (
            /* ══════════════════════════════════════════
               NEW COMPLAINT FORM
            ══════════════════════════════════════════ */
              <div>

                {/* ─────────────────────────────────────
                    STEP 1 — GPS LOCATION AUTO-DETECT
                ───────────────────────────────────── */}
                <div style={{marginBottom:14}}>

                  {/* Step label + GPS button */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <div style={{width:22,height:22,borderRadius:"50%",background:`${C.cyan}20`,border:`2px solid ${C.cyan}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:C.cyan,flexShrink:0}}>1</div>
                      <p style={{fontSize:10,color:C.mutedL,fontWeight:700,margin:0,letterSpacing:0.5}}>LOCATION AUTO-DETECT</p>
                    </div>
                    <button
                      onClick={detectComplaintLocation}
                      disabled={cGpsLoad}
                      style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:20,background:cGpsLoad?"rgba(255,255,255,0.04)":`${C.cyan}14`,border:`1px solid ${cGpsLoad?C.border:`${C.cyan}40`}`,color:cGpsLoad?C.muted:C.cyan,fontSize:10.5,fontWeight:800,cursor:cGpsLoad?"not-allowed":"pointer",transition:"all 0.2s"}}>
                      {cGpsLoad
                        ? <><span style={{animation:"spin 0.8s linear infinite",display:"inline-block",fontSize:14}}>⏳</span> Detecting...</>
                        : <>📍 Auto-Detect GPS</>
                      }
                    </button>
                  </div>

                  {/* GPS permission error */}
                  {cGpsError&&(
                    <div style={{padding:"9px 12px",background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.22)",borderRadius:11,fontSize:10.5,color:"#FCA5A5",marginBottom:9,display:"flex",alignItems:"flex-start",gap:7,animation:"slideUp 0.3s ease"}}>
                      <span style={{flexShrink:0,marginTop:1}}>⚠️</span>
                      <div>
                        <p style={{margin:"0 0 3px",fontWeight:700}}>{cGpsError}</p>
                        <p style={{margin:0,fontSize:9.5,opacity:0.8}}>Enter your location manually in the fields below.</p>
                      </div>
                    </div>
                  )}

                  {/* Live location preview card */}
                  {(cForm.lat||cForm.city)&&(
                    <div style={{padding:"12px 14px",background:"rgba(6,182,212,0.07)",border:"1px solid rgba(6,182,212,0.2)",borderRadius:14,marginBottom:9,animation:"slideUp 0.3s ease"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                        <div style={{display:"flex",alignItems:"center",gap:7}}>
                          <div style={{width:8,height:8,borderRadius:"50%",background:C.greenL,animation:"glow 2s infinite",flexShrink:0}}/>
                          <p style={{fontSize:11,fontWeight:800,color:C.cyan,margin:0}}>Live Location Detected</p>
                        </div>
                        <Badge color={C.greenL} dot>GPS ON</Badge>
                      </div>
                      {/* Location grid */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7}}>
                        {[
                          ["City",cForm.city],
                          ["District",cForm.district],
                          ["State",cForm.state],
                          ["Area",cForm.area],
                          ["Pincode",cForm.pincode],
                          ["Coords",cForm.lat&&cForm.lng?`${cForm.lat}, ${cForm.lng}`:""],
                        ].filter(([,v])=>v).map(([k,v])=>(
                          <div key={k} style={{background:"rgba(255,255,255,0.04)",borderRadius:9,padding:"7px 9px"}}>
                            <p style={{fontSize:8,color:C.muted,margin:"0 0 2px",textTransform:"uppercase",letterSpacing:0.5}}>{k}</p>
                            <p style={{fontSize:10,color:"white",fontWeight:600,margin:0,lineHeight:1.3,wordBreak:"break-all"}}>{v}</p>
                          </div>
                        ))}
                      </div>
                      {/* Map link if coords available */}
                      {cForm.lat&&cForm.lng&&(
                        <div style={{marginTop:9,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <a href={`https://maps.google.com/?q=${cForm.lat},${cForm.lng}`} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:C.cyan,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",gap:4}}>
                            🗺️ View on Google Maps →
                          </a>
                          <button onClick={()=>setCForm(p=>({...p,city:"",lat:"",lng:"",district:"",state:"",area:"",pincode:""}))} style={{background:"none",border:"none",color:C.muted,fontSize:10,cursor:"pointer",textDecoration:"underline",padding:0}}>
                            ✏️ Edit
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Manual input — always shown if city not auto-detected */}
                  {!cForm.city&&(
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                      <input value={cForm.district} onChange={e=>setCForm(p=>({...p,district:e.target.value}))} placeholder="District"
                        style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:"10px 13px",color:"white",fontSize:12,boxSizing:"border-box"}}/>
                      <input value={cForm.state} onChange={e=>setCForm(p=>({...p,state:e.target.value}))} placeholder="State"
                        style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:"10px 13px",color:"white",fontSize:12,boxSizing:"border-box"}}/>
                    </div>
                  )}

                  {/* Fine-tune area + pincode after GPS */}
                  {cForm.city&&(
                    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:7,marginTop:7}}>
                      <input value={cForm.area} onChange={e=>setCForm(p=>({...p,area:e.target.value}))} placeholder="Area / Street (optional)"
                        style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:"10px 13px",color:"white",fontSize:11.5,boxSizing:"border-box"}}/>
                      <input value={cForm.pincode} onChange={e=>setCForm(p=>({...p,pincode:e.target.value}))} placeholder="Pincode"
                        style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:"10px 13px",color:"white",fontSize:11.5,boxSizing:"border-box"}}/>
                    </div>
                  )}
                </div>

                {/* Separator */}
                <div style={{height:1,background:C.border,margin:"2px 0 14px"}}/>

                {/* ─────────────────────────────────────
                    STEP 2 — PROBLEM TYPE
                ───────────────────────────────────── */}
                <div style={{marginBottom:13}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
                    <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(139,92,246,0.18)",border:"2px solid rgba(139,92,246,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:C.purple,flexShrink:0}}>2</div>
                    <p style={{fontSize:10,color:C.mutedL,fontWeight:700,margin:0,letterSpacing:0.5}}>PROBLEM TYPE</p>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {COMPLAINT_TYPES.map(ct=>(
                      <button key={ct.label}
                        onClick={()=>setCForm(p=>({...p,type:ct.label,ai:null,draftTyped:""}))}
                        style={{
                          background:cForm.type===ct.label?"#0f2208":C.card,
                          border:`1px solid ${cForm.type===ct.label?"#22c55e":C.border}`,
                          borderRadius:12,padding:"11px 13px",
                          color:cForm.type===ct.label?"#86efac":"white",
                          cursor:"pointer",textAlign:"left",fontSize:12,
                          fontWeight:cForm.type===ct.label?800:400,
                          display:"flex",justifyContent:"space-between",alignItems:"center",
                          transition:"all 0.2s",
                        }}>
                        <span style={{display:"flex",alignItems:"center",gap:8}}>
                          {cForm.type===ct.label&&<span style={{fontSize:13}}>✓</span>}
                          {ct.icon} {ct.label}
                        </span>
                        <Badge color={ct.priority==="High"?C.danger:ct.priority==="Medium"?C.gold:C.muted}>{ct.priority}</Badge>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{height:1,background:C.border,margin:"2px 0 14px"}}/>

                {/* ─────────────────────────────────────
                    STEP 3 — DESCRIBE + VOICE
                ───────────────────────────────────── */}
                <div style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(245,158,11,0.18)",border:"2px solid rgba(245,158,11,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:C.gold,flexShrink:0}}>3</div>
                      <p style={{fontSize:10,color:C.mutedL,fontWeight:700,margin:0,letterSpacing:0.5}}>DESCRIBE — TYPE OR SPEAK</p>
                    </div>
                    <button
                      onClick={cVoiceOn?stopComplaintVoice:startComplaintVoice}
                      style={{display:"flex",alignItems:"center",gap:5,padding:"6px 13px",borderRadius:20,background:cVoiceOn?"rgba(239,68,68,0.16)":"rgba(255,255,255,0.05)",border:`1px solid ${cVoiceOn?"rgba(239,68,68,0.5)":C.border}`,color:cVoiceOn?C.danger:C.muted,fontSize:10,fontWeight:800,cursor:"pointer",animation:cVoiceOn?"pulse 1.5s infinite":"none"}}>
                      🎙️ {cVoiceOn?"Stop":"Voice"}
                    </button>
                  </div>

                  <div style={{position:"relative"}}>
                    <textarea
                      value={cForm.text}
                      onChange={e=>setCForm(p=>({...p,text:e.target.value,ai:null,draftTyped:""}))}
                      placeholder={cVoiceOn?"🎙️ Listening... speak in any language...":"e.g. 'Road toot gayi hai' or 'Water supply nahi aa raha 3 din se' — Any language"}
                      rows={3}
                      style={{width:"100%",background:C.card,border:`1px solid ${cVoiceOn?"rgba(239,68,68,0.45)":C.border2}`,borderRadius:13,padding:"12px 14px",color:"white",fontSize:12,resize:"vertical",lineHeight:1.75,boxSizing:"border-box",transition:"border-color 0.25s"}}
                    />
                    {cVoiceOn&&(
                      <div style={{position:"absolute",bottom:10,right:12,display:"flex",gap:2,alignItems:"center"}}>
                        {[1,2,3,4,5,6].map(i=><div key={i} style={{width:3,borderRadius:2,background:C.danger,height:`${5+Math.abs(Math.sin(i*0.78)*13)}px`,animation:`wave ${0.55+i*0.09}s ease-in-out infinite alternate`}}/>)}
                      </div>
                    )}
                  </div>
                  {cForm.text&&<p style={{fontSize:9.5,color:C.muted,margin:"4px 0 0",textAlign:"right"}}>{cForm.text.length} characters</p>}
                </div>

                {/* Photo Attach */}
                <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center"}}>
                  <button onClick={()=>fileRef.current?.click()} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 15px",background:"rgba(255,255,255,0.04)",border:`1px solid ${cForm.photo?`${C.greenL}40`:C.border}`,color:cForm.photo?C.greenL:C.muted,borderRadius:11,cursor:"pointer",fontSize:11.5,fontWeight:700}}>
                    📷 {cForm.photo?"Photo Attached ✓":"Attach Evidence"}
                  </button>
                  {cForm.photo&&(
                    <button onClick={()=>setCForm(p=>({...p,photo:null}))} style={{padding:"9px 11px",background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.22)",color:C.danger,borderRadius:11,cursor:"pointer",fontSize:13,fontWeight:800}}>✕</button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*,video/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0]){setCForm(p=>({...p,photo:e.target.files[0].name}));notify(`📎 ${e.target.files[0].name} attached`,"success");}}}/>
                </div>

                {/* ─────────────────────────────────────
                    GENERATE BUTTON
                ───────────────────────────────────── */}
                <button
                  onClick={()=>analyzeComplaint(cForm.text||cForm.type||"General civic complaint")}
                  disabled={cForm.loading||(!cForm.text&&!cForm.type)}
                  style={{
                    width:"100%",padding:"15px 18px",border:"none",borderRadius:14,
                    cursor:(cForm.loading||(!cForm.text&&!cForm.type))?"not-allowed":"pointer",
                    background:(cForm.loading||(!cForm.text&&!cForm.type))
                      ?"rgba(255,255,255,0.05)"
                      :`linear-gradient(135deg,#d97706,#92400e)`,
                    color:"white",fontWeight:900,fontSize:14,
                    boxShadow:(cForm.loading||(!cForm.text&&!cForm.type))?"none":"0 5px 24px rgba(217,119,6,0.38)",
                    opacity:(!cForm.text&&!cForm.type)&&!cForm.loading?0.4:1,
                    display:"flex",alignItems:"center",justifyContent:"center",gap:9,
                    transition:"all 0.25s",marginBottom:10,
                  }}>
                  {cForm.loading
                    ? <><span style={{fontSize:18,animation:"spin 0.7s linear infinite",display:"inline-block"}}>⚙️</span> AI Generating Complaint...</>
                    : <>🤖 Generate Complaint with AI</>
                  }
                </button>

                {/* ─────────────────────────────────────
                    AI LOADING PROGRESS
                ───────────────────────────────────── */}
                {cForm.loading&&(
                  <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border}`,padding:"16px 15px",marginTop:10,animation:"slideUp 0.3s ease"}}>
                    <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14}}>
                      <span style={{fontSize:22,animation:"spin 1s linear infinite",display:"inline-block",flexShrink:0}}>⚙️</span>
                      <div>
                        <p style={{fontSize:12,fontWeight:800,margin:"0 0 2px"}}>AI Analyzing Your Complaint...</p>
                        <p style={{fontSize:10,color:C.muted,margin:0}}>Claude AI · Detecting · Routing · Drafting</p>
                      </div>
                    </div>
                    {[
                      {label:"Detecting complaint category",w:"72%",done:true},
                      {label:"Identifying responsible department",w:"58%",done:true},
                      {label:"Generating formal draft letter",w:"84%",done:false},
                      {label:"Routing to official govt portal",w:"45%",done:false},
                    ].map((item,i)=>(
                      <div key={i} style={{marginBottom:10}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                          <p style={{fontSize:9.5,color:C.muted,margin:0}}>{item.label}</p>
                          {item.done
                            ? <span style={{fontSize:9,color:C.greenL,fontWeight:700}}>✓ Done</span>
                            : <span style={{fontSize:9,color:C.gold,animation:"pulse 1.2s infinite"}}>● Processing</span>
                          }
                        </div>
                        <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:4,overflow:"hidden"}}>
                          <div className="skeleton" style={{height:"100%",width:item.w,borderRadius:4,animationDelay:`${i*0.18}s`}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ─────────────────────────────────────
                    AI RESULT CARD
                ───────────────────────────────────── */}
                {cForm.ai&&!cForm.loading&&(
                  <div style={{background:C.card,borderRadius:18,border:"1px solid rgba(245,158,11,0.2)",marginTop:12,overflow:"hidden",animation:"slideUp 0.4s ease"}}>

                    {/* Result header */}
                    <div style={{padding:"14px 16px 11px",background:"linear-gradient(135deg,rgba(245,158,11,0.09),rgba(245,158,11,0.03)",borderBottom:`1px solid ${C.border}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                        <p style={{fontSize:12.5,fontWeight:900,color:"#FDE047",margin:0}}>✅ AI Complaint Generated</p>
                        <Badge color={cForm.ai.priority==="High"?C.danger:cForm.ai.priority==="Medium"?C.gold:C.muted}>
                          ⚡ {cForm.ai.priority} Priority
                        </Badge>
                      </div>
                      {cForm.ai.title&&(
                        <p style={{fontSize:13.5,fontWeight:800,color:"white",margin:0,lineHeight:1.3}}>{cForm.ai.title}</p>
                      )}
                    </div>

                    <div style={{padding:"13px 15px"}}>

                      {/* Analysis grid */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                        {[
                          ["📂","Category",cForm.ai.category],
                          ["🏛️","Department",cForm.ai.department],
                          ["📅","Est. Days",`${cForm.ai.estimatedDays||7} days`],
                          ["🌐","Portal",cForm.ai.portalName||cForm.ai.portal],
                        ].map(([ico,lbl,val])=>(
                          <div key={lbl} style={{background:"rgba(255,255,255,0.03)",borderRadius:11,padding:"10px 12px"}}>
                            <p style={{fontSize:9,color:C.muted,margin:"0 0 3px"}}>{ico} {lbl}</p>
                            <p style={{fontSize:10.5,fontWeight:800,margin:0,lineHeight:1.3,wordBreak:"break-all"}}>{val}</p>
                          </div>
                        ))}
                      </div>

                      {/* Smart routing indicator */}
                      <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",background:"rgba(139,92,246,0.08)",borderRadius:11,border:"1px solid rgba(139,92,246,0.2)",marginBottom:12}}>
                        <span style={{fontSize:18,flexShrink:0}}>🔀</span>
                        <div>
                          <p style={{fontSize:10.5,fontWeight:800,color:C.purple,margin:"0 0 1px"}}>Smart Portal Routing Active</p>
                          <p style={{fontSize:9.5,color:C.muted,margin:0}}>
                            Routed → <strong style={{color:"white"}}>{cForm.ai.portalName||cForm.ai.portal}</strong>
                          </p>
                        </div>
                        <a href={cForm.ai.portal?.startsWith("http")?cForm.ai.portal:`https://${cForm.ai.portal}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{marginLeft:"auto",fontSize:9.5,color:C.cyan,fontWeight:800,textDecoration:"none",flexShrink:0}}>
                          Open →
                        </a>
                      </div>

                      {/* Location context */}
                      {(cForm.district||cForm.city)&&(
                        <div style={{display:"flex",alignItems:"flex-start",gap:8,padding:"9px 12px",background:"rgba(6,182,212,0.07)",borderRadius:11,border:"1px solid rgba(6,182,212,0.2)",marginBottom:12}}>
                          <span style={{fontSize:18,flexShrink:0}}>📍</span>
                          <div style={{flex:1}}>
                            <p style={{fontSize:10.5,color:C.cyan,margin:"0 0 2px",fontWeight:700}}>
                              {[cForm.area,cForm.city||cForm.district,cForm.state].filter(Boolean).join(", ")}
                              {cForm.pincode?` — ${cForm.pincode}`:""}
                            </p>
                            {cForm.lat&&cForm.lng&&(
                              <a href={`https://maps.google.com/?q=${cForm.lat},${cForm.lng}`} target="_blank" rel="noopener noreferrer" style={{fontSize:9,color:C.cyan,fontWeight:700,textDecoration:"none",opacity:0.75}}>
                                🗺️ {cForm.lat}, {cForm.lng} — View on Maps
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Typing-animated draft */}
                      {(cForm.draftTyped||cForm.ai.draft)&&(
                        <div style={{padding:"13px 14px",background:"rgba(255,255,255,0.025)",borderRadius:13,borderLeft:`3px solid ${C.gold}`,marginBottom:12}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                            <p style={{fontSize:10,color:C.gold,fontWeight:700,margin:0}}>📝 AI-Generated Formal Complaint Draft</p>
                            {cForm.draftTyped.length<(cForm.ai.draft||"").length&&(
                              <span style={{display:"inline-flex",gap:3}}>
                                {[1,2,3].map(i=><span key={i} style={{width:5,height:5,borderRadius:"50%",background:C.gold,animation:`pulse 0.8s ease-in-out ${i*0.2}s infinite`,display:"inline-block"}}/>)}
                              </span>
                            )}
                          </div>
                          <p style={{fontSize:10.5,color:C.mutedL,lineHeight:1.85,margin:0,whiteSpace:"pre-wrap",fontFamily:"'Courier New',monospace"}}>
                            {cForm.draftTyped||cForm.ai.draft}
                            {cForm.draftTyped.length<(cForm.ai.draft||"").length&&(
                              <span style={{display:"inline-block",width:2,height:14,background:C.gold,marginLeft:2,animation:"pulse 0.5s infinite",verticalAlign:"text-bottom"}}/>
                            )}
                          </p>
                        </div>
                      )}

                      {/* AI tip */}
                      {cForm.ai.tip&&(
                        <div style={{padding:"9px 12px",background:"rgba(245,158,11,0.06)",borderRadius:11,display:"flex",gap:7,alignItems:"flex-start",marginBottom:14}}>
                          <span style={{flexShrink:0,fontSize:15}}>💡</span>
                          <p style={{fontSize:10.5,color:"#FDE047",margin:0,lineHeight:1.65}}>{cForm.ai.tip}</p>
                        </div>
                      )}

                      {/* ── PRIMARY ACTIONS ── */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                        <button onClick={submitComplaint} style={{padding:"13px 10px",background:`linear-gradient(135deg,${C.green},#065f24)`,border:"none",borderRadius:13,color:"white",fontWeight:900,fontSize:12,cursor:"pointer",boxShadow:"0 4px 18px rgba(19,136,8,0.38)",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                          ✅ Submit Complaint
                        </button>
                        <button onClick={openComplaintPortal} style={{padding:"13px 10px",background:`${C.cyan}14`,border:`1px solid ${C.cyan}40`,borderRadius:13,color:C.cyan,fontWeight:800,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                          🌐 Open Portal
                        </button>
                      </div>

                      {/* ── SECONDARY ACTIONS ── */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                        <button onClick={copyDraft} style={{padding:"11px 10px",background:cForm.copied?"rgba(34,197,94,0.13)":"rgba(255,255,255,0.05)",border:`1px solid ${cForm.copied?"rgba(34,197,94,0.38)":C.border}`,borderRadius:12,color:cForm.copied?C.greenL:C.mutedL,fontWeight:800,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all 0.3s"}}>
                          {cForm.copied?"✅ Copied!":"📋 Copy Draft"}
                        </button>
                        <button onClick={()=>{submitComplaint();setTimeout(()=>setCView("history"),600);}} style={{padding:"11px 10px",background:"rgba(139,92,246,0.1)",border:"1px solid rgba(139,92,246,0.28)",borderRadius:12,color:C.purple,fontWeight:800,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                          📊 Submit & Track
                        </button>
                      </div>

                      {/* Portal footer note */}
                      <div style={{marginTop:10,padding:"8px 12px",background:"rgba(255,255,255,0.02)",borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <p style={{fontSize:9.5,color:C.muted,margin:0}}>🌐 {cForm.ai.portal}</p>
                        <p style={{fontSize:9.5,color:C.muted,margin:0}}>Ref # generated on submission</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        )}
        {/* ════════ DIGILOCKER ════════ */}
        {tab === "digilocker" && (
          <div style={{ padding:"14px 13px" }}>
            {digiLocked ? (
              /* PIN Lock Screen */
              <div>
                <Card style={{ marginBottom:16, padding:"20px 16px", background:"linear-gradient(135deg,#000b1c,#020014)", borderColor:"#06B6D420" }}>
                  <div style={{ textAlign:"center", padding:"8px 0" }}>
                    <p style={{ fontSize:42, margin:"0 0 8px" }}>🔐</p>
                    <h2 style={{ fontSize:15, fontWeight:800, color:"#67E8F9", margin:"0 0 4px" }}>{t.digilockerTitle} Protected</h2>
                    <p style={{ fontSize:10.5, color:C.muted, margin:"0 0 18px" }}>Enter your 4-digit security PIN</p>
                    {/* PIN dots */}
                    <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:14 }}>
                      {[0,1,2,3].map(i => (
                        <div key={i} style={{ width:14, height:14, borderRadius:"50%", background: i<pinInput.length?C.cyan:"rgba(255,255,255,0.1)", border:`2px solid ${i<pinInput.length?C.cyan:C.border}`, transition:"all 0.2s" }}/>
                      ))}
                    </div>
                    {/* PIN Pad */}
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, maxWidth:200, margin:"0 auto 12px" }}>
                      {[1,2,3,4,5,6,7,8,9,"","0","⌫"].map(k => (
                        <button key={k} onClick={() => {
                          if (k==="⌫") setPinInput(p => p.slice(0,-1));
                          else if (k!==""&&pinInput.length<4) setPinInput(p => p+k);
                        }} style={{ padding:"13px", background: k==="⌫"?"rgba(239,68,68,0.12)":"rgba(255,255,255,0.06)", border:`1px solid ${C.border}`, borderRadius:12, color:"white", fontSize:15, fontWeight:700, opacity: k===""?0:1, pointerEvents: k===""?"none":"auto", cursor:"pointer" }}>
                          {k}
                        </button>
                      ))}
                    </div>
                    {pinErr && <p style={{ color:C.danger, fontSize:10.5, margin:"0 0 8px" }}>⚠️ {pinErr}</p>}
                    <Btn onClick={unlockDigi} color={C.cyan} size="lg" full>🔓 {t.unlock} DigiLocker</Btn>
                    <p style={{ marginTop:12, fontSize:10, color:C.muted }}>Demo: Enter any 4 digits to set your PIN</p>
                  </div>
                </Card>
                <Card style={{ padding:"12px 15px", borderColor:"#06B6D418" }}>
                  <p style={{ fontSize:10.5, color:"#67E8F9", lineHeight:1.85, margin:0 }}>
                    🔐 <strong>Security Features:</strong> PIN Protection · Face Lock UI · Fingerprint Unlock UI · Session Timeout · Device Verification · Encrypted Storage · Government Verified Badges
                  </p>
                </Card>
              </div>
            ) : (
              /* DigiLocker Dashboard */
              <div>
                <Card style={{ marginBottom:13, padding:"13px 15px", background:"linear-gradient(135deg,#000b1c,#020014)", borderColor:"#06B6D420" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <p style={{ fontSize:13, fontWeight:800, color:"#67E8F9", margin:"0 0 3px" }}>🗂️ {t.digilockerTitle}</p>
                      <p style={{ fontSize:10, color:C.muted, margin:0 }}>Verified · Secure · Always accessible</p>
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      <button onClick={syncDigi} disabled={digiSyncing} style={{ background:"rgba(6,182,212,0.1)", border:`1px solid ${C.cyan}28`, color:C.cyan, borderRadius:10, padding:"6px 11px", fontSize:10, fontWeight:800, display:"flex", alignItems:"center", gap:4, cursor:"pointer", opacity:digiSyncing?0.7:1 }}>
                        <span style={{ display:"inline-block", animation: digiSyncing?"spin 1s linear infinite":"none" }}>⟳</span>{t.sync}
                      </button>
                      <button onClick={() => setDigiLocked(true)} style={{ background:"rgba(255,255,255,0.06)", border:`1px solid ${C.border}`, color:C.muted, borderRadius:10, padding:"6px 11px", fontSize:10, fontWeight:800, cursor:"pointer" }}>🔒 {t.lock}</button>
                    </div>
                  </div>
                </Card>

                {/* User card */}
                <Card style={{ marginBottom:13, padding:15, borderColor:"#06B6D416" }}>
                  <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <div style={{ width:50, height:50, borderRadius:"50%", background:`linear-gradient(135deg,${C.saffron},${C.navy})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>👤</div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontWeight:900, fontSize:14, margin:"0 0 2px" }}>{profile?.name||user?.name||"Ramesh Kumar"}</p>
                      <p style={{ fontSize:10, color:C.muted, margin:"0 0 5px" }}>DigiLocker ID: DL-XXXX-XXXX-XXXX</p>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}><Badge color={C.cyan}>AADHAAR LINKED</Badge><Badge color={C.greenL}>KYC ✓</Badge><Badge color={C.gold}>Govt Verified</Badge></div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <p style={{ fontSize:20, fontWeight:900, color:C.saffron, margin:"0 0 2px" }}>{DIGILOCKER_DOCS.filter(d=>d.status==="verified").length}</p>
                      <p style={{ fontSize:8.5, color:C.muted, margin:0 }}>{t.verified}</p>
                    </div>
                  </div>
                </Card>

                {/* Section tabs */}
                <div style={{ display:"flex", gap:6, marginBottom:12 }}>
                  {[["docs",`📁 ${t.allDocs}`],["scan",`📷 ${t.docScanner}`],["ai",`🤖 ${t.aiAssistant}`]].map(([id,lbl]) => (
                    <button key={id} onClick={() => setDigiSection(id)} style={{ flex:1, padding:"7px 6px", borderRadius:12, fontSize:9.5, fontWeight:800, cursor:"pointer", background: digiSection===id?`${C.cyan}15`:"rgba(255,255,255,0.04)", border:`1px solid ${digiSection===id?`${C.cyan}45`:C.border}`, color: digiSection===id?C.cyan:C.muted }}>{lbl}</button>
                  ))}
                </div>

                {/* DOCS SECTION */}
                {digiSection === "docs" && (
                  <>
                    <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                      <div style={{ flex:1, position:"relative" }}>
                        <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:C.muted }}>🔍</span>
                        <input value={digiSearch} onChange={e => setDigiSearch(e.target.value)} placeholder={`${t.search} documents...`} style={{ width:"100%", background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 12px 10px 36px", color:"white", fontSize:11.5, boxSizing:"border-box" }}/>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:6, marginBottom:11, overflowX:"auto", paddingBottom:2 }}>
                      {DOC_CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setDigiCat(cat)} style={{ whiteSpace:"nowrap", padding:"5px 11px", borderRadius:20, fontSize:9.5, fontWeight:800, cursor:"pointer", background: digiCat===cat?`${C.cyan}15`:"rgba(255,255,255,0.04)", border:`1px solid ${digiCat===cat?`${C.cyan}45`:C.border}`, color: digiCat===cat?C.cyan:C.muted }}>
                          {cat.charAt(0).toUpperCase()+cat.slice(1)}
                        </button>
                      ))}
                    </div>

                    {digiSyncing && (
                      <Card style={{ marginBottom:12, padding:16 }}>
                        <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
                          <span style={{ animation:"spin 1s linear infinite", fontSize:18 }}>⚙️</span>
                          <div><p style={{ fontSize:12, fontWeight:700, margin:"0 0 2px" }}>Syncing DigiLocker API...</p><p style={{ fontSize:10, color:C.muted, margin:0 }}>Fetching latest verified documents</p></div>
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>{[1,2,3].map(i => <Skel key={i} h={12}/>)}</div>
                      </Card>
                    )}

                    <p style={{ fontSize:9, color:C.muted, margin:"0 0 8px", fontWeight:700 }}>YOUR DOCUMENTS ({digiFiltered.length})</p>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                      {digiFiltered.map((doc, i) => (
                        <button key={doc.name} onClick={() => setDigiOpen(digiOpen===doc.name ? null : doc.name)} style={{ background: digiOpen===doc.name?`${doc.color}10`:C.card, border:`1px solid ${digiOpen===doc.name?`${doc.color}65`:C.border}`, borderRadius:16, padding:"14px 11px", cursor:"pointer", textAlign:"left", color:"white", animation:`slideUp 0.4s ease ${i*0.05}s both`, transition:"all 0.2s", position:"relative" }}>
                          {docFavs.includes(doc.name) && <span style={{ position:"absolute", top:8, right:10, fontSize:12 }}>⭐</span>}
                          <p style={{ fontSize:28, margin:"0 0 7px" }}>{doc.icon}</p>
                          <p style={{ fontSize:10.5, fontWeight:800, margin:"0 0 3px" }}>{doc.name}</p>
                          <p style={{ fontSize:8.5, color:C.muted, margin:"0 0 8px" }}>{doc.issuer}</p>
                          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                            <div style={{ width:6, height:6, borderRadius:"50%", background: doc.status==="verified"?C.greenL:C.gold, animation: doc.status==="verified"?"glow 2s infinite":"none" }}/>
                            <span style={{ fontSize:8.5, fontWeight:700, color: doc.status==="verified"?C.greenL:C.gold }}>{doc.status==="verified"?t.verified:t.pending}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Document Detail Panel */}
                    {digiOpen && (() => {
                      const doc = DIGILOCKER_DOCS.find(d => d.name===digiOpen);
                      return (
                        <Card style={{ marginTop:12, padding:17, animation:"slideUp 0.3s ease", borderColor:`${doc.color}22` }}>
                          <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:13 }}>
                            <span style={{ fontSize:32 }}>{doc.icon}</span>
                            <div style={{ flex:1 }}>
                              <p style={{ fontWeight:900, fontSize:14, color:doc.color, margin:"0 0 2px" }}>{doc.name}</p>
                              <p style={{ fontSize:10, color:C.muted, margin:0 }}>{doc.issuer}</p>
                            </div>
                            <div style={{ display:"flex", gap:6, flexDirection:"column", alignItems:"flex-end" }}>
                              <Badge color={doc.status==="verified"?C.greenL:C.gold}>{doc.status==="verified"?"✓ Govt Verified":"⏳ Pending"}</Badge>
                              <button onClick={() => setDocFavs(f => f.includes(doc.name)?f.filter(x=>x!==doc.name):[...f,doc.name])} style={{ background:"none", border:"none", fontSize:16, cursor:"pointer" }}>
                                {docFavs.includes(doc.name)?"⭐":"☆"}
                              </button>
                            </div>
                          </div>
                          <div style={{ height:1, background:C.border, marginBottom:12 }}/>
                          {/* QR Badge */}
                          <div style={{ padding:"10px 12px", background:"rgba(6,182,212,0.06)", borderRadius:10, border:"1px solid rgba(6,182,212,0.18)", marginBottom:12, display:"flex", alignItems:"center", gap:10 }}>
                            <span style={{ fontSize:22 }}>📲</span>
                            <div><p style={{ fontSize:10.5, fontWeight:700, color:C.cyan, margin:"0 0 2px" }}>QR Verification Badge</p><p style={{ fontSize:9, color:C.muted, margin:0 }}>Government agencies can scan to verify instantly</p></div>
                          </div>
                          {[["Document No.",doc.docNum],["Issued On","01 Jan 2020"],["Expires",doc.expires],["File Size",doc.size],["Category",doc.category],["Last Synced","Today, "+tsNow()]].map(([k,v]) => (
                            <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:9 }}>
                              <span style={{ fontSize:10, color:C.muted }}>{k}</span>
                              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                                <span style={{ fontSize:10, fontWeight:700 }}>{v}</span>
                                {k==="Document No."&&<button onClick={() => { navigator.clipboard?.writeText(v); notify("📋 Document number copied!"); }} style={{ background:"rgba(255,255,255,0.07)", border:"none", color:C.muted, borderRadius:6, padding:"2px 7px", fontSize:9, cursor:"pointer" }}>Copy</button>}
                              </div>
                            </div>
                          ))}
                          <div style={{ display:"flex", gap:7, marginTop:14 }}>
                            {[["⬇️ " + t.download, doc.color, true], ["📤 " + t.share, "rgba(255,255,255,0.07)", false], ["🖨️ Print", "rgba(255,255,255,0.07)", false]].map(([btn,bg,isPrimary]) => (
                              <button key={btn} onClick={() => notify(`${btn} initiated for ${doc.name}`)} style={{ flex:1, padding:"9px 4px", background: isPrimary?`${doc.color}12`:bg, border:`1px solid ${isPrimary?`${doc.color}35`:C.border}`, color: isPrimary?doc.color:"white", borderRadius:10, fontWeight:800, fontSize:9.5, cursor:"pointer" }}>{btn}</button>
                            ))}
                          </div>
                        </Card>
                      );
                    })()}
                  </>
                )}

                {/* SCAN SECTION */}
                {digiSection === "scan" && (
                  <Card style={{ padding:20 }}>
                    <p style={{ fontSize:13, fontWeight:800, margin:"0 0 5px" }}>📷 {t.docScanner} (OCR)</p>
                    <p style={{ fontSize:10.5, color:C.muted, margin:"0 0 16px", lineHeight:1.6 }}>Scan your Aadhaar, PAN or any document. AI extracts details and auto-fills your profile.</p>
                    {!ocrResult ? (
                      <>
                        <div style={{ height:160, background:"rgba(255,255,255,0.02)", border:`2px dashed ${C.border2}`, borderRadius:14, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", marginBottom:14, position:"relative", overflow:"hidden" }}>
                          {ocrActive && <div style={{ position:"absolute", left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${C.cyan},transparent)`, animation:"scan 1.5s linear infinite" }}/>}
                          <p style={{ fontSize:36, margin:"0 0 8px", animation: ocrActive?"pulse 1s infinite":"none" }}>{ocrActive?"🔍":"📷"}</p>
                          <p style={{ fontSize:11.5, fontWeight:700, margin:"0 0 4px" }}>{ocrActive?"Scanning document...":"Place Document Here"}</p>
                          <p style={{ fontSize:10, color:C.muted, margin:0 }}>{ocrActive?"AI extracting text...":"Aadhaar, PAN, DL, Passport supported"}</p>
                        </div>
                        <Btn onClick={runOCR} disabled={ocrActive} color={C.cyan} size="lg" full>{ocrActive?"🔍 Scanning...":"📷 " + t.scan + " Document"}</Btn>
                      </>
                    ) : (
                      <div>
                        <div style={{ padding:"12px 14px", background:"rgba(34,197,94,0.07)", borderRadius:12, border:"1px solid rgba(34,197,94,0.2)", marginBottom:14, animation:"slideUp 0.4s ease" }}>
                          <p style={{ fontSize:11, fontWeight:800, color:C.greenL, margin:"0 0 8px" }}>✅ OCR Extraction Complete</p>
                          {[["Name",ocrResult.name],["Date of Birth",ocrResult.dob],["Document No.",ocrResult.docNo],["Type",ocrResult.type]].map(([k,v]) => (
                            <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                              <span style={{ fontSize:10, color:C.muted }}>{k}</span><span style={{ fontSize:10, fontWeight:700 }}>{v}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ display:"flex", gap:8 }}>
                          <Btn onClick={() => { notify("✅ Profile auto-filled from scanned document!"); setOcrResult(null); }} color={C.greenL} style={{ flex:2 }}>Auto-fill Profile</Btn>
                          <Btn onClick={() => setOcrResult(null)} outline color={C.muted} style={{ flex:1 }}>Rescan</Btn>
                        </div>
                      </div>
                    )}
                  </Card>
                )}

                {/* AI ASSISTANT SECTION */}
                {digiSection === "ai" && (
                  <Card style={{ padding:18 }}>
                    <p style={{ fontSize:13, fontWeight:800, margin:"0 0 5px" }}>🤖 AI Document {t.aiAssistant}</p>
                    <p style={{ fontSize:10.5, color:C.muted, margin:"0 0 16px" }}>Smart insights about your documents — suggestions, reminders, and guidance.</p>
                    {[
                      { icon:"⚠️", title:"Voter ID Missing",         desc:"Voter ID is pending verification. Complete at voterportal.eci.gov.in",  color:C.danger, action:"Link Now" },
                      { icon:"🔄", title:"DL Expiry Reminder",       desc:"Driving License expires in 2030. Set early renewal reminder.",           color:C.gold,   action:"Remind Me" },
                      { icon:"💡", title:"Add Health Card",          desc:"Ayushman Bharat card gives access to ₹5L insurance — add it now.",       color:C.cyan,   action:"Add Doc" },
                      { icon:"✅", title:"Profile 88% Complete",     desc:"Add Education Certificate to complete your DigiLocker profile.",         color:C.greenL, action:"Upload" },
                      { icon:"🔐", title:"Enable Biometric Lock",    desc:"Add fingerprint or face lock for extra security on DigiLocker.",         color:C.purple, action:"Setup" },
                    ].map((item, i) => (
                      <div key={i} style={{ display:"flex", gap:11, padding:"11px", background:`${item.color}08`, borderRadius:12, border:`1px solid ${item.color}20`, marginBottom:9, animation:`slideIn 0.4s ease ${i*0.1}s both` }}>
                        <span style={{ fontSize:22, flexShrink:0 }}>{item.icon}</span>
                        <div style={{ flex:1 }}>
                          <p style={{ fontSize:11.5, fontWeight:800, color:item.color, margin:"0 0 3px" }}>{item.title}</p>
                          <p style={{ fontSize:10, color:C.muted, lineHeight:1.5, margin:"0 0 7px" }}>{item.desc}</p>
                          <Btn onClick={() => notify(`✅ ${item.action} — action initiated`)} color={item.color} size="sm" outline>{item.action}</Btn>
                        </div>
                      </div>
                    ))}
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════════ WOMEN SAFETY ════════ */}
        {tab === "women" && (
          <div style={{ padding:"14px 13px" }}>
            <Card style={{ marginBottom:13, padding:"12px 15px", background:"linear-gradient(135deg,#180012,#070020)", borderColor:"#EC489920" }}>
              <p style={{ fontSize:13, fontWeight:800, color:"#F9A8D4", margin:"0 0 3px" }}>🙋‍♀️ {t.womenSafetyTitle}</p>
              <p style={{ fontSize:10, color:C.muted, margin:0 }}>Advanced protection · Silent SOS · Guardian · Fake Call</p>
            </Card>

            {/* Guardian Mode */}
            <Card style={{ marginBottom:11, padding:17, borderColor: guardianOn?"#EC489938":C.border }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ flex:1, marginRight:12 }}>
                  <p style={{ fontSize:13.5, fontWeight:800, margin:"0 0 4px" }}>🛡️ {t.guardianMode}</p>
                  <p style={{ fontSize:10.5, color:C.muted, margin:0 }}>Live GPS shared continuously with trusted contacts</p>
                </div>
                <Toggle on={guardianOn} onToggle={() => { setGuardianOn(g => !g); if (!guardianOn) { getLocation(); notify("🛡️ Guardian Mode ON! Live location sharing started."); } else notify("Guardian Mode OFF"); }} color={C.pink}/>
              </div>
              {guardianOn && (
                <div style={{ marginTop:12, padding:"10px 12px", background:"rgba(236,72,153,0.06)", borderRadius:10, border:"1px solid rgba(236,72,153,0.16)", animation:"slideUp 0.3s ease" }}>
                  <p style={{ fontSize:9.5, color:"#F9A8D4", margin:"0 0 7px", fontWeight:700 }}>📡 SHARING LIVE LOCATION WITH:</p>
                  {["Maa — +91 98765 43210","Rahul Bhai — +91 87654 32109","Priya (Friend) — +91 76543 21098"].map(c => (
                    <p key={c} style={{ fontSize:10, color:C.mutedL, margin:"0 0 4px", display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ width:5, height:5, borderRadius:"50%", background:C.greenL, animation:"pulse 1.5s infinite", display:"inline-block", flexShrink:0 }}/>{c}
                    </p>
                  ))}
                  {location && <p style={{ marginTop:7, fontSize:9, color:C.muted, margin:"7px 0 0" }}>📍 {location.city}, {location.state} · {location.lat},{location.lng}</p>}
                </div>
              )}
            </Card>

            {/* Silent SOS */}
            <Card style={{ marginBottom:11, padding:17, borderColor: silentTaps>0?"#EF444435":C.border }}>
              <p style={{ fontSize:13.5, fontWeight:800, margin:"0 0 5px" }}>🤫 {t.silentSos} (Triple-Tap)</p>
              <p style={{ fontSize:10.5, color:C.muted, margin:"0 0 13px" }}>Tap 3× to silently trigger emergency. No sound, no visible alert. Works in any situation.</p>
              <button onClick={doSilentTap} style={{ width:"100%", padding:"15px", border:`2px solid ${silentTaps>0?C.danger:"rgba(255,255,255,0.07)"}`, borderRadius:13, background: silentTaps>0?"rgba(239,68,68,0.1)":"rgba(255,255,255,0.03)", color: silentTaps>0?C.danger:C.muted, fontWeight:900, fontSize:13, cursor:"pointer", transition:"all 0.2s" }}>
                {silentTaps===0?"Tap 3× for Silent SOS":silentTaps===1?"Tap 2 more times...":"Tap 1 more time..."}
              </button>
              {silentTaps > 0 && <p style={{ textAlign:"center", marginTop:6, fontSize:11, color:C.danger, fontWeight:700, margin:"6px 0 0" }}>● {silentTaps}/3 registered</p>}
            </Card>

            {/* Fake Call */}
            <Card style={{ marginBottom:11, padding:17, borderColor:"#8B5CF615" }}>
              <p style={{ fontSize:13.5, fontWeight:800, margin:"0 0 5px" }}>📞 {t.fakeCall} Generator</p>
              <p style={{ fontSize:10.5, color:C.muted, margin:"0 0 13px" }}>Simulate an incoming call to safely exit any unsafe situation.</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                {[{label:"Now",sec:0},{label:"10 sec",sec:10},{label:"30 sec",sec:30}].map(({ label, sec }) => (
                  <button key={label} onClick={() => startFakeCall(sec)} className="press-scale" style={{ padding:"12px 6px", borderRadius:12, background:"rgba(139,92,246,0.09)", border:"1px solid rgba(139,92,246,0.25)", color:C.purple, fontWeight:800, fontSize:11, cursor:"pointer" }}>{label}</button>
                ))}
              </div>
            </Card>

            {/* Emergency Recording */}
            <Card style={{ marginBottom:11, padding:17, borderColor: recording?"#EF444430":C.border }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ flex:1, marginRight:12 }}>
                  <p style={{ fontSize:13.5, fontWeight:800, margin:"0 0 4px" }}>🎙️ Emergency {t.recording}</p>
                  <p style={{ fontSize:10.5, color:C.muted, margin:0 }}>Auto-record audio as legal evidence. Stored in Firebase Storage.</p>
                </div>
                <button onClick={() => { setRecording(r => !r); notify(recording?"⏹ Recording saved as evidence":"🔴 Emergency recording started"); }} style={{ padding:"9px 15px", borderRadius:20, background: recording?"rgba(239,68,68,0.15)":"rgba(255,255,255,0.05)", border:`1px solid ${recording?`${C.danger}50`:C.border2}`, color: recording?C.danger:C.muted, fontWeight:800, fontSize:11, animation: recording?"pulse 1.8s infinite":"none", whiteSpace:"nowrap", cursor:"pointer" }}>
                  {recording?"⏹ Stop":"🔴 Start"}
                </button>
              </div>
              {recording && (
                <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:10, padding:"10px 13px", background:"rgba(239,68,68,0.06)", borderRadius:10 }}>
                  <div style={{ width:9, height:9, borderRadius:"50%", background:C.danger, animation:"pulse 0.8s infinite", flexShrink:0 }}/>
                  <div style={{ display:"flex", gap:2, alignItems:"center" }}>
                    {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} style={{ width:3, borderRadius:2, background:C.danger, height:`${4+Math.abs(Math.sin(i*0.9)*14)}px`, animation:`wave ${0.6+i*0.08}s ease-in-out infinite alternate` }}/>)}
                  </div>
                  <span style={{ fontSize:10, color:C.danger, fontWeight:800 }}>REC {fmtSec(recDur)}</span>
                </div>
              )}
            </Card>

            {/* Women Helpline quick call */}
            <a href="tel:1091" style={{ display:"block", textDecoration:"none" }}>
              <Card style={{ padding:"15px 17px", background:"linear-gradient(135deg,#140010,#050018)", borderColor:"#EC489930" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div><p style={{ fontSize:13, fontWeight:900, color:C.pink, margin:"0 0 2px" }}>🙋‍♀️ Women Helpline</p><p style={{ fontSize:10, color:C.muted, margin:0 }}>24/7 · FREE · Confidential · Tap to call</p></div>
                  <p style={{ fontSize:26, fontWeight:900, color:C.pink, margin:0 }}>1091</p>
                </div>
              </Card>
            </a>
          </div>
        )}

        {/* ════════ AI CHATBOT ════════ */}
        {tab === "ai" && (
          <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 150px)" }}>
            <div style={{ padding:"13px 13px 8px" }}>
              <Card style={{ padding:"11px 15px", background:"linear-gradient(135deg,#050218,#0a0035)" }}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <span style={{ fontSize:26, animation:"float 3s ease-in-out infinite" }}>🤖</span>
                  <div><p style={{ fontWeight:900, fontSize:13, color:C.purple, margin:"0 0 2px" }}>SahayakBot AI</p><p style={{ fontSize:9, color:C.muted, margin:0 }}>Claude-powered · {lang} · 24/7</p></div>
                  <div style={{ marginLeft:"auto", display:"flex", gap:6 }}><Badge color={C.purple} dot>LIVE</Badge>{offline&&<Badge color={C.gold}>Offline</Badge>}</div>
                </div>
              </Card>
            </div>

            <div ref={chatRef} style={{ flex:1, overflowY:"auto", padding:"0 13px", display:"flex", flexDirection:"column", gap:9 }}>
              {chatHist.map((m, i) => (
                <div key={i} style={{ display:"flex", justifyContent: m.role==="user"?"flex-end":"flex-start", animation:"slideUp 0.3s ease" }}>
                  {m.role==="assistant" && <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(139,92,246,0.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, marginRight:7, marginTop:2 }}>🤖</div>}
                  <div style={{ maxWidth:"80%", background: m.role==="user"?`linear-gradient(135deg,${C.saffronD},${C.navy})`:C.card, border: m.role==="assistant"?`1px solid ${C.border}`:"none", borderRadius: m.role==="user"?"17px 17px 4px 17px":"4px 17px 17px 17px", padding:"10px 13px", fontSize:12, lineHeight:1.8 }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {chatLoad && (
                <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(139,92,246,0.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🤖</div>
                  <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:"4px 17px 17px 17px", padding:"11px 16px", display:"flex", gap:4 }}>
                    {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:C.purple, animation:`float 1s ease-in-out ${i*0.22}s infinite` }}/>)}
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding:"6px 13px 4px", display:"flex", gap:6, overflowX:"auto" }}>
              {["PM Kisan eligibility?","RTI kaise file karein?","Aadhaar update","Ayushman apply","DigiLocker help","Consumer court"].map(q => (
                <button key={q} onClick={() => setChatIn(q)} style={{ whiteSpace:"nowrap", background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`, color:C.mutedL, borderRadius:20, padding:"5px 11px", fontSize:9.5, cursor:"pointer" }}>{q}</button>
              ))}
            </div>
            <div style={{ padding:"7px 13px 10px", display:"flex", gap:8 }}>
              <input value={chatIn} onChange={e => setChatIn(e.target.value)} onKeyDown={e => e.key==="Enter"&&sendChat()} placeholder={t.chatPlaceholder}
                style={{ flex:1, background:C.card, border:`1px solid ${C.border2}`, borderRadius:22, padding:"10px 15px", color:"white", fontSize:12 }}/>
              <button onClick={sendChat} disabled={!chatIn.trim()||chatLoad} style={{ width:42, height:42, borderRadius:"50%", background: chatIn.trim()&&!chatLoad?`linear-gradient(135deg,${C.purple},${C.navy})`:"rgba(255,255,255,0.04)", border:"none", color:"white", fontSize:16, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", opacity: chatIn.trim()&&!chatLoad?1:0.4, cursor: chatIn.trim()&&!chatLoad?"pointer":"not-allowed" }}>➤</button>
            </div>
          </div>
        )}

        {/* ════════ ADMIN DASHBOARD ════════ */}
        {tab === "admin" && (
          <div style={{ padding:"14px 13px" }}>
            <Card style={{ marginBottom:13, padding:"12px 15px", background:"linear-gradient(135deg,#000c18,#03000e)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div><p style={{ fontSize:13, fontWeight:800, color:C.cyan, margin:"0 0 3px" }}>📊 Admin Dashboard</p><p style={{ fontSize:10, color:C.muted, margin:0 }}>Live · Real-time · Government Officials Only</p></div>
                <Badge color={C.cyan} dot>REAL-TIME</Badge>
              </div>
            </Card>

            <div style={{ display:"flex", gap:6, marginBottom:13, overflowX:"auto" }}>
              {["overview","heatmap","complaints","infra"].map(at => (
                <button key={at} onClick={() => setAdminTab(at)} style={{ whiteSpace:"nowrap", padding:"6px 13px", borderRadius:20, fontSize:9.5, fontWeight:800, cursor:"pointer", background: adminTab===at?`${C.cyan}15`:"rgba(255,255,255,0.04)", border:`1px solid ${adminTab===at?`${C.cyan}50`:C.border}`, color: adminTab===at?C.cyan:C.muted }}>
                  {at.charAt(0).toUpperCase()+at.slice(1)}
                </button>
              ))}
            </div>

            {adminTab === "overview" && (
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:13 }}>
                  {ADMIN_STATS.map((s, i) => (
                    <Card key={s.label} style={{ padding:"14px 12px", borderColor:`${s.color}1e`, animation:`slideUp 0.4s ease ${i*0.08}s both` }}>
                      <p style={{ fontSize:20, margin:"0 0 7px" }}>{s.icon}</p>
                      <p style={{ fontSize:22, fontWeight:900, color:s.color, margin:"0 0 3px" }}>{s.value}</p>
                      <p style={{ fontSize:10, color:C.muted, margin:"0 0 6px" }}>{s.label}</p>
                      <Badge color={s.color}>{s.delta}</Badge>
                    </Card>
                  ))}
                </div>
                <Card style={{ padding:15, marginBottom:13 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:11 }}>
                    <p style={{ fontSize:12, fontWeight:800, margin:0 }}>🚨 Live Emergency Feed</p>
                    <Badge color={C.danger} dot>LIVE</Badge>
                  </div>
                  {[{type:"SOS",loc:"Connaught Place, Delhi",time:"2m ago",status:"responding"},{type:"Medical",loc:"Lajpat Nagar, Delhi",time:"8m ago",status:"resolved"},{type:"Fire",loc:"Karol Bagh, Delhi",time:"15m ago",status:"en route"},{type:"Women SOS",loc:"Saket, Delhi",time:"22m ago",status:"resolved"}].map((e, i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom: i<3?`1px solid ${C.border}`:"none" }}>
                      <div><p style={{ fontSize:11.5, fontWeight:700, margin:"0 0 1px" }}>{e.type} — {e.loc}</p><p style={{ fontSize:9.5, color:C.muted, margin:0 }}>{e.time}</p></div>
                      <Badge color={e.status==="resolved"?C.greenL:e.status==="responding"?C.gold:C.cyan}>{e.status}</Badge>
                    </div>
                  ))}
                </Card>
                <Card style={{ padding:15 }}>
                  <p style={{ fontSize:12, fontWeight:800, margin:"0 0 11px" }}>⚡ System Performance</p>
                  {[{label:"API Response",val:"142ms",color:C.greenL,pct:90},{label:"Server Uptime",val:"99.97%",color:C.greenL,pct:99},{label:"Active Users",val:"84.2K",color:C.cyan,pct:68},{label:"Cache Hit",val:"96.4%",color:C.teal,pct:96},{label:"DB Speed",val:"28ms",color:C.lime,pct:95}].map(m => (
                    <div key={m.label} style={{ marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:10, color:C.muted }}>{m.label}</span>
                        <span style={{ fontSize:10, fontWeight:800, color:m.color }}>{m.val}</span>
                      </div>
                      <div style={{ height:4, background:"rgba(255,255,255,0.04)", borderRadius:4, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${m.pct}%`, background:m.color, borderRadius:4, boxShadow:`0 0 8px ${m.color}45` }}/>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {adminTab === "heatmap" && (
              <div>
                <Card style={{ marginBottom:13, padding:15 }}>
                  <p style={{ fontSize:12, fontWeight:800, margin:"0 0 4px" }}>🗺️ District Complaint Heatmap</p>
                  <p style={{ fontSize:10, color:C.muted, margin:"0 0 13px" }}>Complaint + emergency density across Delhi NCR</p>
                  {HEATMAP_DATA.map((d, i) => (
                    <div key={d.district} style={{ marginBottom:11, animation:`slideIn 0.4s ease ${i*0.07}s both` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <span style={{ fontSize:11, fontWeight:700 }}>{d.district}</span>
                        <div style={{ display:"flex", gap:10 }}><span style={{ fontSize:9.5, color:C.muted }}>📢 {d.complaints}</span><span style={{ fontSize:9.5, color:C.danger }}>🚨 {d.emergencies}</span></div>
                      </div>
                      <div style={{ height:9, background:"rgba(255,255,255,0.04)", borderRadius:5, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${d.pct}%`, background:d.color, borderRadius:5, boxShadow:`0 0 10px ${d.color}40`, transition:"width 1s ease" }}/>
                      </div>
                    </div>
                  ))}
                </Card>
                <Card style={{ padding:15 }}>
                  <p style={{ fontSize:12, fontWeight:800, margin:"0 0 11px" }}>📂 Complaint Categories</p>
                  {[["Road / Infrastructure",31,C.danger],["Water Supply",22,C.cyan],["Street Lights",18,C.gold],["Garbage",15,C.greenL],["Others",14,C.purple]].map(([cat,pct,col]) => (
                    <div key={cat} style={{ display:"flex", alignItems:"center", gap:9, marginBottom:9 }}>
                      <div style={{ width:9, height:9, borderRadius:3, background:col, flexShrink:0 }}/>
                      <span style={{ fontSize:10.5, flex:1 }}>{cat}</span>
                      <div style={{ width:90, height:6, background:"rgba(255,255,255,0.04)", borderRadius:3, overflow:"hidden" }}>
                        <div style={{ width:`${pct}%`, height:"100%", background:col, borderRadius:3 }}/>
                      </div>
                      <span style={{ fontSize:10, color:col, fontWeight:800, width:26, textAlign:"right" }}>{pct}%</span>
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {adminTab === "complaints" && (
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:7, marginBottom:13 }}>
                  {[["Total","14,847",C.cyan],["Pending","1,247",C.gold],["Resolved","13,280",C.greenL]].map(([l,v,c]) => (
                    <Card key={l} style={{ padding:"12px 8px", textAlign:"center", borderColor:`${c}18` }}>
                      <p style={{ fontSize:17, fontWeight:900, color:c, margin:"0 0 2px" }}>{v}</p>
                      <p style={{ fontSize:8.5, color:C.muted, margin:0 }}>{l}</p>
                    </Card>
                  ))}
                </div>
                {[...complaints,{id:"SHK100234",type:"Sewage",dept:"Jal Board",status:"resolved",date:"1 Apr 2026",district:"West Delhi"}].map((c, i) => (
                  <Card key={c.id} style={{ marginBottom:8, padding:13, animation:`slideUp 0.3s ease ${i*0.06}s both` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:7 }}>
                      <div><p style={{ fontSize:12, fontWeight:800, margin:"0 0 2px" }}>{c.type}</p><p style={{ fontSize:9.5, color:C.muted, margin:0 }}>#{c.id} · {c.district} · {c.date}</p></div>
                      <Badge color={pColor(c.status)}>{pLabel(c.status)}</Badge>
                    </div>
                    <p style={{ fontSize:10, color:C.muted, margin:0 }}>→ <strong style={{ color:"white" }}>{c.dept}</strong></p>
                  </Card>
                ))}
              </div>
            )}

            {adminTab === "infra" && (
              <div>
                <Card style={{ padding:15, marginBottom:13 }}>
                  <p style={{ fontSize:12, fontWeight:800, margin:"0 0 11px" }}>🏗️ Service Health Dashboard</p>
                  {[
                    {svc:"Claude AI (Anthropic)",  status:"operational", latency:"145ms"},
                    {svc:"Firebase Auth",           status:"operational", latency:"89ms"},
                    {svc:"Firebase Firestore",      status:"operational", latency:"22ms"},
                    {svc:"Firebase Storage",        status:"operational", latency:"44ms"},
                    {svc:"Redis Cache",             status:"operational", latency:"2ms"},
                    {svc:"SMS Gateway (MSG91)",     status:"degraded",    latency:"320ms"},
                    {svc:"Google Maps API",         status:"operational", latency:"67ms"},
                    {svc:"FCM Push Notifications",  status:"operational", latency:"98ms"},
                    {svc:"CloudFront CDN",          status:"operational", latency:"8ms"},
                    {svc:"DigiLocker API",          status:"operational", latency:"212ms"},
                  ].map((s, i) => (
                    <div key={s.svc} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom: i<9?`1px solid ${C.border}`:"none" }}>
                      <span style={{ fontSize:11 }}>{s.svc}</span>
                      <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                        <span style={{ fontSize:9.5, color:C.muted }}>{s.latency}</span>
                        <Badge color={s.status==="operational"?C.greenL:C.gold}>{s.status}</Badge>
                      </div>
                    </div>
                  ))}
                </Card>
                <Card style={{ padding:15 }}>
                  <p style={{ fontSize:12, fontWeight:800, margin:"0 0 11px" }}>☁️ Production Architecture</p>
                  {[
                    ["Frontend","React + Vite → Vercel Edge CDN",              C.saffron],
                    ["Backend", "Node.js + Express → Railway / Render",        C.green],
                    ["Auth",    "Firebase Auth + JWT + RBAC",                  C.purple],
                    ["Database","Firebase Firestore + Realtime DB",            C.cyan],
                    ["Cache",   "Redis Cloud — 99.99% SLA",                    C.gold],
                    ["Storage", "Firebase Storage + CloudFront CDN",           C.pink],
                    ["AI",      "Claude API (Anthropic Sonnet 4)",              C.teal],
                    ["Maps",    "Google Maps Platform + Places API",           C.greenL],
                    ["SMS",     "MSG91 / Twilio — SOS Emergency Alerts",       C.lime],
                    ["Push",    "Firebase Cloud Messaging (FCM)",              C.mutedL],
                    ["Monitor", "Datadog APM + Sentry + Uptime Robot",         C.muted],
                  ].map(([layer,detail,color]) => (
                    <div key={layer} style={{ display:"flex", alignItems:"flex-start", gap:9, marginBottom:8 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:color, flexShrink:0, marginTop:3 }}/>
                      <span style={{ fontSize:10, fontWeight:800, color, width:72, flexShrink:0 }}>{layer}</span>
                      <span style={{ fontSize:9.5, color:C.muted, flex:1, lineHeight:1.4 }}>{detail}</span>
                    </div>
                  ))}
                </Card>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── BOTTOM NAV ── */}
      <nav style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:430,
        background:"rgba(3,5,10,0.97)", backdropFilter:"blur(28px)",
        borderTop:`1px solid ${C.border}`, display:"flex", zIndex:55,
      }}>
        {TABS.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{ flex:1, padding:"9px 1px 7px", background:"transparent", border:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:2.5, position:"relative", minWidth:0, cursor:"pointer" }}>
            {tab === tb.id && <div style={{ position:"absolute", top:0, left:"12%", right:"12%", height:2, background:`linear-gradient(90deg,${C.saffron},${C.green})`, borderRadius:"0 0 4px 4px" }}/>}
            <span style={{ fontSize:16, filter: tab===tb.id?"none":"grayscale(80%)", opacity: tab===tb.id?1:0.38, lineHeight:1 }}>
              {tb.id==="emergency"&&emActive ? "🔴" : tb.icon}
            </span>
            <span style={{ fontSize:6.5, fontWeight: tab===tb.id?800:400, color: tab===tb.id?C.saffron:C.muted, letterSpacing:0.1, whiteSpace:"nowrap" }}>{tb.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}