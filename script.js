/* ============================================
   PIANO ALIMENTARE — Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initExpandables();
    initProgressBars();
    initTooltips();
    initNavbarShadow();
});

/* --- Navigation --- */
function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.section;

            // Update active nav button
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show target section with animation
            sections.forEach(s => {
                s.classList.remove('active');
                s.style.display = 'none';
            });

            const target = document.getElementById(targetId);
            if (target) {
                target.style.display = 'block';
                // Force reflow for animation
                void target.offsetWidth;
                target.classList.add('active');

                // Scroll to top of section
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }

            // Re-animate progress bars if showing numeri section
            if (targetId === 'numeri') {
                setTimeout(animateProgressBars, 200);
            }
        });
    });
}

/* --- Expandable Sections --- */
function initExpandables() {
    const expandables = document.querySelectorAll('[data-expandable]');

    expandables.forEach(item => {
        // Find the clickable header area (first child or specific header)
        const header = item.querySelector('.macro-header, .fodmap-cat-header, .breakfast-header, .day-header, .spesa-header, .step-header, .rule-header, .phase-header, .phase-header-card, .meal-body, .equip-header, .exercise-header, .prog-header, .trick-header');
        const detail = item.querySelector('.macro-detail');

        if (!header || !detail) return;

        // Make header clickable
        header.style.cursor = 'pointer';

        // Also make the whole item clickable for meal cards
        const clickTarget = item.classList.contains('meal-card') ? item : header;

        clickTarget.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleExpand(item, detail);
        });
    });
}

function toggleExpand(item, detail) {
    const isExpanded = item.classList.contains('expanded');

    if (isExpanded) {
        // Collapse
        item.classList.remove('expanded');
        detail.classList.remove('visible');
        detail.classList.add('hidden');
        
        // Haptic feedback on supported devices
        if (navigator.vibrate) navigator.vibrate(10);
    } else {
        // Expand
        item.classList.add('expanded');
        detail.classList.remove('hidden');
        detail.classList.add('visible');

        // Smooth scroll into view if needed
        setTimeout(() => {
            const rect = detail.getBoundingClientRect();
            if (rect.bottom > window.innerHeight) {
                detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 350);

        if (navigator.vibrate) navigator.vibrate(10);
    }
}

/* --- Progress Bars Animation --- */
function initProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    
    // Reset widths first
    progressFills.forEach(fill => {
        fill.dataset.targetWidth = fill.style.width;
        fill.style.width = '0%';
    });

    // Animate on load
    setTimeout(animateProgressBars, 500);
}

function animateProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    progressFills.forEach((fill, index) => {
        setTimeout(() => {
            fill.style.width = fill.dataset.targetWidth || fill.style.width;
        }, index * 150);
    });
}

/* --- Tooltips for mobile (tap to show) --- */
function initTooltips() {
    const tooltipItems = document.querySelectorAll('[data-tooltip]');

    tooltipItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Remove all other active tooltips
            tooltipItems.forEach(t => {
                if (t !== item) t.classList.remove('tooltip-active');
            });
            item.classList.toggle('tooltip-active');
        });
    });

    // Close tooltips when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!e.target.closest('[data-tooltip]')) {
            tooltipItems.forEach(t => t.classList.remove('tooltip-active'));
        }
    });
}

/* --- Navbar shadow on scroll (lightweight) --- */
function initNavbarShadow() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.pageYOffset > 10 ? '0 4px 20px rgba(0,0,0,0.25)' : 'none';
    }, { passive: true });
}
