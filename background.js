// =============================================
// DUA REMINDER BACKGROUND SCRIPT
// Reads duas from chrome.storage
// =============================================

// Default list of duas for first-time installation
const defaultPhrases = [
  "ربّ زدني علماً وارزقني فهماً",
  "حسبي الله ونعم الوكيل",
  "اللهمّ لا سهل إلا ما جعلته سهلاً",
  "ربّ أعنّي ولا تعن عليّ",
  "اللهمّ اجعلني من الشاكرين",
  "توكلت على الله ورحمته",
  "اللهمّ أصلح لي شأني كله",
  "اللهمّ إنّي أعوذ بك من الهم والحزن",
  "ربّ أدخلني مدخل صدق وأخرجني مخرج صدق",
  "اللهمّ اكفني بحلالك عن حرامك",
  "اللهمّ إنّي أسألك من فضلك",
  "اللهمّ ثبّت قلبي على دينك",
  "اللهمّ لا تكلني إلى نفسي طرفة عين",
  "اللهمّ أحسن عاقبتي في الأمور كلها",
  "ربّ اغفر وارحم وأنت خير الراحمين",
  "اللهمّ اجعل القرآن ربيع قلبي",
  "اللهمّ اهدني وسددني",
  "الحمد لله الذي بنعمته تتم الصالحات",
  "اللهمّ إني أعوذ بك من الهم والحزن والعجز والكسل والبخل والجبن وضلع الدين وغلبة الرجال",
  "ربّنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار",
  "ربّنا تقبّل منّا إنك أنت السميع العليم",
  "ربّنا هب لنا من أزواجنا وذرياتنا قرة أعين واجعلنا للمتقين إماماً",
  "ربّنا لا تزغ قلوبنا بعد إذ هديتنا وهب لنا من لدنك رحمة إنك أنت الوهاب",
  "اللهمّ اختِم لنا بحسن الخاتمة",
  "بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم",
  "اللهمّ رضاك بعد القضاء",
  "اللهمّ إني أعوذ بك من الشقاق والنفاق وسوء الأخلاق",
  "اللهمّ انفعني بما علمتني وعلمني ما ينفعني وزدني علماً",
  "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم",
  "اللهمّ إني أعوذ بك من فتنة النار وعذاب النار",
  "اللهمّ أصلح لي ديني الذي هو عصمة أمري وأصلح لي دنياي التي فيها معاشي وأصلح لي آخرتي التي فيها معادي",
  "اللهمّ إني أسألك العفو والعافية في الدنيا والآخرة",
  "اللهمّ إني أسألك فعل الخيرات وترك المنكرات وحب المساكين",
  "اللهمّ أحيني ما كانت الحياة خيراً لي وتوفني إذا كانت الوفاة خيراً لي",
  "اللهمّ إني أعوذ بك من علم لا ينفع وقلب لا يخشع ونفس لا تشبع ودعوة لا يستجاب لها",
  "توكلت على الحي الذي لا يموت",
  "ربّ اغفر وارحم وأنت خير الراحمين",
  "اللهمّ ألهمني رشدي وأعذني من شر نفسي",
  "اللهمّ بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور"
];
// =============================================
// SET UP STORAGE & ALARM ON INSTALL/STARTUP
// =============================================

chrome.runtime.onInstalled.addListener(() => {
  console.log("Dua Reminder extension installed!");
  // Check if phrases are already in storage, if not, set the default list
  chrome.storage.sync.get(['phrases', 'currentPhraseIndex'], (data) => {
    if (!data.phrases) {
      chrome.storage.sync.set({ phrases: defaultPhrases });
    }
    if (data.currentPhraseIndex === undefined) {
      chrome.storage.sync.set({ currentPhraseIndex: 0 });
    }
  });
  
  chrome.alarms.create('phraseReminder', {
    periodInMinutes: 20
  });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create('phraseReminder', {
    periodInMinutes: 20
  });
});

// =============================================
// HANDLE ALARM TRIGGERS
// =============================================

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'phraseReminder') {
    showNextDua();
  }
});

// =============================================
// SHOW DUAS SEQUENTIALLY FROM STORAGE
// =============================================

function showNextDua(callback) {
  chrome.storage.sync.get(['phrases', 'currentPhraseIndex'], (data) => {
    const phrases = data.phrases || [];
    let currentIndex = data.currentPhraseIndex || 0;

    // Don't show a notification if there are no duas
    if (phrases.length === 0) {
      console.log("No duas in storage. Please add some.");
      if (callback) callback({ success: false });
      return;
    }

    const currentDua = phrases[currentIndex];
    console.log("Showing dua #" + (currentIndex + 1) + ":", currentDua);

    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: `Dua Reminder (${currentIndex + 1}/${phrases.length})`,
      message: currentDua,
      priority: 1
    });

    // Calculate the next index and save it to storage
    const nextIndex = (currentIndex + 1) % phrases.length;
    chrome.storage.sync.set({ currentPhraseIndex: nextIndex }, () => {
      if (callback) callback({ success: true, newIndex: nextIndex });
    });
  });
}

// =============================================
// MESSAGE LISTENER FOR POPUP ACTIONS
// =============================================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showPhrase") {
    showNextDua((response) => {
      // The new index is already saved, we get it again to be sure
      chrome.storage.sync.get('currentPhraseIndex', (data) => {
        sendResponse({ success: true, currentIndex: data.currentPhraseIndex });
      });
    });
    return true; // Indicates an asynchronous response
  }
  
  if (request.action === "resetPhrases") {
    chrome.storage.sync.set({ currentPhraseIndex: 0 }, () => {
      sendResponse({ success: true });
    });
    return true; // Indicates an asynchronous response
  }
});

console.log("Background script loaded - reading duas from storage!");
