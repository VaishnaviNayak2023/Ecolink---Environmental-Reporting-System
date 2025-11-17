document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('report-form');
    const fileUpload = document.getElementById('file-upload');
    const fileDropArea = document.getElementById('file-drop-area');
    const fileList = document.getElementById('file-list');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categoryInput = document.getElementById('category');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const currentLocationText = document.getElementById('current-location-text');

    // --- 1. LEAFLET MAP INITIALIZATION AND LOCATION ---
    const DEFAULT_LAT = 34.0522; // Los Angeles
    const DEFAULT_LNG = -118.2437;
    const INITIAL_ZOOM = 13;

    const map = L.map('map').setView([DEFAULT_LAT, DEFAULT_LNG], INITIAL_ZOOM);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let incidentMarker = L.marker([DEFAULT_LAT, DEFAULT_LNG]).addTo(map);

    const updateLocation = (lat, lng) => {
        latitudeInput.value = lat.toFixed(6);
        longitudeInput.value = lng.toFixed(6);
        incidentMarker.setLatLng([lat, lng]);
        map.setView([lat, lng], map.getZoom());
    };

    map.on('click', (e) => {
        updateLocation(e.latlng.lat, e.latlng.lng);
        currentLocationText.textContent = `Manual Location Set: Lat ${e.latlng.lat.toFixed(5)}, Lng ${e.latlng.lng.toFixed(5)}`;
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            updateLocation(lat, lng);
            currentLocationText.textContent = 'Current Location Detected (Click map to adjust)';
        }, () => {
            currentLocationText.textContent = 'Could not detect location. Click on the map.';
            updateLocation(DEFAULT_LAT, DEFAULT_LNG);
        });
    } else {
        currentLocationText.textContent = 'Geolocation not supported. Click on the map.';
        updateLocation(DEFAULT_LAT, DEFAULT_LNG);
    }

    // --- 2. FILE UPLOAD HANDLING ---
    let selectedFiles = [];
    const MAX_FILE_SIZE_MB = 10;
    const SUPPORTED_MIMES = {
        'image/jpeg': 'JPG', 'image/png': 'PNG', 'image/gif': 'GIF',
        'video/mp4': 'MP4', 'video/quicktime': 'MOV',
        'application/pdf': 'PDF'
    };

    const renderFileList = () => {
        fileList.innerHTML = '';
        if (selectedFiles.length === 0) {
            fileList.innerHTML = '<p style="color: #6c757d; font-size: 0.9em;">No files selected.</p>';
            return;
        }
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');
            let iconClass = 'far fa-file';
            if (file.type.startsWith('image')) iconClass = 'far fa-image';
            else if (file.type.startsWith('video')) iconClass = 'far fa-video';
            else if (file.type.includes('pdf')) iconClass = 'far fa-file-pdf';
            fileItem.innerHTML = `
                <i class="${iconClass}"></i>
                <span>${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                <i class="fas fa-times remove-file" data-index="${index}"></i>
            `;
            fileList.appendChild(fileItem);
        });

        document.querySelectorAll('.remove-file').forEach(button => {
            button.addEventListener('click', (e) => {
                const indexToRemove = parseInt(e.target.dataset.index);
                selectedFiles.splice(indexToRemove, 1);
                renderFileList();
            });
        });
    };

    const handleFiles = (files) => {
        Array.from(files).forEach(file => {
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                alert(`File ${file.name} is too large (max ${MAX_FILE_SIZE_MB}MB).`);
                return;
            }
            if (!SUPPORTED_MIMES[file.type] && !Object.keys(SUPPORTED_MIMES).some(mime => file.type.startsWith(mime.split('/')[0]))) {
                alert(`File ${file.name} has an unsupported format.`);
                return;
            }
            selectedFiles.push(file);
        });
        renderFileList();
    };

    fileUpload.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        fileUpload.value = null;
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, (e) => {
            e.preventDefault(); e.stopPropagation();
        }, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, () => fileDropArea.classList.add('highlight'));
    });
    ['dragleave', 'drop'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, () => fileDropArea.classList.remove('highlight'));
    });
    fileDropArea.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files), false);

    // --- 3. CATEGORY SELECTION ---
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            categoryInput.value = button.dataset.category;
        });
    });

    // --- 4. FORM SUBMISSION (DUMMY) ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        // Validation
        if (!categoryInput.value) {
            alert('Please select an incident category.');
            submitBtn.disabled = false; submitBtn.textContent = 'Submit Report';
            return;
        }
        if (selectedFiles.length === 0 && !document.getElementById('description').value.trim()) {
            alert('A report requires either a description or at least one file/photo.');
            submitBtn.disabled = false; submitBtn.textContent = 'Submit Report';
            return;
        }

        // Simulate submission delay
        setTimeout(() => {
            const IncidentId = 'QR';
            let msg = `✅ Report submitted successfully! Incident ID: ${IncidentId}`;
            if (selectedFiles.length) {
                msg += `\nUploaded Files:\n` + selectedFiles.map(f => `- ${f.name}`).join('\n');
            }
            alert(msg);

            // Reset form
            form.reset();
            selectedFiles = [];
            renderFileList();
            categoryButtons.forEach(btn => btn.classList.remove('selected'));
            updateLocation(DEFAULT_LAT, DEFAULT_LNG);

            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Report';
        }, 1000);
    });

    // --- 5. RESET/CANCEL BUTTONS ---
    document.querySelector('.btn-reset').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all fields?')) {
            form.reset();
            selectedFiles = [];
            renderFileList();
            categoryButtons.forEach(btn => btn.classList.remove('selected'));
            updateLocation(DEFAULT_LAT, DEFAULT_LNG);
        }
    });

    document.querySelector('.btn-cancel').addEventListener('click', () => {
        if (confirm('Are you sure you want to cancel and go back to the homepage?')) {
            window.location.href = 'homepage.html';
        }
    });

    renderFileList();
});
