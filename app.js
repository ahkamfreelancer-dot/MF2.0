// ========== DONNÉES ET CONFIGURATION ==========

const QUOTES = {
    force: [
        { text: "Tu es plus forte que tu ne le penses.", author: "Anonyme" },
        { text: "La force ne vient pas de ce que vous pouvez faire. Elle vient de surmonter les choses que vous pensiez ne pas pouvoir faire.", author: "Rikki Rogers" },
        { text: "Une femme forte se relève. Une femme vraiment forte aide les autres à se relever.", author: "Anonyme" },
        { text: "Vous êtes courageuse, forte et capable de gérer tout ce qui se présente.", author: "Anonyme" }
    ],
    espoir: [
        { text: "L'espoir est la chose avec des plumes qui se perche dans l'âme.", author: "Emily Dickinson" },
        { text: "Même la nuit la plus sombre prendra fin et le soleil se lèvera.", author: "Victor Hugo" },
        { text: "L'espoir est un rêve éveillé.", author: "Aristote" },
        { text: "Garde espoir. Les jours difficiles sont temporaires, mais tu es forte.", author: "Anonyme" }
    ],
    confiance: [
        { text: "Crois en toi. Tu es capable de choses incroyables.", author: "Anonyme" },
        { text: "La confiance en soi est le premier secret du succès.", author: "Ralph Waldo Emerson" },
        { text: "Tu mérites tout le bonheur du monde.", author: "Anonyme" },
        { text: "Sois fière de qui tu es et de tout ce que tu accomplis.", author: "Anonyme" }
    ],
    courage: [
        { text: "Le courage n'est pas l'absence de peur, mais la décision que quelque chose d'autre est plus important que la peur.", author: "Franklin D. Roosevelt" },
        { text: "Tu es courageuse rien que de continuer.", author: "Anonyme" },
        { text: "Le courage commence par montrer ton vrai visage au monde.", author: "Cory Booker" },
        { text: "Chaque pas compte, même les plus petits.", author: "Anonyme" }
    ],
    amour: [
        { text: "Aime-toi d'abord et tout le reste s'alignera.", author: "Lucille Ball" },
        { text: "Tu ne peux pas verser d'une tasse vide. Prends soin de toi d'abord.", author: "Anonyme" },
        { text: "S'aimer soi-même, c'est le début d'une histoire d'amour qui dure toute la vie.", author: "Oscar Wilde" },
        { text: "Tu mérites tout l'amour que tu donnes aux autres.", author: "Anonyme" }
    ],
    resilience: [
        { text: "Je peux être changée par ce qui m'arrive, mais je refuse d'être réduite par cela.", author: "Maya Angelou" },
        { text: "Les cicatrices montrent que tu es un survivant. Elles sont la preuve de ta force.", author: "Anonyme" },
        { text: "Ce qui ne me tue pas me rend plus forte.", author: "Friedrich Nietzsche" },
        { text: "Tu as survécu à 100% de tes pires jours. Continue.", author: "Anonyme" }
    ]
};

const DAILY_QUOTES = [
    { text: "Chaque petit pas est une victoire.", author: "Anonyme" },
    { text: "Tu es exactement où tu dois être.", author: "Anonyme" },
    { text: "Sois douce avec toi-même. Tu fais de ton mieux.", author: "Anonyme" },
    { text: "Aujourd'hui est un nouveau commencement.", author: "Anonyme" },
    { text: "Ta force intérieure brille même dans l'obscurité.", author: "Anonyme" },
    { text: "Tu n'es pas seule. Tu es aimée.", author: "Anonyme" },
    { text: "Les jours difficiles passent. Tu resteras.", author: "Anonyme" }
];

// ========== INITIALISATION ==========

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadData();
    setupEventListeners();
    updateDate();
    displayDailyQuote();
    checkWelcomeMessage();
});

