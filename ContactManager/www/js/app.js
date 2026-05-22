'use strict';

let contacts  = JSON.parse(localStorage.getItem('contacts')) || [];
let editingId = null;
let toastTimer = null;

document.addEventListener('deviceready', init, false);
document.addEventListener('DOMContentLoaded', init, false);

function init() {
    displayContacts();
    updateStats();
}

/* ══════════════════════════════════════
   AJOUTER
══════════════════════════════════════ */
function addContact() {
    const name  = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!name || !phone || !email) {
        showToast('Veuillez remplir tous les champs.', 'error');
        return;
    }
    if (!validateEmail(email)) {
        showToast('Adresse email invalide.', 'error');
        return;
    }

    contacts.push({
        id: Date.now(),
        name, phone, email,
        favorite:  false,
        createdAt: new Date().toISOString()
    });

    save();
    displayContacts();
    updateStats();
    clearInputs();
    showToast('Contact ajouté !', 'success');
}

/* ══════════════════════════════════════
   AFFICHER
══════════════════════════════════════ */
function displayContacts(list) {
    if (!list) list = getSortedContacts();

    const el    = document.getElementById('contactList');
    const total = contacts.length;

    document.getElementById('counter').textContent =
        total + ' contact' + (total > 1 ? 's' : '');

    if (list.length === 0) {
        el.innerHTML = `
            <div class="empty">
                <span class="empty-icon">📭</span>
                <p>${total === 0
                    ? 'Aucun contact. Ajoutez-en un !'
                    : 'Aucun résultat trouvé.'}</p>
            </div>`;
        return;
    }

    el.innerHTML = list.map(c => `
        <div class="contact ${c.favorite ? 'is-fav' : ''}">
            <div class="avatar">${c.name.charAt(0).toUpperCase()}</div>
            <div class="contact-info">
                <h3>${c.favorite ? '⭐ ' : ''}${escHtml(c.name)}</h3>
                <p>📞 ${escHtml(c.phone)}</p>
                <p>✉️ ${escHtml(c.email)}</p>
            </div>
            <div class="contact-actions">
                <button class="btn-fav ${c.favorite ? 'active' : ''}"
                        onclick="toggleFav(${c.id})">
                    ${c.favorite ? '★ Fav' : '☆ Fav'}
                </button>
                <button class="btn-edit" onclick="openModal(${c.id})">✏️ Éditer</button>
                <button class="btn-del"  onclick="deleteContact(${c.id})">🗑 Suppr.</button>
            </div>
        </div>
    `).join('');
}

/* ══════════════════════════════════════
   SUPPRIMER
══════════════════════════════════════ */
function deleteContact(id) {
    if (!confirm('Supprimer ce contact ?')) return;
    const c = contacts.find(x => x.id === id);
    contacts = contacts.filter(x => x.id !== id);
    save();
    displayContacts();
    updateStats();
    showToast('"' + c.name + '" supprimé.', 'error');
}

/* ══════════════════════════════════════
   FAVORIS
══════════════════════════════════════ */
function toggleFav(id) {
    contacts = contacts.map(c =>
        c.id === id ? Object.assign({}, c, { favorite: !c.favorite }) : c
    );
    save();
    displayContacts();
    updateStats();
    const c = contacts.find(x => x.id === id);
    showToast(c.favorite ? '⭐ Ajouté aux favoris' : 'Retiré des favoris', 'info');
}

/* ══════════════════════════════════════
   RECHERCHE
══════════════════════════════════════ */
function searchContact() {
    const q = document.getElementById('search').value.toLowerCase().trim();
    if (!q) { displayContacts(); return; }
    displayContacts(
        getSortedContacts().filter(c =>
            c.name.toLowerCase().includes(q)  ||
            c.phone.includes(q)               ||
            c.email.toLowerCase().includes(q)
        )
    );
}

/* ══════════════════════════════════════
   TRI
══════════════════════════════════════ */
function sortContacts() { searchContact(); }

