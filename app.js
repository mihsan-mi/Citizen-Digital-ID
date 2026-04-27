document.addEventListener('DOMContentLoaded', () => {
    // 1. App State & Role Management
    let currentRole = 'owner'; // default
    let activeCategory = null;
    let isAuthenticated = false; // Starts locked

    const roleSelect = document.getElementById('role-select');
    const viewCategories = document.getElementById('view-categories');
    const viewAuth = document.getElementById('view-auth');
    const viewDetails = document.getElementById('view-details');
    
    // Login & Scanner Elements
    const loginOverlay = document.getElementById('view-login');
    const btnBiometric = document.getElementById('btn-biometric');
    const scannerPopup = document.getElementById('scanner-popup');

    // Auth Elements
    const officerPrompt = document.getElementById('officer-prompt');
    const biometricPrompt = document.getElementById('biometric-prompt');
    const sensorPad = document.getElementById('sensor-pad');
    const approveBtn = document.getElementById('approve-request');
    const denyBtn = document.getElementById('deny-request');
    const officerRoleText = document.getElementById('officer-role');

    // 2. Mock Data for Categories
    const categoryData = {
        financial: {
            title: "FINANCIAL LEDGERS",
            restrictedTo: ['owner'], 
            panels: [
                {
                    title: "DOMESTIC HOLDINGS",
                    content: `
                        <div class="field"><span class="field-label">LKR Balance</span><span class="field-value cyan">842,500 LKR</span></div>
                        <div class="field"><span class="field-label">General Properties</span><span class="field-value">None</span></div>
                        <div class="field"><span class="field-label">Vehicles Owned</span><span class="field-value">1x Tesla Cyberbike</span></div>
                    `
                },
                {
                    title: "CREDENTIAL TOKENS (CT)",
                    content: `
                        <div class="field"><span class="field-label">Balance</span><span class="field-value cyan">512 CT</span></div>
                        <div class="field"><span class="field-label">Interest Accrual</span><span class="field-value">1.4% Monthly</span></div>
                        <div class="field"><span class="field-label">Sync status</span><span class="field-value">Secured</span></div>
                    `
                },
                {
                    title: "AWARENESS CREDITS (AP)",
                    content: `
                        <div class="field"><span class="field-label">Current Balance</span><span class="field-value cyan">2,240 AP</span></div>
                        <div class="field"><span class="field-label">Debt Due</span><span class="field-value amber">-52 AP</span></div>
                        <div class="field"><span class="field-label">Complete Debt</span><span class="field-value amber">-300 AP</span></div>
                        <div class="field"><span class="field-label">Deadline</span><span class="field-value amber">DUE: 7 Days</span></div>
                    `
                }
            ]
        },
        medical: {
            title: "MEDICAL & DIAGNOSTICS",
            restrictedTo: ['owner', 'medical'], 
            panels: [
                {
                    title: "NEURAL VITALS",
                    content: `
                        <div class="field"><span class="field-label">Neural Load</span><span class="field-value">42.8%</span></div>
                        <div class="field"><span class="field-label">Cognitive Stability</span><span class="field-value">92.8%</span></div>
                        <div class="field"><span class="field-label">Sync Pulse</span><span class="field-value cyan">Stable</span></div>
                    `
                },
                {
                    title: "INOCULATION LOGS",
                    content: `
                        <div class="field"><span class="field-label">Anti-Virus Overlay</span><span class="field-value">Level 4</span></div>
                        <div class="field"><span class="field-label">Last Patch Node</span><span class="field-value">Hub-042</span></div>
                    `
                },
                {
                    title: "OCULAR IMPLANTS",
                    content: `
                        <div class="field"><span class="field-label">Hardware</span><span class="field-value">Ray-Ban Optic v4.2</span></div>
                        <div class="field"><span class="field-label">Refresh Stress</span><span class="field-value amber">High Range</span></div>
                        <div class="field"><span class="field-label">Bandwidth Quota</span><span class="field-value">12.4 GB/s</span></div>
                    `
                },
                {
                    title: "MENTAL OVERDRIVE",
                    content: `
                        <div class="field"><span class="field-label">CPU Sync Load</span><span class="field-value">84.2%</span></div>
                        <div class="field"><span class="field-label">Buffer Fatigue</span><span class="field-value amber">WARNING (Soft)</span></div>
                    `
                }
            ]
        },
        residency: {
            title: "RESIDENCY & TRANSIT",
            restrictedTo: ['owner', 'security'],
            panels: [
                {
                    title: "ZONE CLEARANCES",
                    content: `
                        <div class="field"><span class="field-label">Sector 4</span><span class="field-value cyan">APPROVED</span></div>
                        <div class="field"><span class="field-label">Apex District</span><span class="field-value cyan">APPROVED</span></div>
                        <div class="field"><span class="field-label">Outer Rim</span><span class="field-value amber">RESTRICTED</span></div>
                    `
                },
                {
                    title: "TRANSIT LOGS",
                    content: `
                        <div class="field"><span class="field-label">Last Terminal</span><span class="field-value">Terminal A-12</span></div>
                        <div class="field"><span class="field-label">Log Time</span><span class="field-value">11:42:04</span></div>
                    `
                }
            ]
        },
        career: {
            title: "CAREER & PROGRESSION",
            restrictedTo: ['owner'],
            panels: [
                {
                    title: "CURRENT OCCUPATION",
                    content: `
                        <div class="field"><span class="field-label">Role</span><span class="field-value">Information Courier</span></div>
                        <div class="field"><span class="field-label">Base Salary</span><span class="field-value cyan">180,000 LKR</span></div>
                        <div class="field"><span class="field-label">Bonus status</span><span class="field-value cyan">+2,400 CT</span></div>
                        <div class="field"><span class="field-label">AP Insurance</span><span class="field-value">Valid 30D / 1Y</span></div>
                        <div class="field"><span class="field-label">AP Lease Duty (6M)</span><span class="field-value amber">52 AP (Month) / 312 AP Total</span></div>
                    `
                },
                {
                    title: "PART-TIME STATUS",
                    content: `
                        <div class="field"><span class="field-label">Role</span><span class="field-value">Data Node Seeder</span></div>
                        <div class="field"><span class="field-label">Time Limit</span><span class="field-value">12h / Week</span></div>
                        <div class="field"><span class="field-label">Salary Estimation</span><span class="field-value cyan">45,000 LKR</span></div>
                        <div class="field"><span class="field-label">Requirement AP</span><span class="field-value">+15 AP / Cycle</span></div>
                    `
                },
                {
                    title: "DREAM CAREER PLAN",
                    content: `
                        <div class="field"><span class="field-label">Target Role</span><span class="field-value">Hub Director</span></div>
                        <div class="field"><span class="field-label">Required AP</span><span class="field-value">500,000 AP</span></div>
                        <div class="field"><span class="field-label">Progress Rate</span><span class="field-value">28.5%</span></div>
                    `
                }
            ]
        },
        compliance: {
            title: "CIVIC COMPLIANCE",
            restrictedTo: ['owner', 'security'],
            panels: [
                {
                    title: "OUTSTANDING INFRACTIONS",
                    content: `
                        <div class="field"><span class="field-label">Border Breach</span><span class="field-value amber">Cooldown: 14D</span></div>
                        <div class="field"><span class="field-label">Over-speed Quota</span><span class="field-value">Clear</span></div>
                    `
                },
                {
                    title: "SECURED ZONE LOGINS",
                    content: `
                        <div class="field"><span class="field-label">Vault-01</span><span class="field-value cyan">Authorized</span></div>
                        <div class="field"><span class="field-label">Data Node-X</span><span class="field-value amber">Locked</span></div>
                    `
                }
            ]
        },
        footprint: {
            title: "DATA FOOTPRINT",
            restrictedTo: ['owner'],
            panels: [
                {
                    title: "ACTIVE SYNC NODES",
                    content: `
                        <div class="field"><span class="field-label">Anchor 1</span><span class="field-value">Cloud-Sector B</span></div>
                        <div class="field"><span class="field-label">Bandwidth Usage</span><span class="field-value">84%</span></div>
                    `
                },
                {
                    title: "NEWSROOM CLAIMS",
                    content: `
                        <div class="field"><span class="field-label">Active Ownership</span><span class="field-value">3 Assets</span></div>
                        <div class="field"><span class="field-label">Payout Node</span><span class="field-value">Hub-Alpha</span></div>
                    `
                }
            ]
        },
        social: {
            title: "SOCIAL DYNAMICS",
            restrictedTo: ['owner'],
            panels: [
                {
                    title: "REAL LIFE DATA",
                    content: `
                        <div class="field"><span class="field-label">Reputation Multiplier</span><span class="field-value">x1.24</span></div>
                        <div class="field"><span class="field-label">Commendations</span><span class="field-value cyan">5 Verified</span></div>
                    `
                },
                {
                    title: "SOCIAL MEDIA STREAMS",
                    content: `
                        <div class="field"><span class="field-label">Interactions Rate</span><span class="field-value">4.2k / H</span></div>
                        <div class="field"><span class="field-label">Clarity Score</span><span class="field-value">88.4%</span></div>
                    `
                }
            ]
        },
        logs: {
            title: "LEGAL MONITORING LOGS",
            restrictedTo: ['owner', 'security'],
            panels: [
                {
                    title: "TERMS & CONDITIONS",
                    content: `
                        <div class="field"><span class="field-label">Node-Access Terms</span><span class="field-value cyan">Agreed</span></div>
                        <div class="field"><span class="field-label">Zone-Transit Agreement</span><span class="field-value cyan">Agreed</span></div>
                    `
                },
                {
                    title: "LOCATION RECORDING",
                    content: `
                        <div class="field"><span class="field-label">Active Track</span><span class="field-value cyan">ON</span></div>
                        <div class="field"><span class="field-label">Local Pings</span><span class="field-value">Continuous</span></div>
                    `
                },
                {
                    title: "SYSTEM ACTIVITY STREAM",
                    content: `
                        <div class="log-stream" style="flex: 1; overflow-y: auto; padding-right: 12px; display: flex; flex-direction: column; gap: 4px;">
                            ${[
                                { time: "13:42:04", type: "Transit", desc: "Terminal A-12 Gate passed", status: "cyan", note: "Clear" },
                                { time: "13:30:15", type: "Terms", desc: "Agreed: Cafe Hub Mesh Nodes", status: "cyan", note: "Agreed" },
                                { time: "13:14:22", type: "Sync", desc: "Biometric heartrate synced", status: "cyan", note: "Stable" },
                                { time: "12:55:01", type: "Finance", desc: "Deduct 4 AP: Retail coffee", status: "cyan", note: "Approved" },
                                { time: "12:42:18", type: "Network", desc: "Ocular firmware v4.2 validated", status: "cyan", note: "Success" },
                                { time: "12:30:04", type: "Transit", desc: "Sector 4 entry clearance", status: "cyan", note: "Approved" },
                                { time: "12:15:33", type: "Terms", desc: "Workspace terms renewed", status: "cyan", note: "30D Cycle" },
                                { time: "11:58:12", type: "Security", desc: "Alert: Near Restricted Wall", status: "amber", note: "Warning" },
                                { time: "11:45:00", type: "Finance", desc: "Payout: Information Courier", status: "cyan", note: "+240 CT" },
                                { time: "11:30:12", type: "Diagnostics", desc: "Cog stability sync loaded", status: "cyan", note: "88%" },
                                { time: "11:15:45", type: "Transit", desc: "Apex District Highway Exit B", status: "cyan", note: "Passed" },
                                { time: "11:00:22", type: "Network", desc: "Locked 1 Asset claim: Newsroom", status: "cyan", note: "Secured" },
                                { time: "10:45:10", type: "Terms", desc: "Transit-Transit Terms accepted", status: "cyan", note: "Agreed" },
                                { time: "10:30:04", type: "Sync", desc: "Neural Load bandwidth peak", status: "cyan", note: "Stable" },
                                { time: "10:15:00", type: "Finance", desc: "Debt clearance triggered", status: "cyan", note: "Cleared" },
                                { time: "10:00:15", type: "Security", desc: "Visual tracking node enabled", status: "cyan", note: "Active" },
                                { time: "09:45:44", type: "Terms", desc: "Micro-agreements: Retail Hub", status: "cyan", note: "Agreed" },
                                { time: "09:30:12", type: "Transit", desc: "Workplace login Terminal 3", status: "cyan", note: "Logged" },
                                { time: "09:15:00", type: "Finance", desc: "Credential Credit test clearance", status: "cyan", note: "Success" },
                                { time: "09:01:22", type: "Diagnostics", desc: "Routine scan node verified", status: "cyan", note: "Clear" },
                                { time: "08:45:00", type: "Transit", desc: "Residence Node exit", status: "cyan", note: "Logged" },
                                { time: "08:30:12", type: "Network", desc: "Daily Sync token buffer cleared", status: "cyan", note: "Success" },
                                { time: "08:15:00", type: "Terms", desc: "Medical Sync waiver accepted", status: "cyan", note: "Agreed" },
                                { time: "08:00:15", type: "Security", desc: "Location trigger: Home Node", status: "cyan", note: "Verified" },
                                { time: "07:45:00", type: "Diagnostics", desc: "Wake cycles node stability", status: "cyan", note: "Confirm" },
                                { time: "07:30:11", type: "Finance", desc: "Daily rate node capping", status: "cyan", note: "Validated" },
                                { time: "07:15:00", type: "Transit", desc: "Sector 9 transit hub", status: "cyan", note: "Passed" },
                                { time: "07:00:00", type: "Network", desc: "Initial boot sequence complete", status: "cyan", note: "Online" },
                                { time: "06:45:12", type: "Terms", desc: "System terms auto-renewed", status: "cyan", note: "30D cycle" },
                                { time: "06:15:10", type: "Sync", desc: "Cloud Sync cycle node complete", status: "cyan", note: "Success" },
                                { time: "05:45:00", type: "Network", desc: "Backup buffer download complete", status: "cyan", note: "Ready" },
                                { time: "05:30:12", type: "Diagnostics", desc: "Heartbeat resting pulse test", status: "cyan", note: "Stable" }
                            ].map(log => `
                                <div style="display: flex; justify-content: space-between; align-items: center; background: #000; padding: 12px 14px; border-left: 3px solid var(--border-${log.status}); border-bottom: 1px solid var(--border-dark);">
                                    <div style="display: flex; flex-direction: column; gap: 2px;">
                                        <div style="display: flex; gap: 8px;">
                                            <span style="color: var(--text-muted); font-family: 'Space Mono', monospace; font-size: 0.65rem;">${log.time}</span>
                                            <span style="color: var(--border-${log.status}); font-weight: 700; font-size: 0.65rem; text-transform: uppercase;">${log.type}</span>
                                        </div>
                                        <span style="color: #FFF; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">${log.desc}</span>
                                    </div>
                                    <span style="color: var(--text-muted); font-family: 'Space Mono', monospace; font-size: 0.6rem; font-weight: 700; text-transform: uppercase;">${log.note}</span>
                                </div>
                            `).join('')}
                        </div>
                    `
                }
            ]
        }
    };

    // 3. Login Flow & Continuous Scanner
    btnBiometric.addEventListener('click', () => {
        const scanModal = document.getElementById('scan-modal');
        
        scanModal.classList.remove('hidden'); // Reveal scan popup
        
        setTimeout(() => {
            isAuthenticated = true;
            scanModal.classList.add('hidden');
            loginOverlay.classList.add('hidden'); // Hide login overlay
            startContinuousScanning(); // Trigger interval bar
        }, 2600); // Give 2.6s for sweep animation
    });

    function startContinuousScanning() {
        setInterval(() => {
            scannerPopup.classList.add('active');
            setTimeout(() => {
                scannerPopup.classList.remove('active');
            }, 3000); // stay visible 3s
        }, 10000); // 10 SECONDS AS REQUESTED
    }

    // 4. Role Selector Listener
    roleSelect.addEventListener('change', (e) => {
        currentRole = e.target.value;
        resetToDefault();
    });

    // 5. Category Clicks listeners
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            if (!isAuthenticated) return;
            activeCategory = card.getAttribute('data-category');
            validateAndOpen(activeCategory);
        });
    });

    // 6. Validation State Machine Overhaul
    function validateAndOpen(category) {
        const data = categoryData[category];

        // check role access upfront
        if (data.restrictedTo && !data.restrictedTo.includes(currentRole)) {
            alert(`⚠️ ACCESS DENIED: ${currentRole.toUpperCase()} not authorized for ${category.toUpperCase()}`);
            return;
        }

        // Owner Bypass auth overlays
        if (currentRole === 'owner') {
            renderDetails(category);
            switchState(viewDetails);
            return;
        }

        // Officer asks Consent -> trigger central sensor overlays
        switchState(viewAuth);
        officerPrompt.classList.remove('hidden');
        biometricPrompt.classList.add('hidden'); 

        const officerDept = currentRole === 'medical' ? "Med-Tech Corps" : "Security Division";
        const officerID = currentRole === 'medical' ? "7741" : "8922";
        officerRoleText.innerHTML = `<span class="cyan">${officerDept} Officer (ID-${officerID})</span> is requesting access to <span class="cyan">${data.title}</span>`;
    }

    // Approve Officer Request Trigger workflow loaded 
    approveBtn.addEventListener('click', () => {
        officerPrompt.classList.add('hidden');
        biometricPrompt.classList.remove('hidden');
    });

    denyBtn.addEventListener('click', () => {
        resetToDefault();
    });

    // Biometric scanner click simulation triggers verified expansion panels sliders correctly 
    sensorPad.addEventListener('click', () => {
        const laser = sensorPad.querySelector('.scan-laser');
        laser.style.animationDuration = '0.4s'; // speed up for click validation
        setTimeout(() => {
            laser.style.animationDuration = '2s';
            renderDetails(activeCategory);
            switchState(viewDetails);
        }, 1200);
    });

    document.getElementById('exit-view').addEventListener('click', () => {
        resetToDefault();
        // Clear any open modals on backwards exit
        const backdrop = document.getElementById('card-modal-backdrop');
        if (backdrop) backdrop.classList.remove('active');
        const track = document.getElementById('data-panels-track');
        if (track) track.classList.remove('card-modal-active');
    });

    // Global Modal Backdrop click-off listener Node flawlessly
    const modalBackdrop = document.getElementById('card-modal-backdrop');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', () => {
            document.querySelectorAll('.expanded-modal').forEach(m => m.classList.remove('expanded-modal'));
            const track = document.getElementById('data-panels-track');
            if (track) track.classList.remove('card-modal-active');
            modalBackdrop.classList.remove('active');
        });
    }

    // 6. Rendering Panels details sliders expansion layout controllers
    // 6. Rendering Panels with 3D Stack Rotation Controllers
    let currentPanelIndex = 0;

    function renderDetails(category) {
        const data = categoryData[category];
        let track = document.getElementById('data-panels-track');
        
        // Clone track to wipe stale closure event listeners Node flawlessly
        const freshTrack = track.cloneNode(false);
        track.parentNode.replaceChild(freshTrack, track);
        track = freshTrack;

        const spreadHandle = document.getElementById('spread-handle');
        document.getElementById('active-category-title').textContent = data.title;

        currentPanelIndex = 0; // Reset index on view load node
        track.innerHTML = '';

        // Exception for Monitoring Logs: No 3D Stacking or Spread View
        if (category === 'logs') {
            track.className = 'slider-track static-view';
            spreadHandle.classList.add('hidden');

            // Isolate inner Log Stream from overall document/page scroll deadlocks flawless Node
            setTimeout(() => {
                const logStream = track.querySelector('.log-stream');
                if (logStream) {
                    logStream.addEventListener('wheel', (e) => {
                        e.stopPropagation(); // Stops parent scroll bubbling Node
                    }, { passive: true });
                }
            }, 50);
        } else {
            track.className = 'slider-track';
            spreadHandle.classList.remove('hidden');
            spreadHandle.classList.remove('spread-visible'); // Reset shape
        }

        // Inject panels Absolute stacked configs
        data.panels.forEach((pane) => {
            const div = document.createElement('div');
            div.className = 'detail-pannel-box';
            div.innerHTML = `
                <button class="close-modal-btn">✕</button>
                <div class="pannel-header">${pane.title}</div>
                <div class="pannel-content">
                    ${pane.content}
                </div>
            `;
            
            // Expand into Modal click triggers
            div.addEventListener('click', (e) => {
                if (!track.classList.contains('static-view')) return; // Only in Log mode 
                if (e.target.classList.contains('close-modal-btn')) return; // Ignore close clicks
                
                if (!div.classList.contains('expanded-modal')) {
                    div.classList.add('expanded-modal');
                    track.classList.add('card-modal-active');
                    const backdrop = document.getElementById('card-modal-backdrop');
                    if (backdrop) backdrop.classList.add('active');
                }
            });

            // Close Modal button override
            const closeBtn = div.querySelector('.close-modal-btn');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                div.classList.remove('expanded-modal');
                track.classList.remove('card-modal-active');
                const backdrop = document.getElementById('card-modal-backdrop');
                if (backdrop) backdrop.classList.remove('active');
            });

            track.appendChild(div);
        });

        updateStackClasses(track);

        // --- Touch & Mouse Drag Gesture Controllers ---
        let startX = 0;
        let isDragging = false;

        // Mouse Triggers
        track.addEventListener('mousedown', (e) => { startX = e.clientX; isDragging = true; });
        track.addEventListener('mousemove', (e) => {
            if (track.classList.contains('static-view') || track.classList.contains('spread-view')) return; // Guard
            if (!isDragging) return;
            const currentX = e.clientX;
            const diff = startX - currentX;
            if (Math.abs(diff) > 40) { // Threshold
                if (diff > 0) rotateStack('next'); else rotateStack('prev');
                isDragging = false; // Trigger once per gesture sweep loaded
            }
        });
        track.addEventListener('mouseup', () => isDragging = false);
        track.addEventListener('mouseleave', () => isDragging = false);

        // Touch support
        track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
        track.addEventListener('touchmove', (e) => {
            if (track.classList.contains('static-view') || track.classList.contains('spread-view')) return; // Guard
            const currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            if (Math.abs(diff) > 30) {
                if (diff > 0) rotateStack('next'); else rotateStack('prev');
                startX = currentX; // continuous offset threshold node bounds
            }
        });

        function rotateStack(direction) {
            const total = data.panels.length;
            if (direction === 'next') {
                currentPanelIndex = (currentPanelIndex + 1) % total;
            } else {
                currentPanelIndex = (currentPanelIndex - 1 + total) % total;
            }
            updateStackClasses(track);
        }

        function updateStackClasses(container) {
            const panels = container.querySelectorAll('.detail-pannel-box');
            const total = panels.length;

            if (container.classList.contains('static-view') || container.classList.contains('spread-view')) {
                panels.forEach(p => {
                    p.style.transform = ''; p.style.opacity = ''; p.style.zIndex = '';
                    p.style.filter = ''; p.style.pointerEvents = '';
                });
                return;
            }

            panels.forEach((panel, i) => {
                panel.className = 'detail-pannel-box'; 
                const offset = (i - currentPanelIndex + total) % total;

                if (offset === 0) {
                    panel.classList.add('active');
                    panel.style.transform = 'translate(-50%, -50%) translateZ(0px)';
                    panel.style.zIndex = '50'; panel.style.opacity = '1';
                    panel.style.filter = 'none'; panel.style.pointerEvents = 'auto';
                } else {
                    // Unified Stack Physics: all cards queue behind continuously and loop flawlessly Node
                    const visualOffset = Math.min(offset, 6); // Cap translation limits safely for 20+ cards
                    const zValue = -80 * visualOffset; 
                    const rotateYValue = -9 * visualOffset;
                    const xOffset = 30 + (visualOffset - 1) * 5; 
                    const yOffset = 48 + (visualOffset - 1) * 2;
                    const scaleValue = 1 - (0.04 * visualOffset); 
                    
                    // Gradual depth fade (completely hidden by 4th index depth)
                    const opacityValue = Math.max(0, 1 - (0.28 * offset));

                    panel.style.transform = `translate(-${xOffset}%, -${yOffset}%) translateZ(${zValue}px) rotateY(${rotateYValue}deg) scale(${scaleValue})`;
                    panel.style.zIndex = (50 - offset).toString(); // Strictly descend order flawless
                    panel.style.opacity = opacityValue.toString();
                    panel.style.filter = 'none';
                    panel.style.pointerEvents = 'none';
                }
            });
        }
    }

    // --- Smooth FLIP Animation for Spread View ---
    function animateSpreadToggle(track, activate) {
        const panels = track.querySelectorAll('.detail-pannel-box');
        if (!panels.length) return;

        const startRects = Array.from(panels).map(p => p.getBoundingClientRect());

        if (activate) {
            track.classList.add('spread-view');
        } else {
            track.classList.remove('spread-view');
        }

        const endRects = Array.from(panels).map(p => p.getBoundingClientRect());

        panels.forEach((panel, i) => {
            const start = startRects[i];
            const end = endRects[i];
            if (!start || !end) return;

            const deltaX = start.left - end.left;
            const deltaY = start.top - end.top;

            panel.style.transition = 'none';
            panel.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            
            panel.getBoundingClientRect(); // trigger layout

            panel.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.4s';
            panel.style.transform = 'translate(0, 0)'; 

            setTimeout(() => {
                if (panel.style.transform === 'translate(0px, 0px)' || panel.style.transform === 'translate(0, 0)') {
                    panel.style.transform = '';
                    panel.style.transition = '';
                }
            }, 600);
        });
    }

    // --- Spread View Swipe Toggle Controllers ---
    const spreadHandle = document.getElementById('spread-handle');
    let handleStartY = 0;
    let isHandleDragging = false;

    spreadHandle.addEventListener('mousedown', (e) => { 
        handleStartY = e.clientY; 
        isHandleDragging = true; 
        spreadHandle.style.transition = 'none'; // Instant drag feedback
    });

    window.addEventListener('mousemove', (e) => {
        if (!isHandleDragging) return;
        const currentY = e.clientY;
        const diff = handleStartY - currentY; // Positive = Swipe UP

        // Visual Drag Bounce Feedback (move button limit to 30px offsets)
        const offset = Math.max(-30, Math.min(30, diff * 0.4));
        spreadHandle.style.transform = `translateY(${-offset}px)`;

        const track = document.getElementById('data-panels-track');
        if (diff > 50 && !track.classList.contains('spread-view')) { 
            animateSpreadToggle(track, true);
            spreadHandle.classList.add('spread-visible');
            isHandleDragging = false;
            spreadHandle.style.transform = 'none';
            spreadHandle.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        } else if (diff < -50 && track.classList.contains('spread-view')) { 
            animateSpreadToggle(track, false);
            spreadHandle.classList.remove('spread-visible');
            isHandleDragging = false;
            spreadHandle.style.transform = 'none';
            spreadHandle.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }
    });

    window.addEventListener('mouseup', () => { 
        if (isHandleDragging) {
            isHandleDragging = false; 
            spreadHandle.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            spreadHandle.style.transform = 'none'; // Snap back
        }
    });

    // Touch support for Spread Handle
    spreadHandle.addEventListener('touchstart', (e) => { 
        handleStartY = e.touches[0].clientY; 
        spreadHandle.style.transition = 'none';
    });
    
    spreadHandle.addEventListener('touchmove', (e) => {
        const currentY = e.touches[0].clientY;
        const diff = handleStartY - currentY;
        const track = document.getElementById('data-panels-track');

        const offset = Math.max(-25, Math.min(25, diff * 0.4));
        spreadHandle.style.transform = `translateY(${-offset}px)`;

        if (diff > 40 && !track.classList.contains('spread-view')) {
            animateSpreadToggle(track, true);
            spreadHandle.classList.add('spread-visible');
            spreadHandle.style.transform = 'none';
        } else if (diff < -40 && track.classList.contains('spread-view')) {
            animateSpreadToggle(track, false);
            spreadHandle.classList.remove('spread-visible');
            spreadHandle.style.transform = 'none';
        }
    });

    spreadHandle.addEventListener('touchend', () => {
        spreadHandle.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });

    function switchState(targetContainer) {
        viewCategories.classList.add('hidden');
        viewAuth.classList.add('hidden');
        viewDetails.classList.add('hidden');
        targetContainer.classList.remove('hidden');
    }

    function resetToDefault() {
        switchState(viewCategories);
        activeCategory = null;
    }

    // 7. CREEPY SURVEILLANCE LOGIC
    const vignette = document.createElement('div');
    vignette.className = 'surveillance-vignette';
    document.body.appendChild(vignette);

    const flash = document.createElement('div');
    flash.className = 'glitch-flash';
    document.body.appendChild(flash);

    // Mouse Tracking: Tilt & Vignette
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);

        // Tilt Panels towards cursor (Attention Following)
        const tiltX = (y - 50) / 25; // max 2deg
        const tiltY = (x - 50) / 25;
        
        const leftPane = document.querySelector('.left-pane');
        const workspace = document.getElementById('workspace');
        
        if (window.innerWidth <= 850) {
            if (leftPane) leftPane.style.transform = '';
            if (workspace) workspace.style.transform = '';
            return;
        }

        if (leftPane) leftPane.style.transform = `rotateX(${-tiltX}deg) rotateY(${tiltY}deg)`;
        if (workspace) workspace.style.transform = `rotateX(${-tiltX * 0.5}deg) rotateY(${tiltY * 0.5}deg)`;

        // Anticipation Logic: Elements react BEFORE hover
        document.querySelectorAll('.category-card, .gate-node, .detail-pannel-box').forEach(el => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

            if (dist < 150 && dist > 50) {
                el.classList.add('anticipate'); // Reactive state before touch
            } else {
                el.classList.remove('anticipate');
            }
        });
    });

    // Random Focus Shifts & Jitters (System Feels Alive)
    function triggerSystemEvent() {
        const roll = Math.random();
        
        if (roll > 0.95) {
            // Control Override: Shift 3D Stack
            if (viewDetails.classList.contains('hidden') === false) {
                const track = document.getElementById('data-panels-track');
                if (track && !track.classList.contains('spread-view')) {
                    const event = new WheelEvent('wheel', { deltaX: 100 });
                    track.dispatchEvent(event);
                }
            }
        } else if (roll > 0.90) {
            // Glitch Flash
            flash.style.animation = 'glitch-short 0.2s linear';
            setTimeout(() => flash.style.animation = '', 200);
        } else if (roll > 0.85) {
            // Temporary Jitter
            document.body.classList.add('system-jitter');
            setTimeout(() => document.body.classList.remove('system-jitter'), 500);
        }

        setTimeout(triggerSystemEvent, Math.random() * 5000 + 2000);
    }
    triggerSystemEvent();

    // Hesitation Logic: Delayed Reactions
    document.querySelectorAll('button, .category-card').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e._processed) return; // CRITICAL FIX: Allow re-dispatched events to pass
            if (el.classList.contains('hesitation')) return;
            
            e.stopImmediatePropagation();
            e.preventDefault();
            
            el.classList.add('hesitation');
            
            // Simulating "System Hesitation"
            const delay = Math.random() * 600 + 400; // Increased delay for creepy effect
            setTimeout(() => {
                el.classList.remove('hesitation');
                // Re-trigger click event after hesitation
                const newClick = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                // Mark this click as processed
                newClick._processed = true;
                el.dispatchEvent(newClick);
            }, delay);
        }, true);
    });

    // Guard against recursion in hesitation
    document.addEventListener('click', (e) => {
        if (e._processed) return;
    }, true);

});