function initializeApp() {
    // Initialiser localStorage si nécessaire
    if (!localStorage.getItem('mambolyData')) {
        const initialData = {
            userName: '',
            victories: [],
            journalEntries: [],
            mood: {},
            checkboxes: {},
            tasks: { today: [], week: [], important: [] },
            applications: [],
            children: [],
            mamanNotes: '',
            activities: [],
            weeklyGoals: [],
            lastVisit: new Date().toISOString(),
            hasSeenWelcome: false,
            darkMode: false
        };
        localStorage.setItem('mambolyData', JSON.stringify(initialData));
    }
}

function loadData() {
    const data = getData();
    
    // Charger le nom d'utilisateur
    if (data.userName) {
        const displayName = document.getElementById('user-name-display');
        const inputName = document.getElementById('user-name-input');
        if (displayName) displayName.textContent = data.userName;
        if (inputName) inputName.value = data.userName;
    }
    
    // Charger toutes les checkboxes
    loadCheckboxes();
    
    // Charger les tâches
    loadTasks();
    
    // Charger les statistiques
    updateStats();
    
    // Charger les candidatures
    loadApplications();
    
    // Charger les enfants
    loadChildren();
    
    // Charger les notes maman
    const mamanNotes = document.getElementById('maman-notes');
    if (mamanNotes && data.mamanNotes) {
        mamanNotes.value = data.mamanNotes;
    }
    
    // Charger le mode sombre
    if (data.darkMode) {
        document.body.classList.add('dark-mode');
        const toggle = document.getElementById('dark-mode-toggle');
        if (toggle) toggle.checked = true;
    }
}

function getData() {
    return JSON.parse(localStorage.getItem('mambolyData') || '{}');
}

function saveData(data) {
    localStorage.setItem('mambolyData', JSON.stringify(data));
}

function setupEventListeners() {
    // Touche Entrée pour le chat
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
}

// ========== MESSAGE DE BIENVENUE ==========

function checkWelcomeMessage() {
    const data = getData();
    const overlay = document.getElementById('welcome-overlay');
    
    if (!data.hasSeenWelcome && overlay) {
        overlay.classList.remove('hidden');
    } else if (overlay) {
        overlay.classList.add('hidden');
    }
}