function getSortedContacts() {
    const mode = document.getElementById('sortSelect').value;
    const list = contacts.slice();
    if (mode === 'alpha') {
        list.sort(function(a, b) { return a.name.localeCompare(b.name); });
    } else if (mode === 'fav') {
        list.sort(function(a, b) {
            return (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
        });
    } else {
        list.sort(function(a, b) { return b.id - a.id; });
    }
    return list;
}

/* ══════════════════════════════════════
   MODAL MODIFICATION
══════════════════════════════════════ */
function openModal(id) {
    const c = contacts.find(function(x) { return x.id === id; });
    if (!c) return;
    editingId = id;
    document.getElementById('edit-name').value  = c.name;
    document.getElementById('edit-phone').value = c.phone;
    document.getElementById('edit-email').value = c.email;
    document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
    editingId = null;
    document.getElementById('modal-overlay').classList.add('hidden');
}

function closeModalOverlay(e) {
    if (e.target.id === 'modal-overlay') closeModal();
}

function saveEdit() {
    const name  = document.getElementById('edit-name').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    const email = document.getElementById('edit-email').value.trim();

    if (!name || !phone || !email) {
        showToast('Veuillez remplir tous les champs.', 'error');
        return;
    }
    if (!validateEmail(email)) {
        showToast('Adresse email invalide.', 'error');
        return;
    }

    contacts = contacts.map(function(c) {
        return c.id === editingId
            ? Object.assign({}, c, { name: name, phone: phone, email: email })
            : c;
    });

    save();
    displayContacts();
    updateStats();
    closeModal();
    showToast('Contact modifié !', 'success');
}

/* ══════════════════════════════════════
   EXPORT JSON
══════════════════════════════════════ */
function exportContacts() {
    if (contacts.length === 0) {
        showToast('Aucun contact à exporter.', 'error');
        return;
    }

    const data     = JSON.stringify(contacts, null, 2);
    const fileName = 'contacts_' + new Date().toISOString().slice(0, 10) + '.json';

    if (window.cordova && window.cordova.file) {
        var dir = cordova.file.externalRootDirectory
                ? cordova.file.externalRootDirectory + 'Download/'
                : cordova.file.dataDirectory;

        window.resolveLocalFileSystemURL(dir, function(dirEntry) {
            dirEntry.getFile(fileName, { create: true, exclusive: false },
                function(fileEntry) {
                    fileEntry.createWriter(function(writer) {
                        writer.onwriteend = function() {
                            showToast('Exporté : Téléchargements/' + fileName, 'success');
                        };
                        writer.onerror = function() {
                            showToast('Erreur lors de l\'écriture.', 'error');
                        };
                        writer.write(new Blob([data], { type: 'application/json' }));
                    });
                },
                function() { showToast('Impossible de créer le fichier.', 'error'); }
            );
        }, function() {
            showToast('Dossier inaccessible.', 'error');
        });

    } else {
        var blob = new Blob([data], { type: 'application/json' });
        var url  = URL.createObjectURL(blob);
        var a    = document.createElement('a');
        a.href     = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        showToast(contacts.length + ' contact(s) exporté(s) !', 'success');
    }
}

/* ══════════════════════════════════════
   IMPORT JSON
══════════════════════════════════════ */
function importContacts(event) {
    var file = event.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var imported = JSON.parse(e.target.result);
            if (!Array.isArray(imported)) throw new Error('Format invalide');

            var added = 0;
            imported.forEach(function(imp) {
                if (!imp.name || !imp.phone || !imp.email) return;
                var exists = contacts.some(function(c) {
                    return c.phone === imp.phone || c.email === imp.email;
                });
                if (!exists) {
                    contacts.push({
                        id:        Date.now() + Math.floor(Math.random() * 1000),
                        name:      imp.name,
                        phone:     imp.phone,
                        email:     imp.email,
                        favorite:  imp.favorite  || false,
                        createdAt: imp.createdAt || new Date().toISOString()
                    });
                    added++;
                }
            });

            save();
            displayContacts();
            updateStats();
            showToast(added + ' contact(s) importé(s) !', 'success');
        } catch (err) {
            showToast('Fichier JSON invalide.', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

/* ══════════════════════════════════════
   STATS
══════════════════════════════════════ */
function updateStats() {
    var today = new Date().toISOString().slice(0, 10);
    document.getElementById('stat-total').textContent =
        contacts.length;
    document.getElementById('stat-fav').textContent =
        contacts.filter(function(c) { return c.favorite; }).length;
    document.getElementById('stat-recent').textContent =
        contacts.filter(function(c) {
            return c.createdAt && c.createdAt.startsWith(today);
        }).length;
}

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
function showToast(msg, type) {
    type = type || 'info';
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.className   = 'toast ' + type;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
        t.classList.add('hidden');
    }, 3000);
}

/* ══════════════════════════════════════
   UTILS
══════════════════════════════════════ */
function save() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

function clearInputs() {
    ['name', 'phone', 'email'].forEach(function(id) {
        document.getElementById(id).value = '';
    });
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}