function closeWelcome() {
    const overlay = document.getElementById('welcome-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
    
    const data = getData();
    data.hasSeenWelcome = true;
    saveData(data);
}

// ========== NAVIGATION ==========

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

function navigateTo(sectionId) {
    // Masquer toutes les sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Afficher la section demandée
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Mettre à jour la navigation
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`.sidebar-menu a[onclick="navigateTo('${sectionId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Fermer le sidebar sur mobile
    toggleSidebar();
    
    // Scroll vers le haut
    window.scrollTo(0, 0);
}

// ========== SECTION ACCUEIL ==========

function updateDate() {
    const dateDisplay = document.getElementById('current-date');
    if (dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        dateDisplay.textContent = today.toLocaleDateString('fr-FR', options);
    }
}

function displayDailyQuote() {
    const quoteElement = document.getElementById('daily-quote');
    if (quoteElement) {
        const today = new Date().getDate();
        const quote = DAILY_QUOTES[today % DAILY_QUOTES.length];
        quoteElement.innerHTML = `"${quote.text}"<br><cite>— ${quote.author}</cite>`;
    }
}

function changeQuote() {
    const quoteElement = document.getElementById('daily-quote');
    if (quoteElement) {
        const randomQuote = DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)];
        quoteElement.innerHTML = `"${randomQuote.text}"<br><cite>— ${randomQuote.author}</cite>`;
    }
}

function selectMood(emoji, feeling) {
    // Retirer la sélection précédente
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Ajouter la sélection
    event.target.classList.add('selected');
    
    // Sauvegarder
    const data = getData();
    const today = new Date().toISOString().split('T')[0];
    if (!data.mood) data.mood = {};
    data.mood[today] = { emoji, feeling };
    saveData(data);
    
    // Afficher message
    const messages = {
        'Très difficile': "Je suis là avec toi. Chaque moment difficile passera. 💜",
        'Difficile': "Tu es courageuse de continuer. Prends soin de toi aujourd'hui.",
        'Neutre': "C'est OK de se sentir neutre. Chaque jour est différent.",
        'Bien': "C'est merveilleux ! Profite de ce moment. ✨",
        'Très bien': "Je suis si heureuse pour toi ! Continue à briller ! 🌟"
    };
    
    const messageElement = document.getElementById('mood-message');
    if (messageElement) {
        messageElement.textContent = messages[feeling];
    }
}

function saveVictory() {
    const textarea = document.getElementById('daily-victory');
    const text = textarea.value.trim();
    
    if (text) {
        const data = getData();
        if (!data.victories) data.victories = [];
        
        data.victories.push({
            date: new Date().toISOString(),
            text: text
        });
        
        saveData(data);
        textarea.value = '';
        
        alert('🎉 Victoire sauvegardée ! Chaque petit pas compte !');
        updateStats();
        
        // Message de Kiala
        setTimeout(() => {
            addChatMessage("🎉 Bravo pour cette victoire ! Je suis fière de toi ! Continue comme ça ! 💜", 'kiala');
        }, 500);
    }
}

function updateStats() {
    const data = getData();
    
    // Victoires
    const victoriesCount = document.getElementById('victories-count');
    if (victoriesCount && data.victories) {
        victoriesCount.textContent = data.victories.length;
    }
    
    // Jours suivis
    const daysTracked = document.getElementById('days-tracked');
    if (daysTracked && data.mood) {
        daysTracked.textContent = Object.keys(data.mood).length;
    }
    
    // Progrès carrière (LinkedIn)
    const careerProgress = document.getElementById('career-progress');
    if (careerProgress && data.checkboxes && data.checkboxes.linkedin) {
        const total = 10; // 10 étapes LinkedIn
        const completed = Object.values(data.checkboxes.linkedin).filter(v => v).length;
        careerProgress.textContent = Math.round((completed / total) * 100) + '%';
    }
}

// ========== SECTION MA FORCE ==========

let currentQuoteCategory = 'force';

function showQuotes(category) {
    currentQuoteCategory = category;
    
    // Mettre à jour les tabs
    document.querySelectorAll('.category-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Afficher les citations
    const container = document.getElementById('quotes-container');
    if (container && QUOTES[category]) {
        container.innerHTML = '';
        QUOTES[category].forEach(quote => {
            const quoteDiv = document.createElement('div');
            quoteDiv.className = 'quote-item';
            quoteDiv.innerHTML = `
                <p class="quote-text">"${quote.text}"</p>
                <p class="quote-author">— ${quote.author}</p>
            `;
            container.appendChild(quoteDiv);
        });
    }
}

// Initialiser avec la catégorie Force
setTimeout(() => {
    const forceBtn = document.querySelector('.category-tabs .tab-btn');
    if (forceBtn) {
        forceBtn.click();
    }
}, 100);

function saveJournal() {
    const textarea = document.getElementById('private-journal');
    const text = textarea.value.trim();
    
    if (text) {
        const data = getData();
        if (!data.journalEntries) data.journalEntries = [];
        
        data.journalEntries.push({
            date: new Date().toISOString(),
            content: text
        });
        
        saveData(data);
        textarea.value = '';
        
        alert('💾 Entrée de journal sauvegardée en toute confidentialité.');
    }
}

function viewJournalEntries() {
    const data = getData();
    if (!data.journalEntries || data.journalEntries.length === 0) {
        alert('Tu n\'as pas encore d\'entrées de journal.');
        return;
    }
    
    let html = '<div style="max-height: 400px; overflow-y: auto;">';
    data.journalEntries.reverse().forEach((entry, index) => {
        const date = new Date(entry.date).toLocaleDateString('fr-FR');
        html += `
            <div style="margin-bottom: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                <strong>${date}</strong>
                <p style="margin-top: 0.5rem;">${entry.content}</p>
            </div>
        `;
    });
    html += '</div>';
    
    const modal = confirm('Voir toutes tes entrées de journal ?');
    if (modal) {
        // Ici, idéalement on afficherait un modal
        // Pour l'instant, on utilise une nouvelle fenêtre
        const win = window.open('', 'Journal', 'width=600,height=600');
        win.document.write(`
            <html>
            <head>
                <title>Mon Journal</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 2rem; }
                    h1 { color: #C9A8DA; }
                </style>
            </head>
            <body>
                <h1>📖 Mon Journal Privé</h1>
                ${html}
            </body>
            </html>
        `);
    }
}

function startExercise(type) {
    const exercises = {
        respiration: {
            title: '🌬️ Exercice de Respiration',
            content: `
                <p><strong>Durée : 5 minutes</strong></p>
                <ol>
                    <li>Assieds-toi confortablement</li>
                    <li>Inspire lentement par le nez pendant 4 secondes</li>
                    <li>Retiens ton souffle pendant 4 secondes</li>
                    <li>Expire lentement par la bouche pendant 6 secondes</li>
                    <li>Répète pendant 5 minutes</li>
                </ol>
                <p><em>Concentre-toi uniquement sur ta respiration.</em></p>
            `
        },
        gratitude: {
            title: '🙏 Exercice des 3 Gratitudes',
            content: `
                <p><strong>Trouve 3 choses pour lesquelles tu es reconnaissante aujourd'hui :</strong></p>
                <p>Exemples :</p>
                <ul>
                    <li>Mes enfants en bonne santé</li>
                    <li>Un moment de calme ce matin</li>
                    <li>Le sourire d'une amie</li>
                    <li>Un bon repas</li>
                    <li>Le soleil dehors</li>
                </ul>
                <p><em>Même les petites choses comptent !</em></p>
            `
        },
        affirmations: {
            title: '💝 Affirmations Positives',
            content: `
                <p><strong>Répète ces phrases à voix haute :</strong></p>
                <ul>
                    <li>Je suis forte</li>
                    <li>Je mérite le bonheur</li>
                    <li>Je fais de mon mieux</li>
                    <li>Je suis capable</li>
                    <li>Je suis aimée</li>
                    <li>Chaque jour, je deviens plus forte</li>
                </ul>
                <p><em>Dis-les comme si tu y croyais. Tu finiras par y croire.</em></p>
            `
        }
    };
    
    const exercise = exercises[type];
    if (exercise) {
        alert(exercise.title + '\n\n' + exercise.content.replace(/<[^>]*>/g, '\n'));
    }
}

// ========== CHECKBOXES (GENERAL) ==========

function loadCheckboxes() {
    const data = getData();
    if (!data.checkboxes) return;
    
    // Charger chaque type de checkbox
    ['routine', 'linkedin', 'job-search', 'practical', 'reconstruction'].forEach(type => {
        if (data.checkboxes[type]) {
            Object.keys(data.checkboxes[type]).forEach(key => {
                const checkbox = document.querySelector(`#${type} input[type="checkbox"]:nth-of-type(${parseInt(key) + 1})`);
                if (checkbox) {
                    checkbox.checked = data.checkboxes[type][key];
                }
            });
        }
    });
}

function saveCheckbox(type) {
    const data = getData();
    if (!data.checkboxes) data.checkboxes = {};
    if (!data.checkboxes[type]) data.checkboxes[type] = {};
    
    const container = type === 'routine' ? document.getElementById('daily-routine') :
                      type === 'linkedin' ? document.getElementById('linkedin-checklist') :
                      type === 'job-search' ? document.getElementById('job-search-routine') :
                      type === 'practical' ? document.getElementById('practical-aspects') :
                      document.getElementById('reconstruction');
    
    if (container) {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox, index) => {
            data.checkboxes[type][index] = checkbox.checked;
        });
    }
    
    saveData(data);
    updateStats();
}


// ========== SECTION SELF-CARE ==========

function addActivity() {
    const activity = prompt('Quelle activité te ressource ?');
    if (activity) {
        const data = getData();
        if (!data.activities) data.activities = [];
        data.activities.push(activity);
        saveData(data);
        
        // Ajouter visuellement
        const grid = document.getElementById('activities-list');
        if (grid) {
            const card = document.createElement('div');
            card.className = 'activity-card';
            card.textContent = activity;
            grid.appendChild(card);
        }
    }
}

function addWeeklyGoal() {
    const goal = prompt('Quel est ton objectif bien-être cette semaine ?');
    if (goal) {
        const data = getData();
        if (!data.weeklyGoals) data.weeklyGoals = [];
        data.weeklyGoals.push({ text: goal, completed: false });
        saveData(data);
        loadWeeklyGoals();
    }
}

function loadWeeklyGoals() {
    const data = getData();
    const container = document.getElementById('weekly-goals');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!data.weeklyGoals || data.weeklyGoals.length === 0) {
        container.innerHTML = '<p style="color: #999;">Aucun objectif pour le moment.</p>';
        return;
    }
    
    data.weeklyGoals.forEach((goal, index) => {
        const div = document.createElement('div');
        div.className = 'checklist-item';
        div.innerHTML = `
            <input type="checkbox" ${goal.completed ? 'checked' : ''} onchange="toggleGoal(${index})">
            <span>${goal.text}</span>
        `;
        container.appendChild(div);
    });
}

function toggleGoal(index) {
    const data = getData();
    data.weeklyGoals[index].completed = !data.weeklyGoals[index].completed;
    saveData(data);
}

// ========== SECTION MAISON (TODO LISTS) ==========

function showTodoList(list) {
    // Masquer toutes les listes
    document.querySelectorAll('.todo-container').forEach(container => {
        container.style.display = 'none';
    });
    
    // Afficher la liste demandée
    const container = document.getElementById(`todo-${list}`);
    if (container) {
        container.style.display = 'block';
    }
    
    // Mettre à jour les tabs
    document.querySelectorAll('.todo-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function loadTasks() {
    const data = getData();
    if (!data.tasks) data.tasks = { today: [], week: [], important: [] };
    
    ['today', 'week', 'important'].forEach(list => {
        const container = document.getElementById(`tasks-${list}`);
        if (!container) return;
        
        container.innerHTML = '';
        
        if (data.tasks[list].length === 0) {
            container.innerHTML = '<p style="color: #999; font-style: italic;">Aucune tâche pour le moment.</p>';
            return;
        }
        
        data.tasks[list].forEach((task, index) => {
            const div = document.createElement('div');
            div.className = 'task-item' + (task.completed ? ' completed' : '');
            div.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${list}', ${index})">
                <span style="flex: 1;">${task.text}</span>
                <button class="delete-task" onclick="deleteTask('${list}', ${index})">×</button>
            `;
            container.appendChild(div);
        });
    });
}

function addTask(list) {
    const input = document.getElementById(`new-task-${list}`);
    const text = input.value.trim();
    
    if (text) {
        const data = getData();
        if (!data.tasks) data.tasks = { today: [], week: [], important: [] };
        
        data.tasks[list].push({
            text: text,
            completed: false,
            date: new Date().toISOString()
        });
        
        saveData(data);
        input.value = '';
        loadTasks();
    }
}

function toggleTask(list, index) {
    const data = getData();
    data.tasks[list][index].completed = !data.tasks[list][index].completed;
    saveData(data);
    loadTasks();
}

function deleteTask(list, index) {
    if (confirm('Supprimer cette tâche ?')) {
        const data = getData();
        data.tasks[list].splice(index, 1);
        saveData(data);
        loadTasks();
    }
}

function addChild() {
    const name = prompt('Prénom de ton enfant :');
    if (!name) return;
    
    const age = prompt('Âge :');
    if (!age) return;
    
    const data = getData();
    if (!data.children) data.children = [];
    
    data.children.push({ name, age });
    saveData(data);
    loadChildren();
}

function loadChildren() {
    const data = getData();
    const container = document.getElementById('children-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!data.children || data.children.length === 0) {
        container.innerHTML = '<p style="color: #999;">Aucun enfant ajouté.</p>';
        return;
    }
    
    data.children.forEach((child, index) => {
        const div = document.createElement('div');
        div.style.cssText = 'background: #f5f5f5; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem;';
        div.innerHTML = `
            <strong>${child.name}</strong> - ${child.age} ans
            <button onclick="deleteChild(${index})" style="float: right; background: #ff6b6b; color: white; padding: 0.25rem 0.5rem; border-radius: 4px;">×</button>
        `;
        container.appendChild(div);
    });
}

function deleteChild(index) {
    if (confirm('Retirer cet enfant de la liste ?')) {
        const data = getData();
        data.children.splice(index, 1);
        saveData(data);
        loadChildren();
    }
}

function saveMamanNotes() {
    const textarea = document.getElementById('maman-notes');
    if (textarea) {
        const data = getData();
        data.mamanNotes = textarea.value;
        saveData(data);
        alert('💾 Notes sauvegardées !');
    }
}

// ========== SECTION CARRIÈRE ==========

function addApplication() {
    const company = prompt('Nom de l\'entreprise :');
    if (!company) return;
    
    const position = prompt('Poste :');
    if (!position) return;
    
    const data = getData();
    if (!data.applications) data.applications = [];
    
    data.applications.push({
        company,
        position,
        date: new Date().toISOString(),
        status: 'sent'
    });
    
    saveData(data);
    loadApplications();
    
    // Message encourageant
    addChatMessage("💼 Bravo pour cette candidature ! Chaque candidature te rapproche de ton objectif ! Continue ! 🎯", 'kiala');
}

function loadApplications() {
    const data = getData();
    const container = document.getElementById('applications-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!data.applications || data.applications.length === 0) {
        container.innerHTML = '<p style="color: #999;">Aucune candidature enregistrée.</p>';
        return;
    }
    
    data.applications.reverse().forEach((app, index) => {
        const div = document.createElement('div');
        div.className = 'application-item';
        
        const statusLabels = {
            sent: 'Envoyée',
            response: 'Réponse',
            interview: 'Entretien'
        };
        
        const statusClass = `status-${app.status}`;
        const date = new Date(app.date).toLocaleDateString('fr-FR');
        
        div.innerHTML = `
            <div class="application-header">
                <strong>${app.company}</strong>
                <span class="application-status ${statusClass}">${statusLabels[app.status]}</span>
            </div>
            <p>${app.position}</p>
            <p style="font-size: 0.8rem; color: #999;">${date}</p>
            <div style="margin-top: 0.5rem;">
                <button onclick="updateApplicationStatus(${data.applications.length - 1 - index}, 'response')" style="font-size: 0.8rem; padding: 0.25rem 0.5rem; margin-right: 0.5rem;">Réponse reçue</button>
                <button onclick="updateApplicationStatus(${data.applications.length - 1 - index}, 'interview')" style="font-size: 0.8rem; padding: 0.25rem 0.5rem;">Entretien</button>
                <button onclick="deleteApplication(${data.applications.length - 1 - index})" style="font-size: 0.8rem; padding: 0.25rem 0.5rem; background: #ff6b6b; color: white; float: right;">×</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function updateApplicationStatus(index, status) {
    const data = getData();
    data.applications[index].status = status;
    saveData(data);
    loadApplications();
    
    if (status === 'interview') {
        addChatMessage("🎉 Un entretien ! C'est génial ! Tu vas assurer ! Prépare-toi bien et reste toi-même. Je crois en toi ! 💪", 'kiala');
    }
}

function deleteApplication(index) {
    if (confirm('Supprimer cette candidature ?')) {
        const data = getData();
        data.applications.splice(index, 1);
        saveData(data);
        loadApplications();
    }
}

// ========== CHAT KIALA BEST ==========

function toggleChat() {
    const chatWin = document.getElementById('chat-window');
    chatWin.classList.toggle('open');
    
    if (chatWin.classList.contains('open')) {
        scrollChatToBottom();
        document.getElementById('chatInput').focus();
        
        // Message de bienvenue si c'est la première ouverture
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer.children.length === 0) {
            addChatMessage("Coucou toi 🦋 Je suis Kiala, ton amie virtuelle. Je suis là pour t'écouter, t'encourager et te rappeler ta force. Comment te sens-tu aujourd'hui ?", 'kiala');
        }
    }
}

function scrollChatToBottom() {
    const container = document.getElementById('chat-messages');
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 100);
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    
    if (text !== "") {
        addChatMessage(text, 'user');
        input.value = "";
        
        // Réponse de Kiala
        setTimeout(() => {
            const response = generateKialaResponse(text);
            addChatMessage(response, 'kiala');
        }, 800);
    }
}

function addChatMessage(text, sender) {
    const container = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    
    const safeText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    msgDiv.innerHTML = `
        <div class="message-avatar">${sender === 'user' ? '👤' : '🦋'}</div>
        <div class="message-content">
            <p>${safeText}</p>
        </div>
    `;
    
    container.appendChild(msgDiv);
    scrollChatToBottom();
}

function generateKialaResponse(userMessage) {
    const lowerMsg = userMessage.toLowerCase();
    
    // Réponses contextuelles
    if (lowerMsg.includes('triste') || lowerMsg.includes('difficile') || lowerMsg.includes('dur')) {
        const responses = [
            "Je suis là avec toi. Les moments difficiles passent. Tu es plus forte que tu ne le penses. 💜",
            "Prends le temps qu'il te faut. Il n'y a pas de pression. Chaque jour est nouveau. 🌸",
            "Tu as le droit de te sentir ainsi. Tes émotions sont valides. Je suis là pour toi. 💝"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (lowerMsg.includes('merci') || lowerMsg.includes('content') || lowerMsg.includes('mieux')) {
        const responses = [
            "Je suis si heureuse pour toi ! Continue à briller ! ✨",
            "Tu vois ? Tu es capable de grandes choses ! Je suis fière de toi ! 🌟",
            "C'est merveilleux ! Savoure ce moment. Tu le mérites ! 💫"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (lowerMsg.includes('peur') || lowerMsg.includes('inquiet')) {
        return "La peur est normale. Mais rappelle-toi : tu as déjà surmonté tellement de choses. Tu es courageuse, même quand tu ne te sens pas l'être. 🦋";
    }
    
    if (lowerMsg.includes('fatigue') || lowerMsg.includes('épuisé')) {
        return "Repose-toi. Prendre soin de toi n'est pas égoïste, c'est essentiel. Tu ne peux pas verser d'une tasse vide. 💜";
    }
    
    // Réponses générales
    const generalResponses = [
        "Je suis là avec toi. On avance ensemble, petit à petit. ✨",
        "Tu es plus forte que tu ne le penses. Continue comme ça ! 💜",
        "Chaque petit pas compte. Je suis fière de toi. 🌱",
        "Prends le temps dont tu as besoin. Il n'y a pas de pression. 🦋",
        "Tu fais de ton mieux, et c'est exactement ce qu'il faut. 💝",
        "Je crois en toi, même quand tu n'y crois pas toi-même. ✨",
        "N'oublie pas : tu mérites d'être heureuse. 🌸",
        "Les moments difficiles passent. Tu vas y arriver. ☀️"
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}

// ========== PARAMÈTRES ==========

function saveUserName() {
    const input = document.getElementById('user-name-input');
    if (input) {
        const data = getData();
        data.userName = input.value;
        saveData(data);
        
        const display = document.getElementById('user-name-display');
        if (display) {
            display.textContent = input.value || 'toi';
        }
    }
}

function toggleDarkMode() {
    const data = getData();
    data.darkMode = !data.darkMode;
    saveData(data);
    
    document.body.classList.toggle('dark-mode');
}

function exportData() {
    const data = getData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mamboly-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    alert('📥 Tes données ont été exportées ! Garde ce fichier en sécurité.');
}

function importData() {
    document.getElementById('import-file').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            localStorage.setItem('mambolyData', JSON.stringify(data));
            alert('📤 Données importées avec succès ! Rechargement...');
            location.reload();
        } catch (error) {
            alert('❌ Erreur lors de l\'import. Fichier invalide.');
        }
    };
    reader.readAsText(file);
}

function clearAllData() {
    const confirmation = prompt('⚠️ ATTENTION ! Cette action est IRRÉVERSIBLE.\n\nTu vas perdre TOUTES tes données : victoires, journal, candidatures, tout.\n\nTape "SUPPRIMER" pour confirmer :');
    
    if (confirmation === 'SUPPRIMER') {
        localStorage.clear();
        alert('🗑️ Toutes les données ont été effacées.');
        location.reload();
    }
}

// ========== SERVICE WORKER ==========

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}